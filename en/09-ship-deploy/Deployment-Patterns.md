> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Deployment Patterns

## Overview

Production deployment workflows and CI/CD best practices -- covering deployment strategies (rolling, blue-green, canary), Docker multi-stage builds for multiple languages, GitHub Actions pipelines, health checks, environment configuration, rollback strategies, and production readiness checklists.

## Deployment Strategies

| Strategy | How It Works | Pros | Cons | Best For |
|----------|-------------|------|------|----------|
| **Rolling** | Replace instances gradually | Zero downtime, gradual rollout | Two versions run simultaneously | Standard, backward-compatible changes |
| **Blue-Green** | Two identical environments, atomic traffic switch | Instant rollback, clean cutover | 2x infrastructure | Critical services, zero-tolerance |
| **Canary** | Route small % of traffic to new version first | Catches issues with real traffic | Requires traffic splitting + monitoring | High-traffic, risky changes |

## Multi-Stage Dockerfiles

### Node.js

```dockerfile
FROM node:22-alpine AS deps
COPY package.json package-lock.json ./
RUN npm ci --production=false

FROM node:22-alpine AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --production

FROM node:22-alpine AS runner
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001
USER appuser
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

### Go

```dockerfile
FROM golang:1.22-alpine AS builder
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /server ./cmd/server

FROM alpine:3.19 AS runner
RUN apk --no-cache add ca-certificates && adduser -D -u 1001 appuser
USER appuser
COPY --from=builder /server /server
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["/server"]
```

### Python/Django

```dockerfile
FROM python:3.12-slim AS builder
RUN pip install --no-cache-dir uv
COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

FROM python:3.12-slim AS runner
RUN useradd -r -u 1001 appuser
USER appuser
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . .
ENV PYTHONUNBUFFERED=1
HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health/')" || exit 1
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

## CI/CD Pipeline (GitHub Actions)

```yaml
name: CI/CD
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage

  build:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploying ${{ github.sha }}"
```

### Pipeline Stages

```
PR:   lint -> typecheck -> unit tests -> integration tests -> preview deploy
Main: lint -> typecheck -> unit tests -> integration tests -> build image -> staging -> smoke tests -> production
```

## Health Checks

### Endpoint Pattern

```typescript
// Simple
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Detailed (internal monitoring)
app.get("/health/detailed", async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    externalApi: await checkExternalApi(),
  };
  const allHealthy = Object.values(checks).every(c => c.status === "ok");
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "unknown",
    uptime: process.uptime(),
    checks,
  });
});
```

### Kubernetes Probes

| Probe | Path | Initial Delay | Period | Failure Threshold |
|-------|------|---------------|--------|-------------------|
| Liveness | /health | 10s | 30s | 3 |
| Readiness | /health | 5s | 10s | 2 |
| Startup | /health | 0s | 5s | 30 (150s max) |

## Environment Configuration (Twelve-Factor)

- All config via environment variables, never in code
- Validate at startup with schema (e.g., Zod) -- fail fast if config is wrong

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});
export const env = envSchema.parse(process.env);
```

## Rollback Strategy

```bash
kubectl rollout undo deployment/app    # Kubernetes
vercel rollback                        # Vercel
railway up --commit <previous-sha>     # Railway
npx prisma migrate resolve --rolled-back <migration-name>  # DB migration
```

## Production Readiness Checklist

### Application
- [ ] All tests pass (unit, integration, E2E)
- [ ] No hardcoded secrets
- [ ] Error handling covers edge cases
- [ ] Structured logging (JSON), no PII
- [ ] Health check endpoint returns meaningful status

### Infrastructure
- [ ] Docker image builds reproducibly (pinned versions)
- [ ] Environment variables documented and validated at startup
- [ ] Resource limits set (CPU, memory)
- [ ] Horizontal scaling configured
- [ ] SSL/TLS on all endpoints

### Monitoring
- [ ] Application metrics exported (request rate, latency, errors)
- [ ] Alerts for error rate thresholds
- [ ] Log aggregation (structured, searchable)
- [ ] Uptime monitoring on health endpoint

### Security
- [ ] Dependencies scanned for CVEs
- [ ] CORS configured for allowed origins only
- [ ] Rate limiting on public endpoints
- [ ] Auth verified
- [ ] Security headers (CSP, HSTS, X-Frame-Options)

### Operations
- [ ] Rollback plan documented and tested
- [ ] DB migration tested against production-sized data
- [ ] Runbook for common failure scenarios
- [ ] On-call rotation and escalation defined

> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Docker Patterns

## Overview

Docker and Docker Compose best practices for containerized development -- covering local dev stacks, multi-stage builds, networking, volume strategies, security hardening, and debugging.

## When to Use

- Setting up Docker Compose for local development
- Designing multi-container architectures
- Troubleshooting container networking or volume issues
- Reviewing Dockerfiles for security and image size
- Migrating from local dev to containerized workflow

## Standard Web App Stack (docker-compose.yml)

```yaml
services:
  app:
    build:
      context: .
      target: dev
    ports: ["3000:3000"]
    volumes:
      - .:/app                        # Bind mount for hot reload
      - /app/node_modules             # Anonymous volume preserves container deps
    environment:
      - DATABASE_URL=postgres://postgres:postgres@db:5432/app_dev
      - REDIS_URL=redis://redis:6379/0
      - NODE_ENV=development
    depends_on:
      db: { condition: service_healthy }
      redis: { condition: service_started }
    command: npm run dev

  db:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_dev
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redisdata:/data]

  mailpit:
    image: axllent/mailpit
    ports: ["8025:8025", "1025:1025"]

volumes:
  pgdata:
  redisdata:
```

## Multi-Stage Dockerfile

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --production

FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001
USER appuser
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

## Override Files

```bash
docker compose up                     # Dev (auto-loads override)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d  # Production
```

## Networking

- **Service discovery**: Services in the same Compose network resolve by service name
- **Custom networks**: Isolate frontend/backend (e.g., db only reachable from api)
- **Host-only binding**: `127.0.0.1:5432:5432` -- accessible only from host

## Volume Strategies

| Type | Use Case |
|------|----------|
| Named volume | Persistent data (database), managed by Docker |
| Bind mount | Source code for hot reload in development |
| Anonymous volume | Protect container-generated content (node_modules, .next) |

## Security

### Dockerfile Hardening

- Use specific version tags (never `:latest`)
- Run as non-root user
- Drop all capabilities, add only what's needed
- Use read-only root filesystem where possible
- Never store secrets in image layers

### Compose Security

```yaml
services:
  app:
    security_opt: [no-new-privileges:true]
    read_only: true
    tmpfs: [/tmp, /app/.cache]
    cap_drop: [ALL]
    cap_add: [NET_BIND_SERVICE]
```

### Secret Management

- Use `.env` files (gitignored) or Docker secrets (Swarm mode)
- Never hardcode secrets in docker-compose.yml or Dockerfile

## Debugging Commands

```bash
docker compose logs -f app            # Follow logs
docker compose exec app sh            # Shell into container
docker compose exec db psql -U postgres  # Connect to DB
docker compose ps                      # Running services
docker stats                           # Resource usage
docker compose up --build              # Rebuild images
docker compose down -v                 # Stop + remove volumes
```

## Anti-Patterns

- Using docker compose in production without orchestration (use K8s, ECS, or Swarm)
- Storing data without volumes (ephemeral containers lose data on restart)
- Running as root
- Using `:latest` tags
- One giant container with all services
- Putting secrets in docker-compose.yml

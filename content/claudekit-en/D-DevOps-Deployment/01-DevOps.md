> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: DevOps & Deployment

---
name: devops
description: Use when deploying and managing cloud infrastructure across Cloudflare, Docker, Google Cloud, and Kubernetes. Covers serverless edge computing, containerization, GCP services, K8s cluster management, Helm, GitOps, CI/CD, and security.
---

# DevOps

## Overview

Deploy and manage cloud infrastructure across Cloudflare, Docker, Google Cloud, and Kubernetes. Covers the full DevOps lifecycle from containerization to production deployment, monitoring, and security hardening.

## When to Use

- Deploying serverless applications to Cloudflare Workers/Pages
- Containerizing applications with Docker and Docker Compose
- Managing GCP resources via gcloud CLI (Cloud Run, GKE, Cloud SQL)
- Kubernetes cluster management (kubectl, Helm)
- GitOps workflows (Argo CD, Flux)
- CI/CD pipelines, multi-region deployments
- Security audits, RBAC, network policies

## Platform Selection

| Requirement | Recommended Choice |
|-------------|-------------------|
| Global sub-50ms latency | Cloudflare Workers |
| Large file storage (zero egress fees) | Cloudflare R2 |
| SQL database (global reads) | Cloudflare D1 |
| Containerized workloads | Docker + Cloud Run/GKE |
| Enterprise Kubernetes | GKE |
| Managed relational database | Cloud SQL |
| Static sites + API | Cloudflare Pages |
| Container orchestration | Kubernetes |
| K8s package management | Helm |

## Quick Start

```bash
# Cloudflare Worker
wrangler init my-worker && cd my-worker && wrangler deploy

# Docker
docker build -t myapp . && docker run -p 3000:3000 myapp

# GCP Cloud Run
gcloud run deploy my-service --image gcr.io/project/image --region us-central1

# Kubernetes
kubectl apply -f manifests/ && kubectl get pods
```

## Reference Documentation Navigation

### Cloudflare Platform
- `cloudflare-platform.md` -- Edge computing overview
- `cloudflare-workers-basics.md` -- Handler types, patterns
- `cloudflare-workers-advanced.md` -- Performance, optimization
- `cloudflare-workers-apis.md` -- Runtime APIs, bindings
- `cloudflare-r2-storage.md` -- Object storage, S3-compatible
- `cloudflare-d1-kv.md` -- D1 SQLite, KV key-value store
- `browser-rendering.md` -- Puppeteer automation

### Docker
- `docker-basics.md` -- Dockerfile, images, containers
- `docker-compose.md` -- Multi-container application orchestration

### Google Cloud
- `gcloud-platform.md` -- gcloud CLI, authentication
- `gcloud-services.md` -- Compute Engine, GKE, Cloud Run

### Kubernetes
- `kubernetes-basics.md` -- Core concepts, architecture, workloads
- `kubernetes-kubectl.md` -- Common commands, debugging workflows
- `kubernetes-helm.md` / `kubernetes-helm-advanced.md` -- Helm charts, templating
- `kubernetes-security.md` / `kubernetes-security-advanced.md` -- RBAC, secrets management
- `kubernetes-workflows.md` / `kubernetes-workflows-advanced.md` -- GitOps, CI/CD
- `kubernetes-troubleshooting.md` / `kubernetes-troubleshooting-advanced.md` -- Troubleshooting

### Scripts
- `scripts/cloudflare-deploy.py` -- Automated Worker deployment
- `scripts/docker-optimize.py` -- Dockerfile analysis and optimization

## Best Practices

**Security:** Run containers as non-root, RBAC access control, store secrets in environment variables, scan images for vulnerabilities

**Performance:** Multi-stage builds, edge caching, resource limits

**Cost:** Use R2 for high-egress scenarios, enable caching, right-size resource allocation

**Development:** Docker Compose for local development, wrangler dev for local debugging, version control Infrastructure as Code (IaC)

## Resources

- Cloudflare: https://developers.cloudflare.com
- Docker: https://docs.docker.com
- GCP: https://cloud.google.com/docs
- Kubernetes: https://kubernetes.io/docs
- Helm: https://helm.sh/docs

> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Backend Development

---
name: backend-development
description: Use when building production-ready backend systems. Covers API design (REST/GraphQL/gRPC), authentication, database optimization, caching, security (OWASP Top 10), microservices, testing, CI/CD, and monitoring with modern technologies and proven patterns.
---

# Backend Development

## Overview

Build production-ready backend systems using modern technologies, best practices, and proven patterns. Covers the full backend stack from API design to deployment, with emphasis on security, performance, and maintainability.

## When to Use

- Designing RESTful, GraphQL, or gRPC APIs
- Building authentication/authorization systems
- Optimizing database queries and schema design
- Implementing caching and performance optimization
- OWASP Top 10 security hardening
- Designing scalable microservices
- Testing strategies (unit, integration, E2E)
- CI/CD pipelines and deployment
- Monitoring and debugging production systems

## Technology Selection Guide

**Languages:** Node.js/TypeScript (full-stack), Python (data/ML), Go (high concurrency), Rust (extreme performance)
**Frameworks:** NestJS, FastAPI, Django, Express, Gin
**Databases:** PostgreSQL (ACID transactions), MongoDB (flexible schema), Redis (caching)
**API Styles:** REST (simple), GraphQL (flexible), gRPC (high performance)

See: `references/backend-technologies.md` for detailed technology comparisons

## Reference Documentation Navigation

**Core Technologies:**
- `backend-technologies.md` -- Languages, frameworks, databases, message queues, ORMs
- `backend-api-design.md` -- REST, GraphQL, gRPC patterns and best practices

**Security & Authentication:**
- `backend-security.md` -- OWASP Top 10 2025, security best practices, input validation
- `backend-authentication.md` -- OAuth 2.1, JWT, RBAC, MFA, session management

**Performance & Architecture:**
- `backend-performance.md` -- Caching, query optimization, load balancing, scaling strategies
- `backend-architecture.md` -- Microservices, event-driven architecture, CQRS, Saga pattern

**Quality & Operations:**
- `backend-testing.md` -- Testing strategies, frameworks, tools, CI/CD testing
- `backend-code-quality.md` -- SOLID principles, design patterns, clean code
- `backend-devops.md` -- Docker, Kubernetes, deployment strategies, monitoring
- `backend-debugging.md` -- Debugging strategies, profiling, logging, production debugging
- `backend-mindset.md` -- Problem-solving mindset, architectural thinking, collaboration

## Key Best Practices (2025)

**Security:** Argon2id password hashing, parameterized queries (98% SQL injection reduction), OAuth 2.1 + PKCE, rate limiting, security headers

**Performance:** Redis caching (90% database load reduction), database indexing (30% I/O reduction), CDN (50%+ latency reduction), connection pooling

**Testing:** 70-20-10 testing pyramid (unit-integration-E2E), Vitest 50% faster than Jest, contract testing for microservices, 83% of database migrations fail without tests

**DevOps:** Blue-green/canary deployments, feature flags (90% incident reduction), Kubernetes 84% adoption, Prometheus/Grafana monitoring, OpenTelemetry tracing

## Quick Decision Matrix

| Requirement | Recommended Choice |
|-------------|-------------------|
| Rapid development | Node.js + NestJS |
| Data/ML integration | Python + FastAPI |
| High concurrency | Go + Gin |
| Extreme performance | Rust + Axum |
| ACID transactions | PostgreSQL |
| Flexible schema | MongoDB |
| Caching | Redis |
| Internal service communication | gRPC |
| Public API | GraphQL / REST |
| Real-time event streaming | Kafka |

## Implementation Checklists

**API:** Choose style -> Design schema -> Input validation -> Add authentication -> Rate limiting -> Documentation -> Error handling

**Database:** Choose database -> Design schema -> Create indexes -> Connection pooling -> Migration strategy -> Backup/restore -> Performance testing

**Security:** OWASP Top 10 -> Parameterized queries -> OAuth 2.1 + JWT -> Security headers -> Rate limiting -> Input validation -> Argon2id password hashing

**Testing:** Unit tests 70% -> Integration tests 20% -> E2E tests 10% -> Load testing -> Migration testing -> Contract testing (microservices)

**Deployment:** Docker -> CI/CD -> Blue-green/canary deployment -> Feature flags -> Monitoring -> Logging -> Health checks

## Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OAuth 2.1: https://oauth.net/2.1/
- OpenTelemetry: https://opentelemetry.io/

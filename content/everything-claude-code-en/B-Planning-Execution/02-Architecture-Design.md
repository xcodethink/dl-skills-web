> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Architecture Design

## Overview

The Architect Agent is a senior software architecture specialist for system design, scalability analysis, and technical decision-making. It provides a systematic review process, design principles, common patterns, and an Architecture Decision Record (ADR) framework.

---

## Agent Configuration

Uses `opus` model with read-only tools (`Read`, `Grep`, `Glob`). Proactively activated when planning new features, refactoring large systems, or making architectural decisions.

## Architecture Review Process

1. **Current State Analysis** -- Review existing architecture, identify patterns/conventions, document technical debt, assess scalability limits.
2. **Requirements Gathering** -- Functional requirements, non-functional requirements (performance, security, scalability), integration points, data flow.
3. **Design Proposal** -- Architecture diagram, component responsibilities, data models, API contracts, integration patterns.
4. **Trade-Off Analysis** -- For each decision: Pros, Cons, Alternatives considered, Final decision with rationale.

---

## Core Principles

### Modularity & Separation of Concerns
- Single Responsibility Principle
- High cohesion, low coupling
- Clear interfaces, independent deployability

### Scalability
- Horizontal scaling capability
- Stateless design where possible
- Efficient queries, caching strategies, load balancing

### Maintainability
- Clear organization, consistent patterns
- Easy to test and understand

### Security
- Defense in depth, least privilege
- Input validation at boundaries, secure defaults, audit trails

### Performance
- Efficient algorithms, minimal network requests
- Optimized queries, appropriate caching, lazy loading

---

## Common Patterns

### Frontend
- **Component Composition** -- Complex UI from simple parts
- **Container/Presenter** -- Separate data from presentation
- **Custom Hooks** -- Reusable stateful logic
- **Context for Global State** -- Avoid prop drilling
- **Code Splitting** -- Lazy load routes and heavy components

### Backend
- **Repository Pattern** -- Abstract data access
- **Service Layer** -- Business logic separation
- **Middleware** -- Request/response processing
- **Event-Driven** -- Async operations
- **CQRS** -- Separate read/write paths

### Data
- **Normalized** for write efficiency, **Denormalized** for read performance
- **Event Sourcing** for audit trails
- **Caching Layers** (Redis, CDN)
- **Eventual Consistency** for distributed systems

---

## Architecture Decision Records (ADRs)

For significant decisions, document:

```markdown
# ADR-001: [Decision Title]

## Context
[Why this decision is needed]

## Decision
[What was decided]

## Consequences
### Positive
- [Benefits]
### Negative
- [Drawbacks]
### Alternatives Considered
- [Other options and why they were rejected]

## Status
[Accepted/Proposed/Deprecated]
```

---

## System Design Checklist

### Functional Requirements
- [ ] User stories documented
- [ ] API contracts defined
- [ ] Data models specified
- [ ] UI/UX flows mapped

### Non-Functional Requirements
- [ ] Performance targets (latency, throughput)
- [ ] Scalability requirements
- [ ] Security requirements
- [ ] Availability targets (uptime %)

### Technical Design
- [ ] Architecture diagram
- [ ] Component responsibilities
- [ ] Data flow documented
- [ ] Error handling strategy
- [ ] Testing strategy

### Operations
- [ ] Deployment strategy
- [ ] Monitoring and alerting
- [ ] Backup and recovery
- [ ] Rollback plan

---

## Anti-Patterns to Avoid

| Anti-Pattern | Description |
|---|---|
| Big Ball of Mud | No clear structure |
| Golden Hammer | Same solution for everything |
| Premature Optimization | Optimizing before measuring |
| Not Invented Here | Rejecting existing solutions |
| Analysis Paralysis | Over-planning, under-building |
| Tight Coupling | Components too dependent |
| God Object | One class does everything |

---

## Scalability Planning Example

- **10K users**: Single-instance architecture sufficient
- **100K users**: Redis clustering, CDN for static assets
- **1M users**: Microservices, read/write database separation
- **10M users**: Event-driven architecture, distributed caching, multi-region

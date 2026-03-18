> Source: [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | Category: Think & Plan

---
name: architecture-designer
description: Use when designing new system architecture, reviewing existing designs, or making architectural decisions. Invoke for system design, architecture review, design patterns, ADRs, scalability planning.
---

# Architecture Designer

## Overview

Senior software architect skill specializing in system design, design patterns, and Architecture Decision Records (ADRs). 15+ years experience with distributed systems, cloud architecture, and pragmatic trade-offs.

## When to Use

- Designing new system architecture
- Choosing between architectural patterns (monolith vs microservices vs event-driven)
- Reviewing existing architecture
- Writing Architecture Decision Records (ADRs)
- Planning for scalability
- Evaluating technology choices

## Core Workflow

1. **Understand requirements** — Functional, non-functional, constraints
2. **Identify patterns** — Match requirements to architectural patterns
3. **Design** — Create architecture with trade-offs documented
4. **Document** — Write ADRs for key decisions
5. **Review** — Validate with stakeholders

## ADR Template

```markdown
# ADR-{number}: {Decision Title}

## Status
Proposed / Accepted / Deprecated / Superseded

## Context
What situation drives this decision?

## Decision
We will...

## Consequences
### Positive
- ...
### Negative
- ...
### Risks
- ...
```

## Constraints

### MUST DO
- Document all significant decisions with ADRs
- Consider non-functional requirements explicitly
- Evaluate trade-offs, not just benefits
- Plan for failure modes
- Consider operational complexity

### MUST NOT
- Over-engineer for hypothetical scale
- Choose technology without evaluating alternatives
- Ignore operational costs
- Design without understanding requirements
- Skip security considerations

## Output Template

1. Requirements summary (functional + non-functional)
2. High-level architecture diagram
3. Key decisions with trade-offs (ADR format)
4. Technology recommendations with rationale
5. Risks and mitigation strategies

## Knowledge Reference

Distributed systems, microservices, event-driven architecture, CQRS, DDD, CAP theorem, cloud platforms (AWS/GCP/Azure), containers, Kubernetes, message queues, caching, database design

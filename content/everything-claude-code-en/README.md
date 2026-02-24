# everything-claude-code Curated English Edition

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> Author: Affaan Mustafa (Anthropic x Cerebral Valley Hackathon Winner)
> Curated: 2026-02-21

## Overview

A complete Claude Code software engineering workflow system. Through modular Skills, automated Hook pipelines, layered Agent architecture, and structured Rules, it elevates Claude Code from a conversational coding tool to a disciplined, memory-capable, cost-aware automated development workflow.

**Scale**: 13 Agents + 27 Rules + 32 Commands + 45 Skills + 2 Guides
**Languages**: TypeScript, Python, Go, Java, C++, Swift, SQL
**Frameworks**: React, Django, Spring Boot, Next.js, Playwright

## Index

### [A-Core-Methodology](A-Core-Methodology/) (7 files)

Foundational disciplines for how Claude Code thinks, verifies, and learns.

| File | Core Concept |
|------|-------------|
| [01-Test-Driven-Development](A-Core-Methodology/01-Test-Driven-Development.md) | Red-Green-Refactor, 80%+ coverage |
| [02-Verification-Loop](A-Core-Methodology/02-Verification-Loop.md) | 6-stage: Build→Types→Lint→Tests→Security→Diff |
| [03-Continuous-Learning](A-Core-Methodology/03-Continuous-Learning.md) | Cross-session knowledge with confidence scoring |
| [04-Eval-Driven-Development](A-Core-Methodology/04-Eval-Driven-Development.md) | pass@k / pass^k metrics |
| [05-Strategic-Compaction](A-Core-Methodology/05-Strategic-Compaction.md) | Manual compaction at logical boundaries |
| [06-Search-First-Workflow](A-Core-Methodology/06-Search-First-Workflow.md) | Research before coding |
| [07-Iterative-Retrieval](A-Core-Methodology/07-Iterative-Retrieval.md) | 4-stage progressive context refinement |

### [B-Planning-Execution](B-Planning-Execution/) (5 files)

Full workflow from planning through execution, including multi-model collaboration.

| File | Core Concept |
|------|-------------|
| [01-Implementation-Planning](B-Planning-Execution/01-Implementation-Planning.md) | Plan first, code after confirmation |
| [02-Architecture-Design](B-Planning-Execution/02-Architecture-Design.md) | ADR templates, trade-off analysis |
| [03-Agent-Orchestration](B-Planning-Execution/03-Agent-Orchestration.md) | Declarative agent pipelines |
| [04-Multi-Model-Collaboration](B-Planning-Execution/04-Multi-Model-Collaboration.md) | Codex + Gemini + Claude collaboration |
| [05-Checkpoint-Management](B-Planning-Execution/05-Checkpoint-Management.md) | Git-based workflow snapshots |

### [C-Code-Quality](C-Code-Quality/) (4 files)

Code review, refactoring, standards, and build error resolution.

| File | Core Concept |
|------|-------------|
| [01-Code-Review](C-Code-Quality/01-Code-Review.md) | Confidence filtering (>80%), severity-based |
| [02-Refactoring-Cleanup](C-Code-Quality/02-Refactoring-Cleanup.md) | Tool-driven dead code detection, risk grading |
| [03-Coding-Standards](C-Code-Quality/03-Coding-Standards.md) | Immutability as CRITICAL, KISS/DRY/YAGNI |
| [04-Build-Error-Resolution](C-Code-Quality/04-Build-Error-Resolution.md) | Minimal diff strategy, 10 common error patterns |

### [D-Testing-Strategy](D-Testing-Strategy/) (7 files)

Multi-language testing frameworks and best practices.

| File | Core Concept |
|------|-------------|
| [01-E2E-Testing](D-Testing-Strategy/01-E2E-Testing.md) | Playwright + Agent Browser, POM pattern |
| [02-Test-Coverage](D-Testing-Strategy/02-Test-Coverage.md) | Gap analysis + auto-generation |
| [03-Python-Testing](D-Testing-Strategy/03-Python-Testing.md) | pytest + Fixtures + Mock |
| [04-Go-Testing](D-Testing-Strategy/04-Go-Testing.md) | Table-driven + race detection + Fuzzing |
| [05-Cpp-Testing](D-Testing-Strategy/05-Cpp-Testing.md) | GoogleTest + Sanitizers + Fuzzing |
| [06-Django-TDD](D-Testing-Strategy/06-Django-TDD.md) | pytest-django + factory_boy |
| [07-SpringBoot-TDD](D-Testing-Strategy/07-SpringBoot-TDD.md) | JUnit 5 + Mockito + Testcontainers |

### [E-Security](E-Security/) (6 files)

Multi-layer security from code to infrastructure.

| File | Core Concept |
|------|-------------|
| [01-Security-Review](E-Security/01-Security-Review.md) | OWASP Top 10 + financial/blockchain security |
| [02-AgentShield-Audit](E-Security/02-AgentShield-Audit.md) | Scan Claude configs for vulnerabilities |
| [03-Cloud-Infrastructure-Security](E-Security/03-Cloud-Infrastructure-Security.md) | IAM/secrets/network/logging/CDN/WAF |
| [04-Django-Security](E-Security/04-Django-Security.md) | CSRF/XSS/SQL injection/RBAC/CSP |
| [05-SpringBoot-Security](E-Security/05-SpringBoot-Security.md) | JWT/OAuth2/Spring Security |
| [06-Language-Security-Rules](E-Security/06-Language-Security-Rules.md) | Per-language security checks + tooling |

### [F-Toolchain-Automation](F-Toolchain-Automation/) (9 files)

Development infrastructure configuration and automation.

| File | Core Concept |
|------|-------------|
| [01-Git-Workflow](F-Toolchain-Automation/01-Git-Workflow.md) | Conventional Commits + Agent integration |
| [02-Hook-System](F-Toolchain-Automation/02-Hook-System.md) | 3-layer quality net: prevent→fix→audit |
| [03-MCP-Configuration](F-Toolchain-Automation/03-MCP-Configuration.md) | 15 MCP server templates |
| [04-PM2-Process-Management](F-Toolchain-Automation/04-PM2-Process-Management.md) | Auto-detect services, generate config |
| [05-Package-Manager-Setup](F-Toolchain-Automation/05-Package-Manager-Setup.md) | npm/pnpm/yarn/bun auto-detection |
| [06-Session-Management](F-Toolchain-Automation/06-Session-Management.md) | Session list/load/alias/stats |
| [07-Documentation-Codemaps](F-Toolchain-Automation/07-Documentation-Codemaps.md) | AST analysis + dependency mapping |
| [08-Docker-Patterns](F-Toolchain-Automation/08-Docker-Patterns.md) | Compose dev patterns, networking, security |
| [09-Deployment-Patterns](F-Toolchain-Automation/09-Deployment-Patterns.md) | Rolling/blue-green/canary + CI/CD |

### [G-Language-Framework](G-Language-Framework/) (11 files)

Coding patterns and best practices for 7 languages and 5 frameworks.

| File | Core Concept |
|------|-------------|
| [01-TypeScript-Patterns](G-Language-Framework/01-TypeScript-Patterns.md) | Zod validation, immutable spread, Prettier |
| [02-Python-Patterns](G-Language-Framework/02-Python-Patterns.md) | Protocol, Dataclass, PEP 8 |
| [03-Go-Patterns](G-Language-Framework/03-Go-Patterns.md) | Functional Options, small interfaces, goroutine safety |
| [04-Java-Standards](G-Language-Framework/04-Java-Standards.md) | Java 17+ Records, Optional, Streams |
| [05-Cpp-Standards](G-Language-Framework/05-Cpp-Standards.md) | RAII, Concepts, Core Guidelines |
| [06-Swift-Patterns](G-Language-Framework/06-Swift-Patterns.md) | Actor thread safety, Protocol DI |
| [07-React-Frontend](G-Language-Framework/07-React-Frontend.md) | Composition, compound components, a11y |
| [08-Django-Patterns](G-Language-Framework/08-Django-Patterns.md) | DRF ViewSets, service layer, signals |
| [09-SpringBoot-Patterns](G-Language-Framework/09-SpringBoot-Patterns.md) | Layered architecture, JPA/Hibernate |
| [10-API-Backend-Design](G-Language-Framework/10-API-Backend-Design.md) | REST conventions, repository pattern, caching |
| [11-Context-Modes](G-Language-Framework/11-Context-Modes.md) | Dev/Research/Review mode switching |

### [H-Database](H-Database/) (4 files)

Database selection, optimization, and migration patterns.

| File | Core Concept |
|------|-------------|
| [01-PostgreSQL-Patterns](H-Database/01-PostgreSQL-Patterns.md) | Index strategies, RLS optimization, SKIP LOCKED |
| [02-ClickHouse-Analytics](H-Database/02-ClickHouse-Analytics.md) | MergeTree, materialized views, ETL/CDC |
| [03-JPA-Hibernate-Patterns](H-Database/03-JPA-Hibernate-Patterns.md) | N+1 prevention, transactions, connection pooling |
| [04-Database-Migrations](H-Database/04-Database-Migrations.md) | Expand-contract zero-downtime migration |

### [I-Meta-Skills](I-Meta-Skills/) (9 files)

How to create skills, optimize costs, and manage Claude Code itself.

| File | Core Concept |
|------|-------------|
| [01-Skill-Creation](I-Meta-Skills/01-Skill-Creation.md) | Extract coding patterns from git history |
| [02-Performance-Token-Optimization](I-Meta-Skills/02-Performance-Token-Optimization.md) | Model selection strategy, context window management |
| [03-Cost-Aware-LLM-Pipeline](I-Meta-Skills/03-Cost-Aware-LLM-Pipeline.md) | Route Haiku/Sonnet/Opus by complexity |
| [04-Regex-vs-LLM-Framework](I-Meta-Skills/04-Regex-vs-LLM-Framework.md) | 95-98% of cases use regex |
| [05-Content-Hash-Cache](I-Meta-Skills/05-Content-Hash-Cache.md) | SHA-256 path-independent cache |
| [06-Claude-Code-Longform-Guide](I-Meta-Skills/06-Claude-Code-Longform-Guide.md) | Token economics, memory persistence |
| [07-Claude-Code-Shortform-Guide](I-Meta-Skills/07-Claude-Code-Shortform-Guide.md) | Hook/Skill/MCP basics |
| [08-Common-Design-Patterns](I-Meta-Skills/08-Common-Design-Patterns.md) | Skeleton project strategy, Repository pattern |
| [09-Document-Processing](I-Meta-Skills/09-Document-Processing.md) | PDF/DOCX/OCR/PII redaction |

## Analysis

For full classification analysis and dedup comparison, see the [Analysis Report](Analysis-Report.md).

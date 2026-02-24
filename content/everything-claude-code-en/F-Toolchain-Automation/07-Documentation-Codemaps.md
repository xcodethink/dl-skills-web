> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Documentation and Codemaps

## Overview

The doc-updater agent maintains code maps and documentation in sync with the actual codebase. This guide consolidates three components: the agent definition, the codemap generation workflow, and the documentation update workflow.

---

## Part 1: doc-updater Agent

**Config:** `name: doc-updater | model: haiku | tools: Read, Write, Edit, Bash, Grep, Glob`

### Core Responsibilities

1. **Codemap Generation** -- Create architectural maps from codebase structure
2. **Documentation Updates** -- Refresh READMEs and guides from code
3. **AST Analysis** -- Use TypeScript compiler API to understand structure
4. **Dependency Mapping** -- Track imports/exports across modules
5. **Documentation Quality** -- Ensure docs match reality

### Key Principles

- **Single Source of Truth** -- Generate from code, never manually write
- **Freshness Timestamps** -- Always include last updated date
- **Token Efficiency** -- Keep codemaps under 500 lines
- **Actionable** -- Include setup commands that actually work
- **Cross-reference** -- Link related documentation

### When to Update

**Always:** New major features, API route changes, dependency changes, architecture changes, setup process modifications.

**Optional:** Minor bug fixes, cosmetic changes, internal refactoring.

---

## Part 2: Codemap Generation

### Step 1: Scan Project

1. Identify project type (monorepo, single app, library, microservice)
2. Find all source directories (src/, lib/, app/, packages/)
3. Map entry points (main.ts, index.ts, app.py, main.go, etc.)

### Step 2: Generate Codemaps

Output to `docs/CODEMAPS/` or `.reports/codemaps/`:

| File | Contents |
|------|----------|
| `architecture.md` | High-level system diagram, service boundaries, data flow |
| `backend.md` | API routes, middleware chain, service-to-repository mapping |
| `frontend.md` | Page tree, component hierarchy, state management flow |
| `data.md` | Database tables, relationships, migration history |
| `dependencies.md` | External services, third-party integrations, shared libraries |

### Codemap Format (Token-Lean)

```markdown
# Backend Architecture

## Routes
POST /api/users -> UserController.create -> UserService.create -> UserRepo.insert
GET  /api/users/:id -> UserController.get -> UserService.findById -> UserRepo.findById

## Key Files
src/services/user.ts (business logic, 120 lines)
src/repos/user.ts (database access, 80 lines)

## Dependencies
- PostgreSQL (primary data store)
- Redis (session cache, rate limiting)
```

### Step 3: Diff Detection

- If changes > 30%, show diff and request approval before overwriting
- If changes <= 30%, update in place

### Step 4: Metadata Header

```markdown
<!-- Generated: 2026-02-11 | Files scanned: 142 | Token estimate: ~800 -->
```

### Tips

- Focus on high-level structure, not implementation details
- Prefer file paths and function signatures over full code blocks
- Keep each codemap under 1000 tokens
- Use ASCII diagrams for data flow
- Run after major features or refactoring sessions

---

## Part 3: Documentation Updates

### Sources of Truth

| Source | Generates |
|--------|-----------|
| `package.json` scripts | Available commands reference |
| `.env.example` | Environment variable documentation |
| `openapi.yaml` / route files | API endpoint reference |
| Source code exports | Public API documentation |
| `Dockerfile` / `docker-compose.yml` | Infrastructure setup docs |

### Generated Artifacts

1. **Script Reference** -- Table of all commands from package.json/Makefile/pyproject.toml
2. **Environment Docs** -- Variables categorized as required vs optional with formats and examples
3. **Contributing Guide** -- Setup, scripts, testing, code style, PR checklist
4. **Runbook** -- Deployment procedures, health checks, common issues, rollback, escalation

### Staleness Check

Find docs not modified in 90+ days, cross-reference with recent code changes, flag for manual review.

### Rules

- **Single source of truth**: Always generate from code
- **Preserve manual sections**: Only update generated sections
- **Mark generated content**: Use `<!-- AUTO-GENERATED -->` markers
- **Don't create docs unprompted**: Only when explicitly requested

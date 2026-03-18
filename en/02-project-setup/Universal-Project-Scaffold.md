> Source: DL Skills Curated | Category: Project Setup

---
name: universal-project-scaffold
description: Cross-stack best practices for project initialization and directory structure
---

# Universal Project Scaffold

## Overview

The first step of any project is not writing business logic -- it is setting up infrastructure. A repo without `.gitignore`, a codebase without linting, a project without a test directory -- these problems grow more expensive the longer you wait. This skill provides a technology-agnostic project initialization checklist.

## Standard Directory Structure

```
project-root/
├── src/              # Source code
├── tests/            # Test files, mirrors src/ structure
├── docs/             # Documentation
├── scripts/          # Build, deploy, migration scripts
├── .github/          # GitHub Actions workflows
│   └── workflows/
├── .gitignore
├── .editorconfig
├── .env.example      # Env var template (no real secrets)
├── README.md
├── LICENSE
└── Makefile          # Common command entry point (optional)
```

## Essential Config Files

| File | Purpose | Notes |
|------|---------|-------|
| `.gitignore` | Exclude build artifacts, deps, secrets | Generate base via gitignore.io, customize per stack |
| `.editorconfig` | Unify indentation, line endings, charset | Works across editors, required for team collaboration |
| `README.md` | Overview, install, run, contribute | Must contain at least install and run sections |
| `LICENSE` | Legal permission | MIT (permissive), Apache 2.0 (patent), GPL (copyleft) |
| `.env.example` | Environment variable template | List all required vars with placeholder values |

## Linting & Formatting

| Stack | Formatter | Linter | Notes |
|-------|-----------|--------|-------|
| JavaScript / TypeScript | Prettier | ESLint (flat config) | Use `eslint.config.js` |
| Python | ruff format | ruff check | Replaces flake8 + black + isort |
| Go | gofmt | golangci-lint | Zero-config built-in |
| Rust | rustfmt | clippy | Integrated via cargo subcommands |

## CI Template (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup  # Choose Node / Python / Go per your stack
      - name: Install dependencies
      - name: Lint
      - name: Test
```

Key principle: the very first commit should include CI config, even if it only runs lint.

## Pre-commit Hooks

1. Install: `pip install pre-commit` or `brew install pre-commit`
2. Create `.pre-commit-config.yaml`
3. Run `pre-commit install` to activate
4. Recommended hooks: `trailing-whitespace`, `end-of-file-fixer`, `detect-secrets`, `check-merge-conflict`

## Environment Variable Management

```bash
# .env.example -- copy to .env and fill in real values
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
API_KEY=your-api-key-here
DEBUG=false
```

Rules:
1. Create `.env.example` listing all required variables with sample values
2. Add `.env` to `.gitignore` -- never commit real secrets
3. Startup scripts must validate required variables exist, fail fast if missing
4. Document the purpose and source of each variable

## Decision Matrix: Monorepo vs Polyrepo

| Dimension | Monorepo | Polyrepo |
|-----------|----------|----------|
| Best for | Shared code across packages, unified releases | Independent services, separate deploy cycles |
| Dependency management | Internal deps sync instantly | Decoupled via version numbers |
| CI complexity | Needs incremental builds | Independent CI per repo, simple |
| Tooling required | Turborepo / Nx / pnpm workspace | Standard Git workflow |
| Recommended for | Component libraries, full-stack apps | Microservices, cross-team collaboration |

## Workflow

1. Create project skeleton using a scaffold tool or template repo
2. Configure `.gitignore`, `.editorconfig`, `LICENSE`
3. Set up linter + formatter and write config files
4. Create `.env.example` defining all environment variables
5. Configure pre-commit hooks and run `pre-commit install`
6. Write minimal CI workflow (at least lint + test)
7. Complete `README.md` (install, run, contribute)
8. Make initial commit, verify CI passes

## MUST DO

- Include `.gitignore` and `README.md` in the very first commit
- Configure at least one linter and add it to CI
- Create a `tests/` directory, even if empty initially
- Provide `.env.example` so new contributors do not have to guess configs
- Commit lock files (`package-lock.json`, `uv.lock`, etc.) for reproducible builds

## MUST NOT DO

- Never commit `.env`, secret files, `node_modules`, or `__pycache__` to version control
- Never skip `.gitignore` -- "I'll add it later" means never
- Never manage dependencies without a lock file
- Never start multi-person collaboration without a formatter config
- Never postpone CI config to "later"

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| No `.gitignore` | `node_modules` committed, repo bloats | Add immediately, clean with `git rm -r --cached` |
| No linter config | Inconsistent style, PRs devolve into formatting debates | Pick one tool, configure it, enforce for everyone |
| No `tests/` directory | Signals "this project doesn't need tests" | Create the dir + write one smoke test |
| `.env` committed | Secrets leaked into git history, extremely hard to remove | Clean with `git filter-branch` or BFG |
| No README | In 3 months, even you won't remember how to run it | Write it now -- 5 minutes saves 5 hours |

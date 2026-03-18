# Language Security Rules

> **Source**: [affaan-m/everything-claude-code](https://github.com/AffaanM/everything-claude-code)
> **Original files**: rules/typescript/security.md + rules/python/security.md + rules/golang/security.md
> **Category**: E-Security

---

## Overview

Consolidated security rules for TypeScript/JavaScript, Python, and Go. These extend the common security guidelines with language-specific practices.

---

## TypeScript/JavaScript Security

> Applies to: `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`

### Secret Management

```typescript
// NEVER: Hardcoded
const apiKey = "sk-proj-xxxxx"

// ALWAYS: Environment variables with validation
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) throw new Error('OPENAI_API_KEY not configured')
```

### Key Practices

- Use `eslint-plugin-security` for static analysis
- Validate input with Zod schemas
- Use parameterized queries or ORMs for database access
- Sanitize HTML with DOMPurify
- Run `npm audit` regularly; commit lock files
- Use **security-reviewer** skill for comprehensive audits

---

## Python Security

> Applies to: `**/*.py`, `**/*.pyi`

### Secret Management

```python
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ["OPENAI_API_KEY"]  # Raises KeyError if missing
```

### Key Practices

- Use **bandit** for static security analysis: `bandit -r src/`
- Validate input with Pydantic
- Use Django ORM or SQLAlchemy (never concatenate SQL)
- Run `pip audit` or `safety check` for dependency vulnerabilities
- See `django-security` skill for Django-specific guidelines

---

## Go Security

> Applies to: `**/*.go`, `**/go.mod`, `**/go.sum`

### Secret Management

```go
apiKey := os.Getenv("OPENAI_API_KEY")
if apiKey == "" {
    log.Fatal("OPENAI_API_KEY not configured")
}
```

### Context & Timeouts

Always use `context.Context` for timeout control:

```go
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()
```

### Key Practices

- Use **gosec** for static security analysis: `gosec ./...`
- Use parameterized queries (`$1`, `$2`) for database access
- Always check errors; never ignore return values
- Use `govulncheck` for dependency vulnerability scanning
- All network calls must use `context.Context` with timeouts

---

## Common Rules (All Languages)

### Pre-Commit Checks

- No hardcoded secrets (API keys, passwords, tokens)
- All user inputs validated
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized HTML)
- CSRF protection enabled
- Authentication/authorization verified
- Rate limiting on all endpoints
- Error messages don't leak sensitive data

### Secret Management

- Never hardcode secrets in source code
- Always use environment variables or a secret manager
- Validate required secrets at startup
- Rotate any potentially exposed secrets

### Security Response Protocol

1. STOP immediately
2. Use **security-reviewer** agent
3. Fix CRITICAL issues before continuing
4. Rotate exposed secrets
5. Review entire codebase for similar issues

---

## Quick Reference

| Language | Static Analysis | Dependency Audit | Secret Loading |
|----------|----------------|-----------------|----------------|
| TypeScript/JS | `eslint-plugin-security` | `npm audit` | `process.env` |
| Python | `bandit` | `pip audit` / `safety` | `os.environ` / `dotenv` |
| Go | `gosec` | `govulncheck` | `os.Getenv` |

# Security Review

> **Source**: [affaan-m/everything-claude-code](https://github.com/AffaanM/everything-claude-code)
> **Original files**: agents/security-reviewer.md + skills/security-review/SKILL.md + rules/common/security.md
> **Category**: E-Security

---

## Overview

A comprehensive security review skill covering OWASP Top 10 vulnerability detection, secrets scanning, input validation, authentication/authorization auditing, and secure coding enforcement. Should be run proactively after writing code that handles user input, authentication, API endpoints, or sensitive data.

---

## Security Reviewer Agent

### Core Responsibilities

1. **Vulnerability Detection** — OWASP Top 10 and common security issues
2. **Secrets Detection** — Hardcoded API keys, passwords, tokens
3. **Input Validation** — Proper sanitization of all user inputs
4. **Authentication/Authorization** — Access control verification
5. **Dependency Security** — Vulnerable package detection
6. **Secure Coding Patterns** — Enforcement of best practices

### Review Workflow

**Step 1: Initial Scan**
- Run `npm audit`, `eslint-plugin-security`, search for hardcoded secrets
- Review high-risk areas: auth, API endpoints, DB queries, file uploads, payments, webhooks

**Step 2: OWASP Top 10 Check**

| # | Vulnerability | Key Questions |
|---|--------------|---------------|
| 1 | Injection | Queries parameterized? Input sanitized? ORMs safe? |
| 2 | Broken Auth | Passwords hashed (bcrypt/argon2)? JWT validated? Sessions secure? |
| 3 | Sensitive Data | HTTPS enforced? Secrets in env vars? PII encrypted? |
| 4 | XXE | XML parsers secure? External entities disabled? |
| 5 | Broken Access | Auth on every route? CORS configured? |
| 6 | Misconfiguration | Default creds changed? Debug off in prod? |
| 7 | XSS | Output escaped? CSP set? Framework auto-escaping? |
| 8 | Insecure Deserialization | User input deserialized safely? |
| 9 | Known Vulnerabilities | Dependencies updated? npm audit clean? |
| 10 | Insufficient Logging | Security events logged? Alerts configured? |

**Step 3: Code Pattern Flags**

| Pattern | Severity | Fix |
|---------|----------|-----|
| Hardcoded secrets | CRITICAL | Use `process.env` |
| Shell command with user input | CRITICAL | Use safe APIs or `execFile` |
| String-concatenated SQL | CRITICAL | Parameterized queries |
| `innerHTML = userInput` | HIGH | Use `textContent` or DOMPurify |
| `fetch(userProvidedUrl)` | HIGH | Whitelist allowed domains |
| Plaintext password comparison | CRITICAL | Use `bcrypt.compare()` |
| No auth check on route | CRITICAL | Add auth middleware |
| Balance check without lock | CRITICAL | Use `FOR UPDATE` in transaction |
| No rate limiting | HIGH | Add `express-rate-limit` |
| Logging secrets | MEDIUM | Sanitize log output |

### Key Principles

1. **Defense in Depth** — Multiple security layers
2. **Least Privilege** — Minimum required permissions
3. **Fail Securely** — Errors must not expose data
4. **Don't Trust Input** — Validate and sanitize everything
5. **Update Regularly** — Keep dependencies current

---

## Security Checklist

### 1. Secrets Management

```typescript
// NEVER: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ALWAYS: Environment variables with validation
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) throw new Error('OPENAI_API_KEY not configured')
```

### 2. Input Validation (Zod)

```typescript
import { z } from 'zod'

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

export async function createUser(input: unknown) {
  const validated = CreateUserSchema.parse(input)
  return await db.users.create(validated)
}
```

### 3. SQL Injection Prevention

```typescript
// SAFE: Parameterized queries
const { data } = await supabase.from('users').select('*').eq('email', userEmail)

// Or raw SQL with parameters
await db.query('SELECT * FROM users WHERE email = $1', [userEmail])
```

### 4. Authentication & Authorization

- Store tokens in **httpOnly cookies** (never localStorage)
- Check authorization before every sensitive operation
- Enable Row Level Security in Supabase
- Implement RBAC

### 5. XSS Prevention

- Sanitize user HTML with DOMPurify
- Configure Content Security Policy headers
- Use framework auto-escaping (React)

### 6. CSRF Protection

- CSRF tokens on state-changing operations
- `SameSite=Strict` on all cookies

### 7. Rate Limiting

- Apply rate limits on all API endpoints
- Stricter limits on expensive operations (search, uploads)

### 8. Sensitive Data

- Never log passwords, tokens, or secrets
- Generic error messages for users; detailed errors in server logs only

### 9. Dependency Security

- Run `npm audit` regularly
- Commit lock files
- Enable Dependabot

---

## When to Run

**Always:** New API endpoints, auth changes, user input handling, DB query changes, file uploads, payment code, external API integrations, dependency updates.

**Immediately:** Production incidents, dependency CVEs, user security reports, before major releases.

---

## Pre-Deployment Checklist

- [ ] No hardcoded secrets
- [ ] All inputs validated
- [ ] All queries parameterized
- [ ] User content sanitized (XSS)
- [ ] CSRF protection enabled
- [ ] Proper token handling
- [ ] Role checks in place
- [ ] Rate limiting on all endpoints
- [ ] HTTPS enforced
- [ ] Security headers configured (CSP, X-Frame-Options)
- [ ] No sensitive data in errors or logs
- [ ] Dependencies up to date
- [ ] RLS enabled (Supabase)
- [ ] CORS properly configured

---

## Common False Positives

- Environment variables in `.env.example`
- Test credentials clearly marked in test files
- Intentionally public API keys
- SHA256/MD5 for checksums (not passwords)

---

**Remember**: Security is not optional. One vulnerability can compromise the entire platform.

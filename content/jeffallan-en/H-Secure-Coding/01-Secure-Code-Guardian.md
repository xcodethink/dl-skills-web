> Source: [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | Category: Review & Verify

---
name: secure-code-guardian
description: Security-first coding checklist covering threat modeling, OWASP Top 10, authentication, input validation, and security headers
---

# Secure Code Guardian

## Overview

A methodology for embedding security practices throughout the development lifecycle. From threat modeling to security validation, ensure code is secure by design rather than patched after the fact. Core principle: fail secure (deny by default on error), never fail open.

## 5-Step Security Workflow

1. **Threat Model** -- Identify assets, attack surfaces, and potential threats
2. **Design** -- Choose appropriate security architecture and defense strategies
3. **Implement** -- Write code following secure coding standards
4. **Validate** -- Verify security measures through testing and audits
5. **Document** -- Record security decisions and known risks

## OWASP Top 10 Quick Reference

| Rank | Threat | Defense Pattern |
|------|--------|-----------------|
| A01 | Broken Access Control | Default deny, role-based permission checks |
| A02 | Cryptographic Failures | TLS 1.3, AES-256-GCM for sensitive data |
| A03 | Injection | Parameterized queries, input validation, output encoding |
| A04 | Insecure Design | Threat modeling, security design reviews |
| A05 | Security Misconfiguration | Least privilege, automated config checks |
| A06 | Vulnerable Components | Dependency scanning, timely updates |
| A07 | Authentication Failures | MFA, strong password policies |
| A08 | Data Integrity Failures | Signature verification, CI/CD security |
| A09 | Logging Failures | Structured logging, anomaly alerting |
| A10 | SSRF | URL allowlisting, block internal network access |

## Authentication Checklist

- Hash passwords with bcrypt or argon2; never MD5/SHA1
- Implement login rate limiting to prevent brute force
- Session management: set reasonable expiry, rotate session ID on login
- JWT tokens: use short TTL, implement refresh flow, verify signing algorithm

## Input Validation Patterns

```javascript
// Parameterized query -- prevents SQL injection
const result = await db.query(
  'SELECT * FROM users WHERE id = $1', [userId]
);

// Zod schema validation -- type-safe input checking
const UserInput = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
});

// HTML output encoding -- prevents XSS
const safeHtml = escapeHtml(userInput);
```

## XSS / CSRF Prevention

- **CSP**: Configure `Content-Security-Policy` header to restrict script sources
- **CSRF tokens**: Include a one-time token in every form; validate server-side
- **Output encoding**: All user input must be encoded before rendering

## Security Headers Checklist

| Header | Purpose | Recommended Value |
|--------|---------|-------------------|
| Strict-Transport-Security | Force HTTPS | `max-age=31536000; includeSubDomains` |
| X-Content-Type-Options | Prevent MIME sniffing | `nosniff` |
| X-Frame-Options | Prevent clickjacking | `DENY` or `SAMEORIGIN` |
| Content-Security-Policy | Restrict resource origins | Configure per app; ban `unsafe-inline` |
| Referrer-Policy | Control Referer leakage | `strict-origin-when-cross-origin` |

For Node.js projects, use Helmet.js to configure all headers in one step.

## MUST DO / MUST NOT DO

**MUST DO:**
1. Validate and sanitize all input
2. Use parameterized queries for all database access
3. Hash passwords with bcrypt/argon2
4. Enable HTTPS and security response headers
5. Apply the principle of least privilege
6. Log security-relevant events for audit trails
7. Scan and update dependencies regularly
8. Fail secure -- deny access on error, never allow by default

**MUST NOT:**
1. Hardcode secrets or credentials in source code
2. Use MD5 or SHA1 for password hashing
3. Trust client input without server-side validation
4. Expose internal implementation details in error messages
5. Use `eval()` or dynamic code execution
6. Disable HTTPS or downgrade to HTTP
7. Log plaintext passwords or sensitive data
8. Fail open -- allowing access on error is a critical vulnerability

## Fail Secure vs Fail Open

- **Fail Secure**: System denies access by default when an error occurs. Example: if the auth service is down, reject all requests.
- **Fail Open**: System allows access by default when an error occurs. This is almost always the wrong choice.
- Principle: It is better to deny a legitimate user than to let a malicious request through.

> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa
> Original files: agents/code-reviewer.md + commands/code-review.md

# Code Review

## Overview

A systematic code review workflow combining security auditing, quality checks, and best practice validation. Uses confidence-based filtering and severity classification to focus on real issues and avoid noise. Designed to run immediately after every code change.

---

## Review Process

1. **Gather context** -- Run `git diff --staged` and `git diff` to see all changes. If no diff, check recent commits with `git log --oneline -5`.
2. **Understand scope** -- Identify which files changed, what feature/fix they relate to, and how they connect.
3. **Read surrounding code** -- Don't review changes in isolation. Read the full file and understand imports, dependencies, and call sites.
4. **Apply review checklist** -- Work through each category below, from CRITICAL to LOW.
5. **Report findings** -- Only report issues you are >80% confident about.

## Confidence-Based Filtering

- **Report** if >80% confident it is a real issue
- **Skip** stylistic preferences unless they violate project conventions
- **Skip** issues in unchanged code unless they are CRITICAL security issues
- **Consolidate** similar issues (e.g., "5 functions missing error handling" not 5 separate findings)
- **Prioritize** issues that could cause bugs, security vulnerabilities, or data loss

---

## Review Checklist

### Security (CRITICAL)

Must be flagged -- they can cause real damage:

- **Hardcoded credentials** -- API keys, passwords, tokens, connection strings in source
- **SQL injection** -- String concatenation in queries instead of parameterized queries
- **XSS vulnerabilities** -- Unescaped user input rendered in HTML/JSX
- **Path traversal** -- User-controlled file paths without sanitization
- **CSRF vulnerabilities** -- State-changing endpoints without CSRF protection
- **Authentication bypasses** -- Missing auth checks on protected routes
- **Insecure dependencies** -- Known vulnerable packages
- **Exposed secrets in logs** -- Logging sensitive data (tokens, passwords, PII)

```typescript
// BAD: SQL injection via string concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;

// GOOD: Parameterized query
const query = `SELECT * FROM users WHERE id = $1`;
const result = await db.query(query, [userId]);
```

### Code Quality (HIGH)

- **Large functions** (>50 lines) -- Split into smaller, focused functions
- **Large files** (>800 lines) -- Extract modules by responsibility
- **Deep nesting** (>4 levels) -- Use early returns, extract helpers
- **Missing error handling** -- Unhandled promise rejections, empty catch blocks
- **Mutation patterns** -- Prefer immutable operations (spread, map, filter)
- **console.log statements** -- Remove debug logging before merge
- **Missing tests** -- New code paths without test coverage
- **Dead code** -- Commented-out code, unused imports, unreachable branches

```typescript
// BAD: Deep nesting + mutation
function processUsers(users) {
  if (users) {
    for (const user of users) {
      if (user.active) {
        if (user.email) {
          user.verified = true;
          results.push(user);
        }
      }
    }
  }
  return results;
}

// GOOD: Early returns + immutability + flat
function processUsers(users) {
  if (!users) return [];
  return users
    .filter(user => user.active && user.email)
    .map(user => ({ ...user, verified: true }));
}
```

### React/Next.js Patterns (HIGH)

- **Missing dependency arrays** -- `useEffect`/`useMemo`/`useCallback` with incomplete deps
- **State updates in render** -- Calling setState during render causes infinite loops
- **Missing keys in lists** -- Using array index as key when items can reorder
- **Prop drilling** -- Props passed through 3+ levels (use context or composition)
- **Client/server boundary** -- Using `useState`/`useEffect` in Server Components
- **Missing loading/error states** -- Data fetching without fallback UI
- **Stale closures** -- Event handlers capturing stale state values

### Node.js/Backend Patterns (HIGH)

- **Unvalidated input** -- Request body/params used without schema validation
- **Missing rate limiting** -- Public endpoints without throttling
- **Unbounded queries** -- `SELECT *` or queries without LIMIT on user-facing endpoints
- **N+1 queries** -- Fetching related data in a loop instead of a join/batch
- **Missing timeouts** -- External HTTP calls without timeout configuration
- **Error message leakage** -- Sending internal error details to clients

```typescript
// BAD: N+1 query pattern
const users = await db.query('SELECT * FROM users');
for (const user of users) {
  user.posts = await db.query('SELECT * FROM posts WHERE user_id = $1', [user.id]);
}

// GOOD: Single query with JOIN
const usersWithPosts = await db.query(`
  SELECT u.*, json_agg(p.*) as posts
  FROM users u
  LEFT JOIN posts p ON p.user_id = u.id
  GROUP BY u.id
`);
```

### Performance (MEDIUM)

- Inefficient algorithms (O(n^2) when O(n) possible)
- Missing memoization (React.memo, useMemo, useCallback)
- Large bundle sizes (import entire libraries vs tree-shakeable alternatives)
- Synchronous I/O in async contexts

### Best Practices (LOW)

- TODO/FIXME without issue numbers
- Missing JSDoc for public APIs
- Poor naming (single-letter variables in non-trivial contexts)
- Magic numbers without explanation

---

## Output Format

```
[CRITICAL] Hardcoded API key in source
File: src/api/client.ts:42
Issue: API key "sk-abc..." exposed in source code.
Fix: Move to environment variable and add to .gitignore/.env.example
```

### Summary Table

```
| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0     | pass   |
| HIGH     | 2     | warn   |
| MEDIUM   | 3     | info   |
| LOW      | 1     | note   |

Verdict: WARNING -- 2 HIGH issues should be resolved before merge.
```

## Approval Criteria

| Verdict | Condition |
|---------|-----------|
| **Approve** | No CRITICAL or HIGH issues |
| **Warning** | HIGH issues only (can merge with caution) |
| **Block** | CRITICAL issues found -- must fix before merge |

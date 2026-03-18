> Source: DL Skills Curated | Category: Review & Verify

---
name: ai-coding-anti-patterns
description: Common mistakes AI coding assistants make and systematic prevention strategies
---

# AI Coding Anti-Patterns Checklist

## Overview

AI coding assistants dramatically boost productivity but introduce specific categories of errors. This checklist covers 8 common anti-patterns with concrete examples and prevention strategies. Use it as an acceptance checklist when working with AI-generated code.

## Anti-Pattern Catalog

### 1. Hallucinated Dependencies

AI suggests packages that do not exist or are deprecated.

**Bad example:**
```bash
npm install react-fast-table  # This package does not exist
```

**Prevention:**
- Run `npm info <pkg>` or `pip show <pkg>` before installing any AI-suggested package
- Check last publish date and weekly downloads
- Prefer well-known, battle-tested packages

### 2. Context Drift

AI forgets earlier decisions and introduces inconsistencies later in the session.

**Bad example:**
```javascript
// Agreed on camelCase earlier, then switches to snake_case
const userName = 'Alice';       // earlier style
const user_email = 'a@b.com';  // AI forgot the convention
```

**Prevention:**
- Use CLAUDE.md or equivalent config to codify conventions
- Periodically recap key decisions in long sessions
- Correct inconsistencies immediately; do not let them accumulate

### 3. Over-Engineering

AI generates abstraction layers, design patterns, or generalizations nobody requested.

**Bad example:**
```python
# You asked for a simple function; AI produced a factory + strategy + abstract base class
class AbstractProcessorFactory:
    ...
```

**Prevention:**
- Explicitly request "minimal implementation" in prompts
- Apply YAGNI (You Aren't Gonna Need It)
- Review test: can you delete the abstraction and still have working code?

### 4. Copy-Paste Security

AI copies patterns containing hardcoded secrets or insecure defaults.

**Bad example:**
```python
API_KEY = "sk-1234567890abcdef"  # Hardcoded in source
DEBUG = True                      # Insecure default
```

**Prevention:**
- Never accept real credentials or secrets in code
- Use environment variables or a secrets manager
- Run `git diff` before commit to scan for leaked secrets

### 5. Outdated Patterns

AI suggests deprecated APIs or legacy syntax.

**Bad example:**
```javascript
// Deprecated React lifecycle
componentWillMount() { ... }
```

**Prevention:**
- Specify framework and language versions in your prompts
- Cross-check against official docs to confirm the API is still supported
- Pay attention to deprecation warnings from your editor or compiler

### 6. Silent Error Swallowing

AI wraps everything in try/catch with empty handlers, silently discarding errors.

**Bad example:**
```javascript
try {
  await fetchData();
} catch (e) {
  // AI left this empty -- error silently swallowed
}
```

**Prevention:**
- Require an explicit error handling strategy for every catch block
- At minimum: log the error or report to an error tracking service
- Distinguish recoverable from unrecoverable errors

### 7. Test Theatre

AI writes tests that always pass because they test implementation details, not behavior.

**Bad example:**
```javascript
jest.mock('./api');
test('fetches data', () => {
  expect(api.fetch).toBeDefined();  // Always true -- meaningless
});
```

**Prevention:**
- After writing tests, intentionally break the code under test and confirm the test fails
- Test behavior (inputs/outputs), not implementation (internal calls)
- Check that assertions are meaningful (not just `toBeDefined`)

### 8. Incomplete Migration

AI partially migrates code, leaving a mix of old and new patterns.

**Bad example:**
```javascript
// Some files use new fetch API, others still use axios
// Some components migrated to TypeScript, others remain JS
```

**Prevention:**
- After migration, search globally for the old pattern to confirm zero residuals
- Migrate one pattern at a time; complete it before starting the next
- Add CI lint rules to forbid the old pattern

## Pre-Commit Quick Checklist

1. All new dependencies verified with `npm info` / `pip show`?
2. Code style consistent with the existing project conventions?
3. No hardcoded secrets or insecure defaults?
4. APIs used are supported in the current version?
5. Every catch block has explicit error handling?
6. Tests fail when the code under test is broken?
7. Migration is complete with no old/new pattern mix?
8. No unnecessary abstraction layers that can be removed?

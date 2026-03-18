> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa
> Original files: rules/common/coding-style.md + rules/typescript/coding-style.md + rules/python/coding-style.md + rules/golang/coding-style.md

# Coding Standards

## Overview

Cross-language coding style rules emphasizing immutability, small file organization, comprehensive error handling, and input validation. Includes language-specific supplements for TypeScript/JavaScript, Python, and Go.

---

## Universal Principles

### Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate existing ones:

```
WRONG:   modify(original, field, value) -> changes original in-place
CORRECT: update(original, field, value) -> returns new copy with change
```

Rationale: Immutable data prevents hidden side effects, makes debugging easier, and enables safe concurrency.

### File Organization

Many small files > few large files:
- High cohesion, low coupling
- 200-400 lines typical, 800 max
- Extract utilities from large modules
- Organize by feature/domain, not by type

### Error Handling

- Handle errors explicitly at every level
- Provide user-friendly error messages in UI-facing code
- Log detailed error context on the server side
- Never silently swallow errors

### Input Validation

- Validate all user input before processing
- Use schema-based validation where available
- Fail fast with clear error messages
- Never trust external data (API responses, user input, file content)

### Quality Checklist

- [ ] Code is readable and well-named
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling
- [ ] No hardcoded values (use constants or config)
- [ ] No mutation (immutable patterns used)

---

## TypeScript/JavaScript

Applies to: `*.ts`, `*.tsx`, `*.js`, `*.jsx`

### Immutable Updates

```typescript
// WRONG: Mutation
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}

// CORRECT: Spread operator
function updateUser(user, name) {
  return { ...user, name }
}
```

### Error Handling

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### Input Validation with Zod

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### Console.log Policy

- No `console.log` in production code
- Use proper logging libraries instead

---

## Python

Applies to: `*.py`, `*.pyi`

- Follow PEP 8 conventions
- Use type annotations on all function signatures
- Format with **black**, sort imports with **isort**, lint with **ruff**

### Immutable Data Structures

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class User:
    name: str
    email: str

from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float
```

---

## Go

Applies to: `*.go`, `go.mod`, `go.sum`

- **gofmt** and **goimports** are mandatory
- Accept interfaces, return structs
- Keep interfaces small (1-3 methods)

### Error Wrapping

```go
if err != nil {
    return fmt.Errorf("failed to create user: %w", err)
}
```

---

## Summary

| Principle | Requirement |
|-----------|-------------|
| Immutability | Always create new objects, never mutate |
| File size | 200-400 lines typical, 800 max |
| Function size | Under 50 lines |
| Nesting depth | Max 4 levels |
| Error handling | Explicit at every level, never swallow |
| Input validation | Always validate at system boundaries |
| Hardcoded values | Use constants or config instead |

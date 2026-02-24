> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Verification Loop

## Overview

A comprehensive quality gate system for Claude Code sessions that runs six verification phases in sequence — build, types, lint, tests, security, and diff review — producing a structured pass/fail report to determine PR readiness.

---

## When to Use

- After completing a feature or significant code change
- Before creating a pull request
- After refactoring
- Periodically during long sessions (every 15 minutes or after major changes)

---

## Verification Phases

### Phase 1: Build Check

```bash
npm run build 2>&1 | tail -20
```

If build fails, **STOP** and fix before continuing.

### Phase 2: Type Check

```bash
# TypeScript
npx tsc --noEmit 2>&1 | head -30

# Python
pyright . 2>&1 | head -30
```

### Phase 3: Lint Check

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

### Phase 4: Test Suite

```bash
npm run test -- --coverage 2>&1 | tail -50
# Target: 80% minimum coverage
```

### Phase 5: Security Scan

```bash
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

### Phase 6: Diff Review

```bash
git diff --stat
git diff HEAD~1 --name-only
```

Review each changed file for unintended changes, missing error handling, and edge cases.

---

## Output Format

```
VERIFICATION: [PASS/FAIL]

Build:    [OK/FAIL]
Types:    [OK/X errors]
Lint:     [OK/X issues]
Tests:    [X/Y passed, Z% coverage]
Secrets:  [OK/X found]
Logs:     [OK/X console.logs]

Ready for PR: [YES/NO]
```

---

## Command Modes

| Argument | Scope |
|----------|-------|
| `quick` | Build + types only |
| `full` | All checks (default) |
| `pre-commit` | Commit-relevant checks |
| `pre-pr` | Full checks plus security scan |

---

## Integration with Hooks

This skill complements PostToolUse hooks:
- **Hooks**: Catch issues immediately on each tool call
- **Verification Loop**: Comprehensive review at logical checkpoints

Use both together for multi-layered quality assurance.

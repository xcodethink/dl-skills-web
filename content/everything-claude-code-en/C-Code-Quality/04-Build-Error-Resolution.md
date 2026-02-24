> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa
> Original files: agents/build-error-resolver.md + commands/build-fix.md

# Build Error Resolution

## Overview

A workflow for fixing build and type errors with minimal changes. Core principle: fix the error, verify the build passes, move on. No refactoring, no architecture changes, no new features. Supports multi-language build system detection.

---

## Diagnostic Commands

```bash
npx tsc --noEmit --pretty                        # TypeScript type check
npx tsc --noEmit --pretty --incremental false     # Show all errors
npm run build                                     # Full build
npx eslint . --ext .ts,.tsx,.js,.jsx             # Linting
```

## Build System Detection

| Indicator | Build Command |
|-----------|---------------|
| `package.json` with `build` script | `npm run build` or `pnpm build` |
| `tsconfig.json` (TypeScript) | `npx tsc --noEmit` |
| `Cargo.toml` | `cargo build 2>&1` |
| `pom.xml` | `mvn compile` |
| `build.gradle` | `./gradlew compileJava` |
| `go.mod` | `go build ./...` |
| `pyproject.toml` | `python -m py_compile` or `mypy .` |

---

## Workflow

### 1. Collect All Errors

- Run the build command and capture stderr
- Group errors by file path
- Sort by dependency order (fix imports/types before logic errors)
- Count total errors for progress tracking

### 2. Fix Loop (One Error at a Time)

For each error:

1. **Read the file** -- See error context (10 lines around the error)
2. **Diagnose** -- Identify root cause (missing import, wrong type, syntax error)
3. **Fix minimally** -- Smallest change that resolves the error
4. **Re-run build** -- Verify the error is gone and no new errors introduced
5. **Move to next** -- Continue with remaining errors

### 3. Common Fixes

| Error | Fix |
|-------|-----|
| `implicitly has 'any' type` | Add type annotation |
| `Object is possibly 'undefined'` | Optional chaining `?.` or null check |
| `Property does not exist` | Add to interface or use optional `?` |
| `Cannot find module` | Check tsconfig paths, install package, or fix import path |
| `Type 'X' not assignable to 'Y'` | Parse/convert type or fix the type definition |
| `Generic constraint` | Add `extends { ... }` |
| `Hook called conditionally` | Move hooks to top level |
| `'await' outside async` | Add `async` keyword |

---

## Guardrails

Stop and ask the user if:
- A fix introduces **more errors than it resolves**
- The **same error persists after 3 attempts**
- The fix requires **architectural changes**
- Build errors stem from **missing dependencies** (need install commands)

---

## DO and DON'T

**DO:**
- Add type annotations where missing
- Add null checks where needed
- Fix imports/exports
- Add missing dependencies
- Update type definitions
- Fix configuration files

**DON'T:**
- Refactor unrelated code
- Change architecture
- Rename variables (unless causing error)
- Add new features
- Change logic flow (unless fixing error)
- Optimize performance or style

---

## Recovery Strategies

| Situation | Action |
|-----------|--------|
| Missing module/import | Check if package is installed; suggest install command |
| Type mismatch | Read both type definitions; fix the narrower type |
| Circular dependency | Identify cycle with import graph; suggest extraction |
| Version conflict | Check version constraints in package manifest |
| Build tool misconfiguration | Read config file; compare with working defaults |

### Nuclear Options

```bash
# Clear all caches
rm -rf .next node_modules/.cache && npm run build

# Reinstall dependencies
rm -rf node_modules package-lock.json && npm install

# Auto-fix ESLint issues
npx eslint . --fix
```

---

## Priority Levels

| Level | Symptoms | Action |
|-------|----------|--------|
| CRITICAL | Build completely broken, no dev server | Fix immediately |
| HIGH | Single file failing, new code type errors | Fix soon |
| MEDIUM | Linter warnings, deprecated APIs | Fix when possible |

## Success Metrics

- `npx tsc --noEmit` exits with code 0
- `npm run build` completes successfully
- No new errors introduced
- Minimal lines changed (< 5% of affected file)
- Tests still passing

## When NOT to Use

- Code needs refactoring -- use `refactor-cleaner`
- Architecture changes needed -- use `architect`
- New features required -- use `planner`
- Tests failing -- use `tdd-guide`
- Security issues -- use `security-reviewer`

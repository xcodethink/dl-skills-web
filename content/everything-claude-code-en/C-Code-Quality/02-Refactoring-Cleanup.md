> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa
> Original files: agents/refactor-cleaner.md + commands/refactor-clean.md

# Refactoring & Cleanup

## Overview

A systematic dead code cleanup and consolidation workflow. Uses analysis tools to detect unused code, exports, and dependencies, then removes them safely in batches with test verification at every step. Core principle: better to keep dead code than break production.

---

## Detection Tools

| Tool | What It Finds | Command |
|------|---------------|---------|
| knip | Unused exports, files, dependencies | `npx knip` |
| depcheck | Unused npm dependencies | `npx depcheck` |
| ts-prune | Unused TypeScript exports | `npx ts-prune` |
| vulture | Unused Python code | `vulture src/` |
| deadcode | Unused Go code | `deadcode ./...` |
| cargo-udeps | Unused Rust dependencies | `cargo +nightly udeps` |

If no tool is available, use Grep to find exports with zero imports.

---

## Workflow

### 1. Analyze

- Run detection tools in parallel
- Categorize by risk:
  - **SAFE** -- Unused utilities, test helpers, internal functions
  - **CAUTION** -- Components, API routes, middleware (check for dynamic imports)
  - **DANGER** -- Config files, entry points, type definitions (investigate first)

### 2. Verify Before Removal

For each item:
- Grep for all references (including dynamic imports via string patterns)
- Check if part of public API
- Review git history for context

### 3. Safe Deletion Loop

For each SAFE item:

1. Run full test suite (establish green baseline)
2. Delete the dead code (surgical removal)
3. Re-run test suite
4. If tests fail -- immediately revert and skip this item
5. If tests pass -- move to next item

Remove one category at a time: dependencies -> exports -> files -> duplicates.

### 4. Handle CAUTION Items

Before deleting:
- Search for dynamic imports: `import()`, `require()`, `__import__`
- Search for string references: route names, component names in configs
- Check if exported from a public package API
- Verify no external consumers

### 5. Consolidate Duplicates

After removing dead code, look for:
- Near-duplicate functions (>80% similar) -- merge into one
- Redundant type definitions -- consolidate
- Wrapper functions that add no value -- inline them
- Re-exports that serve no purpose -- remove indirection

---

## Safety Checklist

**Before removing:**
- [ ] Detection tools confirm unused
- [ ] Grep confirms no references (including dynamic)
- [ ] Not part of public API
- [ ] Tests pass after removal

**After each batch:**
- [ ] Build succeeds
- [ ] Tests pass
- [ ] Committed with descriptive message

---

## Core Rules

1. **Never delete without running tests first**
2. **One deletion at a time** -- Atomic changes make rollback easy
3. **Skip if uncertain** -- Better to keep dead code than break production
4. **Don't refactor while cleaning** -- Separate concerns (clean first, refactor later)
5. **Never use** during active feature development or before deploys

---

## When NOT to Use

- During active feature development
- Right before production deployment
- Without proper test coverage
- On code you don't understand

## Success Metrics

- All tests passing
- Build succeeds
- No regressions
- Bundle size reduced

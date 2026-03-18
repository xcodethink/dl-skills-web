# Test Coverage Analysis

> **Source:** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> **Original files:** commands/test-coverage.md, rules/common/testing.md
> **Curated:** 2026-02-21

---

## Overview

Analyze test coverage, identify gaps, and generate missing tests to reach 80%+ coverage across any language or framework.

---

## Minimum Coverage: 80%

All three test types are required:
1. **Unit Tests** -- Individual functions, utilities, components
2. **Integration Tests** -- API endpoints, database operations
3. **E2E Tests** -- Critical user flows

---

## Framework Detection

| Indicator | Coverage Command |
|-----------|-----------------|
| `jest.config.*` or package.json jest | `npx jest --coverage --coverageReporters=json-summary` |
| `vitest.config.*` | `npx vitest run --coverage` |
| `pytest.ini` / `pyproject.toml` pytest | `pytest --cov=src --cov-report=json` |
| `Cargo.toml` | `cargo llvm-cov --json` |
| `pom.xml` with JaCoCo | `mvn test jacoco:report` |
| `go.mod` | `go test -coverprofile=coverage.out ./...` |

---

## Workflow

### Step 1: Analyze Coverage

1. Run the coverage command
2. Parse output (JSON summary or terminal)
3. List files below 80%, sorted worst-first
4. For each under-covered file, identify untested functions, missing branches, and dead code

### Step 2: Generate Tests

Priority order:
1. **Happy path** -- Core functionality with valid inputs
2. **Error handling** -- Invalid inputs, missing data, failures
3. **Edge cases** -- Empty arrays, null/undefined, boundary values
4. **Branch coverage** -- Each if/else, switch, ternary

Rules:
- Place tests adjacent to source (`foo.ts` -> `foo.test.ts`)
- Match existing project patterns
- Mock external dependencies
- Each test must be independent
- Use descriptive names: `test_create_user_with_duplicate_email_returns_409`

### Step 3: Verify

1. Run full test suite -- all must pass
2. Re-run coverage -- verify improvement
3. Repeat if still below 80%

### Step 4: Report

```
Coverage Report
------------------------------
File                   Before  After
src/services/auth.ts   45%     88%
src/utils/validation.ts 32%    82%
------------------------------
Overall:               67%     84%
```

---

## TDD Workflow (Mandatory)

1. Write test first (RED)
2. Run test -- should FAIL
3. Write minimal implementation (GREEN)
4. Run test -- should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

---

## Focus Areas

- High cyclomatic complexity functions
- Error handlers and catch blocks
- Utility functions used across the codebase
- API endpoint handlers
- Edge cases: null, undefined, empty string, empty array, zero, negative numbers

---

## Troubleshooting

1. Use the **tdd-guide** agent
2. Check test isolation
3. Verify mocks are correct
4. Fix implementation, not tests (unless tests are wrong)

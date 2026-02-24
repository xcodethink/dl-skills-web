> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Test-Driven Development (TDD)

## Overview

TDD enforces a strict "tests before code" methodology through the Red-Green-Refactor cycle. Write a failing test first (Red), implement minimal code to pass it (Green), then improve the code while keeping tests green (Refactor). Target: 80%+ test coverage.

---

## The TDD Cycle

```
RED -> GREEN -> REFACTOR -> REPEAT

RED:      Write a failing test describing expected behavior
GREEN:    Write minimal code to make the test pass
REFACTOR: Improve code quality while keeping tests green
REPEAT:   Move to the next feature/scenario
```

### Step-by-Step Workflow

1. **Define interfaces** for inputs/outputs
2. **Write user journeys** as test scenarios
3. **Write tests that FAIL** (code doesn't exist yet)
4. **Run tests** and verify they fail for the right reason
5. **Write minimal implementation** to make tests pass
6. **Run tests** and verify they pass
7. **Refactor** while keeping tests green
8. **Check coverage** and add more tests if below 80%

---

## Test Types

| Type | What to Test | When |
|------|-------------|------|
| **Unit** | Individual functions, components, pure logic | Always |
| **Integration** | API endpoints, database operations, service interactions | Always |
| **E2E** | Critical user flows via Playwright | Critical paths |

---

## Edge Cases You Must Test

1. Null/Undefined input
2. Empty arrays/strings
3. Invalid types
4. Boundary values (min/max)
5. Error paths (network failures, DB errors)
6. Race conditions (concurrent operations)
7. Large data (10k+ items)
8. Special characters (Unicode, emojis, SQL chars)

---

## Testing Patterns

### Unit Test (Jest/Vitest)

```typescript
describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### API Integration Test

```typescript
describe('GET /api/markets', () => {
  it('returns markets successfully', async () => {
    const request = new NextRequest('http://localhost/api/markets')
    const response = await GET(request)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('validates query parameters', async () => {
    const request = new NextRequest('http://localhost/api/markets?limit=invalid')
    const response = await GET(request)
    expect(response.status).toBe(400)
  })
})
```

### E2E Test (Playwright)

```typescript
test('user can search and filter markets', async ({ page }) => {
  await page.goto('/')
  await page.click('a[href="/markets"]')
  await page.fill('input[placeholder="Search markets"]', 'election')
  await page.waitForTimeout(600)
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })
})
```

---

## Mocking External Services

```typescript
// Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [...], error: null }))
      }))
    }))
  }
}))

// Redis
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([...])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| Testing implementation details (internal state) | Test user-visible behavior |
| Brittle CSS selectors | Use semantic selectors or data-testid |
| Tests depending on each other (shared state) | Independent tests with own setup |
| Asserting too little | Specific, meaningful assertions |
| Writing implementation before tests | Always write tests first |

---

## Coverage Requirements

- **80% minimum** for all code (branches, functions, lines, statements)
- **100% required** for: financial calculations, authentication, security-critical code, core business logic

---

## Best Practices

1. Write the test FIRST, before any implementation
2. One assert per test — focus on single behavior
3. Use Arrange-Act-Assert structure
4. Mock external dependencies to isolate units
5. Keep tests fast (unit tests < 50ms each)
6. Clean up after tests — no side effects
7. Use watch mode during development: `npm test -- --watch`

---

## Integration with Other Commands

| Command | Purpose |
|---------|---------|
| `/plan` | Understand what to build |
| `/tdd` | Implement with tests |
| `/build-fix` | Fix build errors |
| `/code-review` | Review implementation |
| `/test-coverage` | Verify coverage |

> **Remember**: Tests are not optional. They are the safety net that enables confident refactoring, rapid development, and production reliability.

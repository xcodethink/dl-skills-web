# TypeScript Patterns

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> Files: rules/typescript/ (coding-style, patterns, hooks, security, testing) + skills/coding-standards/SKILL.md

---

## Core Principles

- **Readability First** — code is read more than written
- **KISS** — simplest solution that works
- **DRY** — extract common logic into functions
- **YAGNI** — don't build features before they're needed

---

## Naming Conventions

**Variables**: Descriptive names (`marketSearchQuery`, `isUserAuthenticated`, `totalRevenue`)
**Functions**: Verb-noun pattern (`fetchMarketData`, `calculateSimilarity`, `isValidEmail`)
**Files**: `Button.tsx` (PascalCase for components), `useAuth.ts` (camelCase with `use` prefix for hooks)

---

## Immutability (Critical)

Always use spread operator for updates, never mutate directly:

```typescript
const updatedUser = { ...user, name: 'New Name' }
const updatedArray = [...items, newItem]
```

---

## Error Handling

```typescript
async function fetchData(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}
```

## Async Best Practices

Use `Promise.all` for parallel execution when operations are independent:

```typescript
const [users, markets, stats] = await Promise.all([
  fetchUsers(), fetchMarkets(), fetchStats()
])
```

---

## Type Safety

- Use proper interfaces with union types for constrained values
- Never use `any` — define specific types
- Use Zod for runtime schema validation

```typescript
import { z } from 'zod'

const CreateMarketSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  endDate: z.string().datetime(),
  categories: z.array(z.string()).min(1)
})
```

---

## API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: { total: number; page: number; limit: number }
}
```

---

## React Essentials

- Functional components with typed props
- Functional state updates: `setCount(prev => prev + 1)`
- Clear conditional rendering (avoid ternary nesting)
- Custom hooks for reusable logic (`useDebounce`, `useToggle`)

## Performance

- `useMemo` for expensive computations
- `useCallback` for callbacks passed to children
- `React.memo` for pure components
- `lazy` + `Suspense` for code splitting
- Select only needed columns in database queries

## Testing

- AAA pattern (Arrange, Act, Assert)
- Descriptive test names that explain expected behavior
- Playwright for E2E testing

## Code Smells

- Functions > 50 lines — split into smaller functions
- Nesting > 5 levels — use early returns
- Magic numbers — use named constants
- Comments explaining "what" — code should be self-documenting; comment "why"

## Hooks & Security

- Auto-format with Prettier after edits
- Run `tsc` after editing TS files
- Warn on `console.log` in edited files
- Never hardcode secrets — use environment variables

---

**Remember**: Code quality is not negotiable. Clear, maintainable code enables rapid development and confident refactoring.

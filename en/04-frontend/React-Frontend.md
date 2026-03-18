# React Frontend Patterns

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> File: skills/frontend-patterns/SKILL.md

---

## Component Patterns

- **Composition over Inheritance**: Card + CardHeader + CardBody
- **Compound Components**: Shared context (Tabs/Tab pattern)
- **Render Props**: Data fetching with children-as-function

## Custom Hooks

- **useToggle**: Boolean state toggle
- **useQuery**: Async data fetching with loading/error/refetch
- **useDebounce**: Delay value updates for search inputs

## State Management

- **Context + Reducer**: Type-safe dispatch with action unions
- Provider pattern with custom hook for consuming context

## Performance Optimization

- `useMemo` for expensive computations
- `useCallback` for callbacks passed as props
- `React.memo` for pure components
- `lazy` + `Suspense` for code splitting
- `useVirtualizer` from `@tanstack/react-virtual` for long lists

## Form Handling

Controlled forms with validation, immutable state updates via spread, field-level error display.

## Error Boundaries

Class component with `getDerivedStateFromError` and `componentDidCatch` for graceful error handling.

## Animation

Framer Motion with `AnimatePresence` for list and modal animations.

## Accessibility

- Keyboard navigation (ArrowDown/Up, Enter, Escape)
- Focus management (save/restore focus on modal open/close)
- ARIA attributes (`role`, `aria-expanded`, `aria-modal`)

---

**Remember**: Choose patterns that fit your project complexity. Modern frontend patterns enable maintainable, performant UIs.

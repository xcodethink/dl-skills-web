> Source: [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | Category: Frontend

---
name: react-expert
description: Use when building React 18+ applications requiring component architecture, hooks patterns, or state management. Invoke for Server Components, performance optimization, Suspense boundaries, React 19 features.
---

# React Expert

## Overview

Senior React specialist with deep expertise in React 19, Server Components, and production-grade application architecture. 10+ years frontend experience.

## When to Use

- Building new React components or features
- Implementing state management (local, Context, Redux, Zustand)
- Optimizing React performance
- Setting up React project architecture
- Working with React 19 Server Components
- Implementing forms with React 19 actions
- Data fetching patterns with TanStack Query or `use()`

## Core Workflow

1. **Analyze requirements** — Component hierarchy, state needs, data flow
2. **Choose patterns** — State management, data fetching approach
3. **Implement** — TypeScript components with proper types
4. **Optimize** — Memoize where needed, ensure accessibility
5. **Test** — React Testing Library tests

## React 19 Key Features

| Feature | Description |
|---------|-------------|
| `use()` Hook | Read Promises and Context during render |
| `useActionState` | Manage form submission state |
| Server Components | Server-rendered components with zero client JS |
| Form Actions | Declarative form handling |
| Enhanced Suspense | Better async boundary control |

## Constraints

### MUST DO
- TypeScript strict mode
- Error Boundaries for graceful degradation
- `key` props with stable unique identifiers
- Effect cleanup functions (prevent memory leaks)
- Semantic HTML + ARIA for accessibility
- Memoize callbacks/objects passed to memoized children
- Suspense boundaries for async operations

### MUST NOT
- Mutate state directly
- Use array index as key for dynamic lists
- Create functions inside JSX (causes unnecessary re-renders)
- Forget useEffect cleanup
- Ignore React strict mode warnings
- Skip Error Boundaries in production

## Knowledge Reference

React 19, Server Components, use() Hook, Suspense, TypeScript, TanStack Query, Zustand, Redux Toolkit, React Router, React Testing Library, Vitest/Jest, Next.js App Router, WCAG accessibility

> Source: DL Skills Curated | Category: Project Setup

---
name: react-vite-scaffold
description: Modern React + Vite + TypeScript project setup with full toolchain configuration
---

# React + Vite Scaffold

## Overview

Standard workflow for bootstrapping a modern React project with Vite. Covers `npm create vite` through Tailwind CSS 4, routing, testing, state management, and code quality tooling. Goal: development-ready in under 10 minutes.

## Workflow

1. Create TypeScript project with `npm create vite@latest`
2. Install core dependencies (routing, styling, testing, code quality)
3. Configure Tailwind CSS 4 via Vite plugin
4. Set up path aliases (`@/` mapping)
5. Configure Vitest + Testing Library
6. Configure ESLint + Prettier
7. Organize directory structure by responsibility
8. Write the first smoke test

## Initialization

### 1. Create Project

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### 2. Install Core Dependencies

```bash
# Routing
npm install react-router-dom

# Styling -- Tailwind CSS 4 via Vite plugin
npm install -D tailwindcss @tailwindcss/vite

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Code quality
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
npm install -D prettier eslint-config-prettier
```

### 3. Tailwind CSS 4 Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

## Directory Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Base UI (Button, Input, etc.)
│   └── layout/       # Layout (Header, Sidebar, etc.)
├── features/         # Feature modules (optional, for larger projects)
├── hooks/            # Custom React hooks
├── lib/              # Utilities, API clients, constants
├── pages/            # Route page components
├── types/            # TypeScript type definitions
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── index.css         # Global styles (Tailwind entry)
```

Small projects: `components/` + `pages/` separation is sufficient. Larger projects: add `features/` where each module owns its components, hooks, and types.

## Key Configuration

### Path Aliases

```typescript
// vite.config.ts
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: './src/test-setup.ts' },
})
```

### ESLint + Prettier

```javascript
// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules },
  prettierConfig,
)
```

## State Management Selection Guide

| Scenario | Recommendation | Reason |
|----------|---------------|--------|
| Simple global state (theme, user) | Zustand | Minimal API, no Provider wrapping, TS-friendly |
| Server data (API cache, pagination) | TanStack Query | Auto caching, revalidation, optimistic updates |
| Form state | React Hook Form | Uncontrolled mode, high performance, validation |
| Complex cross-component state | Zustand + immer | Clean immutable updates |

Do not introduce Redux at project start unless you specifically need time-travel debugging or its middleware ecosystem.

## Essential Packages

| Category | Package | Purpose |
|----------|---------|---------|
| Routing | `react-router-dom` | SPA route management |
| Styling | `tailwindcss` + `@tailwindcss/vite` | Utility-first CSS |
| Testing | `vitest` + `@testing-library/react` | Unit / component tests |
| State | `zustand` (as needed) | Lightweight global state |
| Data | `@tanstack/react-query` (as needed) | Server state management |
| Icons | `lucide-react` (as needed) | Lightweight SVG icon library |

## package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

## MUST DO

- Enable TypeScript `strict` mode
- Configure path aliases (`@/`) to avoid `../../../` relative paths
- Add lint, format, and test scripts to `package.json`
- Separate components by responsibility: `pages/` for routes, `components/` for reusables
- Write tests from day one -- at minimum one smoke test

## MUST NOT DO

- Never use `any` type -- use `unknown` and narrow if unsure
- Never make API calls directly in components -- extract to `lib/` or custom hooks
- Never skip ESLint config -- tech debt accumulates from day one
- Never dump all files in `src/` root -- create subdirectories even for small projects
- Never use Create React App -- it is unmaintained; Vite is the modern standard

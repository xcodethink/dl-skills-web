> Source: [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) | Category: Frontend | ⭐ Vercel Official

---
name: next-upgrade
description: Upgrade Next.js to the latest version following official migration guides and codemods
---

# Upgrade Next.js

## Overview

A systematic process to upgrade a project to the latest Next.js version using official migration guides and codemods. Covers version detection, automated transforms, dependency updates, breaking change review, and verification testing.

---

## Step-by-Step Instructions

### 1. Detect Current Version

Read `package.json` to identify the current Next.js version and related dependencies (React, React DOM, etc.).

### 2. Fetch the Latest Upgrade Guide

- Codemods: https://nextjs.org/docs/app/guides/upgrading/codemods
- Version-specific guides:
  - https://nextjs.org/docs/app/guides/upgrading/version-16
  - https://nextjs.org/docs/app/guides/upgrading/version-15
  - https://nextjs.org/docs/app/guides/upgrading/version-14

### 3. Determine Upgrade Path

For major version jumps, upgrade incrementally (e.g., 13 -> 14 -> 15 -> 16).

### 4. Run Codemods First

```bash
npx @next/codemod@latest <transform> <path>
```

Common transforms:
- `next-async-request-api` -- updates async Request APIs (v15)
- `next-request-geo-ip` -- migrates geo/ip properties (v15)
- `next-dynamic-access-named-export` -- transforms dynamic imports (v15)

### 5. Update Dependencies

```bash
npm install next@latest react@latest react-dom@latest
```

### 6. Review Breaking Changes

Check the upgrade guide for manual changes:
- API changes (e.g., async params in v15)
- Configuration changes in `next.config.js`
- Deprecated features being removed

### 7. Update TypeScript Types

```bash
npm install @types/react@latest @types/react-dom@latest
```

### 8. Test the Upgrade

- Run `npm run build` to check for build errors
- Run `npm run dev` and test key functionality

---

## Key Changes Between Versions

### Next.js 14 -> 15

- `params` and `searchParams` become async (Promise)
- `cookies()` and `headers()` become async
- Codemod: `npx @next/codemod@latest next-async-request-api .`

### Next.js 15 -> 16

- `middleware.ts` renamed to `proxy.ts`
- `experimental.ppr` replaced by `cacheComponents: true`
- `unstable_cache()` replaced by `'use cache'` directive
- Upgrade tool: `npx @next/codemod@latest upgrade`

---

## Best Practices

1. **Upgrade incrementally** -- don't skip major versions
2. **Run codemods first** -- automate what can be automated
3. **Build after each step** -- catch errors early
4. **Read the changelog** -- official docs are the authoritative migration reference
5. **Test critical paths** -- focus on core business functionality after upgrade

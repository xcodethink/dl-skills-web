> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Frontend Development

---
name: web-frameworks
description: Use when building modern full-stack web apps with Next.js, Turborepo, and RemixIcon. Covers SSR/SSG, React Server Components, App Router, monorepo setup, build optimization, and consistent icon systems.
---

# Web Frameworks

## Overview

Comprehensive guide for building modern full-stack web applications using Next.js, Turborepo, and RemixIcon. Covers the complete lifecycle from project setup to production deployment.

- **Next.js** - React framework with SSR, SSG, RSC, and built-in optimizations
- **Turborepo** - High-performance monorepo build system for JavaScript/TypeScript
- **RemixIcon** - Icon library with 3,100+ stroke and fill style icons

## When to Use

- Building new full-stack web applications with modern React
- Setting up monorepos with multiple apps and shared packages
- Implementing server-side rendering (SSR) and static generation (SSG)
- Optimizing build performance with smart caching
- Creating consistent UI with a professional icon system
- Managing workspace dependencies across projects
- Deploying production-ready applications with proper optimization

---

## Stack Selection Guide

### Standalone App: Next.js + RemixIcon

For building individual applications:
- E-commerce sites
- Marketing websites
- SaaS applications
- Documentation sites
- Blogs and content platforms

**Setup:**
```bash
npx create-next-app@latest my-app
cd my-app
npm install remixicon
```

### Monorepo: Next.js + Turborepo + RemixIcon

For building multiple apps sharing code:
- Microfrontends
- Multi-tenant platforms
- Internal tools with shared component libraries
- Multiple apps (web, admin, mobile-web) sharing logic
- Design systems + documentation sites

**Setup:**
```bash
npx create-turbo@latest my-monorepo
# Then configure Next.js apps in apps/
# Install remixicon in shared UI package
```

### Framework Feature Comparison

| Feature | Next.js | Turborepo | RemixIcon |
|---------|---------|-----------|-----------|
| Primary Use | Web framework | Build system | UI icons |
| Best For | SSR/SSG apps | Monorepo | Consistent icon system |
| Performance | Built-in optimizations | Caching & parallel tasks | Lightweight font/SVG |
| TypeScript | Full support | Full support | Type definitions available |

---

## Quick Start

### Next.js App

```bash
# Create new project
npx create-next-app@latest my-app
cd my-app

# Install RemixIcon
npm install remixicon

# Import in layout
# app/layout.tsx
import 'remixicon/fonts/remixicon.css'

# Start development
npm run dev
```

### Turborepo Monorepo

```bash
# Create monorepo
npx create-turbo@latest my-monorepo
cd my-monorepo

# Directory structure:
# apps/web/          - Next.js app
# apps/docs/         - Documentation site
# packages/ui/       - Shared components with RemixIcon
# packages/config/   - Shared configuration
# turbo.json         - Pipeline configuration

# Run all apps
npm run dev

# Build all packages
npm run build
```

### RemixIcon Integration

```tsx
// Web font approach (HTML/CSS)
<i className="ri-home-line"></i>
<i className="ri-search-fill ri-2x"></i>

// React component approach
import { RiHomeLine, RiSearchFill } from "@remixicon/react"
<RiHomeLine size={24} />
<RiSearchFill size={32} color="blue" />
```

---

## Next.js App Router Architecture

### File Conventions

Special files define route behavior:

| File | Purpose |
|------|---------|
| `page.tsx` | Page UI, makes route publicly accessible |
| `layout.tsx` | Shared UI wrapper for segment and child routes |
| `loading.tsx` | Loading UI, auto-wraps page in Suspense |
| `error.tsx` | Error UI, wraps page in Error Boundary |
| `not-found.tsx` | 404 UI for route segment |
| `route.ts` | API endpoint (Route Handler) |
| `template.tsx` | Re-rendered layout (no state preservation) |
| `default.tsx` | Fallback page for parallel routes |

### Basic Routing

```
app/
+-- page.tsx              -> /
+-- about/
|   +-- page.tsx         -> /about
+-- blog/
|   +-- page.tsx         -> /blog
+-- contact/
    +-- page.tsx         -> /contact
```

### Dynamic Routes

```tsx
// app/blog/[slug]/page.tsx - Single parameter
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>
}
// Matches: /blog/hello-world, /blog/my-post

// app/shop/[...slug]/page.tsx - Catch-all segment
// Matches: /shop/clothes, /shop/clothes/shirts, /shop/clothes/shirts/red

// app/docs/[[...slug]]/page.tsx - Optional catch-all
// Matches: /docs, /docs/getting-started, /docs/api/reference
```

### Layouts

#### Root Layout (Required)

Must include `<html>` and `<body>` tags:

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>Global Header</header>
        {children}
        <footer>Global Footer</footer>
      </body>
    </html>
  )
}
```

#### Nested Layouts

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>Dashboard Navigation</nav>
      <main>{children}</main>
    </div>
  )
}
```

Layout characteristics:
- Preserve state during navigation
- Don't re-render when navigating between child routes
- Can fetch data
- Cannot access pathname or searchParams (use client components)

### Route Groups

Organize routes without affecting URL structure:

```
app/
+-- (marketing)/          # Group (doesn't affect URL)
|   +-- about/page.tsx   -> /about
|   +-- blog/page.tsx    -> /blog
+-- (shop)/
|   +-- products/page.tsx -> /products
|   +-- cart/page.tsx     -> /cart
+-- layout.tsx           # Root layout
```

### Parallel Routes

Render multiple pages simultaneously in the same layout:

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  team: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <>
      {children}
      <div className="grid grid-cols-2">
        {team}
        {analytics}
      </div>
    </>
  )
}
```

### Loading States

```tsx
// app/dashboard/loading.tsx - Auto-wrapped in Suspense
export default function Loading() {
  return <div className="spinner">Loading dashboard...</div>
}

// Manual Suspense - finer control
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>My Blog</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts />
      </Suspense>
    </div>
  )
}
```

### Error Handling

```tsx
// app/error.tsx - Must be client component
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Navigation

```tsx
// Link component
import Link from 'next/link'
<Link href="/about">About</Link>
<Link href={`/blog/${post.slug}`}>Read Post</Link>

// useRouter hook (client-side)
'use client'
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/dashboard')   // Navigate forward
router.replace('/login')     // Replace current
router.refresh()             // Refresh
router.back()                // Go back

// Server-side redirect
import { redirect } from 'next/navigation'
if (!session) {
  redirect('/login')
}
```

---

## Server Components

### Core Concepts

All components in `app/` are **server components by default**:

```tsx
// app/posts/page.tsx - Server component
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  )
}
```

**Advantages:**
- Fetch data on the server (direct database access)
- Keep sensitive data/secrets server-side
- Reduce client JavaScript bundle size
- Improve initial load and SEO
- Cache results on the server
- Stream content to the client

**Limitations:**
- Cannot use React hooks (useState, useEffect, useContext)
- Cannot use browser APIs (window, localStorage)
- Cannot add event listeners (onClick, onChange)

### Client Components

Mark with `'use client'` directive at the top of the file:

```tsx
// components/counter.tsx - Client component
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

**Use client components for:**
- Interactive UI (event handlers)
- State management (useState, useReducer)
- Side effects (useEffect, useLayoutEffect)
- Browser-only APIs (localStorage, geolocation)
- Custom React hooks
- Context consumers

### Composition Pattern

**Best practice:** Keep server components as parents, pass client components as children.

```tsx
// app/page.tsx - Server component
import { ClientProvider } from './client-provider'
import { ServerContent } from './server-content'

export default function Page() {
  return (
    <ClientProvider>
      <ServerContent /> {/* Stays as server component */}
    </ClientProvider>
  )
}
```

### Server Actions

Call server functions from client components:

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await db.post.create({ data: { title, content } })
  revalidatePath('/posts')
}

// Usage
<form action={createPost}>
  <input name="title" required />
  <textarea name="content" required />
  <button type="submit">Create Post</button>
</form>
```

### Suspense Streaming

```tsx
import { Suspense } from 'react'

async function SlowComponent() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  return <div>Loaded after 3 seconds</div>
}

export default function Page() {
  return (
    <div>
      <h1>Instantly rendered heading</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  )
}
```

**Benefits:**
- Fast components render immediately
- Slow components don't block the page
- Progressive enhancement
- Better perceived performance

### When to Use Which Component Type

| Use Server Components | Use Client Components |
|-----------------------|-----------------------|
| Fetch data from DB or API | Add interactivity (onClick, onChange) |
| Access backend resources directly | Manage state (useState) |
| Keep sensitive info server-side | Use lifecycle effects (useEffect) |
| Reduce client JavaScript | Use browser-only APIs |
| Render static content | Use custom React hooks |
| No interactivity needed | Use React Context |

---

## Data Fetching

### Optimized Data Fetching

```tsx
// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation'

// Static generation at build time
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({ slug: post.slug }))
}

// Revalidate every hour
async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 }
  })
  if (!res.ok) return null
  return res.json()
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return <article>{post.content}</article>
}
```

### Caching Strategies

```typescript
// Force cache (default)
fetch(url, { cache: 'force-cache' })

// Time-based revalidation
fetch(url, { next: { revalidate: 3600 } }) // Every hour

// No caching
fetch(url, { cache: 'no-store' })
```

---

## Turborepo

### Project Structure

```
my-monorepo/
+-- apps/
|   +-- web/              # Customer-facing Next.js app
|   +-- admin/            # Admin panel Next.js app
|   +-- docs/             # Documentation site
+-- packages/
|   +-- ui/               # Shared UI with RemixIcon
|   +-- api-client/       # API client library
|   +-- config/           # ESLint, TypeScript configs
|   +-- types/            # Shared TypeScript types
+-- turbo.json            # Build pipeline
```

### Pipeline Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### Shared Component Library Pattern

```tsx
// packages/ui/src/button.tsx
import { RiLoader4Line } from "@remixicon/react"

export function Button({ children, loading, icon }) {
  return (
    <button>
      {loading ? <RiLoader4Line className="animate-spin" /> : icon}
      {children}
    </button>
  )
}

// apps/web/app/page.tsx
import { Button } from "@repo/ui/button"
import { RiHomeLine } from "@remixicon/react"

export default function Page() {
  return <Button icon={<RiHomeLine />}>Home</Button>
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npx turbo run build test lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

---

## Best Practices

### Next.js

- Default to Server Components, use Client Components only when needed
- Implement proper loading and error states
- Use Image component for automatic optimization
- Set up proper metadata for SEO
- Leverage caching strategies (force-cache, revalidate, no-store)

### Turborepo

- Clean separation of monorepo structure (apps/, packages/)
- Properly define task dependencies (^build for topological ordering)
- Configure outputs for correct caching
- Enable remote caching for team collaboration
- Use filters to run tasks only on changed packages

### RemixIcon

- Use line style for minimal interfaces, fill style for emphasis
- Maintain 24x24 grid alignment for crisp rendering
- Provide aria-labels for accessibility
- Use currentColor for flexible theming
- Prefer web fonts for multiple icons, SVG for single icons

---

## Implementation Checklist

When building with this stack:

- [ ] Create project structure (standalone or monorepo)
- [ ] Configure TypeScript and ESLint
- [ ] Set up Next.js App Router
- [ ] Configure Turborepo pipeline (if monorepo)
- [ ] Install and configure RemixIcon
- [ ] Implement routes and layouts
- [ ] Add loading and error states
- [ ] Configure image and font optimization
- [ ] Set up data fetching patterns
- [ ] Configure caching strategies
- [ ] Add API routes as needed
- [ ] Implement shared component library (if monorepo)
- [ ] Configure remote caching (if monorepo)
- [ ] Set up CI/CD pipeline
- [ ] Configure deployment platform

---

## External Resources

- Next.js: https://nextjs.org/docs
- Turborepo: https://turbo.build/repo/docs
- RemixIcon: https://remixicon.com

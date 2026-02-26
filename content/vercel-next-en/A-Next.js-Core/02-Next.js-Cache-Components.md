> Source: [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) | Category: Frontend | ⭐ Vercel Official

---
name: next-cache-components
description: Next.js 16 Cache Components - PPR, use cache directive, cacheLife, cacheTag, updateTag
---

# Cache Components (Next.js 16+)

## Overview

Cache Components enable Partial Prerendering (PPR) -- mix static, cached, and dynamic content in a single route. This replaces the old `experimental.ppr` flag and `unstable_cache()` API with the `'use cache'` directive.

---

## Enable Cache Components

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

---

## Three Content Types

### 1. Static (Auto-Prerendered)

Synchronous code, imports, pure computations -- prerendered at build time.

### 2. Cached (`use cache`)

Async data that doesn't need fresh fetches every request:

```tsx
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  const posts = await db.posts.findMany()
  return <PostList posts={posts} />
}
```

### 3. Dynamic (Suspense)

Runtime data that must be fresh -- wrap in Suspense:

```tsx
<Suspense fallback={<p>Loading...</p>}>
  <UserPreferences />
</Suspense>

async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value
  return <p>Theme: {theme}</p>
}
```

---

## `use cache` Directive

Works at three levels:

```tsx
// File level
'use cache'
export default async function Page() { ... }

// Component level
export async function CachedComponent() {
  'use cache'
  ...
}

// Function level
export async function getData() {
  'use cache'
  return db.query('SELECT * FROM posts')
}
```

---

## Cache Profiles

### Built-in

| Profile | Description |
|---------|-------------|
| `'use cache'` | Default: 5m stale, 15m revalidate |
| `'use cache: remote'` | Platform-provided cache (Redis, KV) |
| `'use cache: private'` | Allows runtime APIs for compliance |

### `cacheLife()` -- Custom Lifetime

```tsx
import { cacheLife } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('hours')  // Built-in: 'default', 'minutes', 'hours', 'days', 'weeks', 'max'
  return fetch('/api/data')
}
```

### Inline Configuration

```tsx
async function getData() {
  'use cache'
  cacheLife({
    stale: 3600,      // 1 hour
    revalidate: 7200, // 2 hours
    expire: 86400,    // 1 day
  })
  return fetch('/api/data')
}
```

---

## Cache Invalidation

### `cacheTag()` -- Tag Content

```tsx
import { cacheTag } from 'next/cache'

async function getProduct(id: string) {
  'use cache'
  cacheTag('products', `product-${id}`)
  return db.products.findUnique({ where: { id } })
}
```

### `updateTag()` -- Immediate (Same Request)

```tsx
'use server'
import { updateTag } from 'next/cache'

export async function updateProduct(id: string, data: FormData) {
  await db.products.update({ where: { id }, data })
  updateTag(`product-${id}`)
}
```

### `revalidateTag()` -- Background (Next Request)

```tsx
'use server'
import { revalidateTag } from 'next/cache'

export async function createPost(data: FormData) {
  await db.posts.create({ data })
  revalidateTag('posts')
}
```

---

## Runtime Data Constraint

Cannot access `cookies()`, `headers()`, or `searchParams` inside `use cache`.

**Solution: Pass as arguments** -- the argument becomes part of the cache key automatically.

```tsx
async function ProfilePage() {
  const session = (await cookies()).get('session')?.value
  return <CachedProfile sessionId={session} />
}

async function CachedProfile({ sessionId }: { sessionId: string }) {
  'use cache'
  const data = await fetchUserData(sessionId)
  return <div>{data.name}</div>
}
```

**Exception:** `'use cache: private'` allows runtime APIs when you can't refactor.

---

## Cache Key Generation

Keys are automatic based on:
- **Build ID** -- invalidates all caches on deploy
- **Function ID** -- hash of function location
- **Serializable arguments** -- props become part of key
- **Closure variables** -- outer scope values included

---

## Complete Example

```tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

export default function DashboardPage() {
  return (
    <>
      <header><h1>Dashboard</h1></header>
      <nav>...</nav>
      <Stats />
      <Suspense fallback={<NotificationsSkeleton />}>
        <Notifications />
      </Suspense>
    </>
  )
}

async function Stats() {
  'use cache'
  cacheLife('hours')
  cacheTag('dashboard-stats')
  const stats = await db.stats.aggregate()
  return <StatsDisplay stats={stats} />
}

async function Notifications() {
  const userId = (await cookies()).get('userId')?.value
  const notifications = await db.notifications.findMany({
    where: { userId, read: false }
  })
  return <NotificationList items={notifications} />
}
```

---

## Migration from Previous Versions

| Old Config | Replacement |
|-----------|-------------|
| `experimental.ppr` | `cacheComponents: true` |
| `dynamic = 'force-dynamic'` | Remove (default behavior) |
| `dynamic = 'force-static'` | `'use cache'` + `cacheLife('max')` |
| `revalidate = N` | `cacheLife({ revalidate: N })` |
| `unstable_cache()` | `'use cache'` directive |

Key differences from `unstable_cache`:
- No manual cache keys needed (auto-generated from arguments/closures)
- Tags via `cacheTag()` instead of `options.tags`
- Revalidation via `cacheLife()` instead of `options.revalidate`

---

## Limitations

- Edge runtime not supported (requires Node.js)
- Static export not supported (needs server)
- Non-deterministic values (`Math.random()`, `Date.now()`) execute once at build time

For request-time randomness, use `await connection()` from `next/server`.

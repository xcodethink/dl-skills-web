> Source: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Category: Frontend | ⭐ Vercel Official

---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
---

# React Best Practices

## Overview

Comprehensive performance optimization guide from Vercel Engineering for React and Next.js applications. 57 rules across 8 categories, prioritized by impact from critical (eliminating waterfalls, reducing bundle size) to incremental (advanced patterns). Each rule includes incorrect/correct code examples.

## Rule Categories

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Eliminating Waterfalls | CRITICAL |
| 2 | Bundle Size Optimization | CRITICAL |
| 3 | Server-Side Performance | HIGH |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH |
| 5 | Re-render Optimization | MEDIUM |
| 6 | Rendering Performance | MEDIUM |
| 7 | JavaScript Performance | LOW-MEDIUM |
| 8 | Advanced Patterns | LOW |

---

## 1. Eliminating Waterfalls — CRITICAL

The #1 performance killer. Each sequential await adds full network latency.

### 1.1 Defer Await Until Needed

Move `await` into branches where actually used to avoid blocking unused code paths.

**Incorrect:**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  if (skipProcessing) {
    return { skipped: true }
  }
  return processUserData(userData)
}
```

**Correct:**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    return { skipped: true }
  }
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

### 1.2 Dependency-Based Parallelization — 2-10x improvement

For operations with partial dependencies, use `better-all` or chain promises to maximize parallelism.

**Incorrect:**

```typescript
const [user, config] = await Promise.all([fetchUser(), fetchConfig()])
const profile = await fetchProfile(user.id)
```

**Correct:**

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```

### 1.3 Prevent Waterfall Chains in API Routes

Start independent operations immediately, even if you don't await them yet.

**Incorrect:**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**Correct:**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}
```

### 1.4 Promise.all() for Independent Operations

**Incorrect:** `const user = await fetchUser(); const posts = await fetchPosts()`

**Correct:** `const [user, posts] = await Promise.all([fetchUser(), fetchPosts()])`

### 1.5 Strategic Suspense Boundaries

Use Suspense to show wrapper UI faster while data loads.

**Correct:**

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData()
  return <div>{data.content}</div>
}
```

---

## 2. Bundle Size Optimization — CRITICAL

### 2.1 Avoid Barrel File Imports — 200-800ms import cost

Import directly from source files, not barrel files.

**Incorrect:** `import { Check, X } from 'lucide-react'`

**Correct:** `import Check from 'lucide-react/dist/esm/icons/check'`

Or use Next.js `optimizePackageImports` in config.

### 2.2 Conditional Module Loading

Load large modules only when a feature is activated with dynamic `import()`.

### 2.3 Defer Non-Critical Third-Party Libraries

Load analytics/logging after hydration using `next/dynamic` with `{ ssr: false }`.

### 2.4 Dynamic Imports for Heavy Components

**Incorrect:** `import { MonacoEditor } from './monaco-editor'`

**Correct:**

```tsx
const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)
```

### 2.5 Preload Based on User Intent

Preload heavy bundles on hover/focus to reduce perceived latency.

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => { void import('./monaco-editor') }
  return (
    <button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
      Open Editor
    </button>
  )
}
```

---

## 3. Server-Side Performance — HIGH

### 3.1 Authenticate Server Actions Like API Routes

Server Actions are public endpoints. Always verify auth inside each action.

```typescript
'use server'
export async function deleteUser(userId: string) {
  const session = await verifySession()
  if (!session) throw unauthorized('Must be logged in')
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }
  await db.user.delete({ where: { id: userId } })
}
```

### 3.2 Avoid Duplicate Serialization in RSC Props

RSC serialization deduplicates by reference, not value. Do `.toSorted()`, `.filter()`, `.map()` in client, not server.

**Incorrect:** `<ClientList usernames={usernames} sorted={usernames.toSorted()} />`

**Correct:** `<ClientList usernames={usernames} />` — sort in client.

### 3.3 Cross-Request LRU Caching

Use LRU cache for data shared across requests (React.cache only works within one request).

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({ max: 1000, ttl: 5 * 60 * 1000 })

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached
  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}
```

### 3.4 Minimize Serialization at RSC Boundaries

Only pass fields the client actually uses across the server/client boundary.

**Incorrect:** `<Profile user={user} />` (50 fields, uses 1)

**Correct:** `<Profile name={user.name} />`

### 3.5 Parallel Data Fetching with Component Composition

Restructure RSC trees so sibling components fetch in parallel instead of sequentially.

```tsx
export default function Page() {
  return (
    <div>
      <Header />   {/* fetches independently */}
      <Sidebar />  {/* fetches independently */}
    </div>
  )
}
```

### 3.6 Per-Request Deduplication with React.cache()

```typescript
export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({ where: { id: session.user.id } })
})
```

Avoid inline objects as arguments (uses `Object.is` for cache keys).

### 3.7 Use after() for Non-Blocking Operations

Schedule logging/analytics after response is sent with Next.js `after()`.

```tsx
import { after } from 'next/server'

export async function POST(request: Request) {
  await updateDatabase(request)
  after(async () => { logUserAction({ userAgent }) })
  return new Response(JSON.stringify({ status: 'success' }))
}
```

---

## 4. Client-Side Data Fetching — MEDIUM-HIGH

### 4.1 Deduplicate Global Event Listeners

Use `useSWRSubscription()` to share a single listener across N component instances.

### 4.2 Use Passive Event Listeners

Add `{ passive: true }` to touch/wheel listeners for immediate scrolling.

### 4.3 Use SWR for Automatic Deduplication

```tsx
const { data: users } = useSWR('/api/users', fetcher)
```

### 4.4 Version and Minimize localStorage Data

Add version prefix to keys, store only needed fields, always wrap in try-catch.

---

## 5. Re-render Optimization — MEDIUM

### 5.1 Calculate Derived State During Rendering

If a value can be computed from props/state, derive it — don't store in state or update via effect.

**Incorrect:** `const [fullName, setFullName] = useState(''); useEffect(() => setFullName(first + ' ' + last), [first, last])`

**Correct:** `const fullName = first + ' ' + last`

### 5.2 Defer State Reads to Usage Point

Don't subscribe to searchParams if you only read inside callbacks. Read `window.location.search` on demand.

### 5.3 Skip useMemo for Simple Primitive Expressions

`const isLoading = user.isLoading || notifications.isLoading` — no need for useMemo.

### 5.4 Hoist Default Non-Primitive Props to Constants

```tsx
const NOOP = () => {};
const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: Props) { ... })
```

### 5.5 Extract to Memoized Components

Extract expensive work into `memo()` components so loading states can skip computation.

### 5.6 Narrow Effect Dependencies

Use `[user.id]` instead of `[user]`. Use `[isMobile]` instead of `[width]`.

### 5.7 Put Interaction Logic in Event Handlers

Don't model user actions as state + effect. Run side effects directly in event handlers.

### 5.8 Subscribe to Derived State

Subscribe to `useMediaQuery('(max-width: 767px)')` instead of continuous `useWindowWidth()`.

### 5.9 Use Functional setState Updates

```tsx
// Stable callback, no stale closures
const addItems = useCallback((newItems: Item[]) => {
  setItems(curr => [...curr, ...newItems])
}, [])
```

### 5.10 Use Lazy State Initialization

Pass a function to `useState` for expensive initial values: `useState(() => buildSearchIndex(items))`.

### 5.11 Use Transitions for Non-Urgent Updates

Wrap frequent non-urgent updates in `startTransition()`.

### 5.12 Use useRef for Transient Values

Store frequently changing values (mouse position, scroll offset) in refs instead of state.

---

## 6. Rendering Performance — MEDIUM

### 6.1 Animate SVG Wrapper, Not SVG Element

Wrap SVG in `<div>` and animate the wrapper for hardware acceleration.

### 6.2 CSS content-visibility for Long Lists

`content-visibility: auto; contain-intrinsic-size: 0 80px;` — 10x faster initial render for 1000 items.

### 6.3 Hoist Static JSX Elements

Extract static JSX outside components: `const skeleton = <div className="..." />`

### 6.4 Optimize SVG Precision

Reduce coordinate precision: `npx svgo --precision=1 --multipass icon.svg`

### 6.5 Prevent Hydration Mismatch Without Flickering

Use inline `<script>` to set theme/client data before React hydrates.

### 6.6 Suppress Expected Hydration Mismatches

Use `suppressHydrationWarning` for timestamps, random IDs, locale formatting.

### 6.7 Use Activity Component for Show/Hide

`<Activity mode={isOpen ? 'visible' : 'hidden'}>` preserves state/DOM.

### 6.8 Use Explicit Conditional Rendering

Use `count > 0 ? <Badge /> : null` instead of `count && <Badge />` to avoid rendering `0`.

### 6.9 Use useTransition Over Manual Loading States

Built-in `isPending` replaces manual `setIsLoading(true/false)` pattern.

---

## 7. JavaScript Performance — LOW-MEDIUM

### 7.1 Avoid Layout Thrashing

Batch style writes together, then read — never interleave reads and writes.

### 7.2 Build Index Maps for Repeated Lookups

`new Map(users.map(u => [u.id, u]))` — O(1) per lookup instead of O(n).

### 7.3 Cache Property Access in Loops

`const value = obj.config.settings.value` before loop.

### 7.4 Cache Repeated Function Calls

Module-level `Map` cache for functions called repeatedly with same inputs.

### 7.5 Cache Storage API Calls

Cache `localStorage`/`sessionStorage` reads in a Map.

### 7.6 Combine Multiple Array Iterations

Replace 3x `.filter()` with single `for...of` loop.

### 7.7 Early Length Check for Array Comparisons

Check `current.length !== original.length` before expensive sort/compare.

### 7.8 Early Return from Functions

Return immediately on first error instead of continuing through all items.

### 7.9 Hoist RegExp Creation

Don't create RegExp inside render — hoist to module scope or `useMemo`.

### 7.10 Use Loop for Min/Max Instead of Sort

Single O(n) pass instead of O(n log n) sort.

### 7.11 Use Set/Map for O(1) Lookups

`new Set(['a', 'b', 'c'])` with `.has()` instead of `Array.includes()`.

### 7.12 Use toSorted() for Immutability

`.toSorted()` creates new array; `.sort()` mutates in place (breaks React immutability model).

---

## 8. Advanced Patterns — LOW

### 8.1 Initialize App Once, Not Per Mount

Use module-level `let didInit = false` guard in `useEffect` to prevent double init in dev mode.

### 8.2 Store Event Handlers in Refs

Use `useEffectEvent` for stable subscriptions that don't re-subscribe on callback changes.

### 8.3 useEffectEvent for Stable Callback Refs

Access latest values in callbacks without adding them to dependency arrays.

```tsx
const onSearchEvent = useEffectEvent(onSearch)
useEffect(() => {
  const timeout = setTimeout(() => onSearchEvent(query), 300)
  return () => clearTimeout(timeout)
}, [query])
```

---

## References

1. [react.dev](https://react.dev) | [nextjs.org](https://nextjs.org) | [swr.vercel.app](https://swr.vercel.app)
2. [better-all](https://github.com/shuding/better-all) | [node-lru-cache](https://github.com/isaacs/node-lru-cache)
3. [Optimized Package Imports](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js) | [Dashboard Perf](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

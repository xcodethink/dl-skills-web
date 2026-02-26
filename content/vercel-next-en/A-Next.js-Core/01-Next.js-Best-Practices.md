> Source: [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) | Category: Frontend | ⭐ Vercel Official

---
name: next-best-practices
description: Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling
---

# Next.js Best Practices

## Overview

Essential rules for writing and reviewing Next.js code. Covers file conventions, RSC boundaries, data fetching patterns, async APIs (Next.js 15+), metadata, error handling, route handlers, image/font optimization, bundling, and debugging. All sub-topics are consolidated below.

---

## File Conventions

Next.js App Router uses file-based routing with special conventions.

### Project Structure

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page (/)
├── loading.tsx         # Loading UI (Suspense boundary)
├── error.tsx           # Error UI (Error boundary)
├── not-found.tsx       # 404 UI
├── global-error.tsx    # Global error UI
├── route.ts            # API endpoint
├── template.tsx        # Re-rendered layout
├── default.tsx         # Parallel route fallback
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/
│       └── page.tsx    # /blog/:slug
└── (group)/            # Route group (no URL impact)
    └── page.tsx
```

### Route Segments

```
app/
├── blog/               # Static: /blog
├── [slug]/             # Dynamic: /:slug
├── [...slug]/          # Catch-all: /a/b/c
├── [[...slug]]/        # Optional catch-all: / or /a/b/c
└── (marketing)/        # Route group (ignored in URL)
```

### Middleware / Proxy

| Version | File | Export | Config |
|---------|------|--------|--------|
| v14-15 | `middleware.ts` | `middleware()` | `config` |
| v16+ | `proxy.ts` | `proxy()` | `proxyConfig` |

Run `npx @next/codemod@latest upgrade` to auto-rename.

---

## RSC Boundaries

### Rule 1: No Async Client Components

Client components cannot be async. Only Server Components can be async.

```tsx
// Bad: async client component
'use client'
export default async function UserProfile() {
  const user = await getUser()
  return <div>{user.name}</div>
}

// Good: fetch in server parent, pass data down
export default async function Page() {
  const user = await getUser()
  return <UserProfile user={user} />
}

'use client'
export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

### Rule 2: Serializable Props Only

Props passed from Server to Client must be JSON-serializable.

| Pattern | Valid? | Fix |
|---------|--------|-----|
| `'use client'` + `async function` | No | Fetch in server parent |
| Pass `() => {}` to client | No | Define in client or use server action |
| Pass `new Date()` to client | No | Use `.toISOString()` |
| Pass `new Map()` to client | No | Convert to object/array |
| Pass class instance to client | No | Pass plain object |
| Pass server action to client | Yes | - |
| Pass `string/number/boolean` | Yes | - |

---

## Async Patterns (Next.js 15+)

`params`, `searchParams`, `cookies()`, and `headers()` are asynchronous.

```tsx
// Pages and Layouts
type Props = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params
}

// Synchronous components: use React.use()
import { use } from 'react'
export default function Page({ params }: Props) {
  const { slug } = use(params)
}

// Cookies and Headers
const cookieStore = await cookies()
const headersList = await headers()
```

Migration codemod: `npx @next/codemod@latest next-async-request-api .`

---

## Runtime Selection

Default to Node.js runtime. Only use Edge when specifically required.

| Runtime | Use For |
|---------|---------|
| Node.js (default) | Full API support, fs, database, most npm packages |
| Edge | Specific edge-location latency needs, smaller cold start |

---

## Directives

| Directive | Type | Purpose |
|-----------|------|---------|
| `'use client'` | React | Client Component (hooks, events, browser APIs) |
| `'use server'` | React | Server Action (can be passed to client) |
| `'use cache'` | Next.js | Cache function/component (requires `cacheComponents: true`) |

---

## Functions Quick Reference

**Navigation Hooks (Client):** `useRouter`, `usePathname`, `useSearchParams`, `useParams`, `useSelectedLayoutSegment`

**Server Functions:** `cookies`, `headers`, `draftMode`, `after`, `connection`

**Generate Functions:** `generateStaticParams`, `generateMetadata`, `generateViewport`, `generateSitemaps`

Always use `next/link` for internal navigation instead of `<a>` tags.

---

## Error Handling

### Error Boundaries

- `error.tsx` -- catches errors in route segment (must be Client Component)
- `global-error.tsx` -- catches root layout errors (must include `<html>` and `<body>`)

### Navigation API Gotcha

Do NOT wrap navigation APIs (`redirect`, `notFound`, `forbidden`, `unauthorized`) in try-catch. They throw special errors handled by Next.js internally.

```tsx
// Bad: try-catch catches the navigation "error"
async function createPost(formData: FormData) {
  try {
    const post = await db.post.create({ ... })
    redirect(`/posts/${post.id}`)  // This throws!
  } catch (error) {
    return { error: 'Failed' }  // Navigation fails!
  }
}

// Good: navigation outside try-catch
async function createPost(formData: FormData) {
  let post
  try {
    post = await db.post.create({ ... })
  } catch (error) {
    return { error: 'Failed' }
  }
  redirect(`/posts/${post.id}`)
}
```

Use `unstable_rethrow()` to re-throw Next.js internal errors in catch blocks.

### Error Hierarchy

Errors bubble up to the nearest error boundary. Layout errors go to `global-error.tsx`.

---

## Data Patterns

### Decision Tree

- **Server Component read** -- fetch directly (preferred)
- **Client mutation** -- Server Action
- **Client read** -- pass from Server Component or Route Handler
- **External API / webhooks** -- Route Handler
- **Public REST API** -- Route Handler

### Avoiding Waterfalls

```tsx
// Bad: sequential
const user = await getUser();
const posts = await getPosts();

// Good: parallel
const [user, posts] = await Promise.all([getUser(), getPosts()]);

// Good: streaming with Suspense
<Suspense fallback={<Skeleton />}>
  <UserSection />
</Suspense>
```

### Quick Reference

| Pattern | Use Case | Caching |
|---------|----------|---------|
| Server Component fetch | Internal reads | Full Next.js caching |
| Server Action | Mutations | No |
| Route Handler | External APIs | GET can be cached |

---

## Route Handlers

```tsx
// app/api/users/route.ts
export async function GET() {
  return Response.json(await getUsers())
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json(await createUser(body), { status: 201 })
}
```

Key rules:
- `route.ts` and `page.tsx` cannot coexist in the same folder
- No React hooks or browser APIs in route handlers
- Prefer Server Actions for UI mutations, Route Handlers for external integrations

---

## Metadata & OG Images

- `metadata` and `generateMetadata` are Server Components only
- Use `next/og` (not `@vercel/og`) for OG image generation
- Use React `cache()` to avoid duplicate fetches between metadata and page

```tsx
export const metadata: Metadata = {
  title: { default: 'Site Name', template: '%s | Site Name' },
}
```

---

## Image Optimization

Always use `next/image` over `<img>`. Key points:
- Remote domains must be in `remotePatterns`
- Use `sizes` attribute for responsive images
- Use `priority` for above-the-fold LCP images
- Use `placeholder="blur"` to prevent layout shift

---

## Font Optimization

Always use `next/font` instead of `<link>` tags or CSS `@import`.

```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
```

Common mistakes: importing font in every component, missing `subsets`, using `@import` in CSS.

---

## Bundling

### Server-Incompatible Packages

| Solution | When |
|----------|------|
| `dynamic(() => import('pkg'), { ssr: false })` | Package uses `window`/`document` |
| `serverExternalPackages: ['pkg']` | Native bindings (sharp, bcrypt) |
| Client Component wrapper | Isolate browser-only code |

### Bundle Analysis (Next.js 16.1+)

```bash
next experimental-analyze
```

---

## Scripts

Use `next/script` instead of native `<script>` tags. Inline scripts need an `id`. Use `@next/third-parties` for Google Analytics/GTM.

---

## Hydration Errors

| Cause | Fix |
|-------|-----|
| Browser APIs (`window`) | Client component + mounted check |
| Date/time rendering | Render on client with `useEffect` |
| Random values | Use `useId()` |
| Invalid HTML nesting | Fix HTML structure |

---

## Suspense Boundaries

| Hook | Suspense Required |
|------|-------------------|
| `useSearchParams()` | Yes |
| `usePathname()` | Yes (dynamic routes) |
| `useParams()` | No |
| `useRouter()` | No |

---

## Parallel & Intercepting Routes

Key rules for modal patterns:
1. Every `@slot` must have `default.tsx` (returns `null`)
2. Use `router.back()` to close modals (not `router.push()`)
3. Interceptors match route segments, not filesystem paths

---

## Self-Hosting

- Use `output: 'standalone'` for Docker
- Custom cache handler needed for multi-instance ISR (Redis, S3)
- Copy `public/` and `.next/static/` separately
- Set `HOSTNAME="0.0.0.0"` for containers
- Always add a health check endpoint

---

## Debug Tricks

- **MCP endpoint**: `/_next/mcp` in dev for AI-assisted debugging (Next.js 16+ default)
- **Rebuild specific routes**: `next build --debug-build-paths "/dashboard"`

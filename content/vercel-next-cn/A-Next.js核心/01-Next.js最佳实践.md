> 来源：[vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) | 分类：前端编码 | ⭐ Vercel 官方

---
name: next-best-practices
description: Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling
---

# Next.js 最佳实践（Next.js Best Practices）

## 概述

本技能涵盖编写和审查 Next.js 代码时应遵循的最佳实践规则，包括文件约定、RSC 边界、数据模式、异步 API、元数据、错误处理、路由处理器、图片/字体优化、打包等方面。适用于 Next.js 15+ / 16+。

---

## 文件约定（File Conventions）

Next.js App Router 使用基于文件系统的路由机制，具有特殊的文件约定。

### 项目结构

```
app/
├── layout.tsx          # 根布局（必需）
├── page.tsx            # 首页 (/)
├── loading.tsx         # 加载中 UI
├── error.tsx           # 错误 UI
├── not-found.tsx       # 404 UI
├── global-error.tsx    # 全局错误 UI
├── route.ts            # API 端点
├── template.tsx        # 重新渲染的布局
├── default.tsx         # 并行路由回退
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/
│       └── page.tsx    # /blog/:slug
└── (group)/            # 路由分组（不影响 URL）
    └── page.tsx
```

### 特殊文件

| 文件 | 用途 |
|------|------|
| `page.tsx` | 路由段的 UI |
| `layout.tsx` | 段及其子级的共享 UI |
| `loading.tsx` | 加载中 UI（Suspense 边界） |
| `error.tsx` | 错误 UI（Error 边界） |
| `not-found.tsx` | 404 UI |
| `route.ts` | API 端点 |
| `template.tsx` | 类似 layout，但导航时重新渲染 |
| `default.tsx` | 并行路由的回退 |

### 路由段

```
app/
├── blog/               # 静态段: /blog
├── [slug]/             # 动态段: /:slug
├── [...slug]/          # 全捕获: /a/b/c
├── [[...slug]]/        # 可选全捕获: / 或 /a/b/c
└── (marketing)/        # 路由分组（URL 中忽略）
```

### 并行路由（Parallel Routes）

```
app/
├── @analytics/
│   └── page.tsx
├── @sidebar/
│   └── page.tsx
└── layout.tsx          # 接收 { analytics, sidebar } 作为 props
```

### 拦截路由（Intercepting Routes）

```
app/
├── feed/
│   └── page.tsx
├── @modal/
│   └── (.)photo/[id]/  # 从 /feed 拦截 /photo/[id]
│       └── page.tsx
└── photo/[id]/
    └── page.tsx
```

拦截约定：
- `(.)` - 同级
- `(..)` - 上一级
- `(..)(..)` - 上两级
- `(...)` - 从根目录

### 私有文件夹

```
app/
├── _components/        # 私有文件夹（不作为路由）
│   └── Button.tsx
└── page.tsx
```

以 `_` 为前缀可排除在路由之外。

### 中间件 / 代理（Middleware / Proxy）

**Next.js 14-15：`middleware.ts`**

```ts
// middleware.ts（项目根目录）
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 认证、重定向、重写等
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

**Next.js 16+：`proxy.ts`**

重命名以提高清晰度 - 功能相同，名称不同：

```ts
// proxy.ts（项目根目录）
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 与 middleware 相同的逻辑
  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

| 版本 | 文件 | 导出 | 配置 |
|------|------|------|------|
| v14-15 | `middleware.ts` | `middleware()` | `config` |
| v16+ | `proxy.ts` | `proxy()` | `proxyConfig` |

**迁移**：运行 `npx @next/codemod@latest upgrade` 可自动重命名。

---

## RSC 边界（RSC Boundaries）

检测并防止跨越服务器/客户端组件边界时的无效模式。

### 1. 异步客户端组件是无效的

客户端组件**不能**是 async 函数。只有服务器组件（Server Components）可以使用 async。

```tsx
// 错误：异步客户端组件
'use client'
export default async function UserProfile() {
  const user = await getUser() // 客户端组件中不能 await
  return <div>{user.name}</div>
}

// 正确：移除 async，在父级服务器组件中获取数据
// page.tsx（服务器组件 - 没有 'use client'）
export default async function Page() {
  const user = await getUser()
  return <UserProfile user={user} />
}

// UserProfile.tsx（客户端组件）
'use client'
export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

### 2. 传递给客户端组件的属性必须可序列化

从服务器 -> 客户端传递的 props 必须是 JSON 可序列化的。

**不可传递**：
- 函数（`'use server'` 标记的服务器操作除外）
- `Date` 对象
- `Map`、`Set`、`WeakMap`、`WeakSet`
- 类实例
- `Symbol`（除非全局注册）
- 循环引用

```tsx
// 错误：Date 对象（会静默变为字符串，然后崩溃）
// page.tsx（服务器）
export default async function Page() {
  const post = await getPost()
  return <PostCard createdAt={post.createdAt} /> // Date 对象
}

// 正确：在服务器端序列化为字符串
export default async function Page() {
  const post = await getPost()
  return <PostCard createdAt={post.createdAt.toISOString()} />
}

// PostCard.tsx（客户端）
'use client'
export function PostCard({ createdAt }: { createdAt: string }) {
  const date = new Date(createdAt)
  return <span>{date.getFullYear()}</span>
}
```

### 3. 服务器操作（Server Actions）是例外

标记了 `'use server'` 的函数**可以**传递给客户端组件。

```tsx
// actions.ts
'use server'
export async function submitForm(formData: FormData) {
  // 服务器端逻辑
}

// page.tsx（服务器）
import { submitForm } from './actions'
export default function Page() {
  return <ClientForm onSubmit={submitForm} /> // 合法！
}
```

### 快速参考

| 模式 | 合法？ | 修复方式 |
|------|--------|----------|
| `'use client'` + `async function` | 否 | 在服务器父级获取数据，传递给子级 |
| 传递 `() => {}` 给客户端 | 否 | 在客户端定义或使用服务器操作 |
| 传递 `new Date()` 给客户端 | 否 | 使用 `.toISOString()` |
| 传递 `new Map()` 给客户端 | 否 | 转换为对象/数组 |
| 传递类实例给客户端 | 否 | 传递纯对象 |
| 传递服务器操作给客户端 | 是 | - |
| 传递 `string/number/boolean` | 是 | - |
| 传递纯对象/数组 | 是 | - |

---

## 异步模式（Async Patterns）

在 Next.js 15+ 中，`params`、`searchParams`、`cookies()` 和 `headers()` 都是异步的。

### 异步 Params 和 SearchParams

始终将它们类型化为 `Promise<...>` 并 await。

```tsx
// 页面和布局
type Props = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params
}
```

```tsx
// 路由处理器
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
}
```

```tsx
// 同步组件使用 React.use()
import { use } from 'react'

type Props = { params: Promise<{ slug: string }> }

export default function Page({ params }: Props) {
  const { slug } = use(params)
}
```

### 异步 Cookies 和 Headers

```tsx
import { cookies, headers } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const headersList = await headers()

  const theme = cookieStore.get('theme')
  const userAgent = headersList.get('user-agent')
}
```

### 迁移代码修改工具

```bash
npx @next/codemod@latest next-async-request-api .
```

---

## 运行时选择（Runtime Selection）

默认使用 Node.js 运行时。仅当项目已经使用 Edge 运行时或有特定需求时才使用 Edge。

```tsx
// 推荐：默认 - 无需配置（使用 Node.js）
export default function Page() { ... }

// 谨慎使用：仅在已有使用或特别需要时
export const runtime = 'edge'
```

| 运行时 | 适用场景 |
|--------|----------|
| Node.js（默认） | 完整 Node.js API、文件系统访问、数据库连接、大多数 npm 包 |
| Edge | 特定的边缘位置延迟需求、更小的冷启动、地理分布需求 |

---

## 指令（Directives）

### React 指令

**`'use client'`** - 标记为客户端组件（Client Component）。需要使用 React hooks、事件处理器、浏览器 API 时使用。

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**`'use server'`** - 标记为服务器操作（Server Action）。可传递给客户端组件。

```tsx
'use server'

export async function submitForm(formData: FormData) {
  // 在服务器上运行
}
```

### Next.js 指令

**`'use cache'`** - 标记函数或组件进行缓存。属于 Next.js 缓存组件（Cache Components）。

```tsx
'use cache'

export async function getCachedData() {
  return await fetchData()
}
```

需要在 `next.config.ts` 中设置 `cacheComponents: true`。

---

## 函数（Functions）

### 导航 Hooks（客户端）

| Hook | 用途 |
|------|------|
| `useRouter` | 编程式导航（`push`、`replace`、`back`、`refresh`） |
| `usePathname` | 获取当前路径名 |
| `useSearchParams` | 读取 URL 搜索参数 |
| `useParams` | 访问动态路由参数 |
| `useSelectedLayoutSegment` | 激活的子段（一级） |
| `useSelectedLayoutSegments` | 布局下所有激活的段 |

### 服务器函数

| 函数 | 用途 |
|------|------|
| `cookies` | 读写 cookies |
| `headers` | 读取请求头 |
| `draftMode` | 启用 CMS 未发布内容预览 |
| `after` | 在响应流完成后运行代码 |
| `connection` | 等待连接后再动态渲染 |

### 生成函数

| 函数 | 用途 |
|------|------|
| `generateStaticParams` | 构建时预渲染动态路由 |
| `generateMetadata` | 动态元数据 |
| `generateViewport` | 动态视口配置 |
| `generateSitemaps` | 大型站点的多个站点地图 |

### 通用示例

**导航**：使用 `next/link` 替代 `<a>` 标签进行内部导航。

```tsx
// 错误：纯锚标签
<a href="/about">About</a>

// 正确：Next.js Link
import Link from 'next/link'
<Link href="/about">About</Link>
```

**响应后执行**：

```tsx
import { after } from 'next/server'

export async function POST(request: Request) {
  const data = await processRequest(request)

  after(async () => {
    await logAnalytics(data)
  })

  return Response.json({ success: true })
}
```

---

## 错误处理（Error Handling）

### 错误边界

**`error.tsx`** - 捕获路由段及其子级中的错误：

```tsx
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
      <h2>出错了！</h2>
      <button onClick={() => reset()}>重试</button>
    </div>
  )
}
```

**重要**：`error.tsx` 必须是客户端组件。

**`global-error.tsx`** - 捕获根布局中的错误。必须包含 `<html>` 和 `<body>` 标签。

### 服务器操作中的导航 API 陷阱

**不要将导航 API 包裹在 try-catch 中**。它们会抛出 Next.js 内部处理的特殊错误。

```tsx
'use server'

import { redirect } from 'next/navigation'

// 错误：try-catch 捕获了导航 "错误"
async function createPost(formData: FormData) {
  try {
    const post = await db.post.create({ ... })
    redirect(`/posts/${post.id}`)  // 这会 throw！
  } catch (error) {
    // redirect() 的 throw 被这里捕获 - 导航失败！
    return { error: '创建文章失败' }
  }
}

// 正确：将导航 API 放在 try-catch 之外
async function createPost(formData: FormData) {
  let post
  try {
    post = await db.post.create({ ... })
  } catch (error) {
    return { error: '创建文章失败' }
  }
  redirect(`/posts/${post.id}`)  // 在 try-catch 外部
}
```

使用 `unstable_rethrow()` 在 catch 块中重新抛出这些错误：

```tsx
import { unstable_rethrow } from 'next/navigation'

async function action() {
  try {
    // ...
    redirect('/success')
  } catch (error) {
    unstable_rethrow(error) // 重新抛出 Next.js 内部错误
    return { error: '出错了' }
  }
}
```

### 认证错误

```tsx
import { forbidden, unauthorized } from 'next/navigation'

async function Page() {
  const session = await getSession()

  if (!session) {
    unauthorized() // 渲染 unauthorized.tsx (401)
  }

  if (!session.hasAccess) {
    forbidden() // 渲染 forbidden.tsx (403)
  }

  return <Dashboard />
}
```

### 错误层级

错误会冒泡到最近的错误边界：

```
app/
├── error.tsx           # 捕获所有子级的错误
├── blog/
│   ├── error.tsx       # 捕获 /blog/* 中的错误
│   └── [slug]/
│       ├── error.tsx   # 捕获 /blog/[slug] 中的错误
│       └── page.tsx
└── layout.tsx          # 这里的错误进入 global-error.tsx
```

---

## 数据模式（Data Patterns）

### 决策树

```
需要获取数据？
├── 从服务器组件？
│   └── 使用：直接获取（无需 API）
│
├── 从客户端组件？
│   ├── 是变更操作（POST/PUT/DELETE）？
│   │   └── 使用：服务器操作（Server Action）
│   └── 是读取操作（GET）？
│       └── 使用：路由处理器 或 从服务器组件传递
│
├── 需要外部 API 访问（webhooks、第三方）？
│   └── 使用：路由处理器（Route Handler）
│
└── 需要 REST API 供移动应用/外部客户端使用？
    └── 使用：路由处理器（Route Handler）
```

### 模式 1：服务器组件（读取首选）

```tsx
async function UsersPage() {
  // 直接数据库访问 - 无 API 往返
  const users = await db.user.findMany();
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### 模式 2：服务器操作（变更首选）

```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}
```

### 模式 3：路由处理器（API）

用于外部集成和公开 API。

### 避免数据瀑布

```tsx
// 错误：顺序请求
async function Dashboard() {
  const user = await getUser();        // 等待...
  const posts = await getPosts();      // 再等待...
  const comments = await getComments(); // 再等待...
}

// 正确：并行请求
async function Dashboard() {
  const [user, posts, comments] = await Promise.all([
    getUser(),
    getPosts(),
    getComments(),
  ]);
}

// 正确：使用 Suspense 流式显示
import { Suspense } from 'react';

async function Dashboard() {
  return (
    <div>
      <Suspense fallback={<UserSkeleton />}>
        <UserSection />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsSection />
      </Suspense>
    </div>
  );
}
```

### 快速参考

| 模式 | 使用场景 | HTTP 方法 | 缓存 |
|------|----------|-----------|------|
| 服务器组件获取 | 内部读取 | 任意 | 完整 Next.js 缓存 |
| 服务器操作 | 变更、表单提交 | 仅 POST | 否 |
| 路由处理器 | 外部 API、webhooks | 任意 | GET 可缓存 |
| 客户端请求 API | 客户端读取 | 任意 | HTTP 缓存头 |

---

## 路由处理器（Route Handlers）

### 基本用法

```tsx
// app/api/users/route.ts
export async function GET() {
  const users = await getUsers()
  return Response.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await createUser(body)
  return Response.json(user, { status: 201 })
}
```

### 关键规则

- **`route.ts` 和 `page.tsx` 不能在同一文件夹中共存**
- 路由处理器运行在类似服务器组件的环境中：可以使用 `async/await`、`cookies()`、`headers()`、Node.js API，但**不能**使用 React hooks 或浏览器 API

### 路由处理器 vs 服务器操作

| 使用场景 | 路由处理器 | 服务器操作 |
|----------|------------|------------|
| 表单提交 | 否 | 是 |
| UI 数据变更 | 否 | 是 |
| 第三方 webhooks | 是 | 否 |
| 外部 API 消费 | 是 | 否 |
| 公开 REST API | 是 | 否 |

---

## 元数据与 OG 图片（Metadata & OG Images）

### 重要：仅限服务器组件

`metadata` 对象和 `generateMetadata` 函数**仅在服务器组件中支持**。

### 静态元数据

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '页面标题',
  description: '搜索引擎的页面描述',
}
```

### 动态元数据

```tsx
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return { title: post.title, description: post.description }
}
```

### OG 图片生成

使用 `next/og`（不是 `@vercel/og`，它已内置在 Next.js 中）：

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const alt = 'Site Name'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        fontSize: 128, background: 'white',
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        Hello World
      </div>
    ),
    { ...size }
  )
}
```

---

## 图片优化（Image Optimization）

### 始终使用 next/image

```tsx
// 错误：原生 img
<img src="/hero.png" alt="Hero" />

// 正确：使用 next/image
import Image from 'next/image'
<Image src="/hero.png" alt="Hero" width={800} height={400} />
```

### 关键要点

- 远程图片域名必须在 `next.config.js` 的 `remotePatterns` 中配置
- 使用 `sizes` 属性告诉浏览器下载哪个尺寸
- 使用 `placeholder="blur"` 防止布局偏移
- 对首屏图片（LCP）使用 `priority` 属性

---

## 字体优化（Font Optimization）

### 始终使用 next/font

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Tailwind CSS 集成

```tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
```

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
}
```

### 常见错误

- 不要在每个组件中导入字体（会创建新实例）
- 不要在 CSS 中使用 `@import` 引入字体（阻塞渲染）
- 不要使用 `<link>` 标签手动引入 Google Fonts
- 始终指定 `subsets`

---

## 打包（Bundling）

### 服务器不兼容的包

某些包使用浏览器 API（`window`、`document`），在服务器组件中会失败。

**解决方案 1：标记为仅客户端**

```tsx
import dynamic from 'next/dynamic'

const SomeChart = dynamic(() => import('some-chart-library'), {
  ssr: false,
})
```

**解决方案 2：从服务器包中外部化**

```js
// next.config.js
module.exports = {
  serverExternalPackages: ['problematic-package'],
}
```

**解决方案 3：客户端组件包装器**

```tsx
// components/ChartWrapper.tsx
'use client'

import { Chart } from 'chart-library'

export function ChartWrapper(props) {
  return <Chart {...props} />
}
```

### 常见问题包

| 包 | 问题 | 解决方案 |
|---|------|---------|
| `sharp` | 原生绑定 | `serverExternalPackages: ['sharp']` |
| `recharts` | 使用 window | `dynamic(() => import('recharts'), { ssr: false })` |
| `react-quill` | 使用 document | `dynamic(() => import('react-quill'), { ssr: false })` |
| `mapbox-gl` | 使用 window | `dynamic(() => import('mapbox-gl'), { ssr: false })` |

### 包分析

```bash
# Next.js 16.1+
next experimental-analyze
```

---

## 脚本（Scripts）

始终使用 `next/script` 而非原生 `<script>` 标签。内联脚本需要 `id` 属性。

```tsx
import Script from 'next/script'

// 推荐：使用 @next/third-parties 加载 Google Analytics
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Layout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXX" />
    </html>
  )
}
```

---

## 水合错误（Hydration Errors）

### 常见原因及修复

| 原因 | 修复方式 |
|------|----------|
| 浏览器 API（`window.innerWidth`） | 使用客户端组件 + mounted 检查 |
| 日期/时间渲染 | 在客户端使用 `useEffect` 渲染 |
| 随机值或 ID | 使用 `useId()` hook |
| 无效 HTML 嵌套（如 `<p>` 内嵌 `<div>`） | 修复 HTML 结构 |
| 第三方脚本修改 DOM | 使用 `next/script` 并设置 `strategy="afterInteractive"` |

---

## Suspense 边界（Suspense Boundaries）

| Hook | 是否需要 Suspense |
|------|-------------------|
| `useSearchParams()` | 是 |
| `usePathname()` | 是（动态路由） |
| `useParams()` | 否 |
| `useRouter()` | 否 |

```tsx
// 正确：用 Suspense 包裹
import { Suspense } from 'react'
import SearchBar from './search-bar'

export default function Page() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <SearchBar />
    </Suspense>
  )
}
```

---

## 并行与拦截路由（Parallel & Intercepting Routes）

### 模态框模式的关键要点

1. **每个并行路由插槽必须有 `default.tsx`** - 防止硬导航时出现 404
2. **使用 `router.back()` 关闭模态框** - 不要用 `router.push()` 或 `<Link>`
3. 拦截路由匹配的是**路由段**，不是文件系统路径

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```

```tsx
// app/@modal/default.tsx - 关键！
export default function Default() {
  return null;
}
```

---

## 自托管（Self-Hosting）

### Docker 部署

在 `next.config.js` 中设置 `output: 'standalone'`，然后使用标准 Docker 多阶段构建。

### ISR 与缓存处理器

对于多实例部署，文件系统缓存会失效。需要自定义缓存处理器（Redis、S3 等）。

```js
// next.config.js
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // 禁用内存缓存
};
```

### 部署前检查清单

1. 本地先构建：`npm run build`
2. 测试 standalone 输出：`node .next/standalone/server.js`
3. 设置 `output: 'standalone'`（Docker 环境）
4. 配置缓存处理器（多实例 ISR）
5. 设置 `HOSTNAME="0.0.0.0"`（容器环境）
6. 复制 `public/` 和 `.next/static/`
7. 添加健康检查端点

---

## 调试技巧（Debug Tricks）

### MCP 端点（开发服务器）

Next.js 在开发模式下暴露 `/_next/mcp` 端点，用于 AI 辅助调试。

- **Next.js 16+**：默认启用，使用 `next-devtools-mcp`
- **Next.js < 16**：需要在 next.config.js 中设置 `experimental.mcpServer: true`

可用工具：`get_errors`、`get_routes`、`get_project_metadata`、`get_page_metadata`、`get_logs`、`get_server_action_by_id`

### 重建特定路由（Next.js 16+）

```bash
# 重建特定路由
next build --debug-build-paths "/dashboard"

# 重建匹配 glob 的路由
next build --debug-build-paths "/api/*"
```

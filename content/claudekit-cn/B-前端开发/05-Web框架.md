> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：前端开发

# Web 框架技能组

使用 Next.js、Turborepo 和 RemixIcon 构建现代全栈 Web 应用的综合指南。

## 概览

本技能组结合三个强大的 Web 开发工具：

- **Next.js** - 支持 SSR、SSG、RSC 和优化功能的 React 框架
- **Turborepo** - 面向 JavaScript/TypeScript 的高性能 Monorepo 构建系统
- **RemixIcon** - 提供 3,100+ 描边和填充风格图标的图标库

## 适用场景

- 使用现代 React 构建新的全栈 Web 应用
- 搭建包含多个应用和共享包的 Monorepo
- 实现服务端渲染（SSR）和静态生成（SSG）
- 通过智能缓存优化构建性能
- 使用专业图标体系创建一致的 UI
- 管理多项目间的工作区依赖
- 部署经过适当优化的生产就绪应用

---

## 技术栈选择指南

### 单体应用：Next.js + RemixIcon

适用于构建独立应用：
- 电商网站
- 营销网站
- SaaS 应用
- 文档站点
- 博客和内容平台

**设置：**
```bash
npx create-next-app@latest my-app
cd my-app
npm install remixicon
```

### Monorepo：Next.js + Turborepo + RemixIcon

适用于构建多个共享代码的应用：
- 微前端（Microfrontends）
- 多租户平台
- 带共享组件库的内部工具
- 多应用（web、admin、mobile-web）共享逻辑
- 设计系统 + 文档站点

**设置：**
```bash
npx create-turbo@latest my-monorepo
# 然后在 apps/ 目录配置 Next.js 应用
# 在共享 UI 包中安装 remixicon
```

### 框架功能对比

| 特性 | Next.js | Turborepo | RemixIcon |
|------|---------|-----------|-----------|
| 主要用途 | Web 框架 | 构建系统 | UI 图标 |
| 最适合 | SSR/SSG 应用 | Monorepo | 一致的图标体系 |
| 性能 | 内置优化 | 缓存与并行任务 | 轻量字体/SVG |
| TypeScript | 完全支持 | 完全支持 | 类型定义可用 |

---

## 快速开始

### Next.js 应用

```bash
# 创建新项目
npx create-next-app@latest my-app
cd my-app

# 安装 RemixIcon
npm install remixicon

# 在布局中导入
# app/layout.tsx
import 'remixicon/fonts/remixicon.css'

# 启动开发
npm run dev
```

### Turborepo Monorepo

```bash
# 创建 monorepo
npx create-turbo@latest my-monorepo
cd my-monorepo

# 目录结构：
# apps/web/          - Next.js 应用
# apps/docs/         - 文档站点
# packages/ui/       - 含 RemixIcon 的共享组件
# packages/config/   - 共享配置
# turbo.json         - 管道配置

# 运行所有应用
npm run dev

# 构建所有包
npm run build
```

### RemixIcon 集成

```tsx
// Web 字体方式（HTML/CSS）
<i className="ri-home-line"></i>
<i className="ri-search-fill ri-2x"></i>

// React 组件方式
import { RiHomeLine, RiSearchFill } from "@remixicon/react"
<RiHomeLine size={24} />
<RiSearchFill size={32} color="blue" />
```

---

## Next.js App Router 架构

### 文件约定

特殊文件定义路由行为：

| 文件 | 用途 |
|------|------|
| `page.tsx` | 页面 UI，使路由可公开访问 |
| `layout.tsx` | 段和子路由的共享 UI 包裹器 |
| `loading.tsx` | 加载 UI，自动将页面包裹在 Suspense 中 |
| `error.tsx` | 错误 UI，将页面包裹在错误边界（Error Boundary）中 |
| `not-found.tsx` | 路由段的 404 UI |
| `route.ts` | API 端点（路由处理器） |
| `template.tsx` | 重新渲染的布局（不保留状态） |
| `default.tsx` | 并行路由的回退页面 |

### 基本路由

```
app/
├── page.tsx              -> /
├── about/
│   └── page.tsx         -> /about
├── blog/
│   └── page.tsx         -> /blog
└── contact/
    └── page.tsx         -> /contact
```

### 动态路由

```tsx
// app/blog/[slug]/page.tsx - 单参数
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>文章: {params.slug}</h1>
}
// 匹配: /blog/hello-world, /blog/my-post

// app/shop/[...slug]/page.tsx - 全捕获段
// 匹配: /shop/clothes, /shop/clothes/shirts, /shop/clothes/shirts/red

// app/docs/[[...slug]]/page.tsx - 可选全捕获
// 匹配: /docs, /docs/getting-started, /docs/api/reference
```

### 布局

#### 根布局（必需）

必须包含 `<html>` 和 `<body>` 标签：

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <header>全局头部</header>
        {children}
        <footer>全局底部</footer>
      </body>
    </html>
  )
}
```

#### 嵌套布局

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>仪表盘导航</nav>
      <main>{children}</main>
    </div>
  )
}
```

布局特点：
- 导航时保持状态
- 在子路由间导航时不重新渲染
- 可以获取数据
- 无法访问 pathname 或 searchParams（需使用客户端组件）

### 路由组

在不影响 URL 结构的情况下组织路由：

```
app/
├── (marketing)/          # 组（不影响 URL）
│   ├── about/page.tsx   -> /about
│   └── blog/page.tsx    -> /blog
├── (shop)/
│   ├── products/page.tsx -> /products
│   └── cart/page.tsx     -> /cart
└── layout.tsx           # 根布局
```

### 并行路由

在同一布局中同时渲染多个页面：

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

### 加载状态

```tsx
// app/dashboard/loading.tsx - 自动包裹在 Suspense 中
export default function Loading() {
  return <div className="spinner">加载仪表盘中...</div>
}

// 手动 Suspense - 更精细的控制
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>我的博客</h1>
      <Suspense fallback={<div>加载文章中...</div>}>
        <Posts />
      </Suspense>
    </div>
  )
}
```

### 错误处理

```tsx
// app/error.tsx - 必须是客户端组件
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
      <h2>出了点问题！</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>重试</button>
    </div>
  )
}
```

### 导航

```tsx
// Link 组件
import Link from 'next/link'
<Link href="/about">关于</Link>
<Link href={`/blog/${post.slug}`}>阅读文章</Link>

// useRouter Hook（客户端）
'use client'
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/dashboard')   // 前进
router.replace('/login')     // 替换
router.refresh()             // 刷新
router.back()                // 后退

// 服务端重定向
import { redirect } from 'next/navigation'
if (!session) {
  redirect('/login')
}
```

---

## 服务端组件（Server Components）

### 核心概念

`app/` 目录中的所有组件**默认**都是服务端组件：

```tsx
// app/posts/page.tsx - 服务端组件
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

**优势：**
- 在服务端获取数据（直接访问数据库）
- 敏感数据/密钥保留在服务端
- 减少客户端 JavaScript 包体积
- 改善首屏加载和 SEO
- 在服务端缓存结果
- 流式传输（Streaming）内容到客户端

**限制：**
- 不能使用 React hooks（useState、useEffect、useContext）
- 不能使用浏览器 API（window、localStorage）
- 不能添加事件监听器（onClick、onChange）

### 客户端组件（Client Components）

在文件顶部标记 `'use client'` 指令：

```tsx
// components/counter.tsx - 客户端组件
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      计数: {count}
    </button>
  )
}
```

**使用客户端组件的场景：**
- 交互式 UI（事件处理器）
- 状态管理（useState、useReducer）
- 副作用（useEffect、useLayoutEffect）
- 浏览器专用 API（localStorage、geolocation）
- 自定义 React hooks
- Context 消费者

### 组合模式

**最佳实践：** 保持服务端组件作为父组件，将客户端组件作为子组件传入。

```tsx
// app/page.tsx - 服务端组件
import { ClientProvider } from './client-provider'
import { ServerContent } from './server-content'

export default function Page() {
  return (
    <ClientProvider>
      <ServerContent /> {/* 保持为服务端组件 */}
    </ClientProvider>
  )
}
```

### 服务端操作（Server Actions）

从客户端组件调用服务端函数：

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

// 使用
<form action={createPost}>
  <input name="title" required />
  <textarea name="content" required />
  <button type="submit">创建文章</button>
</form>
```

### Suspense 流式传输

```tsx
import { Suspense } from 'react'

async function SlowComponent() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  return <div>3秒后加载完成</div>
}

export default function Page() {
  return (
    <div>
      <h1>即时渲染的标题</h1>
      <Suspense fallback={<div>加载中...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  )
}
```

**优势：**
- 快速组件立即渲染
- 慢速组件不阻塞页面
- 渐进增强
- 更好的感知性能

### 何时使用哪种组件类型

| 使用服务端组件 | 使用客户端组件 |
|---------------|---------------|
| 从数据库或 API 获取数据 | 添加交互性（onClick、onChange） |
| 直接访问后端资源 | 管理状态（useState） |
| 保持敏感信息在服务端 | 使用生命周期副作用（useEffect） |
| 减少客户端 JavaScript | 使用浏览器专用 API |
| 渲染静态内容 | 使用自定义 React hooks |
| 无需交互性 | 使用 React Context |

---

## 数据获取

### 优化的数据获取

```tsx
// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation'

// 构建时静态生成
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({ slug: post.slug }))
}

// 每小时重新验证
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

### 缓存策略

```typescript
// 强制缓存（默认）
fetch(url, { cache: 'force-cache' })

// 按时间重新验证
fetch(url, { next: { revalidate: 3600 } }) // 每小时

// 不缓存
fetch(url, { cache: 'no-store' })
```

---

## Turborepo

### 项目结构

```
my-monorepo/
├── apps/
│   ├── web/              # 面向客户的 Next.js 应用
│   ├── admin/            # 管理后台 Next.js 应用
│   └── docs/             # 文档站点
├── packages/
│   ├── ui/               # 含 RemixIcon 的共享 UI
│   ├── api-client/       # API 客户端库
│   ├── config/           # ESLint、TypeScript 配置
│   └── types/            # 共享 TypeScript 类型
└── turbo.json            # 构建管道
```

### 管道配置

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

### 共享组件库模式

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
  return <Button icon={<RiHomeLine />}>首页</Button>
}
```

### CI/CD 管道

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

## 最佳实践

### Next.js

- 默认使用服务端组件（Server Components），仅在需要时使用客户端组件
- 实现正确的加载和错误状态
- 使用 Image 组件实现自动优化
- 设置正确的 metadata 用于 SEO
- 利用缓存策略（force-cache、revalidate、no-store）

### Turborepo

- 清晰分离 Monorepo 结构（apps/、packages/）
- 正确定义任务依赖（^build 表示拓扑排序）
- 配置输出以实现正确缓存
- 启用远程缓存以促进团队协作
- 使用过滤器仅对变更的包运行任务

### RemixIcon

- 极简界面使用线条风格（line），强调重点使用填充风格（fill）
- 保持 24x24 网格对齐以确保清晰渲染
- 为无障碍性提供 aria-labels
- 使用 currentColor 实现灵活主题化
- 多图标场景优先使用 Web 字体，单图标场景使用 SVG

---

## 实施检查清单

使用此技术栈构建项目时：

- [ ] 创建项目结构（单体应用或 Monorepo）
- [ ] 配置 TypeScript 和 ESLint
- [ ] 设置 Next.js App Router
- [ ] 配置 Turborepo 管道（如果是 Monorepo）
- [ ] 安装和配置 RemixIcon
- [ ] 实现路由和布局
- [ ] 添加加载和错误状态
- [ ] 配置图片和字体优化
- [ ] 设置数据获取模式
- [ ] 配置缓存策略
- [ ] 按需添加 API 路由
- [ ] 实现共享组件库（如果是 Monorepo）
- [ ] 配置远程缓存（如果是 Monorepo）
- [ ] 设置 CI/CD 管道
- [ ] 配置部署平台

---

## 外部资源

- Next.js：https://nextjs.org/docs
- Turborepo：https://turbo.build/repo/docs
- RemixIcon：https://remixicon.com

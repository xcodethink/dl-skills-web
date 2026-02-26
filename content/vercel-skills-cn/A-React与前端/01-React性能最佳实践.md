> 来源：[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 分类：前端编码 | ⭐ Vercel 官方

---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
---

# React 性能最佳实践（React Best Practices）

## 概述

Vercel 工程团队出品的 React 和 Next.js 性能优化完整指南。包含 8 大类别共 57 条规则，按影响力从关键（消除瀑布流、减小包体积）到增量（高级模式）排序。每条规则都包含详细说明和错误/正确代码对比示例。

## 适用场景

- 编写新的 React 组件或 Next.js 页面
- 实现数据获取（客户端或服务端）
- 审查代码性能问题
- 重构现有 React/Next.js 代码
- 优化包体积或加载时间

## 规则类别优先级

| 优先级 | 类别 | 影响 | 前缀 |
|--------|------|------|------|
| 1 | 消除瀑布流 | 关键 | `async-` |
| 2 | 包体积优化 | 关键 | `bundle-` |
| 3 | 服务端性能 | 高 | `server-` |
| 4 | 客户端数据获取 | 中高 | `client-` |
| 5 | 重渲染优化 | 中 | `rerender-` |
| 6 | 渲染性能 | 中 | `rendering-` |
| 7 | JavaScript 性能 | 低-中 | `js-` |
| 8 | 高级模式 | 低 | `advanced-` |

---

## 1. 消除瀑布流（Eliminating Waterfalls）

**影响：关键**

瀑布流是性能的头号杀手。每个顺序的 await 都会增加完整的网络延迟。消除它们可以带来最大的性能提升。

### 1.1 延迟 Await 到需要时（Defer Await Until Needed）

**影响：高（避免阻塞未使用的代码路径）**

将 `await` 操作移到实际使用的分支中，避免阻塞不需要它们的代码路径。

**错误：阻塞了两个分支**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)

  if (skipProcessing) {
    // 立即返回但仍然等待了 userData
    return { skipped: true }
  }

  // 只有这个分支使用 userData
  return processUserData(userData)
}
```

**正确：仅在需要时阻塞**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // 立即返回，无需等待
    return { skipped: true }
  }

  // 仅在需要时获取
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**另一个示例：提前返回优化**

```typescript
// 错误：总是获取权限
async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId)
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}

// 正确：仅在需要时获取
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  const permissions = await fetchPermissions(userId)

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}
```

### 1.2 基于依赖的并行化（Dependency-Based Parallelization）

**影响：关键（2-10 倍提升）**

对于有部分依赖关系的操作，使用 `better-all` 最大化并行度。它会自动在最早的时刻启动每个任务。

**错误：profile 不必要地等待 config**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**正确：config 和 profile 并行运行**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

**不使用额外依赖的替代方案：**

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```

### 1.3 防止 API 路由中的瀑布链（Prevent Waterfall Chains in API Routes）

**影响：关键（2-10 倍提升）**

在 API 路由和 Server Actions 中，立即启动独立操作，即使你还没有 await 它们。

**错误：config 等待 auth，data 等待两者**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**正确：auth 和 config 立即启动**

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

### 1.4 Promise.all() 用于独立操作

**影响：关键（2-10 倍提升）**

当异步操作之间没有相互依赖时，使用 `Promise.all()` 并发执行。

**错误：顺序执行，3 次往返**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**正确：并行执行，1 次往返**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

### 1.5 策略性 Suspense 边界（Strategic Suspense Boundaries）

**影响：高（更快的首次绘制）**

不要在异步组件中等待数据再返回 JSX，使用 Suspense 边界在数据加载时更快地显示包装 UI。

**错误：包装器被数据获取阻塞**

```tsx
async function Page() {
  const data = await fetchData() // 阻塞整个页面

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

**正确：包装器立即显示，数据流式加载**

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // 只阻塞这个组件
  return <div>{data.content}</div>
}
```

**替代方案：跨组件共享 Promise**

```tsx
function Page() {
  // 立即开始获取，但不 await
  const dataPromise = fetchData()

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // 解包 Promise
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // 复用同一个 Promise
  return <div>{data.summary}</div>
}
```

**不适合使用此模式的场景：**
- 影响布局决策的关键数据
- 首屏以上的 SEO 关键内容
- 小型快速查询（Suspense 开销不值得）
- 需要避免布局偏移时

---

## 2. 包体积优化（Bundle Size Optimization）

**影响：关键**

减小初始包体积可以改善可交互时间（TTI）和最大内容绘制（LCP）。

### 2.1 避免桶文件导入（Avoid Barrel File Imports）

**影响：关键（200-800ms 导入成本，构建缓慢）**

从源文件直接导入而非桶文件（barrel files），避免加载数千个未使用的模块。

**错误：导入整个库**

```tsx
import { Check, X, Menu } from 'lucide-react'
// 加载 1,583 个模块，开发环境额外耗时约 2.8 秒

import { Button, TextField } from '@mui/material'
// 加载 2,225 个模块，开发环境额外耗时约 4.2 秒
```

**正确：只导入需要的**

```tsx
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
// 只加载 3 个模块（约 2KB vs 约 1MB）

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
```

**Next.js 13.5+ 替代方案：**

```js
// next.config.js - 使用 optimizePackageImports
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material']
  }
}

// 然后可以保持桶导入的便捷写法：
import { Check, X, Menu } from 'lucide-react'
// 构建时自动转换为直接导入
```

常见受影响的库：`lucide-react`、`@mui/material`、`@mui/icons-material`、`@tabler/icons-react`、`react-icons`、`@headlessui/react`、`@radix-ui/react-*`、`lodash`、`ramda`、`date-fns`、`rxjs`、`react-use`。

### 2.2 条件模块加载（Conditional Module Loading）

**影响：高（仅在需要时加载大数据）**

仅在功能激活时加载大型数据或模块。

```tsx
function AnimationPlayer({ enabled, setEnabled }: { enabled: boolean; setEnabled: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [frames, setFrames] = useState<Frame[] | null>(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js')
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}
```

### 2.3 延迟非关键第三方库（Defer Non-Critical Third-Party Libraries）

**影响：中（水合后加载）**

分析、日志和错误追踪不会阻塞用户交互。在水合（hydration）后加载它们。

**错误：阻塞初始包**

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**正确：水合后加载**

```tsx
import dynamic from 'next/dynamic'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false }
)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2.4 动态导入重组件（Dynamic Imports for Heavy Components）

**影响：关键（直接影响 TTI 和 LCP）**

使用 `next/dynamic` 懒加载初始渲染不需要的大组件。

**错误：Monaco 与主块一起打包约 300KB**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**正确：Monaco 按需加载**

```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

### 2.5 基于用户意图的预加载（Preload Based on User Intent）

**影响：中（降低感知延迟）**

在需要之前预加载重包，降低感知延迟。

**示例：悬停/聚焦时预加载**

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./monaco-editor')
    }
  }

  return (
    <button
      onMouseEnter={preload}
      onFocus={preload}
      onClick={onClick}
    >
      Open Editor
    </button>
  )
}
```

---

## 3. 服务端性能（Server-Side Performance）

**影响：高**

优化服务端渲染和数据获取，消除服务端瀑布流，减少响应时间。

### 3.1 像 API 路由一样认证 Server Actions

**影响：关键（防止未授权访问服务端 mutations）**

Server Actions（带有 `"use server"` 的函数）作为公开端点暴露。始终在每个 Server Action 内部验证身份和权限。

**错误：没有身份验证检查**

```typescript
'use server'

export async function deleteUser(userId: string) {
  // 任何人都可以调用！没有认证检查
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**正确：在 action 内部进行身份验证**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // 始终在 action 内部检查认证
  const session = await verifySession()

  if (!session) {
    throw unauthorized('Must be logged in')
  }

  // 同时检查授权
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }

  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

### 3.2 避免 RSC Props 中的重复序列化

**影响：低（通过避免重复序列化减少网络负载）**

RSC 到客户端的序列化按对象引用去重，而不是按值。在客户端做转换（`.toSorted()`、`.filter()`、`.map()`），而不是在服务端。

**错误：重复数组**

```tsx
// RSC：发送 6 个字符串（2 个数组 x 3 个元素）
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**正确：发送 3 个字符串**

```tsx
// RSC：只发送一次
<ClientList usernames={usernames} />

// 客户端：在那里转换
'use client'
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

### 3.3 跨请求 LRU 缓存（Cross-Request LRU Caching）

**影响：高（跨请求缓存）**

`React.cache()` 仅在单个请求内工作。对于跨请求共享的数据，使用 LRU 缓存。

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 分钟
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}
```

配合 Vercel 的 Fluid Compute 效果更佳，因为多个并发请求可以共享同一函数实例和缓存。

### 3.4 最小化 RSC 边界的序列化（Minimize Serialization at RSC Boundaries）

**影响：高（减少数据传输大小）**

React 服务端/客户端边界会序列化所有对象属性。只传递客户端实际使用的字段。

**错误：序列化全部 50 个字段**

```tsx
async function Page() {
  const user = await fetchUser()  // 50 个字段
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // 只用了 1 个字段
}
```

**正确：只序列化 1 个字段**

```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```

### 3.5 通过组件组合实现并行数据获取

**影响：关键（消除服务端瀑布流）**

React Server Components 在树中顺序执行。通过组合重构来并行化数据获取。

**错误：Sidebar 等待 Page 的获取完成**

```tsx
export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}
```

**正确：两者同时获取**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}
```

### 3.6 使用 React.cache() 进行每请求去重

**影响：中（请求内去重）**

使用 `React.cache()` 进行服务端请求去重。身份验证和数据库查询受益最大。

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})
```

**避免内联对象作为参数**——`React.cache()` 使用浅相等（`Object.is`），内联对象每次调用都会创建新引用，导致缓存未命中。

### 3.7 使用 after() 进行非阻塞操作

**影响：中（更快的响应时间）**

使用 Next.js 的 `after()` 在响应发送后调度工作。

**错误：阻塞响应**

```tsx
export async function POST(request: Request) {
  await updateDatabase(request)

  // 日志记录阻塞了响应
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**正确：非阻塞**

```tsx
import { after } from 'next/server'

export async function POST(request: Request) {
  await updateDatabase(request)

  // 在响应发送后记录日志
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    logUserAction({ userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

---

## 4. 客户端数据获取（Client-Side Data Fetching）

**影响：中-高**

自动去重和高效的数据获取模式减少冗余网络请求。

### 4.1 去重全局事件监听器（Deduplicate Global Event Listeners）

**影响：低（N 个实例 = 1 个监听器）**

使用 `useSWRSubscription()` 在组件实例间共享全局事件监听器。

**错误：N 个实例 = N 个监听器**

```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
```

**正确：N 个实例 = 1 个监听器**

```tsx
import useSWRSubscription from 'swr/subscription'

const keyCallbacks = new Map<string, Set<() => void>>()

function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    if (!keyCallbacks.has(key)) {
      keyCallbacks.set(key, new Set())
    }
    keyCallbacks.get(key)!.add(callback)

    return () => {
      const set = keyCallbacks.get(key)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          keyCallbacks.delete(key)
        }
      }
    }
  }, [key, callback])

  useSWRSubscription('global-keydown', () => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && keyCallbacks.has(e.key)) {
        keyCallbacks.get(e.key)!.forEach(cb => cb())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}
```

### 4.2 使用被动事件监听器优化滚动性能

**影响：中（消除事件监听器造成的滚动延迟）**

为触摸和滚轮事件监听器添加 `{ passive: true }` 以启用即时滚动。

**错误：**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  document.addEventListener('touchstart', handleTouch)
  return () => document.removeEventListener('touchstart', handleTouch)
}, [])
```

**正确：**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  document.addEventListener('touchstart', handleTouch, { passive: true })
  return () => document.removeEventListener('touchstart', handleTouch)
}, [])
```

### 4.3 使用 SWR 自动去重

**影响：中-高（自动去重）**

SWR 实现跨组件实例的请求去重、缓存和重新验证。

**错误：无去重，每个实例都发起请求**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

**正确：多个实例共享一个请求**

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

### 4.4 版本化并最小化 localStorage 数据

**影响：中（防止 schema 冲突，减少存储大小）**

为键添加版本前缀，只存储需要的字段。

**错误：**

```typescript
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
```

**正确：**

```typescript
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {
    // 在隐私浏览/配额超限/禁用时会抛出异常
  }
}
```

---

## 5. 重渲染优化（Re-render Optimization）

**影响：中**

减少不必要的重渲染，最小化浪费的计算，提升 UI 响应性。

### 5.1 在渲染期间计算派生状态（Calculate Derived State During Rendering）

**影响：中（避免冗余渲染和状态漂移）**

如果一个值可以从当前 props/state 计算得出，不要存在 state 中或在 effect 中更新它。

**错误：冗余的状态和 effect**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

**正确：在渲染期间派生**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

### 5.2 延迟状态读取到使用点（Defer State Reads to Usage Point）

**影响：中（避免不必要的订阅）**

如果只在回调中读取动态状态（searchParams、localStorage），不要订阅它。

**错误：订阅了所有 searchParams 变化**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**正确：按需读取，无需订阅**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

### 5.3 不要用 useMemo 包裹简单的原始类型表达式

**影响：低-中（每次渲染浪费计算）**

当表达式简单（少量逻辑或算术运算符）且结果是原始类型时，不要用 `useMemo` 包裹。

**错误：**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
}
```

**正确：**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
}
```

### 5.4 将记忆化组件的默认非原始参数值提取为常量

**影响：中（通过使用常量作为默认值来恢复记忆化）**

当记忆化组件有非原始类型的可选参数默认值时，不传该参数会破坏记忆化。

**错误：`onClick` 每次重渲染都有不同的值**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})
```

**正确：稳定的默认值**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})
```

### 5.5 提取为记忆化组件（Extract to Memoized Components）

**影响：中（启用提前返回）**

将昂贵的工作提取到记忆化组件中，以在计算前启用提前返回。

**错误：即使加载中也计算 avatar**

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

**正确：加载时跳过计算**

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

### 5.6 缩窄 Effect 依赖（Narrow Effect Dependencies）

**影响：低（最小化 effect 重新运行）**

指定原始类型依赖而非对象，以最小化 effect 重新运行。

**错误：任何 user 字段变化都重新运行**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**正确：仅当 id 变化时重新运行**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**对于派生状态，在 effect 外计算：**

```tsx
// 错误：在 width=767, 766, 765... 时运行
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// 正确：仅在布尔值转换时运行
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```

### 5.7 将交互逻辑放在事件处理器中（Put Interaction Logic in Event Handlers）

**影响：中（避免 effect 重新运行和重复副作用）**

如果副作用由特定用户操作触发，在事件处理器中运行它。不要建模为 state + effect。

**错误：事件建模为 state + effect**

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}
```

**正确：在处理器中执行**

```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

### 5.8 订阅派生状态（Subscribe to Derived State）

**影响：中（减少重渲染频率）**

订阅派生的布尔状态而非连续值，以减少重渲染频率。

**错误：每个像素变化都重渲染**

```tsx
function Sidebar() {
  const width = useWindowWidth()  // 持续更新
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**正确：仅当布尔值变化时重渲染**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

### 5.9 使用函数式 setState 更新

**影响：中（防止闭包过期和不必要的回调重建）**

当基于当前状态值更新状态时，使用函数式更新形式。

**错误：需要 state 作为依赖**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // items 依赖导致重建

  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // 缺少 items 依赖——将使用过期的 items！

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**正确：稳定的回调，没有过期闭包**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // 不需要依赖

  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // 安全且稳定

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

### 5.10 使用惰性状态初始化（Use Lazy State Initialization）

**影响：中（每次渲染都浪费计算）**

为昂贵的初始值传递函数给 `useState`。

**错误：每次渲染都运行**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() 在每次渲染都运行
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
}
```

**正确：仅运行一次**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() 仅在初始渲染时运行
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
}
```

### 5.11 使用 Transitions 进行非紧急更新

**影响：中（保持 UI 响应性）**

将频繁的、非紧急的状态更新标记为 transitions。

**错误：每次滚动都阻塞 UI**

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**正确：非阻塞更新**

```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

### 5.12 使用 useRef 存储瞬态值（Use useRef for Transient Values）

**影响：中（避免频繁更新时的不必要重渲染）**

当值频繁变化且不需要每次更新都触发重渲染时，使用 `useRef` 而非 `useState`。

**错误：每次更新都渲染**

```tsx
function Tracker() {
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
}
```

**正确：不因追踪而触发重渲染**

```tsx
function Tracker() {
  const lastXRef = useRef(0)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastXRef.current = e.clientX
      const node = dotRef.current
      if (node) {
        node.style.transform = `translateX(${e.clientX}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return <div ref={dotRef} style={{ position: 'fixed', top: 0, left: 0, width: 8, height: 8, background: 'black' }} />
}
```

---

## 6. 渲染性能（Rendering Performance）

**影响：中**

优化渲染过程，减少浏览器需要执行的工作。

### 6.1 动画 SVG 包装器而非 SVG 元素

**影响：低（启用硬件加速）**

许多浏览器对 SVG 元素的 CSS3 动画没有硬件加速。将 SVG 包在 `<div>` 中并动画包装器。

**错误：直接动画 SVG——无硬件加速**

```tsx
function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

**正确：动画包装 div——硬件加速**

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

### 6.2 CSS content-visibility 用于长列表

**影响：高（更快的初始渲染）**

应用 `content-visibility: auto` 推迟屏幕外渲染。

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

对于 1000 条消息，浏览器跳过约 990 个屏幕外项目的布局/绘制（初始渲染快 10 倍）。

### 6.3 提升静态 JSX 元素（Hoist Static JSX Elements）

**影响：低（避免重新创建）**

将静态 JSX 提取到组件外部以避免重新创建。

**错误：每次渲染都重新创建元素**

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}
```

**正确：复用相同元素**

```tsx
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return <div>{loading && loadingSkeleton}</div>
}
```

### 6.4 优化 SVG 精度（Optimize SVG Precision）

**影响：低（减小文件大小）**

降低 SVG 坐标精度以减小文件大小。

**错误：过度精确**

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

**正确：1 位小数**

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

可以使用 SVGO 自动化：`npx svgo --precision=1 --multipass icon.svg`

### 6.5 防止水合不匹配闪烁（Prevent Hydration Mismatch Without Flickering）

**影响：中（避免视觉闪烁和水合错误）**

渲染依赖客户端存储的内容时，注入同步脚本在 React 水合前更新 DOM。

**正确：无闪烁，无水合不匹配**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  )
}
```

### 6.6 抑制预期的水合不匹配（Suppress Expected Hydration Mismatches）

**影响：低-中（避免已知差异的水合警告噪音）**

对于已知的不匹配（随机 ID、日期、本地化格式），使用 `suppressHydrationWarning`。

```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```

### 6.7 使用 Activity 组件进行显示/隐藏

**影响：中（保留状态/DOM）**

使用 React 的 `<Activity>` 保留频繁切换可见性的昂贵组件的状态/DOM。

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

### 6.8 使用显式条件渲染（Use Explicit Conditional Rendering）

**影响：低（防止渲染 0 或 NaN）**

使用三元运算符而非 `&&`，特别是条件可能为 `0`、`NaN` 或其他渲染为 falsy 值时。

**错误：count 为 0 时渲染 "0"**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}
```

**正确：count 为 0 时不渲染任何内容**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}
```

### 6.9 使用 useTransition 替代手动 Loading 状态

**影响：低（减少重渲染，提升代码清晰度）**

使用 `useTransition` 替代手动的 `useState` 来管理 loading 状态。

**错误：手动 loading 状态**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }
}
```

**正确：使用 useTransition 的内置 pending 状态**

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // 立即更新输入

    startTransition(async () => {
      const data = await fetchResults(value)
      setResults(data)
    })
  }
}
```

---

## 7. JavaScript 性能（JavaScript Performance）

**影响：低-中**

热路径上的微优化可以累积成显著的改进。

### 7.1 避免布局抖动（Avoid Layout Thrashing）

**影响：中（防止强制同步布局）**

避免在样式写入和布局读取之间交替。

**错误：交替读写强制回流**

```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth  // 强制回流
  element.style.height = '200px'
  const height = element.offsetHeight  // 强制再次回流
}
```

**正确：批量写入，然后读取一次**

```typescript
function updateElementStyles(element: HTMLElement) {
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'

  // 所有写入完成后再读取（单次回流）
  const { width, height } = element.getBoundingClientRect()
}
```

### 7.2 为重复查找构建索引 Map

**影响：低-中（1M 操作降至 2K 操作）**

多次 `.find()` 调用同一个 key 应该使用 Map。

**错误（每次查找 O(n)）：**

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId)
  }))
}
```

**正确（每次查找 O(1)）：**

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]))

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId)
  }))
}
```

### 7.3 在循环中缓存属性访问

**影响：低-中（减少查找次数）**

在热路径中缓存对象属性查找。

**错误：3 次查找 x N 次迭代**

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

**正确：总共 1 次查找**

```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```

### 7.4 缓存重复的函数调用

**影响：中（避免冗余计算）**

使用模块级 Map 缓存函数结果。

**错误：冗余计算**

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        const slug = slugify(project.name) // 相同名称调用 100+ 次
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**正确：缓存结果**

```typescript
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}
```

### 7.5 缓存 Storage API 调用

**影响：低-中（减少昂贵的 I/O）**

`localStorage`、`sessionStorage` 和 `document.cookie` 是同步且昂贵的。在内存中缓存读取。

**错误：每次调用都读取存储**

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
```

**正确：Map 缓存**

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)  // 保持缓存同步
}
```

### 7.6 合并多次数组迭代

**影响：低-中（减少迭代次数）**

多次 `.filter()` 或 `.map()` 调用会多次迭代数组。合并为一个循环。

**错误：3 次迭代**

```typescript
const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)
```

**正确：1 次迭代**

```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```

### 7.7 数组比较前先检查长度

**影响：中-高（长度不同时避免昂贵操作）**

比较数组前先检查长度。如果长度不同，数组不可能相等。

**错误：总是运行昂贵的比较**

```typescript
function hasChanges(current: string[], original: string[]) {
  return current.sort().join() !== original.sort().join()
}
```

**正确（先做 O(1) 长度检查）：**

```typescript
function hasChanges(current: string[], original: string[]) {
  if (current.length !== original.length) {
    return true
  }
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

### 7.8 提前从函数返回（Early Return from Functions）

**影响：低-中（避免不必要的计算）**

在结果确定时提前返回，跳过不必要的处理。

**错误：找到答案后仍处理所有项目**

```typescript
function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''

  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = 'Email required'
    }
    if (!user.name) {
      hasError = true
      errorMessage = 'Name required'
    }
  }

  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

**正确：第一个错误就立即返回**

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: 'Email required' }
    }
    if (!user.name) {
      return { valid: false, error: 'Name required' }
    }
  }

  return { valid: true }
}
```

### 7.9 提升 RegExp 创建（Hoist RegExp Creation）

**影响：低-中（避免重新创建）**

不要在渲染内创建 RegExp。提升到模块作用域或用 `useMemo()` 记忆化。

**错误：每次渲染都创建新 RegExp**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**正确：记忆化或提升**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

### 7.10 使用循环求最值而非排序

**影响：低（O(n) 而非 O(n log n)）**

查找最小或最大元素只需一次遍历。

**错误（O(n log n)）：**

```typescript
function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

**正确（O(n)——单次循环）：**

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null

  let latest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }

  return latest
}
```

### 7.11 使用 Set/Map 进行 O(1) 查找

**影响：低-中（O(n) 到 O(1)）**

将数组转换为 Set/Map 以进行重复的成员检查。

**错误（每次检查 O(n)）：**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**正确（每次检查 O(1)）：**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

### 7.12 使用 toSorted() 替代 sort() 确保不可变性

**影响：中-高（防止 React 状态中的突变 bug）**

`.sort()` 原地修改数组，可能导致 React 状态和 props 的 bug。使用 `.toSorted()` 创建新的排序数组。

**错误：修改了原始数组**

```typescript
function UserList({ users }: { users: User[] }) {
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**正确：创建新数组**

```typescript
function UserList({ users }: { users: User[] }) {
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

其他不可变数组方法：`.toSorted()`、`.toReversed()`、`.toSpliced()`、`.with()`。

---

## 8. 高级模式（Advanced Patterns）

**影响：低**

需要谨慎实现的特定场景高级模式。

### 8.1 初始化应用一次，而非每次挂载（Initialize App Once, Not Per Mount）

**影响：低-中（避免开发环境中的重复初始化）**

不要在组件的 `useEffect([])` 中放置必须每次应用加载只运行一次的初始化。使用模块级守卫。

**错误：开发环境运行两次，重新挂载时重新运行**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])
}
```

**正确：每次应用加载只运行一次**

```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])
}
```

### 8.2 在 Refs 中存储事件处理器

**影响：低（稳定的订阅）**

当在 effect 中使用回调且不应在回调变化时重新订阅时，将回调存储在 refs 中。

**错误：每次渲染都重新订阅**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

**正确：稳定的订阅**

```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

### 8.3 使用 useEffectEvent 获取稳定的回调引用

**影响：低（防止 effect 重新运行）**

在回调中访问最新值而不将其添加到依赖数组。

**错误：每次回调变化时 effect 都重新运行**

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

**正确：使用 React 的 useEffectEvent**

```tsx
import { useEffectEvent } from 'react';

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```

---

## 参考资料

1. [https://react.dev](https://react.dev)
2. [https://nextjs.org](https://nextjs.org)
3. [https://swr.vercel.app](https://swr.vercel.app)
4. [https://github.com/shuding/better-all](https://github.com/shuding/better-all)
5. [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)
6. [https://vercel.com/blog/how-we-optimized-package-imports-in-next-js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
7. [https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

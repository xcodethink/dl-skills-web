# TypeScript 模式

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：rules/typescript/（coding-style, patterns, hooks, security, testing）+ skills/coding-standards/SKILL.md

---

## 何时激活

- 启动新的 TypeScript/JavaScript 项目或模块
- 审查代码质量和可维护性
- 重构现有代码以遵循规范
- 强制命名、格式化或结构一致性
- 设置 lint、格式化或类型检查规则

---

## 代码质量原则

### 1. 可读性优先（Readability First）

- 代码被阅读的次数远多于编写的次数
- 使用清晰的变量和函数名
- 自文档化代码优于注释
- 格式化保持一致

### 2. KISS（保持简单）

- 使用最简单的可行方案
- 避免过度工程化
- 不做过早优化
- 易于理解 > 巧妙代码

### 3. DRY（不要重复自己）

- 将公共逻辑提取为函数
- 创建可复用组件
- 跨模块共享工具函数
- 避免复制粘贴编程

### 4. YAGNI（你不会需要它）

- 不要在功能被需要之前构建它
- 避免推测性的通用化
- 只在需要时增加复杂性
- 从简单开始，在需要时重构

---

## 变量命名

```typescript
// 正确：描述性名称
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// 错误：不清晰的名称
const q = 'election'
const flag = true
const x = 1000
```

## 函数命名

```typescript
// 正确：动词-名词 模式
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// 错误：不清晰或仅用名词
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

---

## 不可变性模式（Immutability Pattern）

这是**关键模式**。

```typescript
// 始终使用展开运算符（spread operator）
const updatedUser = {
  ...user,
  name: 'New Name'
}

const updatedArray = [...items, newItem]

// 永远不要直接修改
user.name = 'New Name'  // 错误
items.push(newItem)     // 错误
```

---

## 错误处理（Error Handling）

```typescript
// 正确：完善的错误处理
async function fetchData(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}

// 错误：没有错误处理
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

---

## Async/Await 最佳实践

```typescript
// 正确：尽可能并行执行
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// 错误：不必要的顺序执行
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

---

## 类型安全（Type Safety）

```typescript
// 正确：使用恰当的类型
interface Market {
  id: string
  name: string
  status: 'active' | 'resolved' | 'closed'
  created_at: Date
}

function getMarket(id: string): Promise<Market> {
  // 实现
}

// 错误：使用 'any'
function getMarket(id: any): Promise<any> {
  // 实现
}
```

---

## 输入验证（Input Validation）

使用 Zod 进行基于模式（Schema）的验证：

```typescript
import { z } from 'zod'

// 正确：模式验证
const CreateMarketSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  endDate: z.string().datetime(),
  categories: z.array(z.string()).min(1)
})

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const validated = CreateMarketSchema.parse(body)
    // 使用已验证的数据继续处理
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }
  }
}
```

---

## API 响应格式

```typescript
// 统一的响应结构
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// 成功响应
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// 错误响应
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

---

## 自定义 Hook 模式

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

## 仓库模式（Repository Pattern）

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

---

## React 最佳实践

### 组件结构

```typescript
// 正确：带类型的函数式组件
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}
```

### 状态管理

```typescript
// 正确：正确的状态更新
const [count, setCount] = useState(0)

// 基于前一个状态的函数式更新
setCount(prev => prev + 1)

// 错误：直接引用状态（在异步场景中可能过时）
setCount(count + 1)
```

### 条件渲染

```typescript
// 正确：清晰的条件渲染
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// 错误：三元嵌套地狱
{isLoading ? <Spinner /> : error ? <ErrorMessage error={error} /> : data ? <DataDisplay data={data} /> : null}
```

---

## 性能最佳实践

### 记忆化（Memoization）

```typescript
import { useMemo, useCallback } from 'react'

// 正确：记忆化昂贵的计算
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// 正确：记忆化回调
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

### 懒加载（Lazy Loading）

```typescript
import { lazy, Suspense } from 'react'

// 正确：懒加载重型组件
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### 数据库查询

```typescript
// 正确：只选择需要的列
const { data } = await supabase
  .from('markets')
  .select('id, name, status')
  .limit(10)

// 错误：选择所有列
const { data } = await supabase
  .from('markets')
  .select('*')
```

---

## 测试标准

### 测试结构（AAA 模式）

```typescript
test('calculates similarity correctly', () => {
  // 准备（Arrange）
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // 执行（Act）
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // 断言（Assert）
  expect(similarity).toBe(0)
})
```

### 测试命名

```typescript
// 正确：描述性的测试名称
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })

// 错误：模糊的测试名称
test('works', () => { })
test('test search', () => { })
```

---

## 文件组织

### 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── markets/           # 市场页面
│   └── (auth)/           # 认证页面（路由组）
├── components/            # React 组件
│   ├── ui/               # 通用 UI 组件
│   ├── forms/            # 表单组件
│   └── layouts/          # 布局组件
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具库和配置
│   ├── api/             # API 客户端
│   ├── utils/           # 辅助函数
│   └── constants/       # 常量
├── types/                # TypeScript 类型
└── styles/              # 全局样式
```

### 文件命名

```
components/Button.tsx          # 组件使用 PascalCase
hooks/useAuth.ts              # Hook 使用 camelCase 加 'use' 前缀
lib/formatDate.ts             # 工具函数使用 camelCase
types/market.types.ts         # 类型文件使用 camelCase 加 .types 后缀
```

---

## 代码异味检测

### 1. 过长函数

```typescript
// 错误：函数超过 50 行
function processMarketData() {
  // 100 行代码
}

// 正确：拆分为更小的函数
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

### 2. 深层嵌套

```typescript
// 错误：5 层以上嵌套
if (user) {
  if (user.isAdmin) {
    if (market) {
      // ...
    }
  }
}

// 正确：提前返回
if (!user) return
if (!user.isAdmin) return
if (!market) return
// 执行操作
```

### 3. 魔法数字（Magic Numbers）

```typescript
// 错误：未解释的数字
if (retryCount > 3) { }
setTimeout(callback, 500)

// 正确：命名常量
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

---

## 注释与文档

### 何时写注释

```typescript
// 正确：解释"为什么"，而不是"做什么"
// 使用指数退避以避免在服务中断时压垮 API
const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)

// 错误：陈述显而易见的事情
// 计数器加 1
count++
```

### 公共 API 使用 JSDoc

```typescript
/**
 * 使用语义相似度搜索市场。
 *
 * @param query - 自然语言搜索查询
 * @param limit - 最大结果数量（默认：10）
 * @returns 按相似度得分排序的市场数组
 * @throws {Error} 如果 OpenAI API 失败或 Redis 不可用
 */
export async function searchMarkets(
  query: string,
  limit: number = 10
): Promise<Market[]> {
  // 实现
}
```

---

## 附录：TypeScript Hook 配置

在 `~/.claude/settings.json` 中配置工具后钩子（PostToolUse Hooks）：

- **Prettier**：编辑后自动格式化 JS/TS 文件
- **TypeScript check**：编辑 `.ts`/`.tsx` 文件后运行 `tsc`
- **console.log 警告**：在编辑的文件中发现 `console.log` 时发出警告

### 安全规则

```typescript
// 永远不要：硬编码密钥
const apiKey = "sk-proj-xxxxx"

// 始终：使用环境变量
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### 测试框架

- 使用 **Playwright** 作为关键用户流程的端到端（E2E）测试框架
- 生产代码中不允许 `console.log` 语句，使用正式的日志库

---

**记住**：代码质量不可妥协。清晰、可维护的代码能够支撑快速开发和自信的重构。

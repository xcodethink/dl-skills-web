# React 前端模式

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：skills/frontend-patterns/SKILL.md

---

## 何时激活

- 构建 React 组件（组合、props、渲染）
- 管理状态（useState、useReducer、Zustand、Context）
- 实现数据获取（SWR、React Query、服务器组件）
- 优化性能（记忆化、虚拟化、代码分割）
- 处理表单（验证、受控输入、Zod 模式）
- 构建可访问、响应式的 UI 模式

---

## 组件模式

### 组合优于继承（Composition Over Inheritance）

```typescript
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined'
}

export function Card({ children, variant = 'default' }: CardProps) {
  return <div className={`card card-${variant}`}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>
}

// 用法
<Card>
  <CardHeader>标题</CardHeader>
  <CardBody>内容</CardBody>
</Card>
```

### 复合组件模式（Compound Components）

```typescript
const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export function Tabs({ children, defaultTab }: {
  children: React.ReactNode
  defaultTab: string
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

export function Tab({ id, children }: { id: string, children: React.ReactNode }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab 必须在 Tabs 内使用')

  return (
    <button
      className={context.activeTab === id ? 'active' : ''}
      onClick={() => context.setActiveTab(id)}
    >
      {children}
    </button>
  )
}

// 用法
<Tabs defaultTab="overview">
  <TabList>
    <Tab id="overview">概览</Tab>
    <Tab id="details">详情</Tab>
  </TabList>
</Tabs>
```

### 渲染属性模式（Render Props）

```typescript
interface DataLoaderProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

export function DataLoader<T>({ url, children }: DataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return <>{children(data, loading, error)}</>
}
```

---

## 自定义 Hook 模式

### 开关 Hook

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}
```

### 异步数据获取 Hook

```typescript
export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: UseQueryOptions<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      options?.onSuccess?.(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [fetcher, options])

  useEffect(() => {
    if (options?.enabled !== false) {
      refetch()
    }
  }, [key, refetch, options?.enabled])

  return { data, error, loading, refetch }
}
```

### 防抖 Hook（Debounce）

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// 用法
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)
```

---

## 状态管理模式

### Context + Reducer 模式

```typescript
type Action =
  | { type: 'SET_MARKETS'; payload: Market[] }
  | { type: 'SELECT_MARKET'; payload: Market }
  | { type: 'SET_LOADING'; payload: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MARKETS':
      return { ...state, markets: action.payload }
    case 'SELECT_MARKET':
      return { ...state, selectedMarket: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    markets: [],
    selectedMarket: null,
    loading: false
  })

  return (
    <MarketContext.Provider value={{ state, dispatch }}>
      {children}
    </MarketContext.Provider>
  )
}

export function useMarkets() {
  const context = useContext(MarketContext)
  if (!context) throw new Error('useMarkets 必须在 MarketProvider 内使用')
  return context
}
```

---

## 性能优化

### 记忆化（Memoization）

```typescript
// useMemo 用于昂贵的计算
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// useCallback 用于传递给子组件的函数
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// React.memo 用于纯组件
export const MarketCard = React.memo<MarketCardProps>(({ market }) => {
  return (
    <div className="market-card">
      <h3>{market.name}</h3>
      <p>{market.description}</p>
    </div>
  )
})
```

### 代码分割和懒加载

```typescript
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={data} />
    </Suspense>
  )
}
```

### 长列表虚拟化

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // 估计行高
    overscan: 5  // 额外渲染的项目数
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: 'relative'
      }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <MarketCard market={markets[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 表单处理模式

### 受控表单与验证

```typescript
export function CreateMarketForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '', description: '', endDate: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = '名称为必填项'
    } else if (formData.name.length > 200) {
      newErrors.name = '名称不能超过 200 个字符'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await createMarket(formData)
    } catch (error) {
      // 错误处理
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
      />
      {errors.name && <span className="error">{errors.name}</span>}
      <button type="submit">创建</button>
    </form>
  )
}
```

---

## 错误边界模式（Error Boundary）

```typescript
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('错误边界捕获:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>出了点问题</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            重试
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

---

## 无障碍性模式（Accessibility）

### 键盘导航

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, options.length - 1))
      break
    case 'ArrowUp':
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
      break
    case 'Enter':
      e.preventDefault()
      onSelect(options[activeIndex])
      break
    case 'Escape':
      setIsOpen(false)
      break
  }
}
```

### 焦点管理

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // 保存当前焦点元素
      previousFocusRef.current = document.activeElement as HTMLElement
      modalRef.current?.focus()
    } else {
      // 关闭时恢复焦点
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  return isOpen ? (
    <div ref={modalRef} role="dialog" aria-modal="true" tabIndex={-1}
      onKeyDown={e => e.key === 'Escape' && onClose()}>
      {children}
    </div>
  ) : null
}
```

---

**记住**：现代前端模式支持可维护、高性能的用户界面。选择适合项目复杂度的模式。

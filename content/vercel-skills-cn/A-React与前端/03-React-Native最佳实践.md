> 来源：[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 分类：前端编码 | ⭐ Vercel 官方

---
name: vercel-react-native-skills
description: React Native and Expo best practices for building performant mobile apps. Use when building React Native components, optimizing list performance, implementing animations, or working with native modules. Triggers on tasks involving React Native, Expo, mobile performance, or native platform APIs.
---

# React Native 最佳实践（React Native Skills）

## 概述

React Native 和 Expo 应用的综合性最佳实践指南。涵盖 14 个类别共 35+ 条规则，包括核心渲染、列表性能、动画、导航、UI 模式和平台特定优化。每条规则都包含详细说明和错误/正确代码对比示例。

## 适用场景

- 构建 React Native 或 Expo 应用
- 优化列表和滚动性能
- 使用 Reanimated 实现动画
- 处理图片和媒体
- 配置原生模块或字体
- 在 monorepo 项目中管理原生依赖

## 规则类别优先级

| 优先级 | 类别 | 影响 | 前缀 |
|--------|------|------|------|
| 1 | 核心渲染 | 关键 | - |
| 2 | 列表性能 | 高 | `list-performance-` |
| 3 | 动画 | 高 | `animation-` |
| 4 | 滚动性能 | 高 | - |
| 5 | 导航 | 高 | `navigation-` |
| 6 | React 状态 | 中 | `react-state-` |
| 7 | 状态架构 | 中 | - |
| 8 | React Compiler | 中 | `react-compiler-` |
| 9 | 用户界面 | 中 | `ui-` |
| 10 | 设计系统 | 中 | - |
| 11 | Monorepo | 低 | `monorepo-` |
| 12 | 第三方依赖 | 低 | `imports-` |
| 13 | JavaScript | 低 | `js-` |
| 14 | 字体 | 低 | `fonts-` |

---

## 1. 核心渲染（Core Rendering）

**影响：关键**

基本的 React Native 渲染规则。违反这些规则会导致运行时崩溃或 UI 损坏。

### 1.1 永远不要对可能为 Falsy 的值使用 &&

**影响：关键（防止生产环境崩溃）**

永远不要使用 `{value && <Component />}`，当 `value` 可能是空字符串或 `0` 时。这些值是 falsy 的但可被 JSX 渲染——React Native 会尝试在 `<Text>` 组件外渲染它们，导致生产环境硬崩溃。

**错误：count 为 0 或 name 为 "" 时崩溃**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {name && <Text>{name}</Text>}
      {count && <Text>{count} items</Text>}
    </View>
  )
}
// 如果 name="" 或 count=0，渲染 falsy 值 → 崩溃
```

**正确：三元运算符加 null**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {name ? <Text>{name}</Text> : null}
      {count ? <Text>{count} items</Text> : null}
    </View>
  )
}
```

**正确：显式布尔转换**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {!!name && <Text>{name}</Text>}
      {!!count && <Text>{count} items</Text>}
    </View>
  )
}
```

**最佳：提前返回**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  if (!name) return null

  return (
    <View>
      <Text>{name}</Text>
      {count > 0 ? <Text>{count} items</Text> : null}
    </View>
  )
}
```

**Lint 规则：** 启用 `react/jsx-no-leaked-render` 自动捕获此问题。

### 1.2 将字符串包裹在 Text 组件中

**影响：关键（防止运行时崩溃）**

字符串必须在 `<Text>` 内渲染。如果字符串是 `<View>` 的直接子元素，React Native 会崩溃。

**错误：崩溃**

```tsx
import { View } from 'react-native'

function Greeting({ name }: { name: string }) {
  return <View>Hello, {name}!</View>
}
// Error: Text strings must be rendered within a <Text> component.
```

**正确：**

```tsx
import { View, Text } from 'react-native'

function Greeting({ name }: { name: string }) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  )
}
```

---

## 2. 列表性能（List Performance）

**影响：高**

优化虚拟化列表（FlatList、LegendList、FlashList）以实现流畅滚动和快速更新。

### 2.1 避免 renderItem 中的内联对象

**影响：高（防止记忆化列表项的不必要重渲染）**

不要在 `renderItem` 中创建新对象作为 props。内联对象在每次渲染时创建新引用，破坏记忆化。

**错误：内联对象破坏记忆化**

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <LegendList
      data={users}
      renderItem={({ item }) => (
        <UserRow
          // 错误：每次渲染都是新对象
          user={{ id: item.id, name: item.name, avatar: item.avatar }}
        />
      )}
    />
  )
}
```

**正确：直接传递 item 或原始类型**

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <LegendList
      data={users}
      renderItem={({ item }) => (
        // 好：直接传递 item
        <UserRow user={item} />
      )}
    />
  )
}
```

**正确：传递原始类型，在子组件内派生**

```tsx
renderItem={({ item }) => (
  <UserRow
    id={item.id}
    name={item.name}
    isActive={item.isActive}
  />
)}

const UserRow = memo(function UserRow({ id, name, isActive }: Props) {
  // 好：在记忆化组件内派生样式
  const backgroundColor = isActive ? 'green' : 'gray'
  return <View style={[styles.row, { backgroundColor }]}>{/* ... */}</View>
})
```

### 2.2 将回调提升到列表根部

**影响：中（更少的重渲染和更快的列表）**

当向列表项传递回调函数时，在列表根部创建单个实例。

**错误：每次渲染创建新回调**

```typescript
return (
  <LegendList
    renderItem={({ item }) => {
      // 错误：每次渲染创建新回调
      const onPress = () => handlePress(item.id)
      return <Item key={item.id} item={item} onPress={onPress} />
    }}
  />
)
```

**正确：传递单个函数实例给每个项目**

```typescript
const onPress = useCallback(() => handlePress(item.id), [handlePress, item.id])

return (
  <LegendList
    renderItem={({ item }) => (
      <Item key={item.id} item={item} onPress={onPress} />
    )}
  />
)
```

### 2.3 保持列表项轻量

**影响：高（减少滚动期间可见项目的渲染时间）**

列表项应尽可能便宜地渲染。最小化 hooks，避免查询，限制 React Context 访问。

**错误：重量级列表项**

```tsx
function ProductRow({ id }: { id: string }) {
  // 错误：列表项内查询
  const { data: product } = useQuery(['product', id], () => fetchProduct(id))
  // 错误：多次 context 访问
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  const cart = useContext(CartContext)
  // 错误：昂贵的计算
  const recommendations = useMemo(
    () => computeRecommendations(product),
    [product]
  )

  return <View>{/* ... */}</View>
}
```

**正确：轻量级列表项**

```tsx
function ProductRow({ name, price, imageUrl }: Props) {
  // 好：只接收原始类型，最少的 hooks
  return (
    <View>
      <Image source={{ uri: imageUrl }} />
      <Text>{name}</Text>
      <Text>{price}</Text>
    </View>
  )
}
```

**列表项指南：**
- 没有查询或数据获取
- 没有昂贵的计算（移到父级或在父级记忆化）
- 优先使用 Zustand selectors 而非 React Context
- 最小化 useState/useEffect hooks
- 传递预计算的值作为 props

### 2.4 使用稳定对象引用优化列表性能

**影响：关键（虚拟化依赖引用稳定性）**

不要在传递给虚拟化列表之前 map 或 filter 数据。虚拟化依赖对象引用稳定性来判断什么变了。

**错误：每次键入都创建新的对象引用**

```tsx
function DomainSearch() {
  const { keyword, setKeyword } = useKeywordZustandState()
  const { data: tlds } = useTlds()

  // 错误：每次渲染创建新对象，每次键入都重新渲染整个列表
  const domains = tlds.map((tld) => ({
    domain: `${keyword}.${tld.name}`,
    tld: tld.name,
    price: tld.price,
  }))

  return (
    <>
      <TextInput value={keyword} onChangeText={setKeyword} />
      <LegendList data={domains} renderItem={({ item }) => <DomainItem item={item} keyword={keyword} />} />
    </>
  )
}
```

**正确：稳定引用，在项目内转换**

```tsx
const renderItem = ({ item }) => <DomainItem tld={item} />

function DomainSearch() {
  const { data: tlds } = useTlds()

  return (
    <LegendList
      // 好：只要数据稳定，LegendList 就不会重渲染整个列表
      data={tlds}
      renderItem={renderItem}
    />
  )
}

function DomainItem({ tld }: { tld: Tld }) {
  // 好：在项目内转换，不将动态数据作为 prop 传递
  // 好：使用 zustand 的 selector 函数获取稳定的字符串
  const domain = useKeywordZustandState((s) => s.keyword + '.' + tld.name)
  return <Text>{domain}</Text>
}
```

### 2.5 向列表项传递原始类型以实现记忆化

**影响：高（实现有效的 memo() 比较）**

尽可能只传递原始值（字符串、数字、布尔值）作为列表项组件的 props。

**错误：对象 prop 需要深度比较**

```tsx
const UserRow = memo(function UserRow({ user }: { user: User }) {
  // memo() 按引用比较 user，而非值
  return <Text>{user.name}</Text>
})

renderItem={({ item }) => <UserRow user={item} />}
```

**正确：原始类型 props 启用浅比较**

```tsx
const UserRow = memo(function UserRow({
  id,
  name,
  email,
}: {
  id: string
  name: string
  email: string
}) {
  // memo() 直接比较每个原始值
  return <Text>{name}</Text>
})

renderItem={({ item }) => (
  <UserRow id={item.id} name={item.name} email={item.email} />
)}
```

### 2.6 对任何列表都使用虚拟化

**影响：高（减少内存，更快挂载）**

使用 LegendList 或 FlashList 等列表虚拟化器替代 ScrollView 加 mapped children——即使是短列表。

**错误：ScrollView 一次渲染所有项目**

```tsx
function Feed({ items }: { items: Item[] }) {
  return (
    <ScrollView>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </ScrollView>
  )
}
// 50 个项目 = 50 个组件挂载，即使只有 10 个可见
```

**正确：虚拟化器只渲染可见项目**

```tsx
import { LegendList } from '@legendapp/list'

function Feed({ items }: { items: Item[] }) {
  return (
    <LegendList
      data={items}
      renderItem={({ item }) => <ItemCard item={item} />}
      keyExtractor={(item) => item.id}
      estimatedItemSize={80}
    />
  )
}
// 只有约 10-15 个可见项目同时挂载
```

### 2.7 在列表中使用压缩图片

**影响：高（更快的加载时间，更少的内存）**

始终在列表中加载压缩的、适当大小的图片。为 Retina 屏幕请求 2 倍显示大小的图片。

**错误：全分辨率图片**

```tsx
function ProductItem({ product }: { product: Product }) {
  return (
    <View>
      {/* 为 100x100 缩略图加载 4000x3000 的图片 */}
      <Image
        source={{ uri: product.imageUrl }}
        style={{ width: 100, height: 100 }}
      />
    </View>
  )
}
```

**正确：请求适当大小的图片**

```tsx
function ProductItem({ product }: { product: Product }) {
  // 请求 200x200 图片（Retina 的 2 倍）
  const thumbnailUrl = `${product.imageUrl}?w=200&h=200&fit=cover`

  return (
    <View>
      <Image
        source={{ uri: thumbnailUrl }}
        style={{ width: 100, height: 100 }}
        contentFit='cover'
      />
    </View>
  )
}
```

### 2.8 对异构列表使用 Item Types

**影响：高（高效回收，更少的布局抖动）**

当列表有不同的项目布局时，使用 `type` 字段并提供 `getItemType` 给列表。

**错误：带条件语句的单一组件**

```tsx
type Item = { id: string; text?: string; imageUrl?: string; isHeader?: boolean }

function ListItem({ item }: { item: Item }) {
  if (item.isHeader) return <HeaderItem title={item.text} />
  if (item.imageUrl) return <ImageItem url={item.imageUrl} />
  return <MessageItem text={item.text} />
}
```

**正确：带有独立组件的类型化项目**

```tsx
type HeaderItem = { id: string; type: 'header'; title: string }
type MessageItem = { id: string; type: 'message'; text: string }
type ImageItem = { id: string; type: 'image'; url: string }
type FeedItem = HeaderItem | MessageItem | ImageItem

function Feed({ items }: { items: FeedItem[] }) {
  return (
    <LegendList
      data={items}
      keyExtractor={(item) => item.id}
      getItemType={(item) => item.type}
      renderItem={({ item }) => {
        switch (item.type) {
          case 'header':
            return <SectionHeader title={item.title} />
          case 'message':
            return <MessageRow text={item.text} />
          case 'image':
            return <ImageRow url={item.url} />
        }
      }}
      recycleItems
    />
  )
}
```

---

## 3. 动画（Animation）

**影响：高**

GPU 加速动画、Reanimated 模式，以及避免手势期间的渲染抖动。

### 3.1 动画 Transform 和 Opacity 而非布局属性

**影响：高（GPU 加速动画，无布局重算）**

避免动画 `width`、`height`、`top`、`left`、`margin` 或 `padding`。这些会在每一帧触发布局重算。使用 `transform`（scale、translate）和 `opacity`，它们在 GPU 上运行而不触发布局。

**错误：动画 height，每帧触发布局**

```tsx
function CollapsiblePanel({ expanded }: { expanded: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(expanded ? 200 : 0), // 每帧触发布局
    overflow: 'hidden',
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
```

**正确：动画 scaleY，GPU 加速**

```tsx
function CollapsiblePanel({ expanded }: { expanded: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: withTiming(expanded ? 1 : 0) },
    ],
    opacity: withTiming(expanded ? 1 : 0),
  }))

  return (
    <Animated.View style={[{ height: 200, transformOrigin: 'top' }, animatedStyle]}>
      {children}
    </Animated.View>
  )
}
```

### 3.2 优先使用 useDerivedValue 而非 useAnimatedReaction

**影响：中（更简洁的代码，自动依赖追踪）**

当从另一个值派生共享值时，使用 `useDerivedValue` 而非 `useAnimatedReaction`。

**错误：使用 useAnimatedReaction 进行派生**

```tsx
function MyComponent() {
  const progress = useSharedValue(0)
  const opacity = useSharedValue(1)

  useAnimatedReaction(
    () => progress.value,
    (current) => {
      opacity.value = 1 - current
    }
  )
}
```

**正确：useDerivedValue**

```tsx
function MyComponent() {
  const progress = useSharedValue(0)

  const opacity = useDerivedValue(() => 1 - progress.get())
}
```

仅在不产生值的副作用（如触发触觉反馈、日志记录、调用 `runOnJS`）时使用 `useAnimatedReaction`。

### 3.3 使用 GestureDetector 实现动画按压状态

**影响：中（UI 线程动画，更流畅的按压反馈）**

对于动画按压状态，使用 `GestureDetector` 配合 `Gesture.Tap()` 和共享值，而非 Pressable 的 `onPressIn`/`onPressOut`。

**错误：Pressable 使用 JS 线程回调**

```tsx
function AnimatedButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withTiming(0.95))}
      onPressOut={() => (scale.value = withTiming(1))}
    >
      <Animated.View style={animatedStyle}>
        <Text>Press me</Text>
      </Animated.View>
    </Pressable>
  )
}
```

**正确：GestureDetector 使用 UI 线程 worklets**

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, runOnJS } from 'react-native-reanimated'

function AnimatedButton({ onPress }: { onPress: () => void }) {
  // 存储按压状态（0 = 未按压，1 = 已按压）
  const pressed = useSharedValue(0)

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.set(withTiming(1))
    })
    .onFinalize(() => {
      pressed.set(withTiming(0))
    })
    .onEnd(() => {
      runOnJS(onPress)()
    })

  // 从状态派生视觉值
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(withTiming(pressed.get()), [0, 1], [1, 0.95]) },
    ],
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={animatedStyle}>
        <Text>Press me</Text>
      </Animated.View>
    </GestureDetector>
  )
}
```

---

## 4. 滚动性能（Scroll Performance）

**影响：高**

### 4.1 永远不要在 useState 中追踪滚动位置

**影响：高（防止滚动期间的渲染抖动）**

永远不要在 `useState` 中存储滚动位置。滚动事件频繁触发——状态更新导致渲染抖动和掉帧。

**错误：useState 导致卡顿**

```tsx
function Feed() {
  const [scrollY, setScrollY] = useState(0)

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(e.nativeEvent.contentOffset.y) // 每帧都重渲染
  }

  return <ScrollView onScroll={onScroll} scrollEventThrottle={16} />
}
```

**正确：Reanimated 用于动画**

```tsx
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated'

function Feed() {
  const scrollY = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y // 在 UI 线程运行，不重渲染
    },
  })

  return <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} />
}
```

**正确：ref 用于非响应式追踪**

```tsx
function Feed() {
  const scrollY = useRef(0)

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = e.nativeEvent.contentOffset.y // 不重渲染
  }

  return <ScrollView onScroll={onScroll} scrollEventThrottle={16} />
}
```

---

## 5. 导航（Navigation）

**影响：高**

### 5.1 使用原生导航器（Use Native Navigators）

**影响：高（原生性能，平台适配的 UI）**

始终使用原生导航器而非 JS 实现。原生导航器使用平台 API（iOS 上的 UINavigationController，Android 上的 Fragment）以获得更好的性能和原生行为。

**错误：JS stack 导航器**

```tsx
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()
```

**正确：原生 stack**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
```

**正确：expo-router 默认使用原生 stack**

```tsx
import { Stack } from 'expo-router'

export default function Layout() {
  return <Stack />
}
```

**对于标签页：** 使用 `react-native-bottom-tabs`（原生）或 expo-router 的原生标签页。避免 `@react-navigation/bottom-tabs`。

**正确：原生底部标签页**

```tsx
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation'

const Tab = createNativeBottomTabNavigator()
```

**正确：使用原生头部选项而非自定义头部组件**

```tsx
<Stack.Screen
  name='Profile'
  component={ProfileScreen}
  options={{
    title: 'Profile',
    headerLargeTitleEnabled: true,
    headerSearchBarOptions: {
      placeholder: 'Search',
    },
  }}
/>
```

---

## 6. React 状态（React State）

**影响：中**

### 6.1 最小化状态变量，派生值（Minimize State Variables and Derive Values）

**影响：中（更少的重渲染，更少的状态漂移）**

使用最少的状态变量。如果一个值可以从现有状态或 props 计算得出，在渲染期间派生它。

**错误：冗余状态**

```tsx
function Cart({ items }: { items: Item[] }) {
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0))
    setItemCount(items.length)
  }, [items])
}
```

**正确：派生值**

```tsx
function Cart({ items }: { items: Item[] }) {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  const itemCount = items.length
}
```

### 6.2 使用 fallback 状态而非 initialState

**影响：中（响应式 fallback 无需同步）**

使用 `undefined` 作为初始状态，用空值合并（`??`）回退到父级或服务器值。

**错误：同步状态，失去响应性**

```tsx
function Toggle({ fallbackEnabled }: Props) {
  const [enabled, setEnabled] = useState(defaultEnabled)
  // 如果 fallbackEnabled 变化，状态过期

  return <Switch value={enabled} onValueChange={setEnabled} />
}
```

**正确：状态是用户意图，响应式回退**

```tsx
function Toggle({ fallbackEnabled }: Props) {
  const [_enabled, setEnabled] = useState<boolean | undefined>(undefined)
  const enabled = _enabled ?? defaultEnabled
  // undefined = 用户还没操作，回退到 prop
  // 如果 defaultEnabled 变化，组件反映它
  // 一旦用户交互，他们的选择保留

  return <Switch value={enabled} onValueChange={setEnabled} />
}
```

### 6.3 使用 useState dispatch updaters 更新依赖当前值的状态

**影响：中（避免过期闭包，防止不必要的重渲染）**

当下一个状态依赖当前状态时，使用 dispatch updater（`setState(prev => ...)`）。

**错误：直接读取状态**

```tsx
const [count, setCount] = useState(0)

const onTap = () => {
  setCount(count + 1)
}
```

**正确：dispatch updater**

```tsx
const [count, setCount] = useState(0)

const onTap = () => {
  setCount((prev) => prev + 1)
}
```

---

## 7. 状态架构（State Architecture）

**影响：中**

### 7.1 状态必须代表基本事实（State Must Represent Ground Truth）

**影响：高（更清晰的逻辑，更容易调试，单一信息源）**

状态变量应代表某事物的实际状态（如 `pressed`、`progress`、`isOpen`），而非派生的视觉值（如 `scale`、`opacity`、`translateY`）。从状态通过计算或插值派生视觉值。

**错误：存储视觉输出**

```tsx
const scale = useSharedValue(1)

const tap = Gesture.Tap()
  .onBegin(() => {
    scale.set(withTiming(0.95))
  })
  .onFinalize(() => {
    scale.set(withTiming(1))
  })
```

**正确：存储状态，派生视觉效果**

```tsx
const pressed = useSharedValue(0) // 0 = 未按压，1 = 已按压

const tap = Gesture.Tap()
  .onBegin(() => {
    pressed.set(withTiming(1))
  })
  .onFinalize(() => {
    pressed.set(withTiming(0))
  })

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) }],
}))
```

状态是最小的事实。其他一切都是派生的。

---

## 8. React Compiler

**影响：中**

### 8.1 在渲染中提前解构函数（Destructure Functions Early in Render）

**影响：高（稳定的引用，更少的重渲染）**

此规则仅在使用 React Compiler 时适用。从 hooks 的返回值中在渲染作用域顶部解构函数。永远不要用 `.` 访问对象来调用函数。

**错误：用 `.` 访问对象**

```tsx
function SaveButton(props) {
  const router = useRouter()

  // 错误：react-compiler 将缓存键设在 "props" 和 "router" 上，它们是每次渲染都变的对象
  const handlePress = () => {
    props.onSave()
    router.push('/success') // 不稳定的引用
  }

  return <Button onPress={handlePress}>Save</Button>
}
```

**正确：提前解构**

```tsx
function SaveButton({ onSave }) {
  const { push } = useRouter()

  // 好：react-compiler 将缓存键设在 push 和 onSave 上
  const handlePress = () => {
    onSave()
    push('/success') // 稳定的引用
  }

  return <Button onPress={handlePress}>Save</Button>
}
```

### 8.2 对 Reanimated 共享值使用 .get() 和 .set()（不是 .value）

**影响：低（React Compiler 兼容所需）**

启用 React Compiler 后，对 Reanimated 共享值使用 `.get()` 和 `.set()` 而非直接读写 `.value`。

**错误：React Compiler 不兼容**

```tsx
const count = useSharedValue(0)

const increment = () => {
  count.value = count.value + 1 // 退出 react compiler
}
```

**正确：React Compiler 兼容**

```tsx
const count = useSharedValue(0)

const increment = () => {
  count.set(count.get() + 1)
}
```

---

## 9. 用户界面（User Interface）

**影响：中**

### 9.1 测量视图尺寸

**影响：中（同步测量，避免不必要的重渲染）**

同时使用 `useLayoutEffect`（同步）和 `onLayout`（用于更新）。

```tsx
function MeasuredBox({ children }: { children: React.ReactNode }) {
  const ref = useRef<View>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useLayoutEffect(() => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) setHeight(rect.height)
  }, [])

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height)
  }

  return (
    <View ref={ref} onLayout={onLayout}>
      {children}
    </View>
  )
}
```

### 9.2 现代 React Native 样式模式

**影响：中（一致的设计，更流畅的边框，更简洁的布局）**

- 使用 `borderCurve: 'continuous'` 配合 `borderRadius`
- 使用 `gap` 代替 margin 进行间距布局
- 使用 `experimental_backgroundImage` 实现线性渐变
- 使用 CSS `boxShadow` 字符串语法实现阴影
- 避免多种字体大小——使用粗细和颜色实现层次

```tsx
// 错误 – 子元素上的 margin
<View>
  <Text style={{ marginBottom: 8 }}>Title</Text>
  <Text style={{ marginBottom: 8 }}>Subtitle</Text>
</View>

// 正确 – 父元素上的 gap
<View style={{ gap: 8 }}>
  <Text>Title</Text>
  <Text>Subtitle</Text>
</View>
```

### 9.3 使用 contentInset 进行动态 ScrollView 间距

**影响：低（更流畅的更新，无布局重算）**

当 ScrollView 的顶部或底部空间可能变化时，使用 `contentInset` 而非 padding。

**正确：**

```tsx
function Feed({ bottomOffset }: { bottomOffset: number }) {
  return (
    <ScrollView
      contentInset={{ bottom: bottomOffset }}
      scrollIndicatorInsets={{ bottom: bottomOffset }}
    >
      {children}
    </ScrollView>
  )
}
```

### 9.4 使用 contentInsetAdjustmentBehavior 处理安全区域

**影响：中（原生安全区域处理，无布局偏移）**

在根 ScrollView 上使用 `contentInsetAdjustmentBehavior="automatic"`，而非用 SafeAreaView 包裹或手动 padding。

**正确：**

```tsx
function MyScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      <View>
        <Text>Content</Text>
      </View>
    </ScrollView>
  )
}
```

### 9.5 使用 expo-image 优化图片

**影响：高（内存效率，缓存，blurhash 占位符，渐进加载）**

使用 `expo-image` 替代 React Native 的 `Image`。

**错误：React Native Image**

```tsx
import { Image } from 'react-native'
```

**正确：expo-image**

```tsx
import { Image } from 'expo-image'

<Image
  source={{ uri: url }}
  placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
  contentFit="cover"
  transition={200}
  style={styles.image}
/>
```

### 9.6 使用 Galeria 实现图片画廊和灯箱

**影响：中**

对于带灯箱（点击全屏）的图片画廊，使用 `@nandorojo/galeria`。

```tsx
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'

function ImageGallery({ urls }: { urls: string[] }) {
  return (
    <Galeria urls={urls}>
      {urls.map((url, index) => (
        <Galeria.Image index={index} key={url}>
          <Image source={{ uri: url }} style={styles.thumbnail} />
        </Galeria.Image>
      ))}
    </Galeria>
  )
}
```

### 9.7 使用原生菜单实现下拉和上下文菜单

**影响：高（原生无障碍性，平台一致的 UX）**

使用 [zeego](https://zeego.dev) 实现跨平台原生菜单。

```tsx
import * as DropdownMenu from 'zeego/dropdown-menu'

function MyMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Pressable>
          <Text>Open Menu</Text>
        </Pressable>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key='edit' onSelect={() => console.log('edit')}>
          <DropdownMenu.ItemTitle>Edit</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>

        <DropdownMenu.Item key='delete' destructive onSelect={() => console.log('delete')}>
          <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
```

### 9.8 使用原生 Modal 而非 JS 底部抽屉

**影响：高（原生性能，手势，无障碍性）**

使用原生 `<Modal>` 配合 `presentationStyle="formSheet"` 或 React Navigation v7 的原生表单抽屉。

**正确：原生 Modal**

```tsx
<Modal
  visible={visible}
  presentationStyle='formSheet'
  animationType='slide'
  onRequestClose={() => setVisible(false)}
>
  <View>
    <Text>Sheet content</Text>
  </View>
</Modal>
```

### 9.9 使用 Pressable 替代 Touchable 组件

**影响：低（现代 API，更灵活）**

永远不要使用 `TouchableOpacity` 或 `TouchableHighlight`。使用 `Pressable`。

**错误：遗留 Touchable 组件**

```tsx
import { TouchableOpacity } from 'react-native'
```

**正确：Pressable**

```tsx
import { Pressable } from 'react-native'
```

---

## 10. 设计系统（Design System）

**影响：中**

### 10.1 使用复合组件而非多态 Children

**影响：中（灵活组合，更清晰的 API）**

不要创建能接受字符串又能接受组件的混合组件。使用复合组件。

**错误：多态 children**

```tsx
type ButtonProps = {
  children: string | React.ReactNode
  icon?: React.ReactNode
}

function Button({ children, icon }: ButtonProps) {
  return (
    <Pressable>
      {icon}
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  )
}
```

**正确：复合组件**

```tsx
function Button({ children }: { children: React.ReactNode }) {
  return <Pressable>{children}</Pressable>
}

function ButtonText({ children }: { children: React.ReactNode }) {
  return <Text>{children}</Text>
}

function ButtonIcon({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// 使用方式明确且可组合
<Button>
  <ButtonIcon><SaveIcon /></ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
```

---

## 11. Monorepo

**影响：低**

### 11.1 在 App 目录中安装原生依赖

**影响：关键（自动链接所需）**

在 monorepo 中，包含原生代码的包必须安装在原生应用的目录中。自动链接只扫描应用的 `node_modules`。

### 11.2 跨 Monorepo 使用单一依赖版本

**影响：中（避免重复打包，版本冲突）**

使用精确版本而非范围。使用 syncpack 等工具强制执行。

---

## 12. 第三方依赖

**影响：低**

### 12.1 从设计系统文件夹导入

**影响：低（启用全局更改和轻松重构）**

从设计系统文件夹重新导出依赖。应用代码从那里导入，而不是直接从包导入。

```tsx
// 错误：直接从包导入
import { View, Text } from 'react-native'

// 正确：从设计系统导入
import { View } from '@/components/view'
import { Text } from '@/components/text'
```

---

## 13. JavaScript

**影响：低**

### 13.1 提升 Intl 格式化器创建

**影响：低-中（避免昂贵的对象重建）**

不要在渲染或循环内创建 `Intl.DateTimeFormat`、`Intl.NumberFormat` 等。提升到模块作用域。

**错误：每次渲染都创建新格式化器**

```tsx
function Price({ amount }: { amount: number }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return <Text>{formatter.format(amount)}</Text>
}
```

**正确：提升到模块作用域**

```tsx
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function Price({ amount }: { amount: number }) {
  return <Text>{currencyFormatter.format(amount)}</Text>
}
```

---

## 14. 字体（Fonts）

**影响：低**

### 14.1 在构建时原生加载字体

**影响：低（启动时字体即可用，无异步加载）**

使用 `expo-font` config plugin 在构建时嵌入字体，而非 `useFonts` 或 `Font.loadAsync`。

**错误：异步字体加载**

```tsx
import { useFonts } from 'expo-font'

function App() {
  const [fontsLoaded] = useFonts({
    'Geist-Bold': require('./assets/fonts/Geist-Bold.otf'),
  })

  if (!fontsLoaded) return null

  return <Text style={{ fontFamily: 'Geist-Bold' }}>Hello</Text>
}
```

**正确：config plugin，构建时嵌入字体**

```tsx
function App() {
  // 不需要加载状态——字体已经可用
  return <Text style={{ fontFamily: 'Geist-Bold' }}>Hello</Text>
}
```

添加字体到 config plugin 后，运行 `npx expo prebuild` 并重新构建原生应用。

---

## 参考资料

1. [https://react.dev](https://react.dev)
2. [https://reactnative.dev](https://reactnative.dev)
3. [https://docs.swmansion.com/react-native-reanimated](https://docs.swmansion.com/react-native-reanimated)
4. [https://docs.swmansion.com/react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler)
5. [https://docs.expo.dev](https://docs.expo.dev)
6. [https://legendapp.com/open-source/legend-list](https://legendapp.com/open-source/legend-list)
7. [https://github.com/nandorojo/galeria](https://github.com/nandorojo/galeria)
8. [https://zeego.dev](https://zeego.dev)

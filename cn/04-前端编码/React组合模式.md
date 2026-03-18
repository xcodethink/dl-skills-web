> 来源：[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 分类：前端编码 | ⭐ Vercel 官方

---
name: vercel-composition-patterns
description: React composition patterns that scale. Use when refactoring components with boolean prop proliferation, building flexible component libraries, or designing reusable APIs. Triggers on tasks involving compound components, render props, context providers, or component architecture. Includes React 19 API changes.
---

# React 组合模式（React Composition Patterns）

## 概述

用于构建灵活、可维护的 React 组件的组合模式。通过使用复合组件（compound components）、状态提升（lifting state）和组合内部构件（composing internals），避免布尔属性（boolean props）泛滥。这些模式使代码库在规模扩大时对人类和 AI Agent 都更易于使用。

## 适用场景

- 重构拥有大量布尔属性的组件
- 构建可复用的组件库
- 设计灵活的组件 API
- 审查组件架构
- 使用复合组件或 Context Provider

## 规则类别优先级

| 优先级 | 类别 | 影响 | 前缀 |
|--------|------|------|------|
| 1 | 组件架构 | 高 | `architecture-` |
| 2 | 状态管理 | 中 | `state-` |
| 3 | 实现模式 | 中 | `patterns-` |
| 4 | React 19 API | 中 | `react19-` |

---

## 1. 组件架构（Component Architecture）

**影响：高**

构建组件以避免属性泛滥并启用灵活组合的基本模式。

### 1.1 避免布尔属性泛滥（Avoid Boolean Prop Proliferation）

**影响：关键（防止不可维护的组件变体）**

不要添加 `isThread`、`isEditing`、`isDMThread` 等布尔属性来定制组件行为。每个布尔值都会使可能的状态翻倍，并创造不可维护的条件逻辑。应使用组合（composition）代替。

**错误：布尔属性创造指数级复杂度**

```tsx
function Composer({
  onSubmit,
  isThread,
  channelId,
  isDMThread,
  dmId,
  isEditing,
  isForwarding,
}: Props) {
  return (
    <form>
      <Header />
      <Input />
      {isDMThread ? (
        <AlsoSendToDMField id={dmId} />
      ) : isThread ? (
        <AlsoSendToChannelField id={channelId} />
      ) : null}
      {isEditing ? (
        <EditActions />
      ) : isForwarding ? (
        <ForwardActions />
      ) : (
        <DefaultActions />
      )}
      <Footer onSubmit={onSubmit} />
    </form>
  )
}
```

**正确：组合消除条件语句**

```tsx
// 频道编辑器
function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Attachments />
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// 线程编辑器——添加"同时发送到频道"字段
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <AlsoSendToChannelField id={channelId} />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// 编辑编辑器——不同的底部操作
function EditComposer() {
  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.CancelEdit />
        <Composer.SaveEdit />
      </Composer.Footer>
    </Composer.Frame>
  )
}
```

每个变体都明确说明了它渲染的内容。我们可以共享内部构件而不共享单一的整体父组件。

### 1.2 使用复合组件（Use Compound Components）

**影响：高（无需属性传递即可实现灵活组合）**

将复杂组件结构化为共享上下文的复合组件。每个子组件通过 context 而非 props 访问共享状态。消费者可以按需组合所需的部分。

**错误：带有 render props 的整体式组件**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
  showAttachments,
  showFormatting,
  showEmojis,
}: Props) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {showAttachments && <Attachments />}
      {renderFooter ? (
        renderFooter()
      ) : (
        <Footer>
          {showFormatting && <Formatting />}
          {showEmojis && <Emojis />}
          {renderActions?.()}
        </Footer>
      )}
    </form>
  )
}
```

**正确：带有共享上下文的复合组件**

```tsx
const ComposerContext = createContext<ComposerContextValue | null>(null)

function ComposerProvider({ children, state, actions, meta }: ProviderProps) {
  return (
    <ComposerContext value={{ state, actions, meta }}>
      {children}
    </ComposerContext>
  )
}

function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerInput() {
  const {
    state,
    actions: { update },
    meta: { inputRef },
  } = use(ComposerContext)
  return (
    <TextInput
      ref={inputRef}
      value={state.input}
      onChangeText={(text) => update((s) => ({ ...s, input: text }))}
    />
  )
}

function ComposerSubmit() {
  const {
    actions: { submit },
  } = use(ComposerContext)
  return <Button onPress={submit}>Send</Button>
}

// 作为复合组件导出
const Composer = {
  Provider: ComposerProvider,
  Frame: ComposerFrame,
  Input: ComposerInput,
  Submit: ComposerSubmit,
  Header: ComposerHeader,
  Footer: ComposerFooter,
  Attachments: ComposerAttachments,
  Formatting: ComposerFormatting,
  Emojis: ComposerEmojis,
}
```

**使用方式：**

```tsx
<Composer.Provider state={state} actions={actions} meta={meta}>
  <Composer.Frame>
    <Composer.Header />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Submit />
    </Composer.Footer>
  </Composer.Frame>
</Composer.Provider>
```

消费者明确组合他们需要的内容。没有隐藏的条件语句。状态、actions 和 meta 由父级 provider 进行依赖注入。

---

## 2. 状态管理（State Management）

**影响：中**

用于提升状态和管理组合组件间共享上下文的模式。

### 2.1 将状态管理与 UI 解耦（Decouple State Management from UI）

**影响：中（在不改变 UI 的情况下可替换状态实现）**

Provider 组件应该是唯一知道状态如何管理的地方。UI 组件消费 context 接口——它们不知道状态来自 useState、Zustand 还是服务器同步。

**错误：UI 耦合到状态实现**

```tsx
function ChannelComposer({ channelId }: { channelId: string }) {
  // UI 组件知道全局状态的实现细节
  const state = useGlobalChannelState(channelId)
  const { submit, updateInput } = useChannelSync(channelId)

  return (
    <Composer.Frame>
      <Composer.Input
        value={state.input}
        onChange={(text) => sync.updateInput(text)}
      />
      <Composer.Submit onPress={() => sync.submit()} />
    </Composer.Frame>
  )
}
```

**正确：状态管理隔离在 provider 中**

```tsx
// Provider 处理所有状态管理细节
function ChannelProvider({
  channelId,
  children,
}: {
  channelId: string
  children: React.ReactNode
}) {
  const { state, update, submit } = useGlobalChannel(channelId)
  const inputRef = useRef(null)

  return (
    <Composer.Provider
      state={state}
      actions={{ update, submit }}
      meta={{ inputRef }}
    >
      {children}
    </Composer.Provider>
  )
}

// UI 组件只知道 context 接口
function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// 使用方式
function Channel({ channelId }: { channelId: string }) {
  return (
    <ChannelProvider channelId={channelId}>
      <ChannelComposer />
    </ChannelProvider>
  )
}
```

**不同的 providers，相同的 UI：**

```tsx
// 临时表单的本地状态
function ForwardMessageProvider({ children }) {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()

  return (
    <Composer.Provider
      state={state}
      actions={{ update: setState, submit: forwardMessage }}
    >
      {children}
    </Composer.Provider>
  )
}

// 频道的全局同步状态
function ChannelProvider({ channelId, children }) {
  const { state, update, submit } = useGlobalChannel(channelId)

  return (
    <Composer.Provider state={state} actions={{ update, submit }}>
      {children}
    </Composer.Provider>
  )
}
```

同一个 `Composer.Input` 组件可以与两个 providers 一起工作，因为它只依赖 context 接口，而非实现。

### 2.2 定义泛型 Context 接口进行依赖注入

**影响：高（在不同使用场景中实现依赖注入式状态）**

为你的组件 context 定义一个包含三部分的**泛型接口**：`state`、`actions` 和 `meta`。这个接口是任何 provider 都可以实现的契约——使同样的 UI 组件可以与完全不同的状态实现配合工作。

**核心原则：** 状态提升、组合内部构件、使状态可依赖注入。

**错误：UI 耦合到特定状态实现**

```tsx
function ComposerInput() {
  // 紧密耦合到特定的 hook
  const { input, setInput } = useChannelComposerState()
  return <TextInput value={input} onChangeText={setInput} />
}
```

**正确：泛型接口启用依赖注入**

```tsx
// 定义任何 provider 都可以实现的泛型接口
interface ComposerState {
  input: string
  attachments: Attachment[]
  isSubmitting: boolean
}

interface ComposerActions {
  update: (updater: (state: ComposerState) => ComposerState) => void
  submit: () => void
}

interface ComposerMeta {
  inputRef: React.RefObject<TextInput>
}

interface ComposerContextValue {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
}

const ComposerContext = createContext<ComposerContextValue | null>(null)
```

**UI 组件消费接口，而非实现：**

```tsx
function ComposerInput() {
  const {
    state,
    actions: { update },
    meta,
  } = use(ComposerContext)

  // 这个组件可以与任何实现了接口的 provider 配合工作
  return (
    <TextInput
      ref={meta.inputRef}
      value={state.input}
      onChangeText={(text) => update((s) => ({ ...s, input: text }))}
    />
  )
}
```

**不同的 providers 实现相同的接口：**

```tsx
// Provider A：临时表单的本地状态
function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  const inputRef = useRef(null)
  const submit = useForwardMessage()

  return (
    <ComposerContext
      value={{
        state,
        actions: { update: setState, submit },
        meta: { inputRef },
      }}
    >
      {children}
    </ComposerContext>
  )
}

// Provider B：频道的全局同步状态
function ChannelProvider({ channelId, children }: Props) {
  const { state, update, submit } = useGlobalChannel(channelId)
  const inputRef = useRef(null)

  return (
    <ComposerContext
      value={{
        state,
        actions: { update, submit },
        meta: { inputRef },
      }}
    >
      {children}
    </ComposerContext>
  )
}
```

**Provider 之外的自定义 UI 也可以访问状态和 actions：**

```tsx
function ForwardMessageDialog() {
  return (
    <ForwardMessageProvider>
      <Dialog>
        {/* 编辑器 UI */}
        <Composer.Frame>
          <Composer.Input placeholder="Add a message, if you'd like." />
          <Composer.Footer>
            <Composer.Formatting />
            <Composer.Emojis />
          </Composer.Footer>
        </Composer.Frame>

        {/* 编辑器外部但在 provider 内部的自定义 UI */}
        <MessagePreview />

        {/* 对话框底部的操作 */}
        <DialogActions>
          <CancelButton />
          <ForwardButton />
        </DialogActions>
      </Dialog>
    </ForwardMessageProvider>
  )
}

// 这个按钮在 Composer.Frame 外部但仍可以根据 context 提交！
function ForwardButton() {
  const {
    actions: { submit },
  } = use(ComposerContext)
  return <Button onPress={submit}>Forward</Button>
}

// 这个预览在 Composer.Frame 外部但可以读取编辑器的状态！
function MessagePreview() {
  const { state } = use(ComposerContext)
  return <Preview message={state.input} attachments={state.attachments} />
}
```

重要的是 provider 边界——而非视觉嵌套。需要共享状态的组件不必在 `Composer.Frame` 内部。它们只需在 provider 内部。

### 2.3 将状态提升到 Provider 组件中（Lift State into Provider Components）

**影响：高（实现组件边界外的状态共享）**

将状态管理移到专门的 provider 组件中。这允许主 UI 外部的兄弟组件在不进行属性传递或使用 refs 的情况下访问和修改状态。

**错误：状态困在组件内部**

```tsx
function ForwardMessageComposer() {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()

  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer />
    </Composer.Frame>
  )
}

// 问题：这个按钮如何访问编辑器状态？
function ForwardMessageDialog() {
  return (
    <Dialog>
      <ForwardMessageComposer />
      <MessagePreview /> {/* 需要编辑器状态 */}
      <DialogActions>
        <CancelButton />
        <ForwardButton /> {/* 需要调用 submit */}
      </DialogActions>
    </Dialog>
  )
}
```

**错误：使用 useEffect 同步状态向上**

```tsx
function ForwardMessageDialog() {
  const [input, setInput] = useState('')
  return (
    <Dialog>
      <ForwardMessageComposer onInputChange={setInput} />
      <MessagePreview input={input} />
    </Dialog>
  )
}

function ForwardMessageComposer({ onInputChange }) {
  const [state, setState] = useState(initialState)
  useEffect(() => {
    onInputChange(state.input) // 每次变化都同步
  }, [state.input])
}
```

**正确：状态提升到 provider**

```tsx
function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()
  const inputRef = useRef(null)

  return (
    <Composer.Provider
      state={state}
      actions={{ update: setState, submit: forwardMessage }}
      meta={{ inputRef }}
    >
      {children}
    </Composer.Provider>
  )
}

function ForwardMessageDialog() {
  return (
    <ForwardMessageProvider>
      <Dialog>
        <ForwardMessageComposer />
        <MessagePreview /> {/* 自定义组件可以访问状态和 actions */}
        <DialogActions>
          <CancelButton />
          <ForwardButton /> {/* 自定义组件可以访问状态和 actions */}
        </DialogActions>
      </Dialog>
    </ForwardMessageProvider>
  )
}

function ForwardButton() {
  const { actions } = use(Composer.Context)
  return <Button onPress={actions.submit}>Forward</Button>
}
```

**关键洞察：** 需要共享状态的组件不必在视觉上嵌套在彼此内部——它们只需在同一个 provider 内部。

---

## 3. 实现模式（Implementation Patterns）

**影响：中**

实现复合组件和 context providers 的具体技术。

### 3.1 创建显式组件变体（Create Explicit Component Variants）

**影响：中（自文档化的代码，没有隐藏的条件语句）**

不要用一个组件加很多布尔属性，而是创建显式的变体组件。每个变体组合它需要的部分。代码自己说明自己。

**错误：一个组件，多种模式**

```tsx
// 这个组件到底渲染什么？
<Composer
  isThread
  isEditing={false}
  channelId='abc'
  showAttachments
  showFormatting={false}
/>
```

**正确：显式变体**

```tsx
// 立即清楚这渲染什么
<ThreadComposer channelId="abc" />

// 或者
<EditMessageComposer messageId="xyz" />

// 或者
<ForwardMessageComposer messageId="123" />
```

**实现：**

```tsx
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <ThreadProvider channelId={channelId}>
      <Composer.Frame>
        <Composer.Input />
        <AlsoSendToChannelField channelId={channelId} />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.Submit />
        </Composer.Footer>
      </Composer.Frame>
    </ThreadProvider>
  )
}

function EditMessageComposer({ messageId }: { messageId: string }) {
  return (
    <EditMessageProvider messageId={messageId}>
      <Composer.Frame>
        <Composer.Input />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.CancelEdit />
          <Composer.SaveEdit />
        </Composer.Footer>
      </Composer.Frame>
    </EditMessageProvider>
  )
}

function ForwardMessageComposer({ messageId }: { messageId: string }) {
  return (
    <ForwardMessageProvider messageId={messageId}>
      <Composer.Frame>
        <Composer.Input placeholder="Add a message, if you'd like." />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.Mentions />
        </Composer.Footer>
      </Composer.Frame>
    </ForwardMessageProvider>
  )
}
```

每个变体明确说明：使用什么 provider/状态、包含什么 UI 元素、有什么操作可用。没有布尔属性组合需要推理。没有不可能的状态。

### 3.2 优先使用 Children 组合而非 Render Props

**影响：中（更清晰的组合，更好的可读性）**

使用 `children` 进行组合而非 `renderX` 属性。Children 更可读，自然组合，不需要理解回调签名。

**错误：render props**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
}: {
  renderHeader?: () => React.ReactNode
  renderFooter?: () => React.ReactNode
  renderActions?: () => React.ReactNode
}) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {renderFooter ? renderFooter() : <DefaultFooter />}
      {renderActions?.()}
    </form>
  )
}

// 使用方式笨拙且不灵活
return (
  <Composer
    renderHeader={() => <CustomHeader />}
    renderFooter={() => (
      <>
        <Formatting />
        <Emojis />
      </>
    )}
    renderActions={() => <SubmitButton />}
  />
)
```

**正确：带有 children 的复合组件**

```tsx
function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerFooter({ children }: { children: React.ReactNode }) {
  return <footer className='flex'>{children}</footer>
}

// 使用方式灵活
return (
  <Composer.Frame>
    <CustomHeader />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Emojis />
      <SubmitButton />
    </Composer.Footer>
  </Composer.Frame>
)
```

**适合使用 render props 的场景：**

```tsx
// 当你需要将数据传回时，render props 效果更好
<List
  data={items}
  renderItem={({ item, index }) => <Item item={item} index={index} />}
/>
```

当父级需要向子级提供数据或状态时使用 render props。当组合静态结构时使用 children。

---

## 4. React 19 API

**影响：中**

仅限 React 19+。不再使用 `forwardRef`；使用 `use()` 替代 `useContext()`。

### 4.1 React 19 API 变更

**影响：中（更简洁的组件定义和 context 使用）**

> **注意：仅限 React 19+。** 如果你使用 React 18 或更早版本，请跳过此部分。

在 React 19 中，`ref` 现在是一个普通的 prop（不需要 `forwardRef` 包装器），`use()` 替代了 `useContext()`。

**错误：React 19 中使用 forwardRef**

```tsx
const ComposerInput = forwardRef<TextInput, Props>((props, ref) => {
  return <TextInput ref={ref} {...props} />
})
```

**正确：ref 作为普通 prop**

```tsx
function ComposerInput({ ref, ...props }: Props & { ref?: React.Ref<TextInput> }) {
  return <TextInput ref={ref} {...props} />
}
```

**错误：React 19 中使用 useContext**

```tsx
const value = useContext(MyContext)
```

**正确：使用 use 替代 useContext**

```tsx
const value = use(MyContext)
```

`use()` 与 `useContext()` 不同，可以在条件语句中调用。

---

## 参考资料

1. [https://react.dev](https://react.dev)
2. [https://react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context)
3. [https://react.dev/reference/react/use](https://react.dev/reference/react/use)

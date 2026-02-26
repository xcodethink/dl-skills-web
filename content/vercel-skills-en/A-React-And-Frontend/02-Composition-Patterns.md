> Source: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Category: Frontend | ⭐ Vercel Official

---
name: vercel-composition-patterns
description: React composition patterns that scale. Use when refactoring components with boolean prop proliferation, building flexible component libraries, or designing reusable APIs. Triggers on tasks involving compound components, render props, context providers, or component architecture. Includes React 19 API changes.
---

# React Composition Patterns

## Overview

Composition patterns for building flexible, maintainable React components. Avoid boolean prop proliferation by using compound components, lifting state, and composing internals. These patterns make codebases easier to work with as they scale. Contains 8 rules across 4 categories.

## Rule Categories

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Component Architecture | HIGH |
| 2 | State Management | MEDIUM |
| 3 | Implementation Patterns | MEDIUM |
| 4 | React 19 APIs | MEDIUM |

---

## 1. Component Architecture — HIGH

### 1.1 Avoid Boolean Prop Proliferation

**Impact: CRITICAL** — Each boolean doubles possible states, creating unmaintainable conditional logic. Use composition instead.

**Incorrect:**

```tsx
function Composer({
  onSubmit, isThread, channelId, isDMThread, dmId, isEditing, isForwarding,
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
      {isEditing ? <EditActions /> : isForwarding ? <ForwardActions /> : <DefaultActions />}
      <Footer onSubmit={onSubmit} />
    </form>
  )
}
```

**Correct:** Create explicit variant components that compose shared internals.

```tsx
function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Attachments />
        <Composer.Formatting />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <AlsoSendToChannelField id={channelId} />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

function EditComposer() {
  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer>
        <Composer.CancelEdit />
        <Composer.SaveEdit />
      </Composer.Footer>
    </Composer.Frame>
  )
}
```

### 1.2 Use Compound Components

**Impact: HIGH** — Structure complex components with shared context. Consumers compose the pieces they need.

**Incorrect:** Monolithic component with render props and boolean flags.

**Correct:** Compound components with shared context:

```tsx
const ComposerContext = createContext<ComposerContextValue | null>(null)

function ComposerProvider({ children, state, actions, meta }: ProviderProps) {
  return (
    <ComposerContext value={{ state, actions, meta }}>
      {children}
    </ComposerContext>
  )
}

function ComposerInput() {
  const { state, actions: { update }, meta: { inputRef } } = use(ComposerContext)
  return (
    <TextInput
      ref={inputRef}
      value={state.input}
      onChangeText={(text) => update((s) => ({ ...s, input: text }))}
    />
  )
}

const Composer = {
  Provider: ComposerProvider,
  Frame: ComposerFrame,
  Input: ComposerInput,
  Submit: ComposerSubmit,
  // ... other subcomponents
}
```

---

## 2. State Management — MEDIUM

### 2.1 Decouple State Management from UI

The provider is the only place that knows how state is managed. UI components consume the context interface only.

**Incorrect:** UI component imports `useGlobalChannelState()` directly.

**Correct:** Provider handles state; UI consumes generic interface:

```tsx
function ChannelProvider({ channelId, children }) {
  const { state, update, submit } = useGlobalChannel(channelId)
  return (
    <Composer.Provider state={state} actions={{ update, submit }} meta={{ inputRef }}>
      {children}
    </Composer.Provider>
  )
}

// Same UI works with any provider
function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Submit />
    </Composer.Frame>
  )
}
```

### 2.2 Define Generic Context Interfaces

**Impact: HIGH** — Define `state`, `actions`, and `meta` as a contract any provider can implement.

```tsx
interface ComposerContextValue {
  state: ComposerState       // { input, attachments, isSubmitting }
  actions: ComposerActions   // { update, submit }
  meta: ComposerMeta         // { inputRef }
}
```

Different providers implement the same interface — local state for ephemeral forms, global synced state for channels. The same composed UI works with both.

**Key insight:** Components outside `Composer.Frame` but inside the provider can still access state:

```tsx
function ForwardMessageDialog() {
  return (
    <ForwardMessageProvider>
      <Dialog>
        <Composer.Frame>
          <Composer.Input />
        </Composer.Frame>
        <MessagePreview />   {/* Reads state from context */}
        <ForwardButton />    {/* Calls submit from context */}
      </Dialog>
    </ForwardMessageProvider>
  )
}
```

### 2.3 Lift State into Provider Components

**Impact: HIGH** — Move state into dedicated providers so sibling components can access it without prop drilling.

**Incorrect approaches:** State trapped inside component, useEffect sync, or reading state from ref.

**Correct:** Lift state to provider. Any component within the provider boundary can access state/actions.

```tsx
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
```

---

## 3. Implementation Patterns — MEDIUM

### 3.1 Create Explicit Component Variants

Instead of `<Composer isThread isEditing={false} channelId='abc' />`, create:

```tsx
<ThreadComposer channelId="abc" />
<EditMessageComposer messageId="xyz" />
<ForwardMessageComposer messageId="123" />
```

Each variant is explicit about what provider/state it uses, what UI elements it includes, and what actions are available. No impossible states.

### 3.2 Prefer Children Over Render Props

Use `children` for composing static structure. Use render props only when the parent needs to provide data to the child.

**Incorrect:** `<Composer renderHeader={() => ...} renderFooter={() => ...} />`

**Correct:**

```tsx
<Composer.Frame>
  <CustomHeader />
  <Composer.Input />
  <Composer.Footer>
    <Composer.Formatting />
    <SubmitButton />
  </Composer.Footer>
</Composer.Frame>
```

**When render props are appropriate:** `<List data={items} renderItem={({ item }) => <Item item={item} />} />`

---

## 4. React 19 APIs — MEDIUM

> React 19+ only. Skip if using React 18 or earlier.

### 4.1 React 19 API Changes

**ref as regular prop** (no `forwardRef` needed):

```tsx
// Before: const Input = forwardRef<TextInput, Props>((props, ref) => ...)
// After:
function Input({ ref, ...props }: Props & { ref?: React.Ref<TextInput> }) {
  return <TextInput ref={ref} {...props} />
}
```

**use() replaces useContext():**

```tsx
// Before: const value = useContext(MyContext)
// After:  const value = use(MyContext)
```

`use()` can be called conditionally, unlike `useContext()`.

---

## References

1. [react.dev](https://react.dev)
2. [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
3. [React use() API](https://react.dev/reference/react/use)

> Source: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Category: Frontend | ⭐ Vercel Official

---
name: vercel-react-native-skills
description: React Native and Expo best practices for building performant mobile apps. Use when building React Native components, optimizing list performance, implementing animations, or working with native modules. Triggers on tasks involving React Native, Expo, mobile performance, or native platform APIs.
---

# React Native Skills

## Overview

Comprehensive best practices for React Native and Expo applications. 35+ rules across 14 categories covering core rendering, list performance, animations, navigation, UI patterns, and platform-specific optimizations.

## Rule Categories

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Core Rendering | CRITICAL |
| 2 | List Performance | HIGH |
| 3 | Animation | HIGH |
| 4 | Scroll Performance | HIGH |
| 5 | Navigation | HIGH |
| 6 | React State | MEDIUM |
| 7 | State Architecture | MEDIUM |
| 8 | React Compiler | MEDIUM |
| 9 | User Interface | MEDIUM |
| 10 | Design System | MEDIUM |
| 11 | Monorepo | LOW |
| 12-14 | Dependencies / JS / Fonts | LOW |

---

## 1. Core Rendering — CRITICAL

### 1.1 Never Use && with Potentially Falsy Values

Empty string or `0` are falsy but JSX-renderable — React Native renders them as text outside `<Text>`, causing a hard crash.

**Incorrect:**

```tsx
{name && <Text>{name}</Text>}    // Crashes if name=""
{count && <Text>{count}</Text>}  // Crashes if count=0
```

**Correct:** Use ternary with null, explicit boolean coercion (`!!`), or early return.

```tsx
{name ? <Text>{name}</Text> : null}
{count > 0 ? <Text>{count} items</Text> : null}
```

Lint rule: Enable `react/jsx-no-leaked-render`.

### 1.2 Wrap Strings in Text Components

Strings must be inside `<Text>`. Direct string children of `<View>` crash.

**Incorrect:** `<View>Hello, {name}!</View>`

**Correct:** `<View><Text>Hello, {name}!</Text></View>`

---

## 2. List Performance — HIGH

### 2.1 Avoid Inline Objects in renderItem

Inline objects create new references every render, breaking memoization. Pass the `item` directly or pass primitives.

### 2.2 Hoist Callbacks to List Root

Create a single callback instance at the list root instead of creating new closures per item.

### 2.3 Keep List Items Lightweight

No queries, no expensive computations, minimal hooks, prefer Zustand selectors over Context. Move data fetching to parent.

### 2.4 Stable Object References for Virtualization

Don't `.map()` or `.filter()` data before passing to virtualized lists. Transform inside items, using Zustand selectors for dynamic data.

**Correct pattern:**

```tsx
const renderItem = ({ item }) => <DomainItem tld={item} />

function DomainSearch() {
  const { data: tlds } = useTlds()
  return <LegendList data={tlds} renderItem={renderItem} />
}

function DomainItem({ tld }: { tld: Tld }) {
  const domain = useKeywordZustandState((s) => s.keyword + '.' + tld.name)
  return <Text>{domain}</Text>
}
```

### 2.5 Pass Primitives for Memoization

Pass `id`, `name`, `email` as separate props instead of `user` object for effective `memo()` comparison.

### 2.6 Use List Virtualizer for Any List

Use LegendList or FlashList instead of ScrollView with mapped children — even for short lists.

### 2.7 Use Compressed Images in Lists

Request images at 2x display size. Use image CDN with resize parameters.

### 2.8 Use Item Types for Heterogeneous Lists

Provide `getItemType` for efficient recycling pools. Type-safe discriminated unions with `switch`.

```tsx
<LegendList
  data={items}
  getItemType={(item) => item.type}
  renderItem={({ item }) => {
    switch (item.type) {
      case 'header': return <SectionHeader title={item.title} />
      case 'message': return <MessageRow text={item.text} />
      case 'image': return <ImageRow url={item.url} />
    }
  }}
  recycleItems
/>
```

---

## 3. Animation — HIGH

### 3.1 Animate Transform and Opacity Only

Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding` — these trigger layout every frame. Use `transform` (scale, translate) and `opacity` which run on the GPU.

**Correct:**

```tsx
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scaleY: withTiming(expanded ? 1 : 0) }],
  opacity: withTiming(expanded ? 1 : 0),
}))
```

### 3.2 Prefer useDerivedValue Over useAnimatedReaction

For derived values, use `useDerivedValue(() => 1 - progress.get())`. Reserve `useAnimatedReaction` for side effects only.

### 3.3 Use GestureDetector for Animated Press States

Use `Gesture.Tap()` with shared values instead of Pressable's `onPressIn`/`onPressOut`. Gesture callbacks run on UI thread as worklets.

Store the press **state** (0 or 1), derive scale via `interpolate`. Use `runOnJS` for JS callbacks.

---

## 4. Scroll Performance — HIGH

### 4.1 Never Track Scroll Position in useState

Use Reanimated `useSharedValue` for animations or `useRef` for non-reactive tracking. State updates cause render thrashing.

---

## 5. Navigation — HIGH

### 5.1 Use Native Navigators

Always use `@react-navigation/native-stack` (not `stack`), `react-native-bottom-tabs` (not `@react-navigation/bottom-tabs`), or expo-router defaults. Use native header options, not custom header components.

---

## 6. React State — MEDIUM

### 6.1 Minimize State Variables

Derive values during render instead of storing in state. `const total = items.reduce(...)` instead of `useEffect + setState`.

### 6.2 Use Fallback State

Use `undefined` initial state with `??` operator for reactive fallbacks that update when source changes.

```tsx
const [_enabled, setEnabled] = useState<boolean | undefined>(undefined)
const enabled = _enabled ?? fallbackEnabled
```

### 6.3 Dispatch Updaters for Dependent State

Use `setState(prev => ...)` instead of reading state directly to avoid stale closures.

---

## 7. State Architecture — MEDIUM

### 7.1 State Must Represent Ground Truth

Store `pressed` (0 or 1), not `scale` (0.95 or 1). Derive visual values via interpolation. State is minimal truth; everything else is derived.

---

## 8. React Compiler — MEDIUM

### 8.1 Destructure Functions Early

Destructure `const { push } = useRouter()` at render top — don't dot into objects.

### 8.2 Use .get() and .set() for Shared Values

Required for React Compiler compatibility with Reanimated.

---

## 9. User Interface — MEDIUM

### 9.1 Measuring Views

Use `useLayoutEffect` + `getBoundingClientRect()` for sync measurement, `onLayout` for updates.

### 9.2 Modern Styling Patterns

- `borderCurve: 'continuous'` with `borderRadius`
- `gap` instead of margin for spacing
- `experimental_backgroundImage` for gradients
- CSS `boxShadow` string syntax for shadows
- Vary weight/color for hierarchy, not font size

### 9.3 contentInset for Dynamic Spacing

Use `contentInset` instead of padding for dynamic scroll offsets — no layout recalculation.

### 9.4 contentInsetAdjustmentBehavior for Safe Areas

Use `contentInsetAdjustmentBehavior="automatic"` on root ScrollView instead of SafeAreaView.

### 9.5 Use expo-image

Replace React Native `Image` with `expo-image` for caching, blurhash placeholders, and progressive loading.

### 9.6 Galeria for Image Galleries

Use `@nandorojo/galeria` for lightbox with shared element transitions, pinch-to-zoom, pan-to-close.

### 9.7 Native Menus with Zeego

Use `zeego/dropdown-menu` and `zeego/context-menu` for native platform menus.

### 9.8 Native Modals Over JS Bottom Sheets

Use `<Modal presentationStyle="formSheet">` or React Navigation v7 form sheets.

### 9.9 Pressable Over Touchable

Never use `TouchableOpacity`/`TouchableHighlight`. Use `Pressable`.

---

## 10. Design System — MEDIUM

### 10.1 Compound Components Over Polymorphic Children

Use `Button` + `ButtonText` + `ButtonIcon` instead of a single component accepting `string | ReactNode`.

---

## 11. Monorepo — LOW

### 11.1 Native Deps in App Directory

Autolinking only scans app's `node_modules` — install native deps in app package.

### 11.2 Single Dependency Versions

Use exact versions across all packages. Use syncpack or pnpm overrides.

---

## 12-14. Dependencies, JS, Fonts — LOW

### Import from Design System Folder

Re-export from `@/components/`, not directly from packages.

### Hoist Intl Formatter Creation

`Intl.NumberFormat` is expensive — hoist to module scope.

### Load Fonts at Build Time

Use `expo-font` config plugin instead of `useFonts` for fonts available at launch.

---

## References

1. [react.dev](https://react.dev) | [reactnative.dev](https://reactnative.dev)
2. [Reanimated](https://docs.swmansion.com/react-native-reanimated) | [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler)
3. [Expo](https://docs.expo.dev) | [LegendList](https://legendapp.com/open-source/legend-list)
4. [Galeria](https://github.com/nandorojo/galeria) | [Zeego](https://zeego.dev)

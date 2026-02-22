> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：前端开发

# UI 样式技能

综合技能指南，结合 shadcn/ui 组件、Tailwind CSS 工具类样式和基于 Canvas 的视觉设计系统，创建美观、无障碍的用户界面。

## 参考资源

- shadcn/ui：https://ui.shadcn.com/llms.txt
- Tailwind CSS：https://tailwindcss.com/docs

## 适用场景

- 使用基于 React 的框架（Next.js、Vite、Remix、Astro）构建 UI
- 实现无障碍组件（对话框、表单、表格、导航）
- 工具类优先（Utility-first）的 CSS 样式方案
- 创建响应式、移动优先的布局
- 实现暗色模式和主题定制
- 构建具有一致设计令牌（Token）的设计系统
- 生成视觉设计、海报或品牌素材
- 快速原型开发，即时视觉反馈
- 添加复杂 UI 模式（数据表格、图表、命令面板）

---

## 核心技术栈

### 组件层：shadcn/ui

- 基于 Radix UI 原语的预构建无障碍组件
- 复制粘贴分发模式（组件存在于你的代码库中）
- TypeScript 优先，完全类型安全
- 可组合的原语，用于构建复杂 UI
- 基于 CLI 的安装和管理

### 样式层：Tailwind CSS

- 工具类优先的 CSS 框架
- 构建时处理，零运行时开销
- 移动优先的响应式设计
- 一致的设计令牌（颜色、间距、字体排印）
- 自动死代码消除

### 视觉设计层：Canvas

- 博物馆级别的视觉构图
- 设计哲学驱动的方法
- 精致的视觉传达
- 最少文字，最大视觉冲击
- 系统化的模式和精致美学

---

## 快速开始

### 组件 + 样式设置

**安装 shadcn/ui 配合 Tailwind：**

```bash
npx shadcn@latest init
```

CLI 会提示选择框架、TypeScript、路径和主题偏好。这会同时配置 shadcn/ui 和 Tailwind CSS。

**添加组件：**

```bash
npx shadcn@latest add button card dialog form
```

**使用组件配合工具类样式：**

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function Dashboard() {
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">分析面板</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">查看你的指标</p>
          <Button variant="default" className="w-full">
            查看详情
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 替代方案：仅使用 Tailwind

**Vite 项目：**

```bash
npm install -D tailwindcss @tailwindcss/vite
```

```javascript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default { plugins: [tailwindcss()] }
```

```css
/* src/index.css */
@import "tailwindcss";
```

---

## 组件库指南

### 表单与输入组件

Button（按钮）、Input（输入框）、Select（下拉选择）、Checkbox（复选框）、Date Picker（日期选择器）、Form 表单验证

### 布局与导航

Card（卡片）、Tabs（标签页）、Accordion（手风琴）、Navigation Menu（导航菜单）

### 覆盖层与对话框

Dialog（对话框）、Drawer（抽屉）、Popover（弹出框）、Toast（消息提示）、Command（命令面板）

### 反馈与状态

Alert（警告）、Progress（进度条）、Skeleton（骨架屏）

### 展示组件

Table（表格）、Data Table（数据表格）、Avatar（头像）、Badge（徽章）

---

## 主题与定制

### 暗色模式设置

使用 `next-themes` 实现暗色模式切换：

- CSS 变量系统
- 颜色定制和调色板
- 组件变体定制
- 主题切换组件实现

### CSS 变量系统

shadcn/ui 使用 CSS 变量来定义主题令牌，支持亮色和暗色模式的无缝切换。

---

## 无障碍模式

基于 Radix UI 的无障碍特性：

- **键盘导航**：所有组件支持完整的键盘操作
- **焦点管理**：自动管理焦点陷阱和焦点恢复
- **屏幕阅读器**：适当的 ARIA 属性和公告
- **表单验证无障碍**：错误信息与表单控件的正确关联

---

## Tailwind 工具类

### 布局工具类

```html
<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">
  <div class="flex-1">内容</div>
  <div class="flex-shrink-0">侧栏</div>
</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</div>
```

### 间距系统

```html
<!-- 内边距 -->
<div class="p-4">全方向</div>
<div class="px-4 py-2">水平/垂直</div>

<!-- 外边距 -->
<div class="m-4">全方向</div>
<div class="mt-4 mb-2">顶部/底部</div>

<!-- 间隙 -->
<div class="flex gap-4">弹性间隙</div>
```

### 字体排印

```html
<h1 class="text-4xl font-bold tracking-tight">标题</h1>
<p class="text-lg text-muted-foreground leading-relaxed">正文</p>
<span class="text-sm font-medium">辅助文字</span>
```

### 颜色和背景

```html
<div class="bg-primary text-primary-foreground">主色调</div>
<div class="bg-secondary text-secondary-foreground">次色调</div>
<div class="bg-muted text-muted-foreground">静音色调</div>
<div class="bg-destructive text-destructive-foreground">危险色调</div>
```

---

## 响应式设计

### 移动优先的断点系统

| 断点 | 最小宽度 | CSS |
|------|----------|-----|
| `sm` | 640px | `@media (min-width: 640px)` |
| `md` | 768px | `@media (min-width: 768px)` |
| `lg` | 1024px | `@media (min-width: 1024px)` |
| `xl` | 1280px | `@media (min-width: 1280px)` |
| `2xl` | 1536px | `@media (min-width: 1536px)` |

**核心原则：** 从移动端样式开始，通过断点前缀逐步添加更大屏幕的样式。

```html
<!-- 移动端单列，平板双列，桌面三列 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- 内容 -->
</div>

<!-- 响应式间距 -->
<div class="p-4 md:p-6 lg:p-8">
  <!-- 内容 -->
</div>

<!-- 响应式显示/隐藏 -->
<div class="hidden md:block">仅桌面端可见</div>
<div class="block md:hidden">仅移动端可见</div>
```

---

## Tailwind 定制

### @theme 指令定义自定义令牌

```css
@theme {
  --color-brand: #3b82f6;
  --color-brand-light: #60a5fa;
  --font-display: "Cal Sans", sans-serif;
}
```

### 自定义工具类

```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### 组件提取

```css
@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium;
  }
}
```

### 层组织

```css
@layer base {
  /* 基础样式重置 */
}

@layer components {
  /* 组件类 */
}

@layer utilities {
  /* 工具类 */
}
```

---

## 常见模式

### 表单验证

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-6">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>邮箱</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full">登录</Button>
      </form>
    </Form>
  )
}
```

### 响应式布局 + 暗色模式

```tsx
<div className="min-h-screen bg-white dark:bg-gray-900">
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            内容
          </h3>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
```

---

## Canvas 视觉设计系统

### 设计哲学

- **视觉传达优先于文字**：让构图引导注意力
- **系统化模式**：一致的颜色、形式和空间设计
- **最少文字集成**：文字服务于设计，而非主导
- **博物馆级别执行**：每个细节都要精致
- **多页设计系统**：跨页面保持一致的视觉语言

### 核心原则

- 精致的视觉构图
- 颜色、形式和空间的和谐
- 最大化视觉冲击力
- 系统化的设计模式

---

## 工具脚本

### shadcn_add.py - 组件安装

带依赖处理的 shadcn/ui 组件添加：

```bash
python scripts/shadcn_add.py button card dialog
```

### tailwind_config_gen.py - 配置生成

生成带自定义主题的 tailwind.config.js：

```bash
python scripts/tailwind_config_gen.py --colors brand:blue --fonts display:Inter
```

---

## 最佳实践

1. **组件组合**：从简单、可组合的原语构建复杂 UI
2. **工具类优先样式**：直接使用 Tailwind 类；仅在真正重复时提取组件
3. **移动优先响应式**：从移动端样式开始，逐步叠加响应式变体
4. **无障碍优先**：利用 Radix UI 原语，添加焦点状态，使用语义化 HTML
5. **设计令牌**：使用一致的间距比例、调色板、字体排印系统
6. **暗色模式一致性**：所有主题元素都应用暗色变体
7. **性能**：利用自动 CSS 清除，避免动态类名
8. **TypeScript**：使用完整类型安全获得更好的开发体验
9. **视觉层次**：让构图引导注意力，有意识地使用间距和颜色
10. **匠人精神**：每个细节都重要——将 UI 视为一门手艺

---

## 参考导航

**组件库**
- shadcn 组件目录
- 主题与定制
- 无障碍模式

**样式系统**
- Tailwind 核心工具类
- 响应式设计
- 配置与扩展

**视觉设计**
- Canvas 设计哲学与工作流

---

## 外部资源

- shadcn/ui 文档：https://ui.shadcn.com
- Tailwind CSS 文档：https://tailwindcss.com
- Radix UI：https://radix-ui.com
- Tailwind UI：https://tailwindui.com
- Headless UI：https://headlessui.com
- v0（AI UI 生成器）：https://v0.dev

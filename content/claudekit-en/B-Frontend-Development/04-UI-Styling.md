> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Frontend Development

---
name: ui-styling
description: Use when building UI with shadcn/ui components, Tailwind CSS utility-first styling, or Canvas-based visual design. Covers accessible components, responsive layouts, dark mode, theming, design tokens, and visual design systems.
---

# UI Styling

## Overview

Comprehensive skill combining shadcn/ui components, Tailwind CSS utility-first styling, and Canvas-based visual design systems to create beautiful, accessible user interfaces. Covers the full stack from component libraries to design philosophy.

## References

- shadcn/ui: https://ui.shadcn.com/llms.txt
- Tailwind CSS: https://tailwindcss.com/docs

## When to Use

- Building UI with React-based frameworks (Next.js, Vite, Remix, Astro)
- Implementing accessible components (dialogs, forms, tables, navigation)
- Utility-first CSS styling
- Creating responsive, mobile-first layouts
- Implementing dark mode and theme customization
- Building design systems with consistent design tokens
- Generating visual designs, posters, or brand assets
- Rapid prototyping with instant visual feedback
- Adding complex UI patterns (data tables, charts, command palettes)

---

## Core Technology Stack

### Component Layer: shadcn/ui

- Pre-built accessible components based on Radix UI primitives
- Copy-paste distribution model (components live in your codebase)
- TypeScript-first, fully type-safe
- Composable primitives for building complex UI
- CLI-based installation and management

### Styling Layer: Tailwind CSS

- Utility-first CSS framework
- Build-time processing, zero runtime overhead
- Mobile-first responsive design
- Consistent design tokens (colors, spacing, typography)
- Automatic dead code elimination

### Visual Design Layer: Canvas

- Museum-quality visual composition
- Design philosophy-driven approach
- Refined visual communication
- Minimal text, maximum visual impact
- Systematic patterns and refined aesthetics

---

## Quick Start

### Components + Styling Setup

**Install shadcn/ui with Tailwind:**

```bash
npx shadcn@latest init
```

The CLI will prompt for framework, TypeScript, paths, and theme preferences. This configures both shadcn/ui and Tailwind CSS.

**Add components:**

```bash
npx shadcn@latest add button card dialog form
```

**Use components with utility styling:**

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function Dashboard() {
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">View your metrics</p>
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Alternative: Tailwind Only

**Vite project:**

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

## Component Library Guide

### Forms & Inputs

Button, Input, Select, Checkbox, Date Picker, Form Validation

### Layout & Navigation

Card, Tabs, Accordion, Navigation Menu

### Overlays & Dialogs

Dialog, Drawer, Popover, Toast, Command Palette

### Feedback & Status

Alert, Progress, Skeleton

### Display Components

Table, Data Table, Avatar, Badge

---

## Theming & Customization

### Dark Mode Setup

Use `next-themes` for dark mode toggling:

- CSS variable system
- Color customization and palettes
- Component variant customization
- Theme toggle component implementation

### CSS Variable System

shadcn/ui uses CSS variables for theme tokens, enabling seamless light/dark mode switching.

---

## Accessibility Patterns

Built on Radix UI accessibility features:

- **Keyboard Navigation**: Full keyboard support for all components
- **Focus Management**: Automatic focus trapping and restoration
- **Screen Readers**: Proper ARIA attributes and announcements
- **Form Validation Accessibility**: Error messages correctly associated with form controls

---

## Tailwind Utilities

### Layout Utilities

```html
<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">
  <div class="flex-1">Content</div>
  <div class="flex-shrink-0">Sidebar</div>
</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Spacing System

```html
<!-- Padding -->
<div class="p-4">All sides</div>
<div class="px-4 py-2">Horizontal/Vertical</div>

<!-- Margin -->
<div class="m-4">All sides</div>
<div class="mt-4 mb-2">Top/Bottom</div>

<!-- Gap -->
<div class="flex gap-4">Flex gap</div>
```

### Typography

```html
<h1 class="text-4xl font-bold tracking-tight">Heading</h1>
<p class="text-lg text-muted-foreground leading-relaxed">Body text</p>
<span class="text-sm font-medium">Helper text</span>
```

### Colors & Backgrounds

```html
<div class="bg-primary text-primary-foreground">Primary</div>
<div class="bg-secondary text-secondary-foreground">Secondary</div>
<div class="bg-muted text-muted-foreground">Muted</div>
<div class="bg-destructive text-destructive-foreground">Destructive</div>
```

---

## Responsive Design

### Mobile-First Breakpoint System

| Breakpoint | Min Width | CSS |
|------------|-----------|-----|
| `sm` | 640px | `@media (min-width: 640px)` |
| `md` | 768px | `@media (min-width: 768px)` |
| `lg` | 1024px | `@media (min-width: 1024px)` |
| `xl` | 1280px | `@media (min-width: 1280px)` |
| `2xl` | 1536px | `@media (min-width: 1536px)` |

**Core principle:** Start with mobile styles, progressively add larger screen styles via breakpoint prefixes.

```html
<!-- Mobile single column, tablet 2 columns, desktop 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Content -->
</div>

<!-- Responsive spacing -->
<div class="p-4 md:p-6 lg:p-8">
  <!-- Content -->
</div>

<!-- Responsive show/hide -->
<div class="hidden md:block">Desktop only</div>
<div class="block md:hidden">Mobile only</div>
```

---

## Tailwind Customization

### @theme Directive for Custom Tokens

```css
@theme {
  --color-brand: #3b82f6;
  --color-brand-light: #60a5fa;
  --font-display: "Cal Sans", sans-serif;
}
```

### Custom Utilities

```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Component Extraction

```css
@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium;
  }
}
```

### Layer Organization

```css
@layer base {
  /* Base style resets */
}

@layer components {
  /* Component classes */
}

@layer utilities {
  /* Utility classes */
}
```

---

## Common Patterns

### Form Validation

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
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </Form>
  )
}
```

### Responsive Layout + Dark Mode

```tsx
<div className="min-h-screen bg-white dark:bg-gray-900">
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Content
          </h3>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
```

---

## Canvas Visual Design System

### Design Philosophy

- **Visual communication over text**: Let composition guide attention
- **Systematic patterns**: Consistent color, form, and spatial design
- **Minimal text integration**: Text serves design, not dominates
- **Museum-quality execution**: Every detail must be refined
- **Multi-page design systems**: Consistent visual language across pages

### Core Principles

- Refined visual composition
- Harmony of color, form, and space
- Maximum visual impact
- Systematic design patterns

---

## Utility Scripts

### shadcn_add.py - Component Installation

Add shadcn/ui components with dependency handling:

```bash
python scripts/shadcn_add.py button card dialog
```

### tailwind_config_gen.py - Configuration Generation

Generate tailwind.config.js with custom themes:

```bash
python scripts/tailwind_config_gen.py --colors brand:blue --fonts display:Inter
```

---

## Best Practices

1. **Component composition**: Build complex UI from simple, composable primitives
2. **Utility-first styling**: Use Tailwind classes directly; extract components only when truly repetitive
3. **Mobile-first responsive**: Start with mobile styles, layer responsive variants
4. **Accessibility first**: Leverage Radix UI primitives, add focus states, use semantic HTML
5. **Design tokens**: Use consistent spacing scales, color palettes, typography systems
6. **Dark mode consistency**: Apply dark variants to all themed elements
7. **Performance**: Leverage automatic CSS purging, avoid dynamic class names
8. **TypeScript**: Use full type safety for better DX
9. **Visual hierarchy**: Let composition guide attention, use spacing and color intentionally
10. **Craftsmanship**: Every detail matters -- treat UI as a craft

---

## Reference Navigation

**Component Library**
- shadcn component catalog
- Theming & customization
- Accessibility patterns

**Styling System**
- Tailwind core utilities
- Responsive design
- Configuration & extension

**Visual Design**
- Canvas design philosophy & workflow

---

## External Resources

- shadcn/ui Docs: https://ui.shadcn.com
- Tailwind CSS Docs: https://tailwindcss.com
- Radix UI: https://radix-ui.com
- Tailwind UI: https://tailwindui.com
- Headless UI: https://headlessui.com
- v0 (AI UI Generator): https://v0.dev

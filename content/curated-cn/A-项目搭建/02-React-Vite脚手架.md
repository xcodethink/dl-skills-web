> 来源：DL Skills 精选 | 分类：项目搭建

---
name: react-vite-scaffold
description: Modern React + Vite + TypeScript project setup with full toolchain configuration
---

# React + Vite 脚手架（React/Vite Scaffold）

## 概述

使用 Vite 创建现代 React 项目的标准流程。覆盖从 `npm create vite` 到 Tailwind CSS 4、路由、测试、状态管理和代码规范的完整工具链配置。目标：10 分钟内让项目进入可开发状态。

## 工作流

1. 使用 `npm create vite@latest` 创建 TypeScript 项目
2. 安装核心依赖（路由、样式、测试、代码规范）
3. 配置 Tailwind CSS 4（Vite 插件方式）
4. 设置路径别名（Path Aliases）`@/` 映射
5. 配置 Vitest + Testing Library 测试环境
6. 配置 ESLint + Prettier 代码规范
7. 按职责划分目录结构
8. 编写第一个冒烟测试（Smoke Test）

## 初始化步骤

### 1. 创建项目

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### 2. 安装核心依赖

```bash
# 路由
npm install react-router-dom

# 样式 — Tailwind CSS 4 使用 Vite 插件
npm install -D tailwindcss @tailwindcss/vite

# 测试
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# 代码规范
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
npm install -D prettier eslint-config-prettier
```

### 3. Tailwind CSS 4 集成

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

## 目录结构

```
src/
├── components/       # 可复用 UI 组件
│   ├── ui/           # 基础 UI 组件（Button, Input 等）
│   └── layout/       # 布局组件（Header, Sidebar 等）
├── features/         # 按功能模块组织（可选，大型项目推荐）
├── hooks/            # 自定义 React Hooks
├── lib/              # 工具函数、API 客户端、常量
├── pages/            # 路由页面组件
├── types/            # TypeScript 类型定义
├── App.tsx           # 根组件
├── main.tsx          # 入口文件
└── index.css         # 全局样式（Tailwind 入口）
```

**结构选择指南：** 小型项目使用 `components/ + pages/` 分离即可；中大型项目增加 `features/` 目录，每个功能模块包含自己的组件、hooks 和类型定义。

## 关键配置

### 路径别名（Path Aliases）— @/ 映射

```typescript
// vite.config.ts
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```jsonc
// tsconfig.json — 同步 TypeScript 路径解析
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Vitest 测试配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
})
```

```typescript
// src/test-setup.ts
import '@testing-library/jest-dom'
```

### ESLint + Prettier

```javascript
// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules },
  prettierConfig,
)
```

## 状态管理选型指南

| 场景 | 推荐方案 | 理由 |
|------|----------|------|
| 简单全局状态（主题、用户信息） | Zustand | API 极简，无 Provider 包裹，TypeScript 友好 |
| 服务端数据（API 缓存、分页） | TanStack Query | 自动缓存、失效重取、乐观更新 |
| 表单状态 | React Hook Form | 非受控模式，性能优异，验证集成 |
| 复杂跨组件通信 | Zustand + immer | 不可变更新（Immutable Update）简洁 |

原则：不要在项目初期引入 Redux——除非你确定需要时间旅行调试（Time-travel Debugging）或中间件生态。

## 必备依赖清单（Essential Packages）

| 类别 | 包名 | 用途 |
|------|------|------|
| 路由 | `react-router-dom` | SPA 路由管理 |
| 样式 | `tailwindcss` + `@tailwindcss/vite` | 原子化 CSS |
| 测试 | `vitest` + `@testing-library/react` | 单元/组件测试 |
| 状态 | `zustand`（按需） | 轻量全局状态 |
| 数据 | `@tanstack/react-query`（按需） | 服务端状态管理 |
| 图标 | `lucide-react`（按需） | 轻量 SVG 图标库 |

## package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

## 必须做（MUST DO）

- 使用 TypeScript 的 `strict` 模式
- 配置路径别名（`@/`），避免 `../../../` 相对路径
- 在 `package.json` 中添加 lint、format、test 脚本
- 将组件按职责分离：`pages/` 放路由组件，`components/` 放可复用组件
- 从第一天起写测试——至少一个冒烟测试

## 禁止做（MUST NOT DO）

- 禁止使用 `any` 类型——不确定时先用 `unknown` 再收窄
- 禁止在组件中直接写 API 调用——抽到 `lib/` 或自定义 Hook 中
- 禁止跳过 ESLint 配置——技术债从第一天开始累积
- 禁止在 `src/` 根目录堆放所有文件——即使项目小也要建子目录
- 禁止使用 Create React App——已停止维护，Vite 是现代标准

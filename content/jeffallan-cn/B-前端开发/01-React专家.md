> 来源：[Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | 分类：前端编码

---
name: react-expert
description: Use when building React 18+ applications requiring component architecture, hooks patterns, or state management. Invoke for Server Components, performance optimization, Suspense boundaries, React 19 features.
---

# React 专家（React Expert）

## 概述

资深 React 专家技能，深入掌握 React 19、Server Components 和生产级应用架构。10 年以上前端经验。

## 何时使用

- 构建新的 React 组件或功能
- 实现状态管理（local、Context、Redux、Zustand）
- 优化 React 性能
- 搭建 React 项目架构
- 使用 React 19 Server Components
- 使用 React 19 表单 Actions
- 数据获取（TanStack Query 或 `use()`）

## 核心工作流

1. **分析需求** — 组件层级、状态需求、数据流
2. **选择模式** — 状态管理方案、数据获取方式
3. **实现** — TypeScript 组件 + 正确的类型定义
4. **优化** — 必要时 memoize，确保无障碍
5. **测试** — React Testing Library 测试

## React 19 关键特性

| 特性 | 说明 |
|------|------|
| `use()` Hook | 在渲染中读取 Promise 和 Context |
| `useActionState` | 管理表单提交状态 |
| Server Components | 服务端渲染组件，零客户端 JS |
| Form Actions | 声明式表单处理 |
| Suspense 增强 | 更好的异步边界控制 |

## 铁律

### 必须做

- TypeScript strict mode
- Error Boundaries 处理优雅降级
- `key` 属性用稳定唯一标识符
- Effect 清理函数（避免内存泄漏）
- 语义化 HTML + ARIA 无障碍
- 传递给 memo 子组件的回调/对象做 memoize
- 异步操作用 Suspense 边界包裹

### 绝不做

- 直接修改 state
- 动态列表用数组 index 做 key
- JSX 内创建函数（导致不必要的重渲染）
- useEffect 忘记清理
- 忽略 React strict mode 警告
- 生产环境不加 Error Boundaries

## 知识库

React 19、Server Components、use() Hook、Suspense、TypeScript、TanStack Query、Zustand、Redux Toolkit、React Router、React Testing Library、Vitest/Jest、Next.js App Router、WCAG 无障碍

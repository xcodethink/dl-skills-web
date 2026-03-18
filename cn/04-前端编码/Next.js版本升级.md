> 来源：[vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) | 分类：前端编码 | ⭐ Vercel 官方

---
name: next-upgrade
description: Upgrade Next.js to the latest version following official migration guides and codemods
---

# Next.js 版本升级（Next.js Upgrade）

## 概述

按照官方迁移指南将当前项目升级到最新 Next.js 版本的系统化流程。涵盖版本检测、代码修改工具（codemods）运行、依赖更新、破坏性变更审查和升级测试等完整步骤。

---

## 升级步骤

### 1. 检测当前版本

读取 `package.json` 识别当前 Next.js 版本及相关依赖（React、React DOM 等）。

### 2. 获取最新升级指南

查阅官方升级文档：
- 代码修改工具：https://nextjs.org/docs/app/guides/upgrading/codemods
- 版本特定指南（根据需要调整版本）：
  - https://nextjs.org/docs/app/guides/upgrading/version-16
  - https://nextjs.org/docs/app/guides/upgrading/version-15
  - https://nextjs.org/docs/app/guides/upgrading/version-14

### 3. 确定升级路径

根据当前版本，确定适用的迁移步骤。对于主要版本跨越，应逐步升级（例如 13 -> 14 -> 15）。

### 4. 首先运行代码修改工具

Next.js 提供代码修改工具（codemods）来自动化破坏性变更的处理：

```bash
npx @next/codemod@latest <transform> <path>
```

常用转换：
- `next-async-request-api` - 更新异步请求 API（v15）
- `next-request-geo-ip` - 迁移 geo/ip 属性（v15）
- `next-dynamic-access-named-export` - 转换动态导入（v15）

### 5. 更新依赖

一起升级 Next.js 和对等依赖（peer dependencies）：

```bash
npm install next@latest react@latest react-dom@latest
```

### 6. 审查破坏性变更

检查升级指南中需要手动修改的内容：
- API 变更（例如 v15 中的异步 params）
- `next.config.js` 中的配置变更
- 被移除的已弃用特性

### 7. 更新 TypeScript 类型（如适用）

```bash
npm install @types/react@latest @types/react-dom@latest
```

### 8. 测试升级

- 运行 `npm run build` 检查构建错误
- 运行 `npm run dev` 并测试关键功能

---

## 版本间关键变更速查

### Next.js 14 -> 15

- `params` 和 `searchParams` 变为异步（Promise）
- `cookies()`、`headers()` 变为异步
- 运行代码修改工具：`npx @next/codemod@latest next-async-request-api .`

### Next.js 15 -> 16

- `middleware.ts` 重命名为 `proxy.ts`
- `experimental.ppr` 替换为 `cacheComponents: true`
- `unstable_cache()` 替换为 `'use cache'` 指令
- 运行升级工具：`npx @next/codemod@latest upgrade`

---

## 最佳实践

1. **逐步升级** - 不要跳过主要版本，一步步来
2. **先运行 codemod** - 自动化能处理的先自动化
3. **构建优先** - 每步升级后先跑构建确认无误
4. **阅读变更日志** - 官方文档是最权威的迁移参考
5. **测试关键路径** - 升级后重点测试核心业务功能

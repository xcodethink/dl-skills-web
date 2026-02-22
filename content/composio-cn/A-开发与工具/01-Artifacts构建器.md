> 来源：[ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 分类：开发与工具

# Artifacts 构建器

使用现代前端技术（React、Tailwind CSS、shadcn/ui）为 claude.ai 构建精美的多组件 HTML Artifacts（制品）。适用于需要状态管理、路由或 shadcn/ui 组件的复杂 Artifacts，不适用于简单的单文件 HTML/JSX 制品。

构建强大的前端 claude.ai Artifacts，请按以下步骤操作：
1. 使用 `scripts/init-artifact.sh` 初始化前端项目
2. 编辑生成的代码来开发 Artifact
3. 使用 `scripts/bundle-artifact.sh` 将所有代码打包为单个 HTML 文件
4. 向用户展示 Artifact
5. （可选）测试 Artifact

**技术栈**：React 18 + TypeScript + Vite + Parcel（打包）+ Tailwind CSS + shadcn/ui

## 设计与样式指南

非常重要：为避免常见的"AI 感"设计，请避免过度使用居中布局、紫色渐变、统一圆角和 Inter 字体。

## 快速开始

### 第一步：初始化项目

运行初始化脚本创建新的 React 项目：
```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

该脚本会创建一个完整配置的项目，包括：
- React + TypeScript（通过 Vite 构建）
- Tailwind CSS 3.4.1，带 shadcn/ui 主题系统
- 路径别名（`@/`）已配置
- 40+ 个 shadcn/ui 组件预装
- 所有 Radix UI 依赖已包含
- Parcel 打包配置（通过 .parcelrc）
- Node 18+ 兼容性（自动检测并锁定 Vite 版本）

### 第二步：开发 Artifact

编辑生成的文件来构建 Artifact。参见下方**常见开发任务**获取指导。

### 第三步：打包为单个 HTML 文件

将 React 应用打包为单个 HTML Artifact：
```bash
bash scripts/bundle-artifact.sh
```

该命令生成 `bundle.html` — 一个自包含的 Artifact 文件，所有 JavaScript、CSS 和依赖均已内联。此文件可直接在 Claude 对话中作为 Artifact 分享。

**要求**：项目根目录必须有一个 `index.html` 文件。

**脚本执行内容**：
- 安装打包依赖（parcel、@parcel/config-default、parcel-resolver-tspaths、html-inline）
- 创建 `.parcelrc` 配置，支持路径别名
- 使用 Parcel 构建（无 Source Maps）
- 使用 html-inline 将所有资源内联到单个 HTML 文件

### 第四步：向用户分享 Artifact

将打包后的 HTML 文件在对话中分享给用户，使其能以 Artifact 形式查看。

### 第五步：测试/预览 Artifact（可选）

注意：此步骤完全可选，仅在必要时或用户要求时执行。

要测试/预览 Artifact，可使用可用工具（包括其他技能或内置工具，如 Playwright 或 Puppeteer）。一般情况下，应避免提前测试 Artifact，因为这会增加从请求到看到最终制品之间的延迟。建议在展示后，若用户要求或出现问题时再进行测试。

## 参考资料

- **shadcn/ui 组件**：https://ui.shadcn.com/docs/components

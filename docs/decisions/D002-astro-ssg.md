# D002: 使用 Astro SSG + Preact 静态生成方案

- **日期**：2026-02
- **状态**：已确定
- **参与者**：Wayne, Claude

## 背景

需要一个技能展示网站，内容以 Markdown 为主，SEO 要求高。

## 决策

选择 Astro 5 + Preact + Tailwind CSS 4 静态生成方案。

## 理由

- 内容为主的网站，SSG 性能最优（全静态 HTML，无 JS hydration 开销）
- Preact 作为 Island 组件处理交互部分（搜索、筛选），体积远小于 React
- Astro 的 Content Collections 天然适合 Markdown/YAML 数据源
- Cloudflare Pages 对静态站免费，无 Serverless 超时问题
- 构建产物 298 页，部署体积小

## 备选方案

- Next.js SSG：功能更多但体积更大，对纯内容站过重
- Nuxt：团队不熟悉 Vue 生态
- Hugo/11ty：构建快但交互组件开发体验差

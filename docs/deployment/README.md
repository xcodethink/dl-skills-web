# DL Skills Web — 部署和配置总览

> 最后更新：2026-02-27

## 项目基本信息

| 项目 | 值 |
|------|-----|
| 名称 | DL Skills Web (Claude Code Skills) |
| 域名 | https://claudecodeskills.wayjet.io |
| Git 仓库 | https://github.com/xcodethink/dl-skills-web.git |
| 框架 | Astro 5 + Preact + Tailwind CSS 4 |
| 渲染模式 | 静态生成 (SSG) |
| 本地开发 | `npm run dev` → http://localhost:4321 |

---

## 平台一览

| 平台 | 用途 | 账号/项目 | 费用 | 备注 |
|------|------|----------|------|------|
| Cloudflare Pages | 托管+CDN | project: dl-skills-web | Free | 主部署平台 |
| Cloudflare D1 | 数据库 | dl-skills-pipeline | Free | 用于 pipeline 数据 |
| Cloudflare DNS | 域名解析 | wayjet.io | 域名费用 | 子域名 claudecodeskills |
| GitHub | 代码仓库 | xcodethink/dl-skills-web | Free | 私有仓库 |
| Google Search Console | SEO | claudecodeskills.wayjet.io | Free | 验证文件: googlee7d411e5daf292f1.html |

---

## Cloudflare 配置

### Workers / Pages 绑定

配置文件：`wrangler.jsonc`

```jsonc
{
  "name": "dl-skills-web",
  "main": "worker/index.ts",
  "assets": { "directory": "./dist", "binding": "ASSETS" },
  "d1_databases": [{
    "binding": "DB",
    "database_name": "dl-skills-pipeline",
    "database_id": "4901f87d-862c-42d6-98d1-2dc1c9ca07ef"
  }]
}
```

### DNS 配置

| 类型 | 名称 | 值 | Proxy |
|------|------|-----|-------|
| CNAME | claudecodeskills | dl-skills-web.pages.dev | 视情况 |

---

## 构建和部署

### 构建命令

```bash
npm run build          # astro build → 输出到 dist/
```

### 部署命令

```bash
npx wrangler pages deploy dist --commit-dirty=true
```

### 关键说明

- 纯静态生成，无 Serverless Function 超时问题
- Worker (`worker/index.ts`) 处理自定义路由逻辑
- Pagefind 搜索索引在构建时生成
- Sitemap 通过 `@astrojs/sitemap` 自动生成

---

## 环境变量

| 变量名 | 用途 | 配置位置 | 敏感 |
|--------|------|----------|------|
| CONSOLE_PATH | 控制台路径（sitemap 排除用） | astro.config.mjs | 否 |

**此项目环境变量很少**，大部分配置在 `wrangler.jsonc` 和 `astro.config.mjs` 中。

---

## 数据来源

技能数据来源于 YAML 注册表 (`data/` 目录):

- `sources.yaml` — 来源仓库注册
- `skills-registry.yaml` — 技能注册
- `categories.yaml` — 分类定义
- `workflows.yaml` — 工作流定义
- `bundles.yaml` — 技能包定义

内容文件在 `content/` 目录，来源整理文件在项目父目录 (`DL Skills/`) 的各 `*-cn/` 和 `*-en/` 文件夹。

---

## SEO 相关

- Google Search Console 验证文件：`public/googlee7d411e5daf292f1.html`
- Sitemap：`https://claudecodeskills.wayjet.io/sitemap-index.xml`
- site 配置在 `astro.config.mjs` 的 `site` 字段

# 第三方平台登记

> 最后更新：2026-02-27
>
> 记录本项目接入的所有外部平台和服务。新增或移除任何第三方服务后必须同步更新。

## 总览

| 平台 | 类别 | 用途 | 费用 | 配置位置 |
|------|------|------|------|----------|
| Google Search Console | SEO | 搜索索引管理、收录监控 | 免费 | 验证文件 `public/googlee7d411e5daf292f1.html` |
| Cloudflare Pages | 托管 | 网站部署和 CDN | 免费 | `wrangler.jsonc` |
| Cloudflare D1 | 数据库 | Pipeline 数据存储 | 免费 | `wrangler.jsonc` D1 绑定 |
| Cloudflare DNS | 域名 | DNS 解析 | 域名年费 | Cloudflare Dashboard |
| GitHub | 代码 | 代码仓库（私有） | 免费 | `.git/config` |
| Pagefind | 搜索 | 全文搜索（构建时生成） | 免费（开源） | 构建时自动运行 |

---

## 详细配置

### Google Search Console

- **用途**：管理网站在 Google 搜索中的表现，提交 Sitemap，监控索引状态
- **账号**：Wayne 的 Google 账号
- **属性 ID**：`https://claudecodeskills.wayjet.io`
- **配置了什么**：
  - 验证方式：HTML 文件验证
  - 验证文件：`public/googlee7d411e5daf292f1.html`
  - Sitemap 已提交：`https://claudecodeskills.wayjet.io/sitemap-index.xml`
  - Sitemap 由 `@astrojs/sitemap` 集成自动生成
- **后台入口**：https://search.google.com/search-console
- **费用**：免费
- **注意事项**：
  - 验证文件不能删除，否则验证失效
  - Sitemap 在 `astro.config.mjs` 中配置了 filter 排除 console 路径

---

### Cloudflare Pages

- **用途**：网站托管、全球 CDN 分发、自定义域名
- **账号**：Wayne 的 Cloudflare 账号
- **项目名**：dl-skills-web
- **配置了什么**：
  - 自定义域名：`claudecodeskills.wayjet.io`
  - Workers 脚本：`worker/index.ts`（自定义路由逻辑）
  - Assets 绑定：静态文件从 `dist/` 目录提供
- **后台入口**：https://dash.cloudflare.com → Pages → dl-skills-web
- **费用**：免费（Free plan，500 次部署/月）
- **注意事项**：
  - 部署命令：`npx wrangler pages deploy dist --commit-dirty=true`
  - 必须先 `npm run build` 再部署

---

### Cloudflare D1

- **用途**：存储 Pipeline 处理数据（技能索引、来源追踪等）
- **账号**：同 Cloudflare 账号
- **数据库名**：dl-skills-pipeline
- **数据库 ID**：`4901f87d-862c-42d6-98d1-2dc1c9ca07ef`
- **配置了什么**：
  - 绑定名：`DB`
  - 配置文件：`wrangler.jsonc`
- **后台入口**：https://dash.cloudflare.com → D1 → dl-skills-pipeline
- **费用**：免费（Free plan，500MB 存储，5M 读取/天）
- **注意事项**：
  - D1 是 SQLite 引擎，复杂查询有限制
  - 数据量目前很小，Free plan 完全够用

---

### Cloudflare DNS

- **用途**：wayjet.io 域名的 DNS 解析
- **账号**：同 Cloudflare 账号
- **配置了什么**：
  - `claudecodeskills` 子域名 CNAME 指向 Cloudflare Pages
  - 与其他 wayjet.io 子域名共用同一个 DNS 区域
- **后台入口**：https://dash.cloudflare.com → wayjet.io → DNS
- **费用**：域名年费（wayjet.io 注册+续费）
- **注意事项**：
  - wayjet.io 域名续费日期需要关注
  - DNS 变更影响所有 wayjet.io 子站点

---

### GitHub

- **用途**：代码仓库，版本管理
- **账号**：xcodethink
- **仓库**：xcodethink/dl-skills-web（私有）
- **配置了什么**：
  - 远程仓库：`origin` → `https://github.com/xcodethink/dl-skills-web.git`
  - 默认分支：main
- **后台入口**：https://github.com/xcodethink/dl-skills-web
- **费用**：免费
- **注意事项**：
  - 私有仓库，公开前需要清理敏感信息

---

## 未来可能接入

| 平台 | 类别 | 用途 | 何时接入 |
|------|------|------|----------|
| Google Analytics 4 | 分析 | 流量统计和用户行为 | 需要详细分析数据时 |
| Sentry | 监控 | 前端错误追踪 | 用户量增长后 |
| UptimeRobot | 监控 | 网站可用性监控 | 上线稳定后 |

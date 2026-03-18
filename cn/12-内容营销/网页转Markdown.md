> 来源：[bear2u/my-skills](https://github.com/bear2u/my-skills) | 分类：D-内容与文档

# 网页转 Markdown（Web to Markdown Converter）

输入网页 URL，将页面内容转换为 Markdown 格式并保存。适用于将网页文档归档为本地 Markdown 文件或进行整理。

## 使用场景

遇到以下请求时使用此技能：
- "把网页转成 Markdown"
- "把这个 URL 保存成 Markdown"
- "把网站内容做成 Markdown 文件"
- "帮我归档网页"
- "把博客文章保存为 Markdown"
- **"转成适合 AI 阅读的格式"**（AI 优化模式）
- **"转成适合做上下文的格式"**（AI 优化模式）
- **"原版和 AI 优化版都做一份"**（双模式）

## 核心工作流程

### 第一步：获取 URL

从用户获取要转换的网页 URL。

**示例：**
```
Claude：请输入要转换的网页 URL。
User：https://example.com/article
```

**重要说明：**
- URL 须以 `http://` 或 `https://` 开头
- HTTP URL 会自动升级为 HTTPS
- 无效 URL 将返回错误

### 第二步：选择转换模式

分析用户请求选择合适的转换模式。

**转换模式：**
1. **普通模式**（默认）：将网页转为易读的 Markdown
2. **AI 优化模式**：转为 AI 代理最适合作为上下文使用的格式
3. **双模式**：同时生成原版 + AI 优化版两个文件

**自动检测关键词：**
- "AI 阅读"、"做上下文"、"AI 学习用" -> AI 优化模式
- "原版"、"都做"、"2 个"、"both"、"原版也保存" -> 双模式
- 其他 -> 普通模式

**示例 1（AI 优化）：**
```
User：https://example.com/article 转成适合 AI 阅读的格式
Claude：以 AI 优化模式转换。将添加结构化格式和元数据。
```

**示例 2（双模式）：**
```
User：https://example.com/article 原版和 AI 优化版都做一份
Claude：以双模式转换。
- 原版 Markdown（article.md）
- AI 优化版（article.context.md）
将生成 2 个文件。
```

### 第三步：确认保存选项

向用户确认保存位置和文件名。

**示例：**
```
Claude：Markdown 文件保存在哪里？
选项：
1. 当前目录（./）
2. 指定路径
3. 不保存文件，只查看内容

文件名？（默认：webpage.md）
User：保存在当前目录，文件名 article.md
```

### 第四步：获取网页并转换

使用 WebFetch 工具获取网页并转换为 Markdown。

#### 普通模式提示词

```python
url = "https://example.com/article"
prompt = "请将网页的全部内容转换为 Markdown 格式。包含标题、正文、链接、图片等所有元素，但排除不必要的导航和广告。"
```

#### AI 优化模式提示词（关键）

```python
url = "https://example.com/article"
prompt = """请将此网页转换为 AI 代理最适合作为上下文使用的格式：

**必须包含的结构：**

1. **Front Matter（YAML 格式）**
---
title: "页面标题"
url: "原始 URL"
author: "作者（如有）"
date: "发布日期（如有）"
word_count: 大约字数
topics: ["主题1", "主题2", "主题3"]
summary: |
  用 3-5 行总结本文核心
  便于 AI 快速掌握
main_points:
  - 核心要点 1
  - 核心要点 2
  - 核心要点 3
content_type: "tutorial|guide|article|documentation|news|blog"
difficulty: "beginner|intermediate|advanced"
---

2. **正文结构**
# [原始标题]

## 核心摘要
[3-5 行明确说明本文内容]

## 主要内容
[用清晰的层级结构分节，使用 H2/H3]

## 核心洞察
- 洞察 1
- 洞察 2

## 实用应用
[如何利用本文内容]

## 相关资源
[如有链接，附带说明]

## 结论
[总结]

**转换规则：**
- 完全删除广告、导航、页脚、侧边栏
- 代码块须标注语言
- 链接使用 [说明](URL) 格式
- 图片使用 ![说明](URL) 格式
- 删除多余修饰语，保持简洁
- 列表使用清晰的要点
- 重要概念用**粗体**强调

**最终目标：**
让 AI 读完这份文档后能在 3 秒内把握核心，
准确回答用户的相关问题。
"""
```

**重要说明：**
- WebFetch 自动将 HTML 转换为 Markdown
- 15 分钟缓存，重复请求同一 URL 速度更快
- 遇到重定向时自动重新请求新 URL
- **AI 优化模式可节省 30-50% 的 token 并使结构更清晰**

### 第五步：保存 Markdown

将转换后的 Markdown 保存为文件。

**AI 优化模式推荐文件名：**
- 普通：`article.md`
- AI 优化：`article-ai-optimized.md` 或 `article.context.md`

### 第六步：确认结果

向用户展示保存文件的路径和简要统计：

```
网页已转换为 Markdown！

文件：article.md
路径：/path/to/article.md
大小：约 1,234 字
```

## 双模式工作流程

双模式同时生成原版 Markdown 和 AI 优化版。可以同时确保人类阅读材料和 AI 处理材料。

### 双模式步骤 1：确认 URL 和文件名

```
User：https://react.dev/reference/react/useState 原版和 AI 优化版都做一份

Claude：以双模式转换。
默认文件名？（默认：webpage）
```

### 双模式步骤 2：生成原版 Markdown

使用普通模式提示词通过 WebFetch 生成原版 Markdown。

### 双模式步骤 3：生成 AI 优化版

**关键**：使用 AI 优化提示词对同一 URL 再次调用 WebFetch。

### 双模式步骤 4：结果摘要

```
双模式转换完成！已生成 2 个文件。

原版 Markdown：
- 文件：useState.md
- 大小：约 3,500 字
- 用途：方便人类阅读的原版保存

AI 优化版：
- 文件：useState.context.md
- 大小：约 2,100 字（节省 40%）
- 用途：作为 AI 上下文使用

提示：
- 原版（.md）供人类阅读时使用
- AI 优化版（.context.md）用于 RAG 系统或 AI 代理上下文
```

### 双模式文件命名规则

**模式 1：扩展名区分（推荐）**
- 原版：`article.md`
- AI 优化版：`article.context.md`

**模式 2：后缀区分**
- 原版：`article.md`
- AI 优化版：`article-ai-optimized.md`

**模式 3：文件夹区分**
```
/docs
├── original/
│   └── article.md
└── optimized/
    └── article.md
```

### 双模式优势

1. **保留原版**：人类阅读材料保持原样
2. **AI 高效性**：AI 版节省 token 并结构化
3. **按用途分离**：根据目的使用相应文件
4. **备份效果**：两种格式同时备份
5. **可比较**：可以对比分析原版和优化版

## 高级选项

### 批量转换多个 URL

可以一次转换多个网页。

```
User：把这些 URL 全部转成 Markdown
- https://example.com/article1
- https://example.com/article2
- https://example.com/article3

Claude：将转换 3 个网页。文件名自动生成还是分别指定？
User：自动生成

Claude：[依次转换各 URL 并保存为 article1.md, article2.md, article3.md]
```

### 提取特定部分

可以仅提取网页的特定部分。

```
User：https://example.com/docs 只提取 "Installation" 部分保存为 Markdown

Claude：[在 WebFetch 提示词中指定 "仅提取 Installation 部分" 进行转换]
```

### 自定义 Markdown 格式

可以在转换时指定所需的 Markdown 样式。

## 动态内容处理

### 问题：JavaScript 渲染页面

WebFetch 只能获取静态 HTML，因此 React、Vue、Next.js 等 JavaScript 渲染的页面可能返回空内容。

**症状：**
- 转换后的 Markdown 几乎为空
- 只有 "Loading..." 等占位符
- 核心内容缺失

### 解决方案：Playwright 回退

当 WebFetch 获取的内容为空或不足时，询问用户是否使用 Playwright。

#### MCP Playwright 使用（推荐）

```javascript
// 1. 页面导航
mcp__playwright__navigate({
  url: "https://example.com"
})

// 2. 等待 JavaScript 渲染
mcp__playwright__waitForLoadState({
  state: "networkidle"
})

// 3. 获取 HTML 内容
const htmlContent = mcp__playwright__getContent()

// 4. 转换为 Markdown
```

#### Node Playwright 使用（备选）

```bash
node << 'EOF'
const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('正在加载页面...');
  await page.goto('https://example.com', { waitUntil: 'networkidle' });

  console.log('等待 JavaScript 渲染...');
  await page.waitForTimeout(3000);

  const content = await page.content();
  console.log(content);

  await browser.close();
})();
EOF
```

### 工作流程总结

```
1. WebFetch 尝试（快速）
   |
2. 结果验证（内容是否充分？）
   | 不充分
3. 询问用户（使用 Playwright 吗？）
   | 是
4. Playwright 重试
   ├─ MCP Playwright（推荐）或
   └─ Node Playwright（备选）
   |
5. Markdown 转换并保存
```

### MCP Playwright vs Node Playwright 比较

| 项目 | MCP Playwright | Node Playwright |
|------|----------------|-----------------|
| **安装** | 需要 MCP 服务器安装 | `npm install playwright` |
| **调用方式** | MCP 工具调用 | Bash 命令执行 |
| **会话管理** | 自动 | 手动（需编写脚本） |
| **错误处理** | 简洁 | 复杂 |
| **Claude Code 集成** | 原生支持 | 间接执行 |
| **推荐度** | 非常推荐 | 一般 |

## 错误处理

### 无效 URL
```
错误的 URL。请输入以 http:// 或 https:// 开头的完整 URL。
```

### 无法访问的页面
```
无法访问该网页。
- 页面可能已删除
- 可能需要访问权限
- 可能出现网络错误
```

### 文件保存错误
```
无法保存文件。
- 请确认路径是否正确
- 请确认是否有写入权限
- 请确认目录是否存在
```

## 最佳实践

1. **使用明确的文件名**：使用能反映内容的文件名
2. **文件夹结构化**：批量转换时按主题整理文件夹
3. **确认 URL**：转换前确认 URL 是否正确
4. **注意版权**：尊重网页内容的版权
5. **个人归档**：主要用于个人参考资料

## 技巧

- **长文档**：非常长的网页可能包含摘要
- **动态内容**：JavaScript 渲染的内容可通过 Playwright 解决
- **图片**：图片以原始 URL 链接形式包含（不会下载）
- **重复转换**：15 分钟内重复请求同一 URL 时使用缓存版本
- **MCP Playwright**：动态内容较多时建议安装 MCP Playwright 服务器

> 来源：[bear2u/my-skills](https://github.com/bear2u/my-skills) | 分类：F-工具与效率

# DuckDuckGo Web 搜索（Web Search）

基于 DuckDuckGo 搜索引擎的文本、新闻、图片搜索技能。

## 使用场景

在以下情况使用：
- 内置 WebSearch 不可用时（美国以外地区）
- 需要新闻专项搜索时
- 需要搜索图片 URL 时
- 需要将搜索结果保存为 JSON 或程序化处理时
- 需要精细指定时间范围（日/周/月/年）时
- 需要特定地区（中国、日本等）的搜索结果时

优先使用内置 WebSearch 的情况：
- 美国地区的简单文本搜索
- 快速事实核查

## 核心工作流程

### 第一步：判断搜索类型

从用户请求判断搜索类型：
- **文本搜索**（默认）：常规网页搜索
- **新闻搜索**：请求中包含"新闻"、"最新动态"、"news"关键词
- **图片搜索**：请求中包含"图片"、"照片"、"image"、"picture"关键词

### 第二步：执行脚本

```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "搜索词" -t text -n 5
```

### 第三步：整理结果

将 JSON 输出整理为用户易读的格式呈现。

## 参数说明

| 参数 | 必须 | 默认值 | 说明 |
|------|------|--------|------|
| `-q` | 是 | - | 搜索关键词 |
| `-t` | 否 | text | text、news、images |
| `-n` | 否 | 5 | 最大结果数 |
| `-r` | 否 | wt-wt | 地区代码 |
| `-s` | 否 | moderate | 安全搜索：on、moderate、off |
| `-p` | 否 | None | 时间范围：d（日）、w（周）、m（月）、y（年） |

### 主要地区代码
- 全球：`wt-wt` | 中国：`cn-zh` | 美国：`us-en` | 日本：`jp-jp` | 英国：`uk-en` | 韩国：`kr-kr`

## 使用示例

### 文本搜索
```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "Claude Code Anthropic" -t text -n 5
```

### 中国新闻搜索（最近一周）
```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "AI 人工智能" -t news -n 10 -r cn-zh -p w
```

### 图片搜索
```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "modern web design" -t images -n 5
```

### 保存结果到文件
```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "React 19" -t text -n 20 > results.json
```

## 搜索运算符

可在 query 中使用：
- `site:example.com` - 在特定站点内搜索
- `filetype:pdf` - 特定文件类型
- `"exact phrase"` - 精确短语
- `-exclude` - 排除特定词

## 错误处理

- **请求频率限制（Rate Limit）**：稍后重试或减少结果数
- **超时（Timeout）**：检查网络后重试
- **包未安装**：脚本会尝试自动安装。失败时手动执行 `pip install -U ddgs`

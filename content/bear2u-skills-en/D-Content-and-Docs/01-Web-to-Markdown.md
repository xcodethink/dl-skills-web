> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: D-Content-and-Docs

---
name: web-to-markdown
description: Convert web pages to Markdown files with optional AI-optimized formatting for context use
---

# Web to Markdown Converter

## Overview

Convert web page content to Markdown format by providing a URL. Supports three modes: standard Markdown for human reading, AI-optimized format for use as AI agent context, and dual mode that generates both. Ideal for archiving web documentation as local Markdown files or preparing content for RAG systems.

## When to Use

Trigger this skill when the user requests:
- "Convert this web page to Markdown"
- "Save this URL as Markdown"
- "Archive this web page"
- "Save this blog post as Markdown"
- "Convert to AI-readable format" (AI-optimized mode)
- "Make it suitable for context use" (AI-optimized mode)
- "Give me both the original and AI-optimized version" (dual mode)

## Core Workflow

### Step 1: Get the URL

Obtain the target web page URL from the user.

**Example:**
```
Claude: Please enter the web page URL to convert.
User: https://example.com/article
```

**Important:**
- URL must start with `http://` or `https://`
- HTTP URLs are automatically upgraded to HTTPS
- Invalid URLs return an error

### Step 2: Select Conversion Mode

Analyze the user's request to choose the appropriate mode.

**Conversion Modes:**
1. **Standard Mode** (default): Convert to human-readable Markdown
2. **AI-Optimized Mode**: Convert to format best suited as AI agent context
3. **Dual Mode**: Generate both original + AI-optimized files

**Auto-detect keywords:**
- "AI readable", "for context", "AI learning" -> AI-optimized mode
- "original", "both", "two versions" -> Dual mode
- All other requests -> Standard mode

### Step 3: Confirm Save Options

Ask the user for save location and filename.

**Example:**
```
Claude: Where should the Markdown file be saved?
Options:
1. Current directory (./)
2. Specify a path
3. Don't save, just display content

Filename? (default: webpage.md)
User: Save in current directory, filename article.md
```

### Step 4: Fetch and Convert

Use the WebFetch tool to retrieve and convert the web page.

#### Standard Mode Prompt

```python
url = "https://example.com/article"
prompt = "Convert the entire web page content to Markdown format. Include all headings, body text, links, and images, but exclude unnecessary navigation and ads."
```

#### AI-Optimized Mode Prompt

```python
url = "https://example.com/article"
prompt = """Convert this web page to a format optimized for AI agent context use:

**Required structure:**

1. **Front Matter (YAML format)**
---
title: "Page title"
url: "Original URL"
author: "Author (if available)"
date: "Publication date (if available)"
word_count: Approximate word count
topics: ["topic1", "topic2", "topic3"]
summary: |
  3-5 line summary of the core content
  for quick AI comprehension
main_points:
  - Key point 1
  - Key point 2
  - Key point 3
content_type: "tutorial|guide|article|documentation|news|blog"
difficulty: "beginner|intermediate|advanced"
---

2. **Body Structure**
# [Original Title]

## Core Summary
[3-5 lines clearly explaining the content]

## Main Content
[Clear hierarchical sections using H2/H3]

## Key Insights
- Insight 1
- Insight 2

## Practical Applications
[How to apply this content]

## Related Resources
[Links with descriptions, if available]

## Conclusion
[Summary]

**Conversion rules:**
- Remove all ads, navigation, footers, sidebars
- Code blocks must specify language
- Links use [description](URL) format
- Images use ![description](URL) format
- Remove unnecessary filler words, keep it concise
- Lists use clear bullet points
- Important concepts in **bold**

**Goal:**
Enable an AI to grasp the core content within 3 seconds
and accurately answer user questions about it.
"""
```

**Important:**
- WebFetch automatically converts HTML to Markdown
- 15-minute cache for faster repeated requests to the same URL
- Redirects are automatically followed
- **AI-optimized mode saves 30-50% tokens with clearer structure**

### Step 5: Save the Markdown

Save the converted Markdown as a file.

**AI-optimized mode recommended filenames:**
- Standard: `article.md`
- AI-optimized: `article-ai-optimized.md` or `article.context.md`

### Step 6: Confirm Result

Show the user the saved file path and brief statistics:

```
Web page converted to Markdown!

File: article.md
Path: /path/to/article.md
Size: ~1,234 words
```

## Dual Mode Workflow

Dual mode generates both standard Markdown and AI-optimized version simultaneously.

### Dual Mode Steps

1. **Confirm URL and filename** with the user
2. **Generate standard Markdown** using standard mode prompt via WebFetch
3. **Generate AI-optimized version** using AI-optimized prompt on the same URL
4. **Report results:**

```
Dual mode conversion complete! 2 files generated.

Standard Markdown:
- File: useState.md
- Size: ~3,500 words
- Use: Human-readable original

AI-Optimized:
- File: useState.context.md
- Size: ~2,100 words (40% saved)
- Use: AI agent context

Tips:
- Standard (.md) for human reading
- AI-optimized (.context.md) for RAG systems or AI agent context
```

### Dual Mode File Naming

| Pattern | Standard | AI-Optimized |
|---------|----------|-------------|
| **Extension (recommended)** | `article.md` | `article.context.md` |
| **Suffix** | `article.md` | `article-ai-optimized.md` |
| **Folder** | `docs/original/article.md` | `docs/optimized/article.md` |

### Dual Mode Benefits

1. **Preserve original**: Human-readable content stays intact
2. **AI efficiency**: AI version saves tokens with structured format
3. **Separate by use**: Choose the right file for the purpose
4. **Backup effect**: Two formats archived simultaneously
5. **Comparable**: Analyze differences between original and optimized

## Advanced Options

### Batch Convert Multiple URLs

```
User: Convert all these URLs to Markdown
- https://example.com/article1
- https://example.com/article2
- https://example.com/article3

Claude: Converting 3 web pages. Auto-generate filenames or specify each?
User: Auto-generate

Claude: [Converts each URL and saves as article1.md, article2.md, article3.md]
```

### Extract Specific Sections

```
User: https://example.com/docs -- only extract the "Installation" section
Claude: [Specifies "extract only the Installation section" in WebFetch prompt]
```

### Custom Markdown Format

Specify desired Markdown styling during conversion.

## Dynamic Content Handling

### Problem: JavaScript-Rendered Pages

WebFetch only fetches static HTML, so React, Vue, Next.js, and similar JavaScript-rendered pages may return empty content.

**Symptoms:**
- Converted Markdown is nearly empty
- Only "Loading..." placeholders appear
- Core content is missing

### Solution: Playwright Fallback

When WebFetch returns empty or insufficient content, ask the user if they want to use Playwright.

#### MCP Playwright (Recommended)

```javascript
// 1. Navigate to page
mcp__playwright__navigate({ url: "https://example.com" })

// 2. Wait for JavaScript rendering
mcp__playwright__waitForLoadState({ state: "networkidle" })

// 3. Get HTML content
const htmlContent = mcp__playwright__getContent()

// 4. Convert to Markdown
```

#### Node Playwright (Fallback)

```bash
node << 'EOF'
const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const content = await page.content();
  console.log(content);
  await browser.close();
})();
EOF
```

### Workflow Summary

```
1. WebFetch attempt (fast)
   |
2. Validate result (is content sufficient?)
   | Insufficient
3. Ask user (use Playwright?)
   | Yes
4. Playwright retry
   ├─ MCP Playwright (recommended) or
   └─ Node Playwright (fallback)
   |
5. Convert to Markdown and save
```

### MCP Playwright vs Node Playwright

| Feature | MCP Playwright | Node Playwright |
|---------|---------------|-----------------|
| **Install** | MCP server setup | `npm install playwright` |
| **Invocation** | MCP tool call | Bash command |
| **Session mgmt** | Automatic | Manual (script required) |
| **Error handling** | Simple | Complex |
| **Claude Code integration** | Native | Indirect |
| **Recommendation** | Highly recommended | General |

## Error Handling

| Error | Message |
|-------|---------|
| Invalid URL | "Invalid URL. Please enter a complete URL starting with http:// or https://." |
| Inaccessible page | "Cannot access the web page. The page may be deleted, require access permissions, or have a network error." |
| File save error | "Cannot save file. Please verify the path is correct, you have write permissions, and the directory exists." |

## Best Practices

1. **Use descriptive filenames** that reflect the content
2. **Organize folders** by topic when batch converting
3. **Verify URLs** before conversion
4. **Respect copyright** of web page content
5. **Personal archival** -- primarily for personal reference use

## Tips

- **Long documents**: Very long web pages may be summarized
- **Dynamic content**: JavaScript-rendered content can be handled via Playwright
- **Images**: Included as original URL links (not downloaded)
- **Repeated requests**: Same URL within 15 minutes uses cached version
- **MCP Playwright**: Recommended for sites with heavy dynamic content

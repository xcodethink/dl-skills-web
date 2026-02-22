> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: F-Tools-and-Productivity

---
name: web-search
description: Perform text, news, and image searches via DuckDuckGo with region and time filtering
---

# DuckDuckGo Web Search

## Overview

A DuckDuckGo-based search skill for text, news, and image searches. Use this as a fallback when the built-in WebSearch is unavailable (e.g., outside the US), or when you need news-specific searches, image URL results, JSON output for programmatic processing, fine-grained time range control, or region-specific results.

## When to Use

**Use this skill when:**
- Built-in WebSearch is unavailable (outside US regions)
- News-specific search is needed
- Image URL search is needed
- Search results need to be saved as JSON or processed programmatically
- Fine-grained time range filtering is needed (day/week/month/year)
- Region-specific results are needed (China, Japan, etc.)

**Prefer built-in WebSearch when:**
- Simple text search in the US region
- Quick fact-checking

## Core Workflow

### Step 1: Determine Search Type

Determine from the user's request:
- **Text search** (default): Standard web search
- **News search**: Request contains "news", "latest", "headlines"
- **Image search**: Request contains "image", "photo", "picture"

### Step 2: Execute Script

```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "search terms" -t text -n 5
```

### Step 3: Format Results

Format the JSON output into a user-readable presentation.

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `-q` | Yes | - | Search keywords |
| `-t` | No | text | Search type: text, news, images |
| `-n` | No | 5 | Maximum results |
| `-r` | No | wt-wt | Region code |
| `-s` | No | moderate | Safe search: on, moderate, off |
| `-p` | No | None | Time range: d (day), w (week), m (month), y (year) |

### Region Codes

| Region | Code |
|--------|------|
| Global | `wt-wt` |
| China | `cn-zh` |
| United States | `us-en` |
| Japan | `jp-jp` |
| United Kingdom | `uk-en` |
| South Korea | `kr-kr` |

## Usage Examples

### Text Search
```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "Claude Code Anthropic" -t text -n 5
```

### Chinese News Search (Past Week)
```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "AI artificial intelligence" -t news -n 10 -r cn-zh -p w
```

### Image Search
```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "modern web design" -t images -n 5
```

### Save Results to File
```bash
python3 ~/.claude/skills/web-search/scripts/search.py -q "React 19" -t text -n 20 > results.json
```

## Search Operators

Use within the query string:
- `site:example.com` -- Search within a specific site
- `filetype:pdf` -- Specific file type
- `"exact phrase"` -- Exact phrase match
- `-exclude` -- Exclude a specific term

## Error Handling

| Error | Solution |
|-------|---------|
| **Rate Limit** | Wait and retry, or reduce the number of results |
| **Timeout** | Check network connection and retry |
| **Package not installed** | The script will attempt auto-install. If it fails, manually run `pip install -U ddgs` |

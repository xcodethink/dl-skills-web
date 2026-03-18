> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# MCP Configuration Guide

## Overview

Ready-to-use MCP (Model Context Protocol) server configurations for connecting Claude Code to external services -- GitHub, databases, deployment platforms, documentation, and more.

## Setup

Copy the servers you need into the `mcpServers` section of your `~/.claude.json`. Replace `YOUR_*_HERE` placeholders with actual values.

## Available Servers

| Server | Type | Purpose |
|--------|------|---------|
| **github** | command (npx) | GitHub operations -- PRs, issues, repos |
| **firecrawl** | command (npx) | Web scraping and crawling |
| **supabase** | command (npx) | Supabase database operations |
| **memory** | command (npx) | Persistent memory across sessions |
| **sequential-thinking** | command (npx) | Chain-of-thought reasoning |
| **vercel** | http | Vercel deployments and projects |
| **railway** | command (npx) | Railway deployments |
| **cloudflare-docs** | http | Cloudflare documentation search |
| **cloudflare-workers-builds** | http | Cloudflare Workers builds |
| **cloudflare-workers-bindings** | http | Cloudflare Workers bindings |
| **cloudflare-observability** | http | Cloudflare observability/logs |
| **clickhouse** | http | ClickHouse analytics queries |
| **context7** | command (npx) | Live documentation lookup |
| **magic** | command (npx) | Magic UI components |
| **filesystem** | command (npx) | Filesystem operations |

## Configuration Examples

### Command-based (npx)

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

### HTTP-based

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

## Best Practices

| Guideline | Detail |
|-----------|--------|
| Context window | Keep under 10 MCPs enabled to preserve context |
| Per-project control | Use `disabledMcpServers` array in project config |
| Secrets | Never commit API keys; use environment variables |

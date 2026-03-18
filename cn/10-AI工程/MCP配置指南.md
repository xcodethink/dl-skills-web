> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# MCP 配置指南

## 概述

MCP（Model Context Protocol，模型上下文协议）是 Claude Code 连接外部服务的标准协议。本文提供了常用 MCP 服务器的配置模板，涵盖 GitHub 操作、网页抓取、数据库、部署平台、文档查询等场景。

## 使用方法

将所需的服务器配置复制到 `~/.claude.json` 的 `mcpServers` 部分即可启用。

## 服务器配置

### GitHub 操作

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    },
    "description": "GitHub 操作 - PR、Issue、仓库管理"
  }
}
```

### 网页抓取（Firecrawl）

```json
{
  "firecrawl": {
    "command": "npx",
    "args": ["-y", "firecrawl-mcp"],
    "env": {
      "FIRECRAWL_API_KEY": "YOUR_FIRECRAWL_KEY_HERE"
    },
    "description": "网页抓取和爬虫"
  }
}
```

### Supabase 数据库

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=YOUR_PROJECT_REF"],
    "description": "Supabase 数据库操作"
  }
}
```

### 持久化记忆（Memory）

```json
{
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"],
    "description": "跨会话的持久化记忆"
  }
}
```

### 链式思维推理（Sequential Thinking）

```json
{
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    "description": "链式思维推理"
  }
}
```

### Vercel 部署

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Vercel 部署和项目管理"
  }
}
```

### Railway 部署

```json
{
  "railway": {
    "command": "npx",
    "args": ["-y", "@railway/mcp-server"],
    "description": "Railway 部署"
  }
}
```

### Cloudflare 服务集群

```json
{
  "cloudflare-docs": {
    "type": "http",
    "url": "https://docs.mcp.cloudflare.com/mcp",
    "description": "Cloudflare 文档搜索"
  },
  "cloudflare-workers-builds": {
    "type": "http",
    "url": "https://builds.mcp.cloudflare.com/mcp",
    "description": "Cloudflare Workers 构建"
  },
  "cloudflare-workers-bindings": {
    "type": "http",
    "url": "https://bindings.mcp.cloudflare.com/mcp",
    "description": "Cloudflare Workers 绑定"
  },
  "cloudflare-observability": {
    "type": "http",
    "url": "https://observability.mcp.cloudflare.com/mcp",
    "description": "Cloudflare 可观测性/日志"
  }
}
```

### ClickHouse 分析

```json
{
  "clickhouse": {
    "type": "http",
    "url": "https://mcp.clickhouse.cloud/mcp",
    "description": "ClickHouse 分析查询"
  }
}
```

### Context7 实时文档查询

```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@context7/mcp-server"],
    "description": "实时文档查询"
  }
}
```

### Magic UI 组件

```json
{
  "magic": {
    "command": "npx",
    "args": ["-y", "@magicuidesign/mcp@latest"],
    "description": "Magic UI 组件库"
  }
}
```

### 文件系统操作

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "文件系统操作（请设置你的路径）"
  }
}
```

## 使用说明

| 事项 | 说明 |
|------|------|
| 使用方法 | 将所需的服务器复制到 `~/.claude.json` 的 `mcpServers` 部分 |
| 环境变量 | 将 `YOUR_*_HERE` 占位符替换为实际值 |
| 按项目禁用 | 在项目配置中使用 `disabledMcpServers` 数组 |
| 上下文窗口警告 | 启用的 MCP 保持在 10 个以内，以保留上下文窗口空间 |

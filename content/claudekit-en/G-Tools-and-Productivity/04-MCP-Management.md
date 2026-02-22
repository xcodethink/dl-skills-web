> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: G-Tools-and-Productivity

---
name: mcp-management
description: Manage and interact with Model Context Protocol (MCP) servers for capability discovery, tool analysis, and execution
---

# MCP Management

## Overview

MCP (Model Context Protocol) is an open protocol enabling AI agents to connect with external tools and data sources. This skill provides scripts and tools to discover, analyze, and execute MCP capabilities from configured servers without polluting the main context window.

**Core Benefits**:
- Progressive disclosure of MCP capabilities (load only what is needed)
- Intelligent tool/prompt/resource selection based on task requirements
- Multi-server management from a single configuration file
- Context-efficient: sub-agents handle MCP discovery and execution
- Persistent tool catalog: automatically saves discovered tools to JSON for quick reference

## When to Use

1. **Discover MCP capabilities**: List available tools/prompts/resources from configured servers
2. **Task-based tool selection**: Analyze which MCP tools are relevant to a specific task
3. **Execute MCP tools**: Programmatically call MCP tools with proper argument handling
4. **MCP integration**: Build or debug MCP client implementations
5. **Context management**: Avoid context pollution by delegating MCP operations to sub-agents

## Core Capabilities

### 1. Configuration Management

MCP servers are configured in `.claude/.mcp.json`.

**Gemini CLI Integration** (recommended): Create a symlink to `.gemini/settings.json`:
```bash
mkdir -p .gemini && ln -sf .claude/.mcp.json .gemini/settings.json
```

See [references/configuration.md](references/configuration.md) and [references/gemini-cli-integration.md](references/gemini-cli-integration.md).

### 2. Capability Discovery

```bash
npx tsx scripts/cli.ts list-tools  # Saves to assets/tools.json
npx tsx scripts/cli.ts list-prompts
npx tsx scripts/cli.ts list-resources
```

Aggregates capabilities across multiple servers and identifies the source server.

### 3. Intelligent Tool Analysis

The LLM directly analyzes `assets/tools.json` -- better than keyword-matching algorithms.

### 4. Tool Execution

**Primary: Gemini CLI** (if available)
```bash
gemini -y -m gemini-2.5-flash -p "Take a screenshot of https://example.com"
```

**Secondary: Direct script**
```bash
npx tsx scripts/cli.ts call-tool memory create_entities '{"entities":[...]}'
```

**Fallback: mcp-manager sub-agent**

See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for complete examples.

## Implementation Patterns

### Pattern 1: Gemini CLI Auto-Execution (Primary)

Use Gemini CLI for automatic tool discovery and execution. See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for the full guide.

**Quick example**:
```bash
gemini -y -m gemini-2.5-flash -p "Take a screenshot of https://example.com"
```

**Advantages**: Automatic tool discovery, natural language execution, faster than sub-agent orchestration.

### Pattern 2: Sub-Agent-Based Execution (Fallback)

When Gemini CLI is unavailable, use the `mcp-manager` agent. The sub-agent discovers tools, selects relevant ones, executes the task, and reports results.

**Advantages**: Main context stays clean, relevant tool definitions loaded only when needed.

### Pattern 3: LLM-Driven Tool Selection

The LLM reads `assets/tools.json` and intelligently selects relevant tools using contextual understanding, synonyms, and intent recognition.

### Pattern 4: Multi-Server Orchestration

Coordinate tools across multiple servers. Each tool knows its source server for correct routing.

## Script Reference

### scripts/mcp-client.ts

Core MCP client management class. Handles:
- Loading configuration from `.claude/.mcp.json`
- Connecting to multiple MCP servers
- Listing tools/prompts/resources across all servers
- Executing tools with proper error handling
- Connection lifecycle management

### scripts/cli.ts

Command-line interface for MCP operations. Commands:
- `list-tools` - Display all tools and save to `assets/tools.json`
- `list-prompts` - Display all prompts
- `list-resources` - Display all resources
- `call-tool <server> <tool> <json>` - Execute a tool

**Note**: `list-tools` persists the full tool catalog with complete schemas to `assets/tools.json` for quick reference, offline browsing, and version control.

## Quick Start

**Method 1: Gemini CLI** (recommended)
```bash
npm install -g gemini-cli
mkdir -p .gemini && ln -sf .claude/.mcp.json .gemini/settings.json
gemini -y -m gemini-2.5-flash -p "Take a screenshot of https://example.com"
```

**Method 2: Scripts**
```bash
cd .claude/skills/mcp-management/scripts && npm install
npx tsx cli.ts list-tools  # Saves to assets/tools.json
npx tsx cli.ts call-tool memory create_entities '{"entities":[...]}'
```

**Method 3: mcp-manager sub-agent**

See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for the full guide.

## Technical Details

See [references/mcp-protocol.md](references/mcp-protocol.md) for:
- JSON-RPC protocol details
- Message types and formats
- Error codes and handling
- Transport mechanisms (stdio, HTTP+SSE)
- Best practices

## Integration Strategy

### Execution Priority

1. **Gemini CLI** (primary): Fast, automatic, intelligent tool selection
   - Check: `command -v gemini`
   - Execute: `gemini -y -m gemini-2.5-flash -p "<task>"`
   - Use for: All tasks when available

2. **Direct CLI scripts** (secondary): Manual tool specification
   - Use when: Specific tool/server control needed
   - Execute: `npx tsx scripts/cli.ts call-tool <server> <tool> <args>`

3. **mcp-manager sub-agent** (fallback): Context-efficient delegation
   - Use when: Gemini unavailable or fails
   - Keeps main context clean

### Integration with Agents

The `mcp-manager` agent uses this skill to:
- Check Gemini CLI availability first
- Execute via `gemini` command if available
- Fall back to direct script execution
- Discover MCP capabilities without loading into main context
- Report results to the main agent

This keeps the main agent context clean and enables efficient MCP integration.

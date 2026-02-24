> Source: [xiaolai/claude-agent-sdk-skill-autoupdated](https://github.com/xiaolai/claude-agent-sdk-skill-autoupdated) | Category: AI Engineering

---
name: claude-agent-sdk
description: "Build autonomous AI agents with Claude Agent SDK. TypeScript v0.2.50 | Python v0.1.39. Covers: query(), hooks, subagents, MCP, permissions, sandbox, structured outputs, and sessions."
---

# Claude Agent SDK Development

## Overview

The Claude Agent SDK enables building autonomous AI agents that leverage Claude Code's full capabilities -- file operations, terminal commands, web search, and more -- through a programmatic API. Both TypeScript and Python SDKs wrap the Claude Code CLI, providing language-native interfaces for query execution, tool definition, hook registration, and multi-agent orchestration.

**Key distinction:** The SDK is not an LLM API client. It controls a Claude Code agent process, giving your code access to the same tools and capabilities available in the interactive CLI.

## When to Use

- Building custom AI agents that need file system access, code execution, or shell commands
- Creating automated workflows with Claude Code as the reasoning engine
- Integrating Claude agents into CI/CD pipelines or backend services
- Defining custom tools (MCP servers) that extend agent capabilities
- Orchestrating multi-agent systems with subagent delegation
- Implementing structured output validation for agent responses

## SDK Versions and Resources

| | TypeScript | Python |
|---|---|---|
| **Version** | v0.2.50 | v0.1.39 |
| **Package** | `@anthropic-ai/claude-agent-sdk` | `claude-agent-sdk` (PyPI) |
| **Install** | `npm install @anthropic-ai/claude-agent-sdk` | `pip install claude-agent-sdk` |
| **Docs** | [TypeScript SDK](https://platform.claude.com/docs/en/agent-sdk/typescript) | [Python SDK](https://platform.claude.com/docs/en/agent-sdk/python) |
| **Repo** | [claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript) | [claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python) |
| **Requires** | Node.js 18+ | Python 3.10+ |

**Migration note:** Both SDKs were renamed from their previous identifiers. TypeScript was `@anthropic-ai/claude-code`; Python was `claude-code-sdk`. The `ClaudeCodeOptions` type is now `ClaudeAgentOptions`.

## Core API

### `query()`

The primary entry point. Sends a prompt to a Claude Code agent and returns a stream of messages.

**TypeScript:**
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const q = query({
  prompt: "Analyze the authentication module and suggest improvements",
  options: {
    systemPrompt: "You are a senior security engineer",
    permissionMode: "acceptEdits",
    cwd: "/home/user/project",
    allowedTools: ["Read", "Grep", "Glob"],
    maxTurns: 20,
  },
});

for await (const message of q) {
  if (message.type === "assistant") {
    console.log(message.content);
  }
}
```

**Python:**
```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        system_prompt="You are a senior security engineer",
        permission_mode="acceptEdits",
        cwd="/home/user/project",
        allowed_tools=["Read", "Grep", "Glob"],
        max_turns=20,
    )
    async for message in query(prompt="Analyze the auth module", options=options):
        print(message)

asyncio.run(main())
```

### `tool()` / `@tool`

Define custom tools with type-safe schemas that agents can invoke.

**TypeScript:**
```typescript
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const fetchPrTool = tool(
  "fetch_pr",
  "Fetch pull request details from GitHub",
  { prNumber: z.number().describe("PR number to fetch") },
  async (args) => {
    const pr = await github.getPR(args.prNumber);
    return { content: [{ type: "text", text: JSON.stringify(pr) }] };
  }
);
```

**Python:**
```python
from claude_agent_sdk import tool

@tool("fetch_pr", "Fetch pull request details from GitHub", {
    "type": "object",
    "properties": {
        "pr_number": {"type": "integer", "description": "PR number to fetch"}
    },
    "required": ["pr_number"]
})
async def fetch_pr(args):
    pr = await github.get_pr(args["pr_number"])
    return {"content": [{"type": "text", "text": json.dumps(pr)}]}
```

### `createSdkMcpServer()` / `create_sdk_mcp_server()`

Create an in-process MCP server to expose custom tools to the agent.

**TypeScript:**
```typescript
import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";

const server = createSdkMcpServer({
  name: "project-tools",
  version: "1.0.0",
  tools: [fetchPrTool, runTestsTool, deployTool],
});

// Pass to query options
const q = query({
  prompt: "Run the test suite",
  options: { mcpServers: [server] },
});
```

**Python:**
```python
from claude_agent_sdk import create_sdk_mcp_server

server = create_sdk_mcp_server(
    name="project-tools",
    version="1.0.0",
    tools=[fetch_pr, run_tests, deploy],
)

async for msg in query(
    prompt="Run the test suite",
    options=ClaudeAgentOptions(mcp_servers=[server]),
):
    print(msg)
```

## Cross-Language Naming Map

| Concept | TypeScript | Python |
|---------|-----------|--------|
| One-shot query | `query(options)` | `query(options)` |
| Stateful client | N/A (query manages state) | `ClaudeSDKClient` |
| Options type | `Options` interface | `ClaudeAgentOptions` dataclass |
| Tool definition | `tool(name, schema, handler)` | `@tool(name, desc, schema)` decorator |
| MCP server factory | `createSdkMcpServer()` | `create_sdk_mcp_server()` |
| Permission callback | `canUseTool` | `can_use_tool` |
| Permission mode | `permissionMode: "..."` | `permission_mode="..."` |
| Hook registration | `hooks: { PreToolUse: [...] }` | `hooks={"PreToolUse": [...]}` |
| System prompt | `systemPrompt` | `system_prompt` |
| Max turns | `maxTurns` | `max_turns` |
| Allowed tools | `allowedTools` | `allowed_tools` |
| MCP servers | `mcpServers` | `mcp_servers` |
| Subagent def | `AgentDefinition` | `AgentDefinition` dataclass |

## Shared Concepts

Both SDKs wrap the Claude Code CLI and share these architectural concepts.

### Hooks

Hooks are callbacks that fire at specific points in the agent lifecycle. Use them to observe, modify, or block agent actions.

| Hook Event | When It Fires | Common Use |
|------------|---------------|------------|
| `PreToolUse` | Before any tool invocation | Validate parameters, block dangerous operations |
| `PostToolUse` | After a tool completes | Log results, transform outputs |
| `Stop` | When agent wants to stop | Validate completion, force continuation |
| `SubagentStop` | When a subagent finishes | Aggregate results, trigger follow-up |
| `Notification` | Agent sends a status update | Progress tracking, UI updates |

**Hook return values control flow:**

| Return | Effect |
|--------|--------|
| `undefined` / `None` | Allow the action to proceed normally |
| `{ decision: "block", message: "..." }` | Block the tool use; inject a message instead |
| `{ decision: "approve" }` | Approve without user confirmation prompt |
| `{ decision: "modify", toolInput: {...} }` | Modify the tool's input before execution |

### Permissions

Control what the agent can do without user confirmation.

| Mode | Behavior | Use Case |
|------|----------|----------|
| `default` | Prompts user for dangerous operations | Interactive development |
| `acceptEdits` | Auto-approves file edits; prompts for shell commands | Automated code generation |
| `plan` | Agent can only read and plan; no writes or executions | Safe analysis and review |
| `bypassPermissions` | All operations approved automatically | CI/CD pipelines, sandboxed environments |

**Fine-grained control with `canUseTool` / `can_use_tool`:**

```typescript
// TypeScript
const q = query({
  prompt: "...",
  options: {
    canUseTool: (toolName, toolInput) => {
      if (toolName === "Bash" && toolInput.command.includes("rm")) {
        return { decision: "block", message: "Deletion not allowed" };
      }
      return { decision: "approve" };
    },
  },
});
```

```python
# Python
def can_use_tool(tool_name: str, tool_input: dict) -> dict:
    if tool_name == "Bash" and "rm" in tool_input.get("command", ""):
        return {"decision": "block", "message": "Deletion not allowed"}
    return {"decision": "approve"}

options = ClaudeAgentOptions(can_use_tool=can_use_tool)
```

### MCP Server Configuration

Agents can connect to MCP (Model Context Protocol) servers via multiple transports.

| Transport | Description | Configuration |
|-----------|-------------|---------------|
| **stdio** | Local process communicating via stdin/stdout | `{ type: "stdio", command: "node", args: ["server.js"] }` |
| **HTTP** | Remote server over HTTP | `{ type: "http", url: "https://mcp.example.com" }` |
| **SSE** | Server-Sent Events stream | `{ type: "sse", url: "https://mcp.example.com/sse" }` |
| **SDK (in-process)** | Created via `createSdkMcpServer()` | Fastest; no IPC overhead; tools defined in your code |

### Subagents

Delegate tasks to child agents with their own scoped tools and permissions.

**TypeScript:**
```typescript
const reviewAgent = {
  name: "code-reviewer",
  description: "Reviews code for quality and security issues",
  systemPrompt: "You are a code review specialist...",
  allowedTools: ["Read", "Grep", "Glob"],
  permissionMode: "plan",
};

const q = query({
  prompt: "Review and then fix the auth module",
  options: {
    agents: [reviewAgent],
    // Parent agent can delegate to code-reviewer
  },
});
```

**Python:**
```python
from claude_agent_sdk import AgentDefinition

review_agent = AgentDefinition(
    name="code-reviewer",
    description="Reviews code for quality and security issues",
    system_prompt="You are a code review specialist...",
    allowed_tools=["Read", "Grep", "Glob"],
    permission_mode="plan",
)

async for msg in query(
    prompt="Review and then fix the auth module",
    options=ClaudeAgentOptions(agents=[review_agent]),
):
    print(msg)
```

**Design pattern:** Give the parent agent broad permissions and subagents narrow, task-specific permissions. The parent orchestrates; subagents execute.

### Structured Outputs

Validate agent output against a JSON Schema to ensure it returns data in the expected format.

**TypeScript:**
```typescript
const q = query({
  prompt: "Analyze this codebase and return a summary",
  options: {
    outputSchema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        fileCount: { type: "number" },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
              description: { type: "string" },
              file: { type: "string" },
            },
            required: ["severity", "description", "file"],
          },
        },
      },
      required: ["summary", "fileCount", "issues"],
    },
  },
});
```

If the agent's output does not conform to the schema, the SDK will re-prompt the agent to fix the format.

### Sandbox

Run agents in isolated container environments for security.

| Option | Description |
|--------|-------------|
| **Docker** | Local container isolation; agent runs inside a Docker container |
| **Kubernetes** | Remote container orchestration; for production workloads |
| **None** | Direct host execution (default); agent has full access to the host filesystem |

Configure sandbox in options:

```typescript
const q = query({
  prompt: "Run the test suite",
  options: {
    sandbox: { type: "docker", image: "node:20-slim" },
  },
});
```

### Sessions

Capture, resume, and fork conversation state across multiple interactions.

| Operation | Description |
|-----------|-------------|
| **Capture** | Save the current session state (all messages, tool outputs) |
| **Resume** | Continue a previously captured session |
| **Fork** | Create a new session branching from an existing one |

**TypeScript:**
```typescript
const q = query({ prompt: "Start analyzing the project", options: { sessionId: "analysis-001" } });
for await (const msg of q) { /* process */ }

// Later: resume the same session
const q2 = query({ prompt: "Now focus on the tests", options: { sessionId: "analysis-001" } });
```

**Python (ClaudeSDKClient):**
```python
client = ClaudeSDKClient(options=ClaudeAgentOptions())
await client.connect(prompt="Start analyzing the project")
# Process messages...

# Resume later
await client.query(prompt="Now focus on the tests", session_id="default")
```

## TypeScript Quick Start

```bash
npm install @anthropic-ai/claude-agent-sdk
```

```typescript
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// 1. Define a custom tool
const analyzeTool = tool(
  "analyze_complexity",
  "Analyze code complexity for a given file",
  { filePath: z.string().describe("Path to the file") },
  async (args) => {
    // Your analysis logic here
    return { content: [{ type: "text", text: `Complexity: moderate` }] };
  }
);

// 2. Create an MCP server
const server = createSdkMcpServer({
  name: "my-tools",
  tools: [analyzeTool],
});

// 3. Run the agent
async function main() {
  const q = query({
    prompt: "Analyze the complexity of src/auth/middleware.ts",
    options: {
      systemPrompt: "You are a code analysis expert",
      permissionMode: "plan",
      mcpServers: [server],
    },
  });

  for await (const message of q) {
    if (message.type === "assistant") {
      console.log(message.content);
    }
  }
}

main();
```

### Streaming Input

The `prompt` parameter accepts `AsyncIterable<SDKUserMessage>` for real-time multi-message input:

```typescript
async function* promptStream(): AsyncIterable<SDKUserMessage> {
  yield { type: "user", content: [{ type: "text", text: "First, read the config." }] };
  // Yield additional messages as they become available
  yield { type: "user", content: [{ type: "text", text: "Now analyze the routes." }] };
}

const q = query({ prompt: promptStream() });
```

## Python Quick Start

```bash
pip install claude-agent-sdk
```

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, tool, create_sdk_mcp_server

# 1. Define a custom tool
@tool("analyze_complexity", "Analyze code complexity for a given file", {
    "type": "object",
    "properties": {"file_path": {"type": "string", "description": "Path to the file"}},
    "required": ["file_path"],
})
async def analyze_complexity(args):
    return {"content": [{"type": "text", "text": "Complexity: moderate"}]}

# 2. Create an MCP server
server = create_sdk_mcp_server(name="my-tools", tools=[analyze_complexity])

# 3. Run the agent
async def main():
    options = ClaudeAgentOptions(
        system_prompt="You are a code analysis expert",
        permission_mode="plan",
        mcp_servers=[server],
    )
    async for message in query(prompt="Analyze src/auth/middleware.ts", options=options):
        print(message)

asyncio.run(main())
```

### Stateful Client (Python-only)

Python offers `ClaudeSDKClient` for maintaining session state across multiple exchanges:

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

async def main():
    client = ClaudeSDKClient(options=ClaudeAgentOptions(
        system_prompt="You are a project analyst",
        permission_mode="plan",
    ))

    # First interaction
    await client.connect(prompt="Summarize the project structure")
    async for msg in client.messages():
        print(msg)

    # Follow-up (same session, retains context)
    await client.query(prompt="Now identify the most complex module")
    async for msg in client.messages():
        print(msg)
```

## Breaking Changes (v0.1.0)

Three breaking changes apply to both SDKs:

| Change | Before | After | Migration |
|--------|--------|-------|-----------|
| **No default system prompt** | SDK loaded full Claude Code prompt | Minimal prompt only | Add `systemPrompt: { type: 'preset', preset: 'claude_code' }` for old behavior |
| **No filesystem settings** | SDK loaded CLAUDE.md automatically | `settingSources` defaults to `[]` | Add `settingSources: ['project']` to load CLAUDE.md |
| **Options type renamed** | `ClaudeCodeOptions` | `ClaudeAgentOptions` | Search and replace in your codebase |

## Common Patterns

### CI/CD Integration

```typescript
const q = query({
  prompt: "Run all tests and report failures",
  options: {
    permissionMode: "bypassPermissions",
    maxTurns: 50,
    cwd: process.env.WORKSPACE,
    sandbox: { type: "docker", image: "node:20" },
    outputSchema: {
      type: "object",
      properties: {
        passed: { type: "boolean" },
        failures: { type: "array", items: { type: "string" } },
      },
      required: ["passed", "failures"],
    },
  },
});
```

### Multi-Agent Pipeline

```typescript
const researcher = { name: "researcher", description: "...", allowedTools: ["Read", "Grep", "WebSearch"] };
const implementer = { name: "implementer", description: "...", allowedTools: ["Read", "Write", "Edit", "Bash"] };
const reviewer = { name: "reviewer", description: "...", allowedTools: ["Read", "Grep"], permissionMode: "plan" };

const q = query({
  prompt: "Research best practices for rate limiting, implement it, then review the code",
  options: {
    agents: [researcher, implementer, reviewer],
    permissionMode: "acceptEdits",
  },
});
```

### Guarded Execution with Hooks

```typescript
const q = query({
  prompt: "Refactor the database module",
  options: {
    hooks: {
      PreToolUse: [
        (toolName, toolInput) => {
          // Block any database migration commands
          if (toolName === "Bash" && toolInput.command.includes("migrate")) {
            return { decision: "block", message: "Migrations require manual approval" };
          }
          return undefined; // Allow everything else
        },
      ],
      PostToolUse: [
        (toolName, toolInput, toolOutput) => {
          console.log(`[LOG] ${toolName}: ${JSON.stringify(toolInput).slice(0, 100)}`);
          return undefined;
        },
      ],
    },
  },
});
```

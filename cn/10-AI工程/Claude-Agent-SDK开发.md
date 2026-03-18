> 来源：[xiaolai/claude-agent-sdk-skill-autoupdated](https://github.com/xiaolai/claude-agent-sdk-skill-autoupdated) | 分类：AI工程

---
name: claude-agent-sdk
description: "Build autonomous AI agents with Claude Agent SDK. TypeScript v0.2.50 | Python v0.1.39. Covers: query(), hooks, subagents, MCP, permissions, sandbox, structured outputs, and sessions."
---

# Claude Agent SDK 开发指南

## 概述

Claude Agent SDK 是 Anthropic 官方提供的编程式接口，允许开发者以代码方式驱动 Claude Code 的完整能力。与 CLI 交互不同，SDK 提供了结构化的 API 来执行查询、管理工具、编排子代理、控制权限，并获取类型安全的输出。

当前版本：
- **TypeScript SDK**：v0.2.50（`@anthropic-ai/claude-code`）
- **Python SDK**：v0.1.39（`claude-code-sdk`）

两个 SDK 功能对等，共享相同的核心概念，但遵循各自语言的惯例。

## 何时使用

- 构建基于 Claude Code 的自动化工作流
- 需要编程式控制 Agent 的行为和权限
- 构建多 Agent 系统，需要子代理编排
- 需要从 Agent 获取结构化（JSON Schema）输出
- 集成 MCP 服务器扩展 Agent 能力
- 构建需要沙盒隔离的安全执行环境

## 核心 API

### query() — 基础查询

`query()` 是 SDK 的核心方法，向 Claude Code 发送提示并获取响应。

**TypeScript：**

```typescript
import { query, type Message } from "@anthropic-ai/claude-code";

const messages: Message[] = await query({
  prompt: "Explain what this project does",
  options: {
    maxTurns: 3,
  },
});

// 提取文本响应
const textMessages = messages.filter(
  (msg) => msg.type === "text"
);
console.log(textMessages.map((m) => m.text).join("\n"));
```

**Python：**

```python
from claude_code_sdk import query, ClaudeCodeOptions, Message

messages: list[Message] = await query(
    prompt="Explain what this project does",
    options=ClaudeCodeOptions(max_turns=3),
)

for msg in messages:
    if msg.type == "text":
        print(msg.text)
```

### tool() — 自定义工具

通过 `tool()` 注册自定义工具，让 Agent 在推理过程中调用你的代码。

**TypeScript：**

```typescript
import { tool, query } from "@anthropic-ai/claude-code";

const weatherTool = tool({
  name: "get_weather",
  description: "Get current weather for a city",
  inputSchema: {
    type: "object",
    properties: {
      city: { type: "string", description: "City name" },
    },
    required: ["city"],
  },
  async execute(input: { city: string }) {
    // 你的实现逻辑
    return { temperature: 22, condition: "sunny" };
  },
});

const messages = await query({
  prompt: "What's the weather in Tokyo?",
  tools: [weatherTool],
});
```

### createSdkMcpServer() — SDK 内 MCP 服务器

在 SDK 进程内运行 MCP 服务器，无需外部进程管理。

**TypeScript：**

```typescript
import { createSdkMcpServer, query } from "@anthropic-ai/claude-code";

const server = createSdkMcpServer({
  tools: [
    {
      name: "lookup_user",
      description: "Look up user info by ID",
      inputSchema: {
        type: "object",
        properties: { userId: { type: "string" } },
        required: ["userId"],
      },
      async execute(input) {
        return { name: "Alice", role: "admin" };
      },
    },
  ],
});

const messages = await query({
  prompt: "Who is user 123?",
  mcpServers: [server],
});
```

## 跨语言命名映射表

两个 SDK 的概念完全对等，但命名遵循各自语言惯例：

| 概念 | TypeScript | Python | 说明 |
|------|-----------|--------|------|
| 查询方法 | `query()` | `query()` | 核心入口 |
| 配置对象 | `QueryOptions` | `ClaudeCodeOptions` | 查询参数 |
| 最大轮次 | `maxTurns` | `max_turns` | 限制 Agent 轮次 |
| 系统提示 | `systemPrompt` | `system_prompt` | 系统级指令 |
| 权限模式 | `permissionMode` | `permission_mode` | 工具权限控制 |
| 子代理 | `agents` | `agents` | 子代理定义列表 |
| MCP 服务器 | `mcpServers` | `mcp_servers` | MCP 配置 |
| 工具定义 | `tool()` | `tool()` | 自定义工具 |
| SDK MCP | `createSdkMcpServer()` | `create_sdk_mcp_server()` | 内嵌 MCP |
| 结构化输出 | `outputSchema` | `output_schema` | JSON Schema |
| 沙盒模式 | `sandbox` | `sandbox` | Docker 隔离 |
| 会话 ID | `sessionId` | `session_id` | 会话复用 |
| 钩子 | `hooks` | `hooks` | 生命周期回调 |

## 共享概念详解

### Hooks（钩子）

Hooks 允许你在 Agent 生命周期的关键节点插入自定义逻辑：

```typescript
const messages = await query({
  prompt: "Fix the bug in auth.ts",
  options: {
    hooks: {
      // Agent 开始前
      onStart: async () => {
        console.log("Agent started");
      },
      // 每次工具调用前
      onToolCall: async (toolName, input) => {
        console.log(`Calling tool: ${toolName}`);
        // 返回 false 可以阻止工具调用
        return true;
      },
      // 每次工具调用后
      onToolResult: async (toolName, result) => {
        console.log(`Tool ${toolName} returned:`, result);
      },
      // Agent 结束后
      onComplete: async (messages) => {
        console.log(`Completed with ${messages.length} messages`);
      },
    },
  },
});
```

**Python 等价：**

```python
messages = await query(
    prompt="Fix the bug in auth.ts",
    options=ClaudeCodeOptions(
        hooks={
            "on_start": on_start_callback,
            "on_tool_call": on_tool_call_callback,
            "on_tool_result": on_tool_result_callback,
            "on_complete": on_complete_callback,
        }
    ),
)
```

**典型用途：**
- 日志记录和审计
- 工具调用的访问控制
- 成本追踪（统计 token 消耗）
- 进度通知

### 权限模式（Permission Modes）

控制 Agent 对文件系统和工具的访问权限：

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `default` | 每次敏感操作都请求确认 | 交互式使用，需要人工审批 |
| `acceptEdits` | 自动批准文件编辑，其他操作请求确认 | 信任 Agent 的代码修改能力 |
| `plan` | 只允许读取和分析，禁止任何修改 | 代码评审、分析任务 |
| `bypassPermissions` | 跳过所有权限检查 | 完全自动化管道（谨慎使用） |

```typescript
// TypeScript
const messages = await query({
  prompt: "Refactor the user module",
  options: {
    permissionMode: "acceptEdits",
  },
});
```

```python
# Python
messages = await query(
    prompt="Refactor the user module",
    options=ClaudeCodeOptions(permission_mode="acceptEdits"),
)
```

**安全建议：**
- 生产环境永远不要使用 `bypassPermissions`
- CI/CD 管道中使用 `plan` 模式做代码审查
- 开发环境中使用 `acceptEdits` 提升效率

### MCP 服务器配置

SDK 支持四种 MCP 服务器接入方式：

#### 1. stdio — 标准输入输出

最常见的本地 MCP 服务器模式：

```typescript
const messages = await query({
  prompt: "Search the codebase",
  mcpServers: [
    {
      type: "stdio",
      command: "npx",
      args: ["-y", "@anthropic-ai/mcp-server-filesystem", "/path/to/project"],
    },
  ],
});
```

#### 2. HTTP — 远程 HTTP 服务

连接远程部署的 MCP 服务器：

```typescript
const messages = await query({
  prompt: "Query the database",
  mcpServers: [
    {
      type: "http",
      url: "https://mcp.example.com/api",
      headers: {
        Authorization: "Bearer <token>",
      },
    },
  ],
});
```

#### 3. SSE — Server-Sent Events

支持流式传输的 MCP 连接：

```typescript
const messages = await query({
  prompt: "Monitor logs",
  mcpServers: [
    {
      type: "sse",
      url: "https://mcp.example.com/sse",
    },
  ],
});
```

#### 4. SDK in-process — 进程内服务器

使用 `createSdkMcpServer()` 在 SDK 进程内运行，无需外部进程（参见前文 API 示例）。

**选择指导：**

| 方式 | 延迟 | 部署复杂度 | 适用场景 |
|------|------|-----------|---------|
| stdio | 低 | 低 | 本地开发、CLI 工具 |
| HTTP | 中 | 中 | 远程服务、团队共享 |
| SSE | 中 | 中 | 需要流式更新 |
| SDK in-process | 最低 | 最低 | SDK 内自定义工具 |

### 子代理（Sub-Agents）

通过 `AgentDefinition` 定义子代理，实现多 Agent 编排：

```typescript
import { query, type AgentDefinition } from "@anthropic-ai/claude-code";

const researcher: AgentDefinition = {
  name: "researcher",
  description: "Searches and analyzes code patterns",
  systemPrompt: `You are a code research specialist.
    Your job is to find relevant code patterns and report findings.
    Only use Read, Grep, and Glob tools.`,
  tools: ["Read", "Grep", "Glob"],
  model: "claude-sonnet-4-20250514",
};

const implementer: AgentDefinition = {
  name: "implementer",
  description: "Implements code changes based on research",
  systemPrompt: `You are a code implementation specialist.
    Implement changes based on the research provided.`,
  tools: ["Read", "Write", "Edit", "Bash"],
};

const messages = await query({
  prompt: "Find all deprecated API calls and update them",
  agents: [researcher, implementer],
});
```

**Python 等价：**

```python
from claude_code_sdk import query, ClaudeCodeOptions

researcher = {
    "name": "researcher",
    "description": "Searches and analyzes code patterns",
    "system_prompt": "You are a code research specialist...",
    "tools": ["Read", "Grep", "Glob"],
}

implementer = {
    "name": "implementer",
    "description": "Implements code changes based on research",
    "system_prompt": "You are a code implementation specialist...",
    "tools": ["Read", "Write", "Edit", "Bash"],
}

messages = await query(
    prompt="Find all deprecated API calls and update them",
    options=ClaudeCodeOptions(agents=[researcher, implementer]),
)
```

**编排原则：**
- 每个子代理应有明确的职责边界
- 通过 `tools` 限制子代理的能力范围（最小权限）
- 子代理之间通过主 Agent 协调，不直接通信
- 为子代理设定独立的 `systemPrompt`

### 结构化输出（Structured Outputs）

通过 JSON Schema 约束 Agent 的输出格式：

```typescript
const messages = await query({
  prompt: "Analyze the security of this API endpoint",
  options: {
    outputSchema: {
      type: "object",
      properties: {
        risk_level: {
          type: "string",
          enum: ["low", "medium", "high", "critical"],
        },
        vulnerabilities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              severity: { type: "string" },
              description: { type: "string" },
              recommendation: { type: "string" },
            },
            required: ["type", "severity", "description", "recommendation"],
          },
        },
        overall_score: {
          type: "number",
          minimum: 0,
          maximum: 100,
        },
      },
      required: ["risk_level", "vulnerabilities", "overall_score"],
    },
  },
});

// 输出将严格符合 Schema 定义
const result = JSON.parse(messages[messages.length - 1].text);
console.log(result.risk_level); // "medium"
console.log(result.vulnerabilities.length); // 3
```

**Python 等价：**

```python
messages = await query(
    prompt="Analyze the security of this API endpoint",
    options=ClaudeCodeOptions(
        output_schema={
            "type": "object",
            "properties": {
                "risk_level": {
                    "type": "string",
                    "enum": ["low", "medium", "high", "critical"],
                },
                "vulnerabilities": {
                    "type": "array",
                    "items": { ... },
                },
                "overall_score": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 100,
                },
            },
            "required": ["risk_level", "vulnerabilities", "overall_score"],
        }
    ),
)
```

**注意事项：**
- Schema 验证在 SDK 层面强制执行
- Agent 会自动将输出格式化为符合 Schema 的 JSON
- 复杂 Schema 可能增加 token 消耗
- 建议 Schema 深度不超过 3 层

### 沙盒（Sandbox）

在 Docker 容器中运行 Agent，提供文件系统隔离：

```typescript
const messages = await query({
  prompt: "Run the test suite",
  options: {
    sandbox: {
      type: "docker",
      image: "node:20-slim",
      workdir: "/workspace",
      mounts: [
        {
          source: "/local/project",
          target: "/workspace",
          readonly: false,
        },
      ],
    },
  },
});
```

**适用场景：**
- 运行不受信任的代码
- 测试环境隔离
- 防止 Agent 意外修改宿主文件系统
- 可重现的构建环境

### 会话（Sessions）

通过 `sessionId` 在多次查询间保持会话状态：

```typescript
// 第一次查询
const session1 = await query({
  prompt: "Read the project structure",
  options: {
    sessionId: "my-session-001",
  },
});

// 第二次查询——Agent 记住了上一次的上下文
const session2 = await query({
  prompt: "Based on what you just read, suggest improvements",
  options: {
    sessionId: "my-session-001", // 复用同一会话
  },
});
```

**注意事项：**
- 会话 ID 必须是唯一的字符串
- 同一会话中的查询共享消息历史
- 会话有超时时间（默认取决于部署配置）
- 长会话注意上下文窗口限制

## TypeScript 快速入门

### 安装

```bash
npm install @anthropic-ai/claude-code
```

### 基本用法

```typescript
import { query } from "@anthropic-ai/claude-code";

async function main() {
  const messages = await query({
    prompt: "List all TypeScript files in the src directory",
    options: {
      maxTurns: 5,
      permissionMode: "plan", // 只读模式
    },
  });

  for (const msg of messages) {
    if (msg.type === "text") {
      console.log(msg.text);
    }
  }
}

main().catch(console.error);
```

### 流式输入

TypeScript SDK 支持流式处理 Agent 输出：

```typescript
import { queryStream } from "@anthropic-ai/claude-code";

async function main() {
  const stream = queryStream({
    prompt: "Explain the architecture of this project",
  });

  for await (const event of stream) {
    if (event.type === "text_delta") {
      process.stdout.write(event.text);
    } else if (event.type === "tool_use") {
      console.log(`\n[Tool Call: ${event.name}]`);
    }
  }
}
```

## Python 快速入门

### 安装

```bash
pip install claude-code-sdk
```

### 基本用法

```python
import asyncio
from claude_code_sdk import query, ClaudeCodeOptions

async def main():
    messages = await query(
        prompt="List all Python files in the project",
        options=ClaudeCodeOptions(
            max_turns=5,
            permission_mode="plan",
        ),
    )

    for msg in messages:
        if msg.type == "text":
            print(msg.text)

asyncio.run(main())
```

### ClaudeSDKClient 封装

Python SDK 提供了 `ClaudeSDKClient` 类用于更复杂的场景：

```python
from claude_code_sdk import ClaudeSDKClient, ClaudeCodeOptions

async def main():
    client = ClaudeSDKClient()

    # 配置全局选项
    options = ClaudeCodeOptions(
        max_turns=10,
        permission_mode="acceptEdits",
        system_prompt="You are a Python expert focused on clean code.",
    )

    # 执行查询
    messages = await client.query(
        prompt="Refactor utils.py to use dataclasses",
        options=options,
    )

    # 获取最终文本输出
    result = client.get_text_output(messages)
    print(result)

asyncio.run(main())
```

## Breaking Changes 注意事项

SDK 处于活跃开发期，以下是需要注意的版本兼容问题：

### TypeScript SDK

| 版本 | 变更 | 影响 |
|------|------|------|
| v0.2.x → v0.3.x | `QueryOptions` 结构重组 | 部分选项从顶层移入 `options` 嵌套 |
| v0.1.x → v0.2.x | `tool()` API 签名变更 | `execute` 改为 async 必须 |

### Python SDK

| 版本 | 变更 | 影响 |
|------|------|------|
| v0.1.x → v0.2.x | `ClaudeCodeOptions` 字段重命名 | `maxTurns` → `max_turns`（全面蛇形命名） |

### 版本兼容建议

- **锁定版本**：在 `package.json` / `requirements.txt` 中使用精确版本号
- **关注 Changelog**：每次升级前检查 Breaking Changes 章节
- **类型检查**：TypeScript 项目开启 `strict` 模式，及早发现 API 变更
- **集成测试**：升级 SDK 后运行完整的集成测试套件

## 常用模式速查

| 场景 | 推荐配置 |
|------|---------|
| 代码分析（只读） | `permissionMode: "plan"`, `maxTurns: 5` |
| 功能实现 | `permissionMode: "acceptEdits"`, `maxTurns: 20` |
| 代码评审 | `permissionMode: "plan"`, `outputSchema: {...}` |
| 自动化管道 | `permissionMode: "bypassPermissions"`, `sandbox: {...}` |
| 多 Agent 协作 | `agents: [...]`, `maxTurns: 30` |
| 结构化数据提取 | `outputSchema: {...}`, `maxTurns: 3` |

## 总结

Claude Agent SDK 的核心价值：

1. **编程式控制** — 从交互式 CLI 升级为可编程的 API，适合自动化场景
2. **类型安全** — TypeScript 和 Python 都有完整的类型定义
3. **多 Agent 编排** — 通过子代理和 MCP 构建复杂的 Agent 系统
4. **安全隔离** — 权限模式 + 沙盒提供多层安全保障
5. **结构化输出** — JSON Schema 确保输出可被程序可靠解析
6. **跨语言一致** — TypeScript 和 Python SDK 概念对等，迁移成本低

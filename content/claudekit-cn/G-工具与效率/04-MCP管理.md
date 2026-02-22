> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：G-工具与效率

# MCP 管理

管理和交互模型上下文协议（MCP，Model Context Protocol）服务器的技能。

## 概述

MCP 是一个开放协议，使 AI Agent 能够连接外部工具和数据源。此技能提供脚本和工具来发现、分析和执行已配置服务器的 MCP 能力，同时不污染主上下文窗口。

**核心优势**：
- 渐进式披露 MCP 能力（仅加载所需内容）
- 基于任务需求的智能工具/提示词/资源选择
- 从单一配置文件管理多服务器
- 上下文高效：子 Agent 处理 MCP 发现和执行
- 持久工具目录：自动将发现的工具保存到 JSON 以供快速引用

## 适用场景

1. **发现 MCP 能力**：需要列出已配置服务器的可用工具/提示词/资源
2. **基于任务的工具选择**：分析哪些 MCP 工具与特定任务相关
3. **执行 MCP 工具**：以适当的参数处理方式编程调用 MCP 工具
4. **MCP 集成**：构建或调试 MCP 客户端实现
5. **上下文管理**：通过将 MCP 操作委派给子 Agent 来避免上下文污染

## 核心能力

### 1. 配置管理

MCP 服务器配置在 `.claude/.mcp.json` 中。

**Gemini CLI 集成**（推荐）：创建到 `.gemini/settings.json` 的符号链接：
```bash
mkdir -p .gemini && ln -sf .claude/.mcp.json .gemini/settings.json
```

参见 [references/configuration.md](references/configuration.md) 和 [references/gemini-cli-integration.md](references/gemini-cli-integration.md)。

### 2. 能力发现

```bash
npx tsx scripts/cli.ts list-tools  # 保存到 assets/tools.json
npx tsx scripts/cli.ts list-prompts
npx tsx scripts/cli.ts list-resources
```

跨多个服务器聚合能力并标识来源服务器。

### 3. 智能工具分析

LLM 直接分析 `assets/tools.json` —— 比关键词匹配算法更好。

### 4. 工具执行

**主要方式：Gemini CLI**（如果可用）
```bash
gemini -y -m gemini-2.5-flash -p "对 https://example.com 截图"
```

**次要方式：直接脚本**
```bash
npx tsx scripts/cli.ts call-tool memory create_entities '{"entities":[...]}'
```

**回退方式：mcp-manager 子 Agent**

参见 [references/gemini-cli-integration.md](references/gemini-cli-integration.md) 获取完整示例。

## 实现模式

### 模式一：Gemini CLI 自动执行（主要）

使用 Gemini CLI 实现自动工具发现和执行。参见 [references/gemini-cli-integration.md](references/gemini-cli-integration.md) 获取完整指南。

**快速示例**：
```bash
gemini -y -m gemini-2.5-flash -p "对 https://example.com 截图"
```

**优势**：自动工具发现、自然语言执行、比子 Agent 编排更快。

### 模式二：基于子 Agent 的执行（回退）

Gemini CLI 不可用时使用 `mcp-manager` Agent。子 Agent 发现工具、选择相关工具、执行任务、报告结果。

**优势**：主上下文保持干净，仅在需要时加载相关工具定义。

### 模式三：LLM 驱动的工具选择

LLM 读取 `assets/tools.json`，利用上下文理解、同义词和意图识别智能选择相关工具。

### 模式四：多服务器编排

跨多个服务器协调工具。每个工具知道其来源服务器以便正确路由。

## 脚本参考

### scripts/mcp-client.ts

核心 MCP 客户端管理类。处理：
- 从 `.claude/.mcp.json` 加载配置
- 连接多个 MCP 服务器
- 列出跨所有服务器的工具/提示词/资源
- 以适当的错误处理执行工具
- 连接生命周期管理

### scripts/cli.ts

MCP 操作的命令行界面。命令：
- `list-tools` - 显示所有工具并保存到 `assets/tools.json`
- `list-prompts` - 显示所有提示词
- `list-resources` - 显示所有资源
- `call-tool <server> <tool> <json>` - 执行工具

**说明**：`list-tools` 将完整工具目录和完整模式持久化到 `assets/tools.json`，用于快速引用、离线浏览和版本控制。

## 快速开始

**方法一：Gemini CLI**（推荐）
```bash
npm install -g gemini-cli
mkdir -p .gemini && ln -sf .claude/.mcp.json .gemini/settings.json
gemini -y -m gemini-2.5-flash -p "对 https://example.com 截图"
```

**方法二：脚本**
```bash
cd .claude/skills/mcp-management/scripts && npm install
npx tsx cli.ts list-tools  # 保存到 assets/tools.json
npx tsx cli.ts call-tool memory create_entities '{"entities":[...]}'
```

**方法三：mcp-manager 子 Agent**

参见 [references/gemini-cli-integration.md](references/gemini-cli-integration.md) 获取完整指南。

## 技术细节

参见 [references/mcp-protocol.md](references/mcp-protocol.md) 了解：
- JSON-RPC 协议细节
- 消息类型和格式
- 错误码和处理
- 传输机制（stdio、HTTP+SSE）
- 最佳实践

## 集成策略

### 执行优先级

1. **Gemini CLI**（主要）：快速、自动、智能工具选择
   - 检查：`command -v gemini`
   - 执行：`gemini -y -m gemini-2.5-flash -p "<任务>"`
   - 适用于：可用时的所有任务

2. **直接 CLI 脚本**（次要）：手动指定工具
   - 使用场景：需要特定工具/服务器控制时
   - 执行：`npx tsx scripts/cli.ts call-tool <server> <tool> <args>`

3. **mcp-manager 子 Agent**（回退）：上下文高效的委派
   - 使用场景：Gemini 不可用或失败时
   - 保持主上下文干净

### 与 Agent 的集成

`mcp-manager` Agent 使用此技能来：
- 首先检查 Gemini CLI 可用性
- 如果可用则通过 `gemini` 命令执行
- 回退到直接脚本执行
- 在不加载到主上下文的情况下发现 MCP 能力
- 将结果报告给主 Agent

这保持了主 Agent 上下文的干净并实现了高效的 MCP 集成。

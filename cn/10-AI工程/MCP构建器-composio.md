> 来源：[ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 分类：开发与工具

# MCP 服务器开发指南

## 概述

使用此技能创建高质量的 MCP（Model Context Protocol，模型上下文协议）服务器，使大语言模型（LLM）能够与外部服务进行有效交互。MCP 服务器提供工具，允许 LLM 访问外部服务和 API。MCP 服务器的质量取决于它能多好地帮助 LLM 使用所提供的工具完成实际任务。

---

# 流程

## 高层工作流

创建高质量的 MCP 服务器包含四个主要阶段：

### 阶段一：深入研究与规划

#### 1.1 理解以 Agent（智能体）为中心的设计原则

在开始实现之前，通过学习以下原则来理解如何为 AI Agent 设计工具：

**为工作流构建，而非仅包装 API 端点：**
- 不要简单地包装现有 API 端点 — 要构建经过深思熟虑的高影响力工作流工具
- 合并相关操作（例如 `schedule_event` 同时检查可用性并创建事件）
- 专注于能完成完整任务的工具，而非仅仅是单个 API 调用
- 考虑 Agent 实际需要完成哪些工作流

**为有限上下文优化：**
- Agent 的上下文窗口（Context Window）有限 — 让每个 Token 都有价值
- 返回高信号信息，而非全量数据转储
- 提供"简洁"与"详细"两种响应格式选项
- 默认使用人类可读的标识符而非技术代码（使用名称而非 ID）
- 将 Agent 的上下文预算视为稀缺资源

**设计可操作的错误消息：**
- 错误消息应引导 Agent 走向正确的使用模式
- 建议具体的下一步操作："尝试使用 filter='active_only' 来减少结果"
- 让错误消息具有教育意义，而非仅仅是诊断信息
- 通过清晰的反馈帮助 Agent 学习正确的工具用法

**遵循自然的任务划分：**
- 工具名称应反映人类对任务的思考方式
- 使用一致的前缀对相关工具进行分组，便于发现
- 围绕自然工作流设计工具，而非仅围绕 API 结构

**使用评估驱动开发：**
- 尽早创建真实的评估场景
- 让 Agent 反馈驱动工具改进
- 快速原型化并根据实际 Agent 性能进行迭代

#### 1.3 学习 MCP 协议文档

**获取最新的 MCP 协议文档：**

使用 WebFetch 加载：`https://modelcontextprotocol.io/llms-full.txt`

该文档包含完整的 MCP 规范和指南。

#### 1.4 学习框架文档

**加载并阅读以下参考文件：**

- **MCP 最佳实践**：[查看最佳实践](./reference/mcp_best_practices.md) - 所有 MCP 服务器的核心指南

**Python 实现还需加载：**
- **Python SDK 文档**：使用 WebFetch 加载 `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- [Python 实现指南](./reference/python_mcp_server.md) - Python 专用的最佳实践和示例

**Node/TypeScript 实现还需加载：**
- **TypeScript SDK 文档**：使用 WebFetch 加载 `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- [TypeScript 实现指南](./reference/node_mcp_server.md) - Node/TypeScript 专用的最佳实践和示例

#### 1.5 深入研究 API 文档

要集成某个服务，需通读**所有**可用的 API 文档：
- 官方 API 参考文档
- 认证和授权要求
- 速率限制和分页模式
- 错误响应和状态码
- 可用端点及其参数
- 数据模型和 Schema（模式定义）

**要获取全面信息，根据需要使用 Web 搜索和 WebFetch 工具。**

#### 1.6 创建全面的实现计划

基于研究成果，创建详细计划，包括：

**工具选择：**
- 列出最有价值的端点/操作
- 优先实现最常见和最重要用例的工具
- 考虑哪些工具配合使用可实现复杂工作流

**共享工具函数和辅助方法：**
- 识别通用的 API 请求模式
- 规划分页辅助函数
- 设计过滤和格式化工具
- 规划错误处理策略

**输入/输出设计：**
- 定义输入验证模型（Python 使用 Pydantic，TypeScript 使用 Zod）
- 设计一致的响应格式（如 JSON 或 Markdown），以及可配置的详细级别（如"详细"或"简洁"）
- 为大规模使用做规划（数千用户/资源）
- 实现字符限制和截断策略（如 25,000 个 Token）

**错误处理策略：**
- 规划优雅的失败模式
- 设计清晰、可操作、LLM 友好的自然语言错误消息，以提示进一步操作
- 考虑速率限制和超时场景
- 处理认证和授权错误

---

### 阶段二：实现

有了全面的计划后，开始按照特定语言的最佳实践进行实现。

#### 2.1 搭建项目结构

**Python：**
- 创建单个 `.py` 文件，或根据复杂度组织为模块（参见 [Python 指南](./reference/python_mcp_server.md)）
- 使用 MCP Python SDK 进行工具注册
- 定义 Pydantic 模型进行输入验证

**Node/TypeScript：**
- 创建正确的项目结构（参见 [TypeScript 指南](./reference/node_mcp_server.md)）
- 配置 `package.json` 和 `tsconfig.json`
- 使用 MCP TypeScript SDK
- 定义 Zod Schema 进行输入验证

#### 2.2 先实现核心基础设施

**在实现工具之前，先创建共享工具函数：**
- API 请求辅助函数
- 错误处理工具
- 响应格式化函数（JSON 和 Markdown）
- 分页辅助函数
- 认证/Token 管理

#### 2.3 系统化实现工具

对计划中的每个工具：

**定义输入 Schema：**
- 使用 Pydantic（Python）或 Zod（TypeScript）进行验证
- 包含适当的约束（最小/最大长度、正则表达式、最小/最大值、范围）
- 提供清晰、描述性的字段说明
- 在字段描述中包含多样化的示例

**编写全面的文档字符串/描述：**
- 工具功能的单行摘要
- 目的和功能的详细解释
- 带示例的明确参数类型
- 完整的返回类型 Schema
- 使用示例（何时使用、何时不使用）
- 错误处理文档，说明针对特定错误应如何处理

**实现工具逻辑：**
- 使用共享工具函数避免代码重复
- 对所有 I/O 操作遵循 async/await 模式
- 实现正确的错误处理
- 支持多种响应格式（JSON 和 Markdown）
- 遵循分页参数
- 检查字符限制并适当截断

**添加工具注解（Tool Annotations）：**
- `readOnlyHint`：true（只读操作）
- `destructiveHint`：false（非破坏性操作）
- `idempotentHint`：true（重复调用产生相同效果时）
- `openWorldHint`：true（与外部系统交互时）

#### 2.4 遵循特定语言的最佳实践

**此时加载相应的语言指南：**

**Python：加载 [Python 实现指南](./reference/python_mcp_server.md) 并确保：**
- 使用 MCP Python SDK 并正确注册工具
- 使用带 `model_config` 的 Pydantic v2 模型
- 全面使用类型注解（Type Hints）
- 所有 I/O 操作使用 async/await
- 合理组织导入
- 模块级常量（CHARACTER_LIMIT、API_BASE_URL）

**Node/TypeScript：加载 [TypeScript 实现指南](./reference/node_mcp_server.md) 并确保：**
- 正确使用 `server.registerTool`
- Zod Schema 使用 `.strict()`
- 启用 TypeScript 严格模式
- 不使用 `any` 类型 — 使用正确的类型
- 显式的 Promise<T> 返回类型
- 构建流程已配置（`npm run build`）

---

### 阶段三：审查与优化

初始实现完成后：

#### 3.1 代码质量审查

为确保质量，审查以下方面：
- **DRY 原则**：工具之间无重复代码
- **可组合性**：共享逻辑已抽取为函数
- **一致性**：相似操作返回相似格式
- **错误处理**：所有外部调用都有错误处理
- **类型安全**：完整的类型覆盖（Python 类型注解、TypeScript 类型）
- **文档**：每个工具都有全面的文档字符串/描述

#### 3.2 测试与构建

**重要提示：** MCP 服务器是长时间运行的进程，通过 stdio/stdin 或 SSE/HTTP 等待请求。直接在主进程中运行它们（如 `python server.py` 或 `node dist/index.js`）会导致进程无限挂起。

**安全的测试方式：**
- 使用评估工具（参见阶段四） — 推荐方式
- 在 tmux 中运行服务器，使其在主进程之外
- 测试时使用超时：`timeout 5s python server.py`

**Python：**
- 验证 Python 语法：`python -m py_compile your_server.py`
- 通过审查文件检查导入是否正确
- 手动测试：在 tmux 中运行服务器，然后在主进程中使用评估工具测试
- 或直接使用评估工具（它会管理 stdio 传输的服务器）

**Node/TypeScript：**
- 运行 `npm run build` 并确保无错误完成
- 验证 dist/index.js 已生成
- 手动测试：在 tmux 中运行服务器，然后在主进程中使用评估工具测试
- 或直接使用评估工具（它会管理 stdio 传输的服务器）

#### 3.3 使用质量检查清单

要验证实现质量，从特定语言指南中加载相应的检查清单：
- Python：参见 [Python 指南](./reference/python_mcp_server.md) 中的"Quality Checklist（质量检查清单）"
- Node/TypeScript：参见 [TypeScript 指南](./reference/node_mcp_server.md) 中的"Quality Checklist（质量检查清单）"

---

### 阶段四：创建评估

实现 MCP 服务器后，创建全面的评估来测试其有效性。

**加载 [评估指南](./reference/evaluation.md) 获取完整的评估指南。**

#### 4.1 理解评估目的

评估测试 LLM 能否有效使用你的 MCP 服务器回答真实、复杂的问题。

#### 4.2 创建 10 个评估问题

要创建有效的评估，遵循评估指南中的流程：

1. **工具检查**：列出可用工具并理解其功能
2. **内容探索**：使用只读操作探索可用数据
3. **问题生成**：创建 10 个复杂、真实的问题
4. **答案验证**：亲自解答每个问题以验证答案

#### 4.3 评估要求

每个问题必须满足：
- **独立性**：不依赖其他问题
- **只读性**：仅需非破坏性操作
- **复杂性**：需要多次工具调用和深度探索
- **真实性**：基于人类真正关心的真实用例
- **可验证性**：有单一、明确的答案，可通过字符串比较验证
- **稳定性**：答案不会随时间改变

#### 4.4 输出格式

创建如下结构的 XML 文件：

```xml
<evaluation>
  <qa_pair>
    <question>查找关于使用动物代号的 AI 模型发布的讨论。其中一个模型需要一个特定的安全等级认证，格式为 ASL-X。以斑点野猫命名的模型需要确定的数字 X 是多少？</question>
    <answer>3</answer>
  </qa_pair>
<!-- 更多 qa_pair... -->
</evaluation>
```

---

# 参考文件

## 文档库

在开发过程中根据需要加载以下资源：

### 核心 MCP 文档（优先加载）
- **MCP 协议**：从 `https://modelcontextprotocol.io/llms-full.txt` 获取 - 完整的 MCP 规范
- [MCP 最佳实践](./reference/mcp_best_practices.md) - 通用 MCP 指南，包括：
  - 服务器和工具命名规范
  - 响应格式指南（JSON vs Markdown）
  - 分页最佳实践
  - 字符限制和截断策略
  - 工具开发指南
  - 安全和错误处理标准

### SDK 文档（阶段 1/2 时加载）
- **Python SDK**：从 `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md` 获取
- **TypeScript SDK**：从 `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md` 获取

### 特定语言实现指南（阶段 2 时加载）
- [Python 实现指南](./reference/python_mcp_server.md) - 完整的 Python/FastMCP 指南，包括：
  - 服务器初始化模式
  - Pydantic 模型示例
  - 使用 `@mcp.tool` 注册工具
  - 完整工作示例
  - 质量检查清单

- [TypeScript 实现指南](./reference/node_mcp_server.md) - 完整的 TypeScript 指南，包括：
  - 项目结构
  - Zod Schema 模式
  - 使用 `server.registerTool` 注册工具
  - 完整工作示例
  - 质量检查清单

### 评估指南（阶段 4 时加载）
- [评估指南](./reference/evaluation.md) - 完整的评估创建指南，包括：
  - 问题创建指南
  - 答案验证策略
  - XML 格式规范
  - 示例问题和答案
  - 使用提供的脚本运行评估

> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：E-AI与Agent

# MCP 服务器开发指南

## 概述

创建高质量的 MCP（模型上下文协议，Model Context Protocol）服务器，使 LLM 能够有效地与外部服务交互。MCP 服务器提供工具让 LLM 访问外部服务和 API。MCP 服务器的质量取决于它能多好地帮助 LLM 使用所提供的工具完成现实世界的任务。

---

# 流程

## 高层工作流

创建高质量的 MCP 服务器包含四个主要阶段：

### 阶段一：深入研究与规划

#### 1.1 理解以 Agent 为中心的设计原则

在深入实现之前，理解如何为 AI Agent 设计工具：

**为工作流构建，而非仅包装 API 端点：**
- 不要简单地包装现有 API 端点 - 构建深思熟虑的、高影响力的工作流工具
- 整合相关操作（例如 `schedule_event` 同时检查可用性和创建事件）
- 专注于能够完成完整任务的工具，而非单个 API 调用
- 考虑 Agent 实际需要完成的工作流

**为有限上下文优化：**
- Agent 具有受限的上下文窗口 - 让每个 token 都有价值
- 返回高信号信息，而非详尽的数据转储
- 提供"简洁"与"详细"响应格式选项
- 默认使用人类可读的标识符而非技术代码（名称优于 ID）
- 将 Agent 的上下文预算视为稀缺资源

**设计可操作的错误消息：**
- 错误消息应引导 Agent 走向正确的使用模式
- 建议具体的下一步："尝试使用 filter='active_only' 来减少结果"
- 使错误消息具有教育意义，而非仅是诊断性的
- 通过清晰的反馈帮助 Agent 学习正确的工具用法

**遵循自然的任务细分：**
- 工具名称应反映人类对任务的思考方式
- 使用一致的前缀对相关工具分组以提高可发现性
- 围绕自然工作流设计工具，而非仅按 API 结构

**使用评估驱动的开发：**
- 尽早创建真实的评估场景
- 让 Agent 反馈驱动工具改进
- 快速原型迭代，基于实际 Agent 性能进行优化

#### 1.3 研究 MCP 协议文档

**获取最新的 MCP 协议文档：**

使用 WebFetch 加载：`https://modelcontextprotocol.io/llms-full.txt`

该综合文档包含完整的 MCP 规范和指南。

#### 1.4 研究框架文档

**加载并阅读以下参考文件：**

- **MCP 最佳实践**：[查看最佳实践](./reference/mcp_best_practices.md) - 所有 MCP 服务器的核心指南

**Python 实现还需加载：**
- **Python SDK 文档**：使用 WebFetch 加载 `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- [Python 实现指南](./reference/python_mcp_server.md) - Python 特定的最佳实践和示例

**Node/TypeScript 实现还需加载：**
- **TypeScript SDK 文档**：使用 WebFetch 加载 `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- [TypeScript 实现指南](./reference/node_mcp_server.md) - Node/TypeScript 特定的最佳实践和示例

#### 1.5 全面研究 API 文档

集成服务时，需通读**全部**可用的 API 文档：
- 官方 API 参考文档
- 认证与授权要求
- 速率限制与分页模式
- 错误响应与状态码
- 可用端点及其参数
- 数据模型与架构

**使用网络搜索和 WebFetch 工具收集全面信息。**

#### 1.6 创建全面的实现计划

基于研究创建详细计划，包括：

**工具选择：**
- 列出最有价值的端点/操作
- 优先实现最常用和最重要的用例
- 考虑哪些工具协同工作以实现复杂工作流

**共享工具与辅助函数：**
- 识别常见的 API 请求模式
- 规划分页辅助函数
- 设计过滤和格式化工具
- 规划错误处理策略

**输入/输出设计：**
- 定义输入验证模型（Python 用 Pydantic，TypeScript 用 Zod）
- 设计一致的响应格式（如 JSON 或 Markdown），以及可配置的详细程度（如详细或简洁）
- 为大规模使用做规划（数千用户/资源）
- 实现字符限制和截断策略（如 25,000 tokens）

**错误处理策略：**
- 规划优雅的失败模式
- 设计清晰、可操作、对 LLM 友好的自然语言错误消息
- 考虑速率限制和超时场景
- 处理认证和授权错误

---

### 阶段二：实现

有了全面的计划后，开始按照语言特定的最佳实践进行实现。

#### 2.1 设置项目结构

**Python：**
- 创建单个 `.py` 文件或根据复杂度组织为模块（参见 [Python 指南](./reference/python_mcp_server.md)）
- 使用 MCP Python SDK 进行工具注册
- 定义 Pydantic 模型用于输入验证

**Node/TypeScript：**
- 创建适当的项目结构（参见 [TypeScript 指南](./reference/node_mcp_server.md)）
- 设置 `package.json` 和 `tsconfig.json`
- 使用 MCP TypeScript SDK
- 定义 Zod 模式用于输入验证

#### 2.2 先实现核心基础设施

**开始实现时，先创建共享工具再实现具体工具：**
- API 请求辅助函数
- 错误处理工具
- 响应格式化函数（JSON 和 Markdown）
- 分页辅助函数
- 认证/令牌管理

#### 2.3 系统性地实现工具

对计划中的每个工具：

**定义输入模式：**
- 使用 Pydantic（Python）或 Zod（TypeScript）进行验证
- 包含适当的约束（最小/最大长度、正则表达式模式、最小/最大值、范围）
- 提供清晰、描述性的字段说明
- 在字段说明中包含多样的示例

**编写全面的文档字符串/描述：**
- 一行摘要说明工具功能
- 详细解释目的和功能
- 明确的参数类型与示例
- 完整的返回类型模式
- 使用示例（何时使用、何时不使用）
- 错误处理文档，说明遇到特定错误时如何处理

**实现工具逻辑：**
- 使用共享工具避免代码重复
- 所有 I/O 使用 async/await 模式
- 实现适当的错误处理
- 支持多种响应格式（JSON 和 Markdown）
- 遵循分页参数
- 检查字符限制并适当截断

**添加工具注解：**
- `readOnlyHint`: true（用于只读操作）
- `destructiveHint`: false（用于非破坏性操作）
- `idempotentHint`: true（如果重复调用有相同效果）
- `openWorldHint`: true（如果与外部系统交互）

#### 2.4 遵循语言特定的最佳实践

**Python：加载 [Python 实现指南](./reference/python_mcp_server.md) 并确保：**
- 使用 MCP Python SDK 进行适当的工具注册
- Pydantic v2 模型使用 `model_config`
- 全程使用类型提示
- 所有 I/O 操作使用 async/await
- 适当组织导入
- 模块级常量（CHARACTER_LIMIT、API_BASE_URL）

**Node/TypeScript：加载 [TypeScript 实现指南](./reference/node_mcp_server.md) 并确保：**
- 正确使用 `server.registerTool`
- Zod 模式使用 `.strict()`
- 启用 TypeScript 严格模式
- 不使用 `any` 类型 - 使用适当类型
- 显式的 Promise<T> 返回类型
- 配置构建流程（`npm run build`）

---

### 阶段三：审查与优化

初始实现之后：

#### 3.1 代码质量审查

审查代码确保：
- **DRY 原则**：工具间没有重复代码
- **可组合性**：共享逻辑提取为函数
- **一致性**：相似操作返回相似格式
- **错误处理**：所有外部调用都有错误处理
- **类型安全**：完整的类型覆盖（Python 类型提示、TypeScript 类型）
- **文档**：每个工具都有全面的文档字符串/描述

#### 3.2 测试与构建

**重要说明：** MCP 服务器是长期运行的进程，通过 stdio/stdin 或 sse/http 等待请求。直接在主进程中运行（如 `python server.py` 或 `node dist/index.js`）将导致进程无限挂起。

**安全的测试方式：**
- 使用评估工具（参见阶段四）- 推荐方法
- 在 tmux 中运行服务器以使其脱离主进程
- 测试时使用超时：`timeout 5s python server.py`

**Python：**
- 验证 Python 语法：`python -m py_compile your_server.py`
- 检查导入是否正确
- 手动测试：在 tmux 中运行服务器，然后在主进程中用评估工具测试
- 或直接使用评估工具（它为 stdio 传输管理服务器）

**Node/TypeScript：**
- 运行 `npm run build` 并确保无错误完成
- 验证 dist/index.js 已创建
- 手动测试：在 tmux 中运行服务器，然后在主进程中用评估工具测试
- 或直接使用评估工具（它为 stdio 传输管理服务器）

#### 3.3 使用质量检查清单

从语言特定指南加载适当的检查清单来验证实现质量：
- Python：参见 [Python 指南](./reference/python_mcp_server.md) 中的"质量检查清单"
- Node/TypeScript：参见 [TypeScript 指南](./reference/node_mcp_server.md) 中的"质量检查清单"

---

### 阶段四：创建评估

实现 MCP 服务器后，创建全面的评估来测试其有效性。

**加载 [评估指南](./reference/evaluation.md) 获取完整评估指南。**

#### 4.1 理解评估目的

评估测试 LLM 是否能有效使用你的 MCP 服务器来回答真实、复杂的问题。

#### 4.2 创建 10 个评估问题

创建有效评估的流程：

1. **工具检查**：列出可用工具并理解其能力
2. **内容探索**：使用只读操作探索可用数据
3. **问题生成**：创建 10 个复杂、真实的问题
4. **答案验证**：亲自解答每个问题以验证答案

#### 4.3 评估要求

每个问题必须：
- **独立**：不依赖其他问题
- **只读**：仅需要非破坏性操作
- **复杂**：需要多个工具调用和深入探索
- **真实**：基于人类真正关心的真实用例
- **可验证**：有单一、清晰的可通过字符串比较验证的答案
- **稳定**：答案不会随时间变化

#### 4.4 输出格式

创建如下结构的 XML 文件：

```xml
<evaluation>
  <qa_pair>
    <question>查找关于使用动物代号的 AI 模型发布的讨论。一个模型需要使用 ASL-X 格式的特定安全等级。以一种斑点野猫命名的模型被确定的数字 X 是什么？</question>
    <answer>3</answer>
  </qa_pair>
<!-- 更多 qa_pairs... -->
</evaluation>
```

---

# 参考文件

## 文档库

在开发过程中按需加载这些资源：

### 核心 MCP 文档（优先加载）
- **MCP 协议**：从 `https://modelcontextprotocol.io/llms-full.txt` 获取 - 完整的 MCP 规范
- [MCP 最佳实践](./reference/mcp_best_practices.md) - 通用 MCP 指南，包括：
  - 服务器和工具命名约定
  - 响应格式指南（JSON vs Markdown）
  - 分页最佳实践
  - 字符限制和截断策略
  - 工具开发指南
  - 安全和错误处理标准

### SDK 文档（在阶段 1/2 加载）
- **Python SDK**：从 `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md` 获取
- **TypeScript SDK**：从 `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md` 获取

### 语言特定实现指南（在阶段 2 加载）
- [Python 实现指南](./reference/python_mcp_server.md) - 完整的 Python/FastMCP 指南，包括：
  - 服务器初始化模式
  - Pydantic 模型示例
  - 使用 `@mcp.tool` 进行工具注册
  - 完整的工作示例
  - 质量检查清单

- [TypeScript 实现指南](./reference/node_mcp_server.md) - 完整的 TypeScript 指南，包括：
  - 项目结构
  - Zod 模式模式
  - 使用 `server.registerTool` 进行工具注册
  - 完整的工作示例
  - 质量检查清单

### 评估指南（在阶段 4 加载）
- [评估指南](./reference/evaluation.md) - 完整的评估创建指南，包括：
  - 问题创建指南
  - 答案验证策略
  - XML 格式规范
  - 示例问题和答案
  - 使用提供的脚本运行评估

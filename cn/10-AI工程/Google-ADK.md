> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：E-AI与Agent

# Google ADK Python 技能

Google Agent Development Kit（ADK）Python 版是一个开源的、代码优先的工具包，用于构建、评估和部署 AI Agent。

## 适用场景

- 构建具有工具集成和编排能力的 AI Agent
- 创建具有层级协调的多 Agent 系统
- 实现工作流 Agent（顺序、并行、循环）用于可预测的流水线
- 将 LLM 驱动的 Agent 与 Google Search、Code Execution 或自定义工具集成
- 将 Agent 部署到 Vertex AI Agent Engine、Cloud Run 或自定义基础设施
- 系统性地评估和测试 Agent 性能
- 实现人机协作（Human-in-the-Loop）的工具执行审批流程

## 核心概念

### Agent 类型

**LlmAgent**：LLM 驱动的 Agent，能够进行动态路由和自适应行为
- 通过 name、model、instruction、description 和 tools 定义
- 支持子 Agent 用于委派和协调
- 基于上下文的智能决策

**工作流 Agent（Workflow Agents）**：结构化、可预测的编排模式
- **SequentialAgent**：按定义顺序执行 Agent
- **ParallelAgent**：并发运行多个 Agent
- **LoopAgent**：带迭代逻辑的重复执行

**BaseAgent**：自定义 Agent 实现的基础类

### 关键组件

**工具生态系统（Tools Ecosystem）**：
- 预构建工具（google_search、code_execution）
- 将自定义 Python 函数作为工具
- OpenAPI 规范集成
- 工具确认流程用于人工审批

**多 Agent 架构**：
- 层级式 Agent 组合
- 针对特定领域的专业化 Agent
- 协调器 Agent 用于任务委派

## 安装

```bash
# 稳定版本（推荐）
pip install google-adk

# 开发版本（最新功能）
pip install git+https://github.com/google/adk-python.git@main
```

## 实现模式

### 带工具的单 Agent

```python
from google.adk.agents import LlmAgent
from google.adk.tools import google_search

agent = LlmAgent(
    name="search_assistant",
    model="gemini-2.5-flash",
    instruction="你是一个有帮助的助手，使用网络搜索来查找信息。",
    description="用于网络查询的搜索助手",
    tools=[google_search]
)
```

### 多 Agent 系统

```python
from google.adk.agents import LlmAgent

# 专业化 Agent
researcher = LlmAgent(
    name="Researcher",
    model="gemini-2.5-flash",
    instruction="使用网络搜索深入研究主题。",
    tools=[google_search]
)

writer = LlmAgent(
    name="Writer",
    model="gemini-2.5-flash",
    instruction="基于研究内容撰写清晰、引人入胜的内容。",
)

# 协调器 Agent
coordinator = LlmAgent(
    name="Coordinator",
    model="gemini-2.5-flash",
    instruction="将任务委派给研究员和作者 Agent。",
    sub_agents=[researcher, writer]
)
```

### 自定义工具创建

```python
from google.adk.tools import Tool

def calculate_sum(a: int, b: int) -> int:
    """计算两个数字的和。"""
    return a + b

# 将函数转换为工具
sum_tool = Tool.from_function(calculate_sum)

agent = LlmAgent(
    name="calculator",
    model="gemini-2.5-flash",
    tools=[sum_tool]
)
```

### 顺序工作流

```python
from google.adk.agents import SequentialAgent

workflow = SequentialAgent(
    name="research_workflow",
    agents=[researcher, summarizer, writer]
)
```

### 并行工作流

```python
from google.adk.agents import ParallelAgent

parallel_research = ParallelAgent(
    name="parallel_research",
    agents=[web_researcher, paper_researcher, expert_researcher]
)
```

### 人机协作（Human-in-the-Loop）

```python
from google.adk.tools import google_search

# 需要确认的工具
agent = LlmAgent(
    name="careful_searcher",
    model="gemini-2.5-flash",
    tools=[google_search],
    tool_confirmation=True  # 执行前需要审批
)
```

## 部署选项

### Cloud Run 部署

```bash
# 容器化 Agent
docker build -t my-agent .

# 部署到 Cloud Run
gcloud run deploy my-agent --image my-agent
```

### Vertex AI Agent Engine

```python
# 部署到 Vertex AI 以实现可扩展的 Agent 托管
# 与 Google Cloud 的托管基础设施集成
```

### 自定义基础设施

```python
# 在本地或自定义服务器上运行 Agent
# 完全控制部署环境
```

## 模型支持

**针对 Gemini 优化**：
- gemini-2.5-flash
- gemini-2.5-pro
- gemini-1.5-flash
- gemini-1.5-pro

**模型无关性**：虽然针对 Gemini 优化，但 ADK 通过标准 API 支持其他 LLM 提供商。

## 最佳实践

1. **代码优先理念**：在 Python 中定义 Agent 以便于版本控制、测试和灵活性
2. **模块化设计**：为特定领域创建专业化 Agent，组合成系统
3. **工具集成**：利用预构建工具，用自定义函数扩展
4. **评估**：基于测试用例系统性地测试 Agent
5. **安全性**：为敏感操作实施确认流程
6. **层级结构**：对复杂的多 Agent 工作流使用协调器 Agent
7. **工作流选择**：对可预测流水线使用工作流 Agent，对动态路由使用 LLM Agent

## 常见用例

- **研究助手**：网络搜索 + 摘要 + 报告生成
- **代码助手**：代码执行 + 文档 + 调试
- **客户支持**：查询路由 + 知识库 + 升级
- **内容创作**：研究 + 写作 + 编辑流水线
- **数据分析**：数据获取 + 处理 + 可视化
- **任务自动化**：带条件逻辑的多步骤工作流

## 开发界面

ADK 内置界面用于：
- 交互式测试 Agent 行为
- 调试工具调用和响应
- 评估 Agent 性能
- 迭代 Agent 设计

## 资源

- GitHub：https://github.com/google/adk-python
- 文档：https://google.github.io/adk-docs/
- llms.txt：https://raw.githubusercontent.com/google/adk-python/refs/heads/main/llms.txt

## 实现工作流

实现基于 ADK 的 Agent 时：

1. **定义需求**：识别 Agent 能力和所需工具
2. **选择架构**：单 Agent、多 Agent 或基于工作流
3. **选择工具**：预构建工具、自定义函数或 OpenAPI 集成
4. **实现 Agent**：创建包含指令和工具的 Agent 定义
5. **本地测试**：使用开发界面进行迭代
6. **添加评估**：创建测试用例进行系统验证
7. **部署**：选择 Cloud Run、Vertex AI 或自定义基础设施
8. **监控**：跟踪 Agent 性能并进行迭代

请记住：ADK 将 Agent 开发视为传统软件工程 —— 使用版本控制、编写测试并遵循工程最佳实践。

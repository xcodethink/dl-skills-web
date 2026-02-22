> 来源：[ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 分类：开发与工具

# LangSmith 数据获取 - Agent 调试技能

通过直接在终端中从 LangSmith Studio 获取执行追踪（Trace），调试 LangChain 和 LangGraph Agent（智能体）。适用于调试 Agent 行为、调查错误、分析工具调用、检查内存操作或检查 Agent 性能。自动获取最近的追踪并分析执行模式。需要安装 langsmith-fetch CLI 工具。

## 何时使用此技能

当用户提到以下内容时自动激活：
- "调试我的 Agent" 或 "出了什么问题？"
- "显示最近的追踪" 或 "发生了什么？"
- "检查错误" 或 "为什么失败了？"
- "分析内存操作" 或 "检查 LTM（长期记忆）"
- "查看 Agent 性能" 或 "检查 Token 使用量"
- "调用了哪些工具？" 或 "显示执行流程"

## 前置要求

### 1. 安装 langsmith-fetch
```bash
pip install langsmith-fetch
```

### 2. 设置环境变量
```bash
export LANGSMITH_API_KEY="your_langsmith_api_key"
export LANGSMITH_PROJECT="your_project_name"
```

**验证配置：**
```bash
echo $LANGSMITH_API_KEY
echo $LANGSMITH_PROJECT
```

## 核心工作流

### 工作流一：快速调试最近活动

**当用户询问：** "刚才发生了什么？" 或 "调试我的 Agent"

**执行：**
```bash
langsmith-fetch traces --last-n-minutes 5 --limit 5 --format pretty
```

**分析并报告：**
1. 找到的追踪数量
2. 任何错误或失败
3. 被调用的工具
4. 执行时间
5. Token 使用量

**示例响应格式：**
```
在最近 5 分钟内找到 3 条追踪：

追踪 1：成功
- Agent：memento
- 工具：recall_memories, create_entities
- 耗时：2.3 秒
- Token：1,245

追踪 2：错误
- Agent：cypher
- 错误："Neo4j 连接超时"
- 耗时：15.1 秒
- 失败位置：search_nodes 工具

追踪 3：成功
- Agent：memento
- 工具：store_memory
- 耗时：1.8 秒
- Token：892

发现问题：追踪 2 因 Neo4j 超时失败。建议检查数据库连接。
```

---

### 工作流二：深入分析特定追踪

**当用户提供：** Trace ID 或说"调查那个错误"

**执行：**
```bash
langsmith-fetch trace <trace-id> --format json
```

**分析 JSON 并报告：**
1. Agent 试图做什么
2. 调用了哪些工具（按顺序）
3. 工具结果（成功/失败）
4. 错误消息（如有）
5. 根因分析
6. 建议修复方案

**示例响应格式：**
```
深入分析 - 追踪 abc123

目标：用户询问"查找 Neo4j 中的所有项目"

执行流程：
1. search_nodes(query: "projects") - 成功
   -> 找到 24 个节点

2. get_node_details(node_id: "proj_123") - 错误
   -> 错误："节点未找到"
   -> 这是失败点

3. 执行停止

根因：
search_nodes 工具返回了数据库中已不存在的节点 ID，
可能是由于最近的删除操作导致。

建议修复：
1. 在 get_node_details 工具中添加错误处理
2. 在搜索结果中过滤已删除的节点
3. 更新缓存失效策略

Token 使用量：1,842 Token ($0.0276)
执行时间：8.7 秒
```

---

### 工作流三：导出调试会话

**当用户说：** "保存这个会话" 或 "导出追踪"

**执行：**
```bash
# 创建带时间戳的会话文件夹
SESSION_DIR="langsmith-debug/session-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$SESSION_DIR"

# 导出追踪
langsmith-fetch traces "$SESSION_DIR/traces" --last-n-minutes 30 --limit 50 --include-metadata

# 导出线程（对话）
langsmith-fetch threads "$SESSION_DIR/threads" --limit 20
```

**报告：**
```
会话导出成功！

位置：langsmith-debug/session-20251224-143022/
- 追踪：42 个文件
- 线程：8 个文件

后续操作：
1. 查看单个追踪文件
2. 与团队分享文件夹
3. 使用外部工具分析
4. 归档以备后续参考

会话大小：2.3 MB
```

---

### 工作流四：错误检测

**当用户询问：** "显示错误" 或 "哪些在失败？"

**执行：**
```bash
# 获取最近的追踪
langsmith-fetch traces --last-n-minutes 30 --limit 50 --format json > recent-traces.json

# 搜索错误
grep -i "error\|failed\|exception" recent-traces.json
```

**分析并报告：**
1. 发现的错误总数
2. 错误类型和频率
3. 错误发生时间
4. 哪些 Agent/工具失败
5. 常见模式

**示例响应格式：**
```
错误分析 - 最近 30 分钟

总追踪数：50
失败追踪数：7（14% 失败率）

错误明细：
1. Neo4j 连接超时（4 次）
   - Agent：cypher
   - 工具：search_nodes
   - 首次发生：14:32
   - 最后发生：14:45
   - 模式：在高峰负载时发生

2. 内存存储失败（2 次）
   - Agent：memento
   - 工具：store_memory
   - 错误："Pinecone 速率限制超出"
   - 发生时间：14:38、14:41

3. 工具未找到（1 次）
   - Agent：sqlcrm
   - 尝试调用的工具："export_report"（不存在）
   - 发生时间：14:35

建议：
1. 为 Neo4j 超时添加重试逻辑
2. 为 Pinecone 实现速率限制
3. 修复 sqlcrm 工具配置
```

---

## 常见用例

### 用例一："Agent 没有响应"

**用户说：** "我的 Agent 什么都没做"

**步骤：**
1. 检查是否存在追踪：
   ```bash
   langsmith-fetch traces --last-n-minutes 5 --limit 5
   ```

2. **如果没有找到追踪：**
   - 追踪可能被禁用
   - 检查：环境中是否设置了 `LANGCHAIN_TRACING_V2=true`
   - 检查：`LANGCHAIN_API_KEY` 是否已设置
   - 验证 Agent 是否确实运行了

3. **如果找到追踪：**
   - 检查是否有错误
   - 检查执行时间（是否挂起？）
   - 验证工具调用是否完成

---

### 用例二："调用了错误的工具"

**用户说：** "为什么它用了错误的工具？"

**步骤：**
1. 获取特定的追踪
2. 查看执行时可用的工具
3. 检查 Agent 选择工具的推理过程
4. 检查工具描述/指令
5. 建议提示词（Prompt）或工具配置的改进方案

---

### 用例三："内存不工作"

**用户说：** "Agent 不记得东西"

**步骤：**
1. 搜索内存操作：
   ```bash
   langsmith-fetch traces --last-n-minutes 10 --limit 20 --format raw | grep -i "memory\|recall\|store"
   ```

2. 检查：
   - 是否调用了内存工具？
   - 回忆（Recall）是否返回了结果？
   - 记忆是否实际被存储？
   - 检索到的记忆是否被使用？

---

### 用例四："性能问题"

**用户说：** "Agent 太慢了"

**步骤：**
1. 带元数据导出：
   ```bash
   langsmith-fetch traces ./perf-analysis --last-n-minutes 30 --limit 50 --include-metadata
   ```

2. 分析：
   - 每条追踪的执行时间
   - 工具调用延迟
   - Token 使用量（上下文大小）
   - 迭代次数
   - 最慢的操作

3. 识别瓶颈并建议优化方案

---

## 输出格式指南

### Pretty 格式（默认）
```bash
langsmith-fetch traces --limit 5 --format pretty
```
**适用于：** 快速目视检查、向用户展示

### JSON 格式
```bash
langsmith-fetch traces --limit 5 --format json
```
**适用于：** 详细分析、语法高亮查看

### Raw 格式
```bash
langsmith-fetch traces --limit 5 --format raw
```
**适用于：** 管道传输到其他命令、自动化

---

## 高级功能

### 基于时间的过滤
```bash
# 特定时间戳之后
langsmith-fetch traces --after "2025-12-24T13:00:00Z" --limit 20

# 最近 N 分钟（最常用）
langsmith-fetch traces --last-n-minutes 60 --limit 100
```

### 包含元数据
```bash
# 获取额外上下文
langsmith-fetch traces --limit 10 --include-metadata

# 元数据包括：Agent 类型、模型、标签、环境
```

### 并发获取（更快）
```bash
# 加速大量导出
langsmith-fetch traces ./output --limit 100 --concurrent 10
```

---

## 故障排除

### "没有找到匹配条件的追踪"

**可能原因：**
1. 该时间范围内没有 Agent 活动
2. 追踪被禁用
3. 项目名称错误
4. API 密钥问题

**解决方案：**
```bash
# 1. 尝试更长的时间范围
langsmith-fetch traces --last-n-minutes 1440 --limit 50

# 2. 检查环境变量
echo $LANGSMITH_API_KEY
echo $LANGSMITH_PROJECT

# 3. 尝试获取线程
langsmith-fetch threads --limit 10

# 4. 验证代码中是否启用了追踪
# 检查：LANGCHAIN_TRACING_V2=true
```

### "项目未找到"

**解决方案：**
```bash
# 查看当前配置
langsmith-fetch config show

# 设置正确的项目
export LANGSMITH_PROJECT="correct-project-name"

# 或永久配置
langsmith-fetch config set project "your-project-name"
```

### 环境变量未持久化

**解决方案：**
```bash
# 添加到 Shell 配置文件（~/.bashrc 或 ~/.zshrc）
echo 'export LANGSMITH_API_KEY="your_key"' >> ~/.bashrc
echo 'export LANGSMITH_PROJECT="your_project"' >> ~/.bashrc

# 重新加载 Shell 配置
source ~/.bashrc
```

---

## 最佳实践

### 1. 定期健康检查
```bash
# 做完更改后快速检查
langsmith-fetch traces --last-n-minutes 5 --limit 5
```

### 2. 有组织的存储
```
langsmith-debug/
├── sessions/
│   ├── 2025-12-24/
│   └── 2025-12-25/
├── error-cases/
└── performance-tests/
```

### 3. 记录发现
发现 Bug 时：
1. 导出有问题的追踪
2. 保存到 `error-cases/` 文件夹
3. 在 README 中记录问题原因
4. 与团队分享 Trace ID

### 4. 与开发流程集成
```bash
# 提交代码前
langsmith-fetch traces --last-n-minutes 10 --limit 5

# 如果发现错误
langsmith-fetch trace <error-id> --format json > pre-commit-error.json
```

---

## 快速参考

```bash
# 最常用命令

# 快速调试
langsmith-fetch traces --last-n-minutes 5 --limit 5 --format pretty

# 特定追踪
langsmith-fetch trace <trace-id> --format pretty

# 导出会话
langsmith-fetch traces ./debug-session --last-n-minutes 30 --limit 50

# 查找错误
langsmith-fetch traces --last-n-minutes 30 --limit 50 --format raw | grep -i error

# 带元数据
langsmith-fetch traces --limit 10 --include-metadata
```

---

## 相关资源

- **LangSmith Fetch CLI：** https://github.com/langchain-ai/langsmith-fetch
- **LangSmith Studio：** https://smith.langchain.com/
- **LangChain 文档：** https://docs.langchain.com/
- **此技能仓库：** https://github.com/OthmanAdi/langsmith-fetch-skill

---

## Claude 使用说明

- 运行命令前务必检查 `langsmith-fetch` 是否已安装
- 验证环境变量是否已设置
- 使用 `--format pretty` 获取人类可读的输出
- 需要解析和分析数据时使用 `--format json`
- 导出会话时创建有组织的文件夹结构
- 始终提供清晰的分析和可操作的洞察
- 如果命令失败，帮助排查配置问题

---

**版本：** 0.1.0
**作者：** Ahmad Othman Ammar Adi
**许可证：** MIT
**仓库：** https://github.com/OthmanAdi/langsmith-fetch-skill

> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Agent 编排（Agent Orchestration）

## 概述

Agent 编排是将多个专业化 Agent 按照特定工作流串联或并行执行的高级模式。通过 `/orchestrate` 命令定义工作流类型，结合 Agent 规则中的编排指南，实现复杂任务的自动化流水线处理，每个 Agent 之间通过结构化的交接文档传递上下文。

---

## 第一部分：编排命令（/orchestrate）

### 用法

```
/orchestrate [workflow-type] [task-description]
```

### 工作流类型

#### feature（功能开发）

完整的功能实现工作流：

```
planner -> tdd-guide -> code-reviewer -> security-reviewer
（规划师 -> TDD 指导 -> 代码评审 -> 安全评审）
```

#### bugfix（缺陷修复）

缺陷调查和修复工作流：

```
planner -> tdd-guide -> code-reviewer
（规划师 -> TDD 指导 -> 代码评审）
```

#### refactor（重构）

安全的重构工作流：

```
architect -> code-reviewer -> tdd-guide
（架构师 -> 代码评审 -> TDD 指导）
```

#### security（安全审查）

以安全为重点的审查工作流：

```
security-reviewer -> code-reviewer -> architect
（安全评审 -> 代码评审 -> 架构师）
```

### 执行模式

对于工作流中的每个 Agent：

1. **调用 Agent** — 传入前一个 Agent 的上下文
2. **收集输出** — 生成结构化的交接文档（Handoff Document）
3. **传递给下一个 Agent** — 按链式传递
4. **汇总结果** — 生成最终报告

### 交接文档格式

Agent 之间的交接文档格式：

```markdown
## 交接：[前一 Agent] -> [下一 Agent]

### 上下文
[已完成工作的摘要]

### 发现
[关键发现或决策]

### 修改的文件
[涉及的文件列表]

### 未解决的问题
[留给下一个 Agent 的未决事项]

### 建议
[建议的后续步骤]
```

### 使用示例：功能开发工作流

```
/orchestrate feature "添加用户认证"
```

执行过程：

1. **规划师 Agent（Planner Agent）**
   - 分析需求
   - 创建实施计划
   - 识别依赖关系
   - 输出：`交接：planner -> tdd-guide`

2. **TDD 指导 Agent（TDD Guide Agent）**
   - 读取规划师的交接文档
   - 先编写测试
   - 实现代码使测试通过
   - 输出：`交接：tdd-guide -> code-reviewer`

3. **代码评审 Agent（Code Reviewer Agent）**
   - 审查实现代码
   - 检查问题
   - 提出改进建议
   - 输出：`交接：code-reviewer -> security-reviewer`

4. **安全评审 Agent（Security Reviewer Agent）**
   - 安全审计
   - 漏洞检查
   - 最终批准
   - 输出：最终报告

### 最终报告格式

```
编排报告
====================
工作流：feature
任务：添加用户认证
Agent 链：planner -> tdd-guide -> code-reviewer -> security-reviewer

摘要
-------
[一段话总结]

Agent 输出
-------------
规划师：[摘要]
TDD 指导：[摘要]
代码评审：[摘要]
安全评审：[摘要]

变更文件
-------------
[所有修改文件列表]

测试结果
------------
[测试通过/失败摘要]

安全状态
---------------
[安全发现]

建议
--------------
[可发布 / 需要返工 / 被阻塞]
```

### 并行执行

对于独立的检查任务，可以并行运行 Agent：

```markdown
### 并行阶段
同时运行：
- code-reviewer（质量检查）
- security-reviewer（安全检查）
- architect（设计检查）

### 合并结果
将各输出合并为一份报告
```

### 命令参数

- `feature <description>` — 完整功能工作流
- `bugfix <description>` — 缺陷修复工作流
- `refactor <description>` — 重构工作流
- `security <description>` — 安全审查工作流
- `custom <agents> <description>` — 自定义 Agent 序列

### 自定义工作流示例

```
/orchestrate custom "architect,tdd-guide,code-reviewer" "重新设计缓存层"
```

### 编排技巧

1. **复杂功能先用规划师** — 先规划再执行
2. **合并前始终包含代码评审** — 质量关口
3. **涉及认证/支付/PII 时使用安全评审** — 安全关口
4. **保持交接文档简洁** — 聚焦下一个 Agent 需要的信息
5. **必要时在 Agent 之间运行验证** — 确保中间状态正确

---

## 第二部分：Agent 编排规则

### 可用 Agent 列表

位于 `~/.claude/agents/`：

| Agent | 用途 | 使用场景 |
|-------|------|----------|
| planner（规划师） | 实施规划 | 复杂功能、重构 |
| architect（架构师） | 系统设计 | 架构决策 |
| tdd-guide（TDD 指导） | 测试驱动开发 | 新功能、缺陷修复 |
| code-reviewer（代码评审） | 代码审查 | 编写代码之后 |
| security-reviewer（安全评审） | 安全分析 | 提交之前 |
| build-error-resolver（构建错误解决器） | 修复构建错误 | 构建失败时 |
| e2e-runner（端到端测试运行器） | 端到端测试 | 关键用户流程 |
| refactor-cleaner（重构清理器） | 死代码清理 | 代码维护 |
| doc-updater（文档更新器） | 文档维护 | 更新文档 |

### 即时 Agent 调用（无需用户提示）

以下场景无需用户提示即可调用：

1. 复杂功能请求 — 使用 **planner** Agent
2. 刚编写/修改了代码 — 使用 **code-reviewer** Agent
3. 缺陷修复或新功能 — 使用 **tdd-guide** Agent
4. 架构决策 — 使用 **architect** Agent

### 并行任务执行

对于独立操作，**始终**使用并行 Task 执行：

```markdown
# 正确做法：并行执行
同时启动 3 个 Agent：
1. Agent 1：认证模块安全分析
2. Agent 2：缓存系统性能审查
3. Agent 3：工具类类型检查

# 错误做法：不必要的串行执行
先运行 Agent 1，然后 Agent 2，然后 Agent 3
```

### 多视角分析（Multi-Perspective Analysis）

对于复杂问题，使用分角色子 Agent：

- **事实审查员（Factual Reviewer）** — 验证事实准确性
- **高级工程师（Senior Engineer）** — 工程质量把关
- **安全专家（Security Expert）** — 安全风险评估
- **一致性审查员（Consistency Reviewer）** — 确保代码/风格一致
- **冗余检查员（Redundancy Checker）** — 发现重复和冗余

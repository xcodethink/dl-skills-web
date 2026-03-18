> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Claude Code 长篇指南

## 概述

Claude Code 高级使用技巧长篇指南，涵盖 Token 经济学、记忆持久化、验证模式、并行化策略以及构建可复用工作流的复合效应。本指南是在短篇指南基础之上的进阶内容，适合已完成基础配置的用户。

> **前提条件**：本指南建立在《Claude Code 短篇指南》之上。如果尚未配置技能（Skills）、钩子（Hooks）、子代理（Subagents）、MCP 和插件（Plugins），请先阅读短篇指南。

---

## 技巧与窍门

### 部分 MCP 可被替代，从而释放上下文窗口

对于版本控制（GitHub）、数据库（Supabase）、部署（Vercel、Railway）等 MCP — 大多数平台已经拥有完善的 CLI，MCP 本质上只是对它们的封装。MCP 是一层便利的包装，但它会占用上下文窗口。

要让 CLI 像 MCP 一样运作而不实际使用 MCP（从而避免上下文窗口缩减），可以将功能封装到技能和命令中。将 MCP 暴露的便捷工具（Tools）提取出来，转化为命令（Commands）。

**示例**：不必始终加载 GitHub MCP，而是创建一个 `/gh-pr` 命令来封装 `gh pr create` 及你偏好的选项。不必让 Supabase MCP 消耗上下文，而是创建直接使用 Supabase CLI 的技能。

有了延迟加载（Lazy Loading），上下文窗口问题基本解决了。但 Token 用量和成本问题并没有以同样方式解决。CLI + 技能的方法仍然是一种 Token 优化方式。

---

## 重要内容

### 上下文与记忆管理

**跨会话记忆共享**：创建一个技能或命令来总结和检查进度，将内容保存到 `.claude` 文件夹中的 `.tmp` 文件，在会话期间持续追加。第二天可以用它作为上下文继续工作。每个会话创建新文件，避免旧上下文污染新工作。

Claude 创建一个总结当前状态的文件。检查它，如需修改则提出修改要求，然后重新开始。对于新对话，只需提供该文件路径即可。这在达到上下文限制且需要继续复杂工作时尤其有用。这些文件应包含：
- 哪些方法有效（有证据验证）
- 哪些方法已尝试但未奏效
- 哪些方法尚未尝试，还有什么待完成

**策略性清除上下文**：

计划制定好且上下文清除后（Claude Code 中计划模式的默认选项），你可以从计划出发工作。当你积累了大量不再与执行相关的探索性上下文时，这很有用。对于策略性压缩（Strategic Compacting），禁用自动压缩，在逻辑间隔点手动压缩，或创建一个专门的技能来执行此操作。

**高级技巧：动态系统提示注入**

一个实用的模式：不是把所有内容都放在 CLAUDE.md（用户级别）或 `.claude/rules/`（项目级别）中（这些内容每次会话都会加载），而是使用 CLI 标志动态注入上下文。

```bash
claude --system-prompt "$(cat memory.md)"
```

这让你能更精确地控制何时加载什么上下文。系统提示（System Prompt）的内容优先级高于用户消息，用户消息优先级高于工具结果。

**实际设置**：

```bash
# 日常开发
alias claude-dev='claude --system-prompt "$(cat ~/.claude/contexts/dev.md)"'

# PR 审查模式
alias claude-review='claude --system-prompt "$(cat ~/.claude/contexts/review.md)"'

# 研究/探索模式
alias claude-research='claude --system-prompt "$(cat ~/.claude/contexts/research.md)"'
```

**高级技巧：记忆持久化钩子（Memory Persistence Hooks）**

大多数人不知道的、有助于记忆持久化的钩子：

- **PreCompact 钩子**：在上下文压缩发生之前，将重要状态保存到文件
- **Stop 钩子（会话结束时）**：会话结束时，将学到的内容持久化到文件
- **SessionStart 钩子**：新会话开始时，自动加载之前的上下文

---

### 持续学习 / 记忆

如果你不得不多次重复同一提示（Prompt），而 Claude 遇到了相同的问题或给出了你之前听过的回答 — 这些模式必须追加到技能中。

**问题**：浪费 Token、浪费上下文、浪费时间。

**解决方案**：当 Claude Code 发现一些非平凡的东西 — 调试技巧、变通方法、项目特定模式 — 它将该知识保存为新技能。下次遇到类似问题时，技能会自动加载。

**为什么使用 Stop 钩子（而非 UserPromptSubmit）**：

关键设计决策是使用 **Stop 钩子**而非 UserPromptSubmit。UserPromptSubmit 在每条消息上都会运行 — 给每个提示增加延迟。Stop 只在会话结束时运行一次 — 轻量级，不会在会话期间拖慢速度。

---

### Token 优化

**首要策略：子代理架构**

优化你使用的工具和子代理架构，设计为将任务委派给足以胜任的最便宜模型。

**模型选择快速参考**：

| 任务类型 | 模型 | 原因 |
|---------|------|------|
| 探索/搜索 | Haiku | 快速、便宜，查找文件足够用 |
| 简单编辑 | Haiku | 单文件变更，指令明确 |
| 多文件实现 | Sonnet | 编码任务的最佳平衡 |
| 复杂架构 | Opus | 需要深度推理 |
| PR 审查 | Sonnet | 理解上下文，捕捉细微之处 |
| 安全分析 | Opus | 不能遗漏漏洞 |
| 编写文档 | Haiku | 结构简单 |
| 调试复杂 Bug | Opus | 需要在脑中保持整个系统 |

90% 的编码任务默认使用 Sonnet。以下情况升级到 Opus：首次尝试失败、任务跨 5+ 个文件、架构决策或安全关键代码。

**工具级优化**：

用 mgrep 替换 grep — 与传统 grep 或 ripgrep 相比，平均减少约 50% 的 Token 消耗。

**模块化代码库的好处**：

拥有更模块化的代码库，主要文件在数百行而非数千行，有助于降低 Token 优化成本，也有助于首次就正确完成任务。

---

### 验证循环与评估（Verification Loops and Evals）

**基准测试工作流**：

对比有技能和无技能时请求同一件事的输出差异：

分叉对话（Fork），在其中一个分支创建不含该技能的新工作树（Worktree），最后对比差异，查看日志记录。

**评估模式类型**：

- **检查点式评估（Checkpoint-Based Evals）**：设置显式检查点，按照定义的标准验证，修复后再继续
- **持续评估（Continuous Evals）**：每 N 分钟或在重大变更后运行，完整测试套件 + 代码检查

**关键指标**：

```
pass@k：k 次尝试中至少一次成功
        k=1: 70%  k=3: 91%  k=5: 97%

pass^k：k 次尝试必须全部成功
        k=1: 70%  k=3: 34%  k=5: 17%
```

当你只需要它能工作时用 **pass@k**。当一致性至关重要时用 **pass^k**。

---

## 并行化

分叉对话在多 Claude 终端设置中运行时，确保分叉和原始对话中的操作范围定义明确。代码变更的重叠应尽量最小化。

**推荐模式**：

主聊天用于代码变更，分叉用于关于代码库及其当前状态的问题，或对外部服务的研究。

**关于任意终端数量**：

Boris（Anthropic）建议过同时运行 5 个本地和 5 个远程 Claude 实例。但不建议设置任意终端数量。增加终端应出于真正的需要。

你的目标应该是：**用最少的并行化完成尽可能多的工作。**

**用 Git 工作树（Worktrees）运行并行实例**：

```bash
# 为并行工作创建工作树
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b
git worktree add ../project-refactor refactor-branch

# 每个工作树运行自己的 Claude 实例
cd ../project-feature-a && claude
```

如果你要开始扩展实例，且有多个 Claude 实例在相互重叠的代码上工作，那么使用 Git 工作树并为每个实例制定明确的计划至关重要。使用 `/rename <名称>` 为所有聊天命名。

**级联方法（The Cascade Method）**：

运行多个 Claude Code 实例时，使用"级联"模式组织：

- 在右侧新标签页中打开新任务
- 从左到右扫过，从旧到新
- 同时关注最多 3-4 个任务

---

## 基础工作

**两实例启动模式**：

对于工作流管理，我喜欢用 2 个打开的 Claude 实例启动一个空仓库。

**实例 1：脚手架代理（Scaffolding Agent）**
- 搭建脚手架和基础工作
- 创建项目结构
- 设置配置文件（CLAUDE.md、规则、代理）

**实例 2：深度研究代理（Deep Research Agent）**
- 连接所有服务、网络搜索
- 创建详细的产品需求文档（PRD）
- 创建架构 Mermaid 图
- 整理包含实际文档片段的参考资料

**llms.txt 模式**：

如果可用，你可以在许多文档参考页面找到 `llms.txt`，方法是在文档页面的 URL 后加上 `/llms.txt`。这提供了干净的、LLM 优化版本的文档。

**理念：构建可复用模式**

来自 @omarsar0："早期，我花时间构建可复用的工作流/模式。构建过程繁琐，但随着模型和代理框架的改进，这产生了疯狂的复合效应。"

**值得投资的领域**：

- 子代理（Subagents）
- 技能（Skills）
- 命令（Commands）
- 规划模式（Planning Patterns）
- MCP 工具
- 上下文工程模式（Context Engineering Patterns）

---

## 代理与子代理的最佳实践

**子代理上下文问题**：

子代理存在的意义是通过返回摘要而非倾倒全部内容来节省上下文。但编排器（Orchestrator）拥有子代理所缺乏的语义上下文。子代理只知道字面查询，不了解请求背后的*目的*。

**迭代检索模式（Iterative Retrieval Pattern）**：

1. 编排器评估每个子代理的返回结果
2. 在接受之前提出跟进问题
3. 子代理回到源头获取答案，返回结果
4. 循环直到充分（最多 3 个周期）

**关键**：传递目标上下文，而不仅仅是查询。

**编排器的顺序阶段**：

```markdown
阶段 1：研究（使用 Explore 代理）→ research-summary.md
阶段 2：计划（使用 planner 代理）→ plan.md
阶段 3：实现（使用 tdd-guide 代理）→ 代码变更
阶段 4：审查（使用 code-reviewer 代理）→ review-comments.md
阶段 5：验证（必要时使用 build-error-resolver）→ 完成或回到上一阶段
```

**关键规则**：

1. 每个代理获得**一个**明确的输入，产出**一个**明确的输出
2. 前一阶段的输出成为下一阶段的输入
3. 不要跳过阶段
4. 代理之间使用 `/clear` 清除上下文
5. 将中间输出存储到文件中

---

## 有趣的非关键小技巧

### 自定义状态栏

使用 `/statusline` 设置 — Claude 会告诉你当前没有状态栏，但可以帮你设置，并询问你想在其中显示什么内容。

### 语音转录

用语音与 Claude Code 交互。对很多人来说比打字更快。

- macOS 上使用 superwhisper 或 MacWhisper
- 即使存在转录错误，Claude 也能理解意图

### 终端别名

```bash
alias c='claude'
alias gb='github'
alias co='code'
alias q='cd ~/Desktop/projects'
```

---

## 资源

**代理编排**：
- https://github.com/ruvnet/claude-flow — 企业级编排平台，含 54+ 个专业代理

**自改进记忆**：
- https://github.com/affaan-m/everything-claude-code/tree/main/skills/continuous-learning
- rlancemartin.github.io/2025/12/01/claude_diary/ — 会话反思模式

**系统提示参考**：
- https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools — 系统提示集合（110k 星标）

**官方资源**：
- Anthropic Academy: anthropic.skilljar.com

---

## 参考资料

- [Anthropic: 揭开 AI 代理评估的神秘面纱](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [YK: 32 个 Claude Code 技巧](https://agenticcoding.substack.com/p/32-claude-code-tips-from-basics-to)
- [RLanceMartin: 会话反思模式](https://rlancemartin.github.io/2025/12/01/claude_diary/)
- @PerceptualPeak：子代理上下文协商
- @menhguin：代理抽象层级列表
- @omarsar0：复合效应哲学

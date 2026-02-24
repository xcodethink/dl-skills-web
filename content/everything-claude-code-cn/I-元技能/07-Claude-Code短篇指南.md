> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Claude Code 短篇指南

## 概述

Claude Code 完整配置指南，涵盖技能（Skills）、钩子（Hooks）、子代理（Subagents）、MCP、插件（Plugins）及实际有效的使用技巧。这是基于 10 个月日常使用经验的速查参考，也是长篇指南的基础前提。

---

## 技能与命令（Skills and Commands）

技能像规则一样运作，限定在特定范围和工作流中。它们是执行特定工作流时提示词（Prompt）的简写。

长时间使用 Opus 4.5 编码后想清理死代码和松散的 .md 文件？运行 `/refactor-clean`。需要测试？`/tdd`、`/e2e`、`/test-coverage`。技能还可以包含代码地图（Codemap）— 一种让 Claude 快速导航代码库而不消耗上下文的方法。

命令是通过斜杠命令（Slash Command）执行的技能。它们有重叠，但存储方式不同：

- **技能**：`~/.claude/skills/` — 更广泛的工作流定义
- **命令**：`~/.claude/commands/` — 快速可执行的提示

```bash
# 技能结构示例
~/.claude/skills/
  pmx-guidelines.md      # 项目特定模式
  coding-standards.md    # 编程语言最佳实践
  tdd-workflow/          # 多文件技能，含 README.md
  security-review/       # 基于清单的技能
```

---

## 钩子（Hooks）

钩子是基于触发器的自动化，在特定事件发生时触发。与技能不同，它们限定在工具调用和生命周期事件上。

**钩子类型**：

1. **PreToolUse** — 工具执行前（验证、提醒）
2. **PostToolUse** — 工具完成后（格式化、反馈循环）
3. **UserPromptSubmit** — 当你发送消息时
4. **Stop** — 当 Claude 完成响应时
5. **PreCompact** — 上下文压缩前
6. **Notification** — 权限请求

**示例：长时间运行命令前的 tmux 提醒**

```json
{
  "PreToolUse": [
    {
      "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm|pnpm|yarn|cargo|pytest)\"",
      "hooks": [
        {
          "type": "command",
          "command": "if [ -z \"$TMUX\" ]; then echo '[钩子] 建议使用 tmux 保持会话持久' >&2; fi"
        }
      ]
    }
  ]
}
```

**小技巧**：使用 `hookify` 插件以对话方式创建钩子，而非手动编写 JSON。运行 `/hookify` 并描述你想要的功能。

---

## 子代理（Subagents）

子代理是编排器（主 Claude）可以将任务委派给的、具有有限范围的进程。它们可以在后台或前台运行，为主代理释放上下文。

子代理与技能配合良好 — 一个能够执行你部分技能子集的子代理可以被委派任务并自主使用这些技能。它们还可以通过特定工具权限进行沙箱隔离。

```bash
# 子代理结构示例
~/.claude/agents/
  planner.md           # 功能实现规划
  architect.md         # 系统设计决策
  tdd-guide.md         # 测试驱动开发
  code-reviewer.md     # 质量/安全审查
  security-reviewer.md # 漏洞分析
  build-error-resolver.md
  e2e-runner.md
  refactor-cleaner.md
```

为每个子代理配置允许的工具、MCP 和权限，实现适当的范围控制。

---

## 规则与记忆（Rules and Memory）

`.rules` 文件夹保存 Claude 应**始终**遵循的 `.md` 最佳实践文件。两种方式：

1. **单一 CLAUDE.md** — 所有内容在一个文件中（用户级或项目级）
2. **规则文件夹** — 按关注点分组的模块化 `.md` 文件

```bash
~/.claude/rules/
  security.md      # 不硬编码密钥，验证输入
  coding-style.md  # 不可变性，文件组织
  testing.md       # TDD 工作流，80% 覆盖率
  git-workflow.md  # 提交格式，PR 流程
  agents.md        # 何时委派给子代理
  performance.md   # 模型选择，上下文管理
```

**规则示例**：

- 代码库中禁止使用表情符号
- 前端避免使用紫色调
- 部署前始终测试代码
- 优先使用模块化代码，避免超大文件
- 永远不提交 console.log

---

## MCP（模型上下文协议）

MCP 将 Claude 直接连接到外部服务。它不是 API 的替代品 — 而是围绕 API 的提示驱动封装，允许更灵活地浏览信息。

**示例**：Supabase MCP 让 Claude 能够拉取特定数据、直接在上游运行 SQL，无需复制粘贴。数据库、部署平台等同理。

**关键：上下文窗口管理**

对 MCP 要精挑细选。我在用户配置中保留所有 MCP 但**禁用所有未使用的**。导航到 `/plugins` 向下滚动或运行 `/mcp`。

你 200k 的上下文窗口在压缩前，如果启用了太多工具，可能只有 70k。性能会显著下降。

**经验法则**：配置 20-30 个 MCP，但保持 10 个以内启用 / 80 个以内工具激活。

```bash
# 检查已启用的 MCP
/mcp

# 在 ~/.claude.json 的 projects.disabledMcpServers 中禁用未使用的
```

---

## 插件（Plugins）

插件将工具打包以便于安装，取代繁琐的手动配置。插件可以是技能 + MCP 的组合，或者钩子/工具的捆绑。

**安装插件**：

```bash
# 添加市场
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep

# 打开 Claude，运行 /plugins，找到新市场，从中安装
```

**LSP 插件**特别有用 — 如果你经常在编辑器外运行 Claude Code。语言服务器协议（LSP）为 Claude 提供实时类型检查、跳转到定义和智能补全，无需打开 IDE。

```bash
# 已启用插件示例
typescript-lsp@claude-plugins-official  # TypeScript 智能
pyright-lsp@claude-plugins-official     # Python 类型检查
hookify@claude-plugins-official         # 对话式创建钩子
mgrep@Mixedbread-Grep                   # 比 ripgrep 更好的搜索
```

MCP 同样的警告 — 注意上下文窗口。

---

## 技巧与窍门

### 快捷键

- `Ctrl+U` — 删除整行（比反复按退格键快）
- `!` — 快速 bash 命令前缀
- `@` — 搜索文件
- `/` — 发起斜杠命令
- `Shift+Enter` — 多行输入
- `Tab` — 切换思考显示
- `Esc Esc` — 中断 Claude / 恢复代码

### 并行工作流

- **分叉**（`/fork`）— 分叉对话以并行执行不重叠的任务，而非排队发送消息
- **Git 工作树（Worktrees）** — 用于有重叠的并行 Claude，避免冲突。每个工作树是独立的检出

```bash
git worktree add ../feature-branch feature-branch
# 在每个工作树中运行独立的 Claude 实例
```

### tmux 用于长时间运行的命令

流式查看和监控 Claude 运行的日志/bash 进程：

```bash
tmux new -s dev
# Claude 在此运行命令，你可以分离并重新连接
tmux attach -t dev
```

### mgrep > grep

`mgrep` 是对 ripgrep/grep 的显著改进。通过插件市场安装，然后使用 `/mgrep` 技能。支持本地搜索和网络搜索。

```bash
mgrep "function handleSubmit"  # 本地搜索
mgrep --web "Next.js 15 app router changes"  # 网络搜索
```

### 其他有用命令

- `/rewind` — 回到之前的状态
- `/statusline` — 自定义显示分支、上下文百分比、待办事项
- `/checkpoints` — 文件级撤销点
- `/compact` — 手动触发上下文压缩

### GitHub Actions CI/CD

通过 GitHub Actions 设置 PR 代码审查。Claude 可以在配置后自动审查 PR。

### 沙箱（Sandboxing）

对有风险的操作使用沙箱模式 — Claude 在受限环境中运行，不影响实际系统。

---

## 关于编辑器

编辑器选择显著影响 Claude Code 工作流。虽然 Claude Code 可以在任何终端中使用，但搭配一个强大的编辑器可以解锁实时文件跟踪、快速导航和集成命令执行。

### Zed（推荐）

[Zed](https://zed.dev) — 用 Rust 编写，真正快速。即时打开，流畅处理大型代码库，系统资源占用极低。

**Zed + Claude Code 是很好的组合**：

- **速度** — Rust 性能意味着 Claude 快速编辑文件时编辑器不会卡顿
- **代理面板集成** — Zed 的 Claude 集成让你实时跟踪 Claude 编辑的文件变更
- **CMD+Shift+R 命令面板** — 快速访问所有自定义斜杠命令、调试器、构建脚本
- **最少资源占用** — 不会在重度操作时与 Claude 争抢内存/CPU
- **Vim 模式** — 完整的 Vim 键绑定

### VSCode / Cursor

同样可行，与 Claude Code 配合良好。可以终端格式使用，通过 `\ide` 启用自动同步获取 LSP 功能。也可以选择扩展版本，与编辑器更紧密集成。

**编辑器通用技巧**：

1. **分屏** — 一侧终端运行 Claude Code，另一侧编辑器
2. **Ctrl+G** — 在 Zed 中快速打开 Claude 正在编辑的文件
3. **自动保存** — 启用自动保存确保 Claude 读取的文件始终是最新的
4. **Git 集成** — 使用编辑器的 Git 功能在提交前审查 Claude 的变更
5. **文件监视** — 大多数编辑器自动重载变更的文件，确认此功能已启用

---

## 核心要点

1. **不要过度复杂化** — 将配置视为微调，而非架构设计
2. **上下文窗口是宝贵的** — 禁用未使用的 MCP 和插件
3. **并行执行** — 分叉对话，使用 Git 工作树
4. **自动化重复工作** — 用钩子处理格式化、代码检查、提醒
5. **限定子代理范围** — 有限的工具 = 专注的执行

---

## 参考资料

- [插件参考](https://code.claude.com/docs/en/plugins-reference)
- [钩子文档](https://code.claude.com/docs/en/hooks)
- [检查点](https://code.claude.com/docs/en/checkpointing)
- [交互模式](https://code.claude.com/docs/en/interactive-mode)
- [记忆系统](https://code.claude.com/docs/en/memory)
- [子代理](https://code.claude.com/docs/en/sub-agents)
- [MCP 概述](https://code.claude.com/docs/en/mcp-overview)

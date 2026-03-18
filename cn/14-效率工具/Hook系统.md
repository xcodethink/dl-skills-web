> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Hook 系统

## 概述

Claude Code 的 Hook 系统提供了在工具执行前后、会话开始/结束时自动触发脚本的能力，用于代码格式化、安全检查、会话持久化等自动化工作流。本文整合了通用 Hook 规则、hooks.json 配置、Cursor IDE 适配指南以及各语言专属 Hook 配置。

## Hook 类型

- **PreToolUse**：工具执行前触发（验证、参数修改）
- **PostToolUse**：工具执行后触发（自动格式化、检查）
- **PreCompact**：上下文压缩前触发（保存状态）
- **SessionStart**：会话开始时触发（加载上下文、检测包管理器）
- **SessionEnd**：会话结束时触发（持久化状态、提取模式）
- **Stop**：会话停止时触发（最终验证）

## 自动接受权限（Auto-Accept Permissions）

使用时需谨慎：

- 仅在可信的、定义明确的计划中启用
- 在探索性工作中禁用
- 永远不要使用 `dangerously-skip-permissions` 标志
- 改为在 `~/.claude.json` 中配置 `allowedTools`

## TodoWrite 最佳实践

使用 TodoWrite 工具来：

- 跟踪多步骤任务的进度
- 验证对指令的理解
- 实现实时引导
- 展示细粒度的实现步骤

待办事项列表可以揭示：

- 步骤顺序错误
- 遗漏的项目
- 多余的不必要项目
- 粒度不合理
- 需求理解偏差

## hooks.json 配置详解

以下是完整的 Hook 配置示例，展示了各种触发时机和处理逻辑：

### PreToolUse Hook

#### 1. 阻止在 tmux 之外运行开发服务器

```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(process.platform!=='win32'&&/(npm run dev\\b|pnpm( run)? dev\\b|yarn dev\\b|bun run dev\\b)/.test(cmd)){console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');process.exit(2)}}catch{}console.log(d)})\""
    }
  ],
  "description": "阻止在 tmux 之外启动开发服务器 - 确保可以访问日志"
}
```

#### 2. 长时间运行命令的 tmux 提醒

```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "command": "// 检测 npm install/test、cargo build、docker、pytest 等长时间运行的命令"
    }
  ],
  "description": "提醒使用 tmux 管理长时间运行的命令"
}
```

#### 3. Git Push 前提醒

```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "command": "// 在执行 git push 前输出提醒信息"
    }
  ],
  "description": "在 git push 前提醒审查变更"
}
```

#### 4. 阻止随意创建文档文件

```json
{
  "matcher": "Write",
  "hooks": [
    {
      "type": "command",
      "command": "// 阻止创建非 README/CLAUDE/AGENTS/CONTRIBUTING 的 .md/.txt 文件"
    }
  ],
  "description": "阻止创建随机的 .md 文件 - 保持文档集中管理"
}
```

#### 5. 建议手动压缩（Compact）

```json
{
  "matcher": "Edit|Write",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
    }
  ],
  "description": "在逻辑间隔点建议手动压缩"
}
```

### PreCompact Hook

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
    }
  ],
  "description": "在上下文压缩前保存状态"
}
```

### SessionStart Hook

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
    }
  ],
  "description": "在新会话中加载之前的上下文并检测包管理器"
}
```

### PostToolUse Hook

#### 1. PR 创建后记录 URL

```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "command": "// 检测 gh pr create 命令输出，提取 PR URL 并提供审查命令"
    }
  ],
  "description": "在 PR 创建后记录 PR URL 并提供审查命令"
}
```

#### 2. 异步构建分析（后台运行不阻塞）

```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "command": "// 检测构建命令完成后异步运行分析",
      "async": true,
      "timeout": 30
    }
  ],
  "description": "异步 Hook 示例：构建完成后在后台运行分析（不阻塞主流程）"
}
```

#### 3. 编辑后自动格式化

```json
{
  "matcher": "Edit",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/post-edit-format.js\""
    }
  ],
  "description": "编辑后使用 Prettier 自动格式化 JS/TS 文件"
}
```

#### 4. TypeScript 类型检查

```json
{
  "matcher": "Edit",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/post-edit-typecheck.js\""
    }
  ],
  "description": "编辑 .ts/.tsx 文件后运行 TypeScript 检查"
}
```

#### 5. console.log 警告

```json
{
  "matcher": "Edit",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/post-edit-console-warn.js\""
    }
  ],
  "description": "编辑后警告 console.log 语句"
}
```

### Stop Hook

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/check-console-log.js\""
    }
  ],
  "description": "在每次响应后检查修改文件中的 console.log"
}
```

### SessionEnd Hook

```json
[
  {
    "matcher": "*",
    "hooks": [
      {
        "type": "command",
        "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
      }
    ],
    "description": "在会话结束时持久化状态"
  },
  {
    "matcher": "*",
    "hooks": [
      {
        "type": "command",
        "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
      }
    ],
    "description": "评估会话以提取可复用的模式"
  }
]
```

## 各语言专属 Hook 配置

### TypeScript / JavaScript

适用文件：`**/*.ts`、`**/*.tsx`、`**/*.js`、`**/*.jsx`

**PostToolUse Hook：**

在 `~/.claude/settings.json` 中配置：

- **Prettier**：编辑后自动格式化 JS/TS 文件
- **TypeScript 检查**：编辑 `.ts`/`.tsx` 文件后运行 `tsc`
- **console.log 警告**：警告编辑文件中的 `console.log`

**Stop Hook：**

- **console.log 审计**：在会话结束前检查所有修改文件中的 `console.log`

### Python

适用文件：`**/*.py`、`**/*.pyi`

**PostToolUse Hook：**

在 `~/.claude/settings.json` 中配置：

- **black/ruff**：编辑后自动格式化 `.py` 文件
- **mypy/pyright**：编辑 `.py` 文件后运行类型检查

**警告：**

- 警告编辑文件中的 `print()` 语句（建议使用 `logging` 模块替代）

### Go

适用文件：`**/*.go`、`**/go.mod`、`**/go.sum`

**PostToolUse Hook：**

在 `~/.claude/settings.json` 中配置：

- **gofmt/goimports**：编辑后自动格式化 `.go` 文件
- **go vet**：编辑 `.go` 文件后运行静态分析
- **staticcheck**：对修改的包运行扩展静态检查

## 附录：Cursor IDE 适配指南

Cursor 没有像 Claude Code 那样的原生 Hook 系统（PreToolUse/PostToolUse/Stop），但可以通过以下方式实现类似的自动化：

### 保存时格式化

配置编辑器设置，在保存时运行格式化工具：

- **TypeScript/JavaScript**：Prettier、ESLint 的 `--fix`
- **Python**：Black、Ruff
- **Go**：gofmt、goimports

### 代码检查集成（Linting Integration）

使用 Cursor 内置的代码检查支持：

- ESLint（TypeScript/JavaScript）
- Ruff/Flake8（Python）
- golangci-lint（Go）

### Pre-Commit Hook

使用 Git pre-commit hook（通过 `husky` 或 `pre-commit` 等工具）来：

- 在提交前运行格式化工具
- 检查 console.log/print 语句
- 运行类型检查
- 验证没有硬编码的密钥

### CI/CD 检查

对于 Claude Code 中作为 Stop Hook 运行的检查：

- 将它们添加到 CI/CD 流水线（Pipeline）中
- 使用 GitHub Actions、GitLab CI 等

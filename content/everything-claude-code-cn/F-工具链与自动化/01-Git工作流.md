> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Git 工作流

## 概述

定义了 Git 提交消息格式、Pull Request 工作流以及完整的功能实现流程，确保代码变更有序、可追溯、高质量。

## 提交消息格式（Commit Message Format）

```
<类型>: <描述>

<可选正文>
```

类型（Types）包括：`feat`（新功能）、`fix`（修复）、`refactor`（重构）、`docs`（文档）、`test`（测试）、`chore`（杂务）、`perf`（性能）、`ci`（持续集成）

注意：归属信息（Attribution）已通过 `~/.claude/settings.json` 全局禁用。

## Pull Request 工作流

创建 PR 时：

1. 分析完整的提交历史（不仅仅是最新提交）
2. 使用 `git diff [base-branch]...HEAD` 查看所有变更
3. 撰写全面的 PR 摘要
4. 包含带有 TODO 的测试计划
5. 如果是新分支，推送时使用 `-u` 标志

## 功能实现工作流（Feature Implementation Workflow）

### 1. 先做规划

- 使用 **planner** 代理（Agent）创建实施计划
- 识别依赖关系和风险
- 分解为多个阶段

### 2. TDD 方法

- 使用 **tdd-guide** 代理
- 先编写测试（红灯 / RED）
- 实现代码使测试通过（绿灯 / GREEN）
- 重构优化（改进 / IMPROVE）
- 验证覆盖率达到 80% 以上

### 3. 代码审查（Code Review）

- 编写代码后立即使用 **code-reviewer** 代理
- 解决所有 CRITICAL（严重）和 HIGH（高优先级）问题
- 尽可能修复 MEDIUM（中等优先级）问题

### 4. 提交与推送

- 编写详细的提交消息
- 遵循约定式提交（Conventional Commits）格式

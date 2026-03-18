> 来源：[obra/superpowers](https://github.com/obra/superpowers) | 分类：Git 工作流

# 使用 Git Worktrees

## 概述

Git worktrees（工作树）创建隔离的工作空间，共享同一仓库，允许同时在多个分支上工作。

**核心原则：** 系统化目录选择 + 安全验证 = 可靠隔离。

## 目录选择流程（优先级顺序）

1. **检查现有目录** — `.worktrees` 或 `worktrees`
2. **检查 CLAUDE.md** — 查看是否有偏好设定
3. **询问用户** — 如果都没有

## 安全验证

对于项目本地目录：**必须**验证目录被 gitignore 忽略。未忽略则添加到 .gitignore 并提交。

## 创建步骤

1. 检测项目名称
2. 创建 worktree 并新建分支：`git worktree add "$path" -b "$BRANCH_NAME"`
3. 运行项目初始化（自动检测 Node/Rust/Python/Go）
4. 验证测试基线通过
5. 报告位置和状态

## 快速参考

| 情况 | 操作 |
|------|------|
| `.worktrees/` 存在 | 使用它（验证忽略） |
| `worktrees/` 存在 | 使用它（验证忽略） |
| 两者都存在 | 使用 `.worktrees/` |
| 都不存在 | 检查 CLAUDE.md -> 询问用户 |
| 目录未被忽略 | 添加到 .gitignore + 提交 |
| 基线测试失败 | 报告失败 + 询问 |

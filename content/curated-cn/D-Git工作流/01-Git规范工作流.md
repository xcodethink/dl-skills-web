> 来源：DL Skills 精选 | 分类：交付部署

---
name: git-conventional-workflow
description: Use when establishing Git conventions for commit messages, branch naming, PR workflows, and repository hygiene.
---

# Git 规范工作流（Git Conventional Workflow）

## 概述

Git 不只是版本控制工具，更是团队协作的基础设施。混乱的提交历史、不规范的分支命名、缺乏审查的合并——这些问题让代码库逐渐变成考古现场。本技能覆盖日常开发中最关键的 Git 最佳实践。

## 何时使用

- 为团队建立 Git 工作流规范
- 配置 Git hooks 和提交检查
- 选择分支策略（Trunk-based / Git Flow / GitHub Flow）
- 审查 PR 流程是否合理

## 提交信息规范（Conventional Commits）

格式：`<类型>(<范围>): <描述>`

| 类型 | 用途 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(auth): add OAuth2 login` |
| `fix` | 修复缺陷 | `fix(cart): resolve quantity overflow` |
| `docs` | 文档更新 | `docs(readme): update install guide` |
| `refactor` | 重构（不改行为） | `refactor(api): extract validation layer` |
| `test` | 测试相关 | `test(user): add edge case coverage` |
| `chore` | 构建/工具/依赖 | `chore(deps): bump express to 4.19` |

规则：描述用祈使句（add 而非 added），首字母小写，不加句号，50 字符以内。

## 分支命名

格式：`<类型>/<简述>`

| 前缀 | 用途 | 示例 |
|------|------|------|
| `feature/` | 新功能开发 | `feature/user-profile-page` |
| `bugfix/` | 缺陷修复 | `bugfix/login-redirect-loop` |
| `hotfix/` | 生产紧急修复 | `hotfix/payment-crash` |
| `release/` | 发版准备 | `release/2.1.0` |

## 分支策略选择

| 策略 | 适用团队 | 核心特点 |
|------|----------|----------|
| 主干开发（Trunk-based） | 小团队、持续部署 | 所有人向 main 提交，配合功能开关（Feature Flag） |
| Git Flow | 有明确发版周期 | develop + release + hotfix 分支，流程严格 |
| GitHub Flow | SaaS 产品、持续交付 | 从 main 拉分支，PR 合并回 main，简洁高效 |

团队 5 人以下且持续部署：选 Trunk-based。有版本号发布需求：选 Git Flow。其他场景：选 GitHub Flow。

## PR 最佳实践

1. **保持 PR 小而聚焦** — 单个 PR 不超过 400 行变更，一个 PR 只做一件事
2. **描述性标题** — 用 Conventional Commits 格式：`feat(auth): add two-factor authentication`
3. **关联 Issue** — 在描述中引用：`Closes #42`
4. **审查清单** — 每个 PR 必须检查：功能正确、测试覆盖、无安全隐患、文档已更新
5. **必须经过审查** — 至少一人 Approve 才能合并，不允许自己合并自己的 PR

## Pre-commit Hooks 配置

使用 `lint-staged` + `commitlint` + 格式检查：

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## 常用操作

- **交互式变基（Squash）**：`git rebase -i HEAD~3`，合并琐碎提交为有意义的单个提交
- **Cherry-pick**：`git cherry-pick <commit-hash>`，从其他分支摘取单个提交
- **Stash 模式**：`git stash push -m "wip: feature-x"` 保存 / `git stash pop` 恢复

## Git 卫生习惯

- 合并后立即删除分支：`git branch -d feature/xxx`
- 每次发版打标签（Tag）：`git tag -a v1.2.0 -m "Release 1.2.0"`
- 保护 main 分支：禁止直接推送，必须通过 PR
- 定期清理远端已删除分支：`git fetch --prune`

## 必须做 / 禁止做

**必须做（MUST DO）：**
- 原子提交（Atomic Commits）：每个提交是一个完整的、可独立理解的变更
- 有意义的提交信息：看信息就知道改了什么、为什么改
- 所有变更通过 PR，不直接推送 main
- 合并前确保 CI 通过

**禁止做（MUST NOT）：**
- 对共享分支执行 `git push --force`（会覆盖他人工作）
- 提交 `.env`、密钥、证书等敏感文件
- 在同一个提交中混合格式化变更和逻辑变更
- 留下大量未合并的过期分支

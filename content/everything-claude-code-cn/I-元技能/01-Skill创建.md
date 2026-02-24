> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Skill 创建 — 本地技能生成

## 概述

通过分析本地 Git 仓库的提交历史，自动提取编码模式并生成 SKILL.md 文件，让 Claude 学习团队的开发实践。这是 Skill Creator GitHub App 的本地版本。

## 用法

```bash
/skill-create                    # 分析当前仓库
/skill-create --commits 100      # 分析最近 100 次提交
/skill-create --output ./skills  # 自定义输出目录
/skill-create --instincts        # 同时生成直觉（instincts），用于 continuous-learning-v2
```

## 工作原理

1. **解析 Git 历史** — 分析提交记录、文件变更和模式
2. **检测模式** — 识别反复出现的工作流和代码约定
3. **生成 SKILL.md** — 创建有效的 Claude Code 技能文件
4. **可选生成直觉（Instincts）** — 用于 continuous-learning-v2 系统

## 分析步骤

### 步骤 1：收集 Git 数据

```bash
# 获取最近的提交记录及文件变更
git log --oneline -n ${COMMITS:-200} --name-only --pretty=format:"%H|%s|%ad" --date=short

# 按文件统计提交频率
git log --oneline -n 200 --name-only | grep -v "^$" | grep -v "^[a-f0-9]" | sort | uniq -c | sort -rn | head -20

# 获取提交消息模式
git log --oneline -n 200 | cut -d' ' -f2- | head -50
```

### 步骤 2：检测模式

查找以下类型的模式：

| 模式 | 检测方法 |
|------|----------|
| **提交约定（Commit Conventions）** | 对提交消息进行正则匹配（feat:、fix:、chore:） |
| **文件联动变更（File Co-changes）** | 总是一起变更的文件 |
| **工作流序列（Workflow Sequences）** | 反复出现的文件变更模式 |
| **架构特征（Architecture）** | 文件夹结构和命名约定 |
| **测试模式（Testing Patterns）** | 测试文件位置、命名、覆盖率 |

### 步骤 3：生成 SKILL.md

输出格式：

```markdown
---
name: {仓库名}-patterns
description: 从 {仓库名} 提取的编码模式
version: 1.0.0
source: local-git-analysis
analyzed_commits: {数量}
---

# {仓库名} 模式

## 提交约定
{检测到的提交消息模式}

## 代码架构
{检测到的文件夹结构和组织方式}

## 工作流
{检测到的重复文件变更模式}

## 测试模式
{检测到的测试约定}
```

### 步骤 4：生成直觉（Instincts）（使用 --instincts 参数时）

用于 continuous-learning-v2 集成：

```yaml
---
id: {仓库名}-commit-convention
trigger: "when writing a commit message"  # 当编写提交消息时
confidence: 0.8
domain: git
source: local-repo-analysis
---

# 使用约定式提交（Conventional Commits）

## 动作
提交消息前缀使用：feat:、fix:、chore:、docs:、test:、refactor:

## 证据
- 分析了 {n} 次提交
- {百分比}% 遵循约定式提交格式
```

## 输出示例

在 TypeScript 项目上运行 `/skill-create` 可能生成：

```markdown
---
name: my-app-patterns
description: 从 my-app 仓库提取的编码模式
version: 1.0.0
source: local-git-analysis
analyzed_commits: 150
---

# My App 模式

## 提交约定

本项目使用**约定式提交（Conventional Commits）**：
- `feat:` — 新功能
- `fix:` — Bug 修复
- `chore:` — 维护任务
- `docs:` — 文档更新

## 代码架构

```
src/
├── components/     # React 组件（PascalCase.tsx）
├── hooks/          # 自定义 Hooks（use*.ts）
├── utils/          # 工具函数
├── types/          # TypeScript 类型定义
└── services/       # API 和外部服务
```

## 工作流

### 添加新组件
1. 创建 `src/components/ComponentName.tsx`
2. 在 `src/components/__tests__/ComponentName.test.tsx` 添加测试
3. 从 `src/components/index.ts` 导出

### 数据库迁移
1. 修改 `src/db/schema.ts`
2. 运行 `pnpm db:generate`
3. 运行 `pnpm db:migrate`

## 测试模式

- 测试文件：`__tests__/` 目录或 `.test.ts` 后缀
- 覆盖率目标：80%+
- 框架：Vitest
```

## GitHub App 集成

如需高级功能（10k+ 提交分析、团队共享、自动 PR），可使用 [Skill Creator GitHub App](https://github.com/apps/skill-creator)：

- 安装：[github.com/apps/skill-creator](https://github.com/apps/skill-creator)
- 在任意 Issue 中评论 `/skill-creator analyze`
- 自动收到包含生成技能的 PR

## 相关命令

- `/instinct-import` — 导入生成的直觉
- `/instinct-status` — 查看已学习的直觉
- `/evolve` — 将直觉聚类为技能/命令/代理

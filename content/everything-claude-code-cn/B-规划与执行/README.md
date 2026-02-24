# B 类：规划与执行

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)

从规划到执行的全流程管控，包括多模型协作与检查点机制。

| 文件 | 原始来源 | 核心理念 |
|------|----------|----------|
| [01-实施规划](01-实施规划.md) | planner agent + plan command | 先规划再编码，等确认才动手 |
| [02-架构设计](02-架构设计.md) | architect agent | ADR 模板、权衡分析、可扩展性路径 |
| [03-Agent编排](03-Agent编排.md) | orchestrate command + common-agents rule | 预设 Agent 流水线，声明式编排 |
| [04-多模型协作](04-多模型协作.md) | multi-plan/execute/workflow/backend/frontend commands | Codex + Gemini + Claude 分工协作 |
| [05-检查点管理](05-检查点管理.md) | checkpoint command | 基于 git 的工作流快照与回溯 |

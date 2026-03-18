> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# 性能与 Token 优化

## 概述

针对 Claude Code 使用场景的性能优化指南，涵盖模型选择策略、上下文窗口（Context Window）管理、扩展思考（Extended Thinking）模式配置以及构建故障排查方法。核心理念是根据任务复杂度选择合适的模型，在成本与能力之间取得最佳平衡。

## 模型选择策略

**Haiku 4.5**（Sonnet 90% 的能力，成本节省 3 倍）：
- 轻量级代理（Agent），调用频率高的场景
- 结对编程和代码生成
- 多代理系统中的工作代理（Worker Agent）

**Sonnet 4.6**（最佳编码模型）：
- 主要开发工作
- 编排多代理工作流（Multi-Agent Workflows）
- 复杂编码任务

**Opus 4.5**（最深层推理）：
- 复杂架构决策
- 最高推理需求
- 研究和分析任务

## 上下文窗口管理

在上下文窗口的**最后 20%** 应避免执行以下任务：
- 大规模重构
- 跨多个文件的功能实现
- 调试复杂交互

对上下文敏感度较低的任务：
- 单文件编辑
- 独立工具函数创建
- 文档更新
- 简单 Bug 修复

## 扩展思考（Extended Thinking）+ 计划模式（Plan Mode）

扩展思考默认启用，最多为内部推理保留 31,999 个 Token。

控制扩展思考的方式：
- **切换**：Option+T（macOS）/ Alt+T（Windows/Linux）
- **配置**：在 `~/.claude/settings.json` 中设置 `alwaysThinkingEnabled`
- **预算上限**：`export MAX_THINKING_TOKENS=10000`
- **详细模式**：Ctrl+O 查看思考输出

对于需要深度推理的复杂任务：
1. 确保扩展思考已启用（默认开启）
2. 启用**计划模式（Plan Mode）**以获得结构化方法
3. 使用多轮批评（Critique）进行深入分析
4. 使用角色分离的子代理（Sub-Agent）获取多样化视角

## 构建故障排查

如果构建失败：
1. 使用 **build-error-resolver** 代理
2. 分析错误消息
3. 增量修复
4. 每次修复后验证

> 来源：[anthropics/skills](https://github.com/anthropics/skills) | 分类：AI 工程 | ⭐ Anthropic 官方

---
name: mcp-builder
description: Comprehensive guide for building high-quality MCP servers with well-designed tools. Use when creating new MCP integrations or improving existing ones.
---

# MCP 构建器（MCP Builder）

## 概述

Anthropic 官方的 MCP（Model Context Protocol）服务器构建指南。指导你创建高质量的 MCP 服务器，使 LLM 能有效地与外部服务交互。

## 四阶段工作流

### 阶段 1：深度调研与规划

1. **理解现代 MCP 设计**
   - 研究 MCP 协议文档和最佳实践
   - 理解工具（Tools）、资源（Resources）、提示（Prompts）的区别
   - 学习 Schema 设计和注解（Annotations）规范

2. **研究目标服务的 API**
   - 完整阅读 API 文档
   - 理解认证流程和速率限制
   - 识别高价值操作 vs. 低价值操作

3. **规划实现**
   - 决定工具粒度：API 覆盖型 vs. 工作流型
   - 设计工具名称和参数 Schema
   - 规划错误处理策略

### 阶段 2：实现

1. **项目结构**
   - 选择 SDK（TypeScript 或 Python）
   - 设置标准项目骨架
   - 配置类型检查和 linting

2. **核心基础设施**
   - 实现认证和会话管理
   - 设置日志和错误上报
   - 配置速率限制处理

3. **工具实现**
   - 每个工具都要有清晰的 JSON Schema
   - 使用 Annotations 描述工具的副作用
   - 输入验证要严格，输出格式要一致

### 阶段 3：评审与测试

- 代码质量审查
- 用 MCP Inspector 进行交互式测试
- 验证所有工具在边界条件下的行为
- 确保错误消息对 LLM 有帮助

### 阶段 4：创建评估

编写 10 个评估问题测试 LLM 使用工具的效果：
- 覆盖简单和复杂场景
- 包含需要多步骤的工作流
- 测试错误处理路径

## 工具设计原则

| 原则 | 说明 |
|------|------|
| 清晰的命名 | 工具名应让 LLM 一眼理解用途 |
| 详细的描述 | description 字段是 LLM 选择工具的依据 |
| 严格的 Schema | 用 JSON Schema 定义每个参数的类型和约束 |
| 有意义的错误 | 错误消息应帮助 LLM 自我纠正 |
| 最小副作用 | 用 Annotations 标注工具是否有副作用 |

## 参考资源

- MCP 最佳实践指南
- TypeScript SDK / Python SDK 文档
- MCP 评估指南
- 工具注解（Annotations）规范

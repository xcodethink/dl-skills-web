> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：G-工具与效率

# Claude Code 专家指南

Claude Code 是 Anthropic 的 Agent 式编码工具，驻留在终端中，帮助更快地将想法转化为代码。它将自主规划、执行和验证与通过技能、插件、MCP 服务器和钩子实现的可扩展性相结合。

## 适用场景

- 理解 Claude Code 的功能和能力
- 安装、设置和认证
- 使用斜杠命令进行开发工作流
- 创建或管理 Agent 技能
- 配置 MCP 服务器以集成外部工具
- 设置钩子和插件
- 排查 Claude Code 问题
- 企业部署（SSO、沙盒、监控）
- IDE 集成（VS Code、JetBrains）
- CI/CD 集成（GitHub Actions、GitLab）
- 高级功能（扩展思考、缓存、检查点）
- 成本跟踪与优化

**激活示例：**
- "如何使用 Claude Code？"
- "有哪些斜杠命令可用？"
- "如何设置 MCP 服务器？"
- "为 X 创建一个新技能"
- "修复 Claude Code 认证问题"
- "在企业环境中部署 Claude Code"

## 核心架构

**子 Agent（Subagents）**：专业化 AI Agent（规划器、代码审查器、测试器、调试器、文档管理器、UI/UX 设计师、数据库管理员等）

**Agent 技能（Agent Skills）**：模块化能力，包含指令、元数据和资源，Claude 自动使用

**斜杠命令（Slash Commands）**：用户定义的操作，位于 `.claude/commands/` 中，展开为提示词

**钩子（Hooks）**：响应事件执行的 Shell 命令（pre/post-tool、user-prompt-submit）

**MCP 服务器**：模型上下文协议（Model Context Protocol）集成，连接外部工具和服务

**插件（Plugins）**：打包的命令、技能、钩子和 MCP 服务器集合

## 快速参考

需要时加载这些参考文档获取详细指导：

### 入门
- **安装与设置**：`references/getting-started.md`
  - 前置条件、安装方法、认证、首次运行

### 开发工作流
- **斜杠命令**：`references/slash-commands.md`
  - 完整命令目录：/cook、/plan、/debug、/test、/fix:*、/docs:*、/git:*、/design:*、/content:*

- **Agent 技能**：`references/agent-skills.md`
  - 创建技能、skill.json 格式、最佳实践、API 用法

### 集成与扩展
- **MCP 集成**：`references/mcp-integration.md`
  - 配置、常用服务器、远程服务器

- **钩子与插件**：`references/hooks-and-plugins.md`
  - 钩子类型、配置、环境变量、插件结构、安装

### 配置与设置
- **配置**：`references/configuration.md`
  - 设置层级、关键设置、模型配置、输出样式

### 企业与生产
- **企业功能**：`references/enterprise-features.md`
  - IAM、SSO、RBAC、沙盒、审计日志、部署选项、监控

- **IDE 集成**：`references/ide-integration.md`
  - VS Code 扩展、JetBrains 插件设置与功能

- **CI/CD 集成**：`references/cicd-integration.md`
  - GitHub Actions、GitLab CI/CD 工作流示例

### 高级用法
- **高级功能**：`references/advanced-features.md`
  - 扩展思考、提示词缓存、检查点、内存管理

- **故障排除**：`references/troubleshooting.md`
  - 常见问题、认证失败、MCP 问题、性能、调试模式

- **API 参考**：`references/api-reference.md`
  - Admin API、Messages API、Files API、Models API、Skills API

- **最佳实践**：`references/best-practices.md`
  - 项目组织、安全、性能、团队协作、成本管理

## 常见工作流

### 功能实现
```bash
/cook implement user authentication with JWT
# 或先规划
/plan implement payment integration with Stripe
```

### 缺陷修复
```bash
/fix:fast the login button is not working
/debug the API returns 500 errors intermittently
/fix:types  # 修复 TypeScript 错误
```

### 代码审查与测试
```bash
claude "review my latest commit"
/test
/fix:test the user service tests are failing
```

### 文档
```bash
/docs:init      # 创建初始文档
/docs:update    # 更新现有文档
/docs:summarize # 总结变更
```

### Git 操作
```bash
/git:cm                    # 暂存并提交
/git:cp                    # 暂存、提交并推送
/git:pr feature-branch main  # 创建拉取请求
```

### 设计与内容
```bash
/design:fast create landing page for SaaS product
/content:good write product description for new feature
```

## Claude 使用指南

回答 Claude Code 问题时：

1. **识别主题** —— 从用户问题中判断
2. **加载相关参考** —— 从上方快速参考部分
3. **提供具体指导** —— 使用加载的参考信息
4. **包含示例** —— 在有帮助时提供
5. **引用文档链接** —— 适当时使用 llms.txt 中的链接

**加载参考文档：**
- 仅在特定问题需要时读取参考文件
- 复杂查询可加载多个参考
- 在参考文件中搜索时使用 grep 模式

**文档链接：**
- 主文档：https://docs.claude.com/claude-code
- GitHub：https://github.com/anthropics/claude-code
- 支持：support.claude.com

基于加载的参考文档和官方文档提供准确、可操作的指导。

# F 类：工具链与自动化

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)

Git、Hook、MCP、Docker、部署等开发基础设施的配置与自动化。

| 文件 | 原始来源 | 核心理念 |
|------|----------|----------|
| [01-Git工作流](01-Git工作流.md) | common-git-workflow rule | Conventional Commits + Agent 整合 |
| [02-Hook系统](02-Hook系统.md) | hooks.json + common-hooks rule + 各语言 hooks | 三层质量网：预防→即时修复→终检 |
| [03-MCP配置指南](03-MCP配置指南.md) | mcp-servers.json | 15 个 MCP 服务器配置模板 |
| [04-PM2进程管理](04-PM2进程管理.md) | pm2 command | 自动检测服务类型并生成配置 |
| [05-包管理器配置](05-包管理器配置.md) | setup-pm command | npm/pnpm/yarn/bun 自动检测 |
| [06-会话管理](06-会话管理.md) | sessions command | 会话列表/加载/别名/统计 |
| [07-文档与代码地图](07-文档与代码地图.md) | doc-updater agent + update-codemaps/docs commands | AST 分析 + 依赖映射 → 架构文档 |
| [08-Docker模式](08-Docker模式.md) | docker-patterns skill | Compose 开发模式、网络、容器安全 |
| [09-部署模式](09-部署模式.md) | deployment-patterns skill | 滚动/蓝绿/金丝雀部署 + CI/CD |

# F: Toolchain & Automation

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)

Git, Hooks, MCP, Docker, deployment, and development infrastructure configuration and automation.

| File | Original Source | Core Concept |
|------|----------------|--------------|
| [01-Git-Workflow](01-Git-Workflow.md) | common-git-workflow rule | Conventional Commits + Agent integration |
| [02-Hook-System](02-Hook-System.md) | hooks.json + common-hooks rule + language hooks | 3-layer quality net: prevent→fix→audit |
| [03-MCP-Configuration](03-MCP-Configuration.md) | mcp-servers.json | 15 MCP server templates |
| [04-PM2-Process-Management](04-PM2-Process-Management.md) | pm2 command | Auto-detect services, generate config |
| [05-Package-Manager-Setup](05-Package-Manager-Setup.md) | setup-pm command | npm/pnpm/yarn/bun auto-detection |
| [06-Session-Management](06-Session-Management.md) | sessions command | Session list/load/alias/stats |
| [07-Documentation-Codemaps](07-Documentation-Codemaps.md) | doc-updater agent + update-codemaps/docs commands | AST analysis + dependency mapping |
| [08-Docker-Patterns](08-Docker-Patterns.md) | docker-patterns skill | Compose dev patterns, networking, security |
| [09-Deployment-Patterns](09-Deployment-Patterns.md) | deployment-patterns skill | Rolling/blue-green/canary + CI/CD |

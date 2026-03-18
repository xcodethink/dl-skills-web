# Claude Code Skills Collection

> 204+ battle-tested AI coding skills for [Claude Code](https://claude.ai/code), organized by development workflow.
>
> 204+ 经过实战检验的 AI 编程技能，按开发工作流组织。

**Website**: [claudecodeskills.wayjet.io](https://claudecodeskills.wayjet.io)

---

## What Are Skills? / 什么是技能？

Skills are reusable instruction sets that extend Claude Code's capabilities. Place a `SKILL.md` file in `~/.claude/skills/` or `.claude/skills/`, and Claude automatically loads it when relevant.

技能是可复用的指令集，扩展 Claude Code 的能力。将 `SKILL.md` 放入 `~/.claude/skills/` 或 `.claude/skills/`，Claude 会在相关时自动加载。

## Quick Start / 快速开始

```bash
# Browse skills on the website
open https://claudecodeskills.wayjet.io

# Or copy a skill directly
mkdir -p ~/.claude/skills/tdd
cp en/06-testing/Test-Driven-Development.md ~/.claude/skills/tdd/SKILL.md
```

---

## Categories / 技能分类

### Development Pipeline / 开发流水线

| # | Category / 分类 | Skills | Description / 描述 |
|---|----------------|--------|-------------------|
| 01 | [构思与规划](cn/01-构思与规划/) · [Think & Plan](en/01-think-plan/) | 11 | 头脑风暴、需求分析、实施计划 |
| 02 | [项目搭建](cn/02-项目搭建/) · [Project Setup](en/02-project-setup/) | 6 | 脚手架、环境初始化、目录结构 |
| 03 | [设计](cn/03-设计/) · [Design](en/03-design/) | 8 | UI/UX、设计系统、落地页 |
| 04 | [前端编码](cn/04-前端编码/) · [Frontend](en/04-frontend/) | 15 | React/Vue/Svelte、3D、Web 框架 |
| 05 | [后端编码](cn/05-后端编码/) · [Backend](en/05-backend/) | 27 | API、数据库、认证、支付 |
| 06 | [测试](cn/06-测试/) · [Testing](en/06-testing/) | 15 | TDD、单元测试、E2E、集成测试 |
| 07 | [调试](cn/07-调试/) · [Debug](en/07-debug/) | 7 | 系统化调试、根因分析 |
| 08 | [评审与验证](cn/08-评审与验证/) · [Review & Verify](en/08-review/) | 16 | 代码评审、完成验证、双 AI 互查 |
| 09 | [交付部署](cn/09-交付部署/) · [Ship & Deploy](en/09-ship-deploy/) | 13 | Git 工作流、CI/CD、部署 |

### Specialist Domains / 专项领域

| # | Category / 分类 | Skills | Description / 描述 |
|---|----------------|--------|-------------------|
| 10 | [AI 工程](cn/10-AI工程/) · [AI Engineering](en/10-ai-engineering/) | 28 | Agent 编排、MCP、提示词工程 |
| 11 | [数据可视化](cn/11-数据可视化/) · [Data Visualization](en/11-data-visualization/) | 5 | Matplotlib、Plotly、Seaborn |
| 12 | [内容营销](cn/12-内容营销/) · [Content & Marketing](en/12-content-marketing/) | 15 | 写作、社交媒体、广告分析 |
| 13 | [文档处理](cn/13-文档处理/) · [Documents](en/13-documents/) | 6 | Word、PDF、PPT、Excel |
| 14 | [效率工具](cn/14-效率工具/) · [Utilities](en/14-utilities/) | 23 | 开发工具、媒体处理、搜索 |
| 15 | [元技能](cn/15-元技能/) · [Meta Skills](en/15-meta-skills/) | 9 | 如何编写技能、技能设计方法论 |

---

## Sources & Attribution / 来源与致谢

All skills are curated from open-source repositories. Full credit to the original authors.

所有技能均整理自开源仓库，感谢原作者的贡献。

| Source | Author | Skills | Verified |
|--------|--------|--------|----------|
| [Superpowers](https://github.com/obra/superpowers) | obra | 14 | ✅ |
| [Anthropic Official](https://github.com/anthropics/skills) | Anthropic | 12 | ✅ |
| [Vercel React](https://github.com/vercel-labs/agent-skills) | Vercel Labs | 3 | ✅ |
| [Vercel Next.js](https://github.com/vercel-labs/next-skills) | Vercel Labs | 3 | ✅ |
| [Prisma](https://github.com/prisma/skills) | Prisma | 6 | ✅ |
| [Flutter](https://github.com/flutter/flutter) | Flutter | 1 | ✅ |
| [Everything Claude Code](https://github.com/Affaan-M/Everything-Claude-Code) | Affaan-M | 63 | |
| [Jeffallan Full-Stack](https://github.com/Jeffallan/claude-skills) | Jeffallan | 35 | |
| [ClaudeKit](https://github.com/mrgoonie/claudekit-skills) | mrgoonie | 24 | |
| [Composio](https://github.com/ComposioHQ/awesome-claude-skills) | ComposioHQ | 18 | |
| [Trail of Bits](https://github.com/trailofbits/skills) | Trail of Bits | 5 | |
| [DL Skills Curated](https://claudecodeskills.wayjet.io) | WayJet | 9 | ✅ |
| And 6 more... | | | |

---

## Structure / 仓库结构

```
├── cn/                    # 中文技能 (204 files)
│   ├── 01-构思与规划/
│   ├── 02-项目搭建/
│   ├── ...
│   └── 15-元技能/
├── en/                    # English skills (204 files)
│   ├── 01-think-plan/
│   ├── 02-project-setup/
│   ├── ...
│   └── 15-meta-skills/
├── categories.yaml        # Category definitions
├── sources.yaml           # Source attributions
└── skills-registry.yaml   # Full skill metadata
```

## Contributing / 贡献

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting new skills.

欢迎提交新技能，详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## License

MIT License. See [LICENSE](LICENSE) for details.

Individual skills retain their original licenses where specified.

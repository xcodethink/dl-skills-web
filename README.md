<p align="center">
  <h1 align="center">Claude Code Skills Collection</h1>
  <p align="center">
    <strong>204+ curated, battle-tested skills for Claude Code — organized by real development workflows.</strong>
  </p>
  <p align="center">
    <a href="https://claudecodeskills.wayjet.io">Website</a> ·
    <a href="#categories">Browse Skills</a> ·
    <a href="CONTRIBUTING.md">Contribute</a> ·
    <a href="#中文说明">中文</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/skills-204%2B-blue" alt="Skills" />
    <img src="https://img.shields.io/badge/categories-15-green" alt="Categories" />
    <img src="https://img.shields.io/badge/sources-17-orange" alt="Sources" />
    <img src="https://img.shields.io/badge/languages-CN%20%7C%20EN-purple" alt="Languages" />
    <img src="https://img.shields.io/github/license/xcodethink/claudecodeskills" alt="License" />
    <img src="https://img.shields.io/github/stars/xcodethink/claudecodeskills?style=social" alt="Stars" />
  </p>
</p>

---

## Why This Collection?

Most Claude Code skill repos dump everything into a flat list. **This collection is different:**

- **Workflow-organized** — 15 categories follow the real development pipeline: Plan → Build → Test → Ship
- **Curated from 17 sources** — including official skills from Anthropic, Vercel, Prisma, Flutter, and Trail of Bits
- **Bilingual** — every skill available in both English and Chinese
- **Quality-checked** — each skill tested with Claude Code before inclusion

> **New to Claude Code Skills?** Skills are reusable `.md` instruction files that Claude loads automatically. Drop one into `~/.claude/skills/` and Claude gains new expertise instantly.

## Quick Start

```bash
# 1. Pick a skill from any category below
# 2. Copy it to your skills directory
mkdir -p ~/.claude/skills/tdd
cp en/06-testing/Test-Driven-Development.md ~/.claude/skills/tdd/SKILL.md

# 3. Claude Code now uses TDD automatically when relevant
```

Or browse visually at **[claudecodeskills.wayjet.io](https://claudecodeskills.wayjet.io)**.

---

## Categories

### Development Pipeline

Skills that follow you through the entire development lifecycle.

| | Category | Skills | What's Inside |
|---|----------|--------|--------------|
| 📋 | **[Think & Plan](en/01-think-plan/)** | 11 | Brainstorming, requirements analysis, architecture design, implementation planning |
| 🚀 | **[Project Setup](en/02-project-setup/)** | 6 | Scaffolding for React, Next.js, Flutter, Python, universal templates |
| 🎨 | **[Design](en/03-design/)** | 8 | UI/UX, design systems, landing pages, brand guidelines, theme engines |
| 💻 | **[Frontend](en/04-frontend/)** | 15 | React, Vue, Svelte, Three.js, Tailwind, accessibility, performance |
| ⚙️ | **[Backend](en/05-backend/)** | 27 | APIs, databases, auth, payments, Prisma, Stripe, Kubernetes |
| ✅ | **[Testing](en/06-testing/)** | 15 | TDD, unit/E2E/integration, Playwright, property-based testing |
| 🔍 | **[Debug](en/07-debug/)** | 7 | Systematic debugging, root cause analysis, binary search strategy |
| 📝 | **[Review & Verify](en/08-review/)** | 16 | Code review, completion verification, dual-AI cross-check, security audit |
| 📦 | **[Ship & Deploy](en/09-ship-deploy/)** | 13 | Git workflows, CI/CD, Docker, Cloudflare, release management |

### Specialist Domains

Deep expertise in specific areas.

| | Category | Skills | What's Inside |
|---|----------|--------|--------------|
| 🤖 | **[AI Engineering](en/10-ai-engineering/)** | 28 | Agent orchestration, MCP servers, prompt engineering, hooks, subagents, plugins |
| 📊 | **[Data Visualization](en/11-data-visualization/)** | 5 | Matplotlib, Plotly, Seaborn, publication-quality scientific charts |
| ✍️ | **[Content & Marketing](en/12-content-marketing/)** | 15 | Writing, social media, ad analysis, lead research, SEO |
| 📄 | **[Documents](en/13-documents/)** | 6 | Word, PDF, PPT, Excel creation and processing |
| 🔧 | **[Utilities](en/14-utilities/)** | 23 | Dev tools, media processing, web search, file management |
| 🧠 | **[Meta Skills](en/15-meta-skills/)** | 9 | How to write skills, skill design methodology, system configuration |

> **Chinese versions**: Every category has a Chinese mirror. Replace `en/` with `cn/` in any path above.
> Example: `en/06-testing/` → [`cn/06-测试/`](cn/06-测试/)

---

## Sources & Credits

All skills are curated from open-source repositories. Full credit to the original authors.

### Verified Sources (Official / Trusted)

| Source | Repository | Skills |
|--------|-----------|--------|
| **Anthropic Official** | [anthropics/skills](https://github.com/anthropics/skills) | 12 |
| **Vercel Labs** | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 6 |
| **Prisma** | [prisma/skills](https://github.com/prisma/skills) | 6 |
| **Flutter** | [flutter/flutter](https://github.com/flutter/flutter) | 1 |
| **Trail of Bits** | [trailofbits/skills](https://github.com/trailofbits/skills) | 5 |
| **Superpowers** | [obra/superpowers](https://github.com/obra/superpowers) | 14 |

### Community Sources

| Source | Repository | Skills |
|--------|-----------|--------|
| Everything Claude Code | [Affaan-M/Everything-Claude-Code](https://github.com/Affaan-M/Everything-Claude-Code) | 63 |
| Jeffallan Full-Stack | [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | 35 |
| ClaudeKit | [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 24 |
| Composio | [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 18 |
| + 7 more community sources | | |

---

## Repository Structure

```
├── en/                        # English skills (204 files)
│   ├── 01-think-plan/         # Each category has a README index
│   ├── 02-project-setup/
│   ├── ...
│   └── 15-meta-skills/
├── cn/                        # Chinese skills (204 files, same structure)
│   ├── 01-构思与规划/
│   ├── ...
│   └── 15-元技能/
├── categories.yaml            # Category definitions
├── sources.yaml               # Source attributions
├── skills-registry.yaml       # Complete skill metadata (tags, difficulty, highlights)
├── CONTRIBUTING.md            # How to submit new skills
└── LICENSE                    # MIT
```

## Contributing

We welcome new skills! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

<a id="中文说明"></a>

## 中文说明

**Claude Code Skills Collection** 是一个精选的 AI 编程技能库，收录了 204+ 个实战验证的技能，按 15 个开发场景分类。

### 特色

- **按工作流组织** — 从构思到部署，15 个分类覆盖完整开发周期
- **精选 17 个来源** — 包括 Anthropic、Vercel、Prisma、Flutter 等官方技能
- **中英双语** — 所有技能提供中英文两个版本
- **质量把控** — 每个技能经过 Claude Code 实测

### 快速使用

```bash
# 复制一个技能到本地
mkdir -p ~/.claude/skills/tdd
cp cn/06-测试/测试驱动开发-TDD.md ~/.claude/skills/tdd/SKILL.md
```

或访问网站浏览：**[claudecodeskills.wayjet.io](https://claudecodeskills.wayjet.io)**

### 分类一览

| 分类 | 技能数 | 分类 | 技能数 |
|------|--------|------|--------|
| [构思与规划](cn/01-构思与规划/) | 11 | [AI 工程](cn/10-AI工程/) | 28 |
| [项目搭建](cn/02-项目搭建/) | 6 | [数据可视化](cn/11-数据可视化/) | 5 |
| [设计](cn/03-设计/) | 8 | [内容营销](cn/12-内容营销/) | 15 |
| [前端编码](cn/04-前端编码/) | 15 | [文档处理](cn/13-文档处理/) | 6 |
| [后端编码](cn/05-后端编码/) | 27 | [效率工具](cn/14-效率工具/) | 23 |
| [测试](cn/06-测试/) | 15 | [元技能](cn/15-元技能/) | 9 |
| [调试](cn/07-调试/) | 7 | | |
| [评审与验证](cn/08-评审与验证/) | 16 | | |
| [交付部署](cn/09-交付部署/) | 13 | | |

---

## Star History

<a href="https://star-history.com/#xcodethink/claudecodeskills&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=xcodethink/claudecodeskills&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=xcodethink/claudecodeskills&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=xcodethink/claudecodeskills&type=Date" />
 </picture>
</a>

## License

MIT License. Individual skills may retain their original licenses where specified.

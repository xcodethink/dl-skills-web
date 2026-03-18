# Contributing / 贡献指南

Thank you for your interest in contributing to Claude Code Skills Collection!

感谢你对本项目的关注！

## How to Submit a Skill / 如何提交技能

### 1. Choose a Category / 选择分类

Pick the most appropriate category from the [15 available categories](README.md#categories--技能分类).

### 2. Create Your Skill File / 创建技能文件

Each skill is a Markdown file with optional YAML frontmatter:

```markdown
> Source: [your-repo](https://github.com/...) | Category: Testing

---
name: your-skill-name
description: Brief description of what this skill does and when to use it.
---

# Skill Title

## Overview
What this skill does...

## Instructions
Step-by-step guide...
```

### 3. Submit a Pull Request / 提交 PR

1. Fork this repository
2. Add your skill file to the appropriate category directory
3. Add both Chinese (`cn/`) and English (`en/`) versions
4. Submit a PR with a clear description

### Quality Standards / 质量标准

- **Actionable**: Skills should contain concrete, executable instructions
- **Tested**: Skills should be verified with Claude Code before submission
- **Concise**: Keep under 5,000 words; use progressive disclosure for complex topics
- **Attributed**: Include source links and original author credit

### File Naming / 文件命名

- Use descriptive kebab-case names: `test-driven-development.md`
- Chinese files use Chinese names: `测试驱动开发-TDD.md`
- No numeric prefixes needed (the category directory provides ordering)

## Reporting Issues / 反馈问题

- Skill doesn't work as expected? Open an issue
- Found a better approach? Submit a PR
- Want to suggest a new category? Open a discussion

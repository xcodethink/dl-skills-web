> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: G-Tools-and-Productivity

---
name: claude-code-guide
description: Expert guide for Claude Code's agentic coding capabilities including skills, plugins, MCP servers, hooks, and enterprise deployment
---

# Claude Code Expert Guide

## Overview

Claude Code is Anthropic's agentic coding tool that lives in the terminal and helps turn ideas into code faster. It combines autonomous planning, execution, and verification with extensibility through skills, plugins, MCP servers, and hooks.

## When to Use

- Understanding Claude Code's features and capabilities
- Installation, setup, and authentication
- Using slash commands for development workflows
- Creating or managing agent skills
- Configuring MCP servers for external tool integration
- Setting up hooks and plugins
- Troubleshooting Claude Code issues
- Enterprise deployment (SSO, sandbox, monitoring)
- IDE integration (VS Code, JetBrains)
- CI/CD integration (GitHub Actions, GitLab)
- Advanced features (extended thinking, caching, checkpoints)
- Cost tracking and optimization

**Activation examples:**
- "How do I use Claude Code?"
- "What slash commands are available?"
- "How do I set up an MCP server?"
- "Create a new skill for X"
- "Fix Claude Code authentication issues"
- "Deploy Claude Code in an enterprise setting"

## Core Architecture

**Subagents**: Specialized AI agents (planner, code reviewer, tester, debugger, docs manager, UI/UX designer, DBA, etc.)

**Agent Skills**: Modular capabilities with instructions, metadata, and resources that Claude automatically uses

**Slash Commands**: User-defined actions in `.claude/commands/` that expand into prompts

**Hooks**: Shell commands executed in response to events (pre/post-tool, user-prompt-submit)

**MCP Servers**: Model Context Protocol integrations connecting external tools and services

**Plugins**: Packaged collections of commands, skills, hooks, and MCP servers

## Quick Reference

Load these reference documents as needed for detailed guidance:

### Getting Started
- **Installation & Setup**: `references/getting-started.md`
  - Prerequisites, installation methods, authentication, first run

### Development Workflows
- **Slash Commands**: `references/slash-commands.md`
  - Complete command catalog: /cook, /plan, /debug, /test, /fix:*, /docs:*, /git:*, /design:*, /content:*

- **Agent Skills**: `references/agent-skills.md`
  - Creating skills, skill.json format, best practices, API usage

### Integration & Extension
- **MCP Integration**: `references/mcp-integration.md`
  - Configuration, common servers, remote servers

- **Hooks & Plugins**: `references/hooks-and-plugins.md`
  - Hook types, configuration, environment variables, plugin structure, installation

### Configuration & Setup
- **Configuration**: `references/configuration.md`
  - Settings hierarchy, key settings, model configuration, output styling

### Enterprise & Production
- **Enterprise Features**: `references/enterprise-features.md`
  - IAM, SSO, RBAC, sandbox, audit logs, deployment options, monitoring

- **IDE Integration**: `references/ide-integration.md`
  - VS Code extension, JetBrains plugin setup and features

- **CI/CD Integration**: `references/cicd-integration.md`
  - GitHub Actions, GitLab CI/CD workflow examples

### Advanced Usage
- **Advanced Features**: `references/advanced-features.md`
  - Extended thinking, prompt caching, checkpoints, memory management

- **Troubleshooting**: `references/troubleshooting.md`
  - Common issues, auth failures, MCP problems, performance, debug mode

- **API Reference**: `references/api-reference.md`
  - Admin API, Messages API, Files API, Models API, Skills API

- **Best Practices**: `references/best-practices.md`
  - Project organization, security, performance, team collaboration, cost management

## Common Workflows

### Feature Implementation
```bash
/cook implement user authentication with JWT
# Or plan first
/plan implement payment integration with Stripe
```

### Bug Fixing
```bash
/fix:fast the login button is not working
/debug the API returns 500 errors intermittently
/fix:types  # Fix TypeScript errors
```

### Code Review and Testing
```bash
claude "review my latest commit"
/test
/fix:test the user service tests are failing
```

### Documentation
```bash
/docs:init      # Create initial documentation
/docs:update    # Update existing documentation
/docs:summarize # Summarize changes
```

### Git Operations
```bash
/git:cm                    # Stage and commit
/git:cp                    # Stage, commit, and push
/git:pr feature-branch main  # Create pull request
```

### Design and Content
```bash
/design:fast create landing page for SaaS product
/content:good write product description for new feature
```

## Usage Guidelines for Claude

When answering Claude Code questions:

1. **Identify the topic** -- determine from the user's question
2. **Load relevant references** -- from the Quick Reference section above
3. **Provide specific guidance** -- using loaded reference information
4. **Include examples** -- when helpful
5. **Cite documentation links** -- use llms.txt links when appropriate

**Loading references:**
- Only read reference files when a specific question requires them
- Load multiple references for complex queries
- Use grep patterns when searching within reference files

**Documentation links:**
- Main docs: https://docs.claude.com/claude-code
- GitHub: https://github.com/anthropics/claude-code
- Support: support.claude.com

Provide accurate, actionable guidance based on loaded reference documents and official documentation.

> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Performance & Token Optimization

## Overview

Guidelines for optimizing Claude Code performance through model selection, context window management, extended thinking configuration, and build troubleshooting. The core principle: match model capability to task complexity for optimal cost-performance balance.

## Model Selection Strategy

| Model | Strength | Use Cases |
|-------|----------|-----------|
| **Haiku 4.5** | 90% of Sonnet capability, 3x cheaper | Lightweight agents, pair programming, worker agents |
| **Sonnet 4.6** | Best coding model | Main development, multi-agent orchestration, complex coding |
| **Opus 4.5** | Deepest reasoning | Complex architecture, maximum reasoning, research/analysis |

## Context Window Management

**Avoid in the last 20% of context window:**
- Large-scale refactoring
- Multi-file feature implementation
- Debugging complex interactions

**Lower context sensitivity (safe in late context):**
- Single-file edits
- Independent utility creation
- Documentation updates
- Simple bug fixes

## Extended Thinking + Plan Mode

Extended thinking is enabled by default, reserving up to 31,999 tokens for internal reasoning.

**Controls:**
- **Toggle**: Option+T (macOS) / Alt+T (Windows/Linux)
- **Config**: `alwaysThinkingEnabled` in `~/.claude/settings.json`
- **Budget cap**: `export MAX_THINKING_TOKENS=10000`
- **Verbose mode**: Ctrl+O to see thinking output

**For complex tasks requiring deep reasoning:**
1. Ensure extended thinking is enabled (default: on)
2. Enable Plan Mode for structured approach
3. Use multiple critique rounds for thorough analysis
4. Use split role sub-agents for diverse perspectives

## Build Troubleshooting

If build fails:
1. Use the **build-error-resolver** agent
2. Analyze error messages
3. Fix incrementally
4. Verify after each fix

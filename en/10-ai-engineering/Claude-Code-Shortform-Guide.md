> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Claude Code Shortform Guide

## Overview

Complete setup reference for Claude Code after 10+ months of daily use. Covers skills, hooks, subagents, MCPs, plugins, and practical tips. This is the foundation that the Longform Guide builds upon.

---

## Skills & Commands

Skills are scoped workflow definitions; commands are slash-invoked skills.

- **Skills**: `~/.claude/skills/` — broader workflow definitions
- **Commands**: `~/.claude/commands/` — quick executable prompts

Skills can include codemaps for fast codebase navigation without burning context on exploration.

---

## Hooks

Trigger-based automations tied to tool calls and lifecycle events.

| Hook Type | Trigger | Example Use |
|-----------|---------|-------------|
| PreToolUse | Before tool executes | Validation, tmux reminder |
| PostToolUse | After tool finishes | Auto-formatting, type checking |
| UserPromptSubmit | When you send a message | Context injection |
| Stop | When Claude finishes | Session-end persistence |
| PreCompact | Before context compaction | State preservation |
| Notification | Permission requests | Custom notifications |

**Tip:** Use the `hookify` plugin to create hooks conversationally via `/hookify`.

---

## Subagents

Processes the orchestrator (main Claude) delegates to with limited scopes. Can run in background/foreground, sandboxed with specific tool permissions.

```
~/.claude/agents/
  planner.md, architect.md, tdd-guide.md, code-reviewer.md,
  security-reviewer.md, build-error-resolver.md, e2e-runner.md
```

---

## Rules & Memory

Always-follow guidelines in `.claude/rules/` as modular `.md` files:

```
security.md, coding-style.md, testing.md, git-workflow.md,
agents.md, performance.md
```

---

## MCPs (Model Context Protocol)

Prompt-driven wrappers connecting Claude to external services (databases, deployment platforms, etc.).

**Critical:** Be picky with MCPs. Your 200k context window may shrink to 70k with too many tools enabled.

**Rule of thumb:** Configure 20-30 MCPs, keep under 10 enabled / under 80 tools active.

---

## Plugins

Packaged tools for easy installation (skill + MCP combos, hook bundles, etc.).

**LSP plugins** are especially useful for Claude Code outside editors — provide real-time type checking, go-to-definition, and intelligent completions.

```
typescript-lsp, pyright-lsp, hookify, mgrep
```

---

## Essential Tips

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Ctrl+U | Delete entire line |
| ! | Quick bash command prefix |
| @ | Search for files |
| / | Slash commands |
| Shift+Enter | Multi-line input |
| Tab | Toggle thinking display |
| Esc Esc | Interrupt Claude / restore code |

### Parallel Workflows

- `/fork` for non-overlapping parallel tasks
- Git worktrees for overlapping parallel Claude instances

### Useful Commands

- `/rewind` — Go back to a previous state
- `/statusline` — Customize with branch, context %, todos
- `/checkpoints` — File-level undo points
- `/compact` — Manual context compaction

### mgrep > grep

Significant improvement over ripgrep/grep. Install via plugin marketplace. Supports local and web search.

---

## Editor Recommendations

### Zed (Recommended)

Rust-based, genuinely fast. Agent panel integration tracks Claude's file changes in real-time. Minimal resource usage won't compete with Claude during heavy operations.

### VSCode / Cursor

Works well with Claude Code in terminal or extension format. Extension provides native graphical interface.

**Editor-Agnostic Tips:**
1. Split screen: terminal + editor
2. Enable autosave for current file reads
3. Use editor's git features to review Claude's changes
4. Verify file watchers are enabled for auto-reload

---

## Key Takeaways

1. Don't overcomplicate — treat configuration like fine-tuning, not architecture
2. Context window is precious — disable unused MCPs and plugins
3. Parallel execution — fork conversations, use git worktrees
4. Automate the repetitive — hooks for formatting, linting, reminders
5. Scope your subagents — limited tools = focused execution

---

## References

- [Plugins Reference](https://code.claude.com/docs/en/plugins-reference)
- [Hooks Documentation](https://code.claude.com/docs/en/hooks)
- [Checkpointing](https://code.claude.com/docs/en/checkpointing)
- [Interactive Mode](https://code.claude.com/docs/en/interactive-mode)
- [Memory System](https://code.claude.com/docs/en/memory)
- [Subagents](https://code.claude.com/docs/en/sub-agents)
- [MCP Overview](https://code.claude.com/docs/en/mcp-overview)

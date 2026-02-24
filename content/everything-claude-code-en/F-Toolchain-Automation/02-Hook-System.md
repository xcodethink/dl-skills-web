> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Hook System

## Overview

Claude Code's hook system enables automated scripts that fire before/after tool execution, at session start/end, and during context compaction. This guide consolidates the core hook rules, hooks.json configuration, language-specific hooks, and Cursor IDE adaptation.

## Hook Types

| Type | Trigger | Use Case |
|------|---------|----------|
| **PreToolUse** | Before tool execution | Validation, parameter modification, blocking unsafe commands |
| **PostToolUse** | After tool execution | Auto-formatting, type checking, console.log warnings |
| **PreCompact** | Before context compaction | Save state so context can be restored |
| **SessionStart** | New session begins | Load previous context, detect package manager |
| **SessionEnd** | Session ends | Persist state, extract reusable patterns |
| **Stop** | Agent stops responding | Final verification (e.g., console.log audit) |

## Auto-Accept Permissions

- Enable only for trusted, well-defined plans
- Disable for exploratory work
- Never use `dangerously-skip-permissions` flag
- Configure `allowedTools` in `~/.claude.json` instead

## Key Hook Configurations (hooks.json)

### PreToolUse Hooks

**Block dev servers outside tmux:**
```json
{
  "matcher": "Bash",
  "description": "Block dev servers outside tmux - ensures log access"
}
```
Detects `npm run dev`, `pnpm dev`, `yarn dev`, `bun run dev` and blocks execution unless inside tmux.

**Tmux reminder for long-running commands:**
Warns when running `npm install/test`, `cargo build`, `docker`, `pytest`, `vitest`, `playwright` outside tmux.

**Git push review reminder:**
Outputs a reminder to review changes before any `git push`.

**Block random documentation files:**
Prevents creation of `.md`/`.txt` files that aren't README, CLAUDE, AGENTS, or CONTRIBUTING.

**Suggest manual compaction:**
Runs `suggest-compact.js` on Edit/Write operations to suggest compacting at logical intervals.

### PostToolUse Hooks

- **PR URL logger** -- Extracts and logs PR URL after `gh pr create`, provides review command
- **Async build analysis** -- Runs in background after build commands (non-blocking, 30s timeout)
- **Auto-format** -- Runs Prettier on JS/TS files after edits
- **TypeScript check** -- Runs `tsc` after editing `.ts`/`.tsx` files
- **console.log warning** -- Warns about `console.log` statements in edited files

### Session Lifecycle Hooks

- **SessionStart** -- Loads previous context and detects package manager
- **PreCompact** -- Saves state before context compaction
- **SessionEnd** -- Persists session state; evaluates session for extractable patterns
- **Stop** -- Checks all modified files for `console.log`

## Language-Specific Hooks

### TypeScript/JavaScript (`**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`)

| Hook | Tool |
|------|------|
| Auto-format | Prettier |
| Type check | `tsc` |
| Audit | `console.log` detection |

### Python (`**/*.py`, `**/*.pyi`)

| Hook | Tool |
|------|------|
| Auto-format | black / ruff |
| Type check | mypy / pyright |
| Audit | `print()` detection (use `logging` instead) |

### Go (`**/*.go`, `**/go.mod`, `**/go.sum`)

| Hook | Tool |
|------|------|
| Auto-format | gofmt / goimports |
| Static analysis | `go vet` |
| Extended checks | staticcheck |

## Appendix: Cursor IDE Adaptation

Cursor lacks native hooks, but equivalent automation can be achieved through:

1. **Format on Save** -- Configure Prettier, Black, or gofmt in editor settings
2. **Linting Integration** -- ESLint, Ruff/Flake8, golangci-lint via built-in support
3. **Pre-Commit Hooks** -- Use `husky` or `pre-commit` for formatting, secret detection, type checks
4. **CI/CD Checks** -- Move Stop hook logic into GitHub Actions or GitLab CI pipelines

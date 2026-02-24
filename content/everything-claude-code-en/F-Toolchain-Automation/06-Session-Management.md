> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Session Management

## Overview

Manage Claude Code session history -- list, load, alias, and inspect sessions stored in `~/.claude/sessions/`. Supports date filtering, ID search, pagination, and memorable aliases.

## Commands

```bash
/sessions                              # List all sessions (default)
/sessions list --limit 10              # Limit display
/sessions list --date 2026-02-01       # Filter by date
/sessions list --search abc            # Search by session ID
/sessions load <id|alias>              # Load session content
/sessions alias <id> <name>            # Create alias
/sessions alias --remove <name>        # Remove alias
/sessions unalias <name>               # Same as --remove
/sessions info <id|alias>              # Show session details
/sessions aliases                      # List all aliases
```

## Session Information

When loading or inspecting a session, the following is displayed:

- **Filename** and path
- **Statistics**: line count, total items, completed, in progress, file size
- **Aliases**: any memorable names assigned
- **Title** and timestamps

## Key Details

| Item | Detail |
|------|--------|
| Storage location | `~/.claude/sessions/` (Markdown files) |
| Alias storage | `~/.claude/session-aliases.json` |
| ID shortening | First 4-8 characters usually sufficient |
| Best practice | Create aliases for frequently referenced sessions |

## Usage Examples

```bash
/sessions list                          # Browse all sessions
/sessions alias 2026-02-01 today        # Name today's session
/sessions load today                    # Load by alias
/sessions info today                    # View statistics
/sessions alias --remove today          # Clean up alias
```

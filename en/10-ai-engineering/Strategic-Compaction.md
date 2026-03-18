> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Strategic Compaction

## Overview

Strategic compaction suggests manual `/compact` at logical workflow boundaries rather than relying on arbitrary auto-compaction. This preserves critical context through task phases and prevents mid-task context loss during complex multi-step operations.

---

## Why Strategic Over Auto-Compaction?

**Auto-compaction problems:**
- Triggers at arbitrary points, often mid-task
- No awareness of logical task boundaries
- Can interrupt complex multi-step operations

**Strategic compaction benefits:**
- **After exploration, before execution** — compact research context, keep implementation plan
- **After completing a milestone** — fresh start for next phase
- **Before major context shifts** — clear exploration context before different task

---

## How It Works

The `suggest-compact.sh` script runs on PreToolUse (Edit/Write) and:

1. **Tracks tool calls** — counts invocations in session
2. **Threshold detection** — suggests at configurable threshold (default: 50 calls)
3. **Periodic reminders** — reminds every 25 calls after threshold

### Hook Setup

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "tool == \"Edit\" || tool == \"Write\"",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/strategic-compact/suggest-compact.sh"
      }]
    }]
  }
}
```

### Configuration

- `COMPACT_THRESHOLD` env var — tool calls before first suggestion (default: 50)

---

## When to Compact

| Timing | Reason |
|--------|--------|
| After planning phase | Plan is finalized, start fresh for implementation |
| After debugging session | Clear error-resolution context |
| After completing a milestone | Free context space for next phase |
| Before task type switch | Avoid irrelevant context interfering |
| **Never mid-implementation** | Would lose critical working context |

---

## Best Practices

1. **Compact after planning** — once plan is finalized, compact to start fresh
2. **Compact after debugging** — clear error-resolution context before continuing
3. **Don't compact mid-implementation** — preserve context for related changes
4. **Read the suggestion** — the hook tells you *when*, you decide *if*

> Source: [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | Category: Think & Plan

---
name: planning-with-files
description: Manus-style file-based planning for complex tasks. Creates persistent markdown files (task_plan.md, findings.md, progress.md) that survive context resets. Use when starting multi-step tasks requiring >5 tool calls.
---

# Planning with Files

## Overview

Work like Manus: use persistent Markdown files as your "working memory on disk." Three core files (task_plan.md, findings.md, progress.md) survive /clear and provide automatic session recovery.

## Core Metaphor

```
Context Window = RAM (volatile, limited)
Filesystem     = Disk (persistent, unlimited)

→ Anything important gets written to disk.
```

## Three-File System

| File | Purpose | When to Update |
|------|---------|----------------|
| `task_plan.md` | Phases, progress tracking, decisions | After each phase |
| `findings.md` | Research discoveries, technical findings | After ANY discovery |
| `progress.md` | Session log, test results | Throughout session |

## Workflow

1. **Create planning files** — Before any complex task, create all three Markdown files
2. **Check previous session** — Run session-catchup script to recover prior context
3. **Read plan before decisions** — Refreshes goals in your attention window
4. **Update after each phase** — Mark `in_progress` → `complete`, log errors
5. **2-Action Rule** — After every 2 browser/search operations, immediately save key findings to files

## Critical Rules

### 1. Plan First, Execute Second
Never start a complex task without task_plan.md. Non-negotiable.

### 2. The 2-Action Rule
> "After every 2 view/browser/search operations, IMMEDIATELY save key findings to text files."

Prevents visual/multimodal information from being lost in context.

### 3. Read Before Decide
Before major decisions, read the plan file. Keeps goals in your attention window.

### 4. Log ALL Errors

```markdown
## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| FileNotFoundError | 1 | Created default config |
| API timeout | 2 | Added retry logic |
```

### 5. 3-Strike Error Protocol

```
ATTEMPT 1: Diagnose & Fix → Read error, identify root cause
ATTEMPT 2: Alternative Approach → Same error? Different method/tool
ATTEMPT 3: Broader Rethink → Question assumptions, search for solutions
AFTER 3 FAILURES: Escalate to User → Explain attempts, share error
```

## Read vs Write Decision Matrix

| Situation | Action | Reason |
|-----------|--------|--------|
| Just wrote a file | DON'T read | Content still in context |
| Viewed image/PDF | Write findings NOW | Multimodal content won't persist |
| Browser returned data | Write to file | Screenshots don't persist |
| Starting new phase | Read plan/findings | Re-orient direction |
| Resuming after gap | Read all planning files | Recover state |

## 5-Question Reboot Test

If you can answer these, your context management is solid:

| Question | Answer Source |
|----------|---------------|
| Where am I? | Current phase in task_plan.md |
| Where am I going? | Remaining phases |
| What's the goal? | Goal statement in plan |
| What have I learned? | findings.md |
| What have I done? | progress.md |

## When to Use

**Use for:** Multi-step tasks (3+ steps), research, project building, tasks spanning many tool calls

**Skip for:** Simple questions, single-file edits, quick lookups

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Use TodoWrite for persistence | Create task_plan.md file |
| State goals once and forget | Re-read plan before decisions |
| Hide errors and retry silently | Log errors to plan file |
| Stuff everything in context | Store large content in files |
| Start executing immediately | Create plan file FIRST |
| Repeat failed actions | Track attempts, mutate approach |

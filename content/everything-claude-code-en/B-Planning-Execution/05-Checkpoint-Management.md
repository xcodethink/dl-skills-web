> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Checkpoint Management

## Overview

Checkpoint management provides named snapshots within a development workflow for tracking progress, verifying changes, and enabling safe rollbacks. The `/checkpoint` command creates, verifies, and lists checkpoints tied to git state.

---

## Usage

```
/checkpoint [create|verify|list|clear] [name]
```

## Commands

### Create

Creates a named checkpoint:

1. Run `/verify quick` to ensure clean state
2. Create a git stash or commit with the checkpoint name
3. Log to `.claude/checkpoints.log`:
   ```bash
   echo "$(date +%Y-%m-%d-%H:%M) | $CHECKPOINT_NAME | $(git rev-parse --short HEAD)" >> .claude/checkpoints.log
   ```
4. Report checkpoint created

### Verify

Compares current state against a named checkpoint:

- Files added/modified since checkpoint
- Test pass rate: now vs. then
- Coverage: now vs. then
- Build status

Output:
```
CHECKPOINT COMPARISON: $NAME
============================
Files changed: X
Tests: +Y passed / -Z failed
Coverage: +X% / -Y%
Build: [PASS/FAIL]
```

### List

Shows all checkpoints with: name, timestamp, git SHA, status (current/behind/ahead).

### Clear

Removes old checkpoints, keeping the most recent 5.

---

## Typical Workflow

```
[Start]     --> /checkpoint create "feature-start"
    |
[Implement] --> /checkpoint create "core-done"
    |
[Test]      --> /checkpoint verify "core-done"
    |
[Refactor]  --> /checkpoint create "refactor-done"
    |
[PR]        --> /checkpoint verify "feature-start"
```

### Why This Flow Works

1. **Feature start** -- Clean baseline for the entire feature
2. **Core done** -- Milestone marker after core implementation
3. **Verify after testing** -- Confirm test state relative to milestone
4. **Post-refactor checkpoint** -- Prove refactoring introduced no regressions
5. **Final verify against start** -- Full-scope review of all changes before PR

---

## Best Practices

1. Create checkpoints at meaningful milestones, not after every small change
2. Use descriptive names: `auth-backend-done`, `db-migration-applied`
3. Always create checkpoints before and after refactoring
4. Verify against the initial checkpoint before submitting a PR
5. Periodically `clear` to keep the log manageable

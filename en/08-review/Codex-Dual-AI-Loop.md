> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: F-Tools-and-Productivity

---
name: codex-dual-ai-loop
description: Implement a balanced engineering loop between Claude Code and Codex for planning, execution, and cross-review
---

# Codex-Claude Engineering Loop

## Overview

This skill implements a balanced engineering loop where Claude Code handles architecture, planning, and execution, while Codex provides validation and code review. Each AI reviews the other's work in a continuous feedback cycle, with context handoff always maintained by whichever side last cleaned up the code.

## Phase 1: Claude Code Planning

1. Create a detailed plan for the task
2. Break implementation into clear steps
3. Document assumptions and potential issues
4. Output the plan in a structured format

## Phase 2: Codex Plan Validation

1. Ask the user (via `AskUserQuestion`):
   - Model: `gpt-5` or `gpt-5-codex`
   - Reasoning effort: `low`, `medium`, or `high`
2. Send the plan to Codex for validation:
```bash
echo "Review this implementation plan and identify issues:
[Claude's plan]

Check for:
- Logical errors
- Missing edge cases
- Architectural flaws
- Security concerns" | codex exec -m <model> --config model_reasoning_effort="<level>" --sandbox read-only
```
3. Capture Codex feedback

## Phase 3: Feedback Loop

If Codex finds issues:
1. Summarize Codex's concerns to the user
2. Refine the plan based on feedback
3. Ask the user: "Should I revise the plan and re-validate, or proceed with fixes?"
4. Repeat Phase 2 if needed

## Phase 4: Execution

After plan validation passes:
1. Claude implements code using available tools (Edit, Write, Read, etc.)
2. Break implementation into manageable steps
3. Execute each step carefully with proper error handling
4. Document what was implemented

## Phase 5: Post-Change Cross-Review

After each change:
1. Send Claude's implementation to Codex for review:
   - Bug detection
   - Performance issues
   - Best practice validation
   - Security vulnerabilities
2. Claude analyzes Codex feedback and decides:
   - Fix immediately if critical
   - Discuss with user if architectural changes needed
   - Document decisions made

## Phase 6: Iterative Improvement

1. After Codex review, Claude implements necessary fixes
2. For major changes, re-send to Codex for validation
3. Continue the loop until code quality meets standards
4. Use `codex exec resume --last` to continue the validation session:
```bash
echo "Review the updated implementation" | codex exec resume --last
```
   **Note**: resume inherits all settings from the original session (model, reasoning effort, sandbox)

## Recovery Flow When Issues Are Found

**When Codex identifies problems:**
1. Claude analyzes the root cause
2. Implements fixes using available tools
3. Sends updated code back to Codex for verification
4. Repeats until validation passes

**When implementation goes wrong:**
1. Claude reviews the error/issue
2. Adjusts implementation strategy
3. Re-validates with Codex before continuing

## Best Practices

- **Always validate plans** before executing
- **Never skip cross-review**
- **Maintain clear handoffs**
- **Document who did what**
- **Use resume** to preserve session state

## Command Reference

| Phase | Command Pattern | Purpose |
|-------|----------------|---------|
| Validate plan | `echo "plan" \| codex exec --sandbox read-only` | Check logic before coding |
| Implement code | Claude uses Edit/Write/Read tools | Execute the validated plan |
| Review code | `echo "review changes" \| codex exec --sandbox read-only` | Codex validates Claude's implementation |
| Continue review | `echo "next step" \| codex exec resume --last` | Continue validation session |
| Implement fixes | Claude uses Edit/Write tools | Fix issues Codex found |
| Re-validate | `echo "verify fixes" \| codex exec resume --last` | Codex re-checks after fixes |

## Error Handling

1. Stop when Codex returns a non-zero exit code
2. Summarize Codex feedback and ask the user for direction via `AskUserQuestion`
3. Confirm before implementing when:
   - Major architectural changes are needed
   - Multiple files will be affected
   - Breaking changes are required
4. When Codex issues warnings, Claude evaluates severity and determines next steps

## The Perfect Loop

```
Plan (Claude) -> Validate Plan (Codex) -> Feedback ->
Implement (Claude) -> Review Code (Codex) ->
Fix Issues (Claude) -> Re-validate (Codex) -> Repeat until perfect
```

This creates a self-correcting, high-quality engineering system:
- **Claude** handles all code implementation and modification
- **Codex** provides validation, review, and quality assurance

---

## Appendix: Triple AI Loop (Codex-Claude-Cursor Engineering Loop)

The dual AI loop can be extended to a three-way collaborative verification cycle:
- **Claude Code**: Architecture, planning, and final review
- **Codex**: Plan validation (logic/security) and code review (bugs/performance)
- **Cursor Agent**: Code implementation and execution
- **Sequential verification**: Claude plans -> Codex validates -> Cursor implements -> Codex reviews -> Claude final check -> Loop

### Triple Loop Workflow

```
1. Plan (Claude)
   |
2. Validate Plan (Codex) -> Issues found -> Refine plan -> Repeat
   |
3. Implement (Cursor)
   |
4. Code Review (Codex) -> Catch bugs/performance issues
   |
5. Final Review (Claude) -> Architecture check
   |
6. Issues found? -> Fix Plan (Claude) -> Implement Fix (Cursor) -> Back to step 4
   |
7. All clear? -> Done!
```

### Cursor Agent Commands

**New session:**
```bash
cursor-agent --model "<model-name>" -p --force "Implement this plan:
[validated plan]"
```

**Resume session:**
```bash
cursor-agent --resume="<session-id>" -p --force "Continue implementation:
[validated plan]"
```

### Triple Loop Best Practices

- **Always validate plans with Codex** before implementation
- **Never skip Codex code review**
- **Never skip Claude final review**
- **Maintain clear three-way handoffs**
- **Use the same model** for consistency (same Codex model, same Cursor model)
- **Session management**:
  - Always use `--resume` with the same session ID for iterative fixes
  - Record the session ID at start and reuse throughout
  - Use `cursor-agent ls` to find previous sessions
  - Only start a new session for entirely new features

### Triple Loop Command Reference

| Phase | Executor | Command Pattern | Purpose |
|-------|----------|----------------|---------|
| Planning | Claude | TodoWrite, Read, analysis tools | Create detailed plan |
| Validate plan | Codex | `echo "plan" \| codex exec -m <model> --sandbox read-only` | Verify logic/security |
| Refine | Claude | Analyze Codex feedback, update plan | Fix plan issues |
| Session setup | Claude + User | Ask new/resume, `cursor-agent ls` | Set up or resume Cursor session |
| Implement | Cursor | `cursor-agent --model "<model>" -p --force "prompt"` | Execute the validated plan |
| Code review | Codex | `echo "review" \| codex exec --sandbox read-only` | Review bugs/performance |
| Final review | Claude | Read tool, analysis | Claude's final architecture check |
| Fix plan | Claude | Create detailed fix plan | Plan fixes based on all feedback |
| Implement fix | Cursor | `cursor-agent --resume="<id>" -p --force "fix details"` | Apply fixes in same session |
| Re-review | Codex + Claude | Repeat review phases | Verify fixes until perfect |

This creates a triple-verified, self-correcting high-quality engineering system:
- **Claude**: All planning, architecture, and final oversight
- **Codex**: All validation (plan logic + code quality)
- **Cursor Agent**: All implementation and coding

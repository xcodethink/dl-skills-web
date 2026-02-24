> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Claude Code Longform Guide

## Overview

Advanced techniques for productive Claude Code sessions, covering token economics, memory persistence, verification patterns, parallelization strategies, and the compound effects of building reusable workflows. Builds on the Shortform Guide — assumes skills, agents, hooks, and MCPs are already configured.

---

## Token Optimization

### Replace MCPs with CLI + Skills

Most MCPs wrap existing CLIs (GitHub, Supabase, Vercel, Railway). Replace them with skills and commands to save context window and reduce token cost.

**Example:** Instead of the GitHub MCP, create a `/gh-pr` command wrapping `gh pr create`. Instead of Supabase MCP, create skills using the Supabase CLI directly.

### Model Selection Quick Reference

| Task Type | Model | Why |
|-----------|-------|-----|
| Exploration/search | Haiku | Fast, cheap, good enough for finding files |
| Simple edits | Haiku | Single-file changes, clear instructions |
| Multi-file implementation | Sonnet | Best balance for coding |
| Complex architecture | Opus | Deep reasoning needed |
| PR reviews | Sonnet | Context understanding, catches nuance |
| Security analysis | Opus | Can't afford to miss vulnerabilities |
| Writing docs | Haiku | Structure is simple |
| Debugging complex bugs | Opus | Needs entire system in mind |

Default to Sonnet for 90% of coding tasks. Upgrade to Opus when: first attempt failed, task spans 5+ files, architectural decisions, or security-critical code.

### Tool-Specific Optimizations

Replace grep with **mgrep** — ~50% token reduction on average. Use modular codebases with files in hundreds (not thousands) of lines.

---

## Context & Memory Management

### Cross-Session Memory

Create a skill/command that summarizes progress and saves to a `.tmp` file in `.claude/`. Each session creates a new file. The file should contain:
- What approaches worked (with evidence)
- What was tried but didn't work
- What remains to be done

### Strategic Context Clearing

After setting your plan, clear exploration context. Disable auto-compact; manually compact at logical intervals.

### Dynamic System Prompt Injection

```bash
claude --system-prompt "$(cat memory.md)"

# Aliases for different modes
alias claude-dev='claude --system-prompt "$(cat ~/.claude/contexts/dev.md)"'
alias claude-review='claude --system-prompt "$(cat ~/.claude/contexts/review.md)"'
```

System prompt content has highest authority, followed by user messages, then tool results.

### Memory Persistence Hooks

- **PreCompact Hook**: Save important state before context compaction
- **Stop Hook**: Persist learnings at session end
- **SessionStart Hook**: Auto-load previous context on new session

---

## Continuous Learning

When you repeat the same prompt and Claude hits the same problem — those patterns must be appended to skills.

**Design decision:** Use a **Stop hook** (not UserPromptSubmit). UserPromptSubmit adds latency to every message. Stop runs once at session end — lightweight, no slowdown during sessions.

---

## Verification Loops & Evals

### Benchmarking Skills

Fork the conversation, create a worktree without the skill in one branch, compare diffs at the end.

### Eval Pattern Types

- **Checkpoint-Based**: Set explicit checkpoints, verify against criteria, fix before proceeding
- **Continuous**: Run every N minutes or after major changes (full test suite + lint)

### Key Metrics

```
pass@k: At least ONE of k attempts succeeds
        k=1: 70%  k=3: 91%  k=5: 97%

pass^k: ALL k attempts must succeed
        k=1: 70%  k=3: 34%  k=5: 17%
```

Use **pass@k** when you need it to work. Use **pass^k** when consistency is essential.

---

## Parallelization

### Principles

- Main chat for code changes, forks for questions/research
- Goal: **maximum output with minimum viable parallelization**
- Use Git worktrees for overlapping parallel Claude instances
- Name all chats with `/rename`

### Git Worktrees

```bash
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b
# Each worktree gets its own Claude instance
```

### The Cascade Method

- Open new tasks in new tabs to the right
- Sweep left to right, oldest to newest
- Focus on at most 3-4 tasks at a time

---

## Groundwork: The Two-Instance Kickoff

**Instance 1 (Scaffolding Agent):** Project structure, configs (CLAUDE.md, rules, agents)

**Instance 2 (Deep Research Agent):** Service connections, detailed PRD, architecture diagrams, documentation references

### llms.txt Pattern

Append `/llms.txt` to documentation URLs for clean, LLM-optimized text.

### Philosophy: Build Reusable Patterns

Invest in: subagents, skills, commands, planning patterns, MCP tools, context engineering patterns. Tedious to build, but produces a wild compounding effect.

---

## Agents & Sub-Agents Best Practices

### The Sub-Agent Context Problem

Sub-agents save context by returning summaries, but they lack the orchestrator's semantic context. **Pass objective context, not just the query.**

### Iterative Retrieval Pattern

1. Orchestrator evaluates every sub-agent return
2. Ask follow-up questions before accepting
3. Sub-agent goes back to source, returns answers
4. Loop until sufficient (max 3 cycles)

### Orchestrator with Sequential Phases

```
Phase 1: RESEARCH (Explore agent) → research-summary.md
Phase 2: PLAN (planner agent) → plan.md
Phase 3: IMPLEMENT (tdd-guide agent) → code changes
Phase 4: REVIEW (code-reviewer agent) → review-comments.md
Phase 5: VERIFY (build-error-resolver if needed) → done or loop back
```

**Rules:** Each agent gets ONE input and produces ONE output. Outputs become inputs for the next phase. Never skip phases. Use `/clear` between agents. Store intermediate outputs in files.

---

## Resources

- [claude-flow](https://github.com/ruvnet/claude-flow) — Enterprise orchestration with 54+ agents
- [continuous-learning skill](https://github.com/affaan-m/everything-claude-code/tree/main/skills/continuous-learning)
- [Session reflection pattern](https://rlancemartin.github.io/2025/12/01/claude_diary/)
- [System prompts collection](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) (110k stars)
- Anthropic Academy: anthropic.skilljar.com

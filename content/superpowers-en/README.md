# Superpowers Skills - Curated English Edition

> Original repo: [obra/superpowers](https://github.com/obra/superpowers)
> Author: Jesse Vincent (obra)
> Curated by: DL Skills Project

## Overview

A complete **AI-driven development workflow** system, forming a closed loop from ideation to deployment. Each skill has been battle-tested with TDD-style pressure testing, featuring "Iron Laws", "Anti-Rationalization Tables", and "Pressure Tests" to ensure AI strictly follows best practices even under pressure.

```
Ideation → Design → Plan → Execute → Code Review → Branch Completion
   ↑                                                        ↓
   └──────────── Verification & Debugging (throughout) ─────┘
```

---

## Directory

### A. Development Methodology (Core Discipline)

| File | Original Skill | Core Idea |
|------|---------------|-----------|
| [01-Test-Driven-Development](A-Development-Methodology/01-Test-Driven-Development.md) | test-driven-development | Iron Law: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST |
| [02-Systematic-Debugging](A-Development-Methodology/02-Systematic-Debugging.md) | systematic-debugging | Iron Law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST |
| [03-Verification-Before-Completion](A-Development-Methodology/03-Verification-Before-Completion.md) | verification-before-completion | Iron Law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE |

**Highlight:** Each skill includes anti-rationalization tables that anticipate and block AI shortcuts.

---

### B. Project Planning & Execution

| File | Original Skill | Core Idea |
|------|---------------|-----------|
| [01-Brainstorming](B-Project-Planning-Execution/01-Brainstorming.md) | brainstorming | Hard gate: NO implementation before design approval |
| [02-Writing-Plans](B-Project-Planning-Execution/02-Writing-Plans.md) | writing-plans | Zero-context principle: anyone can execute the plan |
| [03-Executing-Plans](B-Project-Planning-Execution/03-Executing-Plans.md) | executing-plans | Batch execution with review checkpoints every 3 tasks |

---

### C. Code Review

| File | Original Skill | Core Idea |
|------|---------------|-----------|
| [01-Requesting-Code-Review](C-Code-Review/01-Requesting-Code-Review.md) | requesting-code-review | Severity-based: Critical / Important / Minor |
| [02-Receiving-Code-Review](C-Code-Review/02-Receiving-Code-Review.md) | receiving-code-review | No performative agreement - push back with technical reasoning |

**Highlight:** Explicitly forbids AI sycophancy — no "You're absolutely right!" followed by superficial fixes.

---

### D. Agent Orchestration (Advanced)

| File | Original Skill | Core Idea |
|------|---------------|-----------|
| [01-Dispatching-Parallel-Agents](D-Agent-Orchestration/01-Dispatching-Parallel-Agents.md) | dispatching-parallel-agents | One agent per problem domain, concurrent execution |
| [02-Subagent-Driven-Development](D-Agent-Orchestration/02-Subagent-Driven-Development.md) | subagent-driven-development | Implementer → Spec Review → Quality Review (3-layer verification) |

**Highlight:** Two-stage review — spec compliance (did they build what was asked?) + code quality (is it well-built?), with explicit "Do not trust the report" directive.

---

### E. Git Workflow

| File | Original Skill | Core Idea |
|------|---------------|-----------|
| [01-Using-Git-Worktrees](E-Git-Workflow/01-Using-Git-Worktrees.md) | using-git-worktrees | Auto-detect project type, create isolated workspace |
| [02-Finishing-Development-Branch](E-Git-Workflow/02-Finishing-Development-Branch.md) | finishing-a-development-branch | 4 options: Merge / PR / Keep / Discard |

---

### F. Meta Skills (How to Write Skills)

| File | Original Skill | Core Idea |
|------|---------------|-----------|
| [01-Using-Superpowers](F-Meta-Skills/01-Using-Superpowers.md) | using-superpowers | Even 1% chance of relevance = MUST invoke |
| [02-Writing-Skills](F-Meta-Skills/02-Writing-Skills.md) | writing-skills | TDD applied to documentation |
| [03-Anthropic-Best-Practices](F-Meta-Skills/03-Anthropic-Best-Practices.md) | anthropic-best-practices | Official guide: conciseness, freedom levels, progressive disclosure |
| [04-Persuasion-Principles](F-Meta-Skills/04-Persuasion-Principles.md) | persuasion-principles | Psychology-backed skill design (Cialdini + Meincke et al. 2025) |

---

## Key Design Patterns

The 5 most valuable design patterns from this system:

1. **"Iron Law" Pattern** — Each critical skill has an inviolable core rule, emphasized with caps and bold
2. **Anti-Rationalization Tables** — Predict AI excuses and block them one by one
3. **Pressure Testing** — Validate skills under realistic scenarios (production outage, authority pressure, exhaustion)
4. **Two-Stage Review** — Spec compliance (built correctly?) + Quality review (built well?), by independent agents
5. **Zero-Context Principle** — Plans are written so anyone can execute them without implicit context

---

## Stats

- **Original repo:** 14 skill directories, 31+ markdown files
- **Curated files:** 16 English files across 6 categories
- **Coverage:** 100% (all skills and sub-technique files merged and organized)

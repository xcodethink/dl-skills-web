> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Continuous Learning System

## Overview

A system that automatically extracts reusable patterns from Claude Code sessions and saves them as learned skills. Version 1 uses a Stop hook for end-of-session analysis. Version 2 introduces an "instinct" architecture with real-time observation via hooks, confidence scoring, evolution, and cross-user sharing.

---

## Part 1: v1 — Session-End Learning

### How It Works

Runs as a **Stop hook** at session end:

1. **Session Evaluation**: Check if session has enough messages (default: 10+)
2. **Pattern Detection**: Identify extractable patterns
3. **Skill Extraction**: Save useful patterns to `~/.claude/skills/learned/`

### Pattern Types

| Pattern | Description |
|---------|-------------|
| `error_resolution` | How specific errors were resolved |
| `user_corrections` | Patterns from user corrections |
| `workarounds` | Framework/library quirks and solutions |
| `debugging_techniques` | Effective debugging approaches |
| `project_specific` | Project-specific conventions |

### Hook Setup

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**Why Stop hook?** Lightweight (runs once), non-blocking (no per-message latency), and has access to full session context.

---

## Part 2: v2 — Instinct-Based Architecture

### v1 vs v2 Comparison

| Feature | v1 | v2 |
|---------|----|----|
| Observation | Stop hook (session end) | PreToolUse/PostToolUse (100% reliable) |
| Analysis | Main context | Background agent (Haiku) |
| Granularity | Full skills | Atomic "instincts" |
| Confidence | None | 0.3-0.9 weighted |
| Evolution | Direct to skill | Instincts -> cluster -> skill/command/agent |
| Sharing | None | Export/import instincts |

### The Instinct Model

An instinct is a small, atomic learned behavior:

```yaml
---
id: prefer-functional-style
trigger: "when writing new functions"
confidence: 0.7
domain: "code-style"
source: "session-observation"
---
```

**Properties**: Atomic (one trigger, one action), confidence-weighted, domain-tagged, evidence-backed.

### Architecture Flow

```
Session Activity
  -> Hooks capture prompts + tool use (100% reliable)
  -> observations.jsonl
  -> Observer agent (background, Haiku) detects patterns
  -> Creates/updates instincts in instincts/personal/
  -> /evolve clusters related instincts into skills/commands/agents
```

### Quick Start

1. **Enable observation hooks** in `~/.claude/settings.json`
2. **Initialize directories**: `mkdir -p ~/.claude/homunculus/{instincts/{personal,inherited},evolved/{agents,skills,commands}}`
3. **Use instinct commands**: `/instinct-status`, `/evolve`, `/instinct-export`, `/instinct-import`

### Confidence Scoring

| Score | Meaning | Behavior |
|-------|---------|----------|
| 0.3 | Tentative | Suggested, not enforced |
| 0.5 | Moderate | Applied when relevant |
| 0.7 | Strong | Auto-approved |
| 0.9 | Near-certain | Core behavior |

**Increases**: Repeated observation, user doesn't correct, similar instincts agree.
**Decreases**: User corrects, pattern not observed, contradicting evidence.

### Why Hooks Over Skills for Observation?

Skills fire ~50-80% of the time based on Claude's judgment. Hooks fire **100% deterministically** — every tool call is observed, no patterns missed.

---

## Part 3: Commands

### `/learn` — Extract Patterns Mid-Session

Run when you've solved a non-trivial problem. Extracts error resolution patterns, debugging techniques, workarounds, and project-specific conventions. Saves to `~/.claude/skills/learned/`.

### `/learn-eval` — Extract with Quality Gate

Extends `/learn` with a 5-dimension quality rubric (Specificity, Actionability, Scope Fit, Non-redundancy, Coverage) scored 1-5. All dimensions must be >= 3 before saving. Also determines save location: Global vs Project.

### `/instinct-status` — View Learned Instincts

Shows all instincts grouped by domain with confidence bars and source tracking.

### `/instinct-export` — Share Instincts

Exports instincts to YAML format. Includes trigger patterns, actions, confidence scores. Excludes actual code, file paths, and personal identifiers.

### `/instinct-import` — Import Instincts

Imports from teammates, Skill Creator, or community. Handles duplicates (higher confidence wins), conflicts (skip by default), and source tracking.

### `/evolve` — Cluster Instincts into Higher Structures

| Target | When |
|--------|------|
| **Command** | Instincts describe user-invoked actions |
| **Skill** | Instincts describe auto-triggered behaviors |
| **Agent** | Instincts describe complex multi-step processes |

Requires 3+ related instincts to form a cluster (configurable).

---

## Part 4: Observer Agent

Background agent (Haiku model) analyzing observations to detect patterns:

1. **User corrections** — "No, use X instead of Y" -> instinct
2. **Error resolutions** — Error followed by fix -> instinct
3. **Repeated workflows** — Same tool sequence used multiple times -> workflow instinct
4. **Tool preferences** — Consistent tool choices -> instinct

**Guidelines**: Be conservative (3+ observations), be specific (narrow triggers), track evidence, respect privacy (patterns only, no code), merge similar instincts.

---

## File Structure

```
~/.claude/homunculus/
├── identity.json
├── observations.jsonl
├── instincts/
│   ├── personal/
│   └── inherited/
└── evolved/
    ├── agents/
    ├── skills/
    └── commands/
```

> *Instinct-based learning: teaching Claude your patterns, one observation at a time.*

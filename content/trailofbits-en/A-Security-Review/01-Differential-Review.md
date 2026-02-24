> Source: [trailofbits/skills](https://github.com/trailofbits/skills) | Category: Review & Verify

---
name: differential-review
description: Performs security-focused differential review of code changes (PRs, commits, diffs). Adapts analysis depth to codebase size, uses git history for context, calculates blast radius.
---

# Differential Security Review

## Overview

Security-focused code review skill by Trail of Bits. Analyzes PRs, commits, and diffs for security issues, automatically detecting and preventing security regressions.

## Core Principles

1. **Risk-First**: Focus on auth, crypto, value transfer, external calls
2. **Evidence-Based**: Every finding backed by git history, line numbers, attack scenarios
3. **Adaptive**: Scale analysis to codebase size (SMALL/MEDIUM/LARGE)
4. **Honest**: Explicitly state coverage limits and confidence level
5. **Output-Driven**: Always generate comprehensive markdown report file

## Rationalizations to Reject

| Rationalization | Why It's Wrong | Required Action |
|-----------------|----------------|-----------------|
| "Small PR, quick review" | Heartbleed was 2 lines | Classify by RISK, not size |
| "I know this codebase" | Familiarity breeds blind spots | Build explicit baseline context |
| "Git history takes too long" | History reveals regressions | Never skip Phase 1 |
| "Blast radius is obvious" | You'll miss transitive callers | Calculate quantitatively |
| "Just a refactor, no security impact" | Refactors break invariants | Analyze as HIGH until proven LOW |

## Codebase Size Strategy

| Size | Strategy | Approach |
|------|----------|----------|
| SMALL (< 20 files) | DEEP | Read all deps, full git blame |
| MEDIUM (20-200) | FOCUSED | 1-hop deps, priority files |
| LARGE (200+) | SURGICAL | Critical paths only |

## Risk Level Triggers

| Risk Level | Triggers |
|------------|----------|
| **HIGH** | Auth, crypto, external calls, value transfer, validation removal |
| **MEDIUM** | Business logic, state changes, new public APIs |
| **LOW** | Comments, tests, UI, logging |

## Workflow

```
Pre-Analysis → Phase 0: Triage → Phase 1: Code Analysis → Phase 2: Test Coverage
    ↓              ↓                    ↓                        ↓
Phase 3: Blast Radius → Phase 4: Deep Context → Phase 5: Adversarial → Phase 6: Report
```

## Red Flags (Immediate Escalation)

- Removed code from "security", "CVE", or "fix" commits
- Access control modifiers removed (onlyOwner, internal → external)
- Validation removed without replacement
- External calls added without checks
- High blast radius (50+ callers) + HIGH risk change

## Quality Checklist

- [ ] All changed files analyzed
- [ ] Git blame on removed security code
- [ ] Blast radius calculated for HIGH risk
- [ ] Attack scenarios are concrete (not generic)
- [ ] Findings reference specific line numbers + commits
- [ ] Report file generated

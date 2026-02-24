> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Iterative Retrieval

## Overview

A progressive context retrieval pattern that solves the "subagent context problem" in multi-agent workflows. Subagents don't know what context they need until they start working. Iterative retrieval uses a 4-phase Dispatch-Evaluate-Refine-Loop cycle to progressively discover the most relevant files in at most 3 iterations.

---

## The Problem

Subagents are spawned with limited context and don't know which files contain relevant code, what patterns exist, or what terminology the project uses.

Standard approaches all fail:
- **Send everything**: Exceeds context limits
- **Send nothing**: Agent lacks critical information
- **Guess what's needed**: Often wrong

---

## The Solution: 4-Phase Loop

```
DISPATCH -> EVALUATE -> REFINE -> LOOP (max 3 cycles)
```

### Phase 1: DISPATCH

Initial broad query to gather candidate files:

```javascript
const initialQuery = {
  patterns: ['src/**/*.ts', 'lib/**/*.ts'],
  keywords: ['authentication', 'user', 'session'],
  excludes: ['*.test.ts', '*.spec.ts']
};
const candidates = await retrieveFiles(initialQuery);
```

### Phase 2: EVALUATE

Score retrieved content for relevance:

| Level | Score | Meaning |
|-------|-------|---------|
| High | 0.8-1.0 | Directly implements target functionality |
| Medium | 0.5-0.7 | Contains related patterns or types |
| Low | 0.2-0.4 | Tangentially related |
| None | 0-0.2 | Not relevant, exclude |

Also identify missing context (gaps) for the next cycle.

### Phase 3: REFINE

Update search criteria based on evaluation:
- Add new patterns discovered in high-relevance files
- Add terminology found in the codebase
- Exclude confirmed irrelevant paths
- Target specific gaps identified in evaluation

### Phase 4: LOOP

Repeat with refined criteria. Stop when:
- 3+ high-relevance files found AND no critical gaps remain
- Maximum 3 cycles reached

---

## Examples

### Bug Fix Context

```
Task: "Fix authentication token expiry bug"

Cycle 1: Search "token", "auth", "expiry" -> auth.ts (0.9), tokens.ts (0.8), user.ts (0.3)
Cycle 2: Add "refresh", "jwt" -> session-manager.ts (0.95), jwt-utils.ts (0.85)
Result: 4 highly relevant files, sufficient context
```

### Feature Implementation

```
Task: "Add rate limiting to API endpoints"

Cycle 1: Search "rate", "limit" -> No matches (codebase uses "throttle")
Cycle 2: Add "throttle", "middleware" -> throttle.ts (0.9), middleware/index.ts (0.7)
Cycle 3: Search "router", "express" -> router-setup.ts (0.8)
Result: 3 relevant files with correct codebase terminology
```

---

## Usage in Agent Prompts

```markdown
When retrieving context for this task:
1. Start with broad keyword search
2. Evaluate each file's relevance (0-1 scale)
3. Identify what context is still missing
4. Refine search criteria and repeat (max 3 cycles)
5. Return files with relevance >= 0.7
```

---

## Best Practices

1. **Start broad, narrow progressively** — don't over-specify initial queries
2. **Learn codebase terminology** — first cycle often reveals naming conventions
3. **Track what's missing** — explicit gap identification drives refinement
4. **Stop at "good enough"** — 3 high-relevance files beats 10 mediocre ones
5. **Exclude confidently** — low-relevance files won't become relevant

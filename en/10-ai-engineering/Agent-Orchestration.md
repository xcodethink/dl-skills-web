> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Agent Orchestration

## Overview

Agent Orchestration chains multiple specialized agents into automated pipelines for complex tasks. The `/orchestrate` command defines workflow types, and structured handoff documents pass context between agents, enabling end-to-end feature development, bug fixing, refactoring, and security review workflows.

---

## Workflow Types

| Workflow | Agent Chain | Use Case |
|---|---|---|
| `feature` | planner -> tdd-guide -> code-reviewer -> security-reviewer | Full feature implementation |
| `bugfix` | planner -> tdd-guide -> code-reviewer | Bug investigation and fix |
| `refactor` | architect -> code-reviewer -> tdd-guide | Safe refactoring |
| `security` | security-reviewer -> code-reviewer -> architect | Security-focused review |
| `custom` | User-defined sequence | Any combination |

## Usage

```
/orchestrate [workflow-type] [task-description]
/orchestrate custom "architect,tdd-guide,code-reviewer" "Redesign caching layer"
```

---

## Execution Pattern

For each agent in the workflow:

1. **Invoke** with context from the previous agent
2. **Collect** output as a structured handoff document
3. **Pass** to the next agent in chain
4. **Aggregate** results into a final report

### Handoff Document Format

```markdown
## HANDOFF: [previous-agent] -> [next-agent]

### Context
[Summary of what was done]

### Findings
[Key discoveries or decisions]

### Files Modified
[List of files touched]

### Open Questions
[Unresolved items for next agent]

### Recommendations
[Suggested next steps]
```

---

## Feature Workflow Example

`/orchestrate feature "Add user authentication"` executes:

1. **Planner** -- Analyzes requirements, creates plan, identifies dependencies
2. **TDD Guide** -- Reads planner handoff, writes tests first, implements to pass
3. **Code Reviewer** -- Reviews implementation, checks for issues, suggests improvements
4. **Security Reviewer** -- Security audit, vulnerability check, final approval

### Final Report Format

```
ORCHESTRATION REPORT
====================
Workflow: feature
Task: Add user authentication
Agents: planner -> tdd-guide -> code-reviewer -> security-reviewer

SUMMARY: [One paragraph]
AGENT OUTPUTS: [Summary per agent]
FILES CHANGED: [All modified files]
TEST RESULTS: [Pass/fail summary]
SECURITY STATUS: [Findings]
RECOMMENDATION: [SHIP / NEEDS WORK / BLOCKED]
```

---

## Parallel Execution

For independent checks, run agents simultaneously:

```markdown
### Parallel Phase
- code-reviewer (quality)
- security-reviewer (security)
- architect (design)

### Merge Results
Combine outputs into single report
```

---

## Available Agents

| Agent | Purpose | Trigger |
|---|---|---|
| planner | Implementation planning | Complex features, refactoring |
| architect | System design | Architectural decisions |
| tdd-guide | Test-driven development | New features, bug fixes |
| code-reviewer | Code review | After writing code |
| security-reviewer | Security analysis | Before commits |
| build-error-resolver | Fix build errors | Build failures |
| e2e-runner | E2E testing | Critical user flows |
| refactor-cleaner | Dead code cleanup | Code maintenance |
| doc-updater | Documentation | Updating docs |

### Auto-Activation (No User Prompt Needed)

- Complex feature requests -> **planner**
- Code just written/modified -> **code-reviewer**
- Bug fix or new feature -> **tdd-guide**
- Architectural decision -> **architect**

---

## Multi-Perspective Analysis

For complex problems, use split-role sub-agents:

- **Factual Reviewer** -- Verify accuracy
- **Senior Engineer** -- Engineering quality
- **Security Expert** -- Risk assessment
- **Consistency Reviewer** -- Code/style consistency
- **Redundancy Checker** -- Detect duplication

---

## Tips

1. Start with **planner** for complex features
2. Always include **code-reviewer** before merge
3. Use **security-reviewer** for auth/payment/PII
4. Keep handoffs concise -- focus on what the next agent needs
5. Run verification between agents when needed

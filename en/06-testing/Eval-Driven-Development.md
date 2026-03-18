> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Eval-Driven Development (EDD)

## Overview

Eval-Driven Development treats evals as the "unit tests of AI development." Define expected behavior before implementation, run evals continuously during development, track regressions with each change, and measure reliability with pass@k metrics.

---

## Eval Types

### Capability Evals

Test if Claude can do something it couldn't before:

```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion 1
  - [ ] Criterion 2
Expected Output: Description of expected result
```

### Regression Evals

Ensure changes don't break existing functionality:

```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

---

## Grader Types

| Grader | Use Case | Characteristic |
|--------|----------|---------------|
| **Code-Based** | Deterministic checks (build, test, pattern match) | Reliable, fast |
| **Model-Based** | Open-ended output evaluation (quality, structure) | Flexible, scores 1-5 |
| **Human** | Security reviews, high-risk changes | Most thorough |

---

## Metrics

### pass@k — "At least one success in k attempts"

- **pass@1**: First-attempt success rate
- **pass@3**: Success within 3 attempts
- Typical target: pass@3 > 90%

### pass^k — "All k trials succeed"

- Higher reliability bar
- **pass^3**: 3 consecutive successes
- Use for critical paths

---

## Workflow

### 1. Define (Before Coding)

```markdown
## EVAL DEFINITION: feature-xyz

### Capability Evals
1. Can create new user account
2. Can validate email format
3. Can hash password securely

### Regression Evals
1. Existing login still works
2. Session management unchanged

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

### 2. Implement

Write code to pass the defined evals.

### 3. Evaluate

Run each capability eval and regression test, recording PASS/FAIL.

### 4. Report

```
EVAL REPORT: feature-xyz
========================
Capability: 3/3 passed (pass@3: 100%)
Regression: 3/3 passed (pass^3: 100%)
Status: SHIP IT
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `/eval define <name>` | Create eval definition at `.claude/evals/` |
| `/eval check <name>` | Run evals and report current status |
| `/eval report <name>` | Generate comprehensive report |
| `/eval list` | Show all eval definitions with status |
| `/eval clean` | Remove old eval logs (keeps last 10) |

---

## Eval Storage

```
.claude/
  evals/
    feature-xyz.md      # Eval definition
    feature-xyz.log     # Run history
    baseline.json       # Regression baselines
```

---

## Best Practices

1. **Define evals BEFORE coding** — forces clear thinking about success criteria
2. **Run evals frequently** — catch regressions early
3. **Track pass@k over time** — monitor reliability trends
4. **Use code graders when possible** — deterministic > probabilistic
5. **Human review for security** — never fully automate security checks
6. **Keep evals fast** — slow evals don't get run
7. **Version evals with code** — evals are first-class artifacts

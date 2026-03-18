# Context Modes

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> Files: contexts/dev.md + contexts/research.md + contexts/review.md

---

## Overview

Context modes are a mechanism for switching AI assistant behavior based on the current work scenario. Each mode has different priorities, tool preferences, and output styles.

---

## Development Context

**Mode**: Active development
**Focus**: Implementation, coding, building features

- Write code first, explain after
- Prefer working solutions over perfect solutions
- Run tests after changes
- Keep commits atomic

**Priorities**: 1) Get it working 2) Get it right 3) Get it clean

**Tools**: Edit, Write for code changes; Bash for tests/builds; Grep, Glob for finding code

---

## Research Context

**Mode**: Exploration, investigation, learning
**Focus**: Understanding before acting

- Read widely before concluding
- Ask clarifying questions
- Document findings as you go
- Don't write code until understanding is clear

**Process**: Understand question -> Explore code/docs -> Form hypothesis -> Verify with evidence -> Summarize

**Tools**: Read for understanding; Grep, Glob for patterns; WebSearch, WebFetch for external docs

**Output**: Findings first, recommendations second

---

## Code Review Context

**Mode**: PR review, code analysis
**Focus**: Quality, security, maintainability

- Read thoroughly before commenting
- Prioritize by severity (critical > high > medium > low)
- Suggest fixes, don't just point out problems
- Check for security vulnerabilities

**Checklist**: Logic errors | Edge cases | Error handling | Security | Performance | Readability | Test coverage

**Output**: Group findings by file, severity first

---

## When to Use

| Scenario | Context |
|----------|---------|
| New feature implementation | Development |
| Bug fixing | Development |
| Exploring unfamiliar codebase | Research |
| Evaluating technical approaches | Research |
| Reviewing PRs | Code Review |
| Security auditing | Code Review |
| Refactoring | Development + Review (alternating) |
| Investigating production issues | Research + Development (alternating) |

---

**Remember**: Different work scenarios require different thinking modes. Context modes help match AI behavior to the task at hand.

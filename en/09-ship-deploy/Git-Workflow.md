> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Git Workflow

## Overview

A structured Git workflow covering commit message conventions, Pull Request best practices, and a complete feature implementation pipeline that integrates planning, TDD, and code review.

## Commit Message Format

```
<type>: <description>

<optional body>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

## Pull Request Workflow

1. Analyze full commit history (not just the latest commit)
2. Use `git diff [base-branch]...HEAD` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with `-u` flag if new branch

## Feature Implementation Pipeline

| Phase | Agent | Key Actions |
|-------|-------|-------------|
| 1. Plan | **planner** | Create implementation plan, identify dependencies and risks, break into phases |
| 2. TDD | **tdd-guide** | Write tests first (RED), implement to pass (GREEN), refactor (IMPROVE), verify 80%+ coverage |
| 3. Review | **code-reviewer** | Address CRITICAL and HIGH issues immediately, fix MEDIUM when possible |
| 4. Commit | -- | Detailed messages following conventional commits format |

> Source: DL Skills Curated | Category: Ship & Deploy

---
name: git-conventional-workflow
description: Use when establishing Git conventions for commit messages, branch naming, PR workflows, and repository hygiene.
---

# Git Conventional Workflow

## Overview

Git is not just version control — it is collaboration infrastructure. Messy commit history, inconsistent branch names, and unreviewed merges gradually turn a codebase into an archaeology site. This skill covers the most critical Git best practices for daily development.

## When to Use

- Establishing Git workflow conventions for a team
- Configuring Git hooks and commit checks
- Choosing a branch strategy (Trunk-based / Git Flow / GitHub Flow)
- Reviewing whether PR processes are effective

## Commit Message Convention (Conventional Commits)

Format: `<type>(<scope>): <description>`

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 login` |
| `fix` | Bug fix | `fix(cart): resolve quantity overflow` |
| `docs` | Documentation | `docs(readme): update install guide` |
| `refactor` | Refactor (no behavior change) | `refactor(api): extract validation layer` |
| `test` | Test-related | `test(user): add edge case coverage` |
| `chore` | Build/tooling/deps | `chore(deps): bump express to 4.19` |

Rules: imperative mood (add, not added), lowercase first letter, no period, under 50 characters.

## Branch Naming

Format: `<type>/<brief-description>`

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New feature | `feature/user-profile-page` |
| `bugfix/` | Bug fix | `bugfix/login-redirect-loop` |
| `hotfix/` | Production emergency | `hotfix/payment-crash` |
| `release/` | Release preparation | `release/2.1.0` |

## Branch Strategy Decision

| Strategy | Best For | Key Trait |
|----------|----------|-----------|
| Trunk-based | Small teams, continuous deploy | Everyone commits to main, feature flags |
| Git Flow | Scheduled releases | develop + release + hotfix branches, strict process |
| GitHub Flow | SaaS, continuous delivery | Branch from main, PR back to main, simple |

Under 5 developers with continuous deploy: Trunk-based. Versioned releases: Git Flow. Everything else: GitHub Flow.

## PR Best Practices

1. **Keep PRs small and focused** — Under 400 lines changed, one concern per PR
2. **Descriptive titles** — Use Conventional Commits format: `feat(auth): add two-factor authentication`
3. **Link issues** — Reference in description: `Closes #42`
4. **Review checklist** — Every PR must verify: correct behavior, test coverage, no security issues, docs updated
5. **Require review** — At least one approval before merge, no self-merging

## Pre-commit Hooks

Use `lint-staged` + `commitlint` + format checks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Common Operations

- **Interactive rebase (squash)**: `git rebase -i HEAD~3` — combine trivial commits into one meaningful commit
- **Cherry-pick**: `git cherry-pick <commit-hash>` — take a single commit from another branch
- **Stash patterns**: `git stash push -m "wip: feature-x"` to save / `git stash pop` to restore

## Git Hygiene

- Delete branches after merge: `git branch -d feature/xxx`
- Tag every release: `git tag -a v1.2.0 -m "Release 1.2.0"`
- Protect main: no direct pushes, PRs only
- Prune stale remotes regularly: `git fetch --prune`

## MUST DO / MUST NOT

**MUST DO:**
- Atomic commits: each commit is a complete, independently understandable change
- Meaningful messages: the message alone tells what changed and why
- All changes go through PRs, never push directly to main
- Ensure CI passes before merging

**MUST NOT:**
- Force push shared branches (`git push --force` overwrites others' work)
- Commit `.env` files, secrets, or certificates
- Mix formatting changes with logic changes in the same commit
- Leave large numbers of stale unmerged branches

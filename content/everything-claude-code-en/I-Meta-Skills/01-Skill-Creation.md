> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Skill Creation — Local Skill Generation

## Overview

Analyze your repository's git history to extract coding patterns and generate SKILL.md files that teach Claude your team's practices. This is the local equivalent of the Skill Creator GitHub App.

## Usage

```bash
/skill-create                    # Analyze current repo
/skill-create --commits 100      # Analyze last 100 commits
/skill-create --output ./skills  # Custom output directory
/skill-create --instincts        # Also generate instincts for continuous-learning-v2
```

## How It Works

1. **Parse Git History** — Analyze commits, file changes, and patterns
2. **Detect Patterns** — Identify recurring workflows and conventions
3. **Generate SKILL.md** — Create valid Claude Code skill files
4. **Optionally Create Instincts** — For the continuous-learning-v2 system

## Analysis Steps

### Step 1: Gather Git Data

```bash
git log --oneline -n ${COMMITS:-200} --name-only --pretty=format:"%H|%s|%ad" --date=short
git log --oneline -n 200 --name-only | grep -v "^$" | grep -v "^[a-f0-9]" | sort | uniq -c | sort -rn | head -20
git log --oneline -n 200 | cut -d' ' -f2- | head -50
```

### Step 2: Detect Patterns

| Pattern | Detection Method |
|---------|-----------------|
| **Commit conventions** | Regex on commit messages (feat:, fix:, chore:) |
| **File co-changes** | Files that always change together |
| **Workflow sequences** | Repeated file change patterns |
| **Architecture** | Folder structure and naming conventions |
| **Testing patterns** | Test file locations, naming, coverage |

### Step 3: Generate SKILL.md

```markdown
---
name: {repo-name}-patterns
description: Coding patterns extracted from {repo-name}
version: 1.0.0
source: local-git-analysis
analyzed_commits: {count}
---

# {Repo Name} Patterns

## Commit Conventions
## Code Architecture
## Workflows
## Testing Patterns
```

### Step 4: Generate Instincts (with --instincts)

```yaml
---
id: {repo}-commit-convention
trigger: "when writing a commit message"
confidence: 0.8
domain: git
source: local-repo-analysis
---

# Use Conventional Commits

## Action
Prefix commits with: feat:, fix:, chore:, docs:, test:, refactor:

## Evidence
- Analyzed {n} commits
- {percentage}% follow conventional commit format
```

## GitHub App Integration

For advanced features (10k+ commits, team sharing, auto-PRs), use the [Skill Creator GitHub App](https://github.com/apps/skill-creator).

## Related Commands

- `/instinct-import` — Import generated instincts
- `/instinct-status` — View learned instincts
- `/evolve` — Cluster instincts into skills/commands/agents

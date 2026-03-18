> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Development Tools

---
name: template-skill
description: A blank starter template for creating new Claude skills -- provides the minimal required SKILL.md structure with YAML frontmatter placeholders.
---

# Skill Template

## Overview

This is the minimal starting point for any new Claude skill. It contains only the required YAML frontmatter fields (`name` and `description`) and a placeholder for the instruction body. Use this as a reference when creating skills from scratch without the `init_skill.py` scaffolding tool.

## Template Structure

```yaml
---
name: your-skill-name-kebab-case
description: Replace with a description of the skill and when Claude should use it.
---

# Skill Title

Insert instructions below.
```

## Required Fields

| Field | Format | Purpose |
|---|---|---|
| `name` | kebab-case string | Unique identifier for the skill |
| `description` | One or more sentences | Determines when Claude activates the skill; be specific about triggers |

## Usage

1. Copy this template into a new directory named after the skill
2. Replace the `name` and `description` fields
3. Write the instruction body in Markdown
4. Optionally add `scripts/`, `references/`, and `assets/` subdirectories

For a more complete scaffolding experience with generated example files, use the `init_skill.py` script from the Skill Creator skill instead.

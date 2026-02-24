> Source: [anthropics/skills](https://github.com/anthropics/skills) | Category: Meta Skills | ⭐ Anthropic Official

---
name: skill-creator
description: Interactive guide for creating new skills. Walks through use case definition, frontmatter generation, instruction writing, and validation.
---

# Skill Creator

## Overview

Anthropic's official guide for creating high-quality Claude skills. A systematic process from requirement definition through packaging and iteration.

## What Skills Provide

- **Specialized workflows**: Step-by-step domain guidance
- **Tool integrations**: Connect external services via MCP or scripts
- **Domain expertise**: Encode expert knowledge as reusable instructions
- **Bundled resources**: Scripts, references, templates, and assets

## Core Design Principles

### Conciseness

The context window is a shared resource. Skills should contain only the minimum information needed.

### Appropriate Degrees of Freedom

Overly rigid skills can't adapt to real scenarios. Leave reasonable room for Claude's judgment.

### Progressive Disclosure

Three-level loading system for maximum token efficiency:

| Level | Content | When Loaded |
|-------|---------|-------------|
| Level 1 | YAML frontmatter | Always in system prompt |
| Level 2 | SKILL.md body | When Claude deems skill relevant |
| Level 3 | Linked files (references/) | On demand |

## Skill File Structure

```
your-skill-name/
├── SKILL.md                  # Required — main skill file
├── scripts/                  # Optional — executable code
│   ├── process_data.py
│   └── validate.sh
├── references/               # Optional — documentation
│   ├── api-guide.md
│   └── examples/
└── assets/                   # Optional — templates, icons
    └── report-template.md
```

## Six-Step Creation Process

### Step 1: Understand the Skill

Define use cases with concrete examples. Write 2-3 real requests users would make.

### Step 2: Plan Reusable Content

Determine what's universal guidance (SKILL.md) vs. specialized reference (references/).

### Step 3: Initialize the Skill

Create folder structure and write YAML frontmatter:

```yaml
---
name: your-skill-name          # kebab-case, required
description: >                 # Required: what + when
  Describe skill functionality and trigger conditions.
  Include specific phrases users might say.
---
```

### Step 4: Write SKILL.md

- Put critical instructions at the top
- Use numbered steps and clear structure
- Mark key info with `## Important` / `## Critical` headers
- Reference bundled resources with clear paths

### Step 5: Package the Skill

- Folder names in kebab-case
- SKILL.md spelling is case-sensitive
- No README.md inside the skill folder
- Keep SKILL.md under 5,000 words

### Step 6: Iterate Based on Usage

| Signal | Meaning | Action |
|--------|---------|--------|
| Skill doesn't trigger when it should | Description too vague | Add trigger phrases and keywords |
| Triggers on unrelated tasks | Description too broad | Add negative triggers |
| Inconsistent results | Instructions ambiguous | Improve steps, add error handling |

## YAML Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | kebab-case, matches folder name |
| `description` | ✅ | What + when, < 1024 chars |
| `license` | ❌ | e.g., MIT, Apache-2.0 |
| `allowed-tools` | ❌ | Restrict tool access |
| `metadata` | ❌ | Custom key-value pairs (author, version, etc.) |

## Best Practices

- **Code is more reliable than language**: Use scripts for critical validation, not just prose
- **Iterate on one task first**: Get a single hard task working in conversation, then extract it into a skill
- **The description field is the most important part**: It determines when Claude loads your skill
- **Skills are living documents**: Plan to iterate continuously, not write once

> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Development Tools

---
name: skill-creator
description: Triggers when users want to create a new Claude skill or update an existing one -- provides the full workflow from planning through packaging, including SKILL.md authoring, bundled resources, and validation.
---

# Skill Creator

## Overview

This skill provides a structured guide for creating effective Claude skills -- modular, self-contained packages that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations. Skills act as "onboarding guides" that transform Claude from a general-purpose agent into a domain-specific specialist equipped with procedural knowledge.

## What Skills Provide

1. **Specialized workflows** -- Multi-step procedures for specific domains
2. **Tool integrations** -- Instructions for working with specific file formats or APIs
3. **Domain expertise** -- Company-specific knowledge, schemas, business logic
4. **Bundled resources** -- Scripts, references, and assets for complex, repetitive tasks

## Anatomy of a Skill

```
skill-name/
+-- SKILL.md              (required)
|   +-- YAML frontmatter   -> name + description (required)
|   +-- Markdown body       -> instructions (required)
+-- scripts/               (optional) Executable code (Python/Bash)
+-- references/            (optional) Documentation loaded into context as needed
+-- assets/                (optional) Files used in output (templates, icons, fonts)
```

### SKILL.md (Required)

The `name` and `description` in the YAML frontmatter determine when Claude activates the skill. Be specific about what the skill does and when to use it. Use third-person voice (e.g., "This skill should be used when..." not "Use this skill when...").

### Bundled Resources (Optional)

| Directory | Purpose | When to Include | Example |
|---|---|---|---|
| `scripts/` | Executable code for deterministic tasks | Same code is rewritten repeatedly | `scripts/rotate_pdf.py` |
| `references/` | Documentation loaded into context on demand | Claude needs reference material while working | `references/schema.md` |
| `assets/` | Files used in output, not loaded into context | Skill needs files for the final product | `assets/logo.png` |

**Key principle**: Information lives in either SKILL.md or references -- not both. Keep SKILL.md lean; move detailed reference material to `references/`. For large files (>10k words), include grep search patterns in SKILL.md.

### Progressive Disclosure

Skills use a three-level loading system:

1. **Metadata** (name + description) -- Always in context (~100 words)
2. **SKILL.md body** -- Loaded when the skill triggers (<5k words)
3. **Bundled resources** -- Loaded as needed by Claude (unlimited; scripts can execute without reading)

## Skill Creation Process

### Step 1: Understand the Skill with Concrete Examples

Clarify usage patterns with targeted questions:

- "What functionality should the skill support?"
- "Can you give examples of how it would be used?"
- "What would a user say that should trigger this skill?"

Conclude when there is a clear sense of what the skill should support. Avoid overwhelming users with too many questions at once.

### Step 2: Plan the Reusable Contents

For each concrete example, analyze:

1. How to execute the task from scratch
2. What scripts, references, or assets would be helpful for repeated execution

**Examples**:
- `pdf-editor` skill for "Rotate this PDF" --> `scripts/rotate_pdf.py`
- `frontend-webapp-builder` skill for "Build me a todo app" --> `assets/hello-world/` template
- `big-query` skill for "How many users logged in today?" --> `references/schema.md`

### Step 3: Initialize the Skill

For new skills, run the initialization script:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

This creates:
- The skill directory at the specified path
- A SKILL.md template with proper frontmatter and TODO placeholders
- Example directories: `scripts/`, `references/`, `assets/` with sample files

Skip this step if iterating on an existing skill.

### Step 4: Edit the Skill

The skill is being created for another instance of Claude to use. Focus on information that is beneficial and non-obvious.

**Start with reusable contents**: Implement `scripts/`, `references/`, and `assets/` files first. Delete any example files not needed for the skill.

**Update SKILL.md**: Write in imperative/infinitive form (verb-first instructions), not second person. Answer these questions:

1. What is the purpose of the skill?
2. When should the skill be used?
3. How should Claude use the skill? Reference all bundled resources.

### Step 5: Package the Skill

Package into a distributable zip file (validates automatically):

```bash
scripts/package_skill.py <path/to/skill-folder>
```

Optionally specify an output directory:

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

The script validates YAML frontmatter, naming conventions, directory structure, description quality, and file organization before creating the package.

### Step 6: Iterate

1. Use the skill on real tasks
2. Note struggles or inefficiencies
3. Update SKILL.md or bundled resources
4. Test again

## Bundled Scripts

| Script | Purpose |
|---|---|
| `scripts/init_skill.py` | Scaffold a new skill directory with template files |
| `scripts/package_skill.py` | Validate and package a skill into a distributable zip |
| `scripts/quick_validate.py` | Run validation checks on a skill |

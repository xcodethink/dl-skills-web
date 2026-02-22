> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: G-Tools-and-Productivity

---
name: skill-creator
description: Guide for creating effective Claude Code agent skills with proper structure, progressive disclosure, and validation
---

# Skill Creator

## Overview

This skill provides guidance for creating effective agent skills for Claude Code. Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools -- turning Claude from a general agent into a specialized one equipped with procedural knowledge.

## About Skills

**Important:**
- Skills are not documentation; they are actionable instructions for Claude Code to accomplish tasks using tools, packages, plugins, or APIs.
- Each skill teaches Claude how to perform a specific development task, not what a tool does.
- Claude Code can automatically activate multiple skills to fulfill a user's request.

### What Skills Provide

1. Specialized workflows - Domain-specific multi-step procedures
2. Tool integration - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, patterns, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

### Skill Structure

Each skill contains a required SKILL.md file and optional bundled resources:

```
.claude/skills/
└── skill-name/
    ├── SKILL.md (required)
    │   ├── YAML Frontmatter (required)
    │   │   ├── name: (required)
    │   │   ├── description: (required)
    │   │   ├── license: (optional)
    │   │   └── version: (optional)
    │   └── Markdown Instructions (required)
    └── Bundled Resources (optional)
        ├── scripts/          - Executable code (Python/Bash etc.)
        ├── references/       - Documents loaded into context on demand
        └── assets/           - Files for output (templates, icons, fonts, etc.)
```

#### Requirements (**Important**)

- Skills should be consolidated by specific topic, e.g.: `cloudflare`, `cloudflare-r2`, `cloudflare-workers`, `docker`, `gcloud` should be consolidated into `devops`
- `SKILL.md` should be **under 150 lines** with references to related Markdown files and scripts.
- Each script or referenced Markdown file should also be **under 150 lines**; remember they can be split into multiple files (**progressive disclosure** principle).
- The description in `SKILL.md` metadata should be both concise (**under 200 characters**) and contain enough references and script use cases to help auto-activate the skill during Claude Code's implementation process.
- **Referenced Markdown files**:
  - May sacrifice syntax for brevity.
  - May also reference other Markdown files or scripts.
- **Referenced scripts**:
  - Prefer Node.js or Python scripts over Bash, as Bash is poorly supported on Windows.
  - For Python scripts, include a `requirements.txt`.
  - Ensure scripts respect `.env` files in this order: `process.env` > `$HOME/.claude/skills/${SKILL}/.env` (global) > `$HOME/.claude/skills/.env` (global) > `$HOME/.claude/.env` (global) > `./.claude/skills/${SKILL}/.env` (local) > `./.claude/skills/.env` (local) > `./.claude/.env` (local)
  - Create `.env.example` files showing required environment variables.
  - Always write tests for scripts.

**Important:**
- Always remember that `SKILL.md` and reference files should be token-efficient to maximize the benefit of **progressive disclosure**.
- `SKILL.md` should be **under 150 lines**
- Referenced Markdown files should also be **under 150 lines**; remember they can be split into multiple files (**progressive disclosure** principle).
- Referenced scripts: no length limits, just ensure they work -- no compilation issues, no runtime issues, no dependency issues, no environment issues, no platform issues.

**Why?**
Better **context engineering**: Using the **progressive disclosure** technique for agent skills, when an agent skill is activated, Claude Code considers loading only the relevant files into context rather than reading an entire lengthy `SKILL.md`.

#### SKILL.md (Required)

**Filename:** `SKILL.md` (uppercase)
**File size:** Under 150 lines; if more content is needed, split into multiple files in the `references` folder (each <150 lines).
`SKILL.md` should always be short, sharp, and to the point -- think of it as a quick reference guide.

**Metadata Quality:** The `name` and `description` (**must be under 200 characters**) in the YAML frontmatter determine when Claude uses the skill. Be specific about what the skill does and when to use it -- do not sound generic, vague, or educational. Use third person (e.g., "This skill should be used when..." not "Use this skill when...").

#### Bundled Resources (Optional)

##### Scripts (`scripts/`)

Executable code (Python/Bash etc.) for tasks requiring deterministic reliability or that get rewritten repeatedly.

- **When to include**: When the same code gets rewritten repeatedly or needs deterministic reliability
- **Example**: `scripts/rotate_pdf.py` for PDF rotation tasks
- **Advantages**: Token-efficient, deterministic, executable without loading into context
- **Note**: Scripts may still need to be read by Claude for patching or environment-specific adjustments

**Important:**
- Write tests for scripts.
- Run tests and ensure they pass; if tests fail, fix and re-run, repeat until tests pass.
- Manually run scripts with sample use cases to ensure they work.
- Ensure scripts respect `.env` files in the specified order.

##### References (`references/`)

Documentation and reference material loaded into context on demand to guide Claude's process and thinking.

- **When to include**: Documents Claude should reference while working
- **Examples**: `references/finance.md` financial patterns, `references/mnda.md` company NDA template, `references/policies.md` company policies, `references/api_docs.md` API specifications
- **Use cases**: Database schemas, best practices, common workflows, cheat sheets, tool instructions, API docs, domain knowledge, company policies, detailed workflow guides
- **Advantages**: Keeps SKILL.md lean, loaded only when Claude determines it is needed, makes information discoverable without consuming context window.
- **Best practices**: If a file is large (>150 lines), split into multiple files in the `references` folder (each <150 lines); include grep search patterns in `SKILL.md`.
- **Avoid duplication**: Information should exist in one place -- either `SKILL.md` or `references` files, not both. Put detailed information in `references` files -- this keeps `SKILL.md` lean.

##### Assets (`assets/`)

Files not intended to be loaded into context, but used by Claude to produce output.

- **When to include**: When the skill needs files for final output
- **Examples**: `assets/logo.png` brand assets, `assets/slides.pptx` PowerPoint templates, `assets/frontend-template/` HTML/React boilerplate, `assets/font.ttf` fonts
- **Use cases**: Templates, images, icons, boilerplate code, fonts, example documents that get copied or modified
- **Advantages**: Separates output resources from documentation, allows Claude to use files without loading into context

### Progressive Disclosure Design Principle

Skills use a three-level loading system for efficient context management:

1. **Metadata (name + description)** - Always in context (**under 200 characters**)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - Loaded as Claude needs them (no limit*)

*No limit because scripts can be executed without reading into the context window.

## Skill Creation Process

When creating a skill, follow these steps in order; skip only with a clear reason.

### Step 1: Understand the Skill Through Concrete Examples

Skip this step only when the skill's usage patterns are already clearly understood.

To create an effective skill, you need a clear understanding of concrete examples of how the skill will be used. These can come from examples provided directly by the user or from generated examples validated through user feedback.

Use the `AskUserQuestion` tool to collect user feedback and validate understanding.

For example, when building an image editing skill, relevant questions include:

- "What functionality should the image editing skill support? Editing, rotation, what else?"
- "Can you give some examples of how this skill would be used?"
- "What kind of user input should trigger this skill?"

To avoid overwhelming the user, avoid asking too many questions in a single message.

### Step 2: Internet Research

Effective skills are subsets of real-world workflows from professional workflows and case studies.

Activate the `/docs-seeker` skill to search for documentation.

Activate the `/research` skill to research:
- Best practices and industry standards
- Existing CLI tools (executable via `npx`, `bunx`, or `pipx`) and their usage patterns
- Workflows and success stories
- Common patterns, use cases, and examples
- Edge cases, potential pitfalls, and avoidance strategies

Document the research report for use in the next step.

### Step 3: Plan Reusable Skill Content

Transform concrete examples into an effective skill by analyzing each example:

1. Consider how to execute the example from scratch
2. Prioritize execution with existing CLI tools (via `npx`, `bunx`, or `pipx`) over writing custom code
3. Identify which scripts, references, and assets would be helpful when repeatedly executing these workflows
4. Analyze the current skill directory to avoid duplicating functionality, reusing existing skills where possible

### Step 4: Initialize Skill

When creating a new skill, always run the `init_skill.py` script:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

The script:
- Creates the skill directory at the specified path
- Generates a SKILL.md template with proper frontmatter and TODO placeholders
- Creates example resource directories: `scripts/`, `references/`, and `assets/`
- Adds example files in each directory that can be customized or removed

### Step 5: Edit Skill

When editing a skill, remember it is being created for another Claude instance. Focus on including information that is beneficial to Claude and non-obvious.

#### Start with Reusable Skill Content

Begin implementing from the reusable resources identified above: `scripts/`, `references/`, and `assets/` files.

Delete example files and directories the skill does not need.

#### Update SKILL.md

**Writing style:** Use **imperative/infinitive form** (verb-first instructions), not second person. Use objective, instructive language (e.g., "To accomplish X, execute Y" not "You should execute X").

To complete SKILL.md, answer these questions:

1. What is the purpose of the skill? Explain in a few sentences
2. When should the skill be used?
3. In practice, how should Claude use this skill? All reusable skill content developed above should be referenced

### Step 5 (continued): Package Skill

Once the skill is ready, package it as a distributable zip file:

```bash
scripts/package_skill.py <path/to/skill-folder>
```

Optionally specify an output directory:

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

The packaging script will:

1. **Validate** the skill with automatic checks:
   - YAML frontmatter format and required fields
   - Skill naming conventions and directory structure
   - Description completeness and quality (**must be under 200 characters**)
   - File organization and resource references

2. **Package** the skill after validation passes, creating a zip file named after the skill with all files maintaining proper directory structure for distribution.

### Step 6: Iterate

After testing the skill, users may request improvements.

**Iteration workflow:**
1. Use the skill on real tasks
2. Note difficulties or inefficiencies
3. Monitor token usage and performance
4. Identify how SKILL.md or bundled resources should be updated
5. Implement changes and test again

## Validation Criteria

Detailed validation criteria for evaluating skills:

- **Quick Checklist**: `references/validation-checklist.md`
- **Metadata Quality**: `references/metadata-quality-criteria.md`
- **Token Efficiency**: `references/token-efficiency-criteria.md`
- **Script Quality**: `references/script-quality-criteria.md`
- **Structure & Organization**: `references/structure-organization-criteria.md`

## Plugin Marketplace

Distribute skills as plugins via the marketplace:
- **Overview**: `references/plugin-marketplace-overview.md`
- **Schema**: `references/plugin-marketplace-schema.md`
- **Sources**: `references/plugin-marketplace-sources.md`
- **Hosting**: `references/plugin-marketplace-hosting.md`
- **Troubleshooting**: `references/plugin-marketplace-troubleshooting.md`

## References
- [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills.md)
- [Agent Skills Spec](../agent_skills_spec.md)
- [Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview.md)
- [Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices.md)
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces.md)

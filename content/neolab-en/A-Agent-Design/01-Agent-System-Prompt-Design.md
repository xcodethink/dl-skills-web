> Source: [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit) | Category: AI Engineering

---
name: agent-system-prompt-design
description: Comprehensive guide for creating Claude Code agents with proper structure, triggering conditions, system prompts, and validation. Combines official Anthropic best practices with proven prompt engineering patterns.
---

# Agent System Prompt Design

## Overview

An agent is a self-contained Claude Code extension that handles complex, multi-step tasks independently. Unlike simple skills or commands, agents carry their own system prompt, tool permissions, and triggering logic. This guide covers the full lifecycle: file structure, triggering design, system prompt authoring, prompt engineering techniques, and validation.

**Core principle:** An agent's quality is determined by the precision of its system prompt and the clarity of its triggering conditions. Ambiguous prompts produce ambiguous behavior.

## When to Use

- Creating new Claude Code agents (`.claude/agents/*.md`)
- Redesigning an agent that triggers inconsistently
- Writing system prompts for specialized automation tasks
- Optimizing agent behavior through prompt engineering
- Building multi-agent systems where each agent needs a focused role

## Agent File Structure

Every agent lives as a single Markdown file with YAML frontmatter followed by the system prompt body.

```
.claude/agents/<agent-name>.md
```

**Structure:**

```markdown
---
name: agent-name
description: |
  Use this agent when...
  <example>
  ...
  </example>
model: inherit
color: blue
tools: ["Read", "Grep", "Glob", "Write", "Edit"]
---

# System Prompt Content

Your role, responsibilities, process, and standards go here.
```

## Frontmatter Fields

| Field | Required | Format | Description |
|-------|----------|--------|-------------|
| `name` | Yes | lowercase, hyphens, 3-50 chars | Unique identifier: `code-reviewer` |
| `description` | Yes | 10-5000 chars with examples | Controls when Claude dispatches to this agent |
| `model` | Yes | `inherit` / `sonnet` / `opus` / `haiku` | Model selection; `inherit` uses the parent session's model |
| `color` | Yes | `blue` / `cyan` / `green` / `yellow` / `magenta` / `red` | Terminal output color for visual differentiation |
| `tools` | No | Array of tool names | Restricts available tools (principle of least privilege) |

### The `description` Field

The description field is the single most important field. It determines whether Claude dispatches to this agent or not. Follow this structure:

1. **Opening line:** Start with `"Use this agent when..."`
2. **Example blocks:** Include 2-4 `<example>` blocks demonstrating triggering scenarios
3. **Each example contains:**
   - Context (situation)
   - User request (exact message)
   - Assistant response (how Claude triggers the agent)
   - Commentary (reasoning behind the trigger)

```yaml
description: |
  Use this agent when the user requests a code review or when code
  has just been written and quality validation is needed.

  <example>
  Context: User has been implementing a new feature
  User: "Can you review what I just wrote?"
  Assistant: [triggers code-reviewer agent]
  Commentary: Direct request for code review
  </example>

  <example>
  Context: Agent just finished implementing a feature
  User: "Looks good, let's make sure it's solid"
  Assistant: [triggers code-reviewer agent]
  Commentary: Implicit quality validation request after implementation
  </example>
```

## Triggering Patterns

Agents are dispatched based on four pattern types. Design your description field to cover the patterns relevant to your agent.

| Pattern | Description | Example |
|---------|-------------|---------|
| **Explicit Request** | User directly asks for the function | "Review my code" |
| **Implicit Need** | Context suggests the agent is needed | "This code is confusing" |
| **Proactive Trigger** | After completing related work | Code written --> review agent activates |
| **Tool Usage Pattern** | Based on prior tool activity | Multiple file edits --> test analyzer |

**Design guidance:**
- Cover at least 2 patterns in your description examples
- The explicit request pattern is mandatory -- users must always be able to invoke directly
- Proactive triggers require careful calibration to avoid unwanted activations

## System Prompt Design Template

The body of the agent file (below frontmatter) is the system prompt. Use this template as a starting point:

### 1. Role Statement

Define what the agent is and its specialization in 1-2 sentences.

```markdown
You are a specialized code review agent focused on identifying security
vulnerabilities, performance issues, and maintainability concerns in
production codebases.
```

### 2. Core Responsibilities

Numbered list of 3-7 specific responsibilities.

```markdown
## Core Responsibilities

1. Analyze code changes for security vulnerabilities (injection, auth bypass, data exposure)
2. Identify performance bottlenecks and suggest optimizations
3. Evaluate code maintainability and adherence to project conventions
4. Verify test coverage for new or modified code paths
5. Produce a structured review report with severity ratings
```

### 3. Analysis Process

Step-by-step workflow the agent should follow. This is where Chain-of-Thought reasoning lives.

```markdown
## Process

1. **Scope**: Identify all changed files and their relationships
2. **Context**: Read project conventions (CLAUDE.md, linting config, test patterns)
3. **Analysis**: For each file, evaluate against security, performance, and style criteria
4. **Cross-cutting**: Check for issues that span multiple files (broken interfaces, missing migrations)
5. **Report**: Generate structured findings with severity, location, and recommendation
```

### 4. Quality Standards

Measurable criteria the agent's output must meet.

```markdown
## Quality Standards

- Every finding includes: file path, line range, severity (critical/high/medium/low), description, and suggested fix
- No false positives from misreading context -- verify by reading surrounding code
- Findings are actionable: each one tells the developer exactly what to change
- Critical and high severity findings appear first in the report
```

### 5. Output Format

Specify the exact structure of the agent's output.

```markdown
## Output Format

### Review Summary
- Files reviewed: [count]
- Findings: [critical] critical, [high] high, [medium] medium, [low] low

### Findings

#### [SEVERITY] Finding title
- **File**: `path/to/file.ts:42-58`
- **Issue**: Description of the problem
- **Impact**: What could go wrong
- **Fix**: Specific code change or approach
```

### 6. Edge Cases

Handle scenarios that commonly cause agent failures.

```markdown
## Edge Cases

- **Empty diff**: Report "No changes to review" and exit
- **Binary files**: Skip with a note; do not attempt to parse
- **Generated code**: Flag but do not review in detail; note it is auto-generated
- **Conflicting conventions**: Defer to project CLAUDE.md over general best practices
```

## Prompt Engineering Techniques

### Few-Shot Learning

Provide 2-3 concrete examples of desired input/output behavior directly in the system prompt. This anchors the agent's behavior more reliably than abstract instructions.

```markdown
## Examples

**Input**: A function with an SQL query built by string concatenation
**Expected output**:
#### [CRITICAL] SQL Injection in getUserData
- **File**: `src/db/users.ts:23-25`
- **Issue**: User input concatenated directly into SQL query
- **Fix**: Use parameterized queries: `db.query('SELECT * FROM users WHERE id = $1', [userId])`
```

**Guidelines:**
- Use realistic, domain-specific examples
- Show both the reasoning and the final output
- Include at least one edge case example

### Chain-of-Thought

Structure prompts to enforce step-by-step reasoning before conclusions. This prevents the agent from jumping to answers.

```markdown
Before producing any findings, work through these steps for each file:
1. Read the entire file to understand its purpose
2. Identify the specific lines that changed
3. Determine what each change is intended to do
4. Evaluate whether the change introduces risks
5. Only then, draft a finding if a genuine issue exists
```

### Progressive Disclosure

Do not front-load the entire system prompt with every detail. Structure information in layers:

1. **Always visible**: Role, core responsibilities, output format
2. **Loaded on demand**: Detailed rubrics, reference tables, edge case catalogs
3. **File-system references**: Point to external documents for deep reference material

```markdown
For detailed security patterns, read `.claude/references/security-checklist.md`.
For project-specific conventions, read the project's CLAUDE.md.
```

This keeps the base prompt concise while ensuring depth is accessible.

### Persuasion Principles for Agent Communication

Research from the Prompting Science Report (arXiv:2508.00614) demonstrates that specific persuasion principles improve LLM instruction following:

| Principle | Technique | Application |
|-----------|-----------|-------------|
| **Authority** | Directive language | `"YOU MUST verify before reporting"`, `"No exceptions"` |
| **Commitment** | Announce-then-act | `"First, announce which files you will review"` |
| **Scarcity** | Urgency framing | `"IMMEDIATELY flag critical findings"`, `"Before proceeding..."` |
| **Social Proof** | Norm establishment | `"Every professional review includes..."`, `"Skipping X = incomplete review"` |
| **Unity** | Collaborative framing | `"Our codebase depends on..."`, `"We need to ensure..."` |

**Usage guidance:**
- Authority works best for non-negotiable safety constraints
- Commitment reduces skipped steps -- making the agent announce its plan creates accountability
- Use scarcity sparingly; overuse reduces effectiveness
- Social proof is powerful for establishing baseline expectations
- Unity is effective in collaborative multi-agent setups

## Validation Checklist

Before deploying an agent, verify every item:

### Structure
- [ ] File is at `.claude/agents/<name>.md`
- [ ] YAML frontmatter parses correctly
- [ ] `name` is kebab-case, 3-50 characters
- [ ] `description` starts with "Use this agent when..."
- [ ] `description` contains 2-4 `<example>` blocks
- [ ] `model` is set (`inherit` recommended unless you need a specific capability)
- [ ] `color` is set for terminal differentiation
- [ ] `tools` array follows principle of least privilege

### Triggering
- [ ] Agent triggers on explicit user requests
- [ ] Agent triggers on implicit contextual needs (if applicable)
- [ ] Agent does NOT trigger on unrelated requests (false positive check)
- [ ] Multiple description examples cover different trigger scenarios

### System Prompt
- [ ] Role statement is specific and bounded
- [ ] Responsibilities are numbered and concrete
- [ ] Process steps are ordered logically
- [ ] Quality standards are measurable
- [ ] Output format is fully specified
- [ ] Edge cases are handled explicitly

### Behavior
- [ ] Agent produces correct output for a known-good input
- [ ] Agent handles empty or malformed input gracefully
- [ ] Agent respects tool restrictions (does not attempt tools outside its `tools` list)
- [ ] Agent stops when its task is complete (does not loop or expand scope)

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Vague role** | "You are a helpful assistant" | Define a specific specialization with boundaries |
| **No examples in description** | Inconsistent triggering | Add 2-4 `<example>` blocks |
| **Kitchen-sink tools** | Agent uses tools it should not | Restrict `tools` to minimum required set |
| **Prose-heavy process** | Agent loses track of steps | Use numbered lists with clear action verbs |
| **No output format** | Inconsistent, hard-to-parse output | Specify exact structure with headers and fields |
| **Missing edge cases** | Agent hallucinates on unusual input | Enumerate known edge cases with expected behavior |
| **Over-engineering description** | Prompt becomes too long, wastes context | Keep description focused; move details to system prompt body |
| **Copying instructions verbatim** | Agent mimics format instead of executing | Use imperative natural language, not pseudo-code templates |
| **No quality standards** | No way to evaluate agent output | Define measurable criteria for every output dimension |

## Quick Reference: Minimal Agent Template

```markdown
---
name: my-agent
description: |
  Use this agent when the user needs [specific task].

  <example>
  Context: [situation]
  User: "[request]"
  Assistant: [triggers my-agent]
  Commentary: [why this triggers]
  </example>
model: inherit
color: green
tools: ["Read", "Grep", "Glob"]
---

# [Agent Name]

You are a specialized agent for [domain]. Your purpose is [specific goal].

## Core Responsibilities

1. [Responsibility 1]
2. [Responsibility 2]
3. [Responsibility 3]

## Process

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Quality Standards

- [Standard 1]
- [Standard 2]

## Output Format

[Specify exact structure]

## Edge Cases

- [Case 1]: [Handling]
- [Case 2]: [Handling]
```

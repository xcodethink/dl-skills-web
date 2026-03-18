> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: F-Design-and-Content

---
name: mermaid-diagrams
description: Create text-based diagrams using Mermaid.js v11 declarative syntax and convert to SVG/PNG/PDF via CLI
---

# Mermaid.js v11

## Overview

Create text-based diagrams using Mermaid.js v11 declarative syntax. Convert code to SVG/PNG/PDF via CLI, or render in browsers and Markdown files. Supports 24+ diagram types for architecture, workflows, data models, and more.

## Quick Start

**Basic diagram structure:**
```
{diagram-type}
  {diagram-content}
```

**Common diagram types:**
- `flowchart` - Flow diagrams, decision trees
- `sequenceDiagram` - Actor interactions, API flows
- `classDiagram` - OOP structures, data models
- `stateDiagram` - State machines, workflows
- `erDiagram` - Database relationships
- `gantt` - Project timelines
- `journey` - User experience flows

See `references/diagram-types.md` for all 24+ types with syntax.

## Creating Diagrams

**Inline Markdown code block:**
````markdown
```mermaid
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Execute]
    B -->|No| D[End]
```
````

**Configuration via frontmatter:**
````markdown
```mermaid
---
theme: dark
---
flowchart LR
    A --> B
```
````

**Comments:** Use the `%% ` prefix for single-line comments.

## CLI Usage

Convert `.mmd` files to images:
```bash
# Install
npm install -g @mermaid-js/mermaid-cli

# Basic conversion
mmdc -i diagram.mmd -o diagram.svg

# With theme and background
mmdc -i input.mmd -o output.png -t dark -b transparent

# Custom styling
mmdc -i diagram.mmd --cssFile style.css -o output.svg
```

See `references/cli-usage.md` for Docker, batch processing, and advanced workflows.

## JavaScript Integration

**HTML embedding:**
```html
<pre class="mermaid">
  flowchart TD
    A[Client] --> B[Server]
</pre>
<script src="https://cdn.jsdelivr.net/npm/mermaid@latest/dist/mermaid.min.js"></script>
<script>mermaid.initialize({ startOnLoad: true });</script>
```

See `references/integration.md` for Node.js API and advanced integration patterns.

## Configuration and Themes

**Common options:**
- `theme`: "default", "dark", "forest", "neutral", "base"
- `look`: "classic", "handDrawn"
- `fontFamily`: Custom font specification
- `securityLevel`: "strict", "loose", "antiscript"

See `references/configuration.md` for full configuration options, themes, and customization.

## Practical Patterns

Load `references/examples.md` for:
- Architecture diagrams
- API documentation flows
- Database schemas
- Project timelines
- State machines
- User journey maps

## Resources

- `references/diagram-types.md` - Syntax for all 24+ diagram types
- `references/configuration.md` - Configuration, themes, accessibility
- `references/cli-usage.md` - CLI commands and workflows
- `references/integration.md` - JavaScript API and embedding
- `references/examples.md` - Practical patterns and use cases

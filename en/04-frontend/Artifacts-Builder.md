> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Development Tools

---
name: artifacts-builder
description: Triggers when building complex, multi-component HTML artifacts for claude.ai using React, TypeScript, Tailwind CSS, and shadcn/ui -- not for simple single-file HTML/JSX.
---

# Artifacts Builder

## Overview

This skill provides a complete pipeline for creating rich, interactive claude.ai HTML artifacts using a modern frontend stack. It handles project initialization, component development, and single-file bundling so that a fully self-contained artifact can be shared directly in a Claude conversation. Use this for complex artifacts that require state management, routing, or shadcn/ui components.

**Stack**: React 18 + TypeScript + Vite + Parcel (bundling) + Tailwind CSS + shadcn/ui

## Quick Start

### Step 1 -- Initialize the Project

```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

The generated project includes:

| Feature | Detail |
|---|---|
| React + TypeScript | Via Vite |
| Tailwind CSS 3.4.1 | With shadcn/ui theming system |
| Path aliases | `@/` configured |
| shadcn/ui | 40+ components pre-installed |
| Radix UI | All dependencies included |
| Parcel | Configured for bundling (via `.parcelrc`) |
| Node 18+ | Auto-detects and pins Vite version |

### Step 2 -- Develop the Artifact

Edit the generated files to build the artifact. Refer to the **shadcn/ui component docs** for available components: <https://ui.shadcn.com/docs/components>

### Step 3 -- Bundle to a Single HTML File

```bash
bash scripts/bundle-artifact.sh
```

This produces `bundle.html` -- a self-contained file with all JavaScript, CSS, and dependencies inlined. The project must have an `index.html` in the root directory.

What the bundling script does:

1. Installs bundling dependencies (Parcel, `@parcel/config-default`, `parcel-resolver-tspaths`, `html-inline`)
2. Creates `.parcelrc` config with path alias support
3. Builds with Parcel (no source maps)
4. Inlines all assets into a single HTML file via `html-inline`

### Step 4 -- Share the Artifact

Share `bundle.html` in the conversation so the user can view it as a Claude artifact.

### Step 5 -- Test (Optional)

To test or visualize the artifact, use available tools (Playwright, Puppeteer, or other skills). Avoid testing upfront as it adds latency; test after presenting the artifact if issues arise.

## Design Guidelines

To avoid common "AI slop" patterns, do not use:

- Excessive centered layouts
- Purple gradients
- Uniform rounded corners everywhere
- Inter font as the default

## Bundled Scripts

| Script | Purpose |
|---|---|
| `scripts/init-artifact.sh` | Scaffold a new React + TS + Tailwind + shadcn/ui project |
| `scripts/bundle-artifact.sh` | Bundle the project into a single self-contained HTML file |

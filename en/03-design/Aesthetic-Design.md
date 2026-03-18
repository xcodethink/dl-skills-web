> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: F-Design-and-Content

---
name: aesthetic-design
description: Create aesthetically pleasing interfaces by following proven design principles and systematic workflows
---

# Aesthetic Design

## Overview

Create aesthetically pleasing interfaces by following proven design principles and systematic workflows. This skill covers visual hierarchy, typography, color theory, micro-interactions, and design documentation through a structured four-phase approach.

## When to Use

- Building or designing user interfaces
- Analyzing inspiration sites for design patterns (Dribbble, Mobbin, Behance)
- Generating design images and evaluating aesthetic quality
- Implementing visual hierarchy, typography, and color theory
- Adding micro-interactions and animations
- Creating design documentation and style guides
- Accessibility and design system guidance

## Core Framework: Four-Phase Approach

### 1. BEAUTIFUL: Understand Aesthetics
Study existing designs, identify patterns, extract principles. AI lacks aesthetic perception -- standards must come from analyzing high-quality examples and aligning with market taste.

**Reference**: [`references/design-principles.md`](references/design-principles.md) - Visual hierarchy, typography, color theory, whitespace principles.

### 2. RIGHT: Ensure Functionality
Beauty without usability is worthless. Study design systems, component architecture, and accessibility requirements.

**Reference**: [`references/design-principles.md`](references/design-principles.md) - Design systems, component libraries, WCAG accessibility standards.

### 3. SATISFYING: Micro-Interactions
Incorporate subtle animations with appropriate timing (150-300ms), easing curves (ease-out for entrances, ease-in for exits), and sequential delays.

**Reference**: [`references/micro-interactions.md`](references/micro-interactions.md) - Duration guidelines, easing curves, performance optimization.

### 4. PEAK: Storytelling Through Design
Elevate with narrative elements -- parallax effects, particle systems, thematic consistency. Exercise restraint: "Too much of anything is never good."

**Reference**: [`references/storytelling-design.md`](references/storytelling-design.md) - Narrative elements, scroll-based storytelling, interaction techniques.

## Workflows

### Workflow 1: Capture and Analyze Inspiration

**Purpose**: Extract design guidelines from inspiration sites.

**Steps**:
1. Browse inspiration sites (Dribbble, Mobbin, Behance, Awwwards)
2. Use the **chrome-devtools** skill to capture full-screen screenshots (not full-page)
3. Use the **ai-multimodal** skill to analyze screenshots and extract:
   - Design style (minimalism, glassmorphism, neo-brutalism, etc.)
   - Layout structure and grid system
   - Typography system and hierarchy
     **Important:** Attempt to predict font names (Google Fonts) and sizes from the screenshot -- do not default to Inter or Poppins.
   - Color scheme with hex codes
   - Visual hierarchy techniques
   - Component patterns and styling
   - Micro-interactions
   - Accessibility considerations
   - Overall aesthetic quality score (1-10)
4. Document findings in a project design guideline using the template

### Workflow 2: Generate and Iterate Design Images

**Purpose**: Create aesthetically pleasing design images through iteration.

**Steps**:
1. Define design prompt including: style, colors, typography, audience, animation specs
2. Use the **ai-multimodal** skill to generate design images via Gemini API
3. Use the **ai-multimodal** skill to analyze the output image and evaluate aesthetic quality
4. If score < 7/10 or not meeting professional standards:
   - Identify specific weaknesses (color, typography, layout, spacing, hierarchy)
   - Refine the prompt for improvement
   - Re-generate with **ai-multimodal** or modify output using the **media-processing** skill (resize, crop, filters, compositing)
5. Repeat until aesthetic standards are met (score >= 7/10)
6. Document final design decisions using the template

## Design Documentation

### Creating Design Guidelines
Use [`assets/design-guideline-template.md`](assets/design-guideline-template.md) to document:
- Color palette and psychology
- Typography system and hierarchy
- Layout principles and spacing
- Component style standards
- Accessibility considerations
- Design highlights and rationale

Save to project `./docs/design-guideline.md`.

### Creating Design Stories
Use [`assets/design-story-template.md`](assets/design-story-template.md) to document:
- Narrative elements and themes
- Emotional journey
- User journey and highlight moments
- Design decision rationale

Save to project `./docs/design-story.md`.

## Resources and Integrations

### Related Skills
- **ai-multimodal**: Analyze documents, screenshots, and videos; generate design images; edit generated images; evaluate aesthetic quality using Gemini API
- **chrome-devtools**: Capture full-screen screenshots from inspiration sites, navigate between pages, interact with elements, read console logs and network requests
- **media-processing**: Optimize generated images (FFmpeg for video, ImageMagick for images)
- **ui-styling**: Implement designs using shadcn/ui components + Tailwind CSS utility-first styling
- **web-frameworks**: Build with Next.js (App Router, Server Components, SSR/SSG)

### Reference Documentation
**Reference**: [`references/design-resources.md`](references/design-resources.md) - Inspiration platforms, design systems, AI tools, MCP integrations, development strategies.

## Key Principles

1. Aesthetic standards come from humans, not AI -- study high-quality examples
2. Iterate based on analysis -- never settle for the first output
3. Balance beauty with functionality and accessibility
4. Document decisions to ensure development consistency
5. Use progressive disclosure in design -- reveal complexity gradually
6. Always objectively evaluate aesthetic quality (score >= 7/10)

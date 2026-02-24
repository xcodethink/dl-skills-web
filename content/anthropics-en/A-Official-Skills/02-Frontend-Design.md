> Source: [anthropics/skills](https://github.com/anthropics/skills) | Category: Frontend / Design | ⭐ Anthropic Official

---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use when building web components, pages, artifacts, or applications.
---

# Frontend Design

## Overview

Anthropic's official frontend design skill. Core goal: create **distinctive, production-grade** frontend interfaces that break free from generic AI aesthetics.

## Design Thinking

Before writing code, answer these four questions:

1. **Purpose**: What emotion or information should this interface convey?
2. **Tone**: Serious and professional? Or light and playful?
3. **Constraints**: Technical limits, performance requirements, device compatibility
4. **Differentiation**: How will this interface stand out?

## Frontend Aesthetics Guidelines

### Typography

- Choose fonts with character — avoid defaulting to Inter / system-ui
- Let the content's personality drive font selection
- Use bold weight contrast and clear size hierarchy

### Color & Theme

- Build a consistent color system with CSS variables
- Establish a dominant color, accent sparingly
- Avoid overusing gradients — especially purple gradients
- Dark mode isn't simply inverted colors — it needs independent design

### Motion

- CSS animations should be meaningful, not decorative
- Scroll-triggered transitions add immersion
- Hover states are the core opportunity for micro-interactions
- 150-300ms transition duration is the comfort zone

### Spatial Composition

- Asymmetric layouts have more visual tension than centered ones
- Experiment with element overlap and diagonal flow
- Whitespace is itself a design language
- Grid systems don't mean everything must align

### Backgrounds & Visual Details

- Gradients, textures, patterns are tools — use as needed
- Decorative elements (SVG, geometric shapes) add personality
- But restraint is harder than excess — less is more

## AI Aesthetic Traps to Avoid

```
❌ Default Inter font + purple gradient
❌ Everything center-aligned
❌ Rounded cards + shadows everywhere
❌ "Decorative" animations with no purpose
❌ Cookie-cutter Hero + Features + CTA layout
❌ Light gray background + white cards
```

## Core Principle

> **Elegance comes from executing the vision well — not from piling on technology.**

- Implementation complexity should match aesthetic vision — no more, no less
- Every design decision needs a clear rationale
- First decide "what should this interface feel like," then code
- Make bold aesthetic choices — mediocrity is the real enemy

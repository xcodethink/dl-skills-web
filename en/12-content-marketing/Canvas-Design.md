> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Design & Content

---
name: canvas-design
description: Triggers when asked to create a poster, piece of art, visual design, or other static visual work -- generates an original design philosophy and then expresses it as a .png or .pdf canvas, never copying existing artists' work.
---

# Canvas Design

## Overview

This skill creates original visual art in .png and .pdf formats by first developing a design philosophy (an aesthetic movement) and then expressing that philosophy on a canvas. The process is split into two distinct phases: philosophy creation and visual execution. The output consists of a design philosophy (.md file) alongside the finished artwork (.pdf or .png file).

## Two-Phase Process

### Phase 1: Design Philosophy Creation

Create a visual philosophy -- not a layout or template -- that will be interpreted through form, space, color, and composition. The philosophy acts as a manifesto for an art movement; the next phase makes the artwork.

**What to create**: A design philosophy/aesthetic movement
**What happens next**: The philosophy is expressed visually -- 90% visual design, 10% essential text

#### How to Generate the Philosophy

1. **Name the movement** (1-2 words):
   - "Brutalist Joy" / "Chromatic Silence" / "Metabolist Dreams"

2. **Articulate the philosophy** (4-6 paragraphs) covering:
   - Space and form
   - Color and material
   - Scale and rhythm
   - Composition and balance
   - Visual hierarchy

#### Philosophy Examples

| Movement | Core Idea | Visual Expression |
|---|---|---|
| **Concrete Poetry** | Communication through monumental form | Massive color blocks, sculptural typography, Brutalist spatial divisions, Polish poster energy meets Le Corbusier |
| **Chromatic Language** | Color as the primary information system | Geometric precision, color zones create meaning, Josef Albers meets data visualization |
| **Analog Meditation** | Quiet visual contemplation | Paper grain, ink bleeds, vast negative space, Japanese photobook aesthetic |
| **Organic Systems** | Natural clustering and modular growth | Rounded forms, organic arrangements, nature-through-architecture colors |
| **Geometric Silence** | Pure order and restraint | Grid-based precision, dramatic negative space, Swiss formalism meets Brutalist honesty |

#### Critical Guidelines

- **Avoid redundancy**: Each design aspect mentioned once; do not repeat color theory or spatial principles without adding new depth
- **Emphasize craftsmanship repeatedly**: Stress that the final work must appear meticulously crafted, labored over with care, the product of deep expertise -- master-level execution
- **Leave creative space**: Be specific about aesthetic direction but concise enough for interpretive freedom

Output the design philosophy as a `.md` file.

### Phase 2: Canvas Creation

#### Deduce the Subtle Reference

Before creating the canvas, identify the subtle conceptual thread from the original request. The topic is a niche reference embedded within the art -- not literal, always sophisticated. Someone familiar with the subject should feel it intuitively; others simply experience a masterful abstract composition.

Think like a jazz musician quoting another song -- only those who know will catch it.

#### Create the Canvas

Use the design philosophy as the foundation. Create one single-page, highly visual, design-forward PDF or PNG (unless more pages are requested).

**Approach**:
- Use repeating patterns and perfect shapes
- Treat the abstract design as if it were a scientific diagram from an imaginary discipline
- Dense accumulation of marks, repeated elements, or layered patterns that reward sustained viewing
- Sparse, clinical typography and systematic reference markers
- Limited color palette that feels intentional and cohesive
- Embrace the paradox of using analytical visual language to express human experience

**Text treatment**:
- Always minimal and visual-first
- Let context guide scale: a punk venue poster may use larger, more aggressive type than a minimalist ceramics identity
- Font should generally be thin
- Nothing falls off the page; nothing overlaps
- Every element must be contained within canvas boundaries with proper margins
- Use different fonts from the `canvas-fonts/` directory

**Quality standard**: The work must look like it took countless hours. Composition, spacing, color choices, and typography must demonstrate expert-level craftsmanship.

Output the final result as a `.pdf` or `.png` file alongside the design philosophy `.md` file.

#### Refinement Pass

After initial creation, take a second pass. Rather than adding more graphics, refine what exists:
- Make the composition more cohesive with the philosophy
- If the instinct is to add a new element, stop and ask: "How can I make what is already here more of a piece of art?"
- Polish to museum or magazine quality

### Multi-Page Option

When additional pages are requested:
- Create pages along the same philosophy but distinctly different
- Treat the first page as one page in a coffee table book
- Each subsequent page is a unique twist on the original
- Have them tell a story in a tasteful way
- Bundle in one .pdf or multiple .png files

## Bundled Fonts

The `canvas-fonts/` directory contains a curated collection of typefaces for use in canvas artwork, including:

| Category | Fonts |
|---|---|
| Sans-serif | Outfit, Instrument Sans, Work Sans, Bricolage Grotesque, Big Shoulders, Smooch Sans |
| Serif | Crimson Pro, Lora, Libre Baskerville, Instrument Serif, Young Serif, Italiana, Gloock |
| Mono | DM Mono, IBM Plex Mono, Geist Mono, JetBrains Mono, Red Hat Mono |
| Display | Boldonse, Erica One, Poiret One, National Park, Silkscreen, Pixelify Sans, Nothing You Could Do |
| Technical | Arsenal SC, Jura, Tektur, IBM Plex Serif |

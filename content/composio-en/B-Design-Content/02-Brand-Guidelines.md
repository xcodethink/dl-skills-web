> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Design & Content

---
name: brand-guidelines
description: Triggers when applying Anthropic's official brand colors, typography, and visual identity to any artifact that benefits from Anthropic's look-and-feel -- slides, docs, HTML, or other design outputs.
---

# Anthropic Brand Styling

## Overview

This skill applies Anthropic's official brand identity -- colors, typography, and accent styling -- to any artifact that benefits from having Anthropic's look-and-feel. It provides the exact color palette, font pairings, and application rules so that slides, documents, HTML pages, and other outputs maintain consistent, on-brand visual formatting.

## Brand Colors

### Main Colors

| Color | Hex | Usage |
|---|---|---|
| Dark | `#141413` | Primary text and dark backgrounds |
| Light | `#faf9f5` | Light backgrounds and text on dark |
| Mid Gray | `#b0aea5` | Secondary elements |
| Light Gray | `#e8e6dc` | Subtle backgrounds |

### Accent Colors

| Color | Hex | Usage |
|---|---|---|
| Orange | `#d97757` | Primary accent |
| Blue | `#6a9bcc` | Secondary accent |
| Green | `#788c5d` | Tertiary accent |

## Typography

| Role | Font | Fallback |
|---|---|---|
| Headings (24pt+) | Poppins | Arial |
| Body text | Lora | Georgia |

Fonts should be pre-installed in the environment for best results. If custom fonts are unavailable, the system falls back to Arial (headings) and Georgia (body) automatically.

## Application Rules

### Text Styling

- Headings at 24pt and above use Poppins
- Body text uses Lora
- Smart color selection based on background (dark text on light backgrounds, light text on dark)
- Text hierarchy and formatting are preserved

### Shape and Accent Colors

- Non-text shapes use the accent palette
- Colors cycle through orange, blue, and green
- Maintains visual interest while staying on-brand

### Technical Details

- RGB color values for precise brand matching
- Applied via `python-pptx`'s `RGBColor` class for PowerPoint artifacts
- Color fidelity is maintained across different systems
- No font installation required -- works with system fonts, but Poppins and Lora are recommended for best results

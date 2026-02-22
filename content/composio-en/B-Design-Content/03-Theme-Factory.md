> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Design & Content

---
name: theme-factory
description: Triggers when styling artifacts (slides, docs, reports, HTML landing pages) with a visual theme -- offers 10 pre-set professional themes with color palettes and font pairings, or generates a custom theme on the fly.
---

# Theme Factory

## Overview

This skill provides a curated collection of 10 professional font-and-color themes that can be applied to any artifact -- slide decks, documents, reports, HTML landing pages, and more. Each theme includes a cohesive color palette with hex codes, complementary font pairings, and a distinct visual identity suited to different contexts and audiences. Custom themes can also be generated on the fly when none of the presets fit.

## Usage Workflow

1. **Show the theme showcase**: Display `theme-showcase.pdf` so the user can see all themes visually (do not modify this file)
2. **Ask for their choice**: Ask which theme to apply
3. **Wait for selection**: Get explicit confirmation
4. **Apply the theme**: Read the selected theme file from `themes/` and apply its colors and fonts consistently throughout the artifact

## Available Themes

| # | Theme | Description | Best For |
|---|---|---|---|
| 1 | **Ocean Depths** | Professional, calming maritime blues | Corporate presentations, financial reports, consulting decks |
| 2 | **Sunset Boulevard** | Warm, vibrant sunset colors | Creative pitches, marketing, lifestyle brands, event promotions |
| 3 | **Forest Canopy** | Natural, grounded earth tones | Environmental content, organic brands, wellness |
| 4 | **Modern Minimalist** | Clean, contemporary grayscale | Tech products, SaaS, editorial, formal documents |
| 5 | **Golden Hour** | Rich, warm autumnal palette | Premium brands, hospitality, food and beverage |
| 6 | **Arctic Frost** | Cool, crisp winter-inspired theme | Healthcare, science, fintech, data presentations |
| 7 | **Desert Rose** | Soft, sophisticated dusty tones | Fashion, beauty, architecture, interior design |
| 8 | **Tech Innovation** | Bold, modern tech aesthetic | Startups, product launches, engineering, developer content |
| 9 | **Botanical Garden** | Fresh, organic garden colors | Health, sustainability, education, community |
| 10 | **Midnight Galaxy** | Dramatic, cosmic deep tones | Entertainment, gaming, music, nightlife |

### Example Theme: Ocean Depths

```
Colors:
  Deep Navy:  #1a2332   (primary background)
  Teal:       #2d8b8b   (accent highlights)
  Seafoam:    #a8dadc   (secondary accent)
  Cream:      #f1faee   (text and light backgrounds)

Typography:
  Headers:    DejaVu Sans Bold
  Body Text:  DejaVu Sans
```

### Example Theme: Sunset Boulevard

```
Colors:
  Burnt Orange:  #e76f51   (primary accent)
  Coral:         #f4a261   (secondary warm accent)
  Warm Sand:     #e9c46a   (highlighting, backgrounds)
  Deep Purple:   #264653   (dark contrast, text)

Typography:
  Headers:    DejaVu Serif Bold
  Body Text:  DejaVu Sans
```

## Application Process

After a theme is selected:

1. Read the corresponding theme file from `themes/`
2. Apply colors and fonts consistently throughout the artifact
3. Ensure proper contrast and readability
4. Maintain the theme's visual identity across all pages/slides

## Creating a Custom Theme

When none of the 10 presets fit:

1. Gather a basic description of the desired look and feel from the user
2. Generate a new theme with an evocative name describing what the color/font combinations represent
3. Define a cohesive color palette (4 hex codes) and font pairings
4. Show the generated theme for review and verification
5. Apply as described above

## Bundled Resources

| Resource | Purpose |
|---|---|
| `theme-showcase.pdf` | Visual preview of all 10 themes (read-only) |
| `themes/*.md` | Individual theme definitions with hex codes and font specs |

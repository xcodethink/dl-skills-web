> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: C-AI-Engineering

---
name: midjourney-card-background
description: Generate optimized Midjourney prompts for 600x600 card news background images
---

# Midjourney Card News Background Generator

## Overview

Generate optimized Midjourney prompts for creating 600x600px card news background images based on topic, mood, and style preferences. All backgrounds are designed to work well with text overlays, maintaining clean central areas and balanced compositions for social media card content.

## When to Use

Trigger this skill when the user requests:
- Card news background images
- Instagram post backgrounds
- Social media graphic backgrounds
- 600x600 or 1:1 aspect ratio background images

## Core Workflow

1. **Identify topic**: Extract the core theme from the user request
2. **Determine style category**: Match to a predefined style pattern
3. **Generate prompts**: Create Midjourney prompts with optimal parameters
4. **Provide variations**: Offer 3-5 different style options

## Prompt Structure

All prompts follow this structure:
```
[subject/scene description], [style keywords], [color scheme], [texture/mood], [technical params] --ar 1:1 --v 6
```

### Core Components

**Subject Description** (5-10 words):
- Clear description of visual elements
- Use specific, vivid adjectives
- Avoid abstract concepts

**Style Keywords** (3-5 keywords):
- minimal, clean, modern, professional
- gradient, abstract, geometric
- organic, fluid, soft, dreamy

**Color Scheme** (specify exact colors):
- Use precise color names: "soft blue and purple" not "cool colors"
- Include intensity: "vibrant", "pastel", "muted", "bright"
- Max 3-4 colors for cohesion

**Texture/Mood** (2-3 keywords):
- smooth, flowing, textured, grainy
- light and airy, bold and dramatic
- subtle, prominent, delicate

**Technical Parameters**:
- Required: `--ar 1:1` (600x600 square format)
- Version: `--v 6` (current Midjourney version)
- Optional: `--s 50-200` for stylization control

## Style Categories

Quick reference -- match the topic to a category:

| Category | Visual Style | Color Palette | Mood |
|----------|-------------|---------------|------|
| **Business/Tech** | Clean gradients with geometric elements | Blue, purple, teal | Professional, modern |
| **Health/Wellness** | Soft pastels with organic shapes | Green, peach, soft pink | Calm, natural |
| **Finance/Investment** | Bold gradients with sharp lines | Navy, gold, green | Confident, premium |
| **Education/Learning** | Friendly colors with simple shapes | Yellow, orange, light blue | Approachable, energetic |
| **Food/Lifestyle** | Warm tones with natural textures | Earth tones, warm orange, brown | Warm, authentic |
| **Creative/Art** | Bold abstract patterns | Vivid multi-color | Expressive, dynamic |

## Text Overlay Optimization

All backgrounds must be suitable for text overlay:

**Contrast Areas** -- should include:
- Subtle gradients (not busy patterns)
- Consistent brightness in the center
- Darker or lighter edges for visual interest

**Space Planning:**
- Central 60% remains relatively uniform
- Complex elements placed in corners
- Avoid horizontal lines crossing the center

**Avoid:**
- High-contrast busy patterns
- Center elements that compete with text
- Overly detailed textures

## Prompt Examples by Topic

**Tech/AI:**
```
abstract neural network patterns, modern tech aesthetic, gradient blue and cyan tones, smooth digital waves, clean negative space for text, futuristic minimalism --ar 1:1 --v 6
```

**Fitness/Sports:**
```
soft flowing energy waves, dynamic movement feel, gradient coral and peach colors, light and motivating atmosphere, space for text overlay --ar 1:1 --v 6
```

**Finance/Money:**
```
elegant geometric patterns, premium professional style, navy and gold gradient, subtle texture with depth, sophisticated minimal design --ar 1:1 --v 6
```

**Food/Cooking:**
```
organic food texture background, warm earthy tones, rustic natural aesthetic, soft focus with gentle shadows, appetizing color palette --ar 1:1 --v 6
```

**Mental Health:**
```
calming abstract clouds, serene peaceful atmosphere, soft lavender and mint gradients, dreamy gentle textures, meditative minimal space --ar 1:1 --v 6
```

## Response Format

When the user provides a topic, respond in this format:

1. **Primary Recommendation**: Best-fit style
2. **Alternative 1**: Different mood/style for the same topic
3. **Alternative 2**: Another variation
4. **Brief Explanation**: Why these styles suit the topic

**Example response:**
```
Topic: Financial Tips

1. Primary Recommendation:
[prompt]
-> Professional and trustworthy financial mood

2. Alternative 1:
[prompt]
-> Approachable and accessible feel

3. Alternative 2:
[prompt]
-> Premium and sophisticated feel
```

## Tips for Better Results

**Do:**
- Use specific color names
- Include texture descriptions
- Specify mood/atmosphere
- Keep prompts under 60 words
- Start with simple topics for testing

**Avoid:**
- Vague words like "nice" or "good"
- Too many competing elements
- Complex scene descriptions
- Overly long prompts
- Requesting specific brands/logos

## Advanced Parameters

For fine-tuning (optional):

| Parameter | Effect |
|-----------|--------|
| `--s 50` | More realistic, less stylized |
| `--s 150` | Balanced stylization (default) |
| `--s 250` | More artistic interpretation |
| `--chaos 0-100` | Variation control (0 = most consistent) |

## Multilingual Support

When users provide topics in any language:
- Understand the topic description
- Translate concepts into English prompts
- Provide explanations in the user's language
- Keep prompts in English (Midjourney requirement)

## Common Topics Reference

Consult `topics_reference.md` for the full list, including:
- Industry-specific color palettes
- Seasonal variations
- Trending styles
- Cultural considerations

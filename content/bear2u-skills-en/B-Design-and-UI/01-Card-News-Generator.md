> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: B-Design-and-UI

---
name: card-news-generator
description: Generate 600x600 social media card news series with optional background images
---

# Card News Generator v2 - Auto Mode

## Overview

Create polished 600x600 social media card news series with **background image support**. The user provides a topic, color scheme, and optional background images; Claude auto-generates content and produces multiple cards. Optimized for Instagram and similar square-format platforms.

## When to Use

Trigger this skill when the user requests:
- "Make card news for me"
- "Create a card series on [topic]"
- "Generate Instagram cards"
- Any request for visual card content

## Core Workflow - Auto Mode

### Step 1: Gather Topic, Color, and Optional Background Images

Ask the user for:
- **Topic**: The content theme for the card series
- **Background RGB** (background color): e.g., `245,243,238` (optional, default: beige)
- **Background images** (optional): Folder path containing images

**Example dialog (solid color):**
```
Claude: What topic would you like for the card news?
User: Characteristics of Gen Z

Claude: Choose a background color (RGB format, e.g., 245,243,238)
Recommended palettes:
- Beige: 245,243,238
- Soft pink: 255,229,229
- Mint: 224,244,241
User: 245,243,238
```

**Example dialog (with background images):**
```
Claude: What topic would you like for the card news?
User: 5 Travel Tips

Claude: Would you like to use background images? (Provide folder path if yes)
User: /path/to/travel-images

Claude: Choose overlay opacity (0.0-1.0, default 0.5)
Higher values = darker overlay = clearer text.
User: 0.6
```

### Step 2: Generate Card Content

Create 5-7 cards around the topic. Output format:

```
1. [Title]
[Description 2-3 lines]

2. [Title]
[Description 2-3 lines]

3. [Title]
[Description 2-3 lines]
```

**Content Guidelines:**
- **Title**: Max 20 characters (including spaces)
- **Body**: Max 60 characters (including spaces)
- Keep text concise for the 600x600 canvas
- Use punchy, direct language
- One core point per card

### Step 3: Auto-Generate Cards

#### Option A: Solid Color Background

```bash
python auto_generator.py \
  --topic "Gen Z Characteristics" \
  --bg-color "#f5f3ee" \
  --text-color "#1a1a1a" \
  --output-dir /mnt/user-data/outputs \
  --base-filename "zgen" << 'EOF'
1. Digital Natives
Born into a world of
smartphones and internet

2. Value Individuality
Prioritize unique identity
and personal taste

3. Communication Style
Prefer video over text
Express via memes and emoji
EOF
```

#### Option B: Background Images (v2 Feature)

```bash
python auto_generator.py \
  --topic "Travel Tips" \
  --output-dir /mnt/user-data/outputs \
  --base-filename "travel" \
  --image-folder /path/to/travel-images \
  --overlay-opacity 0.6 << 'EOF'
1. Packing Light
Travel with minimal luggage
for maximum freedom

2. Local Cuisine
Unique ways to discover
authentic local food

3. Getting Around
Tips for navigating
public transportation
EOF
```

**Important Notes:**
- Images in the folder must be sorted alphanumerically (e.g., `01.jpg`, `02.jpg`, `03.jpg`)
- Image count should match card count
- If fewer images than cards, remaining cards use solid color
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.bmp`
- Text automatically switches to white when using background images

The script will automatically:
- Parse numbered content
- Load background images from folder (in sorted order)
- Add dark overlay for text readability
- Create individual cards with auto-wrapping
- Save as `travel_01.png`, `travel_02.png`, etc.

### Step 4: Provide Download Links

```
Card news (5 cards) generated!

[View Card 1](computer:///mnt/user-data/outputs/zgen_01.png)
[View Card 2](computer:///mnt/user-data/outputs/zgen_02.png)
...
```

## RGB to Hex Conversion

Always convert RGB to hex in scripts:
```python
# RGB 245,243,238 -> Hex #f5f3ee
hex_color = '#{:02x}{:02x}{:02x}'.format(245, 243, 238)
```

## Recommended Colors (RGB)

| Name | RGB | Hex |
|------|-----|-----|
| Warm beige | 245,243,238 | #f5f3ee |
| Soft pink | 255,229,229 | #ffe5e5 |
| Mint | 224,244,241 | #e0f4f1 |
| Lavender | 232,224,245 | #e8e0f5 |
| Peach | 255,232,214 | #ffe8d6 |
| Sky blue | 227,242,253 | #e3f2fd |

## Content Best Practices

**Good card content:**
```
1. Digital Natives
Born into a world of
smartphones and internet
```
- Title: 15 characters -- Body: ~50 characters -- Clear and concise

**Bad card content:**
```
1. Gen Z is a generation of digital natives
They have been using smartphones and the internet since birth, making them very proficient with digital technology
```
- Title too long (40+ chars) -- Body too long (100+ chars) -- Will overflow 600x600 canvas

## Single Card Mode (Manual)

### Solid Color
```bash
python generate_card.py \
  --title "Title" \
  --content "Content text" \
  --bg-color "#f5f3ee" \
  --text-color "#1a1a1a" \
  --number 1 \
  --output /mnt/user-data/outputs/single.png
```

### With Background Image (v2)
```bash
python generate_card.py \
  --title "Travel Tips" \
  --content "Travel with minimal luggage\nfor maximum freedom" \
  --bg-image /path/to/image.jpg \
  --overlay-opacity 0.6 \
  --number 1 \
  --output /mnt/user-data/outputs/travel_01.png
```

**Parameters:**
- `--bg-image`: Background image file path
- `--overlay-opacity`: Dark overlay opacity (0.0-1.0, default: 0.5)
  - 0.0 = no overlay (original image)
  - 0.5 = 50% dark overlay (default, balanced)
  - 1.0 = fully black (only for very bright images)

## Technical Specifications

### Canvas
- **Size**: 600x600 pixels (Instagram-optimized)
- **Padding**: 40px on all sides
- **Max text width**: 520px (600 - 80)
- **Font sizes**: Number badge 60px, Title 48px bold, Body 28px regular

### Background Image Processing (v2)
- **Scale and crop**: Auto-resize to 600x600px, center crop, LANCZOS resampling
- **Dark overlay**: Default 0.5 opacity; adjustable via `--overlay-opacity`
- **Text color**: Auto-switches to white (#FFFFFF) with background images
- **Supported formats**: JPG, JPEG, PNG, WebP, BMP
- **Sort order**: Files loaded in alphanumeric order

### Text Wrapping
- Auto-wrap at max width
- Manual line breaks preserved
- All text horizontally centered
- Vertical spacing optimized for readability

### File Naming
- Auto mode: `{base_filename}_{number:02d}.png`
- Example: `card_01.png`, `card_02.png`, `card_03.png`

## Error Handling

When text overflows:
- Shorten the title
- Condense body content
- Use strategic line breaks
- Regenerate after editing content

## Workflow Examples

### Example 1: Solid Color Background

User: "Make 5 card news about Gen Z with a pink background"

Claude:
1. Confirm: "Creating 5 Gen Z cards with pink background (255,229,229)."
2. Generate 5 card contents (keep text concise)
3. Run auto_generator.py (using heredoc)
4. Provide download links for all 5 cards

Estimated time: ~30 seconds (5-card series)

### Example 2: Background Images (v2)

User: "Make travel tips card news using images from /Users/me/travel-photos"

Claude:
1. Confirm: "Creating travel tips cards using images from /Users/me/travel-photos."
2. Ask: "Choose overlay opacity (0.0-1.0, default 0.5). Higher = clearer text."
3. User: "0.6"
4. Generate 5 card contents
5. Run auto_generator.py with `--image-folder` and `--overlay-opacity`
6. Provide download links

**Preparation tips:**
- Rename images sequentially: `01.jpg`, `02.jpg`, `03.jpg`, `04.jpg`, `05.jpg`
- Ensure image count matches card count
- Use high-quality images (at least 600x600px recommended)
- Experiment with overlay opacity for best results

Estimated time: ~45 seconds (5-card series with images)

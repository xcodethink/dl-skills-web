> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Multimedia & Other

---
name: slack-gif-creator
description: Toolkit for creating animated GIFs optimized for Slack, with validators for size constraints and composable animation primitives.
---

# Slack GIF Creator

## Overview

This skill provides a flexible toolkit for creating animated GIFs optimized for Slack. It includes validators for Slack's size and dimension constraints, composable animation primitives (shake, bounce, spin, pulse, fade, zoom, explode, wiggle, slide, flip, morph, move, kaleidoscope), and helper utilities for text, color, and visual effects. The goal is creative freedom within Slack's technical constraints.

## Slack Requirements

### Message GIFs
- Max size: ~2MB
- Optimal dimensions: 480x480
- Typical FPS: 15-20
- Color limit: 128-256
- Duration: 2-5 seconds

### Emoji GIFs
- Max size: 64KB (strict limit)
- Optimal dimensions: 128x128
- Typical FPS: 10-12
- Color limit: 32-48
- Duration: 1-2 seconds

Emoji GIFs are challenging due to the 64KB limit. Strategies that help: limit to 10-15 frames, use 32-48 colors maximum, keep designs simple, avoid gradients, and validate file size frequently.

## Toolkit Structure

1. **Validators** -- Check if a GIF meets Slack requirements
2. **Animation Primitives** -- Composable building blocks for motion
3. **Helper Utilities** -- Optional functions for text, colors, and effects

## Core Validators

### GIF Builder with Size Check

```python
from core.gif_builder import GIFBuilder

builder = GIFBuilder(width=128, height=128, fps=10)
# ... add frames ...
info = builder.save('emoji.gif', num_colors=48, optimize_for_emoji=True)
# info contains: size_kb, size_mb, frame_count, duration_seconds
```

### File Size Validation

```python
from core.validators import check_slack_size, validate_gif, is_slack_ready

# Quick check
passes, info = check_slack_size('emoji.gif', is_emoji=True)

# Dimension check
passes, info = validate_dimensions(128, 128, is_emoji=True)

# Complete validation
all_pass, results = validate_gif('emoji.gif', is_emoji=True)

# One-liner
if is_slack_ready('emoji.gif', is_emoji=True):
    print("Ready to upload!")
```

## Animation Primitives

### Shake
```python
from templates.shake import create_shake_animation

frames = create_shake_animation(
    object_type='emoji',
    object_data={'emoji': '😱', 'size': 80},
    num_frames=20,
    shake_intensity=15,
    direction='both'  # or 'horizontal', 'vertical'
)
```

### Bounce
```python
from templates.bounce import create_bounce_animation

frames = create_bounce_animation(
    object_type='circle',
    object_data={'radius': 40, 'color': (255, 100, 100)},
    num_frames=30,
    bounce_height=150
)
```

### Spin / Rotate
```python
from templates.spin import create_spin_animation, create_loading_spinner

frames = create_spin_animation(
    object_type='emoji',
    object_data={'emoji': '🔄', 'size': 100},
    rotation_type='clockwise',  # or 'wobble'
    full_rotations=2
)

frames = create_loading_spinner(spinner_type='dots')
```

### Pulse / Heartbeat
```python
from templates.pulse import create_pulse_animation, create_attention_pulse

frames = create_pulse_animation(
    object_data={'emoji': '❤️', 'size': 100},
    pulse_type='smooth',  # or 'heartbeat'
    scale_range=(0.8, 1.2)
)

frames = create_attention_pulse(emoji='⚠️', num_frames=20)
```

### Fade / Crossfade
```python
from templates.fade import create_fade_animation, create_crossfade

frames = create_fade_animation(fade_type='in')  # or 'out'

frames = create_crossfade(
    object1_data={'emoji': '😊', 'size': 100},
    object2_data={'emoji': '😂', 'size': 100}
)
```

### Zoom / Explosion Zoom
```python
from templates.zoom import create_zoom_animation, create_explosion_zoom

frames = create_zoom_animation(
    zoom_type='in',
    scale_range=(0.1, 2.0),
    add_motion_blur=True
)

frames = create_explosion_zoom(emoji='💥')
```

### Explode / Shatter
```python
from templates.explode import create_explode_animation, create_particle_burst

frames = create_explode_animation(
    explode_type='burst',  # or 'shatter', 'dissolve'
    num_pieces=25
)

frames = create_particle_burst(particle_count=30)
```

### Wiggle / Jiggle
```python
from templates.wiggle import create_wiggle_animation, create_excited_wiggle

frames = create_wiggle_animation(
    wiggle_type='jello',  # or 'wave'
    intensity=1.0,
    cycles=2
)

frames = create_excited_wiggle(emoji='🎉')
```

### Slide
```python
from templates.slide import create_slide_animation, create_multi_slide

frames = create_slide_animation(
    direction='left',
    slide_type='in',  # or 'across'
    overshoot=True
)

objects = [
    {'data': {'emoji': '🎯', 'size': 60}, 'direction': 'left', 'final_pos': (120, 240)},
    {'data': {'emoji': '🎪', 'size': 60}, 'direction': 'right', 'final_pos': (240, 240)}
]
frames = create_multi_slide(objects, stagger_delay=5)
```

### Flip
```python
from templates.flip import create_flip_animation, create_quick_flip

frames = create_flip_animation(
    object1_data={'emoji': '😊', 'size': 120},
    object2_data={'emoji': '😂', 'size': 120},
    flip_axis='horizontal'  # or 'vertical'
)

frames = create_quick_flip('👍', '👎')
```

### Morph / Transform
```python
from templates.morph import create_morph_animation

frames = create_morph_animation(
    object1_data={'emoji': '😊', 'size': 100},
    object2_data={'emoji': '😂', 'size': 100},
    morph_type='crossfade'  # or 'scale', 'spin_morph'
)
```

### Move Effect
```python
from templates.move import create_move_animation

# Linear movement
frames = create_move_animation(
    object_data={'emoji': '🚀', 'size': 60},
    start_pos=(50, 240), end_pos=(430, 240),
    motion_type='linear', easing='ease_out'
)

# Arc (parabolic), circular, or wave motion also supported
```

### Kaleidoscope
```python
from templates.kaleidoscope import apply_kaleidoscope, create_kaleidoscope_animation

kaleido_frame = apply_kaleidoscope(frame, segments=8)

frames = create_kaleidoscope_animation(
    base_frame=my_frame,
    num_frames=30, segments=8, rotation_speed=1.0
)
```

## Composing Primitives

Primitives can be freely combined:

```python
# Bounce + shake on impact
for i in range(num_frames):
    frame = create_blank_frame(480, 480, bg_color)
    t_bounce = i / (num_frames - 1)
    y = interpolate(start_y, ground_y, t_bounce, 'bounce_out')

    if y >= ground_y - 5:
        shake_x = math.sin(i * 2) * 10
        x = center_x + shake_x
    else:
        x = center_x

    draw_emoji(frame, 'ball', (x, y), size=60)
    builder.add_frame(frame)
```

## Helper Utilities

### Text Rendering
```python
from core.typography import draw_text_with_outline, TYPOGRAPHY_SCALE

draw_text_with_outline(
    frame, "BONK!",
    position=(240, 100),
    font_size=TYPOGRAPHY_SCALE['h1'],
    text_color=(255, 68, 68),
    outline_color=(0, 0, 0),
    outline_width=4,
    centered=True
)
```

### Color Palettes
```python
from core.color_palettes import get_palette

palette = get_palette('vibrant')  # or 'pastel', 'dark', 'neon', 'professional'
bg_color = palette['background']
text_color = palette['primary']
```

### Visual Effects
```python
from core.visual_effects import ParticleSystem, create_impact_flash

particles = ParticleSystem()
particles.emit_sparkles(x=240, y=200, count=15)
particles.update()
particles.render(frame)

frame = create_impact_flash(frame, position=(240, 200), radius=100)
```

### Easing Functions
```python
from core.easing import interpolate

y = interpolate(start=0, end=400, t=progress, easing='ease_in')
# Available: linear, ease_in, ease_out, ease_in_out, bounce_out, elastic_out, back_out
```

## Optimization Strategies

### Message GIFs (over 2MB)
1. Reduce frames (lower FPS or shorter duration)
2. Reduce colors (128 to 64)
3. Reduce dimensions (480x480 to 320x320)
4. Enable duplicate frame removal

### Emoji GIFs (over 64KB)
1. Limit to 10-12 frames total
2. Use 32-40 colors maximum
3. Avoid gradients (solid colors compress better)
4. Simplify design (fewer elements)
5. Use `optimize_for_emoji=True` in save method

## Creative Process

1. **Understand the vision** -- What should happen? What is the mood?
2. **Design the animation** -- Break into phases (anticipation, action, reaction)
3. **Apply primitives as needed** -- Shake, bounce, move, effects -- mix freely
4. **Validate constraints** -- Check file size, especially for emoji GIFs
5. **Iterate if needed** -- Reduce frames/colors if over size limits

## Dependencies

```bash
pip install pillow imageio numpy
```

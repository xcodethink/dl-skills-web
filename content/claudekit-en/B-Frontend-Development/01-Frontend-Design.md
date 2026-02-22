> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Frontend Development

---
name: frontend-design
description: Use when creating unique, production-grade frontend interfaces. Guides aesthetic direction, typography, color, animation, and spatial composition to avoid generic "AI-style" design. Includes Anime.js v4 reference.
---

# Frontend Design

## Overview

This skill guides the creation of unique, production-grade frontend interfaces that avoid cookie-cutter "AI-style" aesthetics. Deliver truly functional code with extreme attention to aesthetic detail and creative choices.

When a user provides frontend requirements -- a component, page, app, or interface -- with optional context about purpose, audience, or technical constraints, follow this process.

## Design Thinking

Before coding, understand the context and establish a **bold** aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Choose an extreme style: brutalist minimalism, maximalist chaos, retro-futurism, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, raw/brutalist, art deco/geometric, soft/pastel, industrial/utilitarian, etc. These are just inspiration -- the final design should be faithful to the chosen aesthetic.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes it **memorable**? The one thing users will remember.

**Key Principle**: Choose a clear conceptual direction and execute with precision. Bold maximalism and refined minimalism can both succeed -- intentionality is what matters, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and fully functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point of view
- Polished in every detail

## Frontend Aesthetic Guidelines

Focus on:

- **Typography**: Choose beautiful, distinctive, interesting fonts. Avoid generic fonts like Arial, Inter; instead select unique fonts that elevate the aesthetic -- unexpected, personality-driven choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Establish a unified aesthetic style. Use CSS variables for consistency. A dominant hue with bold accent colors beats a timid, evenly distributed palette.
- **Animation**: Use animations for effects and micro-interactions. For HTML, prefer pure CSS solutions. For React, use the Motion library (animations with `anime.js`, see Anime.js v4 reference below). Focus on high-impact moments: one choreographed page load with staggered reveals (animation-delay) delights more than scattered micro-interactions. Use scroll triggers and surprising hover states.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous whitespace or controlled density.
- **Background & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Use creative forms like gradient meshes, noise textures, geometric patterns, layered transparency, dramatic shadows, decorative borders, custom cursors, and grain overlays.

**NEVER** use generic AI-generated aesthetics: overused font families (Inter, Roboto, Arial, system fonts), cliche color schemes (especially purple gradients on white), predictable layouts and component patterns, or cookie-cutter designs lacking context-specific personality.

Interpret creatively, make unexpected choices, and make the design truly tailored to the context. Every design should be different. Vary between light and dark themes, different fonts, different aesthetic styles. **NEVER** converge on common choices (e.g., Space Grotesk) across generations.

**Important**: Implementation complexity should match the aesthetic vision. Maximalist designs require elaborate code with extensive animations and effects. Minimalist or refined designs require restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from excellent execution of the vision.

Remember: Claude has extraordinary creativity. Don't hold back -- show what can truly be created when thinking outside the box and committing fully to a unique vision.

---

## Anime.js v4 Reference Guide

### Critical Warning: Use Anime.js v4 Syntax

**This project uses Anime.js v4.x.x -- do NOT use v3 syntax under any circumstances.**

**If you're about to write `import anime from 'animejs'` -- STOP!**
**That's v3. This project uses v4. Use the correct imports below.**

### Quick Start - Basic Setup

#### 1. Correct v4 Imports (Required)

```javascript
// Correct v4 imports
import { animate, createTimeline, stagger, utils, svg, eases, engine } from 'animejs';

// Wrong v3 imports - NEVER use
// import anime from 'animejs';
```

#### 2. Configure Time Units to Seconds (Set Once at App Entry)

```javascript
// Important: Set once at app main entry file only
// React: App.js/App.tsx or index.js/index.tsx
// Vue: main.js/main.ts
// Vanilla JS: main script loaded first

import { engine } from 'animejs';

// Set at app entry only, NOT in components
engine.timeUnit = 's';

// Now all durations use seconds: 1 = 1s, 0.5 = 500ms
// Do NOT set this in individual components -- it's global!
```

#### 3. Simple Animations Use One-Line Format (Required)

```javascript
// Good - concise, readable, one line
animate('.element', { x: 250, duration: 1, ease: 'outQuad' });

// Bad - unnecessary multi-line for simple animations
animate('.element', {
  x: 250,
  duration: 1,
  ease: 'outQuad'
});
```

### Verification Checklist

Before generating anime.js code, confirm:

- [ ] Using `import { animate, ... } from 'animejs'` not `import anime`
- [ ] `engine.timeUnit = 's'` set once at app entry only (not in components)
- [ ] All durations in seconds (1 = 1 second)
- [ ] Simple animations on one line
- [ ] Using `animate()` not `anime()`
- [ ] Using `createTimeline()` not `anime.timeline()`
- [ ] Using `ease:` not `easing:`
- [ ] Values use `to:` not `value:`
- [ ] Callbacks use `on` prefix (onUpdate, onComplete)
- [ ] Using `loop` and `alternate`, not `direction`
- [ ] Using correct v4 stagger syntax `stagger()`
- [ ] Using shorthand properties where possible (x, y, z)

### Core API - Most Common Patterns

#### Basic Animations (One-Line for Simple Cases)

```javascript
// Simple tween - always one line
animate('.element', { x: 250, rotate: 180, duration: 0.8, ease: 'inOutQuad' });

// Fade in - one line
animate('.element', { opacity: [0, 1], y: [20, 0], duration: 0.6, ease: 'outQuad' });

// Elastic scale - one line
animate('.element', { scale: [0, 1], duration: 0.8, ease: 'outElastic(1, 0.5)' });

// Infinite loop - one line
animate('.element', { rotate: 360, duration: 2, loop: true, ease: 'linear' });
```

#### Timeline Creation

```javascript
const tl = createTimeline({ defaults: { duration: 1, ease: 'outQuad' } });

tl.add('.element1', { x: 250 })
  .add('.element2', { y: 100 }, '+=0.2')  // 0.2s after previous ends
  .add('.element3', { rotate: 180 }, '<'); // starts with previous
```

#### Stagger Animations (One-Line)

```javascript
animate('.elements', { x: 250, delay: stagger(0.1) });  // 0.1s between each
animate('.elements', { x: 250, delay: stagger(0.1, { from: 'center' }) });
```

### Common AI Mistakes

#### Mistake #1: Using v3 Import Pattern

```javascript
// Wrong - this is v3
import anime from 'animejs';
anime({ targets: '.element', translateX: 250 });

// Correct - always use v4
import { animate } from 'animejs';
animate('.element', { x: 250 });
```

#### Mistake #2: Using 'targets' Property

```javascript
// Wrong - 'targets' is v3 syntax
animate({ targets: '.element', translateX: 250 });

// Correct - first argument is the target
animate('.element', { x: 250 });
```

#### Mistake #3: Using 'easing' Instead of 'ease'

```javascript
// Wrong
animate('.element', { x: 250, easing: 'easeInOutQuad' });

// Correct
animate('.element', { x: 250, ease: 'inOutQuad' });
```

#### Mistake #4: Using 'value' for Animation Values

```javascript
// Wrong - 'value' is v3 syntax
animate('.element', { x: { value: 250 } });

// Correct - use 'to'
animate('.element', { x: { to: 250 } });
```

#### Mistake #5: Timeline Syntax Errors

```javascript
// Wrong - anime.timeline() is v3
const tl = anime.timeline();

// Correct - use createTimeline
import { createTimeline } from 'animejs';
const tl = createTimeline();
```

### Property Syntax Reference (v3 -> v4)

#### Easing Functions

```javascript
// v4: use 'ease' (without 'ease' prefix)
{ ease: 'inOutQuad' }
{ ease: 'outElastic(1, 0.5)' }
{ ease: 'cubicBezier(0.4, 0, 0.2, 1)' }

// v3: do NOT use 'easing' or 'ease' prefix
// { easing: 'easeInOutQuad' }
```

#### Direction and Looping

```javascript
// v4
{
  loop: true,        // Infinite loop
  loop: 3,           // Loop 3 times
  alternate: true,   // Alternate direction
  reversed: true     // Play in reverse
}

// v3: do NOT use 'direction'
// { direction: 'alternate' }
```

#### Transform Properties (Prefer Shorthand)

```javascript
// v4 both valid:
animate('.element', { x: 100, y: 50, z: 25 });           // Shorthand (preferred)
animate('.element', { translateX: 100, translateY: 50, translateZ: 25 }); // Full form
```

#### Callbacks (All Use 'on' Prefix)

```javascript
// v4: simple callback - keep on one line
animate('.element', { x: 250, duration: 1, onComplete: () => console.log('Done!') });

// v4: multiple callbacks - use multi-line
animate('.element', {
  x: 250,
  duration: 1,
  onBegin: (anim) => console.log('Started'),
  onUpdate: (anim) => console.log('Progress:', anim.progress),
  onComplete: (anim) => console.log('Finished')
});

// v3: do NOT use unprefixed callbacks
// { update: () => {}, complete: () => {} }
```

### Common Animation Patterns

#### Hover Animations (One Line Each)

```javascript
element.addEventListener('mouseenter', () => animate(element, { scale: 1.1, duration: 0.3, ease: 'outQuad' }));
element.addEventListener('mouseleave', () => animate(element, { scale: 1, duration: 0.3, ease: 'outQuad' }));
```

#### Sequential Timeline

```javascript
const tl = createTimeline({ defaults: { duration: 0.5 } });
tl.add('.step1', { x: 100 })
  .add('.step2', { y: 100 })
  .add('.step3', { scale: 2 });
```

#### Scroll-Triggered Animations

```javascript
import { createScrollObserver } from 'animejs';

createScrollObserver({
  target: '.scroll-element',
  root: document.querySelector('.scroll-container'),
  play: () => animate('.element', { x: 250, duration: 1 }),
  visibility: 0.5
});
```

### Advanced Features

#### SVG Animations

```javascript
import { animate, svg } from 'animejs';

// Path morphing (one line)
animate('#path1', { d: svg.morphTo('#path2'), duration: 1 });

// Draw SVG lines
const drawable = svg.createDrawable('.svg-path');
animate(drawable, { draw: '0% 100%', duration: 2 });

// Motion path (simple usage one line)
const motionPath = svg.createMotionPath('#motion-path');
animate('.element', { x: motionPath.translateX, y: motionPath.translateY, rotate: motionPath.rotate });
```

#### Utility Functions

```javascript
import { utils } from 'animejs';

// DOM selection
const elements = utils.$('.elements');

// Get current value
const currentX = utils.get('.element', 'translateX');

// Set value immediately
utils.set('.element', { x: 100, opacity: 0.5 });

// Remove animations
utils.remove('.element');

// Math utilities
utils.random(0, 100);
utils.shuffle([1, 2, 3, 4]);
utils.lerp(0, 100, 0.5); // 50
utils.clamp(150, 0, 100); // 100
```

### Performance Tips

1. **Use transform properties over position properties**

   ```javascript
   // Good - uses transform
   animate('.element', { x: 100 });

   // Bad - triggers reflow
   animate('.element', { left: 100 });
   ```

2. **Batch animations into timelines**

   ```javascript
   // Good - single timeline
   const tl = createTimeline();
   elements.forEach(el => tl.add(el, { x: 100 }));

   // Bad - multiple independent animations
   elements.forEach(el => animate(el, { x: 100 }));
   ```

3. **Use will-change CSS for complex animations**

   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```

### AI Code Generation Rules

When generating anime.js animation code:

1. **Only** set `engine.timeUnit = 's'` at the app main entry file (never in components)
2. **Always** use seconds for durations (1 = 1 second)
3. **Always** write simple animations on one line
4. **Always** use v4 imports
5. **Never** use the `anime()` function
6. **Always** use `animate()` for animations
7. **Never** use the `targets` property
8. **Always** use `ease` not `easing`
9. **Never** use `value`, use `to` instead
10. **Always** prefix callbacks with `on`
11. **Never** use `direction`, use `alternate` and `reversed`
12. **Always** use `createTimeline()` for timelines
13. **Prefer** shorthand (`x`) over full form (`translateX`)
14. **Format** short animations as one-liners (4 properties or fewer)
15. **Never** generate v3 syntax under any circumstances

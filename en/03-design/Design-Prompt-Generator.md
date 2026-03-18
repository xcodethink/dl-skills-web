> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: C-AI-Engineering

---
name: design-prompt-generator
description: Generate layered 7-step design prompts for AI web development tools like Lovable, Cursor, and Bolt
---

# Design Prompt Generator v2

## Overview

A 7-step layered design prompt generator for AI web development tools (Lovable, Cursor, Bolt). It takes a service idea and produces a comprehensive, structured design specification covering domain research, user journey, emotional design, identity, design system, component specs, and micro-interactions.

## 7-Step Framework

```
Step 1: Domain Research    -> Industry UX patterns, competitor insights
Step 2: User Journey       -> Core user flows, conversion touchpoints
Step 3: Emotional Design   -> Emotion keywords, mood concepts
Step 4: Identity & Goals   -> Brand positioning, objectives
Step 5: Design System      -> Colors, typography, components
Step 6: Component Specs    -> Core component detailed definitions
Step 7: Micro-Interactions -> Animation, interaction patterns
```

---

## Step 1: Domain Research

Analyze industry UX patterns and competitors.

**Exploration Questions:**
- What are the top 3 apps/websites in this domain?
- What UX patterns do users expect? (e.g., swipe for dating, cards for food delivery)
- What trust signals matter? (reviews, badges, guarantees)
- What pain points do competitors fail to solve?

**Domain Pattern Reference:**

| Domain | Expected Patterns | Trust Signals | Core Action |
|--------|------------------|---------------|-------------|
| Pet Services | Profile cards, booking calendar, pet type filters | Certification badges, reviews, insurance | Search -> View -> Book -> Pay |
| SaaS | Feature comparison, pricing tiers, demo CTA | Logos, testimonials, security badges | Learn -> Try -> Subscribe |
| E-commerce | Grid gallery, filters, cart | Reviews, return policy, secure payment | Browse -> Add to Cart -> Checkout |
| Education | Course cards, progress tracking, instructor profiles | Certificates, student count, ratings | Browse -> Enroll -> Learn |
| Healthcare | Doctor search, appointment slots, symptom checker | Licenses, hospital affiliations | Find -> Book -> Consult |
| Fintech | Dashboard, transaction history, quick actions | Encryption badges, compliance labels | Connect -> Monitor -> Execute |
| Food Delivery | Restaurant cards, live tracking, reorder | Ratings, estimated delivery time | Browse -> Order -> Track |
| Marketplace | Seller profiles, product listings, instant messaging | Verification, transaction history | Search -> Contact -> Transact |

---

## Step 2: User Journey

Map core user flows and conversion touchpoints.

**Framework:**
```
[Entry] -> [Discovery] -> [Evaluation] -> [Decision] -> [Action] -> [Retention]
```

**Per-stage definition:**
```
Journey Stage: [Stage Name]
├── User Goal: What they want to accomplish
├── Key Information: What info they need
├── Friction Points: Why they might drop off
└── Solution: Design solution
```

---

## Step 3: Emotional Design

Define the emotions the design should evoke.

**Emotion-to-Visual Matrix:**

| Emotion | Visual Expression | Color Direction | Typography | Imagery |
|---------|------------------|-----------------|------------|---------|
| Trust | Clean, orderly, consistent | Blue, green | Stable serif / clean sans-serif | Real photos, badges |
| Warmth | Soft rounded, organic shapes | Warm yellow, orange | Rounded, friendly | Illustrations, smiles |
| Energy | High contrast, dynamic angles | Vivid red, orange | Strong, impactful | Action photos, motion |
| Calm | Whitespace, minimal | Soft blue-green, neutrals | Light weight | Nature, minimal |
| Luxury | Dark backgrounds, gold accents | Black, gold, deep purple | Elegant serif | High-end photography |
| Fun | Asymmetric, animated | Bright multi-color palette | Quirky, custom | Illustrations, icons |
| Professional | Grid-based, structured | Navy, gray, white | Classic sans-serif | Corporate, clean |

**Example emotion ratio:** 60% Trust, 30% Warmth, 10% Energy

---

## Step 4: Identity and Goals

Define brand positioning.

**Template:**
```
Service Name:       [Name]
One-Line Description: [10 words or less]
Category:           [Domain category]
Differentiation:    [What sets it apart from competitors]
Primary Goal:       [Core conversion action]
Secondary Goal:     [Supporting action]
Brand Personality:  [3 adjectives]
```

---

## Step 5: Design System

Define the comprehensive visual system.

**Color System:**
```
Primary:      #[hex] - CTAs, core actions
Secondary:    #[hex] - Supporting elements
Accent:       #[hex] - Highlights, badges
Background:   #[hex] - Base canvas
Surface:      #[hex] - Cards, elevated elements
Text Primary: #[hex] - Headings, body text
Text Muted:   #[hex] - Captions, hints
Success:      #[hex] - Confirmations
Warning:      #[hex] - Alerts
Error:        #[hex] - Error states
```

**Typography:**
```
Headings: [Font] - [Weight] - [Features]
Body:     [Font] - [Weight] - [Line-height]
Scale:    [base]px, ratio [ratio]
```

**Spacing and Layout:**
```
Base unit:    [4/8]px
Border radius: [size]px
Shadows:      subtle / medium / strong
Grid:         [columns] columns, [gap]px gap
Container:    max-width [width]px
```

**Component Styles:**
```
Buttons:  [Shape], [Padding], [Hover effect]
Cards:    [Radius], [Shadow], [Padding]
Inputs:   [Border], [Focus state]
```

---

## Step 6: Component Specs

Define core components for each domain.

**Component Template:**
```
[Component Name]
├── Purpose: Why it exists
├── Content: What information it displays
├── States: Default, Hover, Active, Disabled, Loading
├── Variants: Versions needed
└── Responsive: How it adapts for mobile
```

**Common Domain Components:**
- **Profile/Card**: User or item display
- **Search/Filter**: Discovery mechanism
- **Booking/Action**: Core conversion
- **Review/Trust**: Social proof
- **Status/Progress**: Feedback and tracking

---

## Step 7: Micro-Interactions

Define animations and interaction feedback.

**Categories:**

| Type | Purpose | Examples |
|------|---------|---------|
| Entrance | Draw attention to new content | Fade-in, slide-up, scale-in |
| Feedback | Confirm user actions | Button press, success checkmark |
| State Change | Indicate transitions | Loading spinner, skeleton screen |
| Navigation | Guide between views | Page transitions, drawer slide |
| Delight | Create memorable moments | Confetti, bounce effects |

**Spec Format:**
```
Trigger:  [What triggers it]
Animation: [What happens]
Duration:  [Time in ms]
Easing:    [Easing curve]
Purpose:   [Why it exists]
```

**Recommended Defaults:**
- Micro-feedback: 150-200ms, ease-out
- Transitions: 250-350ms, ease-in-out
- Entrances: 400-600ms, ease-out + stagger

---

## Output Format

Final prompt structure:

```markdown
# [Service Name] Design Prompt

## Domain Context
[Industry insights, user expectations, competitive landscape]

## User Journey
[Stage-by-stage flow and design implications]

## Emotional Direction
[Primary emotions, visual interpretations]

## Design Specifications

### Identity
[Name, positioning, personality]

### Design System
[Full color, typography, spacing specs]

### Core Components
[Domain-specific component definitions]

### Interactions
[Animation, micro-interaction specs]

## Implementation Prompt
[Copy-paste ready prompt for AI tools]

## Iteration Prompts
[Step-by-step refinement prompts]
```

---

## User Input

**Required:**
1. Service topic/industry
2. Service name (suggest one if not provided)

**Optional (for better results):**
3. Target users
4. Competitors or reference services
5. Desired mood/emotion
6. Required features
7. Page type (landing page / app UI / dashboard)

*When minimal input is provided, use domain defaults and clearly note assumptions.*

---

## Quality Checklist

- [ ] Reflects domain-specific UX patterns
- [ ] User journey stages reflected in structure
- [ ] Emotion keywords translated to visual specs
- [ ] Color system complete (with usage descriptions)
- [ ] Core component states defined
- [ ] Micro-interactions specified
- [ ] Mobile responsive considerations included
- [ ] Implementation prompt is copy-paste ready

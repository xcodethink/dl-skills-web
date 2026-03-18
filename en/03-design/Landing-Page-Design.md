> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: B-Design-and-UI

---
name: landing-page-design
description: Create high-conversion landing pages with exceptional design quality using the 11-element framework
---

# Landing Page Design Guide v2

## Overview

This skill helps create **unique, high-conversion landing pages** that combine proven conversion frameworks (DESIGNNAS 11 essential elements), exceptional design quality (bold aesthetic choices for memorable brand experiences), and production-ready code (Next.js 14+ with ShadCN UI, TypeScript, and performance optimizations). The philosophy: a landing page must both convert visitors and make them remember your brand.

## When to Use

Trigger this skill when the user requests:
- Landing pages, marketing pages, or product pages
- Next.js or React-based promotional websites
- Pages that need to convert visitors **and** stand out visually
- Professional marketing pages with exceptional design quality
- Landing pages that avoid cookie-cutter "template" aesthetics

## Design Thinking: Before Coding

Before implementing any landing page, establish a **bold aesthetic direction** aligned with the brand and product.

### 1. Understand Context
- **Purpose**: What problem does this product solve? Who is the target audience?
- **Brand personality**: Playful, professional, luxurious, minimal, bold, or tech-forward?
- **Industry**: What visual language is expected (or should we break it)?
- **Differentiation**: What makes this brand memorable?

### 2. Choose Aesthetic Direction

Commit to one extreme direction. Examples:

| Direction | Characteristics | Best For |
|-----------|----------------|----------|
| **Minimal & Refined** | Ultra-clean layouts, generous whitespace, refined typography, subtle micro-interactions | Luxury, professional services, high-end SaaS |
| **Bold & Maximalist** | Rich visual layers, dynamic animations, gradient meshes, vibrant palette | Creative agencies, entertainment, youth brands |
| **Retro-Futurism** | Nostalgic + modern, geometric patterns, neon accents, glitch effects, monospace fonts | Gaming, tech startups, creative tools |
| **Organic & Natural** | Soft flowing shapes, earth-tone colors, fluid animations, rounded corners | Health, sustainability, food |
| **Editorial & Magazine** | Strong typographic hierarchy, asymmetric layouts, bold whitespace usage | Content platforms, media, education |
| **Brutalist & Raw** | Unconventional layouts, system fonts, high contrast, minimal animation | Art, fashion, counter-culture brands |

**Key**: Choose **one** clear direction. Execute it precisely and consistently across all 11 elements.

### 3. Define Design System

Before coding, establish these core decisions:

**Typography:**
- **Display font**: Unique and memorable (never Inter, Roboto, Arial, or system fonts)
  - Consider: Space Grotesk, Clash Display, Cabinet Grotesk, Syne, DM Serif Display, Zodiak, Fraunces, Archivo Black, Unbounded, Outfit
  - Or thoughtful Google Fonts: Playfair Display, Crimson Pro, Libre Baskerville, Epilogue, Plus Jakarta Sans
  - **Never** converge on the same font across different projects
- **Body font**: Refined, readable complement to display (DM Sans, General Sans, Switzer, Geist, Manrope, Karla, Work Sans)
- **Scale**: Clear hierarchy (e.g., H1: 4rem, H2: 3rem, H3: 2rem, Body: 1rem)

**Color Scheme:**
- **Primary**: Dominant brand color (60% usage)
- **Accent**: High-contrast CTA color (10% usage)
- **Neutrals**: Grays or earth tones (30% usage)
- **Background strategy**: Solid, gradient, texture, or pattern
- Define as CSS variables for consistency

**Motion Strategy:**
- **Page load**: Staggered hero element fade-in (animation-delay)
- **Scroll**: Fade-in, parallax, or scroll-triggered animations
- **Hover states**: Subtle scale, color shift, or dramatic transforms
- **CTA animation**: Attention-grabbing without being annoying

**Spatial Approach:**
- **Layout style**: Centered symmetric? Asymmetric dynamic? Grid-breaking?
- **Spacing system**: Tight and dense? Open and airy?
- **Section flow**: Traditional stacked? Diagonal? Overlapping?

## 11 Essential Elements Framework

Every high-performing landing page must include these 11 elements. Based on the DESIGNNAS proven high-conversion framework.

**Each element has two requirements:**
1. **Functional** (conversion goal) -- must be present
2. **Design excellence** (memorability) -- must be unique and polished

### Element Guide

#### 1. Keyword-Rich URL
**Functional**: SEO-optimized descriptive URL structure
**Design**: N/A (SEO-driven)

#### 2. Company Logo (Header)
**Functional**: Brand identity prominently placed (top-left)
**Design Excellence**:
- Logo animation on page load
- Sticky header with smooth scroll transitions
- Logo variants for different scroll states
- Header background: transparent -> frosted glass on scroll
- Navigation typography matches display font

#### 3. SEO-Optimized Headline and Subheadline (Hero)
**Functional**: Clear value proposition with keywords
**Design Excellence**:
- Typography: **huge** and memorable (4rem-6rem+)
- Use the unique display font here
- Consider gradient text, text stroke, or text shadows for impact
- Staggered word fade-in animation (animation-delay)
- Subheadline at 50% of headline size, different weight or font
- Add visual rhythm through line breaks and spacing

#### 4. Primary CTA (Hero)
**Functional**: Core call-to-action button in the hero area
**Design Excellence**:
- Make it **impossible to miss**: size, color contrast, placement
- Avoid boring rectangles: consider pill shapes, unique borders, geometric forms
- Add micro-interactions: hover scale, shadow expansion, color shift
- Consider primary/secondary dual CTA hierarchy
- Delayed entrance animation after headline
- Add visual cues: arrows, icons, or pulse effects

#### 5. Social Proof (Hero)
**Functional**: Reviews, ratings, user statistics
**Design Excellence**:
- Numbers should be **large** with count-up animation on load
- Stats cards with gradient backgrounds or refined borders
- Customer avatars as overlapping circles
- Star ratings with custom styling (not default yellow stars)
- "As seen in" logos with proper spacing and opacity treatment
- Consider testimonial carousel or dynamic social proof ticker

#### 6. Images or Video (Media Section)
**Functional**: Visual showcase of product/service
**Design Excellence**:
- **Critical**: Never use placeholders or generic stock images
- Product screenshots in device mockups (laptop/phone frames)
- Add depth: shadows, reflections, 3D tilt effects
- Consider: floating screenshots, parallax scroll, video backgrounds
- Image reveal animations on scroll (fade-in, slide-in)
- Video: custom play button design, ambient background glow
- Grid layout: asymmetric, overlapping, or Bento Box style

#### 7. Core Benefits/Features
**Functional**: 3-6 key benefits with icons
**Design Excellence**:
- **Icons**: Custom-designed or carefully curated (not generic line icons)
- Consider: gradient fills, animated hover icons, 3D-style illustrations
- Card design variants: glassmorphism, neumorphism, gradient borders, refined shadows
- Staggered animation on scroll into view
- Asymmetric layout instead of boring 3-column grid
- Background elements: subtle patterns, gradients, or decorative shapes
- Typography: feature titles use display font, bold and prominent

#### 8. Customer Testimonials
**Functional**: 4-6 real testimonials with photos
**Design Excellence**:
- Photo treatment: circular avatars with gradient borders or unique shapes
- Card backgrounds: subtle gradients, glass effect, or elevated shadows
- Quote marks: oversized, decorative, or custom styled
- Layout: masonry, carousel, or staggered vertical
- Star ratings: custom colors matching brand palette
- Hover effects: lift, expand, or glow
- Customer name and title: refined typography

#### 9. FAQ Section
**Functional**: 5-10 common questions with accordion UI
**Design Excellence**:
- Accordion animation: smooth expand/collapse with easing
- Icons: custom arrows or plus/minus with rotation animation
- Hover states on questions
- Typography: questions in bold or different weight
- Consider: two-column layout on desktop, side-by-side Q&A
- Background: subtle color shift from previous section
- Spacing: generous padding inside accordion items

#### 10. Final CTA
**Functional**: Bottom call-to-action (second conversion opportunity)
**Design Excellence**:
- **Make it a hero moment**: this is the last chance
- Full-width section with dramatic background (gradient, pattern, or color)
- CTA button larger than hero CTA
- Add urgency: countdown, limited spots, scarcity indicators
- Surround with persuasive copy and micro-benefits
- Animation: parallax background, floating elements, scroll-triggered effects
- Consider: email input + button combo (for mailing lists/waitlists)

#### 11. Contact Info / Legal (Footer)
**Functional**: Complete footer with info and legal links
**Design Excellence**:
- Multi-column layout with clear information hierarchy
- Social icons: hover effects (color change, scale, or rotation)
- Newsletter: styled input with inline button
- Typography: smaller but readable (14-16px)
- Background: darker or distinct color from body
- Content dividers: subtle gradient lines or decorative separators
- Bottom bar: copyright and legal links with proper spacing

**Key**: Every landing page must include all 11 elements, no exceptions.

## Design Aesthetic Guidelines

### Typography Excellence
- **Never** use generic fonts: Inter, Roboto, Arial, Helvetica, system-ui
- **Display fonts** must be unique and memorable
- **Pair wisely**: Display for headings + refined body font for text
- **Dramatic scale**: Obvious size jumps for clear hierarchy (not subtle differences)
- **Letter-spacing**: Adjust for display fonts (usually tighter tracking)
- **Line-height**: Display = 1.1-1.2, Body = 1.6-1.8

### Color and Visual Consistency
- **Define CSS variables** for all colors
- **Primary color** should appear throughout (not just on CTAs)
- **Accent** must have sufficient contrast for accessibility (WCAG AA minimum)
- **Avoid**: White-on-purple gradients (overused AI aesthetic)
- **Backgrounds**: Use gradients, meshes, patterns, or textures for atmosphere

### Motion and Animation
- **Page load**: One choreographed entrance with staggered fade-in
- **Scroll**: Sections fade in on viewport entry (Intersection Observer or Framer Motion)
- **Hover states**: Surprise and delight (button scale, card lift, image parallax)
- **Performance**: Prefer CSS animations; use `transform` and `opacity` (GPU-accelerated)

### Spatial Composition
- **Break the grid**: Do not default to centered symmetric layouts
- **Asymmetry**, overlapping elements, diagonal flow, Z-axis depth with shadows and blur

### Avoid Generic AI Aesthetics

**Do Not:**
- Use Inter/Roboto/Arial fonts
- Use white-on-purple gradients
- Use perfectly centered symmetric layouts every time
- Use generic line icons or default yellow star ratings
- Use boring rectangular buttons or plain white backgrounds
- Use identical 3-column feature grids or stock photos

**Do:**
- Choose unique fonts matching brand personality
- Establish a distinctive color scheme
- Create asymmetric, unexpected layouts
- Design or curate icons with personality
- Customize all UI elements to match the aesthetic
- Add background textures, gradients, or patterns

## Tech Stack Requirements

### Required
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ShadCN UI** for all UI components (must be heavily customized)
- **Framer Motion** (optional) for advanced animations

### ShadCN UI Components to Install
```bash
npx shadcn-ui@latest add button card accordion badge avatar separator input
```

**Important**: ShadCN components are **starting points**, not final designs. Customize heavily: modify default styles, add custom variants, override via className, create branded wrapper components.

## Project Structure

```
landing-page/
├── app/
│   ├── layout.tsx          # Root layout (with metadata)
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Logo & navigation (Element 2)
│   ├── Hero.tsx            # Headline, CTA, social proof (Elements 3-5)
│   ├── MediaSection.tsx    # Images/video (Element 6)
│   ├── Benefits.tsx        # Core benefits (Element 7)
│   ├── Testimonials.tsx    # Customer reviews (Element 8)
│   ├── FAQ.tsx             # FAQ accordion (Element 9)
│   ├── FinalCTA.tsx        # Bottom CTA (Element 10)
│   └── Footer.tsx          # Contact & legal (Element 11)
├── public/
│   └── images/
└── package.json
```

## Implementation Workflow

1. **Design first** -- Complete design thinking: brand, audience, aesthetic direction, design system
2. **Build design system** -- CSS variables for fonts, colors, spacing, animation timing in `globals.css` and `tailwind.config.ts`
3. **Set up metadata** -- SEO-optimized title, description, keywords, Open Graph tags
4. **Build components** -- Header, Hero, Media, Benefits, Testimonials, FAQ, FinalCTA, Footer
5. **Customize ShadCN** -- Heavy customization of all components
6. **Add animations** -- Page load, scroll-triggered, hover states
7. **Responsive design** -- Mobile-first approach
8. **Performance** -- Lazy loading, font optimization, image optimization via Next.js Image
9. **Accessibility** -- WCAG AA compliance, `prefers-reduced-motion` support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Validation Checklist

### Design Quality
- [ ] Aesthetic direction chosen and consistently executed
- [ ] Typography: unique display font (not Inter/Roboto/Arial)
- [ ] Typography: clear hierarchy with dramatic scale differences
- [ ] Color scheme: CSS variables defined, globally consistent
- [ ] Backgrounds: not plain white -- textures/gradients/patterns present
- [ ] Animations: staggered page load, scroll-triggered fade-ins
- [ ] Layout: not generic centered grid -- unique composition
- [ ] ShadCN: components heavily customized, not default styles
- [ ] Passes the "does this look AI-generated?" test

### 11 Essential Elements (Conversion)
- [ ] 1. Keyword-rich URL
- [ ] 2. Company logo (top-left, with animation)
- [ ] 3. SEO headline and subheadline (huge typography)
- [ ] 4. Hero primary CTA (unique design, micro-interactions)
- [ ] 5. Social proof (reviews, stats, with animation)
- [ ] 6. Images or video (with depth effects, no placeholders)
- [ ] 7. Benefits/features section (3-6 items, custom icons, unique layout)
- [ ] 8. Customer testimonials (4-6, styled cards)
- [ ] 9. FAQ section (5-10 questions, smooth accordion)
- [ ] 10. Final CTA (dramatic, full-width)
- [ ] 11. Footer with contact and legal links (multi-column, refined)

### Technical Requirements
- [ ] Next.js 14+ with App Router
- [ ] TypeScript types defined
- [ ] Tailwind CSS styling
- [ ] ShadCN UI installed and customized
- [ ] Metadata configured (title, description, OG tags)
- [ ] Images optimized with Next.js Image component
- [ ] Responsive design implemented (mobile-first)
- [ ] Accessibility standards met (WCAG AA)
- [ ] Performance optimized (lazy loading, font optimization)
- [ ] Animations respect prefers-reduced-motion

## Common Patterns and Aesthetic Suggestions

| Page Type | Conversion Focus | Aesthetic Suggestions |
|-----------|-----------------|---------------------|
| **SaaS Product** | Free trial CTA, feature comparison, clear pricing, trust badges | Minimal professional, tech-forward, or bold confident |
| **E-commerce Product** | Product images, pricing, shipping, return policy, urgency | Luxury/premium, vibrant/youthful, or natural/sustainable |
| **Service/Agency** | Portfolio/case studies, process explanation, team credentials, contact form | Creative/bold, editorial, or minimal/portfolio |
| **Event/Webinar** | Date/time prominent, speaker bios, agenda, registration, countdown | Energetic/dynamic, professional/conference, or community/friendly |
| **Mobile App** | App store badges, device-framed screenshots, feature highlights, demo video | Modern/sleek, fun/playful, or screenshot-driven |

## Core Principles

1. **Conversion + Memorability**: Landing pages must both convert and be memorable
2. **Intentional Design**: Every aesthetic choice should be deliberate, not default
3. **No Generic AI Aesthetics**: Avoid the "AI-generated" look that makes brands forgettable
4. **Design System First**: Define fonts, colors, motion before coding
5. **Full Customization**: ShadCN is a starting point, not the final design

**The best landing pages both convert and inspire.**

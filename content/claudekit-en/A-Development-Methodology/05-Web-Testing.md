> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Development Methodology

---
name: web-testing
description: Web testing with Playwright, Vitest, k6. E2E/unit/integration/load/security/visual/a11y testing. Use for test automation, flakiness, Core Web Vitals, mobile gestures, cross-browser.
---

# Web Testing

## Overview

Comprehensive web testing skill covering unit, integration, E2E, load, security, visual regression, and accessibility testing. Provides frameworks, patterns, and checklists for building reliable test suites across the full testing pyramid.

## Quick Start

```bash
npx vitest run                    # Unit tests
npx playwright test               # E2E tests
npx playwright test --ui          # E2E with UI
k6 run load-test.js               # Load tests
npx @axe-core/cli https://example.com  # Accessibility
npx lighthouse https://example.com     # Performance
```

## Testing Pyramid (70-20-10)

| Layer | Ratio | Framework | Speed |
|-------|-------|-----------|-------|
| Unit | 70% | Vitest/Jest | <50ms |
| Integration | 20% | Vitest + fixtures | 100-500ms |
| E2E | 10% | Playwright | 5-30s |

## When to Use

- **Unit**: Functions, utilities, state logic
- **Integration**: API endpoints, database operations, module interactions
- **E2E**: Critical flows (login, checkout, payment)
- **Load**: Pre-release performance validation
- **Security**: Pre-deploy vulnerability scanning
- **Visual**: UI regression detection

## Reference Documentation

### Core Testing
- Unit/Integration Testing Patterns
- Playwright E2E Workflows
- React/Vue/Angular Component Testing
- Testing Pyramid Strategy - Test ratios, priority matrix

### Cross-Browser & Mobile
- Cross-Browser Checklist - Browser/device matrix
- Mobile Gesture Testing - Touch, swipe, orientation
- Shadow DOM Testing - Web components testing

### Interactive & Forms
- Interactive Testing Patterns - Forms, keyboard, drag-drop
- Functional Testing Checklist - Feature testing

### Performance & Quality
- Core Web Vitals - LCP/CLS/INP, Lighthouse CI
- Visual Regression - Screenshot comparison
- Test Flakiness Mitigation - Stability strategies

### Accessibility
- Accessibility Testing - WCAG checklist, axe-core

### Security
- Security Testing Overview - OWASP Top 10, tools
- Security Checklists - Authentication, API, headers
- Vulnerability Payloads - SQL injection/XSS/CSRF payloads

### API & Load
- API Testing Patterns
- k6 Load Testing Patterns

### Checklists
- Pre-Release Checklist - Complete release checklist

## CI/CD Integration

```yaml
jobs:
  test:
    steps:
      - run: npm run test:unit      # Gate 1: Fast fail
      - run: npm run test:e2e       # Gate 2: After unit pass
      - run: npm run test:a11y      # Accessibility
      - run: npx lhci autorun       # Performance
```

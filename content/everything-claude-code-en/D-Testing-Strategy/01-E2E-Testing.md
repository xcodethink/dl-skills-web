# E2E Testing with Playwright

> **Source:** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> **Original files:** agents/e2e-runner.md, commands/e2e.md, skills/e2e-testing/SKILL.md
> **Curated:** 2026-02-21

---

## Overview

E2E tests are the last line of defense before production. They catch integration issues that unit tests miss by verifying critical user journeys end-to-end. This guide covers Playwright-based E2E testing including the Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strategies.

---

## Core Workflow

1. **Plan** -- Identify critical user journeys, define scenarios (happy path, edge cases, errors), prioritize by risk
2. **Create** -- Use Page Object Model, prefer `data-testid` locators, add assertions at key steps, capture screenshots
3. **Execute** -- Run locally 3-5 times to check for flakiness, quarantine flaky tests, upload artifacts

---

## Tooling

### Agent Browser (Preferred)

Semantic selectors, AI-optimized, auto-waiting, built on Playwright.

```bash
npm install -g agent-browser && agent-browser install
agent-browser open https://example.com
agent-browser snapshot -i          # Get elements with refs [ref=e1]
agent-browser click @e1            # Click by ref
agent-browser fill @e2 "text"      # Fill input by ref
```

### Playwright (Fallback)

```bash
npx playwright test                        # Run all
npx playwright test tests/auth.spec.ts     # Specific file
npx playwright test --headed               # See browser
npx playwright test --debug                # Inspector
npx playwright show-report                 # HTML report
```

---

## Page Object Model

```typescript
import { Page, Locator } from '@playwright/test'

export class ItemsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly itemCards: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.itemCards = page.locator('[data-testid="item-card"]')
  }

  async goto() {
    await this.page.goto('/items')
    await this.page.waitForLoadState('networkidle')
  }

  async search(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp => resp.url().includes('/api/search'))
    await this.page.waitForLoadState('networkidle')
  }

  async getItemCount() {
    return await this.itemCards.count()
  }
}
```

---

## Configuration

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'playwright-results.xml' }],
    ['json', { outputFile: 'playwright-results.json' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

---

## Flaky Test Handling

### Quarantine

```typescript
test('flaky: complex search', async ({ page }) => {
  test.fixme(true, 'Flaky - Issue #123')
})

test('conditional skip', async ({ page }) => {
  test.skip(process.env.CI, 'Flaky in CI - Issue #123')
})
```

### Detection

```bash
npx playwright test tests/search.spec.ts --repeat-each=10
npx playwright test tests/search.spec.ts --retries=3
```

### Common Fixes

| Problem | Bad | Good |
|---------|-----|------|
| Race conditions | `await page.click(sel)` | `await page.locator(sel).click()` |
| Network timing | `await page.waitForTimeout(5000)` | `await page.waitForResponse(...)` |
| Animation timing | Direct click during animation | `waitFor({ state: 'visible' })` then click |

---

## Artifact Management

```typescript
// Screenshots
await page.screenshot({ path: 'artifacts/result.png' })
await page.screenshot({ path: 'artifacts/full.png', fullPage: true })
await page.locator('[data-testid="chart"]').screenshot({ path: 'artifacts/chart.png' })

// Traces
await browser.startTracing(page, { path: 'artifacts/trace.json', screenshots: true })
await browser.stopTracing()

// Video -- configure in playwright.config.ts
use: { video: 'retain-on-failure', videosPath: 'artifacts/videos/' }
```

---

## CI/CD Integration

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env: { BASE_URL: "${{ vars.STAGING_URL }}" }
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: playwright-report, path: playwright-report/, retention-days: 30 }
```

---

## Key Principles

| Principle | Details |
|-----------|---------|
| Semantic locators | `[data-testid]` > CSS > XPath |
| Wait for conditions | `waitForResponse()` > `waitForTimeout()` |
| Auto-wait locators | `page.locator().click()` auto-waits |
| Test isolation | No shared state between tests |
| Fail fast | `expect()` assertions at every key step |
| Trace on retry | `trace: 'on-first-retry'` for debugging |

---

## Success Metrics

- Critical journeys passing: 100%
- Overall pass rate: >95%
- Flaky rate: <5%
- Test duration: <10 minutes
- Artifacts uploaded and accessible

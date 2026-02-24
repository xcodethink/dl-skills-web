# E2E 端到端测试（E2E Testing）

> **来源：** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> **原始文件：** agents/e2e-runner.md, commands/e2e.md, skills/e2e-testing/SKILL.md
> **整理日期：** 2026-02-21

---

## 概述

端到端测试（E2E Testing）是确保关键用户旅程正确运行的最后一道防线。它能捕获单元测试遗漏的集成问题。本文件涵盖使用 Playwright 进行 E2E 测试的完整方案，包括测试创建、执行、工件管理和不稳定测试（Flaky Test）处理。

---

## 核心职责

1. **测试旅程创建** — 为用户流程编写测试（优先使用 Agent Browser，回退到 Playwright）
2. **测试维护** — 随 UI 变更保持测试更新
3. **不稳定测试管理** — 识别并隔离不稳定的测试
4. **工件管理** — 捕获截图、视频、追踪文件
5. **CI/CD 集成** — 确保测试在流水线中可靠运行
6. **测试报告** — 生成 HTML 报告和 JUnit XML

---

## 主要工具：Agent Browser

**优先使用 Agent Browser 而非原始 Playwright** — 语义选择器、AI 优化、自动等待、基于 Playwright 构建。

```bash
# 安装
npm install -g agent-browser && agent-browser install

# 核心工作流
agent-browser open https://example.com
agent-browser snapshot -i          # 获取带引用的元素 [ref=e1]
agent-browser click @e1            # 通过引用点击
agent-browser fill @e2 "text"      # 通过引用填充输入
agent-browser wait visible @e5     # 等待元素可见
agent-browser screenshot result.png
```

## 回退方案：Playwright

当 Agent Browser 不可用时，直接使用 Playwright。

```bash
npx playwright test                        # 运行所有 E2E 测试
npx playwright test tests/auth.spec.ts     # 运行指定文件
npx playwright test --headed               # 显示浏览器界面
npx playwright test --debug                # 使用检查器调试
npx playwright test --trace on             # 启用追踪运行
npx playwright show-report                 # 查看 HTML 报告
```

---

## 工作流程

### 1. 规划

- 识别关键用户旅程（认证、核心功能、支付、CRUD）
- 定义场景：正常路径、边界情况、错误情况
- 按风险排序优先级：高（金融、认证）、中（搜索、导航）、低（UI 美化）

### 2. 创建

- 使用页面对象模型（Page Object Model, POM）模式
- 优先使用 `data-testid` 定位器，而非 CSS/XPath
- 在关键步骤添加断言
- 在关键节点捕获截图
- 使用正确的等待方式（永远不要使用 `waitForTimeout`）

### 3. 执行

- 本地运行 3-5 次检查是否有不稳定性
- 使用 `test.fixme()` 或 `test.skip()` 隔离不稳定测试
- 将工件上传到 CI

---

## 测试文件组织结构

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── features/
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   └── create.spec.ts
│   └── api/
│       └── endpoints.spec.ts
├── fixtures/
│   ├── auth.ts
│   └── data.ts
└── playwright.config.ts
```

---

## 页面对象模型（POM）

```typescript
import { Page, Locator } from '@playwright/test'

export class ItemsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly itemCards: Locator
  readonly createButton: Locator

  constructor(page: Page) {
    this.page = page
    // 使用 data-testid 作为定位器
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.itemCards = page.locator('[data-testid="item-card"]')
    this.createButton = page.locator('[data-testid="create-btn"]')
  }

  async goto() {
    await this.page.goto('/items')
    await this.page.waitForLoadState('networkidle')
  }

  async search(query: string) {
    await this.searchInput.fill(query)
    // 等待 API 响应，而非固定时间
    await this.page.waitForResponse(resp => resp.url().includes('/api/search'))
    await this.page.waitForLoadState('networkidle')
  }

  async getItemCount() {
    return await this.itemCards.count()
  }
}
```

---

## 测试结构示例

```typescript
import { test, expect } from '@playwright/test'
import { ItemsPage } from '../../pages/ItemsPage'

test.describe('项目搜索', () => {
  let itemsPage: ItemsPage

  test.beforeEach(async ({ page }) => {
    itemsPage = new ItemsPage(page)
    await itemsPage.goto()
  })

  test('应能通过关键词搜索', async ({ page }) => {
    await itemsPage.search('test')

    const count = await itemsPage.getItemCount()
    expect(count).toBeGreaterThan(0)

    await expect(itemsPage.itemCards.first()).toContainText(/test/i)
    await page.screenshot({ path: 'artifacts/search-results.png' })
  })

  test('应能处理无结果情况', async ({ page }) => {
    await itemsPage.search('xyznonexistent123')

    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    expect(await itemsPage.getItemCount()).toBe(0)
  })
})
```

---

## Playwright 配置

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,       // CI 中禁止 .only
  retries: process.env.CI ? 2 : 0,    // CI 中重试 2 次
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'playwright-results.xml' }],
    ['json', { outputFile: 'playwright-results.json' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',          // 首次重试时捕获追踪
    screenshot: 'only-on-failure',     // 仅在失败时截图
    video: 'retain-on-failure',        // 仅保留失败的视频
    actionTimeout: 10000,              // 操作超时 10 秒
    navigationTimeout: 30000,          // 导航超时 30 秒
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
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

## 不稳定测试（Flaky Test）处理

### 隔离处理

```typescript
// 隔离不稳定测试
test('不稳定：复杂搜索', async ({ page }) => {
  test.fixme(true, '不稳定 - Issue #123')
  // 测试代码...
})

// 条件跳过
test('条件跳过', async ({ page }) => {
  test.skip(process.env.CI, '在 CI 中不稳定 - Issue #123')
  // 测试代码...
})
```

### 识别不稳定性

```bash
# 重复运行 10 次检测不稳定性
npx playwright test tests/search.spec.ts --repeat-each=10
# 启用重试
npx playwright test tests/search.spec.ts --retries=3
```

### 常见原因与修复

**竞态条件（Race Conditions）：**
```typescript
// 错误：假设元素已就绪
await page.click('[data-testid="button"]')

// 正确：使用自动等待定位器
await page.locator('[data-testid="button"]').click()
```

**网络时序（Network Timing）：**
```typescript
// 错误：使用固定超时
await page.waitForTimeout(5000)

// 正确：等待特定条件
await page.waitForResponse(resp => resp.url().includes('/api/data'))
```

**动画时序（Animation Timing）：**
```typescript
// 错误：在动画期间点击
await page.click('[data-testid="menu-item"]')

// 正确：等待稳定后再操作
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.locator('[data-testid="menu-item"]').click()
```

---

## 工件管理

### 截图

```typescript
// 普通截图
await page.screenshot({ path: 'artifacts/after-login.png' })
// 全页面截图
await page.screenshot({ path: 'artifacts/full-page.png', fullPage: true })
// 特定元素截图
await page.locator('[data-testid="chart"]').screenshot({ path: 'artifacts/chart.png' })
```

### 追踪文件（Traces）

```typescript
await browser.startTracing(page, {
  path: 'artifacts/trace.json',
  screenshots: true,
  snapshots: true,
})
// ... 测试操作 ...
await browser.stopTracing()
```

### 视频

```typescript
// 在 playwright.config.ts 中配置
use: {
  video: 'retain-on-failure',       // 仅保留失败视频
  videosPath: 'artifacts/videos/'   // 视频保存路径
}
```

---

## CI/CD 集成

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env:
          BASE_URL: ${{ vars.STAGING_URL }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 钱包 / Web3 测试

```typescript
test('钱包连接', async ({ page, context }) => {
  // 模拟钱包提供者
  await context.addInitScript(() => {
    window.ethereum = {
      isMetaMask: true,
      request: async ({ method }) => {
        if (method === 'eth_requestAccounts')
          return ['0x1234567890123456789012345678901234567890']
        if (method === 'eth_chainId') return '0x1'
      }
    }
  })

  await page.goto('/')
  await page.locator('[data-testid="connect-wallet"]').click()
  await expect(page.locator('[data-testid="wallet-address"]')).toContainText('0x1234')
})
```

---

## 金融 / 关键流程测试

```typescript
test('交易执行', async ({ page }) => {
  // 在生产环境跳过 — 涉及真实资金
  test.skip(process.env.NODE_ENV === 'production', '生产环境跳过')

  await page.goto('/markets/test-market')
  await page.locator('[data-testid="position-yes"]').click()
  await page.locator('[data-testid="trade-amount"]').fill('1.0')

  // 验证预览
  const preview = page.locator('[data-testid="trade-preview"]')
  await expect(preview).toContainText('1.0')

  // 确认并等待区块链响应
  await page.locator('[data-testid="confirm-trade"]').click()
  await page.waitForResponse(
    resp => resp.url().includes('/api/trade') && resp.status() === 200,
    { timeout: 30000 }
  )

  await expect(page.locator('[data-testid="trade-success"]')).toBeVisible()
})
```

---

## 核心原则

| 原则 | 说明 |
|------|------|
| 使用语义定位器 | `[data-testid="..."]` 优于 CSS 选择器优于 XPath |
| 等待条件而非时间 | `waitForResponse()` 优于 `waitForTimeout()` |
| 内置自动等待 | `page.locator().click()` 会自动等待；原始 `page.click()` 不会 |
| 隔离测试 | 每个测试应独立；不共享状态 |
| 快速失败 | 在每个关键步骤使用 `expect()` 断言 |
| 重试时追踪 | 配置 `trace: 'on-first-retry'` 用于调试失败 |

---

## 成功指标

- 所有关键旅程通过（100%）
- 总体通过率 > 95%
- 不稳定率 < 5%
- 测试持续时间 < 10 分钟
- 工件已上传且可访问

---

## 最佳实践

**应该做的：**
- 使用页面对象模型（POM）提高可维护性
- 使用 `data-testid` 属性作为选择器
- 等待 API 响应而非固定超时
- 端到端测试关键用户旅程
- 合并到主分支前运行测试
- 测试失败时检查工件

**不应该做的：**
- 使用脆弱的选择器（CSS 类名可能变化）
- 测试实现细节
- 对生产环境运行测试
- 忽略不稳定测试
- 失败时跳过工件审查
- 用 E2E 测试覆盖所有边界情况（应使用单元测试）

---

## 测试报告模板

```markdown
# E2E 测试报告

**日期：** YYYY-MM-DD HH:MM
**持续时间：** Xm Ys
**状态：** 通过 / 失败

## 摘要
- 总计: X | 通过: Y (Z%) | 失败: A | 不稳定: B | 跳过: C

## 失败的测试

### 测试名称
**文件：** `tests/e2e/feature.spec.ts:45`
**错误：** Expected element to be visible
**截图：** artifacts/failed.png
**建议修复：** [描述]

## 工件
- HTML 报告: playwright-report/index.html
- 截图: artifacts/*.png
- 视频: artifacts/videos/*.webm
- 追踪文件: artifacts/*.zip
```

---

## 快速命令参考

```bash
# 运行所有 E2E 测试
npx playwright test

# 运行指定测试文件
npx playwright test tests/e2e/markets/search.spec.ts

# 在有界面模式下运行（显示浏览器）
npx playwright test --headed

# 调试测试
npx playwright test --debug

# 生成测试代码
npx playwright codegen http://localhost:3000

# 查看报告
npx playwright show-report

# 查看特定追踪文件
npx playwright show-trace artifacts/trace-abc123.zip
```

> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# 测试驱动开发（TDD）

## 概述

测试驱动开发（TDD）是一种严格的开发方法论，要求在编写实现代码之前先编写测试。其核心循环为"红-绿-重构"（Red-Green-Refactor）：先写一个会失败的测试（红），再写最少的代码让测试通过（绿），最后在保持测试通过的前提下优化代码（重构）。目标是实现 80% 以上的测试覆盖率。

---

## 一、核心角色

TDD 指导代理（Agent）是测试驱动开发的专家，负责确保所有代码都遵循"先写测试"的方法论进行开发。

### 核心职责

- 强制执行"先测试后编码"的方法论
- 指导完成红-绿-重构循环
- 确保 80% 以上的测试覆盖率
- 编写全面的测试套件（单元测试、集成测试、端到端测试）
- 在实现之前捕获边界情况

---

## 二、TDD 工作流程

### 第 1 步：编写用户旅程

```
作为一个 [角色]，我想要 [操作]，以便 [获益]

示例：
作为一个用户，我想要语义搜索市场信息，
以便即使没有精确关键词也能找到相关市场。
```

### 第 2 步：先写测试（红色阶段）

编写一个描述预期行为的失败测试。

```typescript
describe('语义搜索', () => {
  it('应该为查询返回相关市场', async () => {
    // 测试实现
  })

  it('应该优雅地处理空查询', async () => {
    // 测试边界情况
  })

  it('当 Redis 不可用时应该回退到子字符串搜索', async () => {
    // 测试回退行为
  })

  it('应该按相似度分数排序结果', async () => {
    // 测试排序逻辑
  })
})
```

### 第 3 步：运行测试 -- 验证失败

```bash
npm test
# 测试应该失败 -- 因为我们还没有实现功能
```

### 第 4 步：编写最少实现代码（绿色阶段）

只编写足够让测试通过的代码。

### 第 5 步：运行测试 -- 验证通过

```bash
npm test
# 测试现在应该全部通过
```

### 第 6 步：重构（改进阶段）

在保持测试通过的前提下改进代码质量：
- 消除重复
- 改善命名
- 优化性能
- 提高可读性

### 第 7 步：验证覆盖率

```bash
npm run test:coverage
# 验证达到 80% 以上的覆盖率
```

### 循环总结

```
红色 -> 绿色 -> 重构 -> 重复

红色：    编写一个失败的测试
绿色：    编写最少的代码让测试通过
重构：    改进代码，保持测试通过
重复：    下一个功能/场景
```

---

## 三、测试类型

### 3.1 单元测试

测试单个函数和工具类，在隔离环境中进行。

**何时使用：** 始终需要

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button 组件', () => {
  it('使用正确的文本进行渲染', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByText('点击我')).toBeInTheDocument()
  })

  it('点击时调用 onClick 回调', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>点击</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('当 disabled 属性为 true 时被禁用', () => {
    render(<Button disabled>点击</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### 3.2 集成测试

测试 API 端点、数据库操作和服务交互。

**何时使用：** 始终需要

```typescript
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('GET /api/markets', () => {
  it('成功返回市场数据', async () => {
    const request = new NextRequest('http://localhost/api/markets')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('验证查询参数', async () => {
    const request = new NextRequest('http://localhost/api/markets?limit=invalid')
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it('优雅地处理数据库错误', async () => {
    // 模拟数据库故障
    const request = new NextRequest('http://localhost/api/markets')
    // 测试错误处理
  })
})
```

### 3.3 端到端测试（E2E）

使用 Playwright 测试关键用户流程。

**何时使用：** 关键路径

```typescript
import { test, expect } from '@playwright/test'

test('用户可以搜索和筛选市场', async ({ page }) => {
  // 导航到市场页面
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // 验证页面已加载
  await expect(page.locator('h1')).toContainText('Markets')

  // 搜索市场
  await page.fill('input[placeholder="Search markets"]', 'election')

  // 等待防抖和结果
  await page.waitForTimeout(600)

  // 验证显示搜索结果
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // 验证结果包含搜索词
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // 按状态筛选
  await page.click('button:has-text("Active")')

  // 验证筛选结果
  await expect(results).toHaveCount(3)
})
```

---

## 四、必须测试的边界情况

1. **Null/Undefined** 输入
2. **空值** 数组/字符串
3. **无效类型** 传递
4. **边界值**（最小值/最大值）
5. **错误路径**（网络故障、数据库错误）
6. **竞态条件**（并发操作）
7. **大数据量**（10k+ 项的性能测试）
8. **特殊字符**（Unicode、表情符号、SQL 字符）

---

## 五、外部服务 Mock（模拟）

### Supabase Mock

```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: [{ id: 1, name: 'Test Market' }],
          error: null
        }))
      }))
    }))
  }
}))
```

### Redis Mock

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

### OpenAI Mock

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // 模拟 1536 维嵌入向量
  ))
}))
```

---

## 六、测试反模式

### 错误示范：测试实现细节

```typescript
// 不要测试内部状态
expect(component.state.count).toBe(5)
```

### 正确示范：测试用户可见行为

```typescript
// 测试用户看到的内容
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

### 错误示范：脆弱的选择器

```typescript
// 容易崩溃
await page.click('.css-class-xyz')
```

### 正确示范：语义化选择器

```typescript
// 对变更具有弹性
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

### 错误示范：无测试隔离

```typescript
// 测试之间相互依赖
test('创建用户', () => { /* ... */ })
test('更新同一用户', () => { /* 依赖前一个测试 */ })
```

### 正确示范：独立测试

```typescript
// 每个测试独立设置数据
test('创建用户', () => {
  const user = createTestUser()
  // 测试逻辑
})

test('更新用户', () => {
  const user = createTestUser()
  // 更新逻辑
})
```

---

## 七、覆盖率要求

### 基本要求

| 指标 | 最低要求 |
|------|----------|
| 语句覆盖率（Statements） | 80% |
| 分支覆盖率（Branches） | 80% |
| 函数覆盖率（Functions） | 80% |
| 行覆盖率（Lines） | 80% |

### 关键代码要求 100%

- 金融计算逻辑
- 认证逻辑
- 安全关键代码
- 核心业务逻辑

### 覆盖率配置

```json
{
  "jest": {
    "coverageThresholds": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

---

## 八、最佳实践

### 应该做的

1. **先写测试** -- 始终遵循 TDD
2. **每个测试一个断言** -- 聚焦单一行为
3. **描述性测试名称** -- 说明测试内容
4. **准备-执行-断言**（Arrange-Act-Assert）-- 清晰的测试结构
5. **Mock 外部依赖** -- 隔离单元测试
6. **测试边界情况** -- Null、undefined、空值、大数据
7. **测试错误路径** -- 不只是正常路径
8. **保持测试快速** -- 单元测试每个 < 50ms
9. **测试后清理** -- 无副作用
10. **审查覆盖率报告** -- 识别空白区域

### 不应该做的

- 在测试之前编写实现代码
- 每次变更后跳过运行测试
- 一次性编写过多代码
- 忽略失败的测试
- 测试实现细节（应该测试行为）
- Mock 所有东西（优先使用集成测试）

---

## 九、持续测试

### 开发时监听模式

```bash
npm test -- --watch
# 文件变更时自动运行测试
```

### 提交前钩子（Pre-Commit Hook）

```bash
# 每次提交前运行
npm test && npm run lint
```

### CI/CD 集成

```yaml
# GitHub Actions
- name: 运行测试
  run: npm test -- --coverage
- name: 上传覆盖率
  uses: codecov/codecov-action@v3
```

---

## 十、与其他命令集成

| 命令 | 用途 |
|------|------|
| `/plan` | 先理解需要构建什么 |
| `/tdd` | 用测试驱动进行实现 |
| `/build-fix` | 修复构建错误 |
| `/code-review` | 审查实现代码 |
| `/test-coverage` | 验证覆盖率 |

---

## 附录：完整 TDD 会话示例

```
用户: /tdd 我需要一个计算市场流动性评分的函数

代理 (tdd-guide):
# TDD 会话：市场流动性评分计算器

## 第 1 步：定义接口（脚手架）

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number      // 总交易量
  bidAskSpread: number     // 买卖价差
  activeTraders: number    // 活跃交易者数量
  lastTradeTime: Date      // 最后交易时间
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: 待实现
  throw new Error('Not implemented')
}
```

## 第 2 步：编写失败测试（红色阶段）

```typescript
// lib/liquidity.test.ts
describe('calculateLiquidityScore', () => {
  it('流动性好的市场应返回高分', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }
    const score = calculateLiquidityScore(market)
    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('流动性差的市场应返回低分', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // 1 天前
    }
    const score = calculateLiquidityScore(market)
    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('处理边界情况：零交易量', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }
    const score = calculateLiquidityScore(market)
    expect(score).toBe(0)
  })
})
```

## 第 3 步至第 8 步：实现 -> 验证通过 -> 重构 -> 验证覆盖率

（完整流程参见红-绿-重构循环）
```

---

## 成功指标

- 代码覆盖率 80% 以上
- 所有测试通过（绿色）
- 没有跳过或禁用的测试
- 快速测试执行（单元测试 < 30 秒）
- 端到端测试覆盖关键用户流程
- 测试能在生产之前捕获缺陷

> **切记**：测试不是可选的。它们是安全网，能够支持自信的重构、快速的开发和生产环境的可靠性。

> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：开发方法论

# Web 测试（Web Testing）

全面的 Web 测试技能：单元测试、集成测试、端到端测试（E2E）、负载测试、安全测试、视觉回归测试、无障碍测试。

## 快速开始

```bash
npx vitest run                    # 单元测试
npx playwright test               # 端到端测试（E2E）
npx playwright test --ui          # 带 UI 的端到端测试
k6 run load-test.js               # 负载测试
npx @axe-core/cli https://example.com  # 无障碍测试
npx lighthouse https://example.com     # 性能测试
```

## 测试金字塔（70-20-10）

| 层级 | 比例 | 框架 | 速度 |
|------|------|------|------|
| 单元测试（Unit） | 70% | Vitest/Jest | <50ms |
| 集成测试（Integration） | 20% | Vitest + fixtures | 100-500ms |
| 端到端测试（E2E） | 10% | Playwright | 5-30s |

## 何时使用

- **单元测试**：函数、工具方法、状态逻辑
- **集成测试**：API 端点、数据库操作、模块间交互
- **端到端测试**：关键流程（登录、下单、支付）
- **负载测试**：发布前的性能验证
- **安全测试**：部署前的漏洞扫描
- **视觉回归测试**：UI 回归检测

## 参考文档

### 核心测试
- 单元/集成测试模式（Unit/Integration Testing）
- Playwright 端到端工作流（E2E Testing with Playwright）
- React/Vue/Angular 组件测试（Component Testing）
- 测试金字塔策略（Testing Pyramid Strategy）- 测试比例、优先级矩阵

### 跨浏览器与移动端
- 跨浏览器检查清单（Cross-Browser Checklist）- 浏览器/设备矩阵
- 移动端手势测试（Mobile Gesture Testing）- 触摸、滑动、方向
- Shadow DOM 测试 - Web Components 测试

### 交互与表单
- 交互测试模式（Interactive Testing Patterns）- 表单、键盘、拖放
- 功能测试检查清单（Functional Testing Checklist）- 功能测试

### 性能与质量
- 核心 Web 指标（Core Web Vitals）- LCP/CLS/INP、Lighthouse CI
- 视觉回归（Visual Regression）- 截图对比
- 测试不稳定性缓解（Test Flakiness Mitigation）- 稳定性策略

### 无障碍
- 无障碍测试（Accessibility Testing）- WCAG 检查清单、axe-core

### 安全
- 安全测试概述（Security Testing Overview）- OWASP Top 10、工具
- 安全检查清单（Security Checklists）- 认证、API、请求头
- 漏洞载荷（Vulnerability Payloads）- SQL 注入/XSS/CSRF 载荷

### API 与负载
- API 测试模式（API Testing）
- k6 负载测试模式（Load Testing with k6）

### 检查清单
- 发布前检查清单（Pre-Release Checklist）- 完整的发布核对清单

## CI/CD 集成

```yaml
jobs:
  test:
    steps:
      - run: npm run test:unit      # 关卡1：快速失败
      - run: npm run test:e2e       # 关卡2：单元测试通过后
      - run: npm run test:a11y      # 无障碍测试
      - run: npx lhci autorun       # 性能测试
```

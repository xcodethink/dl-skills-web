> 来源：[anthropics/skills](https://github.com/anthropics/skills) | 分类：测试 | ⭐ Anthropic 官方

---
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. Use when verifying frontend features, capturing screenshots, or checking browser logs.
---

# Web 应用测试（Webapp Testing）

## 概述

Anthropic 官方的 Web 应用测试工具包。使用 Playwright 对本地 Web 应用进行交互式测试，支持截图捕获、浏览器日志查看和自动化验证。

## 核心工具

### with_server.py 辅助脚本

管理服务器生命周期，自动启动/停止：

```python
# 单服务器
python scripts/with_server.py \
  --command "npm run dev" \
  --url "http://localhost:3000" \
  --script scripts/test_app.py

# 多服务器（前端 + 后端）
python scripts/with_server.py \
  --command "npm run dev" \
  --url "http://localhost:3000" \
  --command "python api/server.py" \
  --url "http://localhost:8000" \
  --script scripts/test_full_stack.py
```

## 测试决策树

```
你的页面是静态 HTML 还是动态 Web 应用？
├─ 静态 HTML → 直接用 Playwright 打开文件
│   └─ 使用 file:// 协议加载
└─ 动态 Web 应用 → 需要启动服务器
    ├─ 服务器已在运行？
    │   └─ 直接连接并测试
    └─ 服务器未运行？
        └─ 使用 with_server.py 自动管理
```

## 侦察-行动模式（Reconnaissance-Then-Action）

**先侦察，再操作。** 不要假设页面结构：

### 第一步：发现选择器

```python
# 先获取页面结构
page.goto("http://localhost:3000")
elements = page.query_selector_all("button, input, a, [data-testid]")
for el in elements:
    print(f"Tag: {el.evaluate('e => e.tagName')}, "
          f"Text: {el.text_content()}, "
          f"TestId: {el.get_attribute('data-testid')}")
```

### 第二步：基于发现执行操作

```python
# 基于实际发现的选择器操作
page.click('[data-testid="submit-button"]')
page.screenshot(path="after_submit.png")
```

## 常见陷阱

| 陷阱 | 正确做法 |
|------|----------|
| 硬编码选择器 | 先侦察页面元素，用实际发现的选择器 |
| 忽略加载时间 | 使用 `wait_for_selector` 或 `wait_for_load_state` |
| 不捕获截图 | 关键操作前后都截图，方便调试 |
| 忽略控制台日志 | 监听 `console` 事件捕获前端错误 |
| 假设端口可用 | 检查端口占用或使用随机端口 |

## 最佳实践

1. **每次交互后截图**：截图是最直观的调试工具
2. **监听浏览器控制台**：前端错误往往在控制台先暴露
3. **使用 data-testid**：比 CSS 选择器更稳定
4. **先无头模式测试，失败后切有头模式调试**
5. **超时设置要合理**：慢操作用长超时，快操作用短超时

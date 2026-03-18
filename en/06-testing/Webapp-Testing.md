> Source: [anthropics/skills](https://github.com/anthropics/skills) | Category: Testing | ⭐ Anthropic Official

---
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. Use when verifying frontend features, capturing screenshots, or checking browser logs.
---

# Webapp Testing

## Overview

Anthropic's official web application testing toolkit. Interactive testing of local web apps using Playwright with screenshot capture, browser log inspection, and automated verification.

## Core Tool

### with_server.py Helper Script

Manages server lifecycle with automatic start/stop:

```python
# Single server
python scripts/with_server.py \
  --command "npm run dev" \
  --url "http://localhost:3000" \
  --script scripts/test_app.py

# Multiple servers (frontend + backend)
python scripts/with_server.py \
  --command "npm run dev" \
  --url "http://localhost:3000" \
  --command "python api/server.py" \
  --url "http://localhost:8000" \
  --script scripts/test_full_stack.py
```

## Decision Tree

```
Is your page static HTML or a dynamic web app?
├─ Static HTML → Open file directly with Playwright
│   └─ Use file:// protocol
└─ Dynamic web app → Need a running server
    ├─ Server already running?
    │   └─ Connect and test directly
    └─ Server not running?
        └─ Use with_server.py to manage automatically
```

## Reconnaissance-Then-Action Pattern

**Scout first, act second.** Never assume page structure:

### Step 1: Discover Selectors

```python
# Get page structure first
page.goto("http://localhost:3000")
elements = page.query_selector_all("button, input, a, [data-testid]")
for el in elements:
    print(f"Tag: {el.evaluate('e => e.tagName')}, "
          f"Text: {el.text_content()}, "
          f"TestId: {el.get_attribute('data-testid')}")
```

### Step 2: Act Based on Discovery

```python
# Use actually discovered selectors
page.click('[data-testid="submit-button"]')
page.screenshot(path="after_submit.png")
```

## Common Pitfalls

| Pitfall | Correct Approach |
|---------|-----------------|
| Hardcoded selectors | Scout page elements first, use discovered selectors |
| Ignoring load time | Use `wait_for_selector` or `wait_for_load_state` |
| No screenshots | Screenshot before and after key actions for debugging |
| Ignoring console logs | Listen to `console` events to catch frontend errors |
| Assuming port availability | Check port usage or use random ports |

## Best Practices

1. **Screenshot after every interaction**: Screenshots are the most intuitive debugging tool
2. **Listen to browser console**: Frontend errors surface in console first
3. **Use data-testid**: More stable than CSS selectors
4. **Test headless first, switch to headed mode for debugging on failure**
5. **Set reasonable timeouts**: Long for slow ops, short for fast ops

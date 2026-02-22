> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Development Tools

---
name: webapp-testing
description: Triggers when testing or interacting with local web applications using Playwright -- supports verifying frontend functionality, debugging UI behavior, capturing screenshots, and viewing browser logs.
---

# Web Application Testing

## Overview

This skill provides a toolkit for testing local web applications by writing native Python Playwright scripts. It includes a helper script that manages server lifecycles (including multi-server setups) and follows a reconnaissance-then-action pattern for reliably interacting with dynamic web content.

**Helper Scripts Available**:
- `scripts/with_server.py` -- Manages server lifecycle (supports multiple servers)

Always run scripts with `--help` first to see usage. Treat them as black-box utilities rather than reading their source.

## Decision Tree

```
User task --> Is it static HTML?
    |-- Yes --> Read HTML file directly to identify selectors
    |           |-- Success --> Write Playwright script using selectors
    |           |-- Fails/Incomplete --> Treat as dynamic (below)
    |
    |-- No (dynamic webapp) --> Is the server already running?
        |-- No --> Run: python scripts/with_server.py --help
        |          Then use the helper + write simplified Playwright script
        |
        |-- Yes --> Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Take screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
```

## Using `with_server.py`

**Single server:**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**Multiple servers (e.g., backend + frontend):**
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

## Writing the Automation Script

The server is managed by `with_server.py`, so the automation script only contains Playwright logic:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)  # Always headless
    page = browser.new_page()
    page.goto('http://localhost:5173')           # Server already running
    page.wait_for_load_state('networkidle')      # CRITICAL: wait for JS
    # ... automation logic here
    browser.close()
```

## Reconnaissance-Then-Action Pattern

1. **Inspect the rendered DOM**:
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   ```

2. **Identify selectors** from the inspection results

3. **Execute actions** using the discovered selectors

## Common Pitfall

- **Wrong**: Inspecting the DOM before waiting for `networkidle` on dynamic apps
- **Right**: Always call `page.wait_for_load_state('networkidle')` before inspection

## Best Practices

- Use bundled scripts as black boxes -- invoke with `--help` then call directly
- Use `sync_playwright()` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: `text=`, `role=`, CSS selectors, or IDs
- Add appropriate waits: `page.wait_for_selector()` or `page.wait_for_timeout()`

## Example Files

| Example | Purpose |
|---|---|
| `examples/element_discovery.py` | Discovering buttons, links, and inputs on a page |
| `examples/static_html_automation.py` | Using `file://` URLs for local HTML |
| `examples/console_logging.py` | Capturing console logs during automation |

> Source: DL Skills Curated | Category: Debugging

---
name: frontend-debugging
description: Browser-specific debugging techniques covering DevTools, React, network, CSS, and production debugging
---

# Frontend Debugging

## Overview

Comprehensive browser debugging techniques spanning Chrome DevTools mastery, React-specific tools, network request troubleshooting, CSS layout investigation, and production error tracking strategies.

## Chrome DevTools Core Panels

| Panel | Purpose | Key Actions |
|-------|---------|-------------|
| Elements | DOM structure and style inspection | Live-edit HTML/CSS, view computed styles |
| Console | Log output and expression evaluation | `console.table()`, `$0` to reference selected element |
| Network | HTTP request monitoring | Filter by type, inspect waterfall timing |
| Application | Storage and cache management | View cookies, LocalStorage, Service Workers |

**Power tips:**
- `Ctrl+Shift+P` (Command Menu) for quick actions: screenshot, theme toggle
- Check "Preserve log" in Network to retain logs across navigation
- Use `copy()` in Console to copy objects to clipboard

## React DevTools

- **Component Tree**: Inspect hierarchy, props, and state values
- **State Inspection**: Modify state directly in DevTools to observe effects
- **Profiler**: Record renders to identify unnecessary re-renders
- **Highlight Updates**: Visualize which components are re-rendering

## Network Debugging

| Issue | Approach |
|-------|----------|
| Failed requests (4xx/5xx) | Check status code and response body in Network panel |
| CORS errors | Verify server `Access-Control-Allow-Origin` header |
| Caching issues | Check `Cache-Control` header; try "Disable cache" |
| Request not sent | Check interceptors, conditional logic, URL typos |

## CSS Debugging

- **Layout shifts**: Use DevTools "Layout Shift Regions" to visualize shift areas
- **Specificity conflicts**: View the winning rule and its source in the Computed panel
- **Responsive issues**: Use Device Toolbar to switch viewports; debug media queries at breakpoints
- **Flexbox/Grid**: Click the flex/grid badge in Elements panel to toggle visual overlay

## JavaScript Error Patterns

| Error Type | Common Cause | Fix |
|------------|-------------|-----|
| Uncaught TypeError | Accessing property of `undefined` | Add null checks, use optional chaining (`?.`) |
| Unhandled Promise Rejection | Missing `catch` on async calls | Add `.catch()` or `try/catch` |
| ReferenceError | Undeclared variable or scope issue | Check declaration scope and closures |
| RangeError | Unbounded recursion or array overflow | Verify recursion base case |

## Common Error Quick Reference

| Error Message | Diagnosis | Fix |
|---------------|-----------|-----|
| `Cannot read property 'x' of undefined` | Data accessed before loaded | Add loading state guard |
| `Failed to fetch` | Network down or CORS blocked | Check connectivity and CORS config |
| `Maximum call stack exceeded` | Infinite recursion or circular ref | Check recursion condition, component cycles |
| `ResizeObserver loop limit exceeded` | Layout mutation inside observer | Defer with `requestAnimationFrame` |

## Production Debugging

1. **Source Maps**: Generate at build time; upload to error tracking service (do not deploy to prod server)
2. **Error Boundaries**: Use React `componentDidCatch` to catch render errors and show fallback UI
3. **Error Tracking**: Integrate Sentry or similar -- captures stack traces, user context, breadcrumbs
4. **Feature Flags**: Gate new features behind flags for gradual rollout; quick kill switch if issues arise

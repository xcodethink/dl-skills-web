> Source: DL Skills Curated | Category: Debugging

---
name: performance-debugging
description: Systematic methodology for diagnosing and resolving performance bottlenecks across the full stack
---

# Performance Debugging

## Overview

A structured approach to identifying and resolving performance bottlenecks across frontend, backend, and database layers. Core principle: measure first, optimize second. Fix root causes, not symptoms.

## When to Trigger

- Page load exceeds 3 seconds
- CPU usage consistently above 80%
- Memory growing steadily (suspected leak)
- Database queries responding in >500ms
- Users reporting lag or timeouts

## 4-Step Workflow

1. **Measure** -- Confirm the problem with objective data; establish baseline metrics
2. **Profile** -- Use specialized tools to locate hot code paths
3. **Hypothesize** -- Form a bottleneck hypothesis based on profiling data
4. **Fix** -- Address the root cause; verify metrics improve after the change

## Frontend Profiling

| Tool | Purpose | Key Metric |
|------|---------|------------|
| Chrome DevTools Performance | Runtime analysis, flame charts | Main thread blocking time |
| Lighthouse | Comprehensive audit & suggestions | Performance Score |
| Web Vitals | Core user experience metrics | LCP, FID, CLS |

**Core Web Vitals thresholds:**
- LCP (Largest Contentful Paint): < 2.5s is good
- FID (First Input Delay): < 100ms is good
- CLS (Cumulative Layout Shift): < 0.1 is good

## Backend Profiling

| Language/Runtime | Tool | Example |
|-----------------|------|---------|
| Python | cProfile / py-spy | `py-spy top --pid <PID>` |
| Node.js | Built-in profiler | `node --prof app.js` |
| Go | pprof | `go tool pprof http://localhost:6060/debug/pprof/profile` |

## Database Profiling

- **EXPLAIN ANALYZE**: Inspect query execution plans; identify full table scans
- **Slow query log**: Set threshold (e.g., 200ms) to capture slow queries
- **N+1 detection**: Common ORM issue of issuing per-row queries; fix with eager loading

## Memory Leak Investigation

1. Compare heap snapshots taken at different time intervals
2. Review GC logs for collection frequency and reclaimed amounts
3. Check for closures holding external references, uncleared timers, and lingering event listeners

## Common Pitfalls

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Slow initial load | Bundle too large | Code splitting, lazy loading |
| Slow API response | Missing index or N+1 queries | Add database indexes, optimize queries |
| UI jank | Long main-thread tasks | Web Workers, task chunking |
| Steady memory growth | Uncleared event listeners | Remove listeners on unmount |
| High CPU | Infinite loop or inefficient algorithm | Optimize algorithm, memoize results |

## MUST NOT

- Optimize without measuring -- gut-feel optimization wastes effort
- Fix symptoms instead of root causes -- surface fixes recur
- Change multiple things at once -- isolate each change to verify its effect

# Go Patterns

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> Files: skills/golang-patterns/SKILL.md + rules/golang/ + agents/go-reviewer.md + agents/go-build-resolver.md + commands/go-review.md + commands/go-build.md + commands/go-test.md

---

## Core Principles

1. **Simplicity and Clarity** — Go favors simplicity over cleverness
2. **Make the Zero Value Useful** — types should work without initialization
3. **Accept Interfaces, Return Structs** — accept interface params, return concrete types

---

## Style & Tooling

- **gofmt/goimports** mandatory — no style debates
- Interfaces: 1-3 methods, defined where used (not where implemented)
- Always wrap errors with context: `fmt.Errorf("context: %w", err)`

---

## Error Handling

- Wrap errors with `fmt.Errorf("action: %w", err)`
- Define custom error types and sentinel errors
- Use `errors.Is` and `errors.As` for checking
- Never ignore errors with `_`

## Concurrency

- **Worker Pool**: goroutines consuming from a jobs channel
- **Context**: Always use `context.Context` for cancellation and timeouts
- **errgroup**: Coordinate multiple goroutines with error propagation
- **Graceful Shutdown**: Signal handling with timeout context
- Avoid goroutine leaks: use buffered channels and select on `ctx.Done()`

## Interface Design

- Small, focused interfaces (single-method preferred)
- Compose interfaces as needed
- Define interfaces in the consumer package
- Optional behavior via type assertions

## Functional Options Pattern

```go
type Option func(*Server)

func WithTimeout(d time.Duration) Option {
    return func(s *Server) { s.timeout = d }
}

func NewServer(addr string, opts ...Option) *Server {
    s := &Server{addr: addr, timeout: 30 * time.Second}
    for _, opt := range opts { opt(s) }
    return s
}
```

## Package Organization

```
cmd/myapp/main.go    internal/handler/   internal/service/
internal/repository/ pkg/client/         api/v1/
```

- Short, lowercase package names, no underscores
- Avoid package-level mutable state — use dependency injection

## Performance

- Preallocate slices: `make([]T, 0, cap)`
- `sync.Pool` for frequent allocations
- `strings.Builder` or `strings.Join` instead of concatenation in loops

---

## Code Review Priorities

| Severity | Issues |
|----------|--------|
| **CRITICAL** | SQL/command injection, race conditions, ignored errors, panic for recoverable errors |
| **HIGH** | Goroutine leaks, deadlocks, large functions, non-idiomatic code |
| **MEDIUM** | String concatenation in loops, missing pre-allocation, context not first param |

## Build Error Resolution

Common fixes: add imports, type conversions, implement missing methods, resolve import cycles. Workflow: build -> parse error -> read file -> minimal fix -> verify -> test.

## TDD with Table-Driven Tests

```go
tests := []struct {
    name string; input string; wantErr bool
}{
    {"valid", "test@example.com", false},
    {"empty", "", true},
}
for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) { ... })
}
```

Coverage targets: 100% for critical business logic, 90%+ for public APIs, 80%+ for general code.

---

## Go Idioms

| Idiom | Description |
|-------|-------------|
| Accept interfaces, return structs | Flexible inputs, concrete outputs |
| Errors are values | Handle them explicitly |
| Don't communicate by sharing memory | Use channels |
| Make the zero value useful | No initialization needed |
| Clear is better than clever | Readability first |
| Return early | Handle errors first, keep happy path unindented |

---

**Remember**: Go code should be boring in the best way — predictable, consistent, and easy to understand.

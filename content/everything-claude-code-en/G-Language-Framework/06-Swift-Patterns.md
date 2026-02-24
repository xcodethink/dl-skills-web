# Swift Patterns

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> Files: skills/swift-actor-persistence/SKILL.md + skills/swift-protocol-di-testing/SKILL.md

---

## Part 1: Actor-Based Thread-Safe Persistence

### Core Pattern

Use Swift actors to guarantee serialized access — no data races, enforced by the compiler.

```swift
public actor LocalRepository<T: Codable & Identifiable> where T.ID == String {
    private var cache: [String: T] = [:]
    private let fileURL: URL

    public func save(_ item: T) throws {
        cache[item.id] = item
        try persistToFile()
    }

    public func find(by id: String) -> T? { cache[id] }
    public func loadAll() -> [T] { Array(cache.values) }
}
```

All calls are automatically async due to actor isolation. Combine with `@Observable` ViewModels for reactive UI.

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| Actor (not class + lock) | Compiler-enforced thread safety |
| In-memory cache + file persistence | Fast reads, durable writes |
| Dictionary keyed by ID | O(1) lookups |
| Generic over `Codable & Identifiable` | Reusable across model types |
| Atomic file writes | Prevents corruption on crash |

### Best Practices

- Use `Sendable` types for data crossing actor boundaries
- Minimal public API — only domain operations
- Load synchronously in `init` for simplicity
- Don't use `nonisolated` to bypass actor isolation

---

## Part 2: Protocol-Based Dependency Injection

### Pattern

1. **Define small, focused protocols** — one per external concern
2. **Create production implementations** — real file system, network, etc.
3. **Create mock implementations** — with configurable error properties
4. **Inject via default parameters** — production uses defaults; tests inject mocks
5. **Write tests with Swift Testing** — `@Test`, `#expect(throws:)`

### Key Principles

- **Single Responsibility**: One protocol per concern
- **Sendable conformance**: Required for actor boundaries
- **Only mock boundaries**: Mock external dependencies, not internal types
- **Error simulation**: Design mocks with configurable error properties

### Anti-Patterns

- God protocols covering all external access
- Mocking internal types with no external dependencies
- `#if DEBUG` instead of proper DI
- Over-engineering: no protocol needed if no external dependencies

---

**Remember**: Swift's actor model and protocol system provide compile-time safety guarantees for concurrency and testability.

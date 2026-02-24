# C++ Coding Standards

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> File: skills/cpp-coding-standards/SKILL.md
> Reference: [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

---

## Cross-Cutting Principles

1. **RAII everywhere** — bind resource lifetime to object lifetime
2. **Immutability by default** — start with `const`/`constexpr`
3. **Type safety** — use the type system to prevent errors at compile time
4. **Express intent** — names, types, and concepts should communicate purpose
5. **Minimize complexity** — simple code is correct code
6. **Value semantics over pointer semantics** — prefer returning by value

---

## Essential Rules

### Functions
- Cheap types by value, expensive by `const&`, sink parameters by value (for move)
- Return structs for multiple outputs, not output parameters
- Use `constexpr` and `noexcept` where applicable
- Prefer pure functions

### Classes
- **Rule of Zero**: Let compiler generate special members when possible
- **Rule of Five**: If managing a resource, define all five (destructor, copy/move constructor, copy/move assignment)
- Single-argument constructors: `explicit`
- Base class destructors: public virtual or protected non-virtual
- Use `override` for virtual function implementations

### Resource Management
- `unique_ptr` for exclusive ownership, `shared_ptr` for shared
- Raw pointer = non-owning observer
- No naked `new`/`delete`, no `malloc`/`free`

### Expressions
- Always initialize objects at declaration
- Prefer `{}` initializer syntax
- Default to `const`/`constexpr`
- Use `nullptr` (not `0`/`NULL`), no C-style casts, no magic numbers

### Error Handling
- Custom exception types (not built-in types)
- Throw by value, catch by reference
- RAII for exception-safe code

### Concurrency
- RAII locks (`scoped_lock`/`lock_guard`), always named
- `scoped_lock` for multiple mutexes (deadlock-free)
- Always wait with a condition on condition variables
- Don't use `volatile` for synchronization

### Templates (C++20)
- Constrain with concepts (`std::integral`, custom concepts)
- Use `using` over `typedef`
- Avoid template metaprogramming where `constexpr` suffices

### Style
- `enum class` over plain `enum`
- `underscore_style` naming, ALL_CAPS for macros only
- `'\n'` instead of `std::endl`
- Include guards, self-contained headers, no `using namespace` in headers

---

## Quick Checklist

No raw `new`/`delete` | Objects initialized | `const`/`constexpr` by default | `enum class` | `nullptr` | No narrowing conversions | `explicit` constructors | Rule of Zero/Five | Concepts on templates | RAII locks | Custom exceptions | No magic numbers

---

**Remember**: Modern C++ emphasizes safety, clarity, and zero-overhead abstractions.

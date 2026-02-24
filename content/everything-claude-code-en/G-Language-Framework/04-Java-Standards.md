# Java Coding Standards

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> File: skills/java-coding-standards/SKILL.md

---

## Core Principles

- Clarity over cleverness
- Immutable by default; minimize shared mutable state
- Fail fast with meaningful exceptions
- Consistent naming and package structure

---

## Key Standards

### Naming

- Classes/Records: `PascalCase` — `MarketService`, `Money`
- Methods/Fields: `camelCase` — `findBySlug`, `marketRepository`
- Constants: `UPPER_SNAKE_CASE` — `MAX_PAGE_SIZE`

### Immutability

Favor records and final fields. Use `MarketDto(Long id, String name)` records. Only getters, no setters.

### Optional Usage

Return `Optional` from find methods. Use `map`/`flatMap`/`orElseThrow` instead of `get()`.

### Streams

Use streams for transformations, keep pipelines short. For complex logic, prefer loops for clarity.

### Exceptions

Unchecked exceptions for domain errors. Create domain-specific exceptions. Avoid broad `catch (Exception ex)`.

### Generics

Avoid raw types. Prefer bounded generics: `<T extends Identifiable>`.

---

## Project Structure

```
src/main/java/com/example/app/
  config/ controller/ service/ repository/ domain/ dto/ util/
src/main/resources/application.yml
src/test/java/... (mirrors main)
```

## Code Smells

- Long parameter lists -> DTO/builders
- Deep nesting -> early returns
- Magic numbers -> named constants
- Static mutable state -> dependency injection
- Silent catch blocks -> log and rethrow

## Testing

JUnit 5 + AssertJ for fluent assertions. Mockito for mocking. Deterministic tests only.

---

**Remember**: Keep code intentional, typed, and observable. Optimize for maintainability.

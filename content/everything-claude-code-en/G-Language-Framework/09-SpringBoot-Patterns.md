# Spring Boot Patterns

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> Files: skills/springboot-patterns/SKILL.md + skills/jpa-patterns/SKILL.md

---

## REST API Architecture

- Controller (thin) -> Service (business logic) -> Repository (data access)
- Constructor injection, validated request DTOs (records), response mapping
- `@ControllerAdvice` for global exception handling

## Key Patterns

### DTOs & Validation

```java
public record CreateMarketRequest(
    @NotBlank @Size(max = 200) String name,
    @NotNull @FutureOrPresent Instant endDate) {}
```

### Service Layer

`@Transactional` on write methods, `@Transactional(readOnly = true)` for reads.

### Exception Handling

`@ControllerAdvice` with handlers for validation errors, access denied, and generic exceptions. Return structured `ApiError` responses.

### Caching

`@Cacheable(value, key)` and `@CacheEvict`. Requires `@EnableCaching`.

### Async

`@Async` with `CompletableFuture`. Requires `@EnableAsync`.

### Rate Limiting

Filter-based with Bucket4j. Use `request.getRemoteAddr()` with proper `ForwardedHeaderFilter` configuration behind proxies.

### Resilience

Exponential backoff retry with configurable max retries.

---

## JPA/Hibernate Patterns

### Entity Design

- `@EntityListeners(AuditingEntityListener.class)` for `@CreatedDate`/`@LastModifiedDate`
- `@Enumerated(EnumType.STRING)` for enum fields
- Indexes on common query fields

### N+1 Prevention

- Default to lazy loading
- `JOIN FETCH` in JPQL when eager loading needed
- DTO projections for read-only paths

### Repository

- Spring Data JPA interfaces with custom JPQL
- Interface-based projections for lightweight queries
- Cursor pagination: `id > :lastId` with ordering

### Transactions

`@Transactional` on service methods. `readOnly = true` for queries. Short transactions.

### Connection Pool (HikariCP)

`maximum-pool-size=20`, `minimum-idle=5`, `connection-timeout=30000`

### Migrations

Flyway or Liquibase. Never Hibernate auto DDL in production.

### Testing

`@DataJpaTest` with Testcontainers. Verify SQL efficiency via Hibernate SQL logging.

---

## Production Defaults

- Constructor injection (no field injection)
- `spring.mvc.problemdetails.enabled=true` (RFC 7807)
- Null-safety via `@NonNull` and `Optional`
- Structured JSON logging via Logback
- Metrics: Micrometer + Prometheus/OTel

---

**Remember**: Keep controllers thin, services focused, repositories simple, errors handled centrally.

> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# JPA/Hibernate Patterns

## Overview

Best practices for data modeling, repository design, and performance tuning with JPA/Hibernate in Spring Boot. Covers entity design, relationship mapping, N+1 prevention, transactions, pagination, indexing, connection pooling, caching, and testing.

---

## Entity Design

```java
@Entity
@Table(name = "markets", indexes = {
  @Index(name = "idx_markets_slug", columnList = "slug", unique = true)
})
@EntityListeners(AuditingEntityListener.class)
public class MarketEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String name;

  @Column(nullable = false, unique = true, length = 120)
  private String slug;

  @Enumerated(EnumType.STRING)
  private MarketStatus status = MarketStatus.ACTIVE;

  @CreatedDate private Instant createdAt;
  @LastModifiedDate private Instant updatedAt;
}
```

Enable auditing:
```java
@Configuration
@EnableJpaAuditing
class JpaConfig {}
```

---

## Relationships & N+1 Prevention

```java
@OneToMany(mappedBy = "market", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PositionEntity> positions = new ArrayList<>();
```

**Key rules:**
- Default to lazy loading; use `JOIN FETCH` when needed
- Avoid `EAGER` on collections; use DTO projections for read paths

```java
@Query("select m from MarketEntity m left join fetch m.positions where m.id = :id")
Optional<MarketEntity> findWithPositions(@Param("id") Long id);
```

---

## Repository Patterns

```java
public interface MarketRepository extends JpaRepository<MarketEntity, Long> {
  Optional<MarketEntity> findBySlug(String slug);

  @Query("select m from MarketEntity m where m.status = :status")
  Page<MarketEntity> findByStatus(@Param("status") MarketStatus status, Pageable pageable);
}
```

**Lightweight queries with projections:**
```java
public interface MarketSummary {
  Long getId();
  String getName();
  MarketStatus getStatus();
}
Page<MarketSummary> findAllBy(Pageable pageable);
```

---

## Transactions

- Annotate service methods with `@Transactional`
- Use `@Transactional(readOnly = true)` for read paths
- Keep transactions short; avoid long-running transactions

```java
@Transactional
public Market updateStatus(Long id, MarketStatus status) {
  MarketEntity entity = repo.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("Market"));
  entity.setStatus(status);
  return Market.from(entity);
}
```

---

## Pagination

```java
PageRequest page = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
Page<MarketEntity> markets = repo.findByStatus(MarketStatus.ACTIVE, page);
```

For cursor-based pagination, include `id > :lastId` in JPQL with ordering.

---

## Indexing & Performance

- Index common filters: `status`, `slug`, foreign keys
- Composite indexes matching query patterns: `(status, created_at)`
- Avoid `select *` -- project only needed columns
- Batch writes with `saveAll` and `hibernate.jdbc.batch_size`

---

## Connection Pooling (HikariCP)

```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.validation-timeout=5000
```

For PostgreSQL LOB handling:
```properties
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true
```

---

## Caching

- 1st-level cache is per EntityManager; don't keep entities across transactions
- For read-heavy entities, consider second-level cache cautiously; validate eviction strategy

---

## Migrations

- Use Flyway or Liquibase; never rely on Hibernate auto DDL in production
- Keep migrations idempotent and additive

---

## Testing Data Access

- Prefer `@DataJpaTest` with Testcontainers to mirror production
- Assert SQL efficiency:
  - `logging.level.org.hibernate.SQL=DEBUG`
  - `logging.level.org.hibernate.orm.jdbc.bind=TRACE`

---

**Remember**: Keep entities lean, queries intentional, and transactions short. Prevent N+1 with fetch strategies and projections, and index for your read/write paths.

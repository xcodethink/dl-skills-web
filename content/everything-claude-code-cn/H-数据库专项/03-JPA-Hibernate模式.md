> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# JPA/Hibernate 模式

## 概述

Spring Boot 中使用 JPA（Java Persistence API）和 Hibernate 进行数据建模、仓库设计和性能调优的最佳实践。涵盖实体设计（Entity Design）、关系映射（Relationships）、N+1 查询预防、事务管理（Transactions）、分页（Pagination）、索引（Indexing）、连接池（Connection Pooling）和测试策略。

---

## 实体设计（Entity Design）

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

  @CreatedDate private Instant createdAt;    // 创建时间，自动填充
  @LastModifiedDate private Instant updatedAt; // 更新时间，自动填充
}
```

启用审计（Auditing）：
```java
@Configuration
@EnableJpaAuditing
class JpaConfig {}
```

---

## 关系映射与 N+1 预防

```java
@OneToMany(mappedBy = "market", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PositionEntity> positions = new ArrayList<>();
```

**关键原则：**
- 默认使用延迟加载（Lazy Loading）；需要时在查询中使用 `JOIN FETCH`
- 避免在集合上使用 `EAGER`；读取路径使用 DTO 投影（DTO Projections）

```java
// 使用 JOIN FETCH 避免 N+1 查询
@Query("select m from MarketEntity m left join fetch m.positions where m.id = :id")
Optional<MarketEntity> findWithPositions(@Param("id") Long id);
```

---

## 仓库模式（Repository Patterns）

```java
public interface MarketRepository extends JpaRepository<MarketEntity, Long> {
  Optional<MarketEntity> findBySlug(String slug);

  @Query("select m from MarketEntity m where m.status = :status")
  Page<MarketEntity> findByStatus(@Param("status") MarketStatus status, Pageable pageable);
}
```

使用投影（Projections）进行轻量级查询：
```java
// 接口投影 — 只返回需要的字段
public interface MarketSummary {
  Long getId();
  String getName();
  MarketStatus getStatus();
}
Page<MarketSummary> findAllBy(Pageable pageable);
```

---

## 事务管理（Transactions）

- 在服务方法上标注 `@Transactional`
- 读取路径使用 `@Transactional(readOnly = true)` 以优化性能
- 谨慎选择传播行为（Propagation）；避免长时间运行的事务

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

## 分页（Pagination）

```java
// 标准分页
PageRequest page = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
Page<MarketEntity> markets = repo.findByStatus(MarketStatus.ACTIVE, page);
```

对于游标分页（Cursor-based Pagination），在 JPQL 中包含 `id > :lastId` 并配合排序。

---

## 索引与性能

- 为常用过滤器添加索引（`status`、`slug`、外键）
- 使用复合索引匹配查询模式（`status, created_at`）
- 避免 `select *`；只投影需要的列
- 使用 `saveAll` 进行批量写入，并配置 `hibernate.jdbc.batch_size`

---

## 连接池（HikariCP）

推荐配置：
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.validation-timeout=5000
```

PostgreSQL LOB 处理，添加：
```properties
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true
```

---

## 缓存（Caching）

- **一级缓存（1st-level Cache）** 是每个 EntityManager 独有的；避免跨事务保持实体
- 对于读多的实体，可谨慎考虑二级缓存（Second-level Cache）；需验证淘汰策略（Eviction Strategy）

---

## 迁移（Migrations）

- 使用 Flyway 或 Liquibase；**绝对不要**在生产环境依赖 Hibernate 自动 DDL
- 保持迁移脚本幂等（Idempotent）且只做增量操作；不要在没有计划的情况下删除列

---

## 数据访问层测试

- 优先使用 `@DataJpaTest` 配合 Testcontainers 来模拟生产环境
- 通过日志断言 SQL 效率：
  - 设置 `logging.level.org.hibernate.SQL=DEBUG` 查看 SQL 语句
  - 设置 `logging.level.org.hibernate.orm.jdbc.bind=TRACE` 查看参数值

---

**核心原则：** 保持实体精简，查询有目的性，事务简短。通过抓取策略（Fetch Strategy）和投影（Projection）防止 N+1 问题，为读写路径创建索引。

# Spring Boot 模式

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：skills/springboot-patterns/SKILL.md + skills/jpa-patterns/SKILL.md

---

## 何时激活

- 使用 Spring MVC 或 WebFlux 构建 REST API
- 组织 controller -> service -> repository 层
- 配置 Spring Data JPA、缓存或异步处理
- 添加验证、异常处理或分页
- 设置 dev/staging/production 环境配置文件

---

## REST API 结构

```java
@RestController
@RequestMapping("/api/markets")
@Validated
class MarketController {
  private final MarketService marketService;

  MarketController(MarketService marketService) {
    this.marketService = marketService;
  }

  @GetMapping
  ResponseEntity<Page<MarketResponse>> list(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    Page<Market> markets = marketService.list(PageRequest.of(page, size));
    return ResponseEntity.ok(markets.map(MarketResponse::from));
  }

  @PostMapping
  ResponseEntity<MarketResponse> create(@Valid @RequestBody CreateMarketRequest request) {
    Market market = marketService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(MarketResponse.from(market));
  }
}
```

---

## DTO 与验证

```java
public record CreateMarketRequest(
    @NotBlank @Size(max = 200) String name,
    @NotBlank @Size(max = 2000) String description,
    @NotNull @FutureOrPresent Instant endDate,
    @NotEmpty List<@NotBlank String> categories) {}

public record MarketResponse(Long id, String name, MarketStatus status) {
  static MarketResponse from(Market market) {
    return new MarketResponse(market.id(), market.name(), market.status());
  }
}
```

---

## 服务层与事务

```java
@Service
public class MarketService {
  private final MarketRepository repo;

  public MarketService(MarketRepository repo) {
    this.repo = repo;
  }

  @Transactional
  public Market create(CreateMarketRequest request) {
    MarketEntity entity = MarketEntity.from(request);
    MarketEntity saved = repo.save(entity);
    return Market.from(saved);
  }
}
```

---

## 全局异常处理

```java
@ControllerAdvice
class GlobalExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .map(e -> e.getField() + ": " + e.getDefaultMessage())
        .collect(Collectors.joining(", "));
    return ResponseEntity.badRequest().body(ApiError.validation(message));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiError> handleGeneric(Exception ex) {
    // 记录未预期的错误及堆栈跟踪
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiError.of("Internal server error"));
  }
}
```

---

## 缓存

需要在配置类上添加 `@EnableCaching`。

```java
@Service
public class MarketCacheService {
  @Cacheable(value = "market", key = "#id")
  public Market getById(Long id) {
    return repo.findById(id)
        .map(Market::from)
        .orElseThrow(() -> new EntityNotFoundException("市场未找到"));
  }

  @CacheEvict(value = "market", key = "#id")
  public void evict(Long id) {}
}
```

---

## 异步处理

需要在配置类上添加 `@EnableAsync`。

```java
@Service
public class NotificationService {
  @Async
  public CompletableFuture<Void> sendAsync(Notification notification) {
    // 发送邮件/短信
    return CompletableFuture.completedFuture(null);
  }
}
```

---

## 日志（SLF4J）

```java
private static final Logger log = LoggerFactory.getLogger(ReportService.class);
log.info("generate_report marketId={}", marketId);
log.error("generate_report_failed marketId={}", marketId, ex);
```

---

## 请求日志过滤器

```java
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    long start = System.currentTimeMillis();
    try {
      filterChain.doFilter(request, response);
    } finally {
      long duration = System.currentTimeMillis() - start;
      log.info("req method={} uri={} status={} durationMs={}",
          request.getMethod(), request.getRequestURI(), response.getStatus(), duration);
    }
  }
}
```

---

## 限流（Rate Limiting）

```java
@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

  /*
   * 安全提示：此过滤器使用 request.getRemoteAddr() 识别客户端。
   * 如果应用在反向代理后面，必须配置 Spring 正确处理转发头以获取准确的客户端 IP。
   */
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    String clientIp = request.getRemoteAddr();

    Bucket bucket = buckets.computeIfAbsent(clientIp,
        k -> Bucket.builder()
            .addLimit(Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1))))
            .build());

    if (bucket.tryConsume(1)) {
      filterChain.doFilter(request, response);
    } else {
      response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    }
  }
}
```

---

## 弹性外部调用（指数退避重试）

```java
public <T> T withRetry(Supplier<T> supplier, int maxRetries) {
  int attempts = 0;
  while (true) {
    try {
      return supplier.get();
    } catch (Exception ex) {
      attempts++;
      if (attempts >= maxRetries) {
        throw ex;
      }
      try {
        Thread.sleep((long) Math.pow(2, attempts) * 100L);
      } catch (InterruptedException ie) {
        Thread.currentThread().interrupt();
        throw ex;
      }
    }
  }
}
```

---

## JPA/Hibernate 模式

### 实体设计

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

### 关系与 N+1 防范

```java
@OneToMany(mappedBy = "market", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PositionEntity> positions = new ArrayList<>();
```

- 默认使用懒加载（Lazy Loading）；在查询中需要时使用 `JOIN FETCH`
- 避免在集合上使用 `EAGER`；读取路径使用 DTO 投影

```java
@Query("select m from MarketEntity m left join fetch m.positions where m.id = :id")
Optional<MarketEntity> findWithPositions(@Param("id") Long id);
```

### 仓库模式

```java
public interface MarketRepository extends JpaRepository<MarketEntity, Long> {
  Optional<MarketEntity> findBySlug(String slug);

  @Query("select m from MarketEntity m where m.status = :status")
  Page<MarketEntity> findByStatus(@Param("status") MarketStatus status, Pageable pageable);
}
```

使用投影（Projection）进行轻量查询：
```java
public interface MarketSummary {
  Long getId();
  String getName();
  MarketStatus getStatus();
}
Page<MarketSummary> findAllBy(Pageable pageable);
```

### 事务最佳实践

- 服务方法标注 `@Transactional`
- 读取路径使用 `@Transactional(readOnly = true)` 优化
- 谨慎选择传播行为；避免长时间运行的事务

### 连接池（HikariCP）

```
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.validation-timeout=5000
```

### 迁移

- 使用 Flyway 或 Liquibase；生产环境**永远不要**依赖 Hibernate auto DDL
- 保持迁移幂等且仅添加；不要无计划地删除列

### 测试数据访问

- 使用 `@DataJpaTest` 配合 Testcontainers 镜像生产环境
- 使用日志验证 SQL 效率：设置 `logging.level.org.hibernate.SQL=DEBUG`

---

## 生产默认设置

- 优先使用构造函数注入，避免字段注入
- 启用 `spring.mvc.problemdetails.enabled=true` 用于 RFC 7807 错误（Spring Boot 3+）
- 为工作负载配置 HikariCP 连接池大小，设置超时
- 查询使用 `@Transactional(readOnly = true)`
- 通过 `@NonNull` 和 `Optional` 强制空安全

---

**记住**：保持控制器精简，服务聚焦，仓库简单，错误集中处理。为可维护性和可测试性优化。

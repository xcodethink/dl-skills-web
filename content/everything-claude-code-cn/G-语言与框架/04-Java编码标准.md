# Java 编码标准

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：skills/java-coding-standards/SKILL.md

---

## 何时激活

- 在 Spring Boot 项目中编写或审查 Java 代码
- 强制命名、不可变性或异常处理规范
- 使用 records、sealed classes 或模式匹配（Java 17+）
- 审查 Optional、流（Streams）或泛型的使用
- 组织包和项目布局

---

## 核心原则

- 清晰优于聪明
- 默认不可变；最小化共享可变状态
- 用有意义的异常快速失败（Fail Fast）
- 一致的命名和包结构

---

## 命名规范

```java
// 类/记录（Record）：PascalCase
public class MarketService {}
public record Money(BigDecimal amount, Currency currency) {}

// 方法/字段：camelCase
private final MarketRepository marketRepository;
public Market findBySlug(String slug) {}

// 常量：UPPER_SNAKE_CASE
private static final int MAX_PAGE_SIZE = 100;
```

## 不可变性（Immutability）

```java
// 优先使用 records 和 final 字段
public record MarketDto(Long id, String name, MarketStatus status) {}

public class Market {
  private final Long id;
  private final String name;
  // 只有 getter，没有 setter
}
```

## Optional 使用

```java
// 从 find* 方法返回 Optional
Optional<Market> market = marketRepository.findBySlug(slug);

// 使用 map/flatMap 而非 get()
return market
    .map(MarketResponse::from)
    .orElseThrow(() -> new EntityNotFoundException("Market not found"));
```

## 流（Streams）最佳实践

```java
// 对转换使用流，保持管道短小
List<String> names = markets.stream()
    .map(Market::name)
    .filter(Objects::nonNull)
    .toList();

// 避免复杂嵌套流；为了清晰优先使用循环
```

## 异常处理

- 领域错误使用非检查异常（Unchecked Exceptions）；用上下文包裹技术异常
- 创建领域特定异常（如 `MarketNotFoundException`）
- 避免宽泛的 `catch (Exception ex)`，除非是重新抛出/集中记录

```java
throw new MarketNotFoundException(slug);
```

## 泛型和类型安全

- 避免原始类型（Raw Types）；声明泛型参数
- 可复用工具优先使用有界泛型（Bounded Generics）

```java
public <T extends Identifiable> Map<Long, T> indexById(Collection<T> items) { ... }
```

## 项目结构（Maven/Gradle）

```
src/main/java/com/example/app/
  config/          # 配置类
  controller/      # 控制器
  service/         # 服务层
  repository/      # 数据仓库
  domain/          # 领域模型
  dto/             # 数据传输对象
  util/            # 工具类
src/main/resources/
  application.yml
src/test/java/...  # 镜像 main 结构
```

## 格式化和风格

- 一致使用 2 或 4 个空格（项目标准）
- 每个文件一个公共顶级类型
- 方法保持短小聚焦；提取辅助方法
- 成员排序：常量、字段、构造函数、public 方法、protected、private

## 代码异味

- 参数列表过长 -> 使用 DTO/构建器
- 深层嵌套 -> 提前返回
- 魔法数字 -> 命名常量
- 静态可变状态 -> 优先使用依赖注入
- 静默 catch 块 -> 记录日志并处理或重新抛出

## 日志

```java
private static final Logger log = LoggerFactory.getLogger(MarketService.class);
log.info("fetch_market slug={}", slug);
log.error("failed_fetch_market slug={}", slug, ex);
```

## Null 处理

- 仅在不可避免时接受 `@Nullable`；否则使用 `@NonNull`
- 在输入上使用 Bean Validation（`@NotNull`、`@NotBlank`）

## 测试期望

- JUnit 5 + AssertJ 用于流式断言
- Mockito 用于 mock；尽可能避免部分 mock
- 优先使用确定性测试；不要使用隐藏的 sleep

---

**记住**：保持代码有意图、强类型和可观测。除非经过证明有必要，否则为可维护性而非微优化进行优化。

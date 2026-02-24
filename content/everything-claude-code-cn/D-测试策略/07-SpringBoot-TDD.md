# Spring Boot 测试驱动开发（Spring Boot TDD）

> **来源：** [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> **原始文件：** skills/springboot-tdd/SKILL.md
> **整理日期：** 2026-02-21

---

## 概述

Spring Boot 服务的 TDD 指南，使用 JUnit 5、Mockito、MockMvc、Testcontainers 和 JaCoCo，要求 80% 以上的覆盖率（单元测试 + 集成测试）。

---

## 何时使用

- 新功能或端点开发
- Bug 修复或代码重构
- 添加数据访问逻辑或安全规则

---

## 工作流

1. **先写测试**（测试应该失败）
2. **编写最小代码使测试通过**
3. **在测试绿色的前提下重构**
4. **执行覆盖率检查**（JaCoCo）

---

## 单元测试（JUnit 5 + Mockito）

```java
@ExtendWith(MockitoExtension.class)
class MarketServiceTest {
  @Mock MarketRepository repo;
  @InjectMocks MarketService service;

  @Test
  void createsMarket() {
    CreateMarketRequest req = new CreateMarketRequest(
        "name", "desc", Instant.now(), List.of("cat"));
    when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

    Market result = service.create(req);

    assertThat(result.name()).isEqualTo("name");
    verify(repo).save(any());
  }
}
```

### 模式

- **Arrange-Act-Assert**（准备-执行-断言）
- 避免部分 Mock；优先使用显式的 Stub
- 使用 `@ParameterizedTest` 测试变体

---

## Web 层测试（MockMvc）

```java
@WebMvcTest(MarketController.class)
class MarketControllerTest {
  @Autowired MockMvc mockMvc;
  @MockBean MarketService marketService;

  @Test
  void returnsMarkets() throws Exception {
    when(marketService.list(any())).thenReturn(Page.empty());

    mockMvc.perform(get("/api/markets"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content").isArray());
  }
}
```

---

## 集成测试（SpringBootTest）

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MarketIntegrationTest {
  @Autowired MockMvc mockMvc;

  @Test
  void createsMarket() throws Exception {
    mockMvc.perform(post("/api/markets")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {"name":"Test","description":"Desc",
           "endDate":"2030-01-01T00:00:00Z",
           "categories":["general"]}
        """))
      .andExpect(status().isCreated());
  }
}
```

---

## 持久层测试（DataJpaTest）

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestContainersConfig.class)
class MarketRepositoryTest {
  @Autowired MarketRepository repo;

  @Test
  void savesAndFinds() {
    MarketEntity entity = new MarketEntity();
    entity.setName("Test");
    repo.save(entity);

    Optional<MarketEntity> found = repo.findByName("Test");
    assertThat(found).isPresent();
  }
}
```

---

## Testcontainers

- 使用可复用容器运行 Postgres/Redis 以镜像生产环境
- 通过 `@DynamicPropertySource` 将 JDBC URL 注入 Spring 上下文

---

## 覆盖率（JaCoCo）

### Maven 配置片段

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.14</version>
  <executions>
    <execution>
      <goals><goal>prepare-agent</goal></goals>
    </execution>
    <execution>
      <id>report</id>
      <phase>verify</phase>
      <goals><goal>report</goal></goals>
    </execution>
  </executions>
</plugin>
```

---

## 断言

- 优先使用 AssertJ（`assertThat`）以提高可读性
- 对 JSON 响应使用 `jsonPath`
- 对异常使用 `assertThatThrownBy(...)`

---

## 测试数据构建器（Test Data Builders）

```java
class MarketBuilder {
  private String name = "Test";

  MarketBuilder withName(String name) {
    this.name = name;
    return this;
  }

  Market build() {
    return new Market(null, name, MarketStatus.ACTIVE);
  }
}
```

---

## CI 命令

```bash
# Maven
mvn -T 4 test          # 并行运行测试
mvn verify              # 运行测试并生成报告

# Gradle
./gradlew test jacocoTestReport
```

---

## 最佳实践

- 保持测试快速、隔离、确定性
- 测试行为而非实现细节
- 使用 Arrange-Act-Assert 模式
- 使用 `@ParameterizedTest` 覆盖多种变体
- 避免部分 Mock，使用显式 Stub
- 使用 Testcontainers 镜像生产数据库
- 目标覆盖率 80%+，关键路径 100%

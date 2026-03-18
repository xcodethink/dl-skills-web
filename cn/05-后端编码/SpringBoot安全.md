# Spring Boot 安全（Spring Boot Security）

> **来源**: [affaan-m/everything-claude-code](https://github.com/AffaanM/everything-claude-code)
> **原始文件**: skills/springboot-security/SKILL.md
> **类别**: E-安全保障

---

## 概述

Spring Security 最佳实践，涵盖认证/授权（authn/authz）、输入验证、CSRF、密钥管理、安全头、速率限制以及 Java Spring Boot 服务的依赖安全。

---

## 激活时机

- 添加认证（JWT、OAuth2、基于会话）
- 实现授权（`@PreAuthorize`、基于角色的访问控制）
- 验证用户输入（Bean Validation、自定义验证器）
- 配置 CORS、CSRF 或安全头
- 管理密钥（Vault、环境变量）
- 添加速率限制或暴力破解防护
- 扫描依赖的 CVE

---

## 认证（Authentication）

- 优先使用无状态 JWT 或带撤销列表的不透明令牌（Opaque Token）
- 会话使用 `httpOnly`、`Secure`、`SameSite=Strict` Cookie
- 使用 `OncePerRequestFilter` 或资源服务器验证令牌

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwtService;

  public JwtAuthFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain) throws ServletException, IOException {
    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      String token = header.substring(7);
      Authentication auth = jwtService.authenticate(token);
      SecurityContextHolder.getContext().setAuthentication(auth);
    }
    chain.doFilter(request, response);
  }
}
```

---

## 授权（Authorization）

- 启用方法级安全：`@EnableMethodSecurity`
- 使用 `@PreAuthorize("hasRole('ADMIN')")` 或 `@PreAuthorize("@authz.canEdit(#id)")`
- 默认拒绝；仅暴露必需的作用域（Scope）

```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/users")
  public List<UserDto> listUsers() {
    return userService.findAll();
  }

  @PreAuthorize("@authz.isOwner(#id, authentication)")
  @DeleteMapping("/users/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
```

---

## 输入验证（Input Validation）

- 在控制器上使用 Bean Validation 的 `@Valid`
- 在 DTO 上应用约束：`@NotBlank`、`@Email`、`@Size`、自定义验证器
- 渲染前使用白名单清理任何 HTML

```java
// 错误：无验证
@PostMapping("/users")
public User createUser(@RequestBody UserDto dto) {
  return userService.create(dto);
}

// 正确：已验证的 DTO
public record CreateUserDto(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Email String email,
    @NotNull @Min(0) @Max(150) Integer age
) {}

@PostMapping("/users")
public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserDto dto) {
  return ResponseEntity.status(HttpStatus.CREATED)
      .body(userService.create(dto));
}
```

---

## SQL 注入防护

- 使用 Spring Data 仓库或参数化查询
- 原生查询（Native Query）使用 `:param` 绑定；绝不拼接字符串

```java
// 错误：原生查询中的字符串拼接
@Query(value = "SELECT * FROM users WHERE name = '" + name + "'", nativeQuery = true)

// 正确：参数化原生查询
@Query(value = "SELECT * FROM users WHERE name = :name", nativeQuery = true)
List<User> findByName(@Param("name") String name);

// 正确：Spring Data 派生查询（自动参数化）
List<User> findByEmailAndActiveTrue(String email);
```

---

## 密码编码（Password Encoding）

- 始终使用 BCrypt 或 Argon2 哈希密码 — 绝不存储明文
- 使用 `PasswordEncoder` Bean，而非手动哈希

```java
@Bean
public PasswordEncoder passwordEncoder() {
  return new BCryptPasswordEncoder(12); // 计算因子 12
}

// 在服务中使用
public User register(CreateUserDto dto) {
  String hashedPassword = passwordEncoder.encode(dto.password());
  return userRepository.save(new User(dto.email(), hashedPassword));
}
```

---

## CSRF 防护

- 对基于浏览器会话的应用，保持 CSRF 启用；在表单/请求头中包含令牌
- 对使用 Bearer 令牌的纯 API，禁用 CSRF 并依赖无状态认证

```java
http
  .csrf(csrf -> csrf.disable())
  .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
```

---

## 密钥管理（Secrets Management）

- 源码中无密钥；从环境变量或 Vault 加载
- `application.yml` 中不存储凭据；使用占位符
- 定期轮换令牌和数据库凭据

```yaml
# 错误：硬编码在 application.yml 中
spring:
  datasource:
    password: mySecretPassword123

# 正确：环境变量占位符
spring:
  datasource:
    password: ${DB_PASSWORD}

# 正确：Spring Cloud Vault 集成
spring:
  cloud:
    vault:
      uri: https://vault.example.com
      token: ${VAULT_TOKEN}
```

---

## 安全头（Security Headers）

```java
http
  .headers(headers -> headers
    .contentSecurityPolicy(csp -> csp
      .policyDirectives("default-src 'self'"))
    .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
    .xssProtection(Customizer.withDefaults())
    .referrerPolicy(rp -> rp.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER)));
```

---

## CORS 配置

- 在安全过滤器级别配置 CORS，而非每个控制器
- 限制允许的来源 — 生产环境绝不使用 `*`

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
  CorsConfiguration config = new CorsConfiguration();
  config.setAllowedOrigins(List.of("https://app.example.com"));
  config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
  config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
  config.setAllowCredentials(true);
  config.setMaxAge(3600L);

  UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
  source.registerCorsConfiguration("/api/**", config);
  return source;
}

// 在 SecurityFilterChain 中：
http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
```

---

## 速率限制（Rate Limiting）

- 使用 Bucket4j 或网关级别限制高开销端点
- 记录并告警突发请求；返回 429 并附带重试提示

```java
// 使用 Bucket4j 进行每端点速率限制
@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

  private Bucket createBucket() {
    return Bucket.builder()
        .addLimit(Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1))))
        .build();
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain) throws ServletException, IOException {
    String clientIp = request.getRemoteAddr();
    Bucket bucket = buckets.computeIfAbsent(clientIp, k -> createBucket());

    if (bucket.tryConsume(1)) {
      chain.doFilter(request, response);
    } else {
      response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
      response.getWriter().write("{\"error\": \"Rate limit exceeded\"}");
    }
  }
}
```

---

## 依赖安全

- 在 CI 中运行 OWASP Dependency Check / Snyk
- 保持 Spring Boot 和 Spring Security 在受支持版本
- 对已知 CVE 构建失败

---

## 日志与 PII

- 绝不记录密钥、令牌、密码或完整 PAN 数据
- 脱敏敏感字段；使用结构化 JSON 日志

---

## 文件上传

- 验证大小、内容类型和扩展名
- 存储在 Web 根目录之外；如有需要进行扫描

---

## 发布前检查清单

- [ ] 认证令牌已正确验证和过期
- [ ] 每个敏感路径上都有授权守卫
- [ ] 所有输入已验证和清理
- [ ] 无字符串拼接 SQL
- [ ] CSRF 策略对应用类型正确
- [ ] 密钥已外部化；未提交任何密钥
- [ ] 安全头已配置
- [ ] API 已设置速率限制
- [ ] 依赖已扫描且更新
- [ ] 日志中无敏感数据

---

**切记**：默认拒绝，验证输入，最小权限，安全优先配置。

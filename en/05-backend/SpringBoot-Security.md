# Spring Boot Security

> **Source**: [affaan-m/everything-claude-code](https://github.com/AffaanM/everything-claude-code)
> **Original file**: skills/springboot-security/SKILL.md
> **Category**: E-Security

---

## Overview

Spring Security best practices for authentication/authorization, input validation, CSRF, secrets management, security headers, rate limiting, and dependency security in Java Spring Boot services.

---

## When to Activate

- Adding authentication (JWT, OAuth2, session-based)
- Implementing authorization (`@PreAuthorize`, role-based access)
- Validating user input (Bean Validation, custom validators)
- Configuring CORS, CSRF, or security headers
- Managing secrets (Vault, environment variables)
- Adding rate limiting or brute-force protection
- Scanning dependencies for CVEs

---

## Authentication

- Prefer stateless JWT or opaque tokens with revocation list
- Use `httpOnly`, `Secure`, `SameSite=Strict` cookies for sessions
- Validate tokens with `OncePerRequestFilter` or resource server

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain) throws ServletException, IOException {
    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      Authentication auth = jwtService.authenticate(header.substring(7));
      SecurityContextHolder.getContext().setAuthentication(auth);
    }
    chain.doFilter(request, response);
  }
}
```

---

## Authorization

- Enable method security: `@EnableMethodSecurity`
- Use `@PreAuthorize("hasRole('ADMIN')")` or custom SpEL: `@PreAuthorize("@authz.canEdit(#id)")`
- Deny by default; expose only required scopes

---

## Input Validation

Use Bean Validation with `@Valid` on controllers:

```java
public record CreateUserDto(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Email String email,
    @NotNull @Min(0) @Max(150) Integer age
) {}

@PostMapping("/users")
public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserDto dto) {
  return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(dto));
}
```

---

## SQL Injection Prevention

```java
// SAFE: Parameterized native query
@Query(value = "SELECT * FROM users WHERE name = :name", nativeQuery = true)
List<User> findByName(@Param("name") String name);

// SAFE: Spring Data derived query (auto-parameterized)
List<User> findByEmailAndActiveTrue(String email);

// DANGEROUS: String concatenation
@Query(value = "SELECT * FROM users WHERE name = '" + name + "'", nativeQuery = true)  // NEVER
```

---

## Password Encoding

Always hash with BCrypt (cost 12) or Argon2:
```java
@Bean
public PasswordEncoder passwordEncoder() {
  return new BCryptPasswordEncoder(12);
}
```

---

## CSRF

- Browser session apps: keep CSRF enabled
- Pure APIs with Bearer tokens: disable CSRF, use stateless auth

---

## Secrets Management

```yaml
# WRONG: Hardcoded
spring.datasource.password: mySecretPassword123

# RIGHT: Environment variable
spring.datasource.password: ${DB_PASSWORD}

# RIGHT: Spring Cloud Vault
spring.cloud.vault.uri: https://vault.example.com
```

---

## Security Headers

```java
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
    .frameOptions(FrameOptionsConfig::sameOrigin)
    .xssProtection(Customizer.withDefaults())
    .referrerPolicy(rp -> rp.policy(ReferrerPolicy.NO_REFERRER)));
```

---

## CORS

Configure at security filter level; never use `*` in production:
```java
config.setAllowedOrigins(List.of("https://app.example.com"));
config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
config.setAllowCredentials(true);
```

---

## Rate Limiting (Bucket4j)

```java
@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

  private Bucket createBucket() {
    return Bucket.builder()
        .addLimit(Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1))))
        .build();
  }

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
      FilterChain chain) throws ServletException, IOException {
    Bucket bucket = buckets.computeIfAbsent(req.getRemoteAddr(), k -> createBucket());
    if (bucket.tryConsume(1)) {
      chain.doFilter(req, res);
    } else {
      res.setStatus(429);
      res.getWriter().write("{\"error\": \"Rate limit exceeded\"}");
    }
  }
}
```

---

## Pre-Release Checklist

- [ ] Auth tokens validated and expired correctly
- [ ] Authorization guards on every sensitive path
- [ ] All inputs validated and sanitized
- [ ] No string-concatenated SQL
- [ ] CSRF posture correct for app type
- [ ] Secrets externalized, none committed
- [ ] Security headers configured
- [ ] Rate limiting on APIs
- [ ] Dependencies scanned and up to date
- [ ] Logs free of sensitive data

---

**Remember**: Deny by default, validate inputs, least privilege, secure-by-configuration first.

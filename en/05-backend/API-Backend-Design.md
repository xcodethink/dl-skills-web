# API & Backend Design

> Source: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> Files: skills/api-design/SKILL.md + skills/backend-patterns/SKILL.md

---

## REST API Design

### URL Conventions

Resources are nouns, plural, lowercase, kebab-case. Sub-resources for relationships. Verbs only for non-CRUD actions.

### HTTP Methods & Status Codes

| Method | Idempotent | Use |
|--------|-----------|-----|
| GET | Yes | Retrieve |
| POST | No | Create, trigger actions |
| PUT | Yes | Full replacement |
| PATCH | No* | Partial update |
| DELETE | Yes | Remove |

**Success**: 200 (OK), 201 (Created + Location header), 204 (No Content)
**Client Error**: 400, 401, 403, 404, 409, 422, 429
**Server Error**: 500, 502, 503

### Response Format

```json
{
  "data": { ... },
  "meta": { "total": 142, "page": 1, "per_page": 20 },
  "links": { "self": "...", "next": "..." }
}
```

Error: `{ "error": { "code": "...", "message": "...", "details": [...] } }`

### Pagination

- **Offset-based**: Simple, supports page jumping. Slow on large offsets.
- **Cursor-based**: Consistent performance, stable with concurrent inserts. Use for feeds and large datasets.

### Filtering & Sorting

Equality (`?status=active`), comparison (`?price[gte]=10`), multiple values (comma-separated), sorting with `-` prefix for descending.

### Versioning

URL path versioning recommended (`/api/v1/`). Maintain at most 2 active versions. Non-breaking changes (new fields, new endpoints) don't need new versions.

### Rate Limiting

Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`. Tiered: anonymous (30/min), authenticated (100/min), premium (1000/min).

---

## Backend Architecture

### Repository Pattern

Abstract data access behind interfaces. Implementations for Supabase, PostgreSQL, etc.

### Service Layer

Business logic separated from data access. Encapsulates complex operations, orchestrates repositories.

### Middleware

Auth validation, logging, rate limiting as composable wrappers.

### Database Optimization

- Select only needed columns
- Batch fetch to prevent N+1 queries
- Transactions for multi-table operations

### Caching

Redis cache-aside pattern: check cache, fetch from DB on miss, update cache. TTL-based expiration.

### Error Handling

Centralized error handler with `ApiError` class. Zod validation errors mapped to 400. Unexpected errors logged and returned as 500.

### Retry with Exponential Backoff

`delay = Math.pow(2, attempt) * 1000` with configurable max retries.

### Authentication & Authorization

JWT token validation. Role-based access control with permission mapping.

---

## API Design Checklist

- [ ] Resource URL follows naming conventions
- [ ] Correct HTTP method and status codes
- [ ] Input validated with schema
- [ ] Standard error response format
- [ ] Pagination on list endpoints
- [ ] Authentication and authorization checked
- [ ] Rate limiting configured
- [ ] No internal details leaked in responses
- [ ] Documentation updated

---

**Remember**: Backend patterns enable scalable, maintainable server-side applications.

> Source: [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | Category: Backend

---
name: api-design-standards
description: Use when designing REST APIs to ensure consistent resource modeling, endpoint patterns, error handling, and OpenAPI specifications.
---

# API Design Standards

## Overview

Good APIs are designed, not just coded. A poorly designed API is nearly impossible to fix once clients depend on it. This skill provides a complete workflow from domain analysis to version evolution, ensuring every endpoint is deliberate.

## When to Use

- Designing a REST API from scratch
- Writing OpenAPI specifications for existing services
- Standardizing API design across a team
- Reviewing endpoint design for consistency

## 5-Step Design Workflow

| Step | Action | Output |
|------|--------|--------|
| 1. Analyze Domain | Understand business requirements, data models, client needs | Domain model doc |
| 2. Model Resources | Identify resources, relationships, operations | Resource diagram |
| 3. Design Endpoints | Define URI patterns, HTTP methods, request/response schemas | Endpoint spec |
| 4. Specify Contract | Write complete OpenAPI 3.1 specification | openapi.yaml |
| 5. Plan Evolution | Design versioning, deprecation, backward compatibility | Evolution plan |

## REST Core Principles

- **Resource-oriented URIs**: URIs represent resources (nouns), not actions (verbs)
- **Proper HTTP methods**: GET read / POST create / PUT full replace / PATCH partial update / DELETE remove
- **Status code semantics**: 200 OK / 201 Created / 204 No Content / 400 Bad Request / 401 Unauthorized / 403 Forbidden / 404 Not Found / 409 Conflict / 429 Rate Limited / 500 Server Error

## Naming Convention

Pick `snake_case` or `camelCase` and enforce it project-wide. Recommendation: `camelCase` for JSON response bodies (JavaScript ecosystem alignment), `snake_case` for query parameters (URL readability).

```
GET /api/v1/users/{user_id}/orders?sort_by=created_at&page_size=20
```

## Pagination Patterns

| Pattern | Best For | Pros | Cons |
|---------|----------|------|------|
| Cursor | Real-time feeds, infinite scroll | Stable performance, no page drift | Cannot jump to arbitrary page |
| Offset | Admin dashboards, page jumping | Simple, supports random access | Degrades on large datasets |
| Keyset | Large ordered datasets | High performance, consistent | Forward/backward only |

Default to cursor-based pagination. Use offset only when page jumping is an explicit requirement.

## Error Response Standard

Use RFC 7807 Problem Details format:

```json
{
  "type": "https://api.example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The 'email' field must be a valid email address.",
  "instance": "/users/registration",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

## Versioning Strategy

| Method | Example | When to Use |
|--------|---------|-------------|
| URI versioning | `/v1/users` | Public APIs, simple and explicit |
| Header versioning | `Accept: application/vnd.api+json;version=1` | Internal APIs, clean URIs |

Recommend URI versioning for public APIs, header versioning for internal microservices.

## Authentication

OAuth 2.0 + JWT token flow:

1. Client exchanges credentials for Access Token (short-lived) and Refresh Token (long-lived)
2. Requests include `Authorization: Bearer <token>` header
3. Silently refresh Access Token using Refresh Token when expired
4. Require step-up authentication for sensitive operations

## MUST DO / MUST NOT

**MUST DO:**
- Enforce consistent naming convention across all endpoints
- Write comprehensive OpenAPI 3.1 specification
- Paginate all collection endpoints
- Implement rate limiting with `429` status and `Retry-After` header
- Provide request/response examples for every endpoint

**MUST NOT:**
- Use verbs in URIs (`/getUser` should be `/users/{id}`)
- Return inconsistent response structures across endpoints
- Expose internal implementation details (database column names, internal ID formats)
- Introduce breaking changes without a migration path
- Skip error code documentation

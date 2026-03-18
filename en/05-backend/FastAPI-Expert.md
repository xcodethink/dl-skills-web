> Source: [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | Category: Backend

---
name: fastapi-expert
description: Use when building high-performance async Python APIs with FastAPI and Pydantic V2. Invoke for async SQLAlchemy, JWT authentication, WebSockets, OpenAPI documentation.
---

# FastAPI Expert

## Overview

Senior FastAPI specialist with deep expertise in async Python, Pydantic V2, and production-grade API development. 10+ years API development experience.

## When to Use

- Building REST APIs with FastAPI
- Implementing Pydantic V2 validation schemas
- Setting up async database operations
- Implementing JWT authentication/authorization
- Creating WebSocket endpoints
- Optimizing API performance

## Core Workflow

1. **Analyze requirements** — Endpoints, data models, auth needs
2. **Design schemas** — Pydantic V2 model validation
3. **Implement** — Async endpoints with dependency injection
4. **Secure** — Authentication, authorization, rate limiting
5. **Test** — pytest + httpx async tests

## Pydantic V2 Key Changes

```python
# ✅ V2 syntax
from pydantic import BaseModel, field_validator, model_config

class UserCreate(BaseModel):
    model_config = model_config(strict=True)

    email: str
    password: str
    age: int | None = None  # Use X | None instead of Optional[X]

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if '@' not in v:
            raise ValueError('Invalid email')
        return v.lower()

# ❌ V1 syntax (don't use)
# class Config:
# @validator('email')
# Optional[str]
```

## Constraints

### MUST DO
- Type hints everywhere (FastAPI requires them)
- Use Pydantic V2 syntax
- Use `Annotated` pattern for dependency injection
- async/await for all I/O operations
- Return proper HTTP status codes
- Document endpoints (auto-generated OpenAPI)

### MUST NOT
- Use synchronous database operations
- Skip Pydantic validation
- Store passwords in plain text
- Expose sensitive data in responses
- Use Pydantic V1 syntax
- Mix sync and async code improperly
- Hardcode configuration values

## Knowledge Reference

FastAPI, Pydantic V2, async SQLAlchemy, Alembic migrations, JWT/OAuth2, pytest-asyncio, httpx, BackgroundTasks, WebSockets, dependency injection, OpenAPI/Swagger

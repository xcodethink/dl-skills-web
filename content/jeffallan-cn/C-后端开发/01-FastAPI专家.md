> 来源：[Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | 分类：后端编码

---
name: fastapi-expert
description: Use when building high-performance async Python APIs with FastAPI and Pydantic V2. Invoke for async SQLAlchemy, JWT authentication, WebSockets, OpenAPI documentation.
---

# FastAPI 专家（FastAPI Expert）

## 概述

资深 FastAPI 专家技能，深入掌握异步 Python、Pydantic V2 和生产级 API 开发。10 年以上 API 开发经验。

## 何时使用

- 使用 FastAPI 构建 REST API
- 实现 Pydantic V2 验证 Schema
- 设置异步数据库操作
- 实现 JWT 认证/授权
- 创建 WebSocket 端点
- 优化 API 性能

## 核心工作流

1. **分析需求** — 端点、数据模型、认证需求
2. **设计 Schema** — Pydantic V2 模型验证
3. **实现** — 异步端点 + 依赖注入
4. **安全加固** — 认证、授权、速率限制
5. **测试** — pytest + httpx 异步测试

## Pydantic V2 关键变化

```python
# ✅ V2 语法
from pydantic import BaseModel, field_validator, model_config

class UserCreate(BaseModel):
    model_config = model_config(strict=True)

    email: str
    password: str
    age: int | None = None  # 用 X | None 替代 Optional[X]

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if '@' not in v:
            raise ValueError('Invalid email')
        return v.lower()

# ❌ V1 语法（不要用）
# class Config:
# @validator('email')
# Optional[str]
```

## 铁律

### 必须做

- 所有地方用类型提示（FastAPI 依赖它们）
- 用 Pydantic V2 语法
- 用 `Annotated` 模式做依赖注入
- 所有 I/O 操作用 async/await
- 返回正确的 HTTP 状态码
- 文档化端点（自动生成 OpenAPI）

### 绝不做

- 用同步数据库操作
- 跳过 Pydantic 验证
- 明文存储密码
- 响应中暴露敏感数据
- 用 Pydantic V1 语法
- 混用 sync 和 async 代码
- 硬编码配置值

## 知识库

FastAPI、Pydantic V2、async SQLAlchemy、Alembic 迁移、JWT/OAuth2、pytest-asyncio、httpx、BackgroundTasks、WebSockets、依赖注入、OpenAPI/Swagger

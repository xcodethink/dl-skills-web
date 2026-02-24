> 来源：[Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | 分类：后端编码

---
name: api-design-standards
description: Use when designing REST APIs to ensure consistent resource modeling, endpoint patterns, error handling, and OpenAPI specifications.
---

# API 设计规范（API Design Standards）

## 概述

优秀的 API 不是写出来的，是设计出来的。糟糕的 API 一旦发布就很难修改——客户端已经依赖了你的错误。本技能提供一套从领域分析到版本演进的完整 API 设计工作流，确保每个端点都经过深思熟虑。

## 何时使用

- 从零设计 REST API
- 为现有服务编写 OpenAPI 规范
- 统一团队的 API 设计标准
- 审查 API 端点设计是否合理

## 五步设计工作流

| 步骤 | 动作 | 输出 |
|------|------|------|
| 1. 分析领域 | 理解业务需求、数据模型、客户端场景 | 领域模型文档 |
| 2. 建模资源 | 识别资源（Resource）、关系、支持的操作 | 资源关系图 |
| 3. 设计端点 | 定义 URI 模式、HTTP 方法、请求/响应结构 | 端点规格表 |
| 4. 约定契约 | 编写完整的 OpenAPI 3.1 规范 | openapi.yaml |
| 5. 规划演进 | 设计版本策略、废弃流程、向后兼容方案 | 版本演进计划 |

## REST 核心原则

- **资源导向 URI**：URI 表示资源（名词），不表示动作（动词）
- **正确使用 HTTP 方法**：GET 读取 / POST 创建 / PUT 全量替换 / PATCH 部分更新 / DELETE 删除
- **状态码语义**：200 成功 / 201 已创建 / 204 无内容 / 400 客户端错误 / 401 未认证 / 403 无权限 / 404 未找到 / 409 冲突 / 429 限流 / 500 服务端错误

## 命名约定

选择 `snake_case` 或 `camelCase`，全项目统一，不混用。推荐：JSON 响应体使用 `camelCase`（与 JavaScript 生态一致），查询参数使用 `snake_case`（URL 可读性更好）。

```
GET /api/v1/users/{user_id}/orders?sort_by=created_at&page_size=20
```

## 分页模式

| 模式 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| 游标分页（Cursor） | 实时数据流、无限滚动 | 性能稳定、无跳页问题 | 不能跳到任意页 |
| 偏移分页（Offset） | 后台管理、需要跳页 | 实现简单、支持跳页 | 大数据集性能差 |
| 键集分页（Keyset） | 有序大数据集 | 高性能、一致性好 | 只能前进/后退 |

推荐默认使用游标分页（Cursor-based），只在明确需要跳页时使用偏移分页。

## 错误响应标准

采用 RFC 7807 Problem Details 格式：

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

## 版本策略

| 方式 | 示例 | 适用场景 |
|------|------|----------|
| URI 版本 | `/v1/users` | 简单直观，大多数公开 API 推荐 |
| Header 版本 | `Accept: application/vnd.api+json;version=1` | 内部 API、需要干净 URI |

推荐公开 API 使用 URI 版本，内部微服务使用 Header 版本。

## 认证方案

采用 OAuth 2.0 + JWT（JSON Web Token）：

1. 客户端用凭证换取 Access Token（短生命周期）和 Refresh Token（长生命周期）
2. 请求头携带 `Authorization: Bearer <token>`
3. Access Token 过期后用 Refresh Token 静默刷新
4. 敏感操作要求二次验证

## 必须做 / 禁止做

**必须做（MUST DO）：**
- 命名约定全局统一（snake_case 或 camelCase，选一个）
- 编写完整的 OpenAPI 3.1 规范文档
- 集合端点必须支持分页
- 实施速率限制（Rate Limiting），返回 `429` 和 `Retry-After` 头
- 所有端点提供请求/响应示例

**禁止做（MUST NOT）：**
- URI 中使用动词（`/getUser` 应改为 `/users/{id}`）
- 不同端点返回不同格式的响应结构
- 在 API 响应中暴露内部实现细节（数据库字段名、内部 ID 格式）
- 没有迁移方案就引入破坏性变更（Breaking Changes）
- 跳过错误码文档

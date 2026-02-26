> 来源：[prisma/skills](https://github.com/prisma/skills) | 分类：后端编码 | ⭐ Prisma 官方

---
name: prisma-postgres
description: Prisma Postgres setup and operations guidance across Console, create-db CLI, Management API, and Management API SDK. Use when creating Prisma Postgres databases, working in Prisma Console, provisioning with create-db, or integrating programmatic provisioning.
---

# Prisma Postgres 管理指南（Prisma Postgres）

## 概述

Prisma Postgres 是 Prisma 提供的托管 Serverless PostgreSQL 数据库服务。本指南涵盖通过控制台（Console）、CLI 工具（`create-db`）、管理 API（Management API）和 SDK 进行数据库的创建、管理和集成。

## 适用场景

- 通过 Prisma Console 创建和管理 Prisma Postgres
- 使用 `create-db` 快速创建即时临时数据库
- 通过 Management API 程序化管理资源
- 使用 `@prisma/management-api-sdk` 进行类型安全的集成
- 处理认领 URL（Claim URL）、连接字符串、区域和认证流程

## 规则优先级

| 优先级 | 分类 | 影响程度 | 前缀 |
|--------|------|----------|------|
| 1 | CLI 创建 | 关键 | `create-db-cli` |
| 2 | 管理 API | 关键 | `management-api` |
| 3 | 管理 API SDK | 高 | `management-api-sdk` |
| 4 | 控制台和连接 | 高 | `console-and-connections` |

## 核心工作流

### 工作流 1：控制台优先

使用 Prisma Console 进行手动设置和操作：

1. 打开 `https://console.prisma.io`
2. 创建/选择工作区（Workspace）和项目（Project）
3. 使用项目侧边栏中的 Studio 查看/编辑数据
4. 从项目 UI 获取直连信息

### 工作流 2：使用 create-db 快速创建

需要立即获取数据库时使用 `create-db`：

```bash
npx create-db@latest
```

别名（Aliases）：

```bash
npx create-pg@latest
npx create-postgres@latest
```

#### 创建选项

| 标志 | 简写 | 说明 |
|------|------|------|
| `--region [string]` | `-r` | 区域选择：`ap-southeast-1`、`ap-northeast-1`、`eu-central-1`、`eu-west-3`、`us-east-1`、`us-west-1` |
| `--interactive [boolean]` | `-i` | 打开区域选择器 |
| `--json [boolean]` | `-j` | 输出机器可读的 JSON |
| `--env [string]` | `-e` | 将 `DATABASE_URL` 和 `CLAIM_URL` 写入目标 `.env` 文件 |

#### 生命周期和认领流程

- 数据库默认为临时的
- 未认领的数据库约 24 小时后自动删除
- 使用命令输出中显示的 URL 认领数据库以永久保留

#### 常见使用模式

```bash
# 快速创建数据库
npx create-db@latest

# 指定区域创建
npx create-db@latest --region eu-central-1

# 交互式区域选择
npx create-db@latest --interactive

# 将环境变量写入 .env 文件（用于应用启动）
npx create-db@latest --env .env

# CI 友好的 JSON 输出
npx create-db@latest --json
```

#### 程序化使用（库 API）

也可以在 Node.js/Bun 中以编程方式使用 `create-db`：

```bash
npm install create-db
```

```typescript
import { create, isDatabaseSuccess, isDatabaseError } from "create-db";

const result = await create({
  region: "us-east-1",
  userAgent: "my-app/1.0.0",
});

if (isDatabaseSuccess(result)) {
  console.log(result.connectionString);  // 连接字符串
  console.log(result.claimUrl);          // 认领 URL
  console.log(result.deletionDate);      // 删除日期
}

if (isDatabaseError(result)) {
  console.error(result.error, result.message);
}
```

列出可用区域：

```typescript
import { regions } from "create-db";

const available = await regions();
console.log(available);
```

### 工作流 3：Management API 程序化管理

**基础 URL：**

```
https://api.prisma.io/v1
```

**API 探索：**

- OpenAPI 文档：`https://api.prisma.io/v1/doc`
- Swagger 编辑器：`https://api.prisma.io/v1/swagger-editor`

#### 认证方式

| 方式 | 适用场景 |
|------|----------|
| 服务令牌（Service Token） | 在自己的工作区中进行服务器到服务器操作 |
| OAuth 2.0 | 代表用户在不同工作区中操作 |

#### 服务令牌流程

1. 在 Prisma Console 工作区设置中创建令牌
2. 以 Bearer 认证方式发送令牌：

```
Authorization: Bearer $TOKEN
```

#### OAuth 流程摘要

1. 将用户重定向到 `https://auth.prisma.io/authorize`，附带 `client_id`、`redirect_uri`、`response_type=code` 和作用域（scopes）
2. 在回调中接收 `code`
3. 在 `https://auth.prisma.io/token` 交换 code
4. 使用返回的访问令牌（Access Token）进行 Management API 请求

#### 常用端点

- `GET /workspaces` — 获取工作区列表
- `GET /projects` — 获取项目列表
- `POST /projects` — 创建新项目
- 数据库管理端点位于 project/database 路径下

### 工作流 4：Management API SDK（类型安全集成）

安装：

```bash
npm install @prisma/management-api-sdk
```

使用方式：

- `createManagementApiClient` — 用于已有令牌
- `createManagementApiSdk` — 用于 OAuth + 令牌刷新

## 连接配置

### Prisma Postgres 客户端实例化

```typescript
import { PrismaClient } from '../generated/client'
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'

const prisma = new PrismaClient({
  adapter: new PrismaPostgresAdapter({
    connectionString: process.env.PRISMA_DIRECT_TCP_URL,
  }),
})
```

### prisma.config.ts 配置

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

## 本地开发

使用 `prisma dev` 启动本地 Prisma Postgres，方便本地开发：

```bash
# 启动本地数据库
prisma dev

# 后台运行
prisma dev --detach

# 管理实例
prisma dev ls
prisma dev stop myproject
prisma dev rm myproject
```

准备就绪后，切换到 Prisma Postgres 云版本：

```bash
prisma init --db
```

更新 `DATABASE_URL` 为云连接字符串即可。

## 参考资源

- [npx create-db 文档](https://www.prisma.io/docs/postgres/introduction/npx-create-db)
- [Management API 文档](https://www.prisma.io/docs/postgres/introduction/management-api)
- [OpenAPI 文档](https://api.prisma.io/v1/doc)
- [Swagger 编辑器](https://api.prisma.io/v1/swagger-editor)

> 来源：[prisma/skills](https://github.com/prisma/skills) | 分类：后端编码 | ⭐ Prisma 官方

---
name: prisma-cli
description: Prisma CLI commands reference covering all available commands, options, and usage patterns. Use when running Prisma CLI commands, setting up projects, generating client, running migrations, or managing databases.
---

# Prisma CLI 命令参考（Prisma CLI Reference）

## 概述

Prisma CLI 是 Prisma ORM 的核心命令行工具，涵盖项目初始化、客户端生成、数据库迁移、本地开发等全部工作流。本文档基于 Prisma ORM 7.x 版本，包含所有命令的用法、选项和最佳实践。

## 适用场景

- 初始化新的 Prisma 项目（`prisma init`）
- 生成 Prisma Client（`prisma generate`）
- 执行数据库迁移（`prisma migrate`）
- 管理数据库状态（`prisma db push/pull`）
- 使用本地开发数据库（`prisma dev`）
- 调试 Prisma 问题（`prisma debug`）

## 命令分类总览

| 分类 | 命令 | 用途 |
|------|------|------|
| 项目初始化 | `init` | 引导创建新的 Prisma 项目 |
| 客户端生成 | `generate` | 生成 Prisma Client |
| 校验格式 | `validate`, `format` | Schema 校验与格式化 |
| 本地开发 | `dev` | 启动本地 Prisma Postgres 开发数据库 |
| 数据库操作 | `db pull`, `db push`, `db seed`, `db execute` | 直接数据库操作 |
| 迁移管理 | `migrate dev`, `migrate deploy`, `migrate reset`, `migrate status`, `migrate diff`, `migrate resolve` | Schema 迁移 |
| 工具类 | `studio`, `version`, `debug` | 开发辅助工具 |

## 规则优先级

| 优先级 | 分类 | 影响程度 | 前缀 |
|--------|------|----------|------|
| 1 | 项目初始化 | 高 | `init` |
| 2 | 客户端生成 | 高 | `generate` |
| 3 | 本地开发 | 高 | `dev` |
| 4 | 数据库操作 | 高 | `db-` |
| 5 | 迁移管理 | 关键 | `migrate-` |
| 6 | 工具类 | 中 | `studio`, `validate`, `format`, `debug` |

## 项目初始化

```bash
# 初始化新项目（创建 prisma/ 目录和 prisma.config.ts）
prisma init

# 指定数据库类型初始化
prisma init --datasource-provider postgresql
prisma init --datasource-provider mysql
prisma init --datasource-provider sqlite

# 使用 Prisma Postgres 云数据库初始化
prisma init --db

# 使用 AI 生成 Schema
prisma init --prompt "E-commerce app with users, products, orders"
```

### 初始化创建的文件

- `prisma/schema.prisma` — Prisma Schema 文件
- `prisma.config.ts` — Prisma CLI 的 TypeScript 配置文件
- `.env` — 环境变量（DATABASE_URL）
- `.gitignore` — 忽略 node_modules、.env 和生成文件

### 初始化选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--datasource-provider` | 数据库提供者：`postgresql`, `mysql`, `sqlite`, `sqlserver`, `mongodb`, `cockroachdb` | `postgresql` |
| `--db` | 在 Prisma Data Platform 上创建托管的 Prisma Postgres 数据库 | - |
| `--url` | 自定义数据源 URL | - |
| `--generator-provider` | 指定生成器提供者 | `prisma-client` |
| `--output` | 指定 Prisma Client 生成器输出路径 | - |
| `--with-model` | 在 Schema 中添加示例模型 | - |
| `--prompt` | AI 生成 Schema 描述 | - |

### 生成的 Schema（v7）

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated"
}

datasource db {
  provider = "postgresql"
}
```

### 生成的配置文件（v7）

```typescript
// prisma.config.ts
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

## 客户端生成

```bash
# 生成 Prisma Client
prisma generate

# 监听模式（开发用）
prisma generate --watch

# 不包含引擎（用于 Accelerate/边缘环境）
prisma generate --no-engine

# 仅生成指定的生成器
prisma generate --generator client

# 生成多个生成器
prisma generate --generator client --generator zod_schemas

# 生成类型安全的 SQL 模块
prisma generate --sql
```

### 生成选项

| 选项 | 说明 |
|------|------|
| `--schema` | 自定义 Schema 路径 |
| `--config` | 自定义配置文件路径 |
| `--sql` | 生成类型安全的 SQL 模块 |
| `--watch` | 监听 Schema 变化并自动重新生成 |
| `--generator` | 指定要使用的生成器（可多次指定） |
| `--no-hints` | 隐藏提示信息，仅输出错误和警告 |

### v7 关键变化

- 生成器提供者（provider）必须为 `prisma-client`
- `output` 字段现在是**必需的** — Client 不再生成到 `node_modules`
- 生成后需更新导入路径：

```typescript
// 之前（v6）
import { PrismaClient } from '@prisma/client'

// 之后（v7）
import { PrismaClient } from '../generated/client'
```

### 多生成器配置

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated"
}

generator zod {
  provider = "zod-prisma-types"
  output   = "../generated/zod"
}
```

## 本地开发数据库

```bash
# 启动本地 Prisma Postgres
prisma dev

# 指定名称启动
prisma dev --name myproject

# 后台运行（分离模式）
prisma dev --detach

# 列出所有本地实例
prisma dev ls

# 停止实例
prisma dev stop myproject

# 删除实例数据
prisma dev rm myproject

# 强制删除（先停止再删除）
prisma dev rm myproject --force
```

### 本地开发选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--name` / `-n` | 数据库实例名称 | `default` |
| `--port` / `-p` | HTTP 服务端口 | `51213` |
| `--db-port` / `-P` | 数据库服务端口 | `51214` |
| `--shadow-db-port` | 影子数据库（Shadow Database）端口（用于迁移） | `51215` |
| `--detach` / `-d` | 后台运行 | `false` |
| `--debug` | 启用调试日志 | `false` |

### 交互模式快捷键

- `q` — 退出
- `h` — 显示 HTTP URL
- `t` — 显示 TCP URL

## 数据库操作

```bash
# 从现有数据库拉取 Schema
prisma db pull

# 将 Schema 推送到数据库（不创建迁移）
prisma db push

# 执行数据库种子（Seed）填充
prisma db seed

# 执行原始 SQL
prisma db execute --file ./script.sql
```

## 迁移管理（开发环境）

```bash
# 创建并应用迁移
prisma migrate dev

# 创建带名称的迁移
prisma migrate dev --name add_users_table

# 仅创建迁移不应用
prisma migrate dev --create-only

# 重置数据库并应用所有迁移
prisma migrate reset
```

### 迁移开发选项

| 选项 | 说明 |
|------|------|
| `--name` / `-n` | 为迁移命名 |
| `--create-only` | 仅创建迁移文件，不应用到数据库 |
| `--schema` | 自定义 Schema 路径 |
| `--config` | 自定义配置文件路径 |

### v7 中已移除的标志

- `--skip-generate` — 从 `migrate dev` 和 `db push` 中移除，需显式运行 `prisma generate`
- `--skip-seed` — 从 `migrate dev` 中移除，需显式运行 `prisma db seed`
- `--schema` 和 `--url` — 从 `db execute` 中移除

### v7 完整工作流

```bash
prisma migrate dev --name my_migration
prisma generate  # v7 中必须显式运行
prisma db seed   # v7 中必须显式运行
```

### 迁移文件结构

```
prisma/migrations/
├── 20240115120000_add_users_table/
│   └── migration.sql
├── 20240116090000_add_posts/
│   └── migration.sql
└── migration_lock.toml
```

### Schema 漂移检测（Drift Detection）

如果 `migrate dev` 检测到漂移（手动修改数据库或编辑了迁移文件），会提示重置：

```
Drift detected: Your database schema is not in sync.

Do you want to reset your database? All data will be lost.
```

### 影子数据库（Shadow Database）

`migrate dev` 需要影子数据库用于漂移检测。在 `prisma.config.ts` 中配置：

```typescript
export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
    shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
})
```

使用本地 Prisma Postgres（`prisma dev`）时，影子数据库会自动处理。

## 迁移管理（生产环境）

```bash
# 应用待处理的迁移（CI/CD）
prisma migrate deploy

# 检查迁移状态
prisma migrate status

# 比较 Schema 并生成差异
prisma migrate diff --from-config-datasource --to-schema schema.prisma --script
```

## 工具命令

```bash
# 打开 Prisma Studio（数据库 GUI）
prisma studio

# 显示版本信息
prisma version
prisma -v

# 调试信息
prisma debug

# 校验 Schema
prisma validate

# 格式化 Schema
prisma format
```

## Bun 运行时

使用 Bun 时，务必添加 `--bun` 标志，确保 Prisma 以 Bun 运行时执行（否则会因 CLI shebang 回退到 Node.js）：

```bash
bunx --bun prisma init
bunx --bun prisma generate
bunx --bun prisma migrate dev
```

## Prisma 7 配置文件

Prisma 7 使用 `prisma.config.ts` 进行 CLI 配置：

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

### 环境变量

v7 中环境变量不再自动加载，需使用 `dotenv`：

```typescript
// prisma.config.ts
import 'dotenv/config'
```

## 附录：命令速查表

| 命令 | 用途 | 适用环境 |
|------|------|----------|
| `prisma init` | 初始化项目 | 开发 |
| `prisma generate` | 生成 Client | 开发/CI |
| `prisma dev` | 本地开发数据库 | 开发 |
| `prisma db pull` | 拉取数据库 Schema | 开发 |
| `prisma db push` | 推送 Schema 到数据库 | 开发/原型 |
| `prisma db seed` | 填充种子数据 | 开发 |
| `prisma db execute` | 执行原始 SQL | 开发/运维 |
| `prisma migrate dev` | 开发环境迁移 | 开发 |
| `prisma migrate deploy` | 生产环境迁移 | 生产/CI |
| `prisma migrate reset` | 重置数据库 | 开发 |
| `prisma migrate status` | 检查迁移状态 | 开发/生产 |
| `prisma migrate diff` | Schema 差异比较 | 开发/CI |
| `prisma studio` | 数据库 GUI | 开发 |
| `prisma validate` | 校验 Schema | 开发/CI |
| `prisma format` | 格式化 Schema | 开发 |
| `prisma debug` | 调试信息 | 开发 |

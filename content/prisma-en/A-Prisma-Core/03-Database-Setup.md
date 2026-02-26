> Source: [prisma/skills](https://github.com/prisma/skills) | Category: Backend | ⭐ Prisma Official

---
name: prisma-database-setup
description: Guides for configuring Prisma with different database providers (PostgreSQL, MySQL, SQLite, MongoDB, etc.). Use when setting up a new project, changing databases, or troubleshooting connection issues.
---

# Prisma Database Setup

## Overview

Configuration guides for Prisma ORM with various database providers. Covers PostgreSQL, MySQL, SQLite, SQL Server, CockroachDB, and Prisma Postgres, including driver adapter setup required in Prisma v7.

## System Requirements (Prisma ORM 7)

- **Node.js 20.19.0+**
- **TypeScript 5.4.0+**

## Supported Databases

| Database | Provider | Notes |
|----------|----------|-------|
| PostgreSQL | `postgresql` | Default, full feature support |
| MySQL | `mysql` | Widespread support, some JSON diffs |
| SQLite | `sqlite` | File-based, no enum/scalar lists |
| MongoDB | `mongodb` | **NOT SUPPORTED IN v7** (use v6) |
| SQL Server | `sqlserver` | Microsoft ecosystem |
| CockroachDB | `cockroachdb` | Distributed SQL, Postgres-compatible |
| Prisma Postgres | `postgresql` | Managed serverless database |

## Driver Adapters (Required in v7)

Prisma ORM 7 uses the query compiler by default, which **requires a driver adapter**.

| Database | Adapter | JS Driver |
|----------|---------|-----------|
| PostgreSQL | `@prisma/adapter-pg` | `pg` |
| CockroachDB | `@prisma/adapter-pg` | `pg` |
| Prisma Postgres | `@prisma/adapter-ppg` | `@prisma/ppg` |
| MySQL / MariaDB | `@prisma/adapter-mariadb` | `mariadb` |
| SQLite | `@prisma/adapter-better-sqlite3` | `better-sqlite3` |
| SQLite (Turso/LibSQL) | `@prisma/adapter-libsql` | `@libsql/client` |
| SQL Server | `@prisma/adapter-mssql` | `node-mssql` |

## Client Setup (Required)

### 1. Install packages

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### 2. Add generator block (output is required in v7)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated"
}
```

### 3. Generate and instantiate

```bash
npx prisma generate
```

```typescript
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

Re-run `prisma generate` after every schema change.

## Database-Specific Configuration

### PostgreSQL

```prisma
datasource db {
  provider = "postgresql"
}
```

```typescript
import { PrismaPg } from '@prisma/adapter-pg'
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

### MySQL

```prisma
datasource db {
  provider = "mysql"
}
```

```typescript
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  connectionLimit: 5,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})
const prisma = new PrismaClient({ adapter })
```

### SQLite

```prisma
datasource db {
  provider = "sqlite"
}
```

```typescript
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
})
const prisma = new PrismaClient({ adapter })
```

### SQL Server

```prisma
datasource db {
  provider = "sqlserver"
}
```

```typescript
import { PrismaMssql } from '@prisma/adapter-mssql'
const adapter = new PrismaMssql({
  server: 'localhost',
  port: 1433,
  database: 'mydb',
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  options: { encrypt: true, trustServerCertificate: true },
})
const prisma = new PrismaClient({ adapter })
```

### Prisma Postgres

```prisma
datasource db {
  provider = "postgresql"
}
```

```typescript
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'
const prisma = new PrismaClient({
  adapter: new PrismaPostgresAdapter({
    connectionString: process.env.PRISMA_DIRECT_TCP_URL,
  }),
})
```

### Neon (Serverless PostgreSQL)

```typescript
import { PrismaNeon } from '@prisma/adapter-neon'
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL
})
const prisma = new PrismaClient({ adapter })
```

## Configuration Files

### prisma.config.ts

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
    directUrl: env('DIRECT_URL'),
    shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
})
```

## Bun Runtime

Run Prisma CLI with `bunx --bun` to ensure Bun runtime:

```bash
bunx --bun prisma init
bunx --bun prisma generate
```

## Adapter Installation Quick Reference

```bash
# PostgreSQL
npm install @prisma/adapter-pg

# MySQL / MariaDB
npm install @prisma/adapter-mariadb mariadb

# SQLite
npm install @prisma/adapter-better-sqlite3

# Prisma Postgres
npm install @prisma/adapter-ppg @prisma/ppg

# SQL Server
npm install @prisma/adapter-mssql mssql

# Neon
npm install @prisma/adapter-neon

# Turso/LibSQL
npm install @prisma/adapter-libsql @libsql/client
```

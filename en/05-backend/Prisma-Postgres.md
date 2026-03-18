> Source: [prisma/skills](https://github.com/prisma/skills) | Category: Backend | ⭐ Prisma Official

---
name: prisma-postgres
description: Prisma Postgres setup and operations guidance across Console, create-db CLI, Management API, and Management API SDK. Use when creating Prisma Postgres databases, working in Prisma Console, provisioning with create-db, or integrating programmatic provisioning.
---

# Prisma Postgres

## Overview

Guide for creating, managing, and integrating Prisma Postgres -- a managed serverless PostgreSQL service. Covers Console workflows, instant CLI provisioning with `create-db`, the Management API for programmatic control, and the typed SDK.

## Core Workflows

### 1. Console-First

- Open `https://console.prisma.io`
- Create/select workspace and project
- Use Studio to view/edit data
- Retrieve connection details from project UI

### 2. Quick Provisioning with create-db

Fastest way to get a working database:

```bash
npx create-db@latest
```

Aliases: `npx create-pg@latest` / `npx create-postgres@latest`

#### Options

| Flag | Short | Description |
|------|-------|-------------|
| `--region [string]` | `-r` | Region: `ap-southeast-1`, `ap-northeast-1`, `eu-central-1`, `eu-west-3`, `us-east-1`, `us-west-1` |
| `--interactive` | `-i` | Open region selector |
| `--json` | `-j` | Machine-readable JSON output |
| `--env [string]` | `-e` | Write `DATABASE_URL` and `CLAIM_URL` to target `.env` |

#### Lifecycle

- Databases are temporary by default
- Unclaimed databases auto-delete after ~24 hours
- Claim via the URL in command output to keep permanently

#### Common Patterns

```bash
# Quick database
npx create-db@latest

# Region-specific
npx create-db@latest --region eu-central-1

# Interactive region selection
npx create-db@latest --interactive

# Write env vars for app bootstrap
npx create-db@latest --env .env

# CI-friendly output
npx create-db@latest --json
```

#### Programmatic Usage (Library API)

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
  console.log(result.connectionString);
  console.log(result.claimUrl);
  console.log(result.deletionDate);
}
```

```typescript
import { regions } from "create-db";
const available = await regions();
```

### 3. Management API

Base URL: `https://api.prisma.io/v1`

Explore: [OpenAPI docs](https://api.prisma.io/v1/doc) | [Swagger Editor](https://api.prisma.io/v1/swagger-editor)

#### Authentication

| Method | Use Case |
|--------|----------|
| Service Token | Server-to-server in your own workspace |
| OAuth 2.0 | Acting on behalf of users across workspaces |

#### Service Token

Create in Console workspace settings, send as Bearer auth:

```
Authorization: Bearer $TOKEN
```

#### OAuth Flow

1. Redirect to `https://auth.prisma.io/authorize` with `client_id`, `redirect_uri`, `response_type=code`, scopes
2. Receive `code` on callback
3. Exchange at `https://auth.prisma.io/token`
4. Use access token in API requests

#### Common Endpoints

- `GET /workspaces`
- `GET /projects`
- `POST /projects`
- Database management under project/database paths

### 4. Management API SDK

```bash
npm install @prisma/management-api-sdk
```

- `createManagementApiClient` - for existing tokens
- `createManagementApiSdk` - for OAuth + token refresh

## Connection Setup

```typescript
import { PrismaClient } from '../generated/client'
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'

const prisma = new PrismaClient({
  adapter: new PrismaPostgresAdapter({
    connectionString: process.env.PRISMA_DIRECT_TCP_URL,
  }),
})
```

## Local Development

Use `prisma dev` for a local Prisma Postgres instance:

```bash
prisma dev              # Start local database
prisma dev --detach     # Background mode
prisma dev ls           # List instances
prisma dev stop myproj  # Stop instance
```

When ready for production, switch to cloud:

```bash
prisma init --db
```

Update `DATABASE_URL` to the cloud connection string.

## Resources

- [npx create-db docs](https://www.prisma.io/docs/postgres/introduction/npx-create-db)
- [Management API docs](https://www.prisma.io/docs/postgres/introduction/management-api)
- [OpenAPI docs](https://api.prisma.io/v1/doc)

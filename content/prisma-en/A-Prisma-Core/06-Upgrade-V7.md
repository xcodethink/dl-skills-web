> Source: [prisma/skills](https://github.com/prisma/skills) | Category: Backend | ⭐ Prisma Official

---
name: prisma-upgrade-v7
description: Complete migration guide from Prisma ORM v6 to v7 covering all breaking changes. Use when upgrading Prisma versions, encountering v7 errors, or migrating existing projects.
---

# Upgrade to Prisma ORM 7

## Overview

Complete guide for migrating from Prisma ORM v6 to v7. This upgrade introduces significant breaking changes: ESM-only, required driver adapters, and a new configuration system.

## Important Notes

- **MongoDB not yet supported in v7** - continue using v6
- **Node.js 20.19.0+** required
- **TypeScript 5.4.0+** required

## Breaking Changes Summary

| Change | v6 | v7 |
|--------|----|----|
| Module format | CommonJS | ESM only |
| Generator provider | `prisma-client-js` | `prisma-client` |
| Output path | Auto (node_modules) | Required explicit |
| Driver adapters | Optional | Required |
| Config file | `.env` + schema | `prisma.config.ts` |
| Env loading | Automatic | Manual (dotenv) |
| Middleware | `$use()` | Client Extensions |
| Metrics | Preview feature | Removed |

## Quick Upgrade Commands

```bash
npm install @prisma/client@7
npm install -D prisma@7
npm install @prisma/adapter-pg    # PostgreSQL example
npm install dotenv
npx prisma generate
```

## Step-by-Step Migration

### 1. Configure ESM

**package.json:**

```json
{ "type": "module" }
```

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true
  }
}
```

Alternative: `"module": "Node16"` with `"moduleResolution": "Node16"` (requires `.js` extensions on imports).

### 2. Update Schema

```prisma
// v6
generator client {
  provider = "prisma-client-js"
}

// v7
generator client {
  provider = "prisma-client"
  output   = "../generated"
}
```

Key changes:
- `output` is now **required**
- `engineType` removed
- URLs move to `prisma.config.ts`, keep only provider in datasource block

### 3. Create prisma.config.ts

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
    shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
})
```

### 4. Install Driver Adapter

```bash
# PostgreSQL
npm install @prisma/adapter-pg

# MySQL
npm install @prisma/adapter-mariadb mariadb

# SQLite
npm install @prisma/adapter-better-sqlite3

# Prisma Postgres
npm install @prisma/adapter-ppg @prisma/ppg
```

### 5. Update Client Instantiation

```typescript
// v6
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// v7
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

### 6. Generate and Test

```bash
npx prisma generate
npx prisma migrate dev  # if needed
```

## Migrating Removed Features

### Middleware to Client Extensions

```typescript
// v6 middleware (removed)
prisma.$use(async (params, next) => {
  const result = await next(params)
  return result
})

// v7 client extensions
const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        const before = Date.now()
        const result = await query(args)
        console.log(`${model}.${operation} took ${Date.now() - before}ms`)
        return result
      },
    },
  },
})
```

### Soft Delete Pattern

```typescript
const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    user: {
      async delete({ args, query }) {
        return prisma.user.update({
          where: args.where,
          data: { deletedAt: new Date() },
        })
      },
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
    },
  },
})
```

### Metrics Replacement

```typescript
let totalQueries = 0
const prisma = new PrismaClient({ adapter }).$extends({
  client: { async $totalQueries() { return totalQueries } },
  query: {
    $allModels: {
      async $allOperations({ query, args }) {
        totalQueries += 1
        return query(args)
      },
    },
  },
})
```

### rejectOnNotFound to OrThrow

```typescript
// v6 (removed)
const prisma = new PrismaClient({ rejectOnNotFound: true })

// v7
const user = await prisma.user.findUniqueOrThrow({ where: { id: 1 } })
const user = await prisma.user.findFirstOrThrow({ where: { email: 'test@example.com' } })
```

## Removed CLI Flags

| Removed | Migration |
|---------|-----------|
| `--skip-generate` (migrate dev, db push) | Run `prisma generate` explicitly |
| `--skip-seed` (migrate dev, migrate reset) | Run `prisma db seed` explicitly |
| `--schema`, `--url` (db execute) | Configure in `prisma.config.ts` |
| `--from-url`, `--to-url` (migrate diff) | Use `--from-config-datasource` / `--to-config-datasource` |

## Framework Considerations

### Next.js

Rename `next.config.js` to `next.config.mjs`:

```javascript
export default { /* config */ }
```

### Jest

Configure for ESM or switch to Vitest (native ESM):

```json
{
  "jest": {
    "preset": "ts-jest/presets/default-esm",
    "extensionsToTreatAsEsm": [".ts"]
  }
}
```

### Singleton Pattern

```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `Cannot find module` | Check `output` path matches import, run `prisma generate` |
| `ERR_REQUIRE_ESM` | Switch from `require()` to `import` |
| `Cannot use import outside module` | Add `"type": "module"` to package.json |
| SSL certificate errors | Add `ssl: { rejectUnauthorized: false }` to adapter |
| Connection timeouts | Configure pool settings explicitly on adapter |

## Resources

- [Official v7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Driver Adapters Documentation](https://www.prisma.io/docs/orm/overview/databases/database-drivers)
- [Prisma Config Reference](https://www.prisma.io/docs/orm/reference/prisma-config-reference)

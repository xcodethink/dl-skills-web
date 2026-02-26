> Source: [prisma/skills](https://github.com/prisma/skills) | Category: Backend | ⭐ Prisma Official

---
name: prisma-cli
description: Prisma CLI commands reference covering all available commands, options, and usage patterns. Use when running Prisma CLI commands, setting up projects, generating client, running migrations, or managing databases.
---

# Prisma CLI Reference

## Overview

Complete reference for all Prisma CLI commands for Prisma ORM 7.x. Covers project setup, client generation, database migrations, local development, and utility commands.

## Command Categories

| Category | Commands | Purpose |
|----------|----------|---------|
| Setup | `init` | Bootstrap new Prisma project |
| Generation | `generate` | Generate Prisma Client |
| Validation | `validate`, `format` | Schema validation and formatting |
| Development | `dev` | Local Prisma Postgres for development |
| Database | `db pull`, `db push`, `db seed`, `db execute` | Direct database operations |
| Migrations | `migrate dev`, `migrate deploy`, `migrate reset`, `migrate status`, `migrate diff`, `migrate resolve` | Schema migrations |
| Utility | `studio`, `version`, `debug` | Development tools |

## Project Setup

```bash
# Initialize new project (creates prisma/ folder and prisma.config.ts)
prisma init

# Initialize with specific database
prisma init --datasource-provider postgresql
prisma init --datasource-provider mysql
prisma init --datasource-provider sqlite

# Initialize with Prisma Postgres (cloud)
prisma init --db

# Initialize with AI-generated schema
prisma init --prompt "E-commerce app with users, products, orders"
```

### Init Options

| Option | Description | Default |
|--------|-------------|---------|
| `--datasource-provider` | Database provider: `postgresql`, `mysql`, `sqlite`, `sqlserver`, `mongodb`, `cockroachdb` | `postgresql` |
| `--db` | Provisions a managed Prisma Postgres database | - |
| `--url` | Custom datasource URL | - |
| `--generator-provider` | Generator provider | `prisma-client` |
| `--output` | Prisma Client output path | - |
| `--with-model` | Add example model to schema | - |
| `--prompt` | AI-generated schema from description | - |

### Generated Files

- `prisma/schema.prisma` - Prisma schema file
- `prisma.config.ts` - TypeScript CLI configuration
- `.env` - Environment variables (DATABASE_URL)
- `.gitignore` - Ignores node_modules, .env, and generated files

## Client Generation

```bash
# Generate Prisma Client
prisma generate

# Watch mode for development
prisma generate --watch

# Generate without engine (for Accelerate/edge)
prisma generate --no-engine

# Specific generator only
prisma generate --generator client

# Typed SQL generation
prisma generate --sql
```

### Key v7 Changes

- Provider must be `prisma-client` (not `prisma-client-js`)
- `output` is **required** - client no longer generates to `node_modules`
- `migrate dev` no longer auto-runs `generate`

```typescript
// v6
import { PrismaClient } from '@prisma/client'

// v7
import { PrismaClient } from '../generated/client'
```

## Local Development Database

```bash
# Start local Prisma Postgres
prisma dev

# Named instance
prisma dev --name myproject

# Background mode
prisma dev --detach

# Instance management
prisma dev ls              # List all instances
prisma dev stop myproject  # Stop instance
prisma dev rm myproject    # Remove instance data
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--name` / `-n` | Instance name | `default` |
| `--port` / `-p` | HTTP server port | `51213` |
| `--db-port` / `-P` | Database port | `51214` |
| `--shadow-db-port` | Shadow database port | `51215` |
| `--detach` / `-d` | Run in background | `false` |

## Database Operations

```bash
# Pull schema from existing database
prisma db pull

# Push schema to database (no migrations)
prisma db push

# Seed database
prisma db seed

# Execute raw SQL
prisma db execute --file ./script.sql
```

## Migrations (Development)

```bash
# Create and apply migration
prisma migrate dev

# Named migration
prisma migrate dev --name add_users_table

# Create without applying (for review)
prisma migrate dev --create-only

# Reset database and apply all migrations
prisma migrate reset
```

### v7 Full Workflow

```bash
prisma migrate dev --name my_migration
prisma generate  # Must run explicitly in v7
prisma db seed   # Must run explicitly in v7
```

### Removed Flags (v7)

- `--skip-generate` removed from `migrate dev` and `db push`
- `--skip-seed` removed from `migrate dev`
- `--schema` and `--url` removed from `db execute`

### Shadow Database

Configure in `prisma.config.ts`:

```typescript
export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
    shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
})
```

For local Prisma Postgres (`prisma dev`), shadow database is handled automatically.

## Migrations (Production)

```bash
# Apply pending migrations (CI/CD)
prisma migrate deploy

# Check migration status
prisma migrate status

# Schema diff
prisma migrate diff --from-config-datasource --to-schema schema.prisma --script
```

## Utility Commands

```bash
prisma studio     # Database GUI
prisma version    # Version info
prisma debug      # Debug information
prisma validate   # Validate schema
prisma format     # Format schema
```

## Bun Runtime

Always add `--bun` flag so Prisma runs with the Bun runtime:

```bash
bunx --bun prisma init
bunx --bun prisma generate
bunx --bun prisma migrate dev
```

## Prisma 7 Configuration

```typescript
// prisma.config.ts
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

Environment variables are no longer auto-loaded. Use `import 'dotenv/config'`.

## Resources

- [Prisma CLI Reference](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)

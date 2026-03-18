> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Database Migration Patterns

## Overview

Safe, reversible database schema changes for production systems. Covers PostgreSQL-specific patterns, ORM workflows (Prisma, Drizzle, Django, golang-migrate), zero-downtime deployment strategies, and the expand-contract pattern for critical changes.

---

## Core Principles

1. **Every change is a migration** -- never alter production databases manually
2. **Forward-only in production** -- rollbacks use new forward migrations
3. **Separate schema and data migrations** -- never mix DDL and DML
4. **Test against production-sized data** -- 100-row success may be 10M-row lockout
5. **Deployed migrations are immutable** -- never edit a migration that has run

---

## Safety Checklist

- [ ] Migration has both UP and DOWN (or is marked irreversible)
- [ ] No full table locks on large tables (use concurrent operations)
- [ ] New columns are nullable or have defaults
- [ ] Indexes created concurrently
- [ ] Data backfill is a separate migration
- [ ] Tested against production data copy
- [ ] Rollback plan documented

---

## PostgreSQL Patterns

### Adding a Column Safely

```sql
-- Safe: nullable, no lock
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Safe: with default (Postgres 11+ instant, no rewrite)
ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Dangerous: NOT NULL without default (full table rewrite + lock)
ALTER TABLE users ADD COLUMN role TEXT NOT NULL;
```

### Adding an Index Without Downtime

```sql
-- Blocking (avoid on large tables):
CREATE INDEX idx_users_email ON users (email);

-- Non-blocking:
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);
-- Cannot run inside a transaction block
```

### Renaming a Column (Expand-Contract)

```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN display_name TEXT;
-- Step 2: Backfill (separate migration)
UPDATE users SET display_name = username WHERE display_name IS NULL;
-- Step 3: Deploy app reading/writing both columns
-- Step 4: Drop old column
ALTER TABLE users DROP COLUMN username;
```

### Removing a Column Safely

1. Remove all application references
2. Deploy application without the column
3. Drop column in next migration

### Large Data Migrations -- batch with SKIP LOCKED

```sql
DO $$
DECLARE
  batch_size INT := 10000;
  rows_updated INT;
BEGIN
  LOOP
    UPDATE users SET normalized_email = LOWER(email)
    WHERE id IN (
      SELECT id FROM users WHERE normalized_email IS NULL
      LIMIT batch_size FOR UPDATE SKIP LOCKED
    );
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;
    COMMIT;
  END LOOP;
END $$;
```

---

## ORM Workflows

### Prisma (TypeScript/Node.js)

```bash
npx prisma migrate dev --name add_user_avatar   # Create migration
npx prisma migrate deploy                        # Apply in production
npx prisma migrate dev --create-only --name name # Empty migration for custom SQL
npx prisma generate                              # Regenerate client
```

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  @@map("users")
  @@index([email])
}
```

### Drizzle (TypeScript/Node.js)

```bash
npx drizzle-kit generate   # Generate migration
npx drizzle-kit migrate    # Apply migrations
npx drizzle-kit push       # Push schema directly (dev only)
```

```typescript
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### Django (Python)

```bash
python manage.py makemigrations                          # Generate
python manage.py migrate                                 # Apply
python manage.py showmigrations                          # Status
python manage.py makemigrations --empty app_name -n desc # Empty for custom SQL
```

**Data migration with batch processing:**
```python
def backfill_display_names(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    batch_size = 5000
    users = User.objects.filter(display_name="")
    while users.exists():
        batch = list(users[:batch_size])
        for user in batch:
            user.display_name = user.username
        User.objects.bulk_update(batch, ["display_name"], batch_size=batch_size)
```

**SeparateDatabaseAndState** -- remove from model without dropping column:
```python
migrations.SeparateDatabaseAndState(
    state_operations=[migrations.RemoveField(model_name="user", name="legacy_field")],
    database_operations=[],
)
```

### golang-migrate (Go)

```bash
migrate create -ext sql -dir migrations -seq add_user_avatar  # Create pair
migrate -path migrations -database "$DATABASE_URL" up          # Apply
migrate -path migrations -database "$DATABASE_URL" down 1      # Rollback one
migrate -path migrations -database "$DATABASE_URL" force VER   # Fix dirty state
```

---

## Zero-Downtime Strategy (Expand-Contract)

```
Phase 1: EXPAND
  - Add new column/table (nullable or with default)
  - Deploy: app writes to BOTH old and new
  - Backfill existing data

Phase 2: MIGRATE
  - Deploy: app reads from NEW, writes to BOTH
  - Verify data consistency

Phase 3: CONTRACT
  - Deploy: app only uses NEW
  - Drop old column/table in separate migration
```

**Timeline example:**
- Day 1: Add `new_status` column; deploy app writing both
- Day 2: Run backfill migration
- Day 3: Deploy app reading only from `new_status`
- Day 7: Drop old `status` column

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Better Approach |
|-------------|-------------|-----------------|
| Manual SQL in production | No audit trail | Always use migration files |
| Editing deployed migrations | Environment drift | Create new migration |
| NOT NULL without default | Table lock + rewrite | Nullable, backfill, then constraint |
| Inline index on large table | Blocks writes | `CREATE INDEX CONCURRENTLY` |
| Schema + data in one migration | Hard to rollback | Separate migrations |
| Drop column before removing code | Application errors | Remove code first, drop next deploy |

---

**Remember**: Every database change is a migration. Separate schema from data changes. Test on production-sized data. Use expand-contract for critical changes.

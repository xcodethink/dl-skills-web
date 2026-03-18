> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# PostgreSQL Patterns

## Overview

A comprehensive reference for PostgreSQL best practices covering query optimization, schema design, indexing strategies, Row Level Security (RLS), connection management, concurrency control, and monitoring. Merges the quick-reference skill with the full database-reviewer agent workflow. Based on Supabase best practices.

---

## Index Cheat Sheet

| Query Pattern | Index Type | Example |
|--------------|------------|---------|
| `WHERE col = value` | B-tree (default) | `CREATE INDEX idx ON t (col)` |
| `WHERE col > value` | B-tree | `CREATE INDEX idx ON t (col)` |
| `WHERE a = x AND b > y` | Composite | `CREATE INDEX idx ON t (a, b)` |
| `WHERE jsonb @> '{}'` | GIN | `CREATE INDEX idx ON t USING gin (col)` |
| `WHERE tsv @@ query` | GIN | `CREATE INDEX idx ON t USING gin (col)` |
| Time-series ranges | BRIN | `CREATE INDEX idx ON t USING brin (col)` |

## Data Type Reference

| Use Case | Correct Type | Avoid |
|----------|-------------|-------|
| IDs | `bigint` | `int`, random UUID |
| Strings | `text` | `varchar(255)` |
| Timestamps | `timestamptz` | `timestamp` |
| Money | `numeric(10,2)` | `float` |
| Flags | `boolean` | `varchar`, `int` |

---

## Essential Query Patterns

**Composite Index Order** -- equality columns first, then range:
```sql
CREATE INDEX idx ON orders (status, created_at);
```

**Covering Index** -- avoid table lookups:
```sql
CREATE INDEX idx ON users (email) INCLUDE (name, created_at);
```

**Partial Index** -- smaller, faster:
```sql
CREATE INDEX idx ON users (email) WHERE deleted_at IS NULL;
```

**Optimized RLS Policy:**
```sql
CREATE POLICY policy ON orders
  USING ((SELECT auth.uid()) = user_id);  -- Wrap in SELECT!
```

**UPSERT:**
```sql
INSERT INTO settings (user_id, key, value)
VALUES (123, 'theme', 'dark')
ON CONFLICT (user_id, key)
DO UPDATE SET value = EXCLUDED.value, updated_at = now()
RETURNING *;
```

**Cursor Pagination** -- O(1) vs OFFSET's O(n):
```sql
SELECT * FROM products WHERE id > $last_id ORDER BY id LIMIT 20;
```

**Queue Processing with SKIP LOCKED** -- 10x throughput:
```sql
UPDATE jobs SET status = 'processing'
WHERE id = (
  SELECT id FROM jobs WHERE status = 'pending'
  ORDER BY created_at LIMIT 1
  FOR UPDATE SKIP LOCKED
) RETURNING *;
```

---

## Index Patterns

### Choose the Right Index Type

| Index Type | Use Case | Operators |
|------------|----------|-----------|
| **B-tree** (default) | Equality, range | `=`, `<`, `>`, `BETWEEN`, `IN` |
| **GIN** | Arrays, JSONB, full-text | `@>`, `?`, `?&`, `?\|`, `@@` |
| **BRIN** | Large time-series tables | Range queries on sorted data |
| **Hash** | Equality only | `=` |

### Composite Index Rules

- Equality columns first, then range columns
- Index `(status, created_at)` works for `WHERE status = 'pending'` and `WHERE status = 'pending' AND created_at > '...'`
- Does NOT work for `WHERE created_at > '...'` alone (leftmost prefix rule)

### Covering Indexes -- 2-5x faster by avoiding table lookups

```sql
CREATE INDEX users_email_idx ON users (email) INCLUDE (name, created_at);
```

### Partial Indexes -- 5-20x smaller

```sql
CREATE INDEX users_active_email_idx ON users (email) WHERE deleted_at IS NULL;
```

---

## Schema Design

### Data Types

```sql
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  balance numeric(10,2)
);
```

### Primary Key Strategy

- **Single database:** `bigint GENERATED ALWAYS AS IDENTITY` (recommended)
- **Distributed systems:** UUIDv7 (time-ordered)
- **Avoid:** Random UUIDs (cause index fragmentation)

### Table Partitioning (for tables > 100M rows)

```sql
CREATE TABLE events (
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz NOT NULL,
  data jsonb
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2024_01 PARTITION OF events
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

---

## Security & Row Level Security

### Enable RLS for Multi-Tenant Data

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

CREATE POLICY orders_user_policy ON orders
  FOR ALL
  USING ((SELECT auth.uid()) = user_id);  -- SELECT wrapper = 100x faster
```

### Least Privilege Access

```sql
CREATE ROLE app_readonly NOLOGIN;
GRANT USAGE ON SCHEMA public TO app_readonly;
GRANT SELECT ON public.products, public.categories TO app_readonly;

REVOKE ALL ON SCHEMA public FROM public;
```

---

## Connection Management

**Connection limit formula:** `(RAM_MB / 5MB_per_connection) - reserved`

```sql
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET work_mem = '8MB';
ALTER SYSTEM SET idle_in_transaction_session_timeout = '30s';
ALTER SYSTEM SET idle_session_timeout = '10min';
```

**Pooling modes:**
- Transaction mode: best for most apps
- Session mode: for prepared statements, temp tables
- Pool size: `(CPU_cores * 2) + spindle_count`

---

## Concurrency & Locking

**Keep transactions short** -- never hold locks during external API calls:
```sql
BEGIN;
UPDATE orders SET status = 'paid', payment_id = $1
WHERE id = $2 AND status = 'pending'
RETURNING *;
COMMIT;
```

**Prevent deadlocks** -- consistent lock ordering:
```sql
SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
```

**Batch inserts** -- 10-50x faster:
```sql
INSERT INTO events (user_id, action) VALUES
  (1, 'click'), (2, 'view'), (3, 'click');
```

**Eliminate N+1 queries:**
```sql
SELECT * FROM orders WHERE user_id = ANY(ARRAY[1, 2, 3]);
```

---

## Monitoring & Diagnostics

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Slowest queries
SELECT calls, round(mean_exec_time::numeric, 2) as mean_ms, query
FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;

-- EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE customer_id = 123;
```

| Indicator | Problem | Solution |
|-----------|---------|----------|
| `Seq Scan` on large table | Missing index | Add index on filter columns |
| `Rows Removed by Filter` high | Poor selectivity | Check WHERE clause |
| `Buffers: read >> hit` | Not cached | Increase `shared_buffers` |
| `Sort Method: external merge` | Low `work_mem` | Increase `work_mem` |

---

## JSONB & Full-Text Search

```sql
-- GIN for containment
CREATE INDEX products_attrs_gin ON products USING gin (attributes);

-- Expression index for specific keys
CREATE INDEX products_brand_idx ON products ((attributes->>'brand'));

-- Full-text search with tsvector
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))
  ) STORED;
CREATE INDEX articles_search_idx ON articles USING gin (search_vector);
```

---

## Anti-Pattern Detection Queries

```sql
-- Find unindexed foreign keys
SELECT conrelid::regclass, a.attname
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = c.conrelid AND a.attnum = ANY(i.indkey)
  );

-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC;

-- Check table bloat
SELECT relname, n_dead_tup, last_vacuum
FROM pg_stat_user_tables WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

---

## Review Checklist

- [ ] All WHERE/JOIN columns indexed
- [ ] Composite indexes in correct column order
- [ ] Proper data types (bigint, text, timestamptz, numeric)
- [ ] RLS enabled on multi-tenant tables with `(SELECT auth.uid())` pattern
- [ ] Foreign keys have indexes
- [ ] No N+1 query patterns
- [ ] EXPLAIN ANALYZE run on complex queries
- [ ] Lowercase identifiers used
- [ ] Transactions kept short

---

*Patterns adapted from [Supabase Agent Skills](https://github.com/supabase/agent-skills) under MIT license.*

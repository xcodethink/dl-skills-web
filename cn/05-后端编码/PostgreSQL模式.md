> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# PostgreSQL 模式

## 概述

PostgreSQL 数据库最佳实践的完整参考指南，涵盖查询优化（Query Optimization）、模式设计（Schema Design）、索引策略（Indexing）、安全性（Security）、连接管理（Connection Management）和并发控制（Concurrency）。基于 Supabase 最佳实践，融合了快速参考技能（Skill）和数据库审查 Agent 的完整内容。

---

## 第一部分：快速参考

### 激活场景

- 编写 SQL 查询或迁移脚本时
- 设计数据库模式时
- 排查慢查询时
- 实现行级安全（Row Level Security, RLS）时
- 配置连接池（Connection Pooling）时

### 索引速查表

| 查询模式 | 索引类型 | 示例 |
|---------|---------|------|
| `WHERE col = value` | B-tree（默认） | `CREATE INDEX idx ON t (col)` |
| `WHERE col > value` | B-tree | `CREATE INDEX idx ON t (col)` |
| `WHERE a = x AND b > y` | 复合索引（Composite） | `CREATE INDEX idx ON t (a, b)` |
| `WHERE jsonb @> '{}'` | GIN | `CREATE INDEX idx ON t USING gin (col)` |
| `WHERE tsv @@ query` | GIN | `CREATE INDEX idx ON t USING gin (col)` |
| 时间序列范围查询 | BRIN | `CREATE INDEX idx ON t USING brin (col)` |

### 数据类型速查表

| 使用场景 | 正确类型 | 避免使用 |
|---------|---------|---------|
| ID | `bigint` | `int`、随机 UUID |
| 字符串 | `text` | `varchar(255)` |
| 时间戳 | `timestamptz` | `timestamp` |
| 金额 | `numeric(10,2)` | `float` |
| 标志位 | `boolean` | `varchar`、`int` |

### 常用模式

**复合索引顺序：**
```sql
-- 等值列在前，范围列在后
CREATE INDEX idx ON orders (status, created_at);
-- 适用于: WHERE status = 'pending' AND created_at > '2024-01-01'
```

**覆盖索引（Covering Index）：**
```sql
CREATE INDEX idx ON users (email) INCLUDE (name, created_at);
-- 避免表查找，直接从索引返回 SELECT email, name, created_at
```

**部分索引（Partial Index）：**
```sql
CREATE INDEX idx ON users (email) WHERE deleted_at IS NULL;
-- 更小的索引，只包含活跃用户
```

**行级安全策略（RLS Policy，已优化）：**
```sql
CREATE POLICY policy ON orders
  USING ((SELECT auth.uid()) = user_id);  -- 用 SELECT 包裹！
```

**UPSERT（插入或更新）：**
```sql
INSERT INTO settings (user_id, key, value)
VALUES (123, 'theme', 'dark')
ON CONFLICT (user_id, key)
DO UPDATE SET value = EXCLUDED.value;
```

**游标分页（Cursor Pagination）：**
```sql
SELECT * FROM products WHERE id > $last_id ORDER BY id LIMIT 20;
-- O(1) 复杂度，对比 OFFSET 的 O(n)
```

**队列处理（Queue Processing）：**
```sql
UPDATE jobs SET status = 'processing'
WHERE id = (
  SELECT id FROM jobs WHERE status = 'pending'
  ORDER BY created_at LIMIT 1
  FOR UPDATE SKIP LOCKED
) RETURNING *;
```

### 反模式检测（Anti-Pattern Detection）

```sql
-- 查找未索引的外键
SELECT conrelid::regclass, a.attname
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = c.conrelid AND a.attnum = ANY(i.indkey)
  );

-- 查找慢查询
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC;

-- 检查表膨胀（Table Bloat）
SELECT relname, n_dead_tup, last_vacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

### 配置模板

```sql
-- 连接限制（根据 RAM 调整）
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET work_mem = '8MB';

-- 超时设置
ALTER SYSTEM SET idle_in_transaction_session_timeout = '30s';
ALTER SYSTEM SET statement_timeout = '30s';

-- 监控
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 安全默认值
REVOKE ALL ON SCHEMA public FROM public;

SELECT pg_reload_conf();
```

---

## 第二部分：数据库审查工作流（Database Reviewer Agent）

### 核心职责

1. **查询性能（Query Performance）** — 优化查询，添加合适的索引，防止全表扫描
2. **模式设计（Schema Design）** — 设计高效的模式，使用正确的数据类型和约束
3. **安全与行级安全（Security & RLS）** — 实现行级安全，最小权限访问
4. **连接管理（Connection Management）** — 配置连接池、超时和限制
5. **并发控制（Concurrency）** — 防止死锁，优化锁策略
6. **监控（Monitoring）** — 建立查询分析和性能跟踪

### 诊断命令

```bash
# 连接数据库
psql $DATABASE_URL

# 检查慢查询（需要 pg_stat_statements 扩展）
psql -c "SELECT query, mean_exec_time, calls FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# 检查表大小
psql -c "SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC;"

# 检查索引使用情况
psql -c "SELECT indexrelname, idx_scan, idx_tup_read FROM pg_stat_user_indexes ORDER BY idx_scan DESC;"

# 查找外键上缺失的索引
psql -c "SELECT conrelid::regclass, a.attname FROM pg_constraint c JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey) WHERE c.contype = 'f' AND NOT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND a.attnum = ANY(i.indkey));"

# 检查表膨胀
psql -c "SELECT relname, n_dead_tup, last_vacuum, last_autovacuum FROM pg_stat_user_tables WHERE n_dead_tup > 1000 ORDER BY n_dead_tup DESC;"
```

### 审查工作流

#### 1. 查询性能审查（关键）

对每个 SQL 查询，验证：

- **索引使用**
  - WHERE 列是否已索引？
  - JOIN 列是否已索引？
  - 索引类型是否合适（B-tree、GIN、BRIN）？
- **查询计划分析**
  - 对复杂查询运行 `EXPLAIN ANALYZE`
  - 检查大表上的顺序扫描（Seq Scan）
  - 验证行估计与实际是否匹配
- **常见问题**
  - N+1 查询模式
  - 缺失复合索引
  - 索引列顺序错误

#### 2. 模式设计审查（高优先级）

- **数据类型**
  - ID 使用 `bigint`（不是 `int`）
  - 字符串使用 `text`（不是 `varchar(n)`，除非需要约束）
  - 时间戳使用 `timestamptz`（不是 `timestamp`）
  - 金额使用 `numeric`（不是 `float`）
  - 标志位使用 `boolean`（不是 `varchar`）
- **约束**
  - 已定义主键
  - 外键带有适当的 `ON DELETE`
  - 适当位置使用 `NOT NULL`
  - 使用 `CHECK` 约束进行验证
- **命名**
  - 使用 `lowercase_snake_case`（避免带引号的标识符）
  - 保持一致的命名模式

#### 3. 安全审查（关键）

- **行级安全（RLS）**
  - 多租户表是否启用了 RLS？
  - 策略是否使用 `(SELECT auth.uid())` 模式？
  - RLS 列是否已索引？
- **权限**
  - 是否遵循最小权限原则？
  - 是否没有给应用用户 `GRANT ALL`？
  - 是否已撤销 public schema 的权限？
- **数据保护**
  - 敏感数据是否加密？
  - PII 访问是否有日志记录？

---

## 第三部分：索引模式详解

### 1. 在 WHERE 和 JOIN 列上添加索引

**影响：** 大表上查询速度提升 100-1000 倍

```sql
-- 错误：外键上没有索引
CREATE TABLE orders (
  id bigint PRIMARY KEY,
  customer_id bigint REFERENCES customers(id)
  -- 缺少索引！
);

-- 正确：外键上有索引
CREATE TABLE orders (
  id bigint PRIMARY KEY,
  customer_id bigint REFERENCES customers(id)
);
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
```

### 2. 选择正确的索引类型

| 索引类型 | 使用场景 | 运算符 |
|---------|---------|-------|
| **B-tree**（默认） | 等值、范围查询 | `=`、`<`、`>`、`BETWEEN`、`IN` |
| **GIN** | 数组、JSONB、全文搜索 | `@>`、`?`、`?&`、`?\|`、`@@` |
| **BRIN** | 大型时间序列表 | 有序数据上的范围查询 |
| **Hash** | 仅等值查询 | `=`（比 B-tree 略快） |

```sql
-- 错误：对 JSONB 包含运算使用 B-tree
CREATE INDEX products_attrs_idx ON products (attributes);
SELECT * FROM products WHERE attributes @> '{"color": "red"}';

-- 正确：对 JSONB 使用 GIN
CREATE INDEX products_attrs_idx ON products USING gin (attributes);
```

### 3. 多列查询的复合索引

**影响：** 多列查询速度提升 5-10 倍

```sql
-- 错误：分开的索引
CREATE INDEX orders_status_idx ON orders (status);
CREATE INDEX orders_created_idx ON orders (created_at);

-- 正确：复合索引（等值列在前，范围列在后）
CREATE INDEX orders_status_created_idx ON orders (status, created_at);
```

**最左前缀规则（Leftmost Prefix Rule）：**
- 索引 `(status, created_at)` 适用于：
  - `WHERE status = 'pending'`
  - `WHERE status = 'pending' AND created_at > '2024-01-01'`
- 不适用于：
  - 单独的 `WHERE created_at > '2024-01-01'`

### 4. 覆盖索引（仅索引扫描）

**影响：** 通过避免表查找，查询速度提升 2-5 倍

```sql
-- 错误：必须从表中获取 name
CREATE INDEX users_email_idx ON users (email);
SELECT email, name FROM users WHERE email = 'user@example.com';

-- 正确：所有列都在索引中
CREATE INDEX users_email_idx ON users (email) INCLUDE (name, created_at);
```

### 5. 筛选查询的部分索引

**影响：** 索引缩小 5-20 倍，更快的写入和查询

```sql
-- 错误：完整索引包含已删除的行
CREATE INDEX users_email_idx ON users (email);

-- 正确：部分索引排除已删除的行
CREATE INDEX users_active_email_idx ON users (email) WHERE deleted_at IS NULL;
```

**常见模式：**
- 软删除：`WHERE deleted_at IS NULL`
- 状态过滤：`WHERE status = 'pending'`
- 非空值：`WHERE sku IS NOT NULL`

---

## 第四部分：模式设计模式

### 1. 数据类型选择

```sql
-- 错误：类型选择不当
CREATE TABLE users (
  id int,                           -- 在 21 亿时溢出
  email varchar(255),               -- 人为限制
  created_at timestamp,             -- 没有时区
  is_active varchar(5),             -- 应该用布尔值
  balance float                     -- 精度丢失
);

-- 正确：合适的类型
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  balance numeric(10,2)
);
```

### 2. 主键策略

```sql
-- 单数据库：IDENTITY（默认推荐）
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY
);

-- 分布式系统：UUIDv7（按时间排序）
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;
CREATE TABLE orders (
  id uuid DEFAULT uuid_generate_v7() PRIMARY KEY
);

-- 避免：随机 UUID 导致索引碎片化
CREATE TABLE events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY  -- 插入碎片化！
);
```

### 3. 表分区（Table Partitioning）

**使用场景：** 表超过 1 亿行、时间序列数据、需要删除旧数据

```sql
-- 正确：按月分区
CREATE TABLE events (
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz NOT NULL,
  data jsonb
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2024_01 PARTITION OF events
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE events_2024_02 PARTITION OF events
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- 即时删除旧数据
DROP TABLE events_2023_01;  -- 瞬间完成，对比 DELETE 需要数小时
```

### 4. 使用小写标识符

```sql
-- 错误：带引号的混合大小写需要到处加引号
CREATE TABLE "Users" ("userId" bigint, "firstName" text);
SELECT "firstName" FROM "Users";  -- 必须加引号！

-- 正确：小写无需引号
CREATE TABLE users (user_id bigint, first_name text);
SELECT first_name FROM users;
```

---

## 第五部分：安全与行级安全（RLS）

### 1. 为多租户数据启用 RLS

**影响：** 关键 — 数据库强制的租户隔离

```sql
-- 错误：仅靠应用层过滤
SELECT * FROM orders WHERE user_id = $current_user_id;
-- Bug 意味着所有订单被暴露！

-- 正确：数据库强制的 RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

CREATE POLICY orders_user_policy ON orders
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::bigint);

-- Supabase 模式
CREATE POLICY orders_user_policy ON orders
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());
```

### 2. 优化 RLS 策略

**影响：** RLS 查询速度提升 5-10 倍

```sql
-- 错误：函数对每行调用
CREATE POLICY orders_policy ON orders
  USING (auth.uid() = user_id);  -- 100 万行就调用 100 万次！

-- 正确：用 SELECT 包裹（缓存，只调用一次）
CREATE POLICY orders_policy ON orders
  USING ((SELECT auth.uid()) = user_id);  -- 快 100 倍

-- 始终为 RLS 策略列创建索引
CREATE INDEX orders_user_id_idx ON orders (user_id);
```

### 3. 最小权限访问

```sql
-- 错误：权限过大
GRANT ALL PRIVILEGES ON ALL TABLES TO app_user;

-- 正确：最小权限
CREATE ROLE app_readonly NOLOGIN;
GRANT USAGE ON SCHEMA public TO app_readonly;
GRANT SELECT ON public.products, public.categories TO app_readonly;

CREATE ROLE app_writer NOLOGIN;
GRANT USAGE ON SCHEMA public TO app_writer;
GRANT SELECT, INSERT, UPDATE ON public.orders TO app_writer;
-- 没有 DELETE 权限

REVOKE ALL ON SCHEMA public FROM public;
```

---

## 第六部分：连接管理

### 1. 连接限制

**公式：** `(RAM_MB / 每个连接 5MB) - 预留`

```sql
-- 4GB RAM 示例
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET work_mem = '8MB';  -- 8MB * 100 = 最大 800MB
SELECT pg_reload_conf();

-- 监控连接
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
```

### 2. 空闲超时

```sql
ALTER SYSTEM SET idle_in_transaction_session_timeout = '30s';
ALTER SYSTEM SET idle_session_timeout = '10min';
SELECT pg_reload_conf();
```

### 3. 使用连接池

- **事务模式（Transaction mode）**：适合大多数应用（每次事务后连接归还）
- **会话模式（Session mode）**：适用于预处理语句、临时表
- **连接池大小**：`(CPU 核心数 * 2) + 磁盘数`

---

## 第七部分：并发与锁

### 1. 保持事务简短

```sql
-- 错误：在外部 API 调用期间持有锁
BEGIN;
SELECT * FROM orders WHERE id = 1 FOR UPDATE;
-- HTTP 调用花了 5 秒...
UPDATE orders SET status = 'paid' WHERE id = 1;
COMMIT;

-- 正确：最小锁持有时间
-- 先进行 API 调用，在事务外部
BEGIN;
UPDATE orders SET status = 'paid', payment_id = $1
WHERE id = $2 AND status = 'pending'
RETURNING *;
COMMIT;  -- 锁只持有毫秒级
```

### 2. 防止死锁（Deadlock）

```sql
-- 错误：不一致的锁顺序导致死锁
-- 事务 A：锁定行 1，然后行 2
-- 事务 B：锁定行 2，然后行 1
-- 死锁！

-- 正确：一致的锁顺序
BEGIN;
SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
-- 现在两行都已锁定，可以任意顺序更新
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

### 3. 队列使用 SKIP LOCKED

**影响：** 工作队列吞吐量提升 10 倍

```sql
-- 错误：工作线程相互等待
SELECT * FROM jobs WHERE status = 'pending' LIMIT 1 FOR UPDATE;

-- 正确：工作线程跳过已锁定的行
UPDATE jobs
SET status = 'processing', worker_id = $1, started_at = now()
WHERE id = (
  SELECT id FROM jobs
  WHERE status = 'pending'
  ORDER BY created_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
RETURNING *;
```

---

## 第八部分：数据访问模式

### 1. 批量插入

**影响：** 批量插入速度提升 10-50 倍

```sql
-- 错误：逐条插入
INSERT INTO events (user_id, action) VALUES (1, 'click');
INSERT INTO events (user_id, action) VALUES (2, 'view');
-- 1000 次网络往返

-- 正确：批量插入
INSERT INTO events (user_id, action) VALUES
  (1, 'click'),
  (2, 'view'),
  (3, 'click');
-- 1 次网络往返

-- 最佳：大数据集使用 COPY
COPY events (user_id, action) FROM '/path/to/data.csv' WITH (FORMAT csv);
```

### 2. 消除 N+1 查询

```sql
-- 错误：N+1 模式
SELECT id FROM users WHERE active = true;  -- 返回 100 个 ID
-- 然后执行 100 次查询：
SELECT * FROM orders WHERE user_id = 1;
SELECT * FROM orders WHERE user_id = 2;
-- ... 还有 98 次

-- 正确：使用 ANY 的单次查询
SELECT * FROM orders WHERE user_id = ANY(ARRAY[1, 2, 3, ...]);

-- 正确：使用 JOIN
SELECT u.id, u.name, o.*
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true;
```

### 3. 游标分页

**影响：** 无论页面深度如何，始终 O(1) 性能

```sql
-- 错误：OFFSET 随深度变慢
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 199980;
-- 扫描 200,000 行！

-- 正确：基于游标（始终快速）
SELECT * FROM products WHERE id > 199980 ORDER BY id LIMIT 20;
-- 使用索引，O(1)
```

### 4. 使用 UPSERT 实现插入或更新

```sql
-- 错误：竞态条件
SELECT * FROM settings WHERE user_id = 123 AND key = 'theme';
-- 两个线程都找不到记录，都执行插入，一个失败

-- 正确：原子 UPSERT
INSERT INTO settings (user_id, key, value)
VALUES (123, 'theme', 'dark')
ON CONFLICT (user_id, key)
DO UPDATE SET value = EXCLUDED.value, updated_at = now()
RETURNING *;
```

---

## 第九部分：监控与诊断

### 1. 启用 pg_stat_statements

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 查找最慢的查询
SELECT calls, round(mean_exec_time::numeric, 2) as mean_ms, query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- 查找最频繁的查询
SELECT calls, query
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 10;
```

### 2. EXPLAIN ANALYZE

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE customer_id = 123;
```

| 指标 | 问题 | 解决方案 |
|-----|------|---------|
| 大表上的 `Seq Scan` | 缺少索引 | 在过滤列上添加索引 |
| `Rows Removed by Filter` 很高 | 选择性差 | 检查 WHERE 子句 |
| `Buffers: read >> hit` | 数据未缓存 | 增加 `shared_buffers` |
| `Sort Method: external merge` | `work_mem` 太低 | 增加 `work_mem` |

### 3. 维护统计信息

```sql
-- 分析特定表
ANALYZE orders;

-- 检查上次分析时间
SELECT relname, last_analyze, last_autoanalyze
FROM pg_stat_user_tables
ORDER BY last_analyze NULLS FIRST;

-- 为高变更表调整自动清理
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_scale_factor = 0.02
);
```

---

## 第十部分：JSONB 模式

### 1. 为 JSONB 列创建索引

```sql
-- 用于包含运算符的 GIN 索引
CREATE INDEX products_attrs_gin ON products USING gin (attributes);
SELECT * FROM products WHERE attributes @> '{"color": "red"}';

-- 特定键的表达式索引
CREATE INDEX products_brand_idx ON products ((attributes->>'brand'));
SELECT * FROM products WHERE attributes->>'brand' = 'Nike';

-- jsonb_path_ops：小 2-3 倍，仅支持 @>
CREATE INDEX idx ON products USING gin (attributes jsonb_path_ops);
```

### 2. 使用 tsvector 的全文搜索

```sql
-- 添加生成的 tsvector 列
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))
  ) STORED;

CREATE INDEX articles_search_idx ON articles USING gin (search_vector);

-- 快速全文搜索
SELECT * FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgresql & performance');

-- 带排名
SELECT *, ts_rank(search_vector, query) as rank
FROM articles, to_tsquery('english', 'postgresql') query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

---

## 反模式汇总

### 查询反模式
- 生产代码中使用 `SELECT *`
- WHERE/JOIN 列缺少索引
- 大表上使用 OFFSET 分页
- N+1 查询模式
- 未参数化的查询（SQL 注入风险）

### 模式反模式
- ID 使用 `int`（应使用 `bigint`）
- 无理由使用 `varchar(255)`（应使用 `text`）
- 不带时区的 `timestamp`（应使用 `timestamptz`）
- 随机 UUID 作为主键（应使用 UUIDv7 或 IDENTITY）
- 需要引号的混合大小写标识符

### 安全反模式
- 给应用用户 `GRANT ALL`
- 多租户表缺少 RLS
- RLS 策略对每行调用函数（未用 SELECT 包裹）
- RLS 策略列未建索引

### 连接反模式
- 没有连接池
- 没有空闲超时
- 事务模式连接池中使用预处理语句
- 在外部 API 调用期间持有锁

---

## 审查清单

在批准数据库变更之前：

- [ ] 所有 WHERE/JOIN 列已索引
- [ ] 复合索引列顺序正确
- [ ] 使用了正确的数据类型（bigint、text、timestamptz、numeric）
- [ ] 多租户表启用了 RLS
- [ ] RLS 策略使用 `(SELECT auth.uid())` 模式
- [ ] 外键有索引
- [ ] 没有 N+1 查询模式
- [ ] 复杂查询运行了 EXPLAIN ANALYZE
- [ ] 使用小写标识符
- [ ] 事务保持简短

---

**核心原则：** 数据库问题往往是应用性能问题的根本原因。尽早优化查询和模式设计。使用 EXPLAIN ANALYZE 验证假设。始终为外键和 RLS 策略列创建索引。

*模式改编自 [Supabase Agent Skills](https://github.com/supabase/agent-skills)，采用 MIT 许可证。*

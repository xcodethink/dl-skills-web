> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# ClickHouse Analytics Patterns

## Overview

ClickHouse-specific patterns for high-performance analytics and data engineering. ClickHouse is a column-oriented DBMS optimized for OLAP workloads -- fast analytical queries on large datasets with column storage, compression, parallel execution, and real-time analytics capabilities.

---

## Table Design

### MergeTree Engine (Most Common)

```sql
CREATE TABLE markets_analytics (
    date Date,
    market_id String,
    market_name String,
    volume UInt64,
    trades UInt32,
    unique_traders UInt32,
    avg_trade_size Float64,
    created_at DateTime
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, market_id)
SETTINGS index_granularity = 8192;
```

### ReplacingMergeTree (Deduplication)

```sql
CREATE TABLE user_events (
    event_id String,
    user_id String,
    event_type String,
    timestamp DateTime,
    properties String
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (user_id, event_id, timestamp)
PRIMARY KEY (user_id, event_id);
```

### AggregatingMergeTree (Pre-aggregation)

```sql
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- Query with merge functions
SELECT hour, market_id,
    sumMerge(total_volume) AS volume,
    countMerge(total_trades) AS trades,
    uniqMerge(unique_users) AS users
FROM market_stats_hourly
WHERE hour >= toStartOfHour(now() - INTERVAL 24 HOUR)
GROUP BY hour, market_id;
```

---

## Query Optimization

### Efficient Filtering -- indexed columns first

```sql
SELECT * FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC LIMIT 100;
```

### ClickHouse-Specific Aggregations

```sql
SELECT
    toStartOfDay(created_at) AS day,
    market_id,
    sum(volume) AS total_volume,
    count() AS total_trades,
    uniq(trader_id) AS unique_traders,
    avg(trade_size) AS avg_size
FROM trades
WHERE created_at >= today() - INTERVAL 7 DAY
GROUP BY day, market_id;

-- Percentiles with quantile (more efficient than percentile)
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### Window Functions

```sql
SELECT date, market_id, volume,
    sum(volume) OVER (
        PARTITION BY market_id ORDER BY date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_volume
FROM markets_analytics
WHERE date >= today() - INTERVAL 30 DAY;
```

---

## Data Insertion

### Bulk Insert (Recommended)

```typescript
async function bulkInsertTrades(trades: Trade[]) {
  const values = trades.map(trade => `(
    '${trade.id}', '${trade.market_id}', '${trade.user_id}',
    ${trade.amount}, '${trade.timestamp.toISOString()}'
  )`).join(',')

  await clickhouse.query(`
    INSERT INTO trades (id, market_id, user_id, amount, timestamp)
    VALUES ${values}
  `).toPromise()
}
```

### Streaming Insert

```typescript
async function streamInserts() {
  const stream = clickhouse.insert('trades').stream()
  for await (const batch of dataSource) {
    stream.write(batch)
  }
  await stream.end()
}
```

---

## Materialized Views

```sql
-- Auto-aggregate on insert
CREATE MATERIALIZED VIEW market_stats_hourly_mv
TO market_stats_hourly
AS SELECT
    toStartOfHour(timestamp) AS hour,
    market_id,
    sumState(amount) AS total_volume,
    countState() AS total_trades,
    uniqState(user_id) AS unique_users
FROM trades
GROUP BY hour, market_id;

-- Query with merge functions
SELECT hour, market_id,
    sumMerge(total_volume) AS volume,
    countMerge(total_trades) AS trades,
    uniqMerge(unique_users) AS users
FROM market_stats_hourly
WHERE hour >= now() - INTERVAL 24 HOUR
GROUP BY hour, market_id;
```

---

## Common Analytics Queries

### Time Series -- DAU

```sql
SELECT toDate(timestamp) AS date, uniq(user_id) AS dau
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date ORDER BY date;
```

### Retention Analysis

```sql
SELECT signup_date,
    countIf(days_since_signup = 0) AS day_0,
    countIf(days_since_signup = 1) AS day_1,
    countIf(days_since_signup = 7) AS day_7,
    countIf(days_since_signup = 30) AS day_30
FROM (
    SELECT user_id,
        min(toDate(timestamp)) AS signup_date,
        toDate(timestamp) AS activity_date,
        dateDiff('day', signup_date, activity_date) AS days_since_signup
    FROM events GROUP BY user_id, activity_date
) GROUP BY signup_date ORDER BY signup_date DESC;
```

### Funnel Analysis

```sql
SELECT
    countIf(step = 'viewed_market') AS viewed,
    countIf(step = 'clicked_trade') AS clicked,
    countIf(step = 'completed_trade') AS completed,
    round(clicked / viewed * 100, 2) AS view_to_click_rate,
    round(completed / clicked * 100, 2) AS click_to_completion_rate
FROM (
    SELECT user_id, session_id, event_type AS step
    FROM events WHERE event_date = today()
) GROUP BY session_id;
```

### Cohort Analysis

```sql
SELECT
    toStartOfMonth(signup_date) AS cohort,
    toStartOfMonth(activity_date) AS month,
    dateDiff('month', cohort, month) AS months_since_signup,
    count(DISTINCT user_id) AS active_users
FROM (
    SELECT user_id,
        min(toDate(timestamp)) OVER (PARTITION BY user_id) AS signup_date,
        toDate(timestamp) AS activity_date
    FROM events
) GROUP BY cohort, month, months_since_signup
ORDER BY cohort, months_since_signup;
```

---

## Data Pipelines

### ETL Pattern

```typescript
async function etlPipeline() {
  const rawData = await extractFromPostgres()
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))
  await bulkInsertToClickHouse(transformed)
}
setInterval(etlPipeline, 60 * 60 * 1000)
```

### Change Data Capture (CDC)

```typescript
import { Client } from 'pg'
const pgClient = new Client({ connectionString: process.env.DATABASE_URL })
pgClient.query('LISTEN market_updates')

pgClient.on('notification', async (msg) => {
  const update = JSON.parse(msg.payload)
  await clickhouse.insert('market_updates', [{
    market_id: update.id,
    event_type: update.operation,
    timestamp: new Date(),
    data: JSON.stringify(update.new_data)
  }])
})
```

---

## Performance Monitoring

```sql
-- Slow queries
SELECT query_id, user, query, query_duration_ms, read_rows, read_bytes, memory_usage
FROM system.query_log
WHERE type = 'QueryFinish' AND query_duration_ms > 1000
  AND event_time >= now() - INTERVAL 1 HOUR
ORDER BY query_duration_ms DESC LIMIT 10;

-- Table sizes
SELECT database, table,
    formatReadableSize(sum(bytes)) AS size,
    sum(rows) AS rows
FROM system.parts WHERE active
GROUP BY database, table ORDER BY sum(bytes) DESC;
```

---

## Best Practices

| Area | Do | Don't |
|------|-----|-------|
| **Partitioning** | Partition by time (month/day) | Too many partitions |
| **Ordering Key** | Frequently filtered columns first | Ignore cardinality |
| **Data Types** | Smallest appropriate type, `LowCardinality` for repeated strings | Oversized types |
| **Queries** | Specify columns, batch inserts | `SELECT *`, small frequent inserts |
| **Joins** | Denormalize for analytics | Too many JOINs |
| **Aggregation** | Use materialized views | `FINAL` keyword |

**Remember**: Design tables for your query patterns, batch inserts, and leverage materialized views for real-time aggregations.

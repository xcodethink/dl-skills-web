> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Backend Development

---
name: database
description: Use when working with MongoDB or PostgreSQL - schema design, queries, aggregation pipelines, indexing, performance optimization, migrations, replication, backups, and administration. Unified guide for both document and relational databases.
---

# Database

## Overview

Unified guide for MongoDB (document database) and PostgreSQL (relational database). Choose the right database for your use case and master both database systems, from basic CRUD to advanced optimization and administration.

## When to Use

- Designing database schemas and data models
- Writing queries (SQL or MongoDB query language)
- Building aggregation pipelines or complex JOINs
- Optimizing indexes and query performance
- Implementing database migrations
- Setting up replication, sharding, or clustering
- Configuring backup and disaster recovery
- Managing database users and permissions
- Analyzing slow queries and performance issues
- Managing production database deployments

## Database Selection Guide

### Choose MongoDB When:
- **Schema flexibility**: Structure changes frequently, heterogeneous data types
- **Document-centric**: Natural JSON/BSON data model
- **Horizontal scaling**: Need to shard across multiple servers
- **High write throughput**: IoT, logging, real-time analytics
- **Nested/hierarchical data**: Prefer embedded documents
- **Rapid prototyping**: Schema evolution without migrations

**Best for:** Content management, product catalogs, IoT time series, real-time analytics, mobile apps, user profiles

### Choose PostgreSQL When:
- **Strong consistency**: ACID transactions are critical
- **Complex relationships**: Many-to-many JOINs, referential integrity
- **SQL requirements**: Team SQL expertise, reporting tools, BI systems
- **Data integrity**: Strict schema validation and constraints
- **Mature ecosystem**: Rich tooling and extensions
- **Complex queries**: Window functions, CTEs, analytical workloads

**Best for:** Financial systems, e-commerce transactions, ERP, CRM, data warehouses, analytics systems

### Both Support:
- JSON/JSONB storage and querying
- Full-text search
- Geospatial queries and indexing
- Replication and high availability
- ACID transactions (MongoDB 4.0+)
- Strong security features

## Quick Start

### MongoDB Setup

```bash
# Atlas (cloud) - Recommended
# 1. Register at mongodb.com/atlas
# 2. Create M0 free cluster
# 3. Get connection string

# Connection string
mongodb+srv://user:pass@cluster.mongodb.net/db

# Command line
mongosh "mongodb+srv://cluster.mongodb.net/mydb"

# Basic operations
db.users.insertOne({ name: "Alice", age: 30 })
db.users.find({ age: { $gte: 18 } })
db.users.updateOne({ name: "Alice" }, { $set: { age: 31 } })
db.users.deleteOne({ name: "Alice" })
```

### PostgreSQL Setup

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Connect to database
psql -U postgres -d mydb

# Basic operations
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, age INT);
INSERT INTO users (name, age) VALUES ('Alice', 30);
SELECT * FROM users WHERE age >= 18;
UPDATE users SET age = 31 WHERE name = 'Alice';
DELETE FROM users WHERE name = 'Alice';
```

## Common Operations Comparison

### Create/Insert
```javascript
// MongoDB
db.users.insertOne({ name: "Bob", email: "bob@example.com" })
db.users.insertMany([{ name: "Alice" }, { name: "Charlie" }])
```

```sql
-- PostgreSQL
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
INSERT INTO users (name, email) VALUES ('Alice', NULL), ('Charlie', NULL);
```

### Read/Query
```javascript
// MongoDB
db.users.find({ age: { $gte: 18 } })
db.users.findOne({ email: "bob@example.com" })
```

```sql
-- PostgreSQL
SELECT * FROM users WHERE age >= 18;
SELECT * FROM users WHERE email = 'bob@example.com' LIMIT 1;
```

### Update
```javascript
// MongoDB
db.users.updateOne({ name: "Bob" }, { $set: { age: 25 } })
db.users.updateMany({ status: "pending" }, { $set: { status: "active" } })
```

```sql
-- PostgreSQL
UPDATE users SET age = 25 WHERE name = 'Bob';
UPDATE users SET status = 'active' WHERE status = 'pending';
```

### Delete
```javascript
// MongoDB
db.users.deleteOne({ name: "Bob" })
db.users.deleteMany({ status: "deleted" })
```

```sql
-- PostgreSQL
DELETE FROM users WHERE name = 'Bob';
DELETE FROM users WHERE status = 'deleted';
```

### Indexing
```javascript
// MongoDB
db.users.createIndex({ email: 1 })                      // Single field index
db.users.createIndex({ status: 1, createdAt: -1 })      // Compound index
```

```sql
-- PostgreSQL
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status_created ON users(status, created_at DESC);
```

## Reference Documentation Navigation

### MongoDB References
- **mongodb-crud.md** -- CRUD operations, query operators, atomic updates
- **mongodb-aggregation.md** -- Aggregation pipeline, stages, operators, patterns
- **mongodb-indexing.md** -- Index types, compound indexes, performance optimization
- **mongodb-atlas.md** -- Atlas cloud setup, clusters, monitoring, search

### PostgreSQL References
- **postgresql-queries.md** -- SELECT, JOIN, subqueries, CTEs, window functions
- **postgresql-psql-cli.md** -- psql commands, meta-commands, scripting
- **postgresql-performance.md** -- EXPLAIN, query optimization, VACUUM, indexing
- **postgresql-administration.md** -- User management, backup, replication, maintenance

## Python Utility Scripts

Database utility scripts in `scripts/`:
- **db_migrate.py** -- Generate and apply migrations for both databases
- **db_backup.py** -- Backup and restore MongoDB and PostgreSQL
- **db_performance_check.py** -- Analyze slow queries and recommend indexes

```bash
# Generate migration
python scripts/db_migrate.py --db mongodb --generate "add_user_index"

# Execute backup
python scripts/db_backup.py --db postgres --output /backups/

# Performance check
python scripts/db_performance_check.py --db mongodb --threshold 100ms
```

## Key Differences Summary

| Feature | MongoDB | PostgreSQL |
|---------|---------|------------|
| Data model | Document (JSON/BSON) | Relational (tables/rows) |
| Schema | Flexible, dynamic | Strict, predefined |
| Query language | MongoDB Query Language | SQL |
| JOINs | $lookup (limited) | Native JOINs, optimized |
| Transactions | Multi-document (4.0+) | Native ACID |
| Scaling | Horizontal (sharding) | Vertical (primary), horizontal (extensions) |
| Index types | Single, compound, text, geospatial, etc. | B-tree, Hash, GiST, GIN, etc. |

## Best Practices

**MongoDB:**
- Use embedded documents for one-to-few relationships
- Use references for one-to-many or many-to-many relationships
- Create indexes for frequently queried fields
- Use aggregation pipelines for complex data transformations
- Enable authentication and TLS in production
- Use Atlas for managed deployment

**PostgreSQL:**
- Normalize schema to 3NF, denormalize for performance as needed
- Use foreign keys for referential integrity
- Create indexes on foreign keys and frequently filtered columns
- Use EXPLAIN ANALYZE to optimize queries
- Run regular VACUUM and ANALYZE maintenance
- Use connection pooling (pgBouncer) for web applications

## Resources

- MongoDB: https://www.mongodb.com/docs/
- PostgreSQL: https://www.postgresql.org/docs/
- MongoDB University: https://learn.mongodb.com/
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/

> Source: [prisma/skills](https://github.com/prisma/skills) | Category: Backend | ⭐ Prisma Official

---
name: prisma-driver-adapter-implementation
description: Required reference for Prisma v7 driver adapter work. Use when implementing or modifying adapters, adding database drivers, or touching SqlDriverAdapter/Transaction interfaces. Contains critical contract details not inferable from code examples.
---

# Prisma 7 Driver Adapter Implementation Guide

## Overview

Everything needed to implement a Prisma ORM v7 driver adapter for any database. Covers the architecture, required interfaces, implementation steps, type conversion, error handling, and testing strategy.

## Architecture

```
PrismaClient (requires adapter factory)
    │
    ▼
SqlMigrationAwareDriverAdapterFactory
    ├── connect() → SqlDriverAdapter
    └── connectToShadowDb() → SqlDriverAdapter
            │
            ▼
        SqlDriverAdapter
            ├── queryRaw() → ResultSet
            ├── executeRaw() → number
            ├── executeScript()
            ├── startTransaction() → Transaction
            ├── getConnectionInfo()
            └── dispose()
                    │
                    ▼
                Transaction (extends SqlQueryable)
                    ├── commit()    ← lifecycle hook only
                    └── rollback()  ← lifecycle hook only
```

## Required Imports

```typescript
import type {
  ColumnType, IsolationLevel, SqlDriverAdapter,
  SqlMigrationAwareDriverAdapterFactory, SqlQuery,
  SqlQueryable, SqlResultSet, Transaction,
  TransactionOptions, ArgType, ConnectionInfo, MappedError,
} from "@prisma/driver-adapter-utils";
import { ColumnTypeEnum, DriverAdapterError } from "@prisma/driver-adapter-utils";
```

## Key Interfaces

### SqlQuery (input)

```typescript
type SqlQuery = {
  sql: string;
  args: Array<unknown>;
  argTypes: Array<ArgType>;
};
```

### SqlResultSet (output from queryRaw)

```typescript
interface SqlResultSet {
  columnNames: Array<string>;
  columnTypes: Array<ColumnType>;
  rows: Array<Array<unknown>>;
  lastInsertId?: string;
}
```

### SqlDriverAdapter

```typescript
interface SqlDriverAdapter extends SqlQueryable {
  executeScript(script: string): Promise<void>;
  startTransaction(isolationLevel?: IsolationLevel): Promise<Transaction>;
  getConnectionInfo?(): ConnectionInfo;
  dispose(): Promise<void>;
}
```

### Transaction

```typescript
interface Transaction extends SqlQueryable {
  readonly options: TransactionOptions;
  commit(): Promise<void>;   // Lifecycle hook ONLY - no SQL
  rollback(): Promise<void>; // Lifecycle hook ONLY - no SQL
}
```

## Implementation Steps

### Step 1: Queryable Base Class

```typescript
class MyQueryable<TClient> implements SqlQueryable {
  readonly provider = "postgres" as const;
  readonly adapterName = "@my-org/adapter-mydb" as const;

  constructor(protected readonly client: TClient) {}

  async queryRaw(query: SqlQuery): Promise<SqlResultSet> {
    try {
      const args = query.args.map((arg, i) =>
        mapArg(arg, query.argTypes[i] ?? { scalarType: "unknown", arity: "scalar" })
      );
      const result = await this.client.query(query.sql, args);
      const columnNames = /* from result */;
      const columnTypes = /* map to ColumnTypeEnum */;
      const rows = result.map(row => mapRow(row, columnTypes));
      return { columnNames, columnTypes, rows };
    } catch (e) { this.onError(e); }
  }

  async executeRaw(query: SqlQuery): Promise<number> {
    try {
      const args = query.args.map((arg, i) =>
        mapArg(arg, query.argTypes[i] ?? { scalarType: "unknown", arity: "scalar" })
      );
      const result = await this.client.query(query.sql, args);
      return result.affectedRows ?? 0;
    } catch (e) { this.onError(e); }
  }

  protected onError(error: unknown): never {
    throw new DriverAdapterError(convertDriverError(error));
  }
}
```

### Step 2: Transaction Class

**Critical**: `commit()` and `rollback()` are **lifecycle hooks only**. They must NOT issue SQL. Prisma sends `COMMIT`/`ROLLBACK` via `executeRaw`.

```typescript
class MyTransaction extends MyQueryable<TClient> implements Transaction {
  readonly options: TransactionOptions;
  readonly #release: () => void;

  constructor(client: TClient, options: TransactionOptions, release: () => void) {
    super(client);
    this.options = options;
    this.#release = release;
  }

  commit(): Promise<void> {
    this.#release();
    return Promise.resolve();
  }

  rollback(): Promise<void> {
    this.#release();
    return Promise.resolve();
  }
}
```

### Step 3: Adapter Class

```typescript
class MyAdapter extends MyQueryable<TClient> implements SqlDriverAdapter {
  #transactionDepth = 0;

  async startTransaction(isolationLevel?: IsolationLevel): Promise<Transaction> {
    const options: TransactionOptions = { usePhantomQuery: false };
    this.#transactionDepth += 1;
    const depth = this.#transactionDepth;

    try {
      if (depth === 1) {
        const beginSql = isolationLevel
          ? `BEGIN ISOLATION LEVEL ${isolationLevel}` : "BEGIN";
        await this.client.query(beginSql);
      } else {
        await this.client.query(`SAVEPOINT sp_${depth}`);
      }
    } catch (e) {
      this.#transactionDepth -= 1;
      this.onError(e);
    }

    return new MyTransaction(this.client, options, () => { this.#transactionDepth -= 1; });
  }

  async executeScript(script: string): Promise<void> { /* split & execute */ }
  getConnectionInfo(): ConnectionInfo { return { supportsRelationJoins: true }; }
  async dispose(): Promise<void> { await this.client.close(); }
}
```

### Step 4: Factory Class

```typescript
export class MyAdapterFactory implements SqlMigrationAwareDriverAdapterFactory {
  readonly provider = "postgres" as const;
  readonly adapterName = "@my-org/adapter-mydb" as const;

  constructor(private readonly config: { url: string }, private readonly options?: { shadowDatabaseUrl?: string }) {}

  connect(): Promise<SqlDriverAdapter> {
    return Promise.resolve(new MyAdapter(openConnection(this.config.url)));
  }

  connectToShadowDb(): Promise<SqlDriverAdapter> {
    const url = this.options?.shadowDatabaseUrl ?? this.config.url;
    return Promise.resolve(new MyAdapter(openConnection(url)));
  }
}
```

## Conversion Helpers

### Argument Mapping (input)

```typescript
function mapArg(arg: unknown, argType: ArgType): unknown {
  if (arg === null || arg === undefined) return null;
  if (typeof arg === "string" && argType.scalarType === "int") return Number.parseInt(arg, 10);
  if (typeof arg === "string" && argType.scalarType === "float") return Number.parseFloat(arg);
  if (typeof arg === "string" && argType.scalarType === "bigint") return BigInt(arg);
  if (typeof arg === "string" && argType.scalarType === "bytes") return Buffer.from(arg, "base64");
  return arg;
}
```

### Row Mapping (output)

```typescript
function mapRow(row: unknown[], columnTypes: ColumnType[]): ResultValue[] {
  return row.map((value, i) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "bigint") return value.toString();
    if (value instanceof Date) return value.toISOString();
    if (columnTypes[i] === ColumnTypeEnum.Json && typeof value === "object")
      return JSON.stringify(value);
    return value;
  });
}
```

## Error Handling

Map driver errors to `MappedError`:

```typescript
function convertDriverError(error: unknown): MappedError {
  if (error instanceof Error) {
    const dbError = error as Error & { code?: string };
    if (dbError.code === "23505") return { kind: "UniqueConstraintViolation" };
    if (dbError.code === "23502") return { kind: "NullConstraintViolation" };
    if (dbError.code === "23503") return { kind: "ForeignKeyConstraintViolation" };
    if (dbError.code === "42P01") return { kind: "TableDoesNotExist" };
  }
  return { kind: "GenericJs", id: 0 };
}
```

## Database-Specific Notes

| Database | Key Points |
|----------|------------|
| **SQLite** | `safeIntegers: true`, only `SERIALIZABLE`, split scripts on `;`, booleans as 0/1 |
| **PostgreSQL** | All isolation levels, `prepare: false` for PgBouncer, reserve connections for transactions |
| **MySQL/MariaDB** | `?` placeholders, handle `BIGINT` as string |

## Completion Checklist

- [ ] Factory: `connect()` and `connectToShadowDb()`
- [ ] Adapter: `queryRaw`, `executeRaw`, `executeScript`, `startTransaction`, `dispose`
- [ ] Transaction: `queryRaw`, `executeRaw`, `commit`, `rollback` (lifecycle hooks only)
- [ ] `startTransaction` issues `BEGIN` (depth 1) or `SAVEPOINT` (nested)
- [ ] Argument mapping: string to int/bigint/float, base64 to bytes
- [ ] Row mapping: bigint to string, Date to ISO string, JSON to string
- [ ] Column types mapped to `ColumnTypeEnum`
- [ ] Errors wrapped in `DriverAdapterError` with proper `MappedError`
- [ ] Isolation level validation for target database
- [ ] Unit tests for queryRaw, executeRaw, executeScript, transactions
- [ ] E2E tests with real PrismaClient

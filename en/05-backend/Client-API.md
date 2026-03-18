> Source: [prisma/skills](https://github.com/prisma/skills) | Category: Backend | ⭐ Prisma Official

---
name: prisma-client-api
description: Prisma Client API reference covering model queries, filters, operators, and client methods. Use when writing database queries, using CRUD operations, filtering data, or configuring Prisma Client.
---

# Prisma Client API Reference

## Overview

Complete API reference for Prisma Client in Prisma ORM 7.x. Covers model queries, filtering, relations, transactions, and client methods with type-safe database operations.

## Client Instantiation (v7)

```typescript
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })
```

## Model Query Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `findUnique()` | Find by unique field | Record \| null |
| `findUniqueOrThrow()` | Find or throw | Record |
| `findFirst()` | Find first match | Record \| null |
| `findFirstOrThrow()` | Find first or throw | Record |
| `findMany()` | Find multiple | Record[] |
| `create()` | Create one | Record |
| `createMany()` | Create multiple | { count } |
| `createManyAndReturn()` | Create and return | Record[] |
| `update()` | Update one | Record |
| `updateMany()` | Update multiple | { count } |
| `updateManyAndReturn()` | Update and return | Record[] |
| `upsert()` | Update or create | Record |
| `delete()` | Delete one | Record |
| `deleteMany()` | Delete multiple | { count } |
| `count()` | Count matches | number |
| `aggregate()` | Aggregate values | Aggregate |
| `groupBy()` | Group and aggregate | Group[] |

## Query Options

| Option | Description |
|--------|-------------|
| `where` | Filter conditions |
| `select` | Fields to include |
| `include` | Relations to load |
| `omit` | Fields to exclude |
| `orderBy` | Sort order |
| `take` | Limit results |
| `skip` | Skip results (pagination) |
| `cursor` | Cursor-based pagination |
| `distinct` | Unique values only |

## CRUD Examples

### Read

```typescript
// Find by unique field
const user = await prisma.user.findUnique({
  where: { email: 'alice@prisma.io' }
})

// Composite unique key (@@unique([firstName, lastName]))
const user = await prisma.user.findUnique({
  where: {
    firstName_lastName: { firstName: 'Alice', lastName: 'Smith' }
  }
})

// Find many with filtering, sorting, and pagination
const users = await prisma.user.findMany({
  where: { role: 'USER' },
  orderBy: { name: 'asc' },
  take: 10,
  skip: 0
})
```

### Create

```typescript
// Single record with nested relation
const user = await prisma.user.create({
  data: {
    email: 'alice@prisma.io',
    posts: {
      create: [{ title: 'First Post' }, { title: 'Second Post' }]
    }
  },
  include: { posts: true }
})

// Bulk create (skip duplicates)
const result = await prisma.user.createMany({
  data: [
    { email: 'alice@prisma.io', name: 'Alice' },
    { email: 'bob@prisma.io', name: 'Bob' }
  ],
  skipDuplicates: true
})
```

### Update

```typescript
// Simple update
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Alice Smith' }
})

// Atomic operations
const post = await prisma.post.update({
  where: { id: 1 },
  data: {
    views: { increment: 1 },
    likes: { decrement: 1 },
    score: { multiply: 2 },
    rating: { divide: 2 },
    version: { set: 5 }
  }
})

// Upsert (update or create)
const user = await prisma.user.upsert({
  where: { email: 'alice@prisma.io' },
  update: { name: 'Alice Smith' },
  create: { email: 'alice@prisma.io', name: 'Alice' }
})
```

### Delete

```typescript
const user = await prisma.user.delete({ where: { id: 1 } })

const result = await prisma.user.deleteMany({ where: { role: 'GUEST' } })
```

### Aggregation

```typescript
const result = await prisma.post.aggregate({
  _avg: { views: true },
  _sum: { views: true },
  _min: { views: true },
  _max: { views: true },
  _count: { _all: true }
})

const groups = await prisma.user.groupBy({
  by: ['country'],
  _count: { _all: true },
  _avg: { age: true },
  having: { age: { _avg: { gt: 30 } } }
})
```

## Filter Operators

### Scalar Filters

```typescript
// Equality
where: { email: 'alice@prisma.io' }
where: { email: { equals: 'alice@prisma.io' } }
where: { email: { not: 'alice@prisma.io' } }

// Comparison
where: { age: { gt: 18, lte: 65 } }

// Lists
where: { role: { in: ['ADMIN', 'MODERATOR'] } }
where: { role: { notIn: ['GUEST', 'BANNED'] } }

// String filters
where: { email: { contains: 'prisma', mode: 'insensitive' } }
where: { email: { startsWith: 'alice' } }
where: { email: { endsWith: '@prisma.io' } }

// Null checks
where: { deletedAt: null }
where: { deletedAt: { not: null } }
```

### Logical Operators

```typescript
// AND (implicit - multiple conditions)
where: { email: { contains: '@prisma.io' }, role: 'ADMIN' }

// OR
where: {
  OR: [
    { email: { contains: '@gmail.com' } },
    { email: { contains: '@prisma.io' } }
  ]
}

// NOT
where: { NOT: { role: 'GUEST' } }

// Combined
where: {
  AND: [{ verified: true }, { OR: [{ role: 'ADMIN' }, { role: 'MODERATOR' }] }],
  NOT: { deletedAt: { not: null } }
}
```

### Relation Filters

```typescript
// some - at least one related record matches
where: { posts: { some: { published: true } } }

// every - all related records match
where: { posts: { every: { published: true } } }

// none - no related records match
where: { posts: { none: { published: true } } }

// is / isNot (1-to-1)
where: { profile: { is: { country: 'USA' } } }
```

### Array & JSON Filters

```typescript
// Array field filters (String[])
where: { tags: { has: 'typescript' } }
where: { tags: { hasSome: ['typescript', 'javascript'] } }
where: { tags: { hasEvery: ['typescript', 'prisma'] } }

// JSON path filter
where: { metadata: { path: ['settings', 'theme'], equals: 'dark' } }
```

## Relation Queries

### Loading Relations

```typescript
// Include relations
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true, profile: true }
})

// Filtered include
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    }
  }
})

// Nested include
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: { include: { comments: { include: { author: true } } } }
  }
})
```

### Nested Writes

```typescript
// Create with relations
const user = await prisma.user.create({
  data: {
    email: 'alice@prisma.io',
    posts: { create: [{ title: 'Post 1' }] },
    profile: { create: { bio: 'Hello!' } }
  }
})

// Connect or create
const post = await prisma.post.create({
  data: {
    title: 'New Post',
    author: {
      connectOrCreate: {
        where: { email: 'alice@prisma.io' },
        create: { email: 'alice@prisma.io', name: 'Alice' }
      }
    }
  }
})
```

### Count Relations

```typescript
const users = await prisma.user.findMany({
  select: {
    name: true,
    _count: { select: { posts: true, followers: true } }
  }
})
// { name: 'Alice', _count: { posts: 5, followers: 100 } }
```

## Transactions

### Sequential (Array)

```typescript
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'alice@prisma.io' } }),
  prisma.post.create({ data: { title: 'Hello', authorId: 1 } })
])
```

### Interactive (Async Function)

```typescript
await prisma.$transaction(async (tx) => {
  const sender = await tx.account.update({
    where: { id: senderId },
    data: { balance: { decrement: amount } }
  })

  if (sender.balance < 0) throw new Error('Insufficient funds')

  await tx.account.update({
    where: { id: recipientId },
    data: { balance: { increment: amount } }
  })
})
```

### Transaction Options

```typescript
await prisma.$transaction(
  async (tx) => { /* operations */ },
  {
    maxWait: 5000,
    timeout: 10000,
    isolationLevel: 'Serializable'
  }
)
```

| Feature | Sequential | Interactive |
|---------|------------|-------------|
| Syntax | Array | Async function |
| Dependent ops | No | Yes |
| Conditional logic | No | Yes |
| Performance | Better | More flexible |

## Client Methods

| Method | Description |
|--------|-------------|
| `$connect()` | Explicitly connect to database |
| `$disconnect()` | Disconnect from database |
| `$transaction()` | Execute transaction |
| `$queryRaw()` | Execute raw SQL query |
| `$executeRaw()` | Execute raw SQL command |
| `$on()` | Subscribe to events |
| `$extends()` | Add extensions |

## Resources

- [Prisma Client API Reference](https://www.prisma.io/docs/orm/reference/prisma-client-reference)
- [CRUD Operations](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
- [Filtering and Sorting](https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting)

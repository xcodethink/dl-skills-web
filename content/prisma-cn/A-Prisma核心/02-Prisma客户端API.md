> 来源：[prisma/skills](https://github.com/prisma/skills) | 分类：后端编码 | ⭐ Prisma 官方

---
name: prisma-client-api
description: Prisma Client API reference covering model queries, filters, operators, and client methods. Use when writing database queries, using CRUD operations, filtering data, or configuring Prisma Client.
---

# Prisma 客户端 API 参考（Prisma Client API Reference）

## 概述

Prisma Client 是 Prisma ORM 的核心查询接口，提供类型安全的数据库操作。本文档涵盖模型查询、过滤器、关联操作、事务和客户端方法，适用于 Prisma ORM 7.x 版本。

## 适用场景

- 使用 Prisma Client 编写数据库查询
- 执行 CRUD 操作（创建、读取、更新、删除）
- 数据过滤和排序
- 操作关联数据
- 使用事务（Transaction）
- 配置客户端选项

## 规则优先级

| 优先级 | 分类 | 影响程度 | 前缀 |
|--------|------|----------|------|
| 1 | 客户端构造 | 高 | `constructor` |
| 2 | 模型查询 | 关键 | `model-queries` |
| 3 | 查询选项 | 高 | `query-options` |
| 4 | 过滤器 | 高 | `filters` |
| 5 | 关联 | 高 | `relations` |
| 6 | 事务 | 关键 | `transactions` |
| 7 | 原始 SQL | 关键 | `raw-queries` |
| 8 | 客户端方法 | 中 | `client-methods` |

## 客户端实例化（v7）

```typescript
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })
```

## 模型查询方法

| 方法 | 说明 | 返回类型 |
|------|------|----------|
| `findUnique()` | 通过唯一字段查找单条记录 | Record \| null |
| `findUniqueOrThrow()` | 查找单条，未找到则抛错 | Record |
| `findFirst()` | 查找第一条匹配记录 | Record \| null |
| `findFirstOrThrow()` | 查找第一条，未找到则抛错 | Record |
| `findMany()` | 查找多条记录 | Record[] |
| `create()` | 创建一条新记录 | Record |
| `createMany()` | 批量创建记录 | { count: number } |
| `createManyAndReturn()` | 批量创建并返回记录 | Record[] |
| `update()` | 更新一条记录 | Record |
| `updateMany()` | 批量更新记录 | { count: number } |
| `updateManyAndReturn()` | 批量更新并返回记录 | Record[] |
| `upsert()` | 更新或创建记录 | Record |
| `delete()` | 删除一条记录 | Record |
| `deleteMany()` | 批量删除记录 | { count: number } |
| `count()` | 统计匹配记录数 | number |
| `aggregate()` | 聚合运算（求和、平均值等） | Aggregate result |
| `groupBy()` | 分组聚合 | Group result[] |

## 查询选项

| 选项 | 说明 |
|------|------|
| `where` | 过滤条件 |
| `select` | 选择要返回的字段 |
| `include` | 加载关联数据 |
| `omit` | 排除指定字段 |
| `orderBy` | 排序方式 |
| `take` | 限制返回数量 |
| `skip` | 跳过记录数（分页） |
| `cursor` | 游标分页（Cursor-based Pagination） |
| `distinct` | 仅返回唯一值 |

## 读取操作

### 通过唯一字段查找

```typescript
// 通过唯一字段查找
const user = await prisma.user.findUnique({
  where: { email: 'alice@prisma.io' }
})

// 复合唯一键（Composite Unique Key）
// 模型定义：@@unique([firstName, lastName])
const user = await prisma.user.findUnique({
  where: {
    firstName_lastName: {
      firstName: 'Alice',
      lastName: 'Smith'
    }
  }
})
```

### 查找第一条匹配

```typescript
const user = await prisma.user.findFirst({
  where: { role: 'ADMIN' },
  orderBy: { createdAt: 'desc' }
})
```

### 查找多条记录

```typescript
const users = await prisma.user.findMany({
  where: { role: 'USER' },
  orderBy: { name: 'asc' },
  take: 10,
  skip: 0
})
```

### 查找或抛错

```typescript
// 未找到时抛出 PrismaClientKnownRequestError
const user = await prisma.user.findUniqueOrThrow({
  where: { id: 1 }
})
```

## 创建操作

### 创建单条记录

```typescript
const user = await prisma.user.create({
  data: {
    email: 'alice@prisma.io',
    name: 'Alice'
  }
})
```

### 创建时同时创建关联数据

```typescript
const user = await prisma.user.create({
  data: {
    email: 'alice@prisma.io',
    posts: {
      create: [
        { title: 'First Post' },
        { title: 'Second Post' }
      ]
    }
  },
  include: { posts: true }
})
```

### 批量创建

```typescript
const result = await prisma.user.createMany({
  data: [
    { email: 'alice@prisma.io', name: 'Alice' },
    { email: 'bob@prisma.io', name: 'Bob' }
  ],
  skipDuplicates: true  // 跳过重复唯一字段的记录
})
// 返回 { count: 2 }
```

### 批量创建并返回

```typescript
const users = await prisma.user.createManyAndReturn({
  data: [
    { email: 'alice@prisma.io', name: 'Alice' },
    { email: 'bob@prisma.io', name: 'Bob' }
  ]
})
// 返回创建的用户数组
```

## 更新操作

### 更新单条记录

```typescript
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Alice Smith' }
})
```

### 原子操作（Atomic Operations）

```typescript
const post = await prisma.post.update({
  where: { id: 1 },
  data: {
    views: { increment: 1 },   // 递增
    likes: { decrement: 1 },   // 递减
    score: { multiply: 2 },    // 乘法
    rating: { divide: 2 },     // 除法
    version: { set: 5 }        // 直接设置
  }
})
```

### 批量更新

```typescript
const result = await prisma.user.updateMany({
  where: { role: 'USER' },
  data: { verified: true }
})
// 返回 { count: 42 }
```

### 更新或创建（Upsert）

```typescript
const user = await prisma.user.upsert({
  where: { email: 'alice@prisma.io' },
  update: { name: 'Alice Smith' },
  create: { email: 'alice@prisma.io', name: 'Alice' }
})
```

## 删除操作

```typescript
// 删除单条记录
const user = await prisma.user.delete({
  where: { id: 1 }
})

// 批量删除
const result = await prisma.user.deleteMany({
  where: { role: 'GUEST' }
})
// 返回 { count: 5 }

// 删除全部
const result = await prisma.user.deleteMany({})
```

## 聚合操作

### 计数

```typescript
const count = await prisma.user.count({
  where: { role: 'ADMIN' }
})
```

### 聚合（Aggregate）

```typescript
const result = await prisma.post.aggregate({
  _avg: { views: true },
  _sum: { views: true },
  _min: { views: true },
  _max: { views: true },
  _count: { _all: true }
})
```

### 分组（GroupBy）

```typescript
const groups = await prisma.user.groupBy({
  by: ['country'],
  _count: { _all: true },
  _avg: { age: true },
  having: {
    age: { _avg: { gt: 30 } }
  }
})
```

## 过滤器操作符

### 相等与不等

```typescript
// 精确匹配（隐式）
where: { email: 'alice@prisma.io' }

// 显式 equals
where: { email: { equals: 'alice@prisma.io' } }

// 不等于
where: { email: { not: 'alice@prisma.io' } }
```

### 比较操作符

```typescript
where: { age: { gt: 18 } }     // 大于
where: { age: { gte: 18 } }    // 大于等于
where: { age: { lt: 65 } }     // 小于
where: { age: { lte: 65 } }    // 小于等于
where: { age: { gte: 18, lte: 65 } }  // 组合使用
```

### 列表操作符

```typescript
// 在数组中
where: { role: { in: ['ADMIN', 'MODERATOR'] } }

// 不在数组中
where: { role: { notIn: ['GUEST', 'BANNED'] } }
```

### 字符串过滤

```typescript
where: { email: { contains: 'prisma' } }           // 包含
where: { email: { startsWith: 'alice' } }           // 以...开头
where: { email: { endsWith: '@prisma.io' } }        // 以...结尾

// 不区分大小写
where: {
  email: {
    contains: 'PRISMA',
    mode: 'insensitive'
  }
}
```

### 空值检查

```typescript
where: { deletedAt: null }              // 为 null
where: { deletedAt: { not: null } }     // 不为 null
where: { middleName: { isSet: true } }  // 字段已设置（可选字段）
```

### 逻辑操作符

```typescript
// AND（隐式 — 多个条件默认为 AND）
where: {
  email: { contains: '@prisma.io' },
  role: 'ADMIN'
}

// AND（显式）
where: {
  AND: [
    { email: { contains: '@prisma.io' } },
    { role: 'ADMIN' }
  ]
}

// OR
where: {
  OR: [
    { email: { contains: '@gmail.com' } },
    { email: { contains: '@prisma.io' } }
  ]
}

// NOT
where: {
  NOT: { role: 'GUEST' }
}

// 组合使用
where: {
  AND: [
    { verified: true },
    {
      OR: [
        { role: 'ADMIN' },
        { role: 'MODERATOR' }
      ]
    }
  ],
  NOT: { deletedAt: { not: null } }
}
```

### 关联过滤（Relation Filters）

| 操作符 | 说明 |
|--------|------|
| `some` | 至少一条关联记录匹配 |
| `every` | 所有关联记录都匹配 |
| `none` | 没有关联记录匹配 |
| `is` | 关联记录匹配（一对一） |
| `isNot` | 关联记录不匹配 |

```typescript
// 有至少一篇已发布文章的用户
where: {
  posts: { some: { published: true } }
}

// 所有文章都已发布的用户
where: {
  posts: { every: { published: true } }
}

// 没有已发布文章的用户
where: {
  posts: { none: { published: true } }
}

// 一对一关联过滤
where: {
  profile: { is: { country: 'USA' } }
}
```

### 数组字段过滤

```typescript
where: { tags: { has: 'typescript' } }                         // 包含元素
where: { tags: { hasSome: ['typescript', 'javascript'] } }     // 包含任一
where: { tags: { hasEvery: ['typescript', 'prisma'] } }        // 包含全部
where: { tags: { isEmpty: true } }                             // 为空
```

### JSON 过滤

```typescript
where: {
  metadata: {
    path: ['settings', 'theme'],
    equals: 'dark'
  }
}
```

## 关联查询

### 加载关联数据（Include）

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
    profile: true
  }
})
```

### 过滤关联数据

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true }
    }
  }
})
```

### 嵌套关联

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        comments: {
          include: { author: true }
        }
      }
    }
  }
})
```

### 嵌套写入（Nested Writes）

```typescript
// 创建时同时创建关联
const user = await prisma.user.create({
  data: {
    email: 'alice@prisma.io',
    posts: {
      create: [
        { title: 'Post 1' },
        { title: 'Post 2' }
      ]
    },
    profile: {
      create: { bio: 'Hello!' }
    }
  }
})

// 连接或创建（connectOrCreate）
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

// 连接已有记录
const post = await prisma.post.create({
  data: {
    title: 'New Post',
    author: { connect: { id: 1 } }
  }
})
```

### 更新关联

```typescript
// 更新关联记录
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      update: {
        where: { id: 1 },
        data: { title: 'Updated Title' }
      }
    }
  }
})

// 断开关联（Disconnect）
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    profile: { disconnect: true }
  }
})

// 替换所有关联（Set）
const post = await prisma.post.update({
  where: { id: 1 },
  data: {
    tags: { set: [{ id: 1 }, { id: 2 }] }
  }
})
```

### 统计关联数量

```typescript
const users = await prisma.user.findMany({
  select: {
    name: true,
    _count: {
      select: { posts: true, followers: true }
    }
  }
})
// { name: 'Alice', _count: { posts: 5, followers: 100 } }
```

## 事务（Transactions）

### 顺序事务（Sequential）

```typescript
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'alice@prisma.io' } }),
  prisma.post.create({ data: { title: 'Hello', authorId: 1 } })
])
```

任何操作失败，所有操作都会回滚：

```typescript
try {
  await prisma.$transaction([
    prisma.user.create({ data: { email: 'alice@prisma.io' } }),
    prisma.user.create({ data: { email: 'alice@prisma.io' } }) // 重复！
  ])
} catch (e) {
  // 两个操作都已回滚
}
```

### 交互式事务（Interactive）

适用于复杂逻辑和依赖操作：

```typescript
await prisma.$transaction(async (tx) => {
  // 扣减发送方余额
  const sender = await tx.account.update({
    where: { id: senderId },
    data: { balance: { decrement: amount } }
  })

  // 检查余额
  if (sender.balance < 0) {
    throw new Error('Insufficient funds')  // 余额不足
  }

  // 增加接收方余额
  await tx.account.update({
    where: { id: recipientId },
    data: { balance: { increment: amount } }
  })
})
```

### 事务选项

```typescript
await prisma.$transaction(
  async (tx) => {
    // 操作
  },
  {
    maxWait: 5000,    // 最大等待获取锁时间（毫秒）
    timeout: 10000,   // 最大事务持续时间（毫秒）
    isolationLevel: 'Serializable'  // 隔离级别
  }
)
```

### 隔离级别

| 级别 | 说明 |
|------|------|
| `ReadUncommitted` | 最低隔离，可读取未提交的更改 |
| `ReadCommitted` | 仅读取已提交的更改 |
| `RepeatableRead` | 事务内一致读取 |
| `Serializable` | 最高隔离，序列化执行 |

### 顺序事务 vs 交互式事务

| 特性 | 顺序事务 | 交互式事务 |
|------|----------|------------|
| 语法 | 数组 | 异步函数 |
| 依赖操作 | 否 | 是 |
| 条件逻辑 | 否 | 是 |
| 性能 | 更好 | 更灵活 |
| 用例 | 简单批处理 | 复杂逻辑 |

## 客户端方法

| 方法 | 说明 |
|------|------|
| `$connect()` | 显式连接到数据库 |
| `$disconnect()` | 断开数据库连接 |
| `$transaction()` | 执行事务 |
| `$queryRaw()` | 执行原始 SQL 查询 |
| `$executeRaw()` | 执行原始 SQL 命令 |
| `$on()` | 订阅事件 |
| `$extends()` | 添加扩展 |

## 最佳实践

### 保持事务简短

```typescript
// 好的做法 — 仅在事务中执行数据库操作
const data = prepareData() // 在事务外准备数据
await prisma.$transaction(async (tx) => {
  await tx.user.create({ data })
})
```

### 错误处理

```typescript
try {
  await prisma.$transaction(async (tx) => {
    // 操作
  })
} catch (e) {
  if (e.code === 'P2002') {
    // 处理唯一约束冲突
  }
  throw e
}
```

## 参考资源

- [Prisma Client API 参考](https://www.prisma.io/docs/orm/reference/prisma-client-reference)
- [CRUD 操作](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
- [过滤和排序](https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting)

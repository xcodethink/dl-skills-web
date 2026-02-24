# API 与后端设计

> 来源：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> 原始文件：skills/api-design/SKILL.md + skills/backend-patterns/SKILL.md

---

## 何时激活

- 设计新的 API 端点
- 审查现有 API 契约
- 添加分页、过滤或排序
- 实现 API 错误处理
- 规划 API 版本策略
- 构建后端服务架构

---

## 第一部分：REST API 设计

### URL 结构

```
# 资源使用名词、复数、小写、短横线命名
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id

# 子资源表示关系
GET    /api/v1/users/:id/orders
POST   /api/v1/users/:id/orders

# 不映射到 CRUD 的操作（谨慎使用动词）
POST   /api/v1/orders/:id/cancel
POST   /api/v1/auth/login
```

### 命名规则

```
# 正确
/api/v1/team-members          # 多词资源用短横线
/api/v1/orders?status=active  # 查询参数用于过滤
/api/v1/users/123/orders      # 嵌套资源表示所有权

# 错误
/api/v1/getUsers              # URL 中有动词
/api/v1/user                  # 单数（应使用复数）
/api/v1/team_members          # URL 中使用下划线
```

### HTTP 方法语义

| 方法 | 幂等 | 安全 | 用途 |
|------|------|------|------|
| GET | 是 | 是 | 获取资源 |
| POST | 否 | 否 | 创建资源、触发操作 |
| PUT | 是 | 否 | 完整替换资源 |
| PATCH | 否* | 否 | 部分更新资源 |
| DELETE | 是 | 否 | 删除资源 |

### 状态码参考

```
# 成功
200 OK                    — GET、PUT、PATCH（带响应体）
201 Created               — POST（包含 Location 头）
204 No Content            — DELETE、PUT（无响应体）

# 客户端错误
400 Bad Request           — 验证失败、JSON 格式错误
401 Unauthorized          — 缺少或无效的认证
403 Forbidden             — 已认证但未授权
404 Not Found             — 资源不存在
409 Conflict              — 重复条目、状态冲突
422 Unprocessable Entity  — 语义无效（JSON 有效但数据有问题）
429 Too Many Requests     — 超出速率限制

# 服务端错误
500 Internal Server Error — 意外故障（不要暴露细节）
503 Service Unavailable   — 临时过载，包含 Retry-After
```

---

### 响应格式

#### 成功响应

```json
{
  "data": {
    "id": "abc-123",
    "email": "alice@example.com",
    "name": "Alice",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### 集合响应（带分页）

```json
{
  "data": [
    { "id": "abc-123", "name": "Alice" },
    { "id": "def-456", "name": "Bob" }
  ],
  "meta": {
    "total": 142,
    "page": 1,
    "per_page": 20,
    "total_pages": 8
  },
  "links": {
    "self": "/api/v1/users?page=1&per_page=20",
    "next": "/api/v1/users?page=2&per_page=20",
    "last": "/api/v1/users?page=8&per_page=20"
  }
}
```

#### 错误响应

```json
{
  "error": {
    "code": "validation_error",
    "message": "请求验证失败",
    "details": [
      {
        "field": "email",
        "message": "必须是有效的邮箱地址",
        "code": "invalid_format"
      }
    ]
  }
}
```

---

### 分页

#### 偏移量分页（Offset-Based）-- 简单

```
GET /api/v1/users?page=2&per_page=20
```

**优点**：易于实现，支持"跳转到第 N 页"
**缺点**：大偏移量时慢，并发插入时不一致

#### 游标分页（Cursor-Based）-- 可扩展

```
GET /api/v1/users?cursor=eyJpZCI6MTIzfQ&limit=20
```

**优点**：无论位置如何性能一致，并发插入时稳定
**缺点**：不能跳转到任意页，游标不透明

| 用例 | 分页类型 |
|------|----------|
| 管理后台、小数据集（<10K） | 偏移量 |
| 无限滚动、信息流、大数据集 | 游标 |
| 公开 API | 游标（默认）+ 偏移量（可选） |
| 搜索结果 | 偏移量（用户期望页码） |

### 过滤、排序和搜索

```
# 简单相等
GET /api/v1/orders?status=active&customer_id=abc-123

# 比较运算符（方括号表示法）
GET /api/v1/products?price[gte]=10&price[lte]=100

# 排序（- 前缀表示降序）
GET /api/v1/products?sort=-created_at

# 多字段排序
GET /api/v1/products?sort=-featured,price,-created_at

# 稀疏字段集（减少负载）
GET /api/v1/users?fields=id,name,email
```

### 版本策略

```
1. 从 /api/v1/ 开始 -- 在需要之前不版本化
2. 最多维护 2 个活跃版本（当前 + 上一个）
3. 弃用时间线：
   - 公告弃用（公开 API 提前 6 个月通知）
   - 添加 Sunset 头：Sunset: Sat, 01 Jan 2026 00:00:00 GMT
   - 过期后返回 410 Gone
4. 非破坏性更改不需要新版本：
   - 向响应添加新字段
   - 添加新的可选查询参数
   - 添加新端点
5. 破坏性更改需要新版本：
   - 删除或重命名字段
   - 更改字段类型
   - 更改 URL 结构
```

### 限流

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

| 层级 | 限制 | 窗口 | 用例 |
|------|------|------|------|
| 匿名 | 30/分钟 | 按 IP | 公开端点 |
| 已认证 | 100/分钟 | 按用户 | 标准 API 访问 |
| 高级 | 1000/分钟 | 按 API 密钥 | 付费 API 计划 |
| 内部 | 10000/分钟 | 按服务 | 服务间调用 |

---

## 第二部分：后端架构模式

### 仓库模式（Repository Pattern）

```typescript
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<Market[]>
  findById(id: string): Promise<Market | null>
  create(data: CreateMarketDto): Promise<Market>
  update(id: string, data: UpdateMarketDto): Promise<Market>
  delete(id: string): Promise<void>
}
```

### 服务层模式（Service Layer）

```typescript
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }
}
```

### 中间件模式

```typescript
export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
      const user = await verifyToken(token)
      req.user = user
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}
```

### N+1 查询防范

```typescript
// 错误：N+1 查询
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N 次查询
}

// 正确：批量获取
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1 次查询
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

### Redis 缓存层

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    const cached = await this.redis.get(`market:${id}`)
    if (cached) return JSON.parse(cached)

    const market = await this.baseRepo.findById(id)
    if (market) {
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }
    return market
  }
}
```

### 集中错误处理

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
  }
}

export function errorHandler(error: unknown, req: Request): Response {
  if (error instanceof ApiError) {
    return NextResponse.json({ success: false, error: error.message },
      { status: error.statusCode })
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json({ success: false, error: '验证失败', details: error.errors },
      { status: 400 })
  }

  console.error('意外错误:', error)
  return NextResponse.json({ success: false, error: 'Internal server error' },
    { status: 500 })
}
```

### 指数退避重试

```typescript
async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}
```

### 基于角色的访问控制（RBAC）

```typescript
type Permission = 'read' | 'write' | 'delete' | 'admin'

const rolePermissions: Record<string, Permission[]> = {
  admin: ['read', 'write', 'delete', 'admin'],
  moderator: ['read', 'write', 'delete'],
  user: ['read', 'write']
}

export function hasPermission(user: User, permission: Permission): boolean {
  return rolePermissions[user.role].includes(permission)
}
```

---

## API 设计清单

发布新端点前检查：

- [ ] 资源 URL 遵循命名规范（复数、短横线、无动词）
- [ ] 使用正确的 HTTP 方法
- [ ] 返回适当的状态码（不是所有都 200）
- [ ] 输入通过模式验证（Zod、Pydantic、Bean Validation）
- [ ] 错误响应遵循标准格式
- [ ] 列表端点实现了分页
- [ ] 需要认证（或明确标记为公开）
- [ ] 检查了授权（用户只能访问自己的资源）
- [ ] 配置了限流
- [ ] 响应不泄漏内部细节（堆栈跟踪、SQL 错误）
- [ ] 与现有端点命名一致
- [ ] 文档已更新（OpenAPI/Swagger）

---

**记住**：后端模式支持可扩展、可维护的服务端应用。选择适合复杂度的模式。

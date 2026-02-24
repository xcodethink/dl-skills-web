> 来源：[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Docker 模式

## 概述

Docker 和 Docker Compose 在本地开发中的最佳实践，涵盖容器化开发环境搭建、网络配置、卷策略、容器安全加固以及多服务编排。

## 适用场景

- 为本地开发搭建 Docker Compose 环境
- 设计多容器架构
- 排查容器网络或卷相关问题
- 审查 Dockerfile 的安全性和镜像大小
- 从本地开发迁移到容器化工作流

## Docker Compose 本地开发

### 标准 Web 应用技术栈

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
      target: dev                     # 使用多阶段 Dockerfile 的 dev 阶段
    ports:
      - "3000:3000"
    volumes:
      - .:/app                        # 绑定挂载，用于热重载
      - /app/node_modules             # 匿名卷 -- 保留容器内的依赖
    environment:
      - DATABASE_URL=postgres://postgres:postgres@db:5432/app_dev
      - REDIS_URL=redis://redis:6379/0
      - NODE_ENV=development
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: npm run dev

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_dev
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

  mailpit:                            # 本地邮件测试
    image: axllent/mailpit
    ports:
      - "8025:8025"                   # Web 界面
      - "1025:1025"                   # SMTP 端口

volumes:
  pgdata:
  redisdata:
```

### 开发 vs 生产 Dockerfile（多阶段构建）

```dockerfile
# 阶段：安装依赖
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 阶段：开发（热重载、调试工具）
FROM node:22-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 阶段：构建
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --production

# 阶段：生产（最小化镜像）
FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001
USER appuser
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

### 覆盖文件（Override Files）

```yaml
# docker-compose.override.yml（自动加载，仅开发环境设置）
services:
  app:
    environment:
      - DEBUG=app:*
      - LOG_LEVEL=debug
    ports:
      - "9229:9229"                   # Node.js 调试器端口

# docker-compose.prod.yml（生产环境显式指定）
services:
  app:
    build:
      target: production
    restart: always
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
```

```bash
# 开发环境（自动加载 override 文件）
docker compose up

# 生产环境
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 网络配置

### 服务发现

同一 Compose 网络中的服务通过服务名解析：

```
# 从 "app" 容器内部：
postgres://postgres:postgres@db:5432/app_dev    # "db" 解析为 db 容器
redis://redis:6379/0                             # "redis" 解析为 redis 容器
```

### 自定义网络

```yaml
services:
  frontend:
    networks:
      - frontend-net

  api:
    networks:
      - frontend-net
      - backend-net

  db:
    networks:
      - backend-net              # 只有 api 能访问，frontend 不能访问

networks:
  frontend-net:
  backend-net:
```

### 仅暴露必要端口

```yaml
services:
  db:
    ports:
      - "127.0.0.1:5432:5432"   # 仅主机可访问，不对外网暴露
    # 在生产环境中完全省略 ports -- 仅在 Docker 网络内可访问
```

## 卷策略（Volume Strategies）

```yaml
volumes:
  # 命名卷：跨容器重启持久化，由 Docker 管理
  pgdata:

  # 绑定挂载：将主机目录映射到容器中（用于开发）
  # - ./src:/app/src

  # 匿名卷：保护容器生成的内容不被绑定挂载覆盖
  # - /app/node_modules
```

### 常见模式

```yaml
services:
  app:
    volumes:
      - .:/app                   # 源代码（绑定挂载用于热重载）
      - /app/node_modules        # 保护容器的 node_modules 不被主机覆盖
      - /app/.next               # 保护构建缓存

  db:
    volumes:
      - pgdata:/var/lib/postgresql/data          # 持久化数据
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql  # 初始化脚本
```

## 容器安全

### Dockerfile 加固

```dockerfile
# 1. 使用特定标签（永远不用 :latest）
FROM node:22.12-alpine3.20

# 2. 以非 root 用户运行
RUN addgroup -g 1001 -S app && adduser -S app -u 1001
USER app

# 3. 在 Compose 中降低权限（Drop capabilities）
# 4. 尽可能使用只读根文件系统
# 5. 不在镜像层中存储密钥
```

### Compose 安全配置

```yaml
services:
  app:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /app/.cache
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE          # 仅在绑定 1024 以下端口时需要
```

### 密钥管理（Secret Management）

```yaml
# 推荐：使用环境变量（运行时注入）
services:
  app:
    env_file:
      - .env                     # 永远不要将 .env 提交到 Git
    environment:
      - API_KEY                  # 从主机环境继承

# 推荐：Docker 密钥（Swarm 模式）
secrets:
  db_password:
    file: ./secrets/db_password.txt

services:
  db:
    secrets:
      - db_password

# 错误做法：硬编码在镜像中
# ENV API_KEY=sk-proj-xxxxx      # 永远不要这样做
```

## .dockerignore

```
node_modules
.git
.env
.env.*
dist
coverage
*.log
.next
.cache
docker-compose*.yml
Dockerfile*
README.md
tests/
```

## 调试

### 常用命令

```bash
# 查看日志
docker compose logs -f app           # 跟踪 app 日志
docker compose logs --tail=50 db     # 查看 db 最后 50 行日志

# 在运行中的容器内执行命令
docker compose exec app sh           # 进入 app 容器 Shell
docker compose exec db psql -U postgres  # 连接 PostgreSQL

# 检查状态
docker compose ps                     # 运行中的服务
docker compose top                    # 每个容器中的进程
docker stats                          # 资源使用情况

# 重新构建
docker compose up --build             # 重新构建镜像
docker compose build --no-cache app   # 强制完整重建

# 清理
docker compose down                   # 停止并移除容器
docker compose down -v                # 同时移除卷（破坏性操作）
docker system prune                   # 移除未使用的镜像/容器
```

### 调试网络问题

```bash
# 在容器内检查 DNS 解析
docker compose exec app nslookup db

# 检查连通性
docker compose exec app wget -qO- http://api:3000/health

# 检查网络
docker network ls
docker network inspect <project>_default
```

## 反模式（Anti-Patterns）

- **在生产环境使用没有编排的 docker compose** -- 生产环境多容器工作负载应使用 Kubernetes、ECS 或 Docker Swarm
- **在没有卷的容器中存储数据** -- 容器是临时的，没有卷的数据在重启时全部丢失
- **以 root 用户运行** -- 始终创建并使用非 root 用户
- **使用 :latest 标签** -- 固定特定版本以实现可复现的构建
- **将所有服务打包在一个大容器中** -- 关注点分离：每个容器一个进程
- **在 docker-compose.yml 中放置密钥** -- 使用 .env 文件（gitignored）或 Docker 密钥

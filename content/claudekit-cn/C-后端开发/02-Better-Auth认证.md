> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：后端开发

# Better Auth 认证技能

Better Auth 是一个全面的、框架无关的 TypeScript 认证/授权框架，内置邮箱密码登录、社交 OAuth 登录，以及强大的插件生态系统，支持高级功能扩展。

## 适用场景

- 在 TypeScript/JavaScript 应用中实现认证（Authentication）
- 添加邮箱密码或社交 OAuth 认证
- 设置双因素认证（2FA）、通行密钥（Passkeys）、魔法链接（Magic Links）等高级认证功能
- 构建支持组织/多租户（Multi-tenant）的应用
- 管理会话（Session）和用户生命周期
- 与任意框架集成（Next.js、Nuxt、SvelteKit、Remix、Astro、Hono、Express 等）

## 快速开始

### 安装

```bash
npm install better-auth
# 或使用 pnpm/yarn/bun add better-auth
```

### 环境变量配置

创建 `.env` 文件：
```env
BETTER_AUTH_SECRET=<生成的密钥，至少32个字符>
BETTER_AUTH_URL=http://localhost:3000
```

### 基础服务端配置

创建 `auth.ts`（放在项目根目录、lib/、utils/ 或 src/app/server/ 下）：

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // 详见 references/database-integration.md
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true  // 注册后自动登录
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }
  }
});
```

### 数据库 Schema 生成

```bash
npx @better-auth/cli generate  # 生成 Schema/迁移文件
npx @better-auth/cli migrate   # 应用迁移（仅限 Kysely）
```

### 挂载 API 处理器

**Next.js App Router：**
```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

**其他框架：** 详见 references/email-password-auth.md#framework-setup

### 客户端配置

创建 `auth-client.ts`：

```ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
});
```

### 基本用法

```ts
// 注册
await authClient.signUp.email({
  email: "user@example.com",
  password: "secure123",
  name: "John Doe"
});

// 登录
await authClient.signIn.email({
  email: "user@example.com",
  password: "secure123"
});

// OAuth 社交登录
await authClient.signIn.social({ provider: "github" });

// 获取会话
const { data: session } = authClient.useSession(); // React/Vue/Svelte
const { data: session } = await authClient.getSession(); // 原生 JS
```

## 功能选择矩阵

| 功能 | 是否需要插件 | 使用场景 | 参考文档 |
|------|-------------|----------|----------|
| 邮箱/密码 | 否（内置） | 基础认证 | [email-password-auth.md](./references/email-password-auth.md) |
| OAuth（GitHub、Google 等） | 否（内置） | 社交登录 | [oauth-providers.md](./references/oauth-providers.md) |
| 邮箱验证 | 否（内置） | 验证邮箱地址 | [email-password-auth.md](./references/email-password-auth.md#email-verification) |
| 密码重置 | 否（内置） | 忘记密码流程 | [email-password-auth.md](./references/email-password-auth.md#password-reset) |
| 双因素认证（2FA/TOTP） | 是（`twoFactor`） | 增强安全性 | [advanced-features.md](./references/advanced-features.md#two-factor-authentication) |
| 通行密钥（Passkeys/WebAuthn） | 是（`passkey`） | 无密码认证 | [advanced-features.md](./references/advanced-features.md#passkeys-webauthn) |
| 魔法链接（Magic Link） | 是（`magicLink`） | 基于邮件的登录 | [advanced-features.md](./references/advanced-features.md#magic-link) |
| 用户名认证 | 是（`username`） | 用户名登录 | [email-password-auth.md](./references/email-password-auth.md#username-authentication) |
| 组织/多租户 | 是（`organization`） | 团队/组织功能 | [advanced-features.md](./references/advanced-features.md#organizations) |
| 速率限制（Rate Limiting） | 否（内置） | 防止滥用 | [advanced-features.md](./references/advanced-features.md#rate-limiting) |
| 会话管理（Session Management） | 否（内置） | 用户会话 | [advanced-features.md](./references/advanced-features.md#session-management) |

## 认证方式选型指南

**选择邮箱/密码的场景：**
- 构建传统认证方式的标准 Web 应用
- 需要完全控制用户凭据
- 目标用户偏好使用邮箱注册

**选择 OAuth 的场景：**
- 希望减少注册摩擦、快速注册
- 用户已有社交账号
- 需要访问社交平台的用户资料数据

**选择通行密钥（Passkeys）的场景：**
- 希望提供无密码体验
- 目标用户使用现代浏览器/设备
- 安全性是最高优先级

**选择魔法链接（Magic Link）的场景：**
- 希望无密码体验但不需要 WebAuthn 的复杂性
- 目标用户以邮件为主
- 需要临时访问链接

**组合多种方式的场景：**
- 希望为不同用户偏好提供灵活选择
- 构建有多种认证需求的企业应用
- 需要渐进增强（从简单开始，逐步添加更多选项）

## 核心架构

Better Auth 采用客户端-服务端架构：
1. **服务端**（`better-auth`）：处理认证逻辑、数据库操作、API 路由
2. **客户端**（`better-auth/client`）：为前端提供 Hooks/方法
3. **插件**：同时扩展服务端和客户端功能

## 实施清单

- [ ] 安装 `better-auth` 包
- [ ] 设置环境变量（SECRET、URL）
- [ ] 创建带数据库配置的 auth 服务端实例
- [ ] 运行 Schema 迁移（`npx @better-auth/cli generate`）
- [ ] 在框架中挂载 API 处理器
- [ ] 创建客户端实例
- [ ] 实现注册/登录 UI
- [ ] 在组件中添加会话管理
- [ ] 设置受保护路由/中间件
- [ ] 按需添加插件（添加后需重新生成 Schema）
- [ ] 测试完整的认证流程
- [ ] 配置邮件发送（验证/重置）
- [ ] 为生产环境启用速率限制
- [ ] 设置错误处理

## 参考文档

### 核心认证
- [邮箱/密码认证](./references/email-password-auth.md) — 邮箱密码设置、验证、密码重置、用户名认证
- [OAuth 提供商](./references/oauth-providers.md) — 社交登录设置、提供商配置、令牌管理
- [数据库集成](./references/database-integration.md) — 数据库适配器、Schema 设置、迁移

### 高级功能
- [高级功能](./references/advanced-features.md) — 2FA/MFA、通行密钥、魔法链接、组织、速率限制、会话管理

## 脚本

- `scripts/better_auth_init.py` — 通过交互式设置初始化 Better Auth 配置

## 资源

- 文档：https://www.better-auth.com/docs
- GitHub：https://github.com/better-auth/better-auth
- 插件：https://www.better-auth.com/docs/plugins
- 示例：https://www.better-auth.com/docs/examples

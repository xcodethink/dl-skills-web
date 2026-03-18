> 来源：[bear2u/my-skills](https://github.com/bear2u/my-skills) | 分类：A-项目初始化

# Next.js 15 初始化技能（NextJS 15 Init Skill）

基于领域（Domain）创建 Next.js 15 项目，并自动配置现代化技术栈。
可选择 Todo、Blog、Dashboard、E-commerce 或自定义领域，立即生成基于 App Router 的完整 CRUD 应用。

## 快速开始

技能执行时需要输入以下信息：
- 文件夹名（如：my-todo-app）
- 项目名（如：todo-app）
- 领域选择（Todo/Blog/Dashboard/E-commerce/Custom）
- 技术栈预设（Minimal/Essential/Full Stack/Custom）

之后将自动执行以下步骤：

```bash
# 1. 创建 Next.js 15 项目（App Router, TypeScript, Tailwind）
npx create-next-app@latest [文件夹名] --typescript --tailwind --app --use-npm

# 2. 安装依赖包
npm install

# 3. 按领域自动生成 App Router 结构
# - app/[domain]/（页面）
# - components/[domain]/（组件）
# - lib/stores/[domain].ts（Zustand 状态管理）
# - lib/api/[domain].ts（API 逻辑）
# - lib/validations/[domain].ts（Zod 验证模式）

# 4. 代码质量检查（必须）
npm run lint

# 5. 启动开发服务器
npm run dev
```

## 任务指引

**重要**：本技能以对话方式进行。

### 第一步：询问领域与项目配置

**首先向用户询问：**

"即将创建 Next.js 15 应用。请提供以下信息：

**1. 领域（实体）选择**

您想创建哪种领域的应用？

**A) Todo（待办事项管理）**
- 字段：title, description, completed, createdAt, updatedAt
- 功能：CRUD、筛选（全部/进行中/已完成）、复选框切换
- API：/api/todos（GET, POST, PATCH, DELETE）

**B) Blog（博客/CMS）**
- 字段：title, content, excerpt, slug, published, createdAt, updatedAt
- 功能：CRUD、文章编写/编辑、列表/详情页、搜索
- API：/api/posts（GET, POST, PATCH, DELETE）

**C) Dashboard（仪表盘/管理后台）**
- 字段：统计数据、图表数据、用户管理
- 功能：数据可视化、表格、筛选、分页
- API：/api/analytics, /api/users

**D) E-commerce（电商）**
- 字段：name, price, description, images, stock, category
- 功能：商品列表/详情、购物车、订单
- API：/api/products, /api/cart, /api/orders

**E) Custom（自定义）**
- 自行输入实体名称和字段

**2. 项目信息**
- **文件夹名**：项目创建目录名称（默认：[领域]-app，如：todo-app）
  - Next.js 项目将在此文件夹中创建
- **项目名**：Next.js 项目名称（默认与文件夹名相同）
  - 用于 package.json 的 name 字段

**3. 技术栈预设选择**

请选择以下选项之一：

**A) Essential（推荐）**
- Next.js 15（App Router）
- TypeScript
- Tailwind CSS
- ShadCN/ui（UI 组件）
- Zustand（客户端状态管理）
- React Hook Form + Zod（表单管理 + 验证）
- Lucide Icons
- 不含 Tanstack Query
- 不含 Prisma
- 不含 NextAuth

**B) Minimal（最简配置）**
- Next.js 15（App Router）
- TypeScript
- Tailwind CSS
- 不含 ShadCN
- 不含 Zustand
- 不含 React Hook Form
- 不含其他库

**C) Full Stack（全功能）**
- Next.js 15（App Router）
- TypeScript
- Tailwind CSS
- ShadCN/ui
- Zustand（客户端状态）
- Tanstack Query（服务端状态）
- React Hook Form + Zod
- Drizzle ORM（TypeScript-first ORM）
- Better Auth（身份认证）
- Framer Motion（动画）
- Lucide Icons

**D) Custom（自定义选择）**
- 逐一选择各项功能

请选择领域和预设。（领域：A/B/C/D/E，预设：A/B/C/D）"

### 第二步：自定义选项的追加询问

#### 2-1. 选择自定义领域（E）时：

1. **实体名**：请输入实体名称（如：Product, Post, User）
2. **字段定义**：请输入各字段（格式：字段名:类型，如：title:string, price:number, isActive:boolean）
   - 支持类型：string, number, boolean, Date
   - createdAt, updatedAt 将自动添加
3. **主要功能**：请选择用于筛选/排序的字段

#### 2-2. 选择自定义技术栈预设（D）时：

依次询问以下问题：

1. **UI 组件**：是否使用 ShadCN/ui？（是/否）
2. **状态管理**：是否使用 Zustand？（是/否）
3. **服务端状态**：是否使用 Tanstack Query？（是/否）
4. **表单管理**：是否使用 React Hook Form + Zod？（是/否）
5. **数据库**：是否使用 Drizzle ORM？（是/否）
6. **身份认证**：是否使用 Better Auth？（是/否）
7. **动画**：是否使用 Framer Motion？（是/否）

### 第三步：根据所选领域和技术栈生成项目

1. **创建 Next.js 15 项目**：
   - 使用用户指定的**文件夹名**创建项目
   - 命令：`npx create-next-app@latest [文件夹名] --typescript --tailwind --app --use-npm`
   - 若文件夹名与项目名不同，创建后修改 package.json 的 `name` 字段

2. **安装所选依赖包**：`npm install [包列表]`

3. **生成文件夹结构**：基于 App Router 的结构
   ```
   app/
   ├── (auth)/
   ├── [domain]/
   ├── api/[domain]/
   ├── layout.tsx
   └── page.tsx
   components/
   ├── ui/（ShadCN）
   ├── [domain]/
   └── layouts/
   lib/
   ├── db/（Prisma）
   ├── stores/（Zustand）
   ├── api/
   ├── utils/
   └── validations/（Zod）
   ```

4. **按领域生成样板代码**：

   **A) Todo**：title, description, completed, createdAt, updatedAt
   - API Routes：/api/todos（CRUD）
   - Pages：/todos（列表）、/todos/[id]（详情）
   - Components：TodoList、TodoItem、TodoForm
   - Store：useTodoStore（Zustand）
   - Validation：todoSchema（Zod）

   **B) Blog**：title, content, excerpt, slug, published, createdAt, updatedAt
   - API Routes：/api/posts（CRUD）
   - Pages：/blog（列表）、/blog/[slug]（详情）、/blog/write（编辑）
   - Components：PostList、PostCard、PostEditor
   - Store：usePostStore（Zustand）
   - Validation：postSchema（Zod）

   **C) Dashboard**：统计、图表、用户管理
   - API Routes：/api/analytics、/api/users
   - Pages：/dashboard（首页）、/dashboard/users（用户管理）
   - Components：Chart、StatsCard、DataTable
   - Store：useDashboardStore（Zustand）
   - Validation：userSchema（Zod）

   **D) E-commerce**：name, price, description, images, stock, category
   - API Routes：/api/products、/api/cart、/api/orders
   - Pages：/products（列表）、/products/[id]（详情）、/cart（购物车）
   - Components：ProductCard、ProductGrid、Cart
   - Store：useCartStore、useProductStore（Zustand）
   - Validation：productSchema、cartSchema（Zod）

   **E) Custom**：用户自定义字段
   - API Routes：基础 CRUD
   - Pages：基础 List/Detail
   - Components：基础 CRUD 组件
   - Store：基础 store
   - Validation：基础 schema

5. **安装和配置 ShadCN**（Essential 及以上）：
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button card input form table
   ```

6. **代码检查及错误修复**：

   a. 执行 `npm run lint`

   b. 修复发现的错误：
   - **Import 路径**：使用 @/ 别名（tsconfig.json 配置）
   - **TypeScript 类型**：所有类型显式声明
   - **ESLint 规则**：删除未使用的变量和 import
   - **Next.js 规则**：metadata、generateStaticParams 等
   - **'use client' 指令**：使用 useState、useEffect 等 React Hooks 时须在文件顶部添加

   c. 执行 `npm run build` 或 `pnpm build`

   d. 修复构建错误：
   - **TypeScript 类型错误**：类型不匹配、nullable 检查缺失等
   - **模块 import 错误**：路径确认、包安装确认
   - **Server/Client Component 错误**：添加适当的 'use client' 指令
   - **Dynamic import 错误**：确保 server-only 代码不在客户端使用

   e. 重新验证：循环直到 lint 和 build 均成功

   f. 目标：
      - `npm run lint` 结果为 "0 errors"
      - `npm run build` 或 `pnpm build` 成功

   **关键**：此步骤为必须。lint 和 build 均须成功才能进入下一步。

### 第四步：最终验证与说明

**关键**：此步骤是项目完成的必要条件。lint 和 build 均须成功。

1. **ESLint 验证**：
   ```bash
   npm run lint
   ```

   - 成功示例：
     ```
     No ESLint warnings or errors
     ```

   - 失败示例（有 error 必须修复）：
     ```
     Error: 'useState' is defined but never used
     Error: Missing return type on function
     ```

2. **生产环境构建验证**：
   ```bash
   npm run build
   ```

   **或使用 pnpm 时**：
   ```bash
   pnpm build
   ```

   - 成功示例：
     ```
     Compiled successfully
     Linting and checking validity of types
     Collecting page data
     Generating static pages
     ```

   - 失败示例（有构建错误必须修复）：
     ```
     Type error: Property 'xyz' does not exist on type 'ABC'
     Error: Module not found: Can't resolve '@/...'
     ```

   **重要**：构建失败时须修复 TypeScript 类型错误或 import 路径问题后重新构建。

3. **验证结果摘要**（lint 和 build 均成功时）：
   ```
   Next.js 15 项目创建完成！
   依赖包安装完成（ShadCN, Zustand, Tanstack Query 等）
   ESLint 验证通过（0 errors）
   TypeScript 构建成功
   生产环境构建完成
   ```

4. **提供项目信息**：
   - **文件夹名**：[用户输入值]（如：my-todo-app）
   - **项目名**：[用户输入值]（如：todo-app）
   - **领域**：[所选领域]（Todo/Blog/Dashboard/E-commerce/Custom）
   - **所选技术栈**：[预设名]（ShadCN, Zustand, Tanstack Query 等）
   - **主要功能**：[领域] CRUD、API Routes、类型安全
   - **生成文件**：XX 个 TypeScript 文件（app, components, lib）

5. **运行说明**：
   ```bash
   cd [文件夹名]
   npm run dev
   # 在 http://localhost:3000 查看
   ```

6. **后续步骤建议**（可选，按领域）：
   - **Todo**：添加/编辑/删除项目、筛选（全部/进行中/已完成）、完成切换
   - **Blog**：文章编写/编辑、列表/详情页、搜索、标签
   - **Dashboard**：数据可视化、图表、用户管理、筛选
   - **E-commerce**：商品列表/详情、购物车、订单、类别
   - **通用**：TypeScript 类型安全、API 测试、部署（Vercel）

## 核心原则

- **App Router**：基于 Next.js 15 App Router 的结构
- **类型安全**：TypeScript Strict Mode
- **组件复用**：充分利用 ShadCN/ui
- **状态管理**：Zustand（客户端）、Tanstack Query（服务端）
- **代码质量**：ESLint + Prettier
- **表单验证**：React Hook Form + Zod

## 参考文件

[references/setup-guide.md](references/setup-guide.md) - 完整指南
- 基础设置（按领域 CRUD、API Routes、组件）
- 可选选项：ShadCN、Zustand、Tanstack Query、Drizzle ORM、Better Auth、Framer Motion

## 备注

- **对话式技能**：通过让用户选择领域和预设来定制应用配置
- **领域支持**：Todo、Blog、Dashboard、E-commerce、Custom（用户自定义）
- **预设提供**：Full Stack、Essential、Minimal、Custom
- **可选功能**：ShadCN、Zustand、Tanstack Query、Drizzle ORM、Better Auth、Framer Motion
- **默认包含**：Next.js 15（App Router）、TypeScript、Tailwind CSS、ESLint
- **平台**：Web（Vercel 优化）
- **质量保证**：
  - 所有项目必须通过 `npm run lint`
  - TypeScript Strict Mode
  - 保证类型安全
  - 遵循 App Router 模式
  - 按领域优化的 UI/UX

> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: A-Project-Initialization

---
name: nextjs-15-init
description: Create a domain-based Next.js 15 project with App Router and modern full-stack tooling
---

# Next.js 15 Init Skill

## Overview

Create a Next.js 15 project based on a selected domain (Todo, Blog, Dashboard, E-commerce, or Custom) with automatic modern stack configuration. The skill generates a complete CRUD application using App Router, TypeScript, Tailwind CSS, and optional integrations like ShadCN/ui, Zustand, Tanstack Query, and Drizzle ORM.

## Quick Start

The skill requires the following inputs:
- **Folder name** (e.g., `my-todo-app`)
- **Project name** (e.g., `todo-app`)
- **Domain selection** (Todo / Blog / Dashboard / E-commerce / Custom)
- **Tech stack preset** (Minimal / Essential / Full Stack / Custom)

After input, the following steps execute automatically:

```bash
# 1. Create Next.js 15 project (App Router, TypeScript, Tailwind)
npx create-next-app@latest [folder_name] --typescript --tailwind --app --use-npm

# 2. Install dependencies
npm install

# 3. Generate App Router structure by domain
# - app/[domain]/ (pages)
# - components/[domain]/ (components)
# - lib/stores/[domain].ts (Zustand state)
# - lib/api/[domain].ts (API logic)
# - lib/validations/[domain].ts (Zod schemas)

# 4. Code quality check (required)
npm run lint

# 5. Start dev server
npm run dev
```

## Task Guide

**Important**: This skill operates in conversational mode.

### Step 1: Ask for Domain and Project Configuration

**Prompt the user with:**

"Ready to create a Next.js 15 application. Please provide the following:

**1. Domain (Entity) Selection**

Which type of app would you like to build?

**A) Todo (Task Management)**
- Fields: title, description, completed, createdAt, updatedAt
- Features: CRUD, filtering (all/active/completed), checkbox toggle
- API: /api/todos (GET, POST, PATCH, DELETE)

**B) Blog (Blog/CMS)**
- Fields: title, content, excerpt, slug, published, createdAt, updatedAt
- Features: CRUD, post editor, list/detail pages, search
- API: /api/posts (GET, POST, PATCH, DELETE)

**C) Dashboard (Admin Dashboard)**
- Fields: analytics data, chart data, user management
- Features: Data visualization, tables, filtering, pagination
- API: /api/analytics, /api/users

**D) E-commerce**
- Fields: name, price, description, images, stock, category
- Features: Product listing/detail, cart, orders
- API: /api/products, /api/cart, /api/orders

**E) Custom**
- Define your own entity name and fields

**2. Project Info**
- **Folder name**: Directory for the project (default: `[domain]-app`)
- **Project name**: package.json name field (default: same as folder name)

**3. Tech Stack Preset**

**A) Essential (Recommended)**
- Next.js 15 (App Router), TypeScript, Tailwind CSS
- ShadCN/ui, Zustand, React Hook Form + Zod, Lucide Icons
- No Tanstack Query, Prisma, or NextAuth

**B) Minimal**
- Next.js 15 (App Router), TypeScript, Tailwind CSS
- No ShadCN, Zustand, React Hook Form, or other libraries

**C) Full Stack**
- Next.js 15 (App Router), TypeScript, Tailwind CSS
- ShadCN/ui, Zustand, Tanstack Query, React Hook Form + Zod
- Drizzle ORM, Better Auth, Framer Motion, Lucide Icons

**D) Custom**
- Select features individually

Choose domain and preset. (Domain: A/B/C/D/E, Preset: A/B/C/D)"

### Step 2: Follow-up Questions for Custom Options

#### 2-1. Custom Domain (E):
1. **Entity name**: e.g., Product, Post, User
2. **Field definitions**: Format `fieldName:type` (e.g., `title:string, price:number, isActive:boolean`)
   - Supported types: string, number, boolean, Date
   - `createdAt`, `updatedAt` added automatically
3. **Key features**: Fields for filtering/sorting

#### 2-2. Custom Tech Stack (D):
1. **UI Components**: Use ShadCN/ui? (Yes/No)
2. **State Management**: Use Zustand? (Yes/No)
3. **Server State**: Use Tanstack Query? (Yes/No)
4. **Form Management**: Use React Hook Form + Zod? (Yes/No)
5. **Database**: Use Drizzle ORM? (Yes/No)
6. **Authentication**: Use Better Auth? (Yes/No)
7. **Animations**: Use Framer Motion? (Yes/No)

### Step 3: Generate Project Based on Domain and Stack

1. **Create Next.js 15 project** using the specified folder name
2. **Install selected dependencies**: `npm install [packages]`
3. **Generate folder structure** (App Router based):
   ```
   app/
   ├── (auth)/
   ├── [domain]/
   ├── api/[domain]/
   ├── layout.tsx
   └── page.tsx
   components/
   ├── ui/ (ShadCN)
   ├── [domain]/
   └── layouts/
   lib/
   ├── db/ (Drizzle)
   ├── stores/ (Zustand)
   ├── api/
   ├── utils/
   └── validations/ (Zod)
   ```

4. **Generate domain-specific boilerplate**:

   | Domain | API Routes | Pages | Components | Store | Validation |
   |--------|-----------|-------|------------|-------|------------|
   | Todo | /api/todos (CRUD) | /todos, /todos/[id] | TodoList, TodoItem, TodoForm | useTodoStore | todoSchema |
   | Blog | /api/posts (CRUD) | /blog, /blog/[slug], /blog/write | PostList, PostCard, PostEditor | usePostStore | postSchema |
   | Dashboard | /api/analytics, /api/users | /dashboard, /dashboard/users | Chart, StatsCard, DataTable | useDashboardStore | userSchema |
   | E-commerce | /api/products, /api/cart, /api/orders | /products, /products/[id], /cart | ProductCard, ProductGrid, Cart | useCartStore, useProductStore | productSchema, cartSchema |
   | Custom | Basic CRUD | Basic List/Detail | Basic CRUD components | Basic store | Basic schema |

5. **Install and configure ShadCN** (Essential and above):
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button card input form table
   ```

6. **Lint and error fixing**:
   - Run `npm run lint` and fix errors (imports, types, unused vars, `'use client'` directives)
   - Run `npm run build` (or `pnpm build`) and fix build errors
   - Loop until both lint and build succeed

### Step 4: Final Verification

**Required**: Both lint and build must succeed.

1. Run `npm run lint` -- target: 0 errors
2. Run `npm run build` -- target: successful compilation
3. Provide project summary:
   - Folder name, project name, selected domain
   - Tech stack, key features, number of generated TypeScript files
4. Run instructions:
   ```bash
   cd [folder_name]
   npm run dev
   # View at http://localhost:3000
   ```

## Core Principles

- **App Router**: Built on Next.js 15 App Router architecture
- **Type Safety**: TypeScript Strict Mode throughout
- **Component Reuse**: Leverage ShadCN/ui components
- **State Management**: Zustand (client) + Tanstack Query (server)
- **Code Quality**: ESLint + Prettier
- **Form Validation**: React Hook Form + Zod schemas

## Notes

- **Conversational skill**: User selects domain and preset to customize the app
- **Domain support**: Todo, Blog, Dashboard, E-commerce, Custom
- **Presets**: Full Stack, Essential, Minimal, Custom
- **Optional features**: ShadCN, Zustand, Tanstack Query, Drizzle ORM, Better Auth, Framer Motion
- **Always included**: Next.js 15 (App Router), TypeScript, Tailwind CSS, ESLint
- **Platform**: Web (optimized for Vercel deployment)
- **Quality assurance**: All projects must pass `npm run lint` and `npm run build`, enforce TypeScript Strict Mode and App Router patterns

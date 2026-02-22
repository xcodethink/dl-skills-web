> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Backend Development

---
name: better-auth
description: Use when implementing authentication in TypeScript/JavaScript apps. Better Auth is a comprehensive, framework-agnostic auth framework with built-in email/password, social OAuth, and a plugin ecosystem for 2FA, passkeys, magic links, organizations, and more.
---

# Better Auth

## Overview

Better Auth is a comprehensive, framework-agnostic TypeScript authentication/authorization framework with built-in email/password login, social OAuth login, and a powerful plugin ecosystem for advanced feature extensions. Integrates with any framework including Next.js, Nuxt, SvelteKit, Remix, Astro, Hono, and Express.

## When to Use

- Implementing authentication in TypeScript/JavaScript applications
- Adding email/password or social OAuth authentication
- Setting up advanced auth features (2FA, passkeys, magic links)
- Building applications with organizations/multi-tenancy
- Managing sessions and user lifecycle
- Integrating with any framework (Next.js, Nuxt, SvelteKit, Remix, Astro, Hono, Express, etc.)

## Quick Start

### Installation

```bash
npm install better-auth
# or pnpm/yarn/bun add better-auth
```

### Environment Variables

Create a `.env` file:
```env
BETTER_AUTH_SECRET=<generated-secret-at-least-32-chars>
BETTER_AUTH_URL=http://localhost:3000
```

### Basic Server Configuration

Create `auth.ts` (in project root, lib/, utils/, or src/app/server/):

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // See references/database-integration.md
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true  // Auto sign in after registration
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }
  }
});
```

### Database Schema Generation

```bash
npx @better-auth/cli generate  # Generate schema/migration files
npx @better-auth/cli migrate   # Apply migrations (Kysely only)
```

### Mount API Handler

**Next.js App Router:**
```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

**Other frameworks:** See references/email-password-auth.md#framework-setup

### Client Configuration

Create `auth-client.ts`:

```ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
});
```

### Basic Usage

```ts
// Sign up
await authClient.signUp.email({
  email: "user@example.com",
  password: "secure123",
  name: "John Doe"
});

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "secure123"
});

// OAuth social login
await authClient.signIn.social({ provider: "github" });

// Get session
const { data: session } = authClient.useSession(); // React/Vue/Svelte
const { data: session } = await authClient.getSession(); // Vanilla JS
```

## Feature Selection Matrix

| Feature | Plugin Required | Use Case | Reference |
|---------|----------------|----------|-----------|
| Email/Password | No (built-in) | Basic auth | email-password-auth.md |
| OAuth (GitHub, Google, etc.) | No (built-in) | Social login | oauth-providers.md |
| Email Verification | No (built-in) | Verify email addresses | email-password-auth.md#email-verification |
| Password Reset | No (built-in) | Forgot password flow | email-password-auth.md#password-reset |
| 2FA/TOTP | Yes (`twoFactor`) | Enhanced security | advanced-features.md#two-factor-authentication |
| Passkeys/WebAuthn | Yes (`passkey`) | Passwordless auth | advanced-features.md#passkeys-webauthn |
| Magic Link | Yes (`magicLink`) | Email-based login | advanced-features.md#magic-link |
| Username Auth | Yes (`username`) | Username login | email-password-auth.md#username-authentication |
| Organizations/Multi-tenant | Yes (`organization`) | Team/org features | advanced-features.md#organizations |
| Rate Limiting | No (built-in) | Abuse prevention | advanced-features.md#rate-limiting |
| Session Management | No (built-in) | User sessions | advanced-features.md#session-management |

## Auth Method Selection Guide

**Choose email/password when:**
- Building standard web apps with traditional auth
- Need full control over user credentials
- Target users prefer email registration

**Choose OAuth when:**
- Want to reduce registration friction for quick sign-up
- Users already have social accounts
- Need access to social platform user profile data

**Choose passkeys when:**
- Want to provide a passwordless experience
- Target users have modern browsers/devices
- Security is the highest priority

**Choose magic links when:**
- Want passwordless experience without WebAuthn complexity
- Target users are email-centric
- Need temporary access links

**Combine multiple methods when:**
- Want to offer flexible choices for different user preferences
- Building enterprise apps with multiple auth requirements
- Need progressive enhancement (start simple, add more options)

## Core Architecture

Better Auth uses a client-server architecture:
1. **Server** (`better-auth`): Handles auth logic, database operations, API routes
2. **Client** (`better-auth/client`): Provides hooks/methods for the frontend
3. **Plugins**: Extend both server and client functionality

## Implementation Checklist

- [ ] Install `better-auth` package
- [ ] Set up environment variables (SECRET, URL)
- [ ] Create auth server instance with database config
- [ ] Run schema migrations (`npx @better-auth/cli generate`)
- [ ] Mount API handler in framework
- [ ] Create client instance
- [ ] Implement sign-up/sign-in UI
- [ ] Add session management in components
- [ ] Set up protected routes/middleware
- [ ] Add plugins as needed (regenerate schema after adding)
- [ ] Test complete auth flows
- [ ] Configure email sending (verification/reset)
- [ ] Enable rate limiting for production
- [ ] Set up error handling

## Reference Documentation

### Core Authentication
- Email/Password Authentication -- Email/password setup, verification, password reset, username auth
- OAuth Providers -- Social login setup, provider configuration, token management
- Database Integration -- Database adapters, schema setup, migrations

### Advanced Features
- Advanced Features -- 2FA/MFA, passkeys, magic links, organizations, rate limiting, session management

## Scripts

- `scripts/better_auth_init.py` -- Initialize Better Auth configuration with interactive setup

## Resources

- Documentation: https://www.better-auth.com/docs
- GitHub: https://github.com/better-auth/better-auth
- Plugins: https://www.better-auth.com/docs/plugins
- Examples: https://www.better-auth.com/docs/examples

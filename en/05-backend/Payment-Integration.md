> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Backend Development

---
name: payment-integration
description: Use when integrating payment processing. Covers SePay (Vietnamese banking), Polar (global SaaS), Stripe (global infrastructure), Paddle (MoR subscriptions), and Creem.io (MoR + licensing). Production-proven patterns for checkout, subscriptions, webhooks, and multi-provider order management.
---

# Payment Integration

## Overview

Production-proven payment processing solutions covering SePay (Vietnamese banking), Polar (global SaaS), Stripe (global infrastructure), Paddle (MoR subscriptions), and Creem.io (MoR + licensing). Includes patterns for checkout flows, subscription management, webhook handling, and multi-provider order management.

## When to Use

- Payment gateway integration (checkout, processing)
- Subscription management (trials, upgrades, billing)
- Webhook handling (notifications, idempotency)
- QR code payments (VietQR, NAPAS)
- Software licensing (device activation)
- Multi-provider order management
- Revenue sharing and commissions

## Platform Selection

| Platform | Best For |
|----------|----------|
| **SePay** | Vietnamese market, VND, bank transfers, VietQR |
| **Polar** | Global SaaS, subscriptions, automated benefit delivery (GitHub/Discord) |
| **Stripe** | Enterprise payments, Connect platform, custom checkout |
| **Paddle** | MoR (Merchant of Record) subscriptions, global tax compliance, churn prevention |
| **Creem.io** | MoR + licensing, revenue sharing, no-code checkout |

## Quick Reference

### SePay
- `references/sepay/overview.md` -- Authentication, supported banks
- `references/sepay/api.md` -- API endpoints, transactions
- `references/sepay/webhooks.md` -- Webhook setup and verification
- `references/sepay/sdk.md` -- Node.js, PHP, Laravel SDK
- `references/sepay/qr-codes.md` -- VietQR code generation
- `references/sepay/best-practices.md` -- Production patterns

### Polar
- `references/polar/overview.md` -- Authentication, MoR concepts
- `references/polar/products.md` -- Pricing models
- `references/polar/checkouts.md` -- Checkout flow
- `references/polar/subscriptions.md` -- Subscription lifecycle management
- `references/polar/webhooks.md` -- Event handling
- `references/polar/benefits.md` -- Automated benefit delivery
- `references/polar/sdk.md` -- Multi-language SDKs
- `references/polar/best-practices.md` -- Production patterns

### Stripe
- `references/stripe/stripe-best-practices.md` -- Integration design
- `references/stripe/stripe-sdks.md` -- Server SDKs
- `references/stripe/stripe-js.md` -- Payment Element
- `references/stripe/stripe-cli.md` -- Local testing
- `references/stripe/stripe-upgrade.md` -- Version upgrades
- External docs: https://docs.stripe.com/llms.txt

### Paddle
- `references/paddle/overview.md` -- MoR, authentication, entity IDs
- `references/paddle/api.md` -- Products, prices, transactions
- `references/paddle/paddle-js.md` -- Overlay/inline checkout
- `references/paddle/subscriptions.md` -- Trials, upgrades, pausing
- `references/paddle/webhooks.md` -- SHA256 signature verification
- `references/paddle/sdk.md` -- Node, Python, PHP, Go SDKs
- `references/paddle/best-practices.md` -- Production patterns
- External docs: https://developer.paddle.com/llms.txt

### Creem.io
- `references/creem/overview.md` -- MoR, authentication, global support
- `references/creem/api.md` -- Products, checkout sessions
- `references/creem/checkouts.md` -- No-code links, storefronts
- `references/creem/subscriptions.md` -- Trials, per-seat billing
- `references/creem/licensing.md` -- Device activation
- `references/creem/webhooks.md` -- Signature verification
- `references/creem/sdk.md` -- Next.js, Better Auth integration
- External docs: https://docs.creem.io/llms.txt

### Multi-Provider
- `references/multi-provider-order-management-patterns.md` -- Unified order management, currency conversion

### Scripts
- `scripts/sepay-webhook-verify.js` -- SePay webhook verification
- `scripts/polar-webhook-verify.js` -- Polar webhook verification
- `scripts/checkout-helper.js` -- Checkout session generator

## Core Capabilities

| Platform | Key Highlights |
|----------|---------------|
| **SePay** | QR/bank/card payments, 44+ Vietnamese banks, webhooks, 2 req/sec |
| **Polar** | MoR, subscriptions, usage billing, benefit delivery, 300 req/min |
| **Stripe** | CheckoutSession, Billing, Connect platform, Payment Element |
| **Paddle** | MoR, overlay/inline checkout, Retain (churn prevention), tax handling |
| **Creem.io** | MoR, licensing, revenue sharing, no-code checkout |

## Implementation Workflow

See `references/implementation-workflows.md` for step-by-step guides per platform.

**Common flow:** Authentication -> Product setup -> Checkout -> Webhooks -> Event handling

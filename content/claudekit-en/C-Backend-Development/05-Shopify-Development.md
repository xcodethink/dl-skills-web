> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Backend Development

---
name: shopify-development
description: Use when building on the Shopify platform - apps, extensions, themes, and API integrations. Covers Shopify CLI, GraphQL Admin API, Polaris UI, Liquid templating, checkout/admin/POS extensions, and Shopify Functions.
---

# Shopify Development

## Overview

Comprehensive guide for building apps, extensions, themes, and API integrations on the Shopify platform. Covers the full development lifecycle from project setup to deployment, including GraphQL APIs, Liquid templating, and all extension types.

## Platform Overview

**Core Components:**
- **Shopify CLI** -- Development workflow tooling
- **GraphQL Admin API** -- Primary data manipulation API (recommended)
- **REST Admin API** -- Legacy API (maintenance mode)
- **Polaris UI** -- Design system for unified interfaces
- **Liquid** -- Theme templating language

**Extension Points:**
- Checkout UI -- Customize checkout experience
- Admin UI -- Extend admin panels
- POS UI -- Point of Sale customization
- Customer Account -- Post-purchase pages
- Theme App Extensions -- Theme-embedded features

## Quick Start

### Prerequisites

```bash
# Install Shopify CLI
npm install -g @shopify/cli@latest

# Verify installation
shopify version
```

### Create a New App

```bash
# Initialize app
shopify app init

# Start development server
shopify app dev

# Generate extension
shopify app generate extension --type checkout_ui_extension

# Deploy
shopify app deploy
```

### Theme Development

```bash
# Initialize theme
shopify theme init

# Start local preview
shopify theme dev

# Pull from store
shopify theme pull --live

# Push to store
shopify theme push --development
```

## Development Workflow

### 1. App Development

**Initialize:**
```bash
shopify app init
cd my-app
```

**Configure access scopes** (`shopify.app.toml`):
```toml
[access_scopes]
scopes = "read_products,write_products,read_orders"
```

**Start development:**
```bash
shopify app dev  # Start local server and create tunnel
```

**Add extensions:**
```bash
shopify app generate extension --type checkout_ui_extension
```

**Deploy:**
```bash
shopify app deploy  # Build and upload to Shopify
```

### 2. Extension Development

**Available types:**
- Checkout UI -- `checkout_ui_extension`
- Admin Action -- `admin_action`
- Admin Block -- `admin_block`
- POS UI -- `pos_ui_extension`
- Function -- `function` (discounts, payments, shipping, validation)

**Development flow:**
```bash
shopify app generate extension
# Select type, configure
shopify app dev  # Local testing
shopify app deploy  # Publish
```

### 3. Theme Development

**Initialize:**
```bash
shopify theme init
# Choose Dawn (reference theme) or start from scratch
```

**Local development:**
```bash
shopify theme dev
# Preview at localhost:9292
# Auto-syncs to development theme
```

**Deploy:**
```bash
shopify theme push --development  # Push to development theme
shopify theme publish --theme=123  # Set as live theme
```

## Build Type Selection Guide

### Build an App When:
- Integrating external services
- Adding functionality to multiple stores
- Building merchant-facing admin tools
- Programmatically managing store data
- Implementing complex business logic
- Need to charge for functionality

### Build an Extension When:
- Customizing checkout flow
- Adding fields/features to admin pages
- Creating POS actions for retail
- Implementing discount/payment/shipping rules
- Extending customer account pages

### Build a Theme When:
- Creating custom storefront designs
- Building unique shopping experiences
- Customizing product/collection pages
- Implementing brand-specific layouts
- Modifying homepage/content pages

### Combined Approach:
**App + Theme Extension:**
- App handles backend logic and data
- Theme extension provides storefront UI
- Examples: product reviews, wishlists, size guides

## Core Patterns

### GraphQL Product Query

```graphql
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        variants(first: 5) {
          edges {
            node {
              id
              price
              inventoryQuantity
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Checkout Extension (React)

```javascript
import { reactExtension, BlockStack, TextField, Checkbox } from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
  const [message, setMessage] = useState('');

  return (
    <BlockStack>
      <TextField label="Gift message" value={message} onChange={setMessage} />
    </BlockStack>
  );
}
```

### Liquid Product Display

```liquid
{% for product in collection.products %}
  <div class="product-card">
    <img src="{{ product.featured_image | img_url: 'medium' }}" alt="{{ product.title }}">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
    <a href="{{ product.url }}">View Details</a>
  </div>
{% endfor %}
```

## Best Practices

**API Usage:**
- Prefer GraphQL over REST for new development
- Request only needed fields to reduce costs
- Implement pagination for large datasets
- Use Bulk Operations for batch processing
- Respect rate limits (GraphQL uses cost-based calculation)

**Security:**
- Store API credentials in environment variables
- Validate webhook signatures
- Use OAuth for public apps
- Request minimum permission scopes
- Implement Session Tokens for embedded apps

**Performance:**
- Cache API responses appropriately
- Optimize images in themes
- Reduce Liquid logic complexity
- Use async loading for extensions
- Monitor GraphQL query costs

**Testing:**
- Use development stores for testing
- Test across different store plans
- Validate mobile responsiveness
- Check accessibility (keyboard, screen readers)
- Ensure GDPR compliance

## Reference Documentation

Detailed advanced guides:

- **App Development** -- OAuth, API, webhooks, billing
- **Extensions** -- Checkout, Admin, POS, Functions
- **Themes** -- Liquid, Sections, deployment

## Scripts

**shopify_init.py** -- Interactive Shopify project initialization
```bash
python scripts/shopify_init.py
```

## Troubleshooting

**Rate Limit Errors:**
- Monitor `X-Shopify-Shop-Api-Call-Limit` header
- Implement exponential backoff
- Use Bulk Operations for large datasets

**Authentication Failures:**
- Verify Access Token is valid
- Check that required scopes are granted
- Ensure OAuth flow is complete

**Extension Not Appearing:**
- Verify extension target is correct
- Check that extension is published
- Ensure app is installed on the store

**Webhook Not Receiving:**
- Verify webhook URL is accessible
- Check signature verification logic
- Review logs in Partner Dashboard

## Resources

**Official Documentation:**
- Shopify Docs: https://shopify.dev/docs
- GraphQL API: https://shopify.dev/docs/api/admin-graphql
- Shopify CLI: https://shopify.dev/docs/api/shopify-cli
- Polaris: https://polaris.shopify.com

**Tools:**
- GraphiQL Explorer (Admin -> Settings -> Apps -> Develop apps)
- Partner Dashboard (app management)
- Development stores (free testing)

**API Versioning:**
- Quarterly releases (YYYY-MM format)
- Current version: 2025-01
- Each version supported for 12 months
- Always test before upgrading versions

---

**Note:** This skill covers Shopify platform information as of January 2025. Refer to official documentation for the latest updates.

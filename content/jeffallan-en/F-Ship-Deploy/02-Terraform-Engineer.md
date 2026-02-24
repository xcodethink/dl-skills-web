> Source: [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | Category: Ship & Deploy

---
name: terraform-engineer
description: Use when implementing infrastructure as code with Terraform across AWS, Azure, or GCP. Invoke for module development, state management, provider configuration, multi-environment workflows.
---

# Terraform Engineer

## Overview

Senior Terraform engineer specializing in infrastructure as code across AWS, Azure, and GCP. Expert in modular design, state management, and production-grade patterns.

## When to Use

- Building Terraform modules for reusability
- Implementing remote state with locking
- Configuring AWS, Azure, or GCP providers
- Setting up multi-environment workflows
- Implementing infrastructure testing
- Migrating to Terraform or refactoring IaC

## Core Workflow

1. **Analyze** — Review requirements, existing code, cloud platforms
2. **Design modules** — Create composable, validated modules
3. **Implement state** — Configure remote backends with locking and encryption
4. **Secure** — Apply security policies, least privilege, encryption
5. **Test** — terraform plan, policy checks, automated tests

## Module Structure

```
modules/
└── vpc/
    ├── main.tf          # Resource definitions
    ├── variables.tf     # Input variables + validation
    ├── outputs.tf       # Output values
    ├── versions.tf      # Provider version constraints
    └── README.md        # Module documentation
```

## Constraints

### MUST DO
- Semantic versioning for modules
- Enable remote state with locking
- Validate inputs with validation blocks
- Consistent naming conventions
- Tag all resources for cost tracking
- Document module interfaces
- Pin provider versions
- Run `terraform fmt` and `validate`

### MUST NOT
- Store secrets in plain text
- Use local state for production
- Skip state locking
- Hardcode environment-specific values
- Mix provider versions without constraints
- Create circular module dependencies
- Commit .terraform directories

## Knowledge Reference

Terraform 1.5+, HCL syntax, AWS/Azure/GCP providers, remote backends (S3, Azure Blob, GCS), state locking (DynamoDB), workspaces, modules, dynamic blocks, for_each/count, terratest, tflint, OPA

> Source: DL Skills Curated | Category: Ship & Deploy

---
name: dependency-security-audit
description: Supply chain security workflow covering dependency inventory, vulnerability scanning, and automated monitoring
---

# Dependency Security Audit

## Overview

Over 80% of modern application code comes from third-party dependencies. A single compromised package can jeopardize your entire system. This skill provides a systematic approach to managing supply chain security risks.

## Why It Matters

- Supply chain attacks are growing year over year and are now a primary attack vector
- A single malicious package can steal environment variables, inject backdoors, or mine cryptocurrency
- Transitive dependencies make risks difficult to spot by inspection alone

## 5-Step Audit Workflow

1. **Inventory** -- Generate a complete dependency list with version information
2. **Scan** -- Use automated tools to detect known vulnerabilities
3. **Evaluate** -- Assess severity and blast radius of each finding
4. **Remediate** -- Upgrade, replace, or add mitigations
5. **Monitor** -- Continuously watch for newly disclosed vulnerabilities

## Audit Tools Comparison

| Tool | Ecosystem | Type | Notes |
|------|-----------|------|-------|
| `npm audit` | Node.js | Built-in | Zero config, works out of the box |
| `pip-audit` | Python | Official | Based on OSV vulnerability database |
| `cargo audit` | Rust | Community | Based on RustSec advisory database |
| Dependabot | Multi-language | GitHub built-in | Auto-creates upgrade PRs |
| Snyk | Multi-language | Commercial/Free | Deep analysis, fix suggestions |
| Socket.dev | Node.js/Python | Commercial/Free | Behavior analysis, detects malicious packages |

## Lock File Management

Lock files ensure every environment installs the exact same dependency versions. They are the cornerstone of supply chain security.

| Package Manager | Lock File | Notes |
|----------------|-----------|-------|
| npm | `package-lock.json` | Must be committed |
| yarn | `yarn.lock` | Must be committed |
| pnpm | `pnpm-lock.yaml` | Must be committed |
| pip | `requirements.txt` + hashes | Use `pip freeze` for exact versions |
| cargo | `Cargo.lock` | Commit for applications; omit for libraries |

## Typosquatting Prevention

Attackers register packages with names similar to popular ones, exploiting developer typos.

**Prevention:**
- Double-check package name spelling before installing
- Verify publisher, download count, and repository link
- Use tools like Socket.dev to detect packages with anomalous behavior
- Set up an allowed-dependencies allowlist in CI

## License Compliance

| License Type | Commercial Use | Notes |
|-------------|----------------|-------|
| MIT / BSD / Apache 2.0 | Permissive | Retain copyright notice |
| LGPL | Allowed | Dynamic linking unrestricted; static linking requires source |
| GPL | Restricted | Derivative works must be open-sourced |
| AGPL | Strictly restricted | Network use counts as distribution; must open-source |

## Automated Monitoring Setup

**Dependabot config (`.github/dependabot.yml`):**

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

**CI audit job:** Add `npm audit --audit-level=high` to your CI pipeline; fail the build on high-severity findings.

## MUST DO / MUST NOT

**MUST DO:**
- Pin dependency versions and commit lock files
- Run dependency audit before every deploy
- Review new dependencies in PRs for necessity and security
- Update dependencies regularly; do not accumulate debt

**MUST NOT:**
- Ignore warnings from audit tools
- Use unpinned versions (e.g., `^1.0.0`) in production
- Add new dependencies without review
- Use unmaintained packages (last updated over 2 years ago)

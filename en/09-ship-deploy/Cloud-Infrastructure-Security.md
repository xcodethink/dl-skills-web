# Cloud Infrastructure Security

> **Source**: [affaan-m/everything-claude-code](https://github.com/AffaanM/everything-claude-code)
> **Original file**: skills/security-review/cloud-infrastructure-security.md
> **Category**: E-Security

---

## Overview

Ensures cloud infrastructure, CI/CD pipelines, and deployment configurations follow security best practices. Covers IAM, secrets management, network security, logging/monitoring, CI/CD pipeline security, CDN/WAF, and backup/disaster recovery.

---

## When to Activate

- Deploying to cloud platforms (AWS, Vercel, Railway, Cloudflare)
- Configuring IAM roles and permissions
- Setting up CI/CD pipelines
- Implementing Infrastructure as Code (Terraform, CloudFormation)
- Configuring logging and monitoring
- Managing secrets in cloud environments
- Setting up CDN and edge security
- Implementing disaster recovery and backup strategies

---

## Cloud Security Checklist

### 1. IAM & Access Control

**Least Privilege:**
```yaml
# CORRECT: Minimal permissions
iam_role:
  permissions:
    - s3:GetObject
    - s3:ListBucket
  resources:
    - arn:aws:s3:::my-bucket/*

# WRONG: Overly broad
iam_role:
  permissions:
    - s3:*
  resources:
    - "*"
```

**Verification:**
- No root account usage in production
- MFA enabled for all privileged accounts
- Service accounts use roles, not long-lived credentials
- Regular access reviews conducted

### 2. Secrets Management

Use cloud secrets managers with automatic rotation:
```typescript
import { SecretsManager } from '@aws-sdk/client-secrets-manager';
const client = new SecretsManager({ region: 'us-east-1' });
const secret = await client.getSecretValue({ SecretId: 'prod/api-key' });
```

Key checks:
- All secrets in cloud secrets manager (not just env vars)
- Automatic rotation for database credentials
- API keys rotated quarterly
- Audit logging for secret access

### 3. Network Security

```terraform
# Restricted security group
resource "aws_security_group" "app" {
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # Internal VPC only
  }
}
```

Key checks:
- Database not publicly accessible
- SSH/RDP restricted to VPN/bastion
- VPC flow logs enabled

### 4. Logging & Monitoring

- CloudWatch/logging enabled for all services
- Failed auth attempts logged
- Admin actions audited
- 90+ day retention for compliance
- Alerts for suspicious activity
- Centralized, tamper-proof logs

### 5. CI/CD Pipeline Security

```yaml
# Secure GitHub Actions
jobs:
  deploy:
    permissions:
      contents: read  # Minimal permissions
    steps:
      - uses: actions/checkout@v4
      - uses: trufflesecurity/trufflehog@main    # Secret scanning
      - run: npm audit --audit-level=high         # Dependency audit
      - uses: aws-actions/configure-aws-credentials@v4  # OIDC auth
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
```

Key checks:
- OIDC instead of long-lived credentials
- Secret and dependency scanning in pipeline
- Branch protection and code review required
- Signed commits enforced

### 6. CDN & WAF (Cloudflare)

- WAF enabled with OWASP rules
- Rate limiting configured
- Bot and DDoS protection active
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- SSL/TLS strict mode

### 7. Backup & Disaster Recovery

```terraform
resource "aws_db_instance" "main" {
  backup_retention_period = 30
  deletion_protection     = true
}
```

Key checks:
- Automated daily backups
- Point-in-time recovery enabled
- Quarterly backup testing
- RPO and RTO defined and tested

---

## Pre-Deployment Checklist

- [ ] IAM: No root, MFA, least privilege
- [ ] Secrets: Cloud secrets manager with rotation
- [ ] Network: Restricted security groups, no public databases
- [ ] Logging: Enabled with retention and alerts
- [ ] CI/CD: OIDC, secret scanning, dependency audits
- [ ] CDN/WAF: OWASP rules enabled
- [ ] Encryption: At rest and in transit
- [ ] Backups: Automated with tested recovery
- [ ] Compliance: GDPR/HIPAA met (if applicable)
- [ ] Incident Response: Plan in place

---

## Common Misconfigurations

| Issue | Wrong | Right |
|-------|-------|-------|
| S3 bucket | `acl public-read` | Private + specific policy |
| RDS | `publicly_accessible = true` | `false` + VPC security groups |
| Security groups | All ports open (`0-65535`) | Only required ports |
| IAM | `s3:*` on `*` | Specific actions on specific resources |

---

**Remember**: Cloud misconfigurations are the leading cause of data breaches. Always follow least privilege and defense in depth.

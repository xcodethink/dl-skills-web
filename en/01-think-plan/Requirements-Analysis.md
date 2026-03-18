> Source: DL Skills Curated | Category: Think & Plan

---
name: requirements-analysis
description: Use when transforming vague ideas into structured requirements with user stories, acceptance criteria, and prioritization.
---

# Requirements Analysis

## Overview

Most development failures happen because requirements were unclear, not because code was bad. "Build a user management system" is not a requirement. "Users can register via email and receive a verification email within 3 seconds" is. This skill provides a complete workflow for transforming vague ideas into executable requirements.

## When to Use

- Pre-project requirements gathering
- Converting stakeholder descriptions into structured documents
- Breaking down and prioritizing user stories for sprint planning
- Reviewing whether requirements are complete and testable

## 5-Step Requirements Workflow

| Step | Action | Key Question |
|------|--------|--------------|
| 1. Clarify Goal | Define the problem and who it affects | If we skip this feature, who suffers? |
| 2. Identify Users | List all roles and usage scenarios | Who uses it? Under what circumstances? |
| 3. Write User Stories | Describe each requirement in standard format | What does the user want? Why? |
| 4. Define Acceptance Criteria | Write Given/When/Then for each story | How do we know it is done? |
| 5. Prioritize (MoSCoW) | Rank requirements by importance | What must ship? What can wait? |

## User Story Format

Standard template:

```
As a [role], I want [action], so that [benefit]
```

Good example:

```
As a registered user, I want to reset my password via email, so that I can recover account access when I forget my password.
```

Bad example:

```
User needs password reset feature. (Missing role, missing benefit, not testable)
```

## Acceptance Criteria

Use Given/When/Then format with concrete data:

```
Scenario: Registered user resets password
  Given the user is registered and email is verified
  When the user clicks "Forgot Password" and enters their registered email
  Then the system sends an email with a reset link within 30 seconds
  And the link expires after 24 hours
  And a used link cannot be reused
```

## Scope Control

Every requirements document must define three explicit lists:

| List | Purpose | Example |
|------|---------|---------|
| In Scope | Must deliver this iteration | Email registration, password reset |
| Out of Scope | Explicitly excluded | Third-party login, phone registration |
| Future | Consider in later iterations | SSO integration, multi-factor auth |

Purpose: prevent scope creep by forcing explicit trade-off decisions.

## Non-Functional Requirements Checklist

| Dimension | Define |
|-----------|--------|
| Performance | Response time targets (e.g., P95 < 200ms), concurrent user count |
| Security | Auth method, encryption requirements, compliance (GDPR, etc.) |
| Accessibility | WCAG level (A/AA/AAA), screen reader support |
| Browser/Device | Supported browser versions, mobile responsiveness |
| Availability | SLA target (e.g., 99.9%), disaster recovery plan |

## Prioritization: MoSCoW Method

| Level | Meaning | Suggested Share |
|-------|---------|-----------------|
| Must | Cannot launch without it | ~60% |
| Should | Important but has workarounds | ~20% |
| Could | Nice to have | ~15% |
| Won't | Explicitly excluded this cycle | ~5% |

## MUST DO / MUST NOT

**MUST DO:**
- Write acceptance criteria before writing code
- Define a clear Definition of Done
- Identify edge cases and error flows upfront
- Replace vague descriptions with concrete numbers ("fast" becomes "P95 < 200ms")

**MUST NOT:**
- Start coding with vague requirements ("make a nice UI" is not a requirement)
- Add scope mid-sprint without re-prioritization (scope creep)
- Assume unstated requirements (when unsure, ask)
- Put implementation details in requirements docs (requirements say what, not how)

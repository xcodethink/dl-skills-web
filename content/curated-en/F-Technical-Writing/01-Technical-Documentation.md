> Source: DL Skills Curated | Category: Content & Marketing

---
name: technical-documentation
description: Use when writing or improving technical documents including READMEs, API docs, architecture decision records, and onboarding guides.
---

# Technical Documentation

## Overview

Code tells machines what to do. Documentation tells humans why. A project without docs takes three times longer to onboard. A repo without a README means nobody tries your library. This skill covers the most common document types in daily development and their writing standards.

## When to Use

- Writing READMEs for open-source projects
- Authoring API reference documentation
- Recording architecture decisions (ADR)
- Creating onboarding guides for new team members
- Reviewing documentation quality

## Document Types

| Type | Audience | Core Question |
|------|----------|---------------|
| README | First-time visitors | What is this? How do I use it? |
| API Docs | Integration developers | How do I call it? What are the parameters? |
| ADR | Team members, future maintainers | Why was it designed this way? |
| Changelog | Users, ops | What changed in this release? |
| Onboarding Guide | New team members | How do I set up the dev environment? |

## README Template

A complete README includes these sections in order:

1. **Project name** + badges
2. **One-line description** — what the project does in one sentence
3. **Quickstart** — running in 3 steps or fewer
4. **Installation** — detailed setup instructions
5. **Usage** — core feature examples
6. **Configuration** — configurable options and defaults
7. **Contributing** — how to participate
8. **License** — open-source license

Principle: readers decide in 30 seconds if they need this project, and run the first example within 3 minutes.

## API Documentation Structure

Every endpoint must include:

- **Path and method**: `POST /api/v1/users`
- **Parameters**: path params, query params, request body (with types and required flags)
- **Request example**: complete curl or code snippet
- **Response examples**: one success + one error response
- **Error codes**: possible errors with handling guidance
- **Authentication**: whether auth is required and which permissions

## Architecture Decision Record (ADR)

Format:

```markdown
# ADR-001: Choose PostgreSQL as Primary Database

## Status
Accepted

## Context
The project requires complex queries, transactional consistency, and JSON storage...

## Decision
Adopt PostgreSQL 15 because...

## Consequences
Positive: strong transaction support, JSON query capabilities...
Negative: higher ops complexity than SQLite...
```

The value of an ADR is recording the "why," not the "what." Six months later, an ADR explains the trade-offs behind the code.

## Writing Principles

1. **Scannable** — organize with headings, lists, and tables; avoid walls of text
2. **Example-first** — show the example, then explain the concept
3. **Assume the reader is busy** — put the most important information first
4. **Test your examples** — every code sample in the docs must actually run
5. **Show input and output** — code examples include both input data and expected output

## Code Example Standards

```python
# Good: shows input and output with realistic data
response = client.post("/api/v1/users", json={
    "name": "Alice Chen",
    "email": "alice@example.com"
})
# Output: {"id": 42, "name": "Alice Chen", "status": "active"}
```

Avoid placeholder data like `foo`, `bar`, `test123`. Use data that resembles real scenarios.

## Documentation Maintenance

- **Docs-as-code** — keep docs in the same repo, same PR as code changes
- **Version your docs** — state which API/software version the docs cover
- **Link to source** — link key concepts to specific code files
- **Regular review** — check for staleness at every release

## MUST DO / MUST NOT

**MUST DO:**
- Update docs when changing code
- Include a Quickstart section in every README
- Test every code example in the documentation
- Provide both success and error response examples in API docs

**MUST NOT:**
- Write walls of unstructured text
- Use jargon without explanation
- Let documentation drift from implementation (docs say v1, code is v3)
- Document only "how to use" without "why it was designed this way"

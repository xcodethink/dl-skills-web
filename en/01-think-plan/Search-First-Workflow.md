> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Search-First Workflow

## Overview

Systematizes the "search for existing solutions before implementing" workflow. Before writing custom code, search for existing tools, libraries, packages, MCP servers, and skills. Then decide: adopt as-is, extend/wrap, or build custom (informed by research).

---

## When to Use

- Starting a new feature that likely has existing solutions
- Adding a dependency or integration
- User asks "add X functionality" and you're about to write code
- Before creating a new utility, helper, or abstraction

---

## Workflow

```
1. NEED ANALYSIS     — Define functionality needed, identify constraints
2. PARALLEL SEARCH   — npm/PyPI, MCP servers, Skills, GitHub/Web
3. EVALUATE          — Score candidates (functionality, maintenance, community, docs, license, deps)
4. DECIDE            — Adopt / Extend / Compose / Build
5. IMPLEMENT         — Install package / Configure MCP / Write minimal custom code
```

---

## Decision Matrix

| Signal | Action |
|--------|--------|
| Exact match, well-maintained, MIT/Apache | **Adopt** — install and use directly |
| Partial match, good foundation | **Extend** — install + thin wrapper |
| Multiple weak matches | **Compose** — combine 2-3 small packages |
| Nothing suitable found | **Build** — write custom, but informed by research |

---

## Quick Search Checklist

Before writing a utility or adding functionality:

1. **Common problem?** Search npm/PyPI
2. **MCP available?** Check `~/.claude/settings.json` and search
3. **Skill exists?** Check `~/.claude/skills/`
4. **GitHub template?** Search GitHub

---

## Search Shortcuts by Category

| Category | Tools |
|----------|-------|
| Linting | `eslint`, `ruff`, `textlint`, `markdownlint` |
| Formatting | `prettier`, `black`, `gofmt` |
| Testing | `jest`, `pytest`, `go test` |
| HTTP clients | `httpx` (Python), `ky`/`got` (Node) |
| Validation | `zod` (TS), `pydantic` (Python) |
| Markdown | `remark`, `unified`, `markdown-it` |
| Image optimization | `sharp`, `imagemin` |

---

## Integration Points

- **With planner agent**: Researcher identifies tools before architecture review, planner incorporates them
- **With architect agent**: Consult researcher for stack decisions and reference architectures
- **With iterative-retrieval**: Cycle 1 broad search, Cycle 2 evaluate candidates, Cycle 3 test compatibility

---

## Examples

**"Add dead link checking"** — Found `textlint-rule-no-dead-link`, adopted directly. Zero custom code.

**"Add HTTP client wrapper"** — Found `got` (Node) / `httpx` (Python) with built-in retry. Adopted directly. Zero custom code.

**"Add config file linter"** — Found `ajv-cli`, adopted + wrote project-specific schema. 1 package + 1 schema file, no custom validation logic.

---

## Anti-Patterns

| Anti-Pattern | Problem |
|-------------|---------|
| Jumping to code | Writing a utility without checking if one exists |
| Ignoring MCP | Not checking if an MCP server provides the capability |
| Over-customizing | Wrapping a library so heavily it loses its benefits |
| Dependency bloat | Installing a massive package for one small feature |

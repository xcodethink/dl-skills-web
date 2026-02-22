> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: G-Tools-and-Productivity

---
name: docs-seeker
description: Intelligent discovery and analysis of technical documentation through llms.txt, repository analysis, and parallel exploration strategies
---

# Documentation Discovery and Analysis (Docs Seeker)

## Overview

Intelligently discover and analyze technical documentation through multiple strategies: llms.txt lookup (prioritizing context7.com), GitHub repository analysis via Repomix, parallel exploration with multiple agents, and fallback research when other methods are unavailable.

## Core Workflow

### Phase 1: Initial Discovery

1. **Identify Target**
   - Extract library/framework name from user request
   - Note version requirements (default: latest)
   - Clarify scope if ambiguous
   - Identify whether target is a GitHub repository or website

2. **Search for llms.txt (Prefer context7.com)**

   **First: Try context7.com pattern**

   For GitHub repositories:
   ```
   Pattern: https://context7.com/{org}/{repo}/llms.txt
   Examples:
   - https://github.com/imagick/imagick -> https://context7.com/imagick/imagick/llms.txt
   - https://github.com/vercel/next.js -> https://context7.com/vercel/next.js/llms.txt
   - https://github.com/better-auth/better-auth -> https://context7.com/better-auth/better-auth/llms.txt
   ```

   For websites:
   ```
   Pattern: https://context7.com/websites/{normalized-domain-path}/llms.txt
   Examples:
   - https://docs.imgix.com/ -> https://context7.com/websites/imgix/llms.txt
   - https://docs.byteplus.com/en/docs/ModelArk/ -> https://context7.com/websites/byteplus_en_modelark/llms.txt
   - https://docs.haystack.deepset.ai/docs -> https://context7.com/websites/haystack_deepset_ai/llms.txt
   - https://ffmpeg.org/doxygen/8.0/ -> https://context7.com/websites/ffmpeg_doxygen_8_0/llms.txt
   ```

   **Topic-specific search** (when user asks about a specific feature):
   ```
   Pattern: https://context7.com/{path}/llms.txt?topic={query}
   Examples:
   - https://context7.com/shadcn-ui/ui/llms.txt?topic=date
   - https://context7.com/shadcn-ui/ui/llms.txt?topic=button
   - https://context7.com/vercel/next.js/llms.txt?topic=cache
   - https://context7.com/websites/ffmpeg_doxygen_8_0/llms.txt?topic=compress
   ```

   **Fallback: Traditional llms.txt search**
   ```
   WebSearch: "[library-name] llms.txt site:[docs-domain]"
   ```
   Common patterns:
   - `https://docs.[library].com/llms.txt`
   - `https://[library].dev/llms.txt`
   - `https://[library].io/llms.txt`

   If found, proceed to Phase 2; if not found, proceed to Phase 3.

### Phase 2: llms.txt Processing

**Single URL:**
- Use WebFetch to retrieve content
- Extract and present information

**Multiple URLs (3+):**
- **Critical**: Launch multiple Explorer agents in parallel
- Each agent handles a major documentation section (up to 5 in the first batch)
- Each agent reads its assigned URLs
- Consolidate findings into a comprehensive report

Example:
```
Launch 3 Explorer agents simultaneously:
- Agent 1: getting-started.md, installation.md
- Agent 2: api-reference.md, core-concepts.md
- Agent 3: examples.md, best-practices.md
```

### Phase 3: Repository Analysis

**When llms.txt is not found:**

1. Find the GitHub repository via WebSearch
2. Use Repomix to package the repository:
   ```bash
   npm install -g repomix  # Install if needed
   git clone [repo-url] /tmp/docs-analysis
   cd /tmp/docs-analysis
   repomix --output repomix-output.xml
   ```
3. Read repomix-output.xml and extract documentation

**Repomix advantages:**
- Entire repository packaged into a single AI-friendly file
- Preserves directory structure
- Optimized for AI consumption

### Phase 4: Fallback Research

**When no GitHub repository exists:**
- Launch multiple Researcher agents in parallel
- Focus areas: official documentation, tutorials, API references, community guides
- Consolidate findings into a comprehensive report

## Agent Assignment Guidelines

- **1-3 URLs**: Single Explorer agent
- **4-10 URLs**: 3-5 Explorer agents (2-3 URLs each)
- **11+ URLs**: 5-7 Explorer agents (prioritize most relevant)

## Version Handling

**Latest (default):**
- Search without version identifiers
- Use current documentation paths

**Specific version:**
- Include version in search: `[library] v[version] llms.txt`
- Check versioned paths: `/v[version]/llms.txt`
- For repositories: check out specific tags/branches

## Output Format

```markdown
# [Library] [Version] Documentation

## Source
- Method: [llms.txt / Repository / Research]
- URLs: [list of sources]
- Date Accessed: [current date]

## Key Information
[Extracted relevant information organized by topic]

## Additional Resources
[Related links, examples, references]

## Notes
[Any limitations, missing information, or caveats]
```

## Quick Reference

**Tool selection:**
- WebSearch -> Find llms.txt URLs, GitHub repositories
- WebFetch -> Read single documentation pages
- Task (Explore) -> Multiple URLs, parallel exploration
- Task (Researcher) -> Scattered documentation, diverse sources
- Repomix -> Full codebase analysis

**Popular llms.txt addresses (try context7.com first):**
- Astro: https://context7.com/withastro/astro/llms.txt
- Next.js: https://context7.com/vercel/next.js/llms.txt
- Remix: https://context7.com/remix-run/remix/llms.txt
- shadcn/ui: https://context7.com/shadcn-ui/ui/llms.txt
- Better Auth: https://context7.com/better-auth/better-auth/llms.txt

**Fallback to official sites if context7.com is unavailable:**
- Astro: https://docs.astro.build/llms.txt
- Next.js: https://nextjs.org/llms.txt
- Remix: https://remix.run/llms.txt
- SvelteKit: https://kit.svelte.dev/llms.txt

## Error Handling

- **llms.txt inaccessible** -> Try alternative domains -> Repository analysis
- **Repository not found** -> Search official website -> Use Researcher agents
- **Repomix fails** -> Try /docs directory only -> Manual exploration
- **Multiple conflicting sources** -> Prioritize official sources -> Note versions

## Key Principles

1. **Prefer context7.com for llms.txt** -- most comprehensive and up-to-date aggregator
2. **Use topic parameter when applicable** -- targeted search via ?topic=...
3. **Aggressively use parallel agents** -- faster results, better coverage
4. **Fall back to official sources for validation** -- when context7.com is unavailable
5. **Report methodology** -- inform user which method was used
6. **Handle versions explicitly** -- do not assume latest

## Detailed Documentation

Complete guides, examples, and best practices:

**Workflows:**
- [WORKFLOWS.md](./WORKFLOWS.md) -- Detailed workflow examples and strategies

**Reference Guides:**
- [Tool Selection](./references/tool-selection.md) -- Complete guide to choosing and using tools
- [Documentation Sources](./references/documentation-sources.md) -- Common sources and patterns across ecosystems
- [Error Handling](./references/error-handling.md) -- Troubleshooting and resolution strategies
- [Best Practices](./references/best-practices.md) -- 8 essential principles for effective discovery
- [Performance](./references/performance.md) -- Optimization tips and benchmarks
- [Limitations](./references/limitations.md) -- Boundaries and success criteria

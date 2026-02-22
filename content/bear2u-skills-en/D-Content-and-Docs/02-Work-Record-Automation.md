> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: D-Content-and-Docs

---
name: work-record-automation
description: Automatically summarize development work and suggest next steps after each task completion
---

# Work Record Automation (Workthrough)

## Overview

An AI agent that automatically generates concise summaries of development work and proposes follow-up improvement suggestions. When a development task is completed, it creates a brief Markdown document recording what was done, key changes, results, and recommended next steps.

## Core Principles

1. **Automatic execution**: Runs when development work is completed
2. **Concise summaries**: AI writes brief, focused work records
3. **Includes suggestions**: Proposes what to add or improve next
4. **Saved locally**: `<project_root>/workthrough/YYYY-MM-DD_HH_MM_description.md`

## Document Template

Keep it short and focused:

```markdown
# [Work Title]

## Overview
2-3 sentences summarizing what was done

## Key Changes
- Developed: XXX feature added
- Modified: YYY bug fixed
- Improved: ZZZ performance optimized

## Core Code (only when necessary)
```typescript
// Show only the essential logic
const key = value
```

## Result
- Build successful
- Tests passing

## Next Steps
- Features to implement next
- Areas to modify or improve
```

## VitePress Handling

### First Run (workthrough folder does not exist)
1. VitePress initial setup
2. `pnpm install && pnpm dev` to test

### Subsequent Runs (workthrough folder already exists)
1. Create only the new work record document
2. `pnpm build` to verify build

## Important Reminders

- **Be concise**: Do not write lengthy explanations
- **Core only**: Extract only the important code
- **Summarize**: State what was developed, modified, or improved
- **Next steps**: Suggest what should be done next

Done.

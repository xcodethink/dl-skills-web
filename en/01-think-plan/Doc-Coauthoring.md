> Source: [anthropics/skills](https://github.com/anthropics/skills) | Category: Think & Plan | ⭐ Anthropic Official

---
name: doc-coauthoring
description: Structured workflow for collaborative document creation with three stages — Context Gathering, Refinement & Structure, Reader Testing.
---

# Doc Co-authoring

## Overview

Anthropic's official collaborative document writing workflow. A three-stage structured process from context understanding through iterative refinement to reader testing.

## Three-Stage Workflow

### Stage 1: Context Gathering

**Goal**: Fully understand the requirements before writing.

1. **Meta-context questions**
   - What type of document? (Technical spec / blog post / internal report...)
   - Who is the target audience? What's their background?
   - What's the expected impact of this document?
   - Format and length requirements?

2. **Info dumping**
   - Ask users to provide all relevant context at once
   - Don't interrupt — let information flow naturally
   - Flag points needing later clarification

3. **Clarifying questions**
   - Ask specific questions about ambiguous points
   - Close understanding gaps
   - Confirm key assumptions

4. **Exit condition**: When you have sufficient understanding, move to Stage 2.

### Stage 2: Refinement & Structure

**Goal**: Build a high-quality document section by section.

For each section, execute this loop:

```
Clarify → Brainstorm (5-20 options) → Curate best → Gap check → Draft → Iterate
```

| Step | Description |
|------|-------------|
| Clarify | Confirm specific requirements for this section |
| Brainstorm | Generate 5-20 candidate content items per paragraph/point |
| Curate | Select the most valuable content |
| Gap check | Verify no critical information is missing |
| Draft | Write the initial draft |
| Iterate | Move to next section after 3 consecutive rounds with no changes |

**Full document review**: After all sections are complete, read through checking:
- Does the logical flow between sections work?
- Is terminology usage consistent?
- Is there redundant content?

### Stage 3: Reader Testing

**Goal**: Catch blind spots with "fresh eyes."

1. **Predict reader questions**
   - What questions would a reader most likely ask?
   - List 3-5 predicted questions

2. **Sub-agent testing** (if available)
   - Dispatch a fresh Claude instance to read the document
   - Collect its questions and confusion points
   - These are your blind spots

3. **Additional checks**
   - Any ambiguous wording?
   - Any internal contradictions?
   - Can a non-domain-expert understand it?

4. **Iterate based on test results**
   - Fix discovered issues
   - Return to Stage 2 to rewrite specific sections if needed

## Tips

- **Effective guidance**: Don't always agree with Claude — say "This part is wrong, change it to..."
- **Handling deviations**: If writing veers off track, point directly to where to return
- **Context management**: Periodically summarize current state as documents grow
- **Artifact management**: Save intermediate versions in the filesystem for easy rollback

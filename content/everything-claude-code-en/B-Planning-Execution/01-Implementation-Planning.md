> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Implementation Planning

## Overview

Implementation planning combines a Planner Agent with the `/plan` command to create comprehensive, actionable plans before writing any code. The core discipline: analyze requirements, break down complexity, identify risks, and get explicit user confirmation before touching code.

---

## Planner Agent

**Configuration**: Uses `opus` model with read-only tools (`Read`, `Grep`, `Glob`). Automatically activated for complex features, architectural changes, and refactoring tasks.

### Responsibilities

- Analyze requirements and create detailed implementation plans
- Break complex features into manageable, ordered steps
- Identify dependencies, risks, and edge cases
- Suggest optimal implementation order with incremental testability

### Planning Process

1. **Requirements Analysis** -- Understand the request fully, identify success criteria, list assumptions and constraints.
2. **Architecture Review** -- Analyze existing codebase, identify affected components, review similar implementations and reusable patterns.
3. **Step Breakdown** -- Create steps with: specific actions, file paths, inter-step dependencies, complexity estimates, and risk levels.
4. **Implementation Order** -- Prioritize by dependencies, group related changes, minimize context switching, enable incremental testing.

### Plan Template

```markdown
# Implementation Plan: [Feature Name]

## Overview
[2-3 sentence summary]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Architecture Changes
- [Change 1: file path and description]

## Implementation Steps

### Phase 1: [Phase Name]
1. **[Step Name]** (File: path/to/file.ts)
   - Action: Specific action to take
   - Why: Reason for this step
   - Dependencies: None / Requires step X
   - Risk: Low/Medium/High

### Phase 2: [Phase Name]
...

## Testing Strategy
- Unit tests: [files to test]
- Integration tests: [flows to test]
- E2E tests: [user journeys to test]

## Risks & Mitigations
- **Risk**: [Description]
  - Mitigation: [How to address]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

### Sizing and Phasing

For large features, break into independently deliverable phases:

- **Phase 1**: Minimum viable -- smallest slice that provides value
- **Phase 2**: Core experience -- complete happy path
- **Phase 3**: Edge cases -- error handling, polish
- **Phase 4**: Optimization -- performance, monitoring

Each phase should be mergeable independently. Avoid plans requiring all phases to complete before anything works.

### Best Practices

1. **Be Specific** -- Use exact file paths, function names, variable names
2. **Consider Edge Cases** -- Error scenarios, null values, empty states
3. **Minimize Changes** -- Extend existing code over rewriting
4. **Maintain Patterns** -- Follow existing project conventions
5. **Enable Testing** -- Structure changes to be easily testable
6. **Think Incrementally** -- Each step should be independently verifiable
7. **Document Decisions** -- Explain *why*, not just *what*

### Red Flags

- Functions >50 lines, nesting >4 levels
- Duplicated code, missing error handling
- Hardcoded values, missing tests
- Plans without testing strategy or clear file paths
- Phases that cannot be delivered independently

---

## /plan Command

### What It Does

1. **Restates Requirements** -- Clarifies what needs to be built
2. **Identifies Risks** -- Surfaces potential issues and blockers
3. **Creates Step Plan** -- Breaks implementation into phases
4. **Waits for Confirmation** -- Will NOT write code until explicit approval

### When to Use

- Starting a new feature
- Making significant architectural changes
- Complex refactoring affecting multiple files
- Requirements that are unclear or ambiguous

### Critical Rule

The planner agent will **never** write code until you explicitly confirm. Respond with:

- `"yes"` / `"proceed"` to approve
- `"modify: [changes]"` to adjust the plan
- `"different approach: [alternative]"` to change direction

### Integration

After planning, combine with:

- `/tdd` for test-driven implementation
- `/build-fix` for build error resolution
- `/code-review` for post-implementation review

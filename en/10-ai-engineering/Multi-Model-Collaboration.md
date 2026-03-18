> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Multi-Model Collaboration

## Overview

Multi-model collaboration leverages the strengths of Codex (backend authority), Gemini (frontend authority), and Claude (orchestrator and sole code writer) in a coordinated workflow. The system uses intelligent routing -- frontend tasks go to Gemini, backend tasks go to Codex -- while strictly maintaining "Code Sovereignty": all file modifications are executed exclusively by Claude.

---

## Core Principles

| Principle | Description |
|---|---|
| **Code Sovereignty** | External models have zero filesystem write access. All modifications by Claude only. |
| **Trust Rules** | Backend logic: trust Codex. Frontend UI/UX: trust Gemini. |
| **Mandatory Parallel** | Codex/Gemini calls must use `run_in_background: true` to avoid blocking. |
| **Stop-Loss** | Do not advance to next phase until current phase output is validated. |
| **Dirty Prototype Refactoring** | Treat external model output as draft; Claude refactors to production-grade. |

---

## Part 1: Collaborative Planning (/ccg:plan)

Planning-only command. Reads context and writes to `.claude/plan/*` but **never modifies production code**.

### Workflow

#### Phase 1: Context Retrieval

1. **Prompt Enhancement** -- Call `mcp__ace-tool__enhance_prompt` to refine the requirement
2. **Context Retrieval** -- Call `mcp__ace-tool__search_context` with semantic queries (fallback: Glob + Grep)
3. **Completeness Check** -- Ensure complete definitions/signatures for relevant code; recursive retrieval if needed
4. **Requirement Alignment** -- Surface ambiguities as guiding questions to the user

#### Phase 2: Multi-Model Analysis

1. **Parallel Calls** to Codex (backend analysis) and Gemini (frontend analysis) with the original requirement
2. **Cross-Validation** -- Identify consensus (strong signal), divergence (needs weighing), and complementary strengths
3. **Optional Dual Plan Drafts** -- Both models output plan drafts; Claude records key differences
4. **Final Plan** (Claude) -- Synthesize both analyses into a step-by-step implementation plan with task type, steps, key files, risks, and SESSION_IDs

### Plan Delivery

- Present plan to user (including pseudo-code)
- Save to `.claude/plan/<feature-name>.md`
- Prompt user to review/modify or execute via `/ccg:execute`
- **Immediately stop** -- no auto-execution, no Y/N prompts

---

## Part 2: Collaborative Execution (/ccg:execute)

Requires explicit user approval of the plan before proceeding.

### Workflow

#### Phase 0: Read Plan
- Parse plan file, extract task type, steps, key files, SESSION_IDs
- Route by task type: Frontend -> Gemini, Backend -> Codex, Fullstack -> Both in parallel

#### Phase 1: Context Retrieval
- Use MCP tools for fast retrieval based on plan's key files list

#### Phase 3: Prototype Acquisition

| Route | Model | Focus |
|---|---|---|
| Frontend/UI/Styles | Gemini | CSS/React/Vue prototype as visual baseline. Ignore backend suggestions. |
| Backend/Logic/Algorithms | Codex | Logic and debug capabilities. Backend authority. |
| Fullstack | Both in parallel | Gemini handles frontend, Codex handles backend. |

Output: Unified Diff Patch only. No actual file modifications.

#### Phase 4: Code Implementation (Claude)

1. **Parse Diff** from external models
2. **Mental Sandbox** -- Simulate applying, check consistency, identify conflicts
3. **Refactor** -- Transform "dirty prototype" to production-grade, readable, maintainable code
4. **Minimal Scope** -- Changes limited to requirement only; mandatory side-effect review
5. **Apply Changes** -- Use Edit/Write tools for actual modifications
6. **Self-Verify** -- Run lint/typecheck/tests; fix regressions before proceeding

#### Phase 5: Audit and Delivery

1. **Parallel Audit** -- Codex reviews (security, performance, error handling) + Gemini reviews (accessibility, design consistency)
2. **Integrate Fixes** -- Weigh by trust rules, execute necessary fixes
3. **Delivery Report** -- Change summary, audit results, recommendations

---

## Part 3: Full Development Workflow (/ccg:workflow)

Six-phase structured workflow with quality gates:

**Research -> Ideation -> Plan -> Execute -> Optimize -> Review**

| Phase | Mode | Key Actions |
|---|---|---|
| 1. Research | `[Mode: Research]` | Prompt enhancement, context retrieval, requirement scoring (>=7 to proceed) |
| 2. Ideation | `[Mode: Ideation]` | Parallel Codex + Gemini analysis, synthesize options, user selects |
| 3. Planning | `[Mode: Plan]` | Parallel architecture proposals, Claude synthesizes, user approves |
| 4. Implementation | `[Mode: Execute]` | Follow approved plan, project standards, milestone feedback |
| 5. Optimization | `[Mode: Optimize]` | Parallel review (Codex: security/perf, Gemini: a11y/design), optimize after confirmation |
| 6. Review | `[Mode: Review]` | Completion check, test verification, final user confirmation |

**Key Rule**: Phase sequence cannot be skipped. Force stop when score < 7 or user does not approve.

---

## Part 4: Domain-Specific Workflows

### Backend Workflow (/ccg:backend)

Codex-led, six-phase workflow for: API design, algorithm implementation, database optimization, business logic.

- **Codex opinions are authoritative** for backend decisions
- Gemini backend opinions are reference-only
- Same six phases, but all model calls go to Codex

### Frontend Workflow (/ccg:frontend)

Gemini-led, six-phase workflow for: component design, responsive layout, UI animations, style optimization.

- **Gemini opinions are authoritative** for frontend decisions
- Codex frontend opinions are reference-only
- Same six phases, but all model calls go to Gemini

---

## Trust Rules Summary

| Domain | Authority | Reference Only |
|---|---|---|
| Backend logic / API / Algorithms | Codex | Gemini |
| Frontend UI / UX / Styles | Gemini | Codex |
| Orchestration / Planning / Execution | Claude | -- |
| Filesystem writes | Claude (exclusive) | -- |

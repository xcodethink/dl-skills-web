> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: C-AI-Engineering

---
name: meta-prompt-generator
description: Generate structured custom slash commands with parallel processing, dependency management, and test suites
---

# Meta Prompt Generator

## Overview

This skill takes a brief description and automatically generates structured custom slash commands (prompts) optimized for step-based parallel processing. It produces prompts with phased workflows, dependency management, parallel execution strategies, and comprehensive test suites. Use it when you need to turn a high-level request into a systematic, reusable Claude Code command.

## When to Use

- User requests a structured workflow for a complex project
- User needs a reusable custom prompt or slash command
- Task planning requires parallel processing optimization
- User requests prompts that include systematic testing

## Core Capabilities

### 1. Intelligent Knowledge Gathering
- Automatic web search for topics beyond the model's knowledge cutoff
- 3 parallel sub-agents per topic for knowledge gathering
- Integrated citations and verified information

### 2. Step-Based Workflow Design
- Tasks structured into logical phases
- Explicit dependency definitions between phases
- Independent tasks run in parallel; dependent tasks run sequentially
- Uses the `Task` tool for parallel processing strategy

### 3. Comprehensive Test Generation
- Auto-generates unit, integration, and end-to-end tests
- Identifies parallel execution feasibility per test
- Includes edge cases and validation commands

### 4. Optimized Execution Strategy
- Automatic identification of parallelizable tasks
- Sub-agent creation strategy
- Explicit execution modes (sequential / parallel / mixed)

## Workflow

After the user provides a high-level request:

1. **Context Gathering** (parallel)
   - Web search with 3 parallel sub-agents for unfamiliar topics
   - Parallel collection of relevant documentation

2. **Requirements Clarification** (sequential, user interaction)
   - Ask questions one by one when information is insufficient
   - Loop until all necessary information is collected

3. **Prompt Structure Design** (sequential)
   - Analyze parallelizable work areas
   - Determine inter-phase dependencies
   - Plan sub-agent strategy

4. **Content Generation** (sequential)
   - Write all sections in the specified format
   - Integrate searched knowledge
   - Structural validation

5. **Save and Report** (sequential)
   - Save to `.claude/commands/<prompt-name>.md`
   - Report generated prompt summary

## Generated Prompt Structure

The generated custom slash command contains these sections:

```markdown
---
allowed-tools: <tool list>
description: <prompt description>
argument-hint: [<argument hints>]
model: sonnet
---

# <Prompt Name>

## Variables

- Dynamic variables ($1, $2, ...) definitions
- Static variable definitions

## Directives

- Execution rules and constraints
- Edge case handling
- Key requirements
- **Validation requirements by project type**:
  - Flutter: Run `flutter analyze`, resolve all errors
  - React/Next.js: Run `pnpm build` (or `npm run build`), confirm success
  - Other frameworks: Run appropriate static analysis and build commands

## Codebase Structure (for code-related prompts)

- ASCII directory tree
- Purpose description for each file/directory

## Workflow

### Phase 1-N: <Phase Name>

**Dependencies:** <dependent phases>
**Execution Mode:** Sequential | Parallel | Mixed
**Sub-Agent Strategy:** <strategy description>

#### Phase Tasks

- Specific task items
- Conditional logic

**Parallel Execution:** <feasibility and approach>

---

### Final Phase: Validation and QA

**Dependencies:** All previous phases
**Execution Mode:** Sequential

#### Required Validation by Project Type

1. **Flutter Projects**
   - Run `flutter analyze` and resolve all errors
   - Loop until error count is 0
   - (Optional) `flutter build apk --debug` for build verification

2. **React/Next.js Projects**
   - Run `pnpm build` (or `npm run build`)
   - Fix errors until build succeeds
   - (Optional) `pnpm lint` for code quality

3. **Other Frameworks**
   - Run the framework's static analysis tool
   - Run build command and confirm success

**Parallel Execution:** Not possible (must validate sequentially)

---

## Test Suite Generation

### Unit Tests
- Per-component tests
- Parallel execution strategy

### Integration Tests
- Interaction tests
- Dependencies specified

### End-to-End Tests
- User flow tests

### Edge Cases
- Error condition handling

### Validation Commands

- **Flutter**:
  ```bash
  flutter analyze    # Must resolve all errors
  flutter test       # Run tests
  flutter build apk --debug  # Build verification (optional)
  ```
- **React/Next.js**:
  ```bash
  pnpm build         # or npm run build - must succeed
  pnpm test          # Run tests
  pnpm lint          # Code quality check
  ```
- **Other frameworks**: Use standard validation tools

### Final QA

#### Completion Criteria by Project Type

**Flutter:**
- [ ] `flutter analyze` returns 0 errors
- [ ] All unit tests pass
- [ ] Code generation complete (build_runner, etc.)
- [ ] (Optional) `flutter build` succeeds

**React/Next.js:**
- [ ] `pnpm build` (or `npm run build`) succeeds
- [ ] All tests pass
- [ ] 0 TypeScript errors
- [ ] 0 lint errors (or minimized)

**General Checklist:**
- [ ] All files generated in correct locations
- [ ] Dependencies installed correctly
- [ ] Documentation complete (README, etc.)
- [ ] Version control ready (.gitignore, etc.)

## Final Deliverables

- Specific deliverables listed

## Report

- Summary for user
```

## Usage Examples

### Example 1: Create a React App

```
User: "Build a TODO app with React and TypeScript"

Skill execution:
1. Search React, TypeScript latest info (parallel)
2. Ask for needed details (UI design, state management, etc.)
3. Design phased workflow:
   - Phase 1: Project setup
   - Phase 2-4: UI components, state management, API (parallel)
   - Phase 5: Integration
   - Phase 6: Testing (parallel)
4. Save complete prompt to .claude/commands/react-todo-app.md
```

### Example 2: Data Analysis Pipeline

```
User: "Build a pipeline to read CSV files for analysis and visualization"

Skill execution:
1. Search latest data analysis libraries
2. Ask about data format, analysis goals, etc.
3. Parallel-optimized workflow:
   - Separate data loading, cleaning, analysis into independent phases
   - Generate each visualization in parallel
   - Run tests in parallel
4. Save prompt and report
```

## Key Terminology

| Term | Definition |
|------|-----------|
| **`Task` tool** | Claude Code tool for creating parallel sub-agents |
| **Task item** | Individual task within a phase |
| **Dependency** | Which phases must complete first |
| **Execution mode** | Sequential / parallel / mixed |
| **Sub-agent strategy** | Which tasks to delegate to sub-agents |

## Parallel Processing Principles

### Use the Task Tool When:
- Tasks have no interdependencies
- Tasks can execute simultaneously
- Each task is self-contained

Example: "Assign backend API, frontend UI, and database schema to 3 parallel sub-agents"

### Execute in Main Context When:
- Results from previous sub-agents need integration
- Sequential dependencies exist
- Coordination or shared state is required

Example: "After phases 2 and 3 complete, integrate results in the main context"

## Best Practices

1. **Provide clear descriptions**: Include as much specific information as possible
2. **Iterate progressively**: Test generated prompts and refine as needed
3. **Version control**: Track generated prompts in version control
4. **Reuse**: Reuse generated prompts for similar tasks
5. **Document**: Record the purpose and usage of each generated prompt
6. **Thorough validation**:
   - Flutter: `flutter analyze` to 0 errors
   - React/Next.js: `pnpm build` confirmed successful
   - Use each framework's standard validation tools
   - On validation failure, analyze the cause, fix, and re-validate

## Limitations

- Very complex prompts may need manual adjustment
- Generated prompts are starting points; customize for project needs
- Information beyond the model's cutoff relies on web search

## Notes

- Generated prompts work as Claude Code slash commands
- Internal use of the `Task` tool enables actual parallel execution
- Test suites contain executable commands
- All phases have explicit input/output and success criteria definitions

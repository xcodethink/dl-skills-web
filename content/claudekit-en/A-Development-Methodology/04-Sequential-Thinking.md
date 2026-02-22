> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Development Methodology

---
name: sequential-thinking
description: Use when complex problems require systematic step-by-step reasoning with ability to revise thoughts, branch into alternative approaches, or dynamically adjust scope. Ideal for multi-stage analysis, design planning, problem decomposition, or tasks with initially unclear scope.
---

# Sequential Thinking

## Overview

Enables structured problem-solving through iterative reasoning with revision and branching capabilities. Break complex problems into sequential thought steps, dynamically adjusting scope as understanding deepens, with the ability to revise earlier conclusions and explore alternative paths.

## Core Capabilities

- **Iterative Reasoning**: Break complex problems into sequential thought steps
- **Dynamic Scope**: Adjust total thought count as understanding evolves
- **Revision Tracking**: Reconsider and modify previous conclusions
- **Branch Exploration**: Explore alternative reasoning paths from any point
- **Maintained Context**: Keep track of reasoning chain throughout analysis

## When to Use

Use `mcp__reasoning__sequentialthinking` when:
- Problem requires multiple interconnected reasoning steps
- Initial scope or approach is uncertain
- Need to filter through complexity to find core issues
- May need to backtrack or revise earlier conclusions
- Want to explore alternative solution paths

**Don't use for:** Simple queries, direct factual questions, or single-step tasks.

## Basic Usage

The MCP tool `mcp__reasoning__sequentialthinking` accepts these parameters:

### Required Parameters

- `thought` (string): Current reasoning step
- `nextThoughtNeeded` (boolean): Whether more reasoning is needed
- `thoughtNumber` (integer): Current step number (starts at 1)
- `totalThoughts` (integer): Estimated total steps needed

### Optional Parameters

- `isRevision` (boolean): Indicates this step revises previous thinking
- `revisesThought` (integer): Which thought number is being reconsidered
- `branchFromThought` (integer): Thought number to branch from
- `branchId` (string): Identifier for this reasoning branch

## Workflow Pattern

```
1. Start with initial thought (thoughtNumber: 1)
2. For each step:
   - Express current reasoning in `thought`
   - Estimate remaining work via `totalThoughts` (adjust dynamically)
   - Set `nextThoughtNeeded: true` to continue
3. When reaching conclusion, set `nextThoughtNeeded: false`
```

## Simple Example

```typescript
// First thought
{
  thought: "Problem involves optimizing database queries. Need to identify bottlenecks first.",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
}

// Second thought
{
  thought: "Analyzing query patterns reveals N+1 problem in user fetches.",
  thoughtNumber: 2,
  totalThoughts: 6, // Adjusted scope
  nextThoughtNeeded: true
}

// ... continue until done
```

## Advanced Features

For revision patterns, branching strategies, and complex workflows, see:
- Advanced Usage - Revision and branching patterns
- Examples - Real-world use cases

## Tips

- Start with a rough estimate for `totalThoughts`, refine as you progress
- Use revision when assumptions prove incorrect
- Branch when multiple approaches seem viable
- Express uncertainty explicitly in thoughts
- Adjust scope freely - accuracy matters less than progress visibility

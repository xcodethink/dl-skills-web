> Source: [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit) | Category: AI Engineering

---
name: agent-context-engineering
description: Understand the components, mechanics, and constraints of context in agent systems. Master context degradation patterns and optimization techniques for building reliable multi-agent workflows.
---

# Agent Context Engineering

## Overview

Context engineering is the discipline of curating the minimal, high-signal token set that an LLM receives for a given task. Unlike prompt engineering (which focuses on what you say), context engineering focuses on everything the model sees: system prompts, tool definitions, retrieved documents, conversation history, and tool outputs combined.

**Core insight:** Token variance explains approximately 80% of agent performance differences. The tokens you put into context matter more than almost any other factor.

## When to Use

- Designing or debugging agent systems
- Context window limits are affecting agent performance
- Optimizing cost and latency in production agents
- Building multi-agent coordination workflows
- Diagnosing agents that "forget" instructions or hallucinate
- Implementing memory systems for long-running sessions

## The Anatomy of Context

Every token in an LLM's context window comes from one of five sources. Understanding their roles is essential for optimization.

| Component | Role | Typical Share | Key Insight |
|-----------|------|---------------|-------------|
| **System Prompts** | Core identity, constraints, instructions | 5-15% | Balance specificity vs. flexibility ("right altitude") |
| **Tool Definitions** | Available actions and their schemas | 5-20% | Poor descriptions force the model to guess; optimize with examples |
| **Retrieved Documents** | Domain knowledge (RAG, file reads) | 10-40% | Use just-in-time loading, not pre-loading everything |
| **Message History** | Conversation state and context | 10-30% | Can dominate context in long tasks; compress aggressively |
| **Tool Outputs** | Results from tool invocations | 20-84% | Up to 83.9% of total context in complex agent runs |

**Critical observation:** In multi-step agent workflows, tool outputs frequently become the largest consumer of context, often exceeding all other components combined.

## The Attention Budget Constraint

Transformer attention is fundamentally constrained. For a context with n tokens, the model must compute n-squared relationships. This means:

1. **Attention is finite.** Every token added to context competes for the model's attention with every other token.
2. **Relevance dilution is real.** Adding 1,000 tokens of moderately useful information can degrade performance on the 100 tokens that actually matter.
3. **Position matters.** The U-shaped attention curve means tokens at the beginning and end of context receive more attention than those in the middle.

**Practical implication:** Context engineering is not about fitting more in -- it is about choosing what to leave out.

### The Attention Curve

```
Attention
  ^
  |█                                    █
  |██                                  ██
  |███                                ███
  |████                              ████
  |█████                            █████
  |██████                          ██████
  |████████████████████████████████████████
  +-----------------------------------------> Position
   Start         Middle              End
```

Information placed at the start or end of context is recalled with significantly higher accuracy than information in the middle. This is known as the "lost-in-the-middle" effect.

## Progressive Disclosure

The most important optimization principle: load information only when the agent needs it, not before.

### Three Tiers of Information Loading

| Tier | Loading Strategy | Example |
|------|-----------------|---------|
| **Always Present** | In system prompt | Role definition, output format, critical constraints |
| **On-Demand** | Loaded via tool use when relevant | Project conventions, API docs, reference materials |
| **Deferred** | Loaded only if a specific edge case arises | Error handling guides, migration docs, rare patterns |

### Implementation Patterns

**File-system based disclosure:**
```
Instead of embedding all coding standards in the system prompt,
instruct the agent: "Read .claude/standards/naming.md before
renaming any symbols."
```

**Hybrid strategy:**
```
Pre-load: 200-token summary of project architecture
On-demand: Full module documentation loaded per-file during analysis
Deferred: Deployment guides loaded only if agent detects deployment-related task
```

**Explicit budgeting:**
```
Track token usage. When context reaches 70% capacity, trigger
compaction. At 80%, switch to aggressive summarization.
```

## Context Quality vs. Quantity

**Principle:** Informativity over exhaustiveness. A 500-token high-signal context outperforms a 5,000-token comprehensive but noisy context.

### Quality Indicators

| Indicator | High Quality | Low Quality |
|-----------|-------------|-------------|
| **Signal density** | Every sentence contributes to the task | Padding, repetition, boilerplate |
| **Relevance** | All content relates to current step | "Just in case" information |
| **Recency** | Information reflects current state | Stale data from earlier turns |
| **Specificity** | Concrete examples and values | Abstract descriptions |
| **Consistency** | No contradictions | Conflicting instructions across sections |

### Counterintuitive Findings

Research has produced several surprising results about context:

1. **Shuffled haystacks:** Randomly shuffling retrieved documents can sometimes improve recall, because it breaks the "lost-in-middle" pattern and redistributes important information.

2. **Single distractor impact:** Adding even a single irrelevant document to a retrieval set can measurably degrade answer quality. The effect is not proportional -- one bad document can do more damage than its token share suggests.

3. **Longer is not always better:** For factual recall tasks, truncating context to the most relevant 30% of tokens often outperforms using the full context window.

## Context Degradation Patterns

When context is poorly managed, agents fail in predictable ways. Recognizing these patterns is the first step to fixing them.

### 1. Lost-in-the-Middle

**Symptom:** Agent ignores or "forgets" instructions that appear in the middle of a long context.

**Mechanism:** The U-shaped attention curve causes middle-positioned information to receive less attention. In contexts over 4K tokens, middle recall drops significantly.

**Fix:**
- Place critical instructions at the very beginning or very end of context
- Repeat key constraints at both positions
- Use section headers and formatting to make middle content more salient

### 2. Context Poisoning

**Symptom:** A single piece of incorrect or contradictory information causes the agent to produce systematically wrong outputs.

**Mechanism:** The model treats all context tokens as potentially authoritative. A hallucinated tool output or stale document can override correct instructions.

**Fix:**
- Validate tool outputs before feeding them back to the agent
- Mark document freshness: include timestamps and confidence levels
- Implement a trust hierarchy: system prompt > recent tool outputs > historical documents

### 3. Distraction

**Symptom:** Agent spends tokens and attention on tangential information instead of the primary task.

**Mechanism:** Irrelevant but interesting content in context (verbose error logs, unrelated code comments) attracts model attention away from the task.

**Fix:**
- Filter tool outputs to include only task-relevant sections
- Summarize long outputs before returning them to context
- Remove or collapse non-essential information from retrieved documents

### 4. Context Confusion

**Symptom:** Agent conflates information from different sources or mixes up entities, files, or requirements.

**Mechanism:** When context contains multiple similar-but-distinct items (e.g., two API endpoints, three configuration files), the model can cross-reference incorrectly.

**Fix:**
- Use clear delimiters and labels for each source
- Process similar items sequentially rather than in parallel within the same context
- Isolate distinct tasks into separate agent invocations

### 5. Context Clash

**Symptom:** Agent oscillates between contradictory behaviors or produces internally inconsistent output.

**Mechanism:** Different parts of the context provide conflicting instructions (e.g., "always use TypeScript" in the system prompt vs. "write this in Python" in a tool output).

**Fix:**
- Establish a clear priority hierarchy for instruction sources
- Audit context for contradictions before agent invocation
- Remove or reconcile conflicting information programmatically

## The Four-Bucket Strategy

Organize your context optimization efforts into four categories:

### 1. Write (Authoring Better Context)

Improve the quality of what goes into context from the start.

| Technique | Description |
|-----------|-------------|
| **Right altitude** | Match instruction specificity to task fragility. Critical steps need exact instructions; flexible steps need principles. |
| **Structured formatting** | Use tables, numbered lists, and headers. These act as attention anchors for the model. |
| **Concrete examples** | Replace abstract rules with input-output pairs. Examples transfer behavior more reliably than descriptions. |
| **Negative examples** | Show what NOT to do. Anti-patterns are as instructive as positive patterns. |

### 2. Select (Choosing What to Include)

Filter aggressively. Not everything available should be in context.

| Technique | Description |
|-----------|-------------|
| **Relevance scoring** | Score each potential context item against the current task. Include only above-threshold items. |
| **Recency weighting** | In long conversations, weight recent turns more heavily than early turns. |
| **Task decomposition** | Break multi-step tasks into single-step subtasks, each with its own minimal context. |
| **Tool output filtering** | Return only the relevant sections of tool output, not the full dump. |

### 3. Compress (Reducing Token Count)

Fit more signal into fewer tokens.

| Technique | Description |
|-----------|-------------|
| **Compaction** | Periodically summarize conversation history, preserving decisions and outcomes while discarding the deliberation. |
| **Observation masking** | Remove or truncate large tool outputs after the agent has processed them. The agent already incorporated the information. |
| **KV-cache optimization** | Structure prompts so that stable prefix content (system prompt, tool definitions) can be cached and reused across turns. |
| **Abbreviation conventions** | Establish short forms for frequently referenced concepts within the agent session. |

### 4. Isolate (Distributing Across Agents)

When one context cannot hold everything, split the work.

| Technique | Description |
|-----------|-------------|
| **Partitioning** | Assign each subtask to a dedicated sub-agent with its own clean context. |
| **Hierarchical orchestration** | A coordinator agent holds the plan; worker agents hold task-specific context. |
| **Result-only passing** | Pass only the final result between agents, not the full deliberation context. |
| **Context firewalls** | Prevent one agent's noisy context from contaminating another agent's clean context. |

## Optimization Techniques in Detail

### Compaction

After every N turns (or when context reaches a threshold), compress the conversation:

```
Original (4 turns, 800 tokens):
  Turn 1: User asks to refactor auth module
  Turn 2: Agent reads 3 files, identifies patterns
  Turn 3: Agent proposes 2 approaches, user picks approach A
  Turn 4: Agent implements approach A in 2 files

Compacted (1 summary, 120 tokens):
  Summary: Refactored auth module using approach A (token-based).
  Changed: src/auth/middleware.ts, src/auth/validate.ts.
  Decision: Chose token-based over session-based for stateless scaling.
```

### Observation Masking

After the agent processes a tool output, reduce it to essentials:

```
Original tool output: 2,400 tokens (full file contents)
After masking: 80 tokens ("Read src/config.ts: 142 lines, exports
  DatabaseConfig interface with 8 fields, uses env vars for credentials")
```

### KV-Cache Optimization

Structure your prompts for caching efficiency:

```
[System prompt - STABLE, cacheable]
[Tool definitions - STABLE, cacheable]
[Retrieved docs - SEMI-STABLE, cache per task]
[Message history - VOLATILE, changes every turn]
```

Keep stable content at the front of context. Every token that changes invalidates the cache for all subsequent tokens.

### Partitioning

For a code review across 20 files, instead of one agent reviewing all 20:

```
Coordinator agent: Holds the file list and review plan
Worker agent 1: Reviews files 1-5 with focused context
Worker agent 2: Reviews files 6-10 with focused context
Worker agent 3: Reviews files 11-15 with focused context
Worker agent 4: Reviews files 16-20 with focused context
Coordinator agent: Aggregates results, identifies cross-cutting issues
```

Each worker agent operates with a clean, focused context instead of a noisy context containing all 20 files.

## Practical Placement Guide

| Content Type | Best Position | Reasoning |
|-------------|---------------|-----------|
| Role definition | Very start | First-token primacy effect |
| Output format | End of system prompt | Recency advantage; model sees it right before generating |
| Critical constraints | Start AND end | Redundancy compensates for attention drop |
| Reference material | Middle (with headers) | Acceptable for searchable reference; headers aid recall |
| Examples | Near the instruction they illustrate | Proximity strengthens association |
| Tool definitions | After system prompt | Stable position enables KV-cache |

## Key Metrics

| Metric | Warning Threshold | Action Threshold |
|--------|-------------------|-----------------|
| **Token utilization** | 70% of window | 80% -- trigger compaction |
| **Tool output share** | 60% of total context | 75% -- apply observation masking |
| **Conversation turns** | 10 turns | 15 turns -- force summarization |
| **Instruction recall** | Test on known queries | If recall drops below 90%, restructure placement |

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Pre-load everything** | Wastes budget on unused information | Use progressive disclosure; load on demand |
| **Ignore tool output size** | Tool outputs silently consume 80%+ of context | Monitor and mask/truncate after processing |
| **Same context for all agents** | Agents see irrelevant information from other agents' tasks | Isolate: each agent gets only its task context |
| **Never summarize** | Conversation history grows unbounded | Compact after every N turns or at threshold |
| **Duplicate instructions** | Same instruction in 3 places wastes tokens | Single authoritative location; reference it |
| **Contradictory sources** | Agent behavior becomes unpredictable | Audit and reconcile; establish priority hierarchy |
| **Ignoring position effects** | Critical info gets lost in the middle | Place critical content at edges; repeat if needed |

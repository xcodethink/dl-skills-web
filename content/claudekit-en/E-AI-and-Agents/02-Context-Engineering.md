> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: E-AI-and-Agents

---
name: context-engineering
description: Curate minimal, high-signal token sets for LLM tasks to maximize reasoning quality while minimizing token usage
---

# Context Engineering

## Overview

Context Engineering curates the minimal, high-signal token set for LLM tasks. The goal is to maximize reasoning quality while minimizing token usage. This skill covers context optimization, compression, memory systems, and multi-agent coordination patterns.

## When to Activate

- Designing/debugging agent systems
- Context limits affecting performance
- Optimizing cost/latency
- Building multi-agent coordination
- Implementing memory systems
- Evaluating agent performance
- Developing LLM-driven pipelines

## Core Principles

1. **Context Quality > Quantity** - High-signal tokens over comprehensive content
2. **Attention is Finite** - U-shaped curve favors beginning/end positions
3. **Progressive Disclosure** - Load information just-in-time
4. **Isolation Prevents Degradation** - Distribute work across sub-agents
5. **Measure Before Optimizing** - Know your baseline

## Quick Reference

| Topic | Use Case | Reference |
|-------|----------|-----------|
| **Fundamentals** | Understanding context structure, attention mechanics | [context-fundamentals.md](./references/context-fundamentals.md) |
| **Degradation** | Debugging failures, lost-in-the-middle, poisoning | [context-degradation.md](./references/context-degradation.md) |
| **Optimization** | Compression, masking, caching, partitioning | [context-optimization.md](./references/context-optimization.md) |
| **Compression** | Long conversations, summarization strategies | [context-compression.md](./references/context-compression.md) |
| **Memory Systems** | Cross-session persistence, knowledge graphs | [memory-systems.md](./references/memory-systems.md) |
| **Multi-Agent** | Coordination patterns, context isolation | [multi-agent-patterns.md](./references/multi-agent-patterns.md) |
| **Evaluation** | Testing agents, LLM-as-Judge, metrics | [evaluation.md](./references/evaluation.md) |
| **Tool Design** | Tool integration, description engineering | [tool-design.md](./references/tool-design.md) |
| **Pipelines** | Project development, batch processing | [project-development.md](./references/project-development.md) |

## Key Metrics

- **Token Utilization**: Warning at 70%, trigger optimization at 80%
- **Token Variance**: Explains ~80% of agent performance differences
- **Multi-Agent Cost**: ~15x single-agent baseline
- **Compression Target**: 50-70% reduction, <5% quality loss
- **Cache Hit Target**: 70%+ for stable workloads

## Four-Bucket Strategy

1. **Write**: Persist context externally (scratchpads, files)
2. **Select**: Pull only relevant context (retrieval, filtering)
3. **Compress**: Reduce tokens while preserving information (summarization)
4. **Isolate**: Split across sub-agents (partitioning)

## Anti-Patterns

- Comprehensive context instead of curated context
- Placing critical information in the middle
- No compression triggers before hitting limits
- Using a single agent for parallelizable tasks
- Tools lacking clear descriptions

## Guidelines

1. Place critical information at the beginning/end of context
2. Implement compression at 70-80% utilization
3. Use sub-agents for context isolation, not role-playing
4. Design tools with a four-question framework (what it does, when to use, what input, what output)
5. Optimize for tokens-per-task, not tokens-per-request
6. Validate with probe-based evaluation
7. Monitor KV-cache hit rates in production
8. Start minimal, add complexity only when proven necessary

## Scripts

- [context_analyzer.py](./scripts/context_analyzer.py) - Context health analysis, degradation detection
- [compression_evaluator.py](./scripts/compression_evaluator.py) - Compression quality assessment

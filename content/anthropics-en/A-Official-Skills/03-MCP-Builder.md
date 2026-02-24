> Source: [anthropics/skills](https://github.com/anthropics/skills) | Category: AI Engineering | ⭐ Anthropic Official

---
name: mcp-builder
description: Comprehensive guide for building high-quality MCP servers with well-designed tools. Use when creating new MCP integrations or improving existing ones.
---

# MCP Builder

## Overview

Anthropic's official guide for building MCP (Model Context Protocol) servers. Create high-quality MCP servers that enable LLMs to interact effectively with external services.

## Four-Phase Workflow

### Phase 1: Deep Research and Planning

1. **Understand modern MCP design**
   - Study MCP protocol docs and best practices
   - Understand Tools vs. Resources vs. Prompts
   - Learn Schema design and Annotations specification

2. **Research the target service API**
   - Read API documentation thoroughly
   - Understand authentication flows and rate limits
   - Identify high-value vs. low-value operations

3. **Plan implementation**
   - Decide tool granularity: API-coverage vs. workflow-oriented
   - Design tool names and parameter schemas
   - Plan error handling strategy

### Phase 2: Implementation

1. **Project structure**
   - Choose SDK (TypeScript or Python)
   - Set up standard project skeleton
   - Configure type checking and linting

2. **Core infrastructure**
   - Implement authentication and session management
   - Set up logging and error reporting
   - Configure rate limit handling

3. **Tool implementation**
   - Every tool needs clear JSON Schema
   - Use Annotations to describe side effects
   - Strict input validation, consistent output format

### Phase 3: Review and Test

- Code quality review
- Interactive testing with MCP Inspector
- Verify all tools under boundary conditions
- Ensure error messages are helpful to LLMs

### Phase 4: Create Evaluations

Write 10 evaluation questions testing LLM tool usage:
- Cover simple and complex scenarios
- Include multi-step workflows
- Test error handling paths

## Tool Design Principles

| Principle | Description |
|-----------|-------------|
| Clear naming | Tool names should be immediately understandable to LLMs |
| Detailed descriptions | The description field drives LLM tool selection |
| Strict schemas | Define every parameter's type and constraints with JSON Schema |
| Meaningful errors | Error messages should help LLMs self-correct |
| Minimal side effects | Use Annotations to flag whether tools have side effects |

## Reference Resources

- MCP Best Practices Guide
- TypeScript SDK / Python SDK documentation
- MCP Evaluation Guide
- Tool Annotations specification

> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Development Tools

---
name: mcp-builder
description: Triggers when building MCP (Model Context Protocol) servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).
---

# MCP Server Development Guide

## Overview

This skill provides a structured, four-phase process for building high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. An MCP server's quality is measured by how effectively it enables LLMs to accomplish real-world tasks. The guide covers both Python (FastMCP / Pydantic) and Node/TypeScript (MCP SDK / Zod) implementations.

## Phase 1: Deep Research and Planning

### 1.1 Agent-Centric Design Principles

Before implementation, internalize these principles:

**Build for Workflows, Not Just API Endpoints**
- Consolidate related operations (e.g., `schedule_event` that checks availability and creates the event)
- Focus on tools that enable complete tasks, not individual API calls

**Optimize for Limited Context**
- Return high-signal information, not exhaustive data dumps
- Offer "concise" vs. "detailed" response format options
- Default to human-readable identifiers (names over IDs)

**Design Actionable Error Messages**
- Guide agents toward correct usage: `"Try using filter='active_only' to reduce results"`
- Make errors educational, not just diagnostic

**Follow Natural Task Subdivisions**
- Tool names should reflect how humans think about tasks
- Group related tools with consistent prefixes for discoverability

**Use Evaluation-Driven Development**
- Create realistic evaluation scenarios early
- Let agent feedback drive tool improvements

### 1.2 Study Protocol and SDK Documentation

| Resource | Location |
|---|---|
| MCP Protocol Spec | `https://modelcontextprotocol.io/llms-full.txt` (fetch via WebFetch) |
| MCP Best Practices | `reference/mcp_best_practices.md` (bundled) |
| Python SDK README | `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md` |
| TypeScript SDK README | `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md` |
| Python Implementation Guide | `reference/python_mcp_server.md` (bundled) |
| TypeScript Implementation Guide | `reference/node_mcp_server.md` (bundled) |

### 1.3 Study the Target API Exhaustively

Read through all available API documentation:
- Authentication and authorization requirements
- Rate limiting and pagination patterns
- Error responses and status codes
- Available endpoints, parameters, data models, and schemas

### 1.4 Create a Comprehensive Implementation Plan

The plan should cover:

- **Tool Selection** -- Most valuable endpoints, common use cases, workflow combinations
- **Shared Utilities** -- Common request patterns, pagination helpers, filtering/formatting utilities, error handling strategies
- **Input/Output Design** -- Validation models (Pydantic or Zod), consistent response formats, character limits (~25,000 tokens), truncation strategies
- **Error Handling Strategy** -- Graceful failure modes, actionable LLM-friendly error messages, rate limiting, timeout handling, auth errors

## Phase 2: Implementation

### 2.1 Set Up Project Structure

**Python**: Single `.py` file or organized modules. Use MCP Python SDK for tool registration. Define Pydantic models for input validation.

**Node/TypeScript**: Proper project structure with `package.json` and `tsconfig.json`. Use MCP TypeScript SDK. Define Zod schemas for input validation.

### 2.2 Implement Core Infrastructure First

Build shared utilities before individual tools:
- API request helper functions
- Error handling utilities
- Response formatting (JSON and Markdown)
- Pagination helpers
- Authentication / token management

### 2.3 Implement Tools Systematically

For each tool:

1. **Define Input Schema** -- Use Pydantic (Python) or Zod (TypeScript) with proper constraints, clear field descriptions, and diverse examples
2. **Write Comprehensive Docstrings** -- One-line summary, detailed explanation, parameter types with examples, return schema, usage examples, error documentation
3. **Implement Tool Logic** -- Use shared utilities, async/await for all I/O, multiple response formats, pagination, character limit truncation
4. **Add Tool Annotations**:

```
readOnlyHint: true      # for read-only operations
destructiveHint: false   # for non-destructive operations
idempotentHint: true     # if repeated calls have the same effect
openWorldHint: true      # if interacting with external systems
```

### 2.4 Language-Specific Best Practices

**Python Checklist**:
- [ ] MCP Python SDK with proper tool registration
- [ ] Pydantic v2 models with `model_config`
- [ ] Type hints throughout
- [ ] Async/await for all I/O
- [ ] Module-level constants (`CHARACTER_LIMIT`, `API_BASE_URL`)

**TypeScript Checklist**:
- [ ] `server.registerTool` used properly
- [ ] Zod schemas with `.strict()`
- [ ] TypeScript strict mode enabled
- [ ] No `any` types -- use proper types
- [ ] Explicit `Promise<T>` return types
- [ ] Build process configured (`npm run build`)

## Phase 3: Review and Refine

### 3.1 Code Quality Review

- **DRY**: No duplicated code between tools
- **Composability**: Shared logic extracted into functions
- **Consistency**: Similar operations return similar formats
- **Error Handling**: All external calls have error handling
- **Type Safety**: Full type coverage
- **Documentation**: Every tool has comprehensive docstrings

### 3.2 Test and Build

MCP servers are long-running processes that wait for requests over stdio or SSE/HTTP. Running them directly will hang indefinitely. Safe testing approaches:

- Use the evaluation harness (recommended)
- Run the server in tmux
- Use a timeout: `timeout 5s python server.py`

**Python**: Verify syntax with `python -m py_compile your_server.py`

**TypeScript**: Run `npm run build` and verify `dist/index.js` is created

## Phase 4: Create Evaluations

### 4.1 Purpose

Evaluations test whether LLMs can effectively use the MCP server to answer realistic, complex questions.

### 4.2 Create 10 Evaluation Questions

1. Inspect available tools and understand capabilities
2. Use READ-ONLY operations to explore available data
3. Generate 10 complex, realistic questions
4. Solve each question to verify answers

### 4.3 Question Requirements

Each question must be: **Independent**, **Read-only**, **Complex** (multiple tool calls), **Realistic**, **Verifiable** (single clear answer), **Stable** (answer will not change over time).

### 4.4 Output Format

```xml
<evaluation>
  <qa_pair>
    <question>Your evaluation question here</question>
    <answer>Expected answer</answer>
  </qa_pair>
  <!-- More qa_pairs... -->
</evaluation>
```

## Reference Files

| Resource | Description |
|---|---|
| `reference/mcp_best_practices.md` | Server/tool naming, response formats, pagination, security |
| `reference/python_mcp_server.md` | Python/FastMCP guide with examples and quality checklist |
| `reference/node_mcp_server.md` | TypeScript guide with examples and quality checklist |
| `reference/evaluation.md` | Evaluation creation guide with XML format specs |

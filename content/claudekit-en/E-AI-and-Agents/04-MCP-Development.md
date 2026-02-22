> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: E-AI-and-Agents

---
name: mcp-building
description: Create high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services effectively
---

# MCP Server Development Guide

## Overview

Create high-quality MCP (Model Context Protocol) servers that enable LLMs to interact effectively with external services. MCP servers provide tools for LLMs to access external services and APIs. The quality of an MCP server is determined by how well it helps an LLM accomplish real-world tasks using the tools provided.

---

# Process

## High-Level Workflow

Creating a high-quality MCP server involves four main phases:

### Phase 1: Deep Research and Planning

#### 1.1 Understand Agent-Centric Design Principles

Before diving into implementation, understand how to design tools for AI agents:

**Build for Workflows, Not Just API Wrappers:**
- Do not simply wrap existing API endpoints -- build thoughtful, high-impact workflow tools
- Consolidate related operations (e.g., `schedule_event` checks availability and creates the event)
- Focus on tools that complete entire tasks, not individual API calls
- Consider the workflows an agent actually needs to accomplish

**Optimize for Limited Context:**
- Agents have constrained context windows -- make every token count
- Return high-signal information, not exhaustive data dumps
- Provide "compact" vs "detailed" response format options
- Default to human-readable identifiers over technical codes (names over IDs)
- Treat the agent's context budget as a scarce resource

**Design Actionable Error Messages:**
- Error messages should guide the agent toward correct usage
- Suggest specific next steps: "Try using filter='active_only' to reduce results"
- Make errors educational, not just diagnostic
- Help the agent learn correct tool usage through clear feedback

**Follow Natural Task Decomposition:**
- Tool names should reflect how humans think about tasks
- Use consistent prefixes to group related tools for discoverability
- Design tools around natural workflows, not just API structure

**Use Evaluation-Driven Development:**
- Create realistic evaluation scenarios early
- Let agent feedback drive tool improvements
- Iterate quickly on prototypes, optimize based on actual agent performance

#### 1.3 Research MCP Protocol Documentation

**Fetch the latest MCP protocol documentation:**

Use WebFetch to load: `https://modelcontextprotocol.io/llms-full.txt`

This comprehensive document contains the complete MCP specification and guidelines.

#### 1.4 Research Framework Documentation

**Load and read the following reference files:**

- **MCP Best Practices**: [View best practices](./reference/mcp_best_practices.md) - Core guidelines for all MCP servers

**For Python implementations, also load:**
- **Python SDK docs**: Use WebFetch to load `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- [Python Implementation Guide](./reference/python_mcp_server.md) - Python-specific best practices and examples

**For Node/TypeScript implementations, also load:**
- **TypeScript SDK docs**: Use WebFetch to load `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- [TypeScript Implementation Guide](./reference/node_mcp_server.md) - Node/TypeScript-specific best practices and examples

#### 1.5 Thoroughly Research API Documentation

When integrating a service, read through **all** available API documentation:
- Official API reference documentation
- Authentication and authorization requirements
- Rate limits and pagination patterns
- Error responses and status codes
- Available endpoints and their parameters
- Data models and schemas

**Use web search and WebFetch tools to gather comprehensive information.**

#### 1.6 Create a Comprehensive Implementation Plan

Based on your research, create a detailed plan covering:

**Tool Selection:**
- List the most valuable endpoints/operations
- Prioritize the most commonly used and important use cases
- Consider which tools work together for complex workflows

**Shared Utilities and Helpers:**
- Identify common API request patterns
- Plan pagination helpers
- Design filtering and formatting utilities
- Plan error handling strategies

**Input/Output Design:**
- Define input validation models (Pydantic for Python, Zod for TypeScript)
- Design consistent response formats (JSON or Markdown) with configurable verbosity (detailed or compact)
- Plan for scale (thousands of users/resources)
- Implement character limits and truncation strategies (~25,000 tokens)

**Error Handling Strategy:**
- Plan graceful failure modes
- Design clear, actionable, LLM-friendly natural language error messages
- Consider rate limiting and timeout scenarios
- Handle authentication and authorization errors

---

### Phase 2: Implementation

With a comprehensive plan in place, begin implementation following language-specific best practices.

#### 2.1 Set Up Project Structure

**Python:**
- Create a single `.py` file or organize as modules depending on complexity (see [Python Guide](./reference/python_mcp_server.md))
- Use MCP Python SDK for tool registration
- Define Pydantic models for input validation

**Node/TypeScript:**
- Create proper project structure (see [TypeScript Guide](./reference/node_mcp_server.md))
- Set up `package.json` and `tsconfig.json`
- Use MCP TypeScript SDK
- Define Zod schemas for input validation

#### 2.2 Implement Core Infrastructure First

**Start with shared utilities before specific tools:**
- API request helpers
- Error handling utilities
- Response formatting functions (JSON and Markdown)
- Pagination helpers
- Authentication/token management

#### 2.3 Implement Tools Systematically

For each tool in the plan:

**Define Input Schema:**
- Use Pydantic (Python) or Zod (TypeScript) for validation
- Include appropriate constraints (min/max length, regex patterns, min/max values, ranges)
- Provide clear, descriptive field descriptions
- Include diverse examples in field descriptions

**Write Comprehensive Docstrings/Descriptions:**
- One-line summary of what the tool does
- Detailed explanation of purpose and functionality
- Explicit parameter types with examples
- Complete return type schema
- Usage examples (when to use, when not to use)
- Error handling documentation explaining how to handle specific errors

**Implement Tool Logic:**
- Use shared utilities to avoid code duplication
- Use async/await for all I/O operations
- Implement proper error handling
- Support multiple response formats (JSON and Markdown)
- Respect pagination parameters
- Check character limits and truncate appropriately

**Add Tool Annotations:**
- `readOnlyHint`: true (for read-only operations)
- `destructiveHint`: false (for non-destructive operations)
- `idempotentHint`: true (if repeated calls have the same effect)
- `openWorldHint`: true (if interacting with external systems)

#### 2.4 Follow Language-Specific Best Practices

**Python: Load the [Python Implementation Guide](./reference/python_mcp_server.md) and ensure:**
- Proper tool registration using MCP Python SDK
- Pydantic v2 models with `model_config`
- Type hints throughout
- async/await for all I/O operations
- Properly organized imports
- Module-level constants (CHARACTER_LIMIT, API_BASE_URL)

**Node/TypeScript: Load the [TypeScript Implementation Guide](./reference/node_mcp_server.md) and ensure:**
- Correct use of `server.registerTool`
- Zod schemas with `.strict()`
- TypeScript strict mode enabled
- No `any` types -- use proper types
- Explicit Promise<T> return types
- Configured build pipeline (`npm run build`)

---

### Phase 3: Review and Optimization

After initial implementation:

#### 3.1 Code Quality Review

Review code to ensure:
- **DRY Principle**: No duplicated code between tools
- **Composability**: Shared logic extracted into functions
- **Consistency**: Similar operations return similar formats
- **Error Handling**: All external calls have error handling
- **Type Safety**: Complete type coverage (Python type hints, TypeScript types)
- **Documentation**: Every tool has comprehensive docstrings/descriptions

#### 3.2 Testing and Building

**Important Note:** MCP servers are long-running processes that wait for requests via stdio/stdin or sse/http. Running directly in the main process (e.g., `python server.py` or `node dist/index.js`) will cause the process to hang indefinitely.

**Safe Testing Methods:**
- Use evaluation tools (see Phase 4) -- recommended approach
- Run the server in tmux to detach from main process
- Use timeouts for testing: `timeout 5s python server.py`

**Python:**
- Validate Python syntax: `python -m py_compile your_server.py`
- Check imports are correct
- Manual testing: Run the server in tmux, then test with evaluation tools from the main process
- Or use evaluation tools directly (they manage the server for stdio transport)

**Node/TypeScript:**
- Run `npm run build` and ensure it completes without errors
- Verify dist/index.js is created
- Manual testing: Run the server in tmux, then test with evaluation tools from the main process
- Or use evaluation tools directly (they manage the server for stdio transport)

#### 3.3 Use Quality Checklists

Load the appropriate checklist from language-specific guides to validate implementation quality:
- Python: See "Quality Checklist" in [Python Guide](./reference/python_mcp_server.md)
- Node/TypeScript: See "Quality Checklist" in [TypeScript Guide](./reference/node_mcp_server.md)

---

### Phase 4: Create Evaluations

After implementing the MCP server, create comprehensive evaluations to test its effectiveness.

**Load the [Evaluation Guide](./reference/evaluation.md) for the complete evaluation guide.**

#### 4.1 Understand Evaluation Purpose

Evaluations test whether an LLM can effectively use your MCP server to answer real, complex questions.

#### 4.2 Create 10 Evaluation Questions

The process for creating effective evaluations:

1. **Tool Inspection**: List available tools and understand their capabilities
2. **Content Exploration**: Use read-only operations to explore available data
3. **Question Generation**: Create 10 complex, real-world questions
4. **Answer Validation**: Solve each question yourself to verify answers

#### 4.3 Evaluation Requirements

Each question must be:
- **Independent**: Does not depend on other questions
- **Read-Only**: Requires only non-destructive operations
- **Complex**: Requires multiple tool calls and deep exploration
- **Realistic**: Based on real use cases humans actually care about
- **Verifiable**: Has a single, clear answer verifiable through string comparison
- **Stable**: Answer does not change over time

#### 4.4 Output Format

Create an XML file structured as follows:

```xml
<evaluation>
  <qa_pair>
    <question>Find the discussion about AI model releases using animal codenames. One model required a specific safety level in ASL-X format. What is the number X identified for the model named after a spotted wildcat?</question>
    <answer>3</answer>
  </qa_pair>
<!-- more qa_pairs... -->
</evaluation>
```

---

# Reference Files

## Documentation Library

Load these resources as needed during development:

### Core MCP Documentation (Load First)
- **MCP Protocol**: Fetch from `https://modelcontextprotocol.io/llms-full.txt` - Complete MCP specification
- [MCP Best Practices](./reference/mcp_best_practices.md) - General MCP guidelines including:
  - Server and tool naming conventions
  - Response format guidelines (JSON vs Markdown)
  - Pagination best practices
  - Character limits and truncation strategies
  - Tool development guidelines
  - Security and error handling standards

### SDK Documentation (Load During Phases 1/2)
- **Python SDK**: Fetch from `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- **TypeScript SDK**: Fetch from `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`

### Language-Specific Implementation Guides (Load During Phase 2)
- [Python Implementation Guide](./reference/python_mcp_server.md) - Complete Python/FastMCP guide including:
  - Server initialization patterns
  - Pydantic model examples
  - Tool registration with `@mcp.tool`
  - Complete working examples
  - Quality checklist

- [TypeScript Implementation Guide](./reference/node_mcp_server.md) - Complete TypeScript guide including:
  - Project structure
  - Zod schema patterns
  - Tool registration with `server.registerTool`
  - Complete working examples
  - Quality checklist

### Evaluation Guide (Load During Phase 4)
- [Evaluation Guide](./reference/evaluation.md) - Complete evaluation creation guide including:
  - Question creation guidelines
  - Answer validation strategies
  - XML format specification
  - Example questions and answers
  - Running evaluations with provided scripts

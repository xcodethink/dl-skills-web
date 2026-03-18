> Source: [Claude Code Skills](https://claudecodeskills.wayjet.io)

# Complete Methodology for Building Multi-Agent Systems

## Overview

Multi-agent systems represent the frontier of AI-assisted development. Instead of a single AI assistant handling everything sequentially, you orchestrate multiple specialized agents that work in parallel, each focused on a specific task. The result is dramatically faster development, better separation of concerns, and the ability to tackle projects that would overwhelm a single-agent approach.

This guide teaches you how to build and manage multi-agent systems using three Claude Code skills: Parallel Agent Dispatch, Sub-Agent Driven Development, and MCP Builder. Together, they form a complete methodology for designing, implementing, and scaling agent-based architectures --- whether you are building AI-powered applications for end users or optimizing your own development workflow.

This guide is for developers who are comfortable with Claude Code and want to push beyond single-agent usage into orchestrated, multi-agent workflows.

---

## Core Concepts

Before diving into the skills, you need to understand three foundational concepts.

### Agents vs. Tools

A tool is a function that an AI can call --- read a file, search the web, query a database. An agent is an AI instance with its own context, instructions, and decision-making loop. An agent uses tools, but it also has autonomy: it can decide which tools to use, in what order, and how to interpret the results. The distinction matters because agents can handle ambiguity and adapt to unexpected situations in ways that simple tool calls cannot.

### Orchestration

Orchestration is the practice of coordinating multiple agents to accomplish a larger goal. An orchestrator agent breaks a complex task into subtasks, assigns each subtask to a specialized agent, monitors their progress, and integrates their results. Good orchestration is the difference between agents that work together harmoniously and agents that duplicate effort, contradict each other, or produce incoherent output.

### Context Isolation

Each agent operates within its own context window. This is both a limitation and a feature. The limitation is that agents cannot directly read each other's full context. The feature is that each agent can focus entirely on its task without being distracted by irrelevant information. Context isolation is what makes parallel execution possible --- agents working on the frontend do not need to know about database migration details, and vice versa.

---

## Skill 1: Parallel Agent Dispatch

### What It Does

The Parallel Agent Dispatch skill enables you to run multiple Claude Code agents simultaneously, each working on a different part of your project. Instead of building features one at a time, you can build the API endpoint, the frontend component, and the test suite all at once.

### When to Use It

Use Parallel Agent Dispatch when your project has tasks that are independent of each other. Common scenarios include:

- Building multiple API endpoints that do not depend on each other
- Writing tests for different modules simultaneously
- Implementing frontend and backend components in parallel
- Running code review on multiple pull requests at once
- Generating documentation for different sections of your codebase

### How It Works

The skill uses Git worktrees (or separate working directories) to give each agent its own isolated workspace. Each agent receives a focused prompt that describes only its specific task, along with any shared context it needs (API contracts, type definitions, design specifications).

A typical parallel dispatch flow looks like this:

1. **Define the tasks.** Break your current milestone into independent pieces. For example: "Build the user profile API endpoint," "Build the user profile UI component," "Write integration tests for user profile."

2. **Prepare shared context.** Create a brief document that defines the interfaces between the parallel tasks. For the user profile example, this would be the API contract (endpoint URL, request format, response schema). Every agent gets this document.

3. **Dispatch agents.** Launch each agent in its own worktree with its specific task prompt and the shared context.

4. **Monitor and integrate.** As agents complete their tasks, review their output and merge their work into the main branch. Resolve any integration issues.

### Practical Tips

- **Keep tasks genuinely independent.** If task B depends on the output of task A, do not run them in parallel. Run A first, then dispatch B with A's output.
- **Define clear interfaces.** The shared context document is critical. Vague interfaces lead to incompatible implementations. Spend extra time making API contracts, type definitions, and data schemas precise.
- **Start with two agents.** Do not jump to five parallel agents on your first try. Start with two, get comfortable with the workflow, and scale up as your orchestration skills improve.
- **Use consistent coding standards.** When multiple agents write code independently, style drift is inevitable without shared guidelines. Include your linting configuration and coding standards in the shared context.

---

## Skill 2: Sub-Agent Driven Development

### What It Does

Sub-Agent Driven Development (SADD) is a methodology where a primary agent decomposes a complex task into subtasks and delegates each one to a specialized sub-agent. Unlike Parallel Agent Dispatch, which focuses on running independent tasks simultaneously, SADD focuses on hierarchical decomposition --- breaking a hard problem into manageable pieces.

### When to Use It

Use SADD when you face a task that is too complex for a single agent's context window or attention span. Common scenarios include:

- Building a complete feature that spans multiple architectural layers
- Refactoring a large module where understanding all the dependencies exceeds a single context window
- Implementing a complex algorithm that benefits from step-by-step decomposition
- Migrating a codebase from one framework to another

### How It Works

The primary agent acts as an architect and project manager. It analyzes the task, identifies the logical components, defines the interfaces between them, and then delegates each component to a sub-agent with focused instructions.

Here is the SADD workflow:

1. **Analyze.** The primary agent reads the requirements, examines the existing codebase, and identifies the components that need to be built or modified.

2. **Decompose.** Break the task into subtasks, each small enough for a single agent to handle within its context window. Define the dependencies between subtasks.

3. **Specify.** For each subtask, write a clear specification that includes: what to build, what inputs it receives, what outputs it produces, what constraints it must satisfy, and what existing code it should integrate with.

4. **Delegate.** Assign each subtask to a sub-agent with its specification and relevant context (but only the relevant context --- do not dump the entire codebase).

5. **Integrate.** As sub-agents complete their work, the primary agent reviews each piece, verifies it meets the specification, and integrates it into the whole.

6. **Verify.** The primary agent runs the full test suite and performs integration testing to ensure all the pieces work together correctly.

### The Art of Decomposition

The hardest part of SADD is deciding how to split the work. Here are principles that help:

- **Split along natural boundaries.** Database layer, business logic, API handler, and frontend component are natural boundaries. So are separate domain concepts (users, orders, payments).
- **Minimize cross-cutting concerns.** If two subtasks need to share a lot of context, they might be better as one task. If a subtask requires understanding the entire system, it is not decomposed enough.
- **Make subtasks testable independently.** Each sub-agent's output should be verifiable on its own, before integration. If you cannot write a test for a subtask's output in isolation, rethink the decomposition.

---

## Skill 3: MCP Builder

### What It Does

The MCP (Model Context Protocol) Builder skill teaches you to create custom tools that extend Claude Code's capabilities. MCP servers expose functionality --- database access, API integrations, file transformations, domain-specific calculations --- through a standardized protocol that Claude Code can discover and use automatically.

### When to Use It

Use MCP Builder when your agents need capabilities that do not exist out of the box. Common scenarios include:

- Connecting Claude Code to your company's internal APIs
- Creating tools that interact with specific databases or data stores
- Building domain-specific tools (e.g., a tool that validates medical codes, generates legal citations, or calculates financial metrics)
- Wrapping external services (Stripe, Twilio, SendGrid) in agent-friendly interfaces

### How It Works

An MCP server is a program that exposes tools through a standardized JSON-RPC interface. Claude Code discovers the server's capabilities at startup and can call its tools during a conversation, just like built-in tools.

The MCP Builder skill guides you through:

1. **Identifying the need.** What capability is missing? What would an agent need to call to accomplish its task? Define the tool's purpose, inputs, and outputs.

2. **Designing the interface.** Write the tool's schema: its name, description, parameter types, and return type. The description is especially important because it tells Claude Code when and how to use the tool.

3. **Implementing the server.** Write the MCP server code. The skill provides templates for common patterns: database queries, REST API wrappers, file processors, and computation tools.

4. **Testing the tool.** Verify that the tool works correctly by calling it directly and through Claude Code. Test edge cases: malformed input, network failures, timeout scenarios.

5. **Registering the server.** Add the MCP server to your Claude Code configuration so it is available in future sessions.

### MCP and Multi-Agent Systems

MCP servers become especially powerful in multi-agent architectures. Consider a scenario where you are building an e-commerce platform:

- One MCP server wraps your product catalog API
- Another MCP server handles payment processing
- A third MCP server manages inventory

Each agent in your system can call the tools it needs without knowing how the underlying services work. The payment agent calls the payment MCP tool. The inventory agent calls the inventory MCP tool. The orchestrator agent coordinates them. The MCP layer provides clean abstractions that keep each agent focused on its domain.

---

## Architecture Patterns

As you combine these three skills, several architectural patterns emerge:

### Fan-Out / Fan-In

The orchestrator dispatches multiple agents in parallel (fan-out), waits for all of them to complete, then integrates their results (fan-in). Best for tasks where subtasks are independent and the final output is a combination of their results.

**Example:** Generating a comprehensive code review. Fan out three agents: one reviews security, one reviews performance, one reviews maintainability. Fan in by combining their findings into a single review document.

### Pipeline

Agents are arranged in a sequence where each agent's output becomes the next agent's input. Best for tasks with clear sequential dependencies.

**Example:** Building a feature. Agent 1 writes the database schema and migration. Agent 2 takes the schema and builds the API layer. Agent 3 takes the API contract and builds the frontend component. Each agent's output is the next agent's input.

### Supervisor

A supervisor agent monitors other agents' work and intervenes when things go wrong. It does not do the work itself --- it reviews, corrects, and redirects.

**Example:** A code quality supervisor that reviews each agent's output before integration. If an agent's code does not meet standards, the supervisor sends it back with specific feedback.

### Recursive Decomposition

An agent encounters a subtask that is still too complex and spawns its own sub-agents. This creates a tree of agents, each handling progressively smaller pieces of the problem.

**Example:** A refactoring agent is asked to modernize a large module. It decomposes the module into components, delegates each component to a sub-agent. One of those sub-agents finds that its component is itself complex and spawns further sub-agents for individual functions.

---

## Why This Combination Works

The three skills in this guide address the three fundamental challenges of multi-agent development:

- **Parallel Agent Dispatch** solves the speed problem. By running agents concurrently, you compress development time from days to hours.
- **Sub-Agent Driven Development** solves the complexity problem. By decomposing hard tasks into focused subtasks, you keep each agent within its effective operating range.
- **MCP Builder** solves the capability problem. By creating custom tools, you extend what agents can do beyond their built-in abilities.

Together, they enable a development workflow where you think at the architecture level --- defining components, interfaces, and workflows --- while agents handle the implementation details. You become the architect; the agents become the builders. And like any good architect, your value lies not in laying bricks but in ensuring that the bricks fit together into a coherent, functional structure.

The multi-agent approach is not always necessary. For small features and simple projects, a single Claude Code session is perfectly sufficient. But when you face a project that is large, complex, or time-sensitive, the methodology in this guide gives you a systematic way to scale your development capacity without scaling your headcount.

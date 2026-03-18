> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: E-AI-and-Agents

---
name: google-adk-python
description: Build, evaluate, and deploy AI agents using Google Agent Development Kit (ADK) with tool integration and multi-agent orchestration
---

# Google ADK Python

## Overview

Google Agent Development Kit (ADK) for Python is an open-source, code-first toolkit for building, evaluating, and deploying AI agents. It supports hierarchical multi-agent systems, workflow agents, tool integration, and deployment to Vertex AI, Cloud Run, or custom infrastructure.

## When to Use

- Building AI agents with tool integration and orchestration
- Creating multi-agent systems with hierarchical coordination
- Implementing workflow agents (sequential, parallel, loop) for predictable pipelines
- Integrating LLM-powered agents with Google Search, Code Execution, or custom tools
- Deploying agents to Vertex AI Agent Engine, Cloud Run, or custom infrastructure
- Systematically evaluating and testing agent performance
- Implementing human-in-the-loop approval flows for tool execution

## Core Concepts

### Agent Types

**LlmAgent**: LLM-powered agents capable of dynamic routing and adaptive behavior
- Defined with name, model, instruction, description, and tools
- Supports sub-agents for delegation and coordination
- Context-aware intelligent decision making

**Workflow Agents**: Structured, predictable orchestration patterns
- **SequentialAgent**: Executes agents in defined order
- **ParallelAgent**: Runs multiple agents concurrently
- **LoopAgent**: Repeated execution with iteration logic

**BaseAgent**: Base class for custom agent implementations

### Key Components

**Tools Ecosystem**:
- Pre-built tools (google_search, code_execution)
- Custom Python functions as tools
- OpenAPI specification integration
- Tool confirmation flow for human approval

**Multi-Agent Architecture**:
- Hierarchical agent composition
- Domain-specific specialized agents
- Coordinator agents for task delegation

## Installation

```bash
# Stable release (recommended)
pip install google-adk

# Development version (latest features)
pip install git+https://github.com/google/adk-python.git@main
```

## Implementation Patterns

### Single Agent with Tools

```python
from google.adk.agents import LlmAgent
from google.adk.tools import google_search

agent = LlmAgent(
    name="search_assistant",
    model="gemini-2.5-flash",
    instruction="You are a helpful assistant that uses web search to find information.",
    description="Search assistant for web queries",
    tools=[google_search]
)
```

### Multi-Agent System

```python
from google.adk.agents import LlmAgent

# Specialized agents
researcher = LlmAgent(
    name="Researcher",
    model="gemini-2.5-flash",
    instruction="Research topics in depth using web search.",
    tools=[google_search]
)

writer = LlmAgent(
    name="Writer",
    model="gemini-2.5-flash",
    instruction="Write clear, engaging content based on research.",
)

# Coordinator agent
coordinator = LlmAgent(
    name="Coordinator",
    model="gemini-2.5-flash",
    instruction="Delegate tasks to the Researcher and Writer agents.",
    sub_agents=[researcher, writer]
)
```

### Custom Tool Creation

```python
from google.adk.tools import Tool

def calculate_sum(a: int, b: int) -> int:
    """Calculate the sum of two numbers."""
    return a + b

# Convert function to tool
sum_tool = Tool.from_function(calculate_sum)

agent = LlmAgent(
    name="calculator",
    model="gemini-2.5-flash",
    tools=[sum_tool]
)
```

### Sequential Workflow

```python
from google.adk.agents import SequentialAgent

workflow = SequentialAgent(
    name="research_workflow",
    agents=[researcher, summarizer, writer]
)
```

### Parallel Workflow

```python
from google.adk.agents import ParallelAgent

parallel_research = ParallelAgent(
    name="parallel_research",
    agents=[web_researcher, paper_researcher, expert_researcher]
)
```

### Human-in-the-Loop

```python
from google.adk.tools import google_search

# Tool requiring confirmation
agent = LlmAgent(
    name="careful_searcher",
    model="gemini-2.5-flash",
    tools=[google_search],
    tool_confirmation=True  # Requires approval before execution
)
```

## Deployment Options

### Cloud Run Deployment

```bash
# Containerize agent
docker build -t my-agent .

# Deploy to Cloud Run
gcloud run deploy my-agent --image my-agent
```

### Vertex AI Agent Engine

```python
# Deploy to Vertex AI for scalable agent hosting
# Integrates with Google Cloud's managed infrastructure
```

### Custom Infrastructure

```python
# Run agents locally or on custom servers
# Full control over deployment environment
```

## Model Support

**Optimized for Gemini**:
- gemini-2.5-flash
- gemini-2.5-pro
- gemini-1.5-flash
- gemini-1.5-pro

**Model Agnostic**: While optimized for Gemini, ADK supports other LLM providers through standard APIs.

## Best Practices

1. **Code-First Philosophy**: Define agents in Python for version control, testing, and flexibility
2. **Modular Design**: Create specialized agents for specific domains, compose into systems
3. **Tool Integration**: Leverage pre-built tools, extend with custom functions
4. **Evaluation**: Systematically test agents with test cases
5. **Security**: Implement confirmation flows for sensitive operations
6. **Hierarchical Structure**: Use coordinator agents for complex multi-agent workflows
7. **Workflow Selection**: Use workflow agents for predictable pipelines, LLM agents for dynamic routing

## Common Use Cases

- **Research Assistant**: Web search + summarization + report generation
- **Code Assistant**: Code execution + documentation + debugging
- **Customer Support**: Query routing + knowledge base + escalation
- **Content Creation**: Research + writing + editing pipeline
- **Data Analysis**: Data fetching + processing + visualization
- **Task Automation**: Multi-step workflows with conditional logic

## Development Interface

ADK includes a built-in interface for:
- Interactively testing agent behavior
- Debugging tool calls and responses
- Evaluating agent performance
- Iterating on agent design

## Resources

- GitHub: https://github.com/google/adk-python
- Documentation: https://google.github.io/adk-docs/
- llms.txt: https://raw.githubusercontent.com/google/adk-python/refs/heads/main/llms.txt

## Implementation Workflow

When implementing ADK-based agents:

1. **Define Requirements**: Identify agent capabilities and required tools
2. **Choose Architecture**: Single agent, multi-agent, or workflow-based
3. **Select Tools**: Pre-built tools, custom functions, or OpenAPI integrations
4. **Implement Agents**: Create agent definitions with instructions and tools
5. **Test Locally**: Use the development interface for iteration
6. **Add Evaluation**: Create test cases for systematic validation
7. **Deploy**: Choose Cloud Run, Vertex AI, or custom infrastructure
8. **Monitor**: Track agent performance and iterate

Remember: ADK treats agent development as traditional software engineering -- use version control, write tests, and follow engineering best practices.

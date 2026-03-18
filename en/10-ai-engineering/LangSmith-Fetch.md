> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Development Tools

---
name: langsmith-fetch
description: Triggers when debugging LangChain or LangGraph agents -- fetches execution traces from LangSmith Studio to investigate errors, analyze tool calls, check memory operations, or examine agent performance. Requires the langsmith-fetch CLI.
---

# LangSmith Fetch -- Agent Debugging

## Overview

This skill enables debugging of LangChain and LangGraph agents by fetching execution traces directly from LangSmith Studio via the terminal. It supports quick recent-activity scans, deep-dive trace analysis, session exports, and systematic error detection. The `langsmith-fetch` CLI must be installed and configured.

## Prerequisites

### Install the CLI

```bash
pip install langsmith-fetch
```

### Set Environment Variables

```bash
export LANGSMITH_API_KEY="your_langsmith_api_key"
export LANGSMITH_PROJECT="your_project_name"
```

Verify setup:

```bash
echo $LANGSMITH_API_KEY
echo $LANGSMITH_PROJECT
```

## Core Workflows

### Workflow 1: Quick Debug Recent Activity

**Trigger**: "What just happened?" / "Debug my agent"

```bash
langsmith-fetch traces --last-n-minutes 5 --limit 5 --format pretty
```

Analyze and report:

1. Number of traces found
2. Any errors or failures
3. Tools that were called
4. Execution times
5. Token usage

**Example output**:

```
Found 3 traces in the last 5 minutes:

Trace 1: Success
- Agent: memento
- Tools: recall_memories, create_entities
- Duration: 2.3s | Tokens: 1,245

Trace 2: Error
- Agent: cypher
- Error: "Neo4j connection timeout"
- Duration: 15.1s | Failed at: search_nodes tool

Trace 3: Success
- Agent: memento
- Tools: store_memory
- Duration: 1.8s | Tokens: 892

Issue found: Trace 2 failed due to Neo4j timeout.
Recommend checking database connection.
```

### Workflow 2: Deep Dive on a Specific Trace

**Trigger**: User provides a trace ID or says "Investigate that error"

```bash
langsmith-fetch trace <trace-id> --format json
```

Analyze the JSON and report:

1. What the agent was trying to do
2. Which tools were called (in order)
3. Tool results (success/failure)
4. Error messages (if any)
5. Root cause analysis
6. Suggested fix

### Workflow 3: Export Debug Session

**Trigger**: "Save this session" / "Export traces"

```bash
SESSION_DIR="langsmith-debug/session-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$SESSION_DIR"

# Export traces
langsmith-fetch traces "$SESSION_DIR/traces" \
  --last-n-minutes 30 --limit 50 --include-metadata

# Export threads (conversations)
langsmith-fetch threads "$SESSION_DIR/threads" --limit 20
```

### Workflow 4: Error Detection

**Trigger**: "Show me errors" / "What's failing?"

```bash
langsmith-fetch traces --last-n-minutes 30 --limit 50 --format json > recent-traces.json
grep -i "error\|failed\|exception" recent-traces.json
```

Report error types, frequency, timing, affected agents/tools, and common patterns.

## Common Use Cases

### Agent Not Responding

1. Check if traces exist: `langsmith-fetch traces --last-n-minutes 5 --limit 5`
2. If no traces: verify `LANGCHAIN_TRACING_V2=true` and `LANGCHAIN_API_KEY` are set
3. If traces found: review for errors, check execution time, verify tool calls completed

### Wrong Tool Called

1. Get the specific trace
2. Review available tools at execution time
3. Check agent reasoning for tool selection
4. Examine tool descriptions/instructions
5. Suggest prompt or tool config improvements

### Memory Not Working

```bash
langsmith-fetch traces --last-n-minutes 10 --limit 20 --format raw \
  | grep -i "memory\|recall\|store"
```

Check whether memory tools were called, recall returned results, and memories are being used.

### Performance Issues

```bash
langsmith-fetch traces ./perf-analysis \
  --last-n-minutes 30 --limit 50 --include-metadata
```

Analyze execution time per trace, tool call latencies, token usage, iteration count, and slowest operations.

## Output Formats

| Format | Flag | Use Case |
|---|---|---|
| Pretty | `--format pretty` | Quick visual inspection, showing to users |
| JSON | `--format json` | Detailed analysis, parsing data programmatically |
| Raw | `--format raw` | Piping to other commands, automation |

## Advanced Features

### Time-Based Filtering

```bash
langsmith-fetch traces --after "2025-12-24T13:00:00Z" --limit 20
langsmith-fetch traces --last-n-minutes 60 --limit 100
```

### Include Metadata

```bash
langsmith-fetch traces --limit 10 --include-metadata
# Returns: agent type, model, tags, environment
```

### Concurrent Fetching

```bash
langsmith-fetch traces ./output --limit 100 --concurrent 10
```

## Troubleshooting

### "No traces found matching criteria"

1. Try a longer timeframe: `--last-n-minutes 1440`
2. Verify environment variables: `echo $LANGSMITH_API_KEY && echo $LANGSMITH_PROJECT`
3. Try fetching threads instead: `langsmith-fetch threads --limit 10`
4. Confirm tracing is enabled: `LANGCHAIN_TRACING_V2=true`

### "Project not found"

```bash
langsmith-fetch config show
export LANGSMITH_PROJECT="correct-project-name"
# Or configure permanently:
langsmith-fetch config set project "your-project-name"
```

### Environment Variables Not Persisting

```bash
echo 'export LANGSMITH_API_KEY="your_key"' >> ~/.bashrc
echo 'export LANGSMITH_PROJECT="your_project"' >> ~/.bashrc
source ~/.bashrc
```

## Quick Reference

```bash
# Quick debug
langsmith-fetch traces --last-n-minutes 5 --limit 5 --format pretty

# Specific trace
langsmith-fetch trace <trace-id> --format pretty

# Export session
langsmith-fetch traces ./debug-session --last-n-minutes 30 --limit 50

# Find errors
langsmith-fetch traces --last-n-minutes 30 --limit 50 --format raw | grep -i error

# With metadata
langsmith-fetch traces --limit 10 --include-metadata
```

## Resources

- [LangSmith Fetch CLI](https://github.com/langchain-ai/langsmith-fetch)
- [LangSmith Studio](https://smith.langchain.com/)
- [LangChain Docs](https://docs.langchain.com/)

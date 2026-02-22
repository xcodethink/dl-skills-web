> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: F-Tools-and-Productivity

---
name: prompt-coach
description: Analyze Claude Code session logs to improve prompt quality, tool usage, and AI-native engineering efficiency
---

# Prompt Coach

## Overview

You are an AI-native engineering expert and prompt engineering specialist. You deeply understand how to build efficient AI workflows, write clear and effective prompts, leverage modern AI-assisted coding patterns, and measure and improve AI tool usage efficiency. Your role is to analyze Claude Code session logs and help developers become better AI-native engineers through usage pattern insights, prompt quality feedback, and coding behavior analysis.

## Feature Overview

This skill teaches Claude how to read and analyze your Claude Code session logs (`~/.claude/projects/*.jsonl`) to help you:

- **Improve prompt quality** -- Understand whether your prompts are clear and effective
- **Optimize tool usage** -- Discover powerful tools you are underutilizing
- **Increase efficiency** -- See how many iterations each task requires
- **Find productive hours** -- Know when you are most productive
- **Identify code hotspots** -- See your most frequently edited files
- **Reduce context switching** -- Measure the cost of project switching
- **Learn from errors** -- Understand common issues and recovery patterns

## How to Use This Skill

**Important:** This skill **analyzes local logs only**. It can only access Claude Code session logs stored in `~/.claude/projects/` on this machine.

### Quick Start: Comprehensive Analysis Mode

Get a full overview of all your Claude Code usage. Request comprehensive analysis and the prompt coach will deliver a complete report covering: token usage and costs, prompt quality (with specific examples), tool usage patterns and MCP adoption, session efficiency metrics, productive time patterns, file modification heatmap, error patterns and recovery, and context switching overhead.

**To get comprehensive analysis, just say:**
```
"Give me a comprehensive analysis of my Claude Code usage"
"Analyze my overall Claude Code usage"
"Give me a full report on my coding patterns"
"How is my overall Claude Code performance?"
```

### Option 1: Analyze All Projects

Ask directly:
```
"Analyze my prompt quality"
"How much did I spend on Claude Code this month?"
"When am I most productive?"
"Which tools do I use the most?"
```

### Option 2: List Available Projects First

```
"List all projects with Claude Code logs"
"Show me the projects I've worked on"
```

### Option 3: Analyze a Specific Project

```
"Analyze prompt quality for the ~/code/my-app project"
"Show token usage for the ~/code/experiments project"
```

## Prompt Engineering Best Practices (Claude Official Guidelines)

### The Golden Rule
**"Show your prompt to a colleague with minimal context. If they are confused, Claude probably will be too."**

Treat Claude like a brilliant new hire who needs clear, comprehensive instructions.

### Prompt Engineering Hierarchy (most to least effective)

1. **Be clear and direct** -- Most important
   - Provide context (purpose, audience, workflow, end goal)
   - Be specific about expectations
   - Use numbered or bulleted step-by-step instructions
   - Specify output format and constraints
   - Define success criteria

2. **Use examples (few-shot prompting)**
   - Show desired output format
   - Show variations and edge cases

3. **Let Claude think (chain of thought)**
   - Break complex tasks into step-by-step processes
   - Request reasoning before conclusions

4. **Use XML tags**
   - Structure prompts with XML for clarity
   - Separate different types of information

5. **Give Claude a role (system prompt)**
   - Set persona/expertise context

6. **Prefill Claude's response**
   - Guide output format

7. **Chain complex prompts**
   - Break large tasks into smaller steps

### Common Prompt Issues

**Vague/Unclear:**
- "Fix that bug"
- "Make it better"
- "Update the component"

**Clear/Specific:**
- "Fix the auth error in src/auth/login.ts where JWT token validation returns 401"
- "Refactor UserList component to use React.memo to reduce re-renders and improve performance"
- "Update the Button component in src/components/Button.tsx to use the new design system colors from design-tokens.ts"

### Context-Aware Scoring

**Key insight:** Short does not necessarily mean bad. Prompt quality depends on **what was said** and **what context Claude already has**.

**Context-rich short prompts (excellent, do not flag as vague):**
- "git commit" -- Claude can see the git diff and will generate a good commit message (score 8-10)
- "run tests" -- Project structure provides test command context (score 8-10)
- "yes"/"no"/"1"/"2" -- Answering Claude's questions (high score)
- "continue" -- Responding to Claude's confirmation request (high score)

**Context-lacking vague prompts (needs improvement):**
- "fix the bug" -- No context about which bug (score 2)
- "optimize it" -- No discussion of performance (low score)
- "make it better" -- "better" is too subjective (low score)

## 8 Analysis Tasks

### 0. Comprehensive Analysis Mode
Runs all 8 analyses at once, producing a unified report with executive summary and all sections.

### 1. Token Usage and Cost Analysis
- Deduplicate using message.id + requestId
- Use model-specific pricing
- Show per-model cost breakdown
- Cache efficiency analysis

**Claude API Pricing Reference:**

| Model | Input | Output | Cache Write | Cache Read |
|-------|-------|--------|-------------|------------|
| **Opus 4.1** | $15/1M | $75/1M | $18.75/1M | $1.50/1M |
| **Sonnet 4.5** (<=200K) | $3/1M | $15/1M | $3.75/1M | $0.30/1M |
| **Sonnet 4.5** (>200K) | $6/1M | $22.50/1M | $7.50/1M | $0.60/1M |
| **Haiku 4.5** | $1/1M | $5/1M | $1.25/1M | $0.10/1M |

**Note:** Opus is 5x more expensive than Sonnet!

### 2. Prompt Quality Analysis
- Context-aware scoring (0-10)
- Identify context-rich short prompts (e.g., git commands)
- Flag genuinely vague prompts with improvement suggestions
- Generate "Areas for Improvement" section (all prompts scoring 0-4)

### 3. Tool Usage Patterns
- Built-in tool summary
- MCP tool detailed analysis
- Tool adoption insights
- Common workflow identification

### 4. Session Efficiency Analysis
- Average iterations per task
- Session duration patterns
- Completion rates
- Quick tasks vs deep work

### 5. Productive Time Patterns
- Peak productivity hours
- Day-of-week analysis
- Efficiency by time of day
- Scheduling recommendations

### 6. File Modification Heatmap
- Most frequently edited files
- Hotspot directories
- Code churn insights
- Refactoring opportunities

### 7. Error and Recovery Analysis
- Common errors
- Recovery time by error type
- Patterns and recommendations
- Prevention strategies

### 8. Project Switching Analysis
- Active project count
- Time allocation
- Context switching cost
- Focus optimization suggestions

## Log File Location

All Claude Code sessions are recorded at: `~/.claude/projects/`

**Directory structure:**
- Each project has a directory named with escaped path: `-Users-username-path-to-project/`
- Each session is a `.jsonl` file named with a UUID
- Each line is a JSON object representing a conversation event

## Log Entry Formats

### User Messages
```json
{
  "type": "user",
  "message": {
    "role": "user",
    "content": "User's prompt text"
  },
  "timestamp": "2025-10-25T13:31:07.035Z",
  "sessionId": "session-uuid",
  "cwd": "/Users/username/code/project",
  "gitBranch": "main"
}
```

### Assistant Messages
```json
{
  "type": "assistant",
  "message": {
    "model": "claude-sonnet-4-5-20250929",
    "role": "assistant",
    "content": [...],
    "usage": {
      "input_tokens": 1000,
      "output_tokens": 500,
      "cache_creation_input_tokens": 2000,
      "cache_read_input_tokens": 5000
    }
  },
  "timestamp": "2025-10-25T13:31:15.369Z"
}
```

## Common Tools List

| Tool | Purpose |
|------|---------|
| `Read` | File reading |
| `Write` | File writing |
| `Edit` | File editing |
| `Bash` | Shell commands |
| `Grep` | Code search |
| `Glob` | File pattern matching |
| `Task` | Sub-agent tasks |
| `TodoWrite` | Todo list management |
| `WebFetch` | Web page fetching |
| `WebSearch` | Web search |
| `mcp__*` | Various MCP server tools |

## Example Queries

### Comprehensive Analysis
- "Give me a comprehensive analysis of my Claude Code usage"
- "How is my overall Claude Code performance?"

### Specific Analysis
- "How much did I spend on Claude Code this month?"
- "How good are my prompts?"
- "Which tools do I use most?"
- "When am I most productive?"
- "Which files do I edit most?"
- "How efficient are my sessions?"

### Project-Specific Analysis
- "Analyze prompt quality for the ~/code/my-app project"
- "Show token usage for the ~/code/experiments project"

## Important Notes

- Always use existing tools (Read, Bash, Grep) -- you have file access
- Parse JSON yourself
- Show specific examples from logs when helpful
- Give actionable, personalized advice
- Be encouraging but honest about areas for improvement
- Calculate costs accurately
- **Critical:** Always deduplicate token usage with message.id + requestId
- **Critical:** Always use model-specific pricing
- Tailor cost optimization advice to user's pricing model (pay-per-use vs subscription)

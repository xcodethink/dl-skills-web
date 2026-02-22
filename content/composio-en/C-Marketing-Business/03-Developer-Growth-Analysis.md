> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Marketing & Business

---
name: developer-growth-analysis
description: Analyzes recent Claude Code chat history to identify coding patterns, development gaps, and areas for improvement, then curates learning resources and delivers a personalized growth report.
---

# Developer Growth Analysis

## Overview

This skill provides personalized feedback on your recent coding work by analyzing your Claude Code chat interactions. It identifies patterns that reveal strengths and areas for growth, generates a prioritized improvement plan with evidence-based recommendations, curates relevant learning resources from HackerNews, and optionally delivers the report to your Slack DMs.

## When to Use

- Understanding your development patterns and habits from recent work
- Identifying specific technical gaps or recurring challenges
- Discovering which topics would benefit from deeper study
- Getting curated learning resources tailored to your actual work patterns
- Tracking improvement areas across recent projects
- Wanting structured feedback without waiting for code reviews

## What It Does

1. **Reads Chat History** -- Accesses local Claude Code chat history from the past 24-48 hours
2. **Identifies Patterns** -- Analyzes problem types, technologies used, challenges encountered, and approach style
3. **Detects Improvement Areas** -- Recognizes repeated struggles, inefficient approaches, and knowledge gaps
4. **Generates a Report** -- Creates a comprehensive report with work summary, improvement areas, and recommendations
5. **Finds Learning Resources** -- Curates high-quality HackerNews articles relevant to your specific gaps
6. **Delivers to Slack** -- Optionally sends the complete report to your Slack DMs for easy reference

## How to Use

```
Analyze my developer growth from my recent chats
```

```
Analyze my work from today and suggest areas for improvement
```

## How It Works

### Step 1: Access Chat History

Reads `~/.claude/history.jsonl` -- a JSONL file where each line contains:
- `display`: Your message/request
- `project`: The project being worked on
- `timestamp`: Unix timestamp (in milliseconds)
- `pastedContents`: Any code or content pasted

Filters for entries from the past 24-48 hours.

### Step 2: Analyze Work Patterns

Extracts and analyzes:
- **Projects and Domains** -- Backend, frontend, DevOps, data, etc.
- **Technologies Used** -- Languages, frameworks, and tools appearing in conversations
- **Problem Types** -- Performance optimization, debugging, feature implementation, refactoring, configuration
- **Challenges Encountered** -- Repeated questions, multi-attempt problems, knowledge gap indicators
- **Approach Patterns** -- Methodical, exploratory, or experimental problem-solving style

### Step 3: Identify Improvement Areas

Produces 3-5 specific areas that are:
- **Specific** -- Not vague like "improve coding skills"
- **Evidence-based** -- Grounded in actual chat history
- **Actionable** -- Practical improvements that can be made
- **Prioritized** -- Most impactful first

Good improvement area examples:
- "Advanced TypeScript patterns (generics, utility types, type guards) -- you struggled with type safety in [specific project]"
- "Error handling and validation -- I noticed you patched several bugs related to missing null checks"
- "Database query optimization -- you rewrote the same query multiple times"

### Step 4: Generate Report

```markdown
# Your Developer Growth Report

**Report Period**: [Date Range]
**Last Updated**: [Current Date and Time]

## Work Summary
[2-3 paragraphs summarizing projects, technologies, and focus areas]

## Improvement Areas (Prioritized)

### 1. [Area Name]
**Why This Matters**: [Explanation of importance]
**What I Observed**: [Specific evidence from chat history]
**Recommendation**: [Concrete steps to improve]
**Time to Skill Up**: [Effort estimate]

---

### 2. [Area Name]
[Same structure]

## Strengths Observed
- [Strength 1 with example]
- [Strength 2 with example]

## Action Items
1. [Highest priority action]
2. [Next priority]
3. [Next priority]

## Curated Learning Resources

### For: [Improvement Area]
1. **[Article Title]** - [Date]
   [Why it is relevant to your improvement area]
   [Link]

2. **[Article Title]** - [Date]
   [Description]
   [Link]
```

### Step 5: Search for Learning Resources

Uses HackerNews to find resources for each improvement area:
- Constructs targeted search queries
- Prioritizes posts with high engagement (comments, upvotes)
- Provides 2-3 articles per improvement area with relevance explanations

### Step 6: Deliver to Slack (Optional)

If Slack is connected via Rube MCP:
- Sends the report as formatted sections to your DMs
- Breaks report into logical parts (Summary, Improvements, Strengths, Actions, Resources)
- Includes clickable links for learning resources

## Example Report

```markdown
# Your Developer Growth Report

**Report Period**: November 9-10, 2024
**Last Updated**: November 10, 2024, 9:15 PM UTC

## Work Summary
Over the past two days, you focused on backend infrastructure and API
development. Your primary project was an open-source showcase application,
where you made significant progress on connections management, UI
improvements, and deployment configuration. You worked with TypeScript,
React, and Node.js.

## Improvement Areas (Prioritized)

### 1. Advanced TypeScript Patterns and Type Safety
**Why This Matters**: TypeScript is central to your work, but leveraging
its advanced features can significantly improve code reliability.

**What I Observed**: You struggled a few times with typing auth
configurations properly and had to iterate on union types for different
connection states.

**Recommendation**: Study utility types (Omit, Pick, Record), conditional
types, and discriminated unions. Apply these to your connection
configuration handling.

**Time to Skill Up**: 5-8 hours of focused learning

### 2. Secure Data Handling in UI
**Why This Matters**: Preventing information leakage is critical for
applications handling user credentials and API keys.

**What I Observed**: You caught that your "Your Apps" page was showing
full connection data including auth configs.

**Recommendation**: Create reusable patterns for filtering/masking
sensitive information before display. Implement a secure data layer
that explicitly whitelists what can be shown.

**Time to Skill Up**: 3-4 hours

## Strengths Observed
- **Security Awareness**: Proactively identified data leakage issues
- **Iterative Refinement**: Worked through UI requirements methodically
- **Full-Stack Capability**: Comfortably work across backend, frontend,
  and deployment

## Action Items
1. Spend 1-2 hours learning TypeScript utility types and discriminated
   unions; apply to your connection data structures
2. Document security patterns for your project
3. Study one article on advanced React patterns and apply one pattern
4. Set up a code review checklist focused on type safety and data security
```

## Tips and Best Practices

- Run this analysis once a week to track your improvement trajectory
- Pick one improvement area at a time and focus on it for a few days
- Use the learning resources as a study guide -- they are curated for your actual work
- Revisit the report after focusing on an area for a week to see how your patterns change
- The recommendations are evidence-based and grounded in real projects, not generic topics

> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Marketing & Business

---
name: lead-research-assistant
description: Identifies high-quality leads by analyzing your business, searching for target companies, scoring them by fit, and providing actionable contact strategies.
---

# Lead Research Assistant

## Overview

This skill helps you identify and qualify potential leads for your business by analyzing your product or service, understanding your ideal customer profile, and providing actionable outreach strategies. It works best when run from your product's source code directory, allowing it to automatically understand what you are building and match it against potential customers.

## When to Use

- Finding potential customers or clients for your product/service
- Building a list of companies for partnership outreach
- Identifying target accounts for sales campaigns
- Researching companies that match your ideal customer profile
- Preparing for business development activities

## What It Does

1. **Understands Your Business** -- Analyzes your product, value proposition, and target market
2. **Identifies Target Companies** -- Finds companies matching your ICP by industry, size, tech stack, growth stage, and pain points
3. **Prioritizes Leads** -- Ranks companies with a fit score (1-10) based on relevance
4. **Provides Contact Strategies** -- Suggests how to approach each lead with personalized messaging
5. **Enriches Data** -- Gathers relevant information about decision-makers and company context

## How to Use

### Basic Usage

```
I'm building [product description]. Find me 10 companies in
[location/industry] that would be good leads for this.
```

### From Your Codebase

For better results, run from your product's source code directory:

```
Look at what I'm building in this repository and identify the top
10 companies in [location/industry] that would benefit from this product.
```

### Advanced Usage

```
My product: [description]
Ideal customer profile:
- Industry: [industry]
- Company size: [size range]
- Location: [location]
- Current pain points: [pain points]
- Technologies they use: [tech stack]

Find me 20 qualified leads with contact strategies for each.
```

## How It Works

### 1. Understand the Product/Service
- If in a code directory, analyzes the codebase to understand the product
- Asks clarifying questions about the value proposition
- Identifies key features, benefits, and problems solved

### 2. Define Ideal Customer Profile
- Target industries and sectors
- Company size ranges
- Geographic preferences
- Relevant pain points
- Technology requirements

### 3. Research and Identify Leads
- Searches for companies matching the criteria
- Looks for signals of need (job postings, tech stack, recent news)
- Considers growth indicators (funding, expansion, hiring)
- Identifies companies with complementary products/services

### 4. Prioritize and Score
Creates a fit score (1-10) based on:
- Alignment with ICP
- Signals of immediate need
- Budget availability
- Competitive landscape
- Timing indicators

### 5. Output Format

```markdown
# Lead Research Results

## Summary
- Total leads found: [X]
- High priority (8-10): [X]
- Medium priority (5-7): [X]
- Average fit score: [X]

---

## Lead 1: [Company Name]

**Website**: [URL]
**Priority Score**: [X/10]
**Industry**: [Industry]
**Size**: [Employee count/revenue range]

**Why They're a Good Fit**:
[2-3 specific reasons based on their business]

**Target Decision Maker**: [Role/Title]
**LinkedIn**: [URL if available]

**Value Proposition for Them**:
[Specific benefit for this company]

**Outreach Strategy**:
[Personalized approach -- mention specific pain points,
recent company news, or relevant context]

**Conversation Starters**:
- [Specific point 1]
- [Specific point 2]

---

[Repeat for each lead]
```

## Examples

### Example 1: Developer Tool

**Prompt**: "I'm building a tool that masks sensitive data in AI coding assistant queries. Find potential leads."

**Result**: A prioritized list of companies that:
- Use AI coding assistants (Copilot, Cursor, etc.)
- Handle sensitive data (fintech, healthcare, legal)
- Have evidence in their GitHub repos of using coding agents
- May have accidentally exposed sensitive data in code
- Includes LinkedIn URLs of relevant decision-makers

### Example 2: Local Consulting

**Prompt**: "I run a consulting practice for remote team productivity. Find me 10 companies in the Bay Area that recently went remote."

**Result**: Companies that:
- Recently posted remote job listings
- Announced remote-first policies
- Are hiring distributed teams
- Show signs of remote work challenges
- Each has personalized outreach strategies

## Next Steps After Lead Research

- Draft personalized outreach emails for top leads
- Build a CRM-ready CSV of qualified prospects
- Conduct deeper research on the highest-scoring leads
- Analyze competitor customer bases
- Identify partnership opportunities

## Tips for Best Results

- **Be specific** about your product and its unique value
- **Run from your codebase** if applicable for automatic context
- **Provide context** about your ideal customer profile
- **Specify constraints** like industry, location, or company size
- **Request follow-up** research on promising leads for deeper insights

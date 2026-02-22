> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Docs & Productivity

---
name: internal-comms
description: Writes internal communications using company-standard formats -- 3P updates, company newsletters, FAQ responses, status reports, leadership updates, and incident reports.
---

# Internal Communications Writer

## Overview

This skill helps you write all kinds of internal company communications using standardized formats. It covers 3P updates (Progress, Plans, Problems), company-wide newsletters, FAQ compilations, and general internal comms. Each format has specific guidelines for tone, structure, and content sourcing to ensure consistency across the organization.

## When to Use

- Writing 3P updates (Progress, Plans, Problems)
- Drafting company-wide newsletters
- Compiling FAQ responses
- Creating status reports or leadership updates
- Writing project updates or incident reports
- Any internal communication that needs a standard format

## Communication Types

---

### 1. 3P Updates (Progress, Plans, Problems)

**Audience**: Executives, leadership, teammates with limited context on your team.

**Purpose**: Succinct team status readable in 30-60 seconds. Covers one week of work.

**Format** (strict):

```
[emoji] [Team Name] (Dates Covered)
Progress: [1-3 sentences]
Plans: [1-3 sentences]
Problems: [1-3 sentences]
```

**Content guidelines**:
- **Progress**: What the team accomplished. Focus on shipped features, milestones achieved, tasks completed.
- **Plans**: What the team will do next week. Focus on top-of-mind, high-priority items.
- **Problems**: What is slowing the team down. Blockers, staffing gaps, bugs, deals that fell through.

**Scale matters**: The bigger the team, the less granular the tasks. A mobile team might have "shipped feature" while the company level might have "closed 10 new deals."

**Tone**: Matter-of-fact, data-driven, include metrics where possible. Not prose-heavy.

**Data sources** (if available):
- Slack: Posts from team members with lots of reactions
- Google Drive: Docs from critical team members with lots of views
- Email: High-engagement emails with relevant content
- Calendar: Non-recurring meetings of importance (product reviews, etc.)

**Workflow**:
1. Clarify team name and time period
2. Gather information from tools or the user
3. Draft following the strict format
4. Review for conciseness (30-60 second read) and data-driven content

---

### 2. Company Newsletter

**Audience**: Entire company (1000+ people).

**Purpose**: Summarize the past week/month for the whole organization. Sent via Slack and email.

**Format**: 20-25 bullet points, organized into sections with emoji headers.

```
:megaphone: Company Announcements
- Announcement 1
- Announcement 2

:dart: Progress on Priorities
- Area 1
    - Sub-area 1
    - Sub-area 2
- Area 2
    - Sub-area 1

:pillar: Leadership Updates
- Post 1
- Post 2

:thread: Social Updates
- Update 1
- Update 2
```

**Content guidelines**:
- Each bullet should be 1-2 sentences maximum
- Use "we" tense -- you are part of the company
- Include lots of links (Google Drive docs, Slack messages, emails)
- Break into sections covering different areas of the company

**Prioritize**:
- Company-wide impact (not team-specific details)
- Announcements from leadership
- Major milestones and achievements
- Information that affects most employees
- External recognition or press

**Avoid**:
- Overly granular team updates (save for 3Ps)
- Information only relevant to small groups
- Duplicate information already communicated

**Data sources** (if available):
- Slack: Messages in large channels with lots of reactions/responses
- Email: Company-wide announcements from executives
- Calendar: Large meetings (All-Hands, company announcements), attached documents
- Documents: High-attention docs (vision docs, quarterly plans, executive-authored)
- External press: Articles or press coverage from the past week

---

### 3. FAQ Responses

**Audience**: All employees.

**Purpose**: Surface and answer the most common questions across the company to minimize confusion and keep everyone aligned.

**Format**:

```
- *Question*: [1 sentence]
- *Answer*: [1-2 sentences]
```

**Content guidelines**:
- Focus on questions that affect a large portion of the employee base
- Cover areas like: corporate events (fundraising, new executives), upcoming launches, hiring progress, changes to vision or focus
- Be holistic -- capture the entire company, not just one team
- Base answers on official communications when possible
- If information is uncertain, indicate that clearly
- Link to authoritative sources
- Keep tone professional but approachable
- Flag questions requiring executive input

**Data sources** (if available):
- Slack: Questions with lots of reactions or support
- Email: FAQs written directly in company emails
- Documents: Docs on Google Drive, linked on calendar events

---

### 4. General Communications

**Purpose**: Any internal communication that does not fit the standard formats above.

**Before writing, clarify**:
1. Target audience
2. Communication purpose
3. Desired tone (formal, casual, urgent, informational)
4. Specific formatting requirements

**General principles**:
- Be clear and concise
- Use active voice
- Put the most important information first
- Include relevant links and references
- Match the company's communication style

## Workflow Summary

1. **Identify the communication type** from the request
2. **Load the appropriate guidelines** (3P, newsletter, FAQ, or general)
3. **Gather information** from available tools or directly from the user
4. **Draft** following the specific format and tone guidelines
5. **Review** for conciseness, accuracy, and appropriate level of detail

If the communication type is unclear, ask for clarification about the desired format and audience.

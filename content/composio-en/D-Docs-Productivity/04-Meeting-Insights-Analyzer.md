> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Docs & Productivity

---
name: meeting-insights-analyzer
description: Analyzes meeting transcripts to uncover behavioral patterns, communication insights, and actionable feedback -- identifying conflict avoidance, filler words, speaking ratios, and missed opportunities.
---

# Meeting Insights Analyzer

## Overview

This skill transforms your meeting transcripts into actionable insights about your communication patterns. It identifies recurring behaviors such as conflict avoidance, filler word usage, speaking dominance, and facilitation gaps, then provides specific timestamped examples with concrete improvement recommendations. It is ideal for professionals seeking to improve communication and leadership skills with data-driven feedback.

## When to Use

- Analyzing communication patterns across multiple meetings
- Getting feedback on leadership and facilitation style
- Identifying when you avoid difficult conversations
- Understanding speaking habits and filler words
- Tracking improvement in communication skills over time
- Preparing for performance reviews with concrete examples
- Coaching team members on their communication style

## What It Does

1. **Pattern Recognition** -- Identifies conflict avoidance, speaking ratios, question-asking patterns, active listening indicators, and decision-making approaches
2. **Communication Analysis** -- Evaluates clarity, directness, filler words, hedging language, tone, and meeting control
3. **Actionable Feedback** -- Provides specific, timestamped examples with what happened, why it matters, and how to improve
4. **Trend Tracking** -- Compares patterns over time when analyzing multiple meetings

## How to Use

### Setup

1. Download meeting transcripts to a folder (e.g., `~/meetings/`)
2. Navigate to that folder in Claude Code
3. Ask for the analysis you want

### Quick Start

```
Analyze all meetings in this folder and tell me when I avoided conflict.
```

```
Look at my meetings from the past month and identify my communication patterns.
```

```
Compare my facilitation style between these two meeting folders.
```

### Advanced Analysis

```
Analyze all transcripts in this folder and:
1. Identify when I interrupted others
2. Calculate my speaking ratio
3. Find moments I avoided giving direct feedback
4. Track my use of filler words
5. Show examples of good active listening
```

## Analysis Categories

### Conflict Avoidance
- Hedging language ("maybe", "kind of", "I think")
- Indirect phrasing instead of direct requests
- Changing subject when tension arises
- Agreeing without commitment ("yeah, but...")
- Not addressing obvious problems

### Speaking Ratios
- Percentage of meeting spent speaking
- Interruption counts (by and of the user)
- Average speaking turn length
- Question vs. statement ratios

### Filler Words
- Count of "um", "uh", "like", "you know", "actually", etc.
- Frequency per minute or per speaking turn
- Situations where they increase (nervous, uncertain)

### Active Listening
- Questions that reference others' previous points
- Paraphrasing or summarizing others' ideas
- Building on others' contributions
- Asking clarifying questions

### Leadership and Facilitation
- Decision-making approach (directive vs. collaborative)
- How disagreements are handled
- Inclusion of quieter participants
- Time management and agenda control
- Follow-up and action item clarity

## Output Format

### Pattern Report

```markdown
### [Pattern Name]

**Finding**: [One-sentence summary]
**Frequency**: [X times across Y meetings]

**Examples**:

1. **[Meeting Name/Date]** - [Timestamp]

   **What Happened**:
   > [Actual quote from transcript]

   **Why This Matters**:
   [Explanation of the impact or missed opportunity]

   **Better Approach**:
   [Specific alternative phrasing or behavior]
```

### Summary Report

```markdown
# Meeting Insights Summary

**Analysis Period**: [Date range]
**Meetings Analyzed**: [X meetings]
**Total Duration**: [X hours]

## Key Patterns Identified

### 1. [Primary Pattern]
- **Observed**: [What was found]
- **Impact**: [Why it matters]
- **Recommendation**: [How to improve]

## Communication Strengths
1. [Strength 1 with example]
2. [Strength 2 with example]

## Growth Opportunities
1. **[Area 1]**: [Specific, actionable advice]
2. **[Area 2]**: [Specific, actionable advice]

## Speaking Statistics
- Average speaking time: [X% of meeting]
- Questions asked: [X per meeting average]
- Filler words: [X per minute]
- Interruptions: [X given / Y received per meeting]

## Next Steps
[3-5 concrete actions to improve communication]
```

## Example: Conflict Avoidance Analysis

**Found**: 23 instances across 15 meetings of indirect communication or avoided tensions.

**Pattern: Hedging on Critical Feedback** (8 times across 7 meetings)

**Example -- 1:1 with Sarah at 00:14:32**:
> "So, I was thinking... maybe we could, like, potentially consider looking at the timeline again? I mean, if you think that makes sense. But whatever you think is best!"

**Why it matters**: Sarah's project was behind schedule, but the hedging language and deflection made it easy for her to miss the urgency.

**Better approach**: "Sarah, the project is two weeks behind schedule. We need to discuss what's blocking progress and create a new timeline today."

**Recommendations**:
1. Name the issue directly in the first sentence
2. Remove hedging words like "maybe," "kind of," "sort of"
3. Ask specific questions instead of hinting
4. Schedule difficult conversations instead of raising them casually

## Getting Transcripts

**From Zoom**: Enable cloud recording with transcription, download VTT or SRT files

**From Google Meet**: Use Google Docs auto-transcription, save and download as .txt files

**From Otter.ai / Fireflies.ai**: Export transcripts in bulk, store in a local folder

**From Granola**: Auto-transcribes meetings, export to a folder

## Best Practices

1. **Consistent naming** -- Use `YYYY-MM-DD - Meeting Name.txt` format
2. **Regular analysis** -- Review monthly or quarterly for trends
3. **Specific queries** -- Ask about one behavior at a time for depth
4. **Privacy** -- Keep sensitive meeting data local
5. **Action-oriented** -- Focus on one improvement area at a time

## Common Analysis Requests

- "When do I avoid difficult conversations?"
- "How often do I interrupt others?"
- "What's my speaking vs. listening ratio?"
- "Do I ask good questions?"
- "How do I handle disagreement?"
- "Am I inclusive of all voices?"
- "Do I use too many filler words?"
- "How clear are my action items?"
- "Do I stay on agenda or get sidetracked?"
- "How has my communication changed over time?"

> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Marketing & Business

---
name: content-research-writer
description: Assists in writing high-quality content by conducting research, adding citations, improving hooks, iterating on outlines, and providing section-by-section feedback.
---

# Content Research Writer

## Overview

This skill acts as a collaborative writing partner, helping you research, outline, draft, and refine content while maintaining your unique voice and style. It transforms the writing process from a solo effort into a structured partnership with feedback at every stage -- from initial outline through final polish.

## When to Use

- Writing blog posts, articles, or newsletters
- Creating educational content or tutorials
- Drafting thought leadership pieces
- Researching and writing case studies
- Producing technical documentation with sources
- Improving hooks and introductions
- Getting section-by-section feedback while writing

## Capabilities

1. **Collaborative Outlining** -- Structures ideas into coherent outlines
2. **Research Assistance** -- Finds relevant information and adds citations
3. **Hook Improvement** -- Strengthens openings to capture attention
4. **Section Feedback** -- Reviews each section as you write
5. **Voice Preservation** -- Maintains your writing style and tone
6. **Citation Management** -- Adds and formats references properly
7. **Iterative Refinement** -- Improves content through multiple drafts

## Setup and Basic Workflow

### Environment Setup

Create a dedicated folder for your article:
```bash
mkdir ~/writing/my-article-title
cd ~/writing/my-article-title
touch article-draft.md
```

Open Claude Code from this directory and start writing.

### Recommended File Organization

```
~/writing/article-name/
├── outline.md          # Your outline
├── research.md         # All research and citations
├── draft-v1.md         # First draft
├── draft-v2.md         # Revised draft
├── final.md            # Publication-ready
├── feedback.md         # Collected feedback
└── sources/            # Reference materials
    ├── study1.pdf
    └── article2.md
```

### Step-by-Step Workflow

1. **Start with an outline**:
```
Help me create an outline for an article about [topic]
```

2. **Research and add citations**:
```
Research [specific topic] and add citations to my outline
```

3. **Improve the hook**:
```
Here's my introduction. Help me make the hook more compelling.
```

4. **Get section feedback**:
```
I just finished the "Why This Matters" section. Review it and give feedback.
```

5. **Refine and polish**:
```
Review the full draft for flow, clarity, and consistency.
```

## How It Works

### 1. Understanding the Writing Project

The skill gathers key context through clarifying questions:
- What is the topic and main argument?
- Who is the target audience?
- What is the desired length/format?
- What is the goal? (educate, persuade, entertain, explain)
- Any existing research or sources to include?
- What is the writing style? (formal, conversational, technical)

### 2. Collaborative Outlining

Produces a structured outline with research gaps identified:

```markdown
# Article Outline: [Title]

## Hook
- [Opening line/story/statistic]
- [Why reader should care]

## Introduction
- Context and background
- Problem statement
- What this article covers

## Main Sections

### Section 1: [Title]
- Key point A
- Key point B
- Example/evidence
- [Research needed: specific topic]

### Section 2: [Title]
- Key point C
- Key point D
- Data/citation needed

### Section 3: [Title]
- Key point E
- Counter-arguments
- Resolution

## Conclusion
- Summary of main points
- Call to action
- Final thought

## Research To-Do
- [ ] Find data on [topic]
- [ ] Get examples of [concept]
- [ ] Source citation for [claim]
```

### 3. Research and Citations

When research is requested, the skill compiles findings with proper attribution:

```markdown
## Research: AI Impact on Productivity

Key Findings:

1. **Productivity Gains**: Studies show 40% time savings for
   content creation tasks [1]

2. **Adoption Rates**: 67% of knowledge workers use AI tools
   weekly [2]

3. **Expert Quote**: "AI augments rather than replaces human
   creativity" - Dr. Jane Smith, MIT [3]

Citations:
[1] McKinsey Global Institute. (2024). "The Economic Potential
    of Generative AI"
[2] Stack Overflow Developer Survey (2024)
[3] Smith, J. (2024). MIT Technology Review interview
```

### 4. Hook Improvement

When you share an introduction, the skill analyzes and offers alternatives:

**Option 1 (Data-driven)**:
> "Last month, I asked AI to analyze 500 customer interviews. It took 30 minutes instead of 3 weeks. Product management will never be the same."

**Option 2 (Question)**:
> "What if you could talk to every customer, read every review, and analyze every support ticket -- all before your morning coffee?"

**Option 3 (Story)**:
> "Sarah spent two weeks building the wrong feature. Not because she didn't understand her users, but because she couldn't process the hundreds of interviews fast enough to spot the pattern."

### 5. Section-by-Section Feedback

Each section is reviewed across multiple dimensions:

```markdown
# Feedback: [Section Name]

## What Works Well
- [Strength 1]
- [Strength 2]

## Suggestions for Improvement

### Clarity
- [Specific issue] -> [Suggested fix]
- [Complex sentence] -> [Simpler alternative]

### Flow
- [Transition issue] -> [Better connection]

### Evidence
- [Claim needing support] -> [Add citation or example]

### Style
- [Tone inconsistency] -> [Match your voice better]

## Specific Line Edits

Original:
> [Exact quote from draft]

Suggested:
> [Improved version]

Why: [Explanation]
```

### 6. Citation Formats

The skill handles references in your preferred style:

**Inline**: `Studies show 40% productivity improvement (McKinsey, 2024).`

**Numbered**: `Studies show 40% improvement [1].`

**Footnote**: `Studies show 40% improvement^1`

### 7. Final Review and Polish

A comprehensive assessment covering:

```markdown
# Full Draft Review

## Overall Assessment
**Strengths**: [Major strength 1, 2, 3]
**Impact**: [Overall effectiveness assessment]

## Structure & Flow
## Content Quality
## Technical Quality
## Readability

## Pre-Publish Checklist
- [ ] All claims sourced
- [ ] Citations formatted
- [ ] Examples clear
- [ ] Transitions smooth
- [ ] Call to action present
- [ ] Proofread for typos
```

## Writing Workflows by Content Type

### Blog Post
1. Outline together
2. Research key points
3. Write introduction, get feedback
4. Write body sections, feedback each
5. Write conclusion, final review
6. Polish and edit

### Newsletter
1. Discuss hook ideas
2. Quick outline (shorter format)
3. Draft in one session
4. Review for clarity and links
5. Quick polish

### Technical Tutorial
1. Outline steps
2. Write code examples
3. Add explanations
4. Test instructions
5. Add troubleshooting section
6. Final review for accuracy

### Thought Leadership
1. Brainstorm unique angle
2. Research existing perspectives
3. Develop your thesis
4. Write with strong point of view
5. Add supporting evidence
6. Craft compelling conclusion

## Voice Preservation

Key principles for maintaining your authentic voice:

- **Learn your style** -- Reads existing writing samples
- **Suggest, don't replace** -- Offers options, not directives
- **Match tone** -- Formal, casual, technical, or friendly
- **Respect choices** -- If you prefer your version, supports it
- **Enhance, don't override** -- Makes your writing better, not different

Periodic check-ins:
- "Does this sound like you?"
- "Is this the right tone?"
- "Should I be more/less formal/casual/technical?"

## Pro Tips

1. **Work in VS Code** -- Better than web Claude for long-form writing
2. **One section at a time** -- Get feedback incrementally
3. **Save research separately** -- Keep a research.md file
4. **Version your drafts** -- article-v1.md, article-v2.md, etc.
5. **Read aloud** -- Use feedback to identify clunky sentences
6. **Set deadlines** -- "I want to finish the draft today"
7. **Take breaks** -- Write, get feedback, pause, revise

## Best Practices

### For Research
- Verify sources before citing
- Use recent data when possible
- Balance different perspectives
- Link to original sources

### For Feedback
- Be specific about what you want: "Is this too technical?"
- Share your concerns: "I'm worried this section drags"
- Ask questions: "Does this flow logically?"
- Request alternatives: "What's another way to explain this?"

### For Voice
- Share examples of your writing
- Specify tone preferences
- Point out good matches: "That sounds like me!"
- Flag mismatches: "Too formal for my style"

> Source: [PleasePrompto/notebooklm-skill](https://github.com/PleasePrompto/notebooklm-skill) | Category: Utilities

---
name: notebooklm
description: Query Google NotebookLM notebooks from Claude Code for source-grounded, citation-backed answers. Browser automation with persistent auth. Use when you need document-grounded research with reduced hallucinations.
---

# NotebookLM Research Assistant

## Overview

Query your Google NotebookLM notebooks directly from Claude Code. Get source-grounded, citation-backed answers from Gemini based on your uploaded documents. Each question opens a fresh browser session, drastically reducing hallucinations through document-only responses.

## When to Use

- Need document-grounded answers (reducing AI hallucination)
- Have reference materials uploaded to NotebookLM
- Want citation-backed responses (each answer references source paragraphs)
- User mentions NotebookLM or shares a NotebookLM URL

## Workflow

1. **Check auth** — `python scripts/run.py auth_manager.py status`
2. **Authenticate** — `python scripts/run.py auth_manager.py setup` (browser visible, manual Google login)
3. **Manage notebooks** — Add, list, search, activate notebooks
4. **Ask questions** — `python scripts/run.py ask_question.py --question "..."`
5. **Follow-up loop** — Analyze completeness, ask follow-ups if gaps exist
6. **Synthesize** — Combine all answers before responding to user

## Core Commands

### Authentication
```bash
python scripts/run.py auth_manager.py setup    # First-time setup (browser visible)
python scripts/run.py auth_manager.py status   # Check status
python scripts/run.py auth_manager.py reauth   # Re-authenticate
```

### Notebook Management
```bash
python scripts/run.py notebook_manager.py list
python scripts/run.py notebook_manager.py add --url URL --name "Name" --description "Description" --topics "topic1,topic2"
python scripts/run.py notebook_manager.py search --query "keyword"
python scripts/run.py notebook_manager.py activate --id ID
```

### Asking Questions
```bash
python scripts/run.py ask_question.py --question "Your question"
python scripts/run.py ask_question.py --question "..." --notebook-id ID
python scripts/run.py ask_question.py --question "..." --show-browser
```

## Smart Add (When User Doesn't Provide Details)

```bash
# Step 1: Query notebook to discover content
python scripts/run.py ask_question.py --question "What is the content of this notebook?" --notebook-url "[URL]"

# Step 2: Add with discovered metadata
python scripts/run.py notebook_manager.py add --url "[URL]" --name "Discovered Name" --description "Discovered Description" --topics "discovered,topics"
```

## Follow-Up Mechanism

After every NotebookLM answer:
1. **STOP** — Don't immediately respond to user
2. **ANALYZE** — Compare answer to user's original request
3. **IDENTIFY GAPS** — More information needed?
4. **ASK FOLLOW-UP** — If gaps exist, query again with context
5. **SYNTHESIZE** — Combine all answers before final response

## Limitations

| Limitation | Detail |
|-----------|--------|
| No session persistence | Each question = new browser session |
| Rate limits | ~50 queries/day on free Google accounts |
| Manual upload | User must add documents to NotebookLM |
| Browser overhead | Few seconds startup per question |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| ModuleNotFoundError | Must use `run.py` wrapper |
| Auth fails | Browser must be visible: `--show-browser` |
| Rate limited | Wait or switch Google account |
| Browser crashes | `python scripts/run.py cleanup_manager.py --preserve-library` |

## Key Rules

- **Always use run.py** — Manages virtualenv and dependencies automatically
- **Check auth first** — Before any operation
- **Never guess notebook descriptions** — Use Smart Add to discover content
- **Follow up aggressively** — First answer is rarely complete

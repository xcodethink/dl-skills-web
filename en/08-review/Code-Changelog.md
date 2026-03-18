> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: E-Code-Quality

---
name: code-changelog
description: Log all AI-generated code changes to a reviews folder with a browser-based HTML viewer
---

# Code Changelog and HTML Viewer

## Overview

Record every AI-generated code change into a `reviews/` folder and view them in real time through a simple HTML viewer in the browser. Each modification generates a Markdown document, and a Python HTTP server provides instant access. No installation required beyond Python.

## Core Features

- **Auto-generated docs**: Every modification creates an MD file in the reviews folder
- **Simple HTML viewer**: Runs with just Python -- no other dependencies
- **Auto-updated index.html**: File list refreshes when new documents are added
- **Live server**: Instant viewing at http://localhost:4000
- **Dark mode UI**: GitHub-style polished documentation site
- **Navigation**: Auto-generated file list for easy browsing
- **Markdown rendering**: Code highlighting and diff display
- **Latest first**: Most recent document displayed by default

## Quick Start

### 1. Initial Setup (first time only)

```bash
# No installation needed! Just requires Python
python3 create_changelog.py
```

### 2. During Development

```python
from code_changelog_tracker import CodeChangeLogger

# Create logger
logger = CodeChangeLogger("Project Name", user_request="Requirement description")

# Log changes
logger.log_file_creation("main.py", "code content", "reason")
logger.save_and_build()  # Save!
```

### 3. Start the Documentation Server

```bash
# Start Python server in the reviews folder
cd reviews
python3 -m http.server 4000

# View in browser: http://localhost:4000
```

**Or run in background:**
```bash
cd reviews && python3 -m http.server 4000 &
```

## Project Structure

```
your-project/
├── reviews/                    # Documentation root
│   ├── index.html             # HTML viewer (auto-generated)
│   ├── README.md              # Home page
│   ├── SUMMARY.md             # Navigation (auto-generated)
│   │
│   ├── 20251020_140000.md    # Change record 1
│   ├── 20251020_140530.md    # Change record 2
│   ├── 20251020_141200.md    # Change record 3
│   └── ...
│
├── code_changelog_tracker.py  # Logger script
└── create_changelog.py         # Changelog script
```

## Usage Scenarios

### Scenario 1: Document While Developing

```python
logger = CodeChangeLogger("Login Feature")

# First task
logger.log_file_creation("auth.py", "def login(): pass", "Login function")
logger.save_and_build()
# -> Generates reviews/20251020_140000.md
# -> Auto-updates index.html (adds to file list)
# -> Default page changes to latest

# Second task
logger.log_file_modification("auth.py", "old code", "new code", "Add encryption")
logger.save_and_build()
# -> Generates reviews/20251020_140530.md
# -> Auto-updates index.html

# Third task
logger.log_file_creation("test_auth.py", "test code", "Tests")
logger.save_and_build()
# -> Generates reviews/20251020_141200.md

# Visit http://localhost:4000 in browser
# -> Automatically shows the latest document!
# -> Left sidebar navigates to previous versions
```

### Scenario 2: Background Server

```bash
# Terminal 1: Start documentation server (keep running)
cd reviews && python3 -m http.server 4000

# Terminal 2: Development work
python3 your_dev_script.py  # Calls logger.save_and_build()

# Refresh browser to see latest docs!
```

### Scenario 3: Team Sharing

```bash
# Share the reviews folder with team members
# Deploy to GitHub Pages, Netlify, etc.
# Or host on an internal web server
```

## Implementation

### code_changelog_tracker.py (Main Logger)

Key methods:

| Method | Purpose |
|--------|---------|
| `log_file_creation()` | Record file creation |
| `log_file_modification()` | Record file modification |
| `log_file_deletion()` | Record file deletion |
| `update_index_html()` | Auto-update index.html file list |
| `save_and_build()` | Save + update SUMMARY + update index.html |

### reviews/index.html (HTML Viewer)

**Auto-generated and auto-updated!** Refreshes to the latest file list on every `save_and_build()` call.

Features:
- Markdown auto-rendering (marked.js)
- Dark mode UI (GitHub style)
- File list navigation (auto-updated)
- Code highlighting
- Latest document shown by default
- Active link highlighting

## Step-by-Step Guide

### Step 1: Log Changes

```python
from code_changelog_tracker import CodeChangeLogger

logger = CodeChangeLogger(
    "Daily Signal App - Registration",
    user_request="Implement email/password registration"
)

# Log file creation
logger.log_file_creation(
    "lib/screens/signup_screen.dart",
    "SignUpScreen code...",
    "Implement registration screen"
)

# Log file modification
logger.log_file_modification(
    "lib/providers/auth_provider.dart",
    "old code",
    "new code",
    "Add signUp method"
)

# Save
logger.save_and_build()
```

### Step 2: Start Server

```bash
cd reviews
python3 -m http.server 4000
```

### Step 3: View in Browser

```
http://localhost:4000
```

## HTML Viewer Features

### Dark Mode UI
- GitHub-style Markdown rendering
- Code block highlighting
- Responsive layout

### Navigation
- Left sidebar with auto-generated file list
- Sorted by date/time
- Click to navigate

### Markdown Rendering
- Headings, lists, code blocks
- Diff display
- Emoji support

## Command Reference

| Action | Command |
|--------|---------|
| Start server | `cd reviews && python3 -m http.server 4000` |
| Change port | `python3 -m http.server 3000` or `8080` |
| Run in background | `cd reviews && python3 -m http.server 4000 &` |
| Stop (foreground) | `Ctrl+C` |
| Stop (background) | `lsof -ti:4000 \| xargs kill -9` |

## Deployment Options

| Platform | Method |
|----------|--------|
| **GitHub Pages** | `git subtree push --prefix reviews origin gh-pages` |
| **Netlify** | Publish directory: `reviews` (no build command) |
| **Vercel** | `vercel reviews` |

## Best Practices

1. **Keep the server running** during development
2. **Log in small units**: Document each task as a small, focused record
3. **Clear titles**: Write descriptive project names
4. **Back up regularly**: Manage the reviews folder with Git
5. **Bookmark**: Add http://localhost:4000 as a browser bookmark

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Port in use | `python3 -m http.server 4001` or `lsof -ti:4000 \| xargs kill -9` |
| Files not showing | Verify `reviews/index.html` exists; call `logger.save_and_build()` to regenerate |
| Markdown not rendering | Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R), restart server, re-run `save_and_build()` |

**Important**: After calling `logger.save_and_build()`, index.html updates automatically:
- New Markdown files refresh the file list
- Latest file becomes the default page
- Just refresh the browser to see the latest docs

## Comparison: HonKit vs Simple HTML

| Feature | HonKit | Simple HTML |
|---------|--------|-------------|
| Installation | Requires npm, Node.js | Python only |
| Build time | 5-10 seconds | Instant |
| Dependencies | Many | None |
| Customization | High | Medium |
| Search | Built-in | Browser search |
| Deployment | _book folder | reviews folder |

## Advantages

- **Zero installation**: No Node.js, npm, or HonKit required -- Python only
- **Fast startup**: Server starts in under 1 second
- **Simple deployment**: Just deploy the reviews folder as a static site
- **Auto-updating**: `save_and_build()` refreshes index.html automatically

## License

MIT License

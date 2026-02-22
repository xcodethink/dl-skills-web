> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Docs & Productivity

---
name: file-organizer
description: Intelligently organizes files and folders by understanding context, finding duplicates, suggesting better structures, and automating cleanup tasks.
---

# File Organizer

## Overview

This skill acts as a personal organization assistant, helping you maintain a clean, logical file structure across your computer. It analyzes current directory contents, finds duplicates, proposes logical folder structures based on file types and context, and automates the cleanup -- all with your approval before making changes.

## When to Use

- Your Downloads folder is a chaotic mess
- You cannot find files because they are scattered everywhere
- You have duplicate files taking up space
- Your folder structure no longer makes sense
- You want to establish better organization habits
- You are starting a new project and need a good structure
- You are cleaning up before archiving old projects

## What It Does

1. **Analyzes Current Structure** -- Reviews folders and files to understand what you have
2. **Finds Duplicates** -- Identifies duplicate files across your system
3. **Suggests Organization** -- Proposes logical folder structures based on content
4. **Automates Cleanup** -- Moves, renames, and organizes files with your approval
5. **Maintains Context** -- Makes smart decisions based on file types, dates, and content
6. **Reduces Clutter** -- Identifies old files you probably don't need anymore

## How to Use

Navigate to your home directory, then ask:

```
Help me organize my Downloads folder
```

```
Find duplicate files in my Documents folder
```

```
Review my project directories and suggest improvements
```

```
Clean up old files I haven't touched in 6+ months
```

```
Create a better folder structure for my [work/projects/photos/etc]
```

## How It Works

### 1. Understand the Scope

Clarifying questions asked:
- Which directory needs organization?
- What is the main problem? (Can't find things, duplicates, no structure?)
- Any files or folders to avoid?
- How aggressively to organize? (Conservative vs. comprehensive)

### 2. Analyze Current State

```bash
# Overview of current structure
ls -la [target_directory]

# Identify largest files
du -sh [target_directory]/* | sort -rh | head -20

# Count file types
find [target_directory] -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn
```

### 3. Identify Organization Patterns

**By Type**:
- Documents (PDFs, DOCX, TXT)
- Images (JPG, PNG, SVG)
- Videos (MP4, MOV)
- Archives (ZIP, TAR, DMG)
- Code/Projects (directories with code)
- Spreadsheets (XLSX, CSV)
- Presentations (PPTX, KEY)

**By Purpose**: Work vs. Personal, Active vs. Archive, Project-specific, Reference materials

**By Date**: Current year/month, Previous years, Very old (archive candidates)

### 4. Find Duplicates

```bash
# Find exact duplicates by hash
find [directory] -type f -exec md5 {} \; | sort | uniq -d

# Find files with same name
find [directory] -type f -printf '%f\n' | sort | uniq -d
```

For each set of duplicates:
- Show all file paths
- Display sizes and modification dates
- Recommend which to keep (usually newest or best-named)
- Always ask for confirmation before deleting

### 5. Propose Organization Plan

```markdown
# Organization Plan for [Directory]

## Current State
- X files across Y folders
- [Size] total
- File types: [breakdown]
- Issues: [list problems]

## Proposed Structure

[Directory]/
├── Work/
│   ├── Projects/
│   ├── Documents/
│   └── Archive/
├── Personal/
│   ├── Photos/
│   ├── Documents/
│   └── Media/
└── Downloads/
    ├── To-Sort/
    └── Archive/

## Changes
1. **Create new folders**: [list]
2. **Move files**: X PDFs -> Work/Documents/, Y images -> Personal/Photos/
3. **Rename files**: [any renaming patterns]
4. **Delete**: [duplicates or trash files]

## Files Needing Your Decision
- [List any files needing manual review]

Ready to proceed? (yes/no/modify)
```

### 6. Execute Organization

After approval:
```bash
mkdir -p "path/to/new/folders"
mv "old/path/file.pdf" "new/path/file.pdf"
```

**Rules**:
- Always confirm before deleting anything
- Log all moves for potential undo
- Preserve original modification dates
- Handle filename conflicts gracefully
- Stop and ask if encountering unexpected situations

### 7. Completion Summary

```markdown
# Organization Complete

## What Changed
- Created [X] new folders
- Organized [Y] files
- Freed [Z] GB by removing duplicates
- Archived [W] old files

## Maintenance Tips
1. **Weekly**: Sort new downloads
2. **Monthly**: Review and archive completed projects
3. **Quarterly**: Check for new duplicates
4. **Yearly**: Archive old files
```

## Examples

### Downloads Cleanup
500 files analyzed, patterns identified (work docs, personal photos, installers, random PDFs), proposed structure with 5 organized folders, moved files intelligently based on content and names.

### Duplicate Removal
```markdown
# Found 23 Sets of Duplicates (156 MB total)

## Duplicate Set 1: "proposal.pdf"
- /Documents/proposal.pdf (2.3 MB, modified: 2024-03-15)
- /Documents/old/proposal.pdf (2.3 MB, modified: 2024-03-15)
- /Desktop/proposal.pdf (2.3 MB, modified: 2024-03-10)

Recommendation: Keep /Documents/proposal.pdf (most recent in correct location)
```

### Project Restructuring
```
Projects/
├── Active/
│   ├── client-work/
│   ├── side-projects/
│   └── learning/
├── Archive/
│   ├── 2022/
│   ├── 2023/
│   └── 2024/
└── Templates/
```

### Photo Organization by Date
```
Photos/
├── 2023/
│   ├── 01-January/
│   ├── 02-February/
│   └── ...
├── 2024/
│   ├── 01-January/
│   └── ...
└── Unsorted/
```

## Best Practices

### Folder Naming
- Use clear, descriptive names
- Avoid spaces (use hyphens or underscores)
- Be specific: "client-proposals" not "docs"
- Use prefixes for ordering: "01-current", "02-archive"

### File Naming
- Include dates: "2024-10-17-meeting-notes.md"
- Be descriptive: "q3-financial-report.xlsx"
- Avoid version numbers in names (use version control instead)
- Remove download artifacts: "document-final-v2 (1).pdf" becomes "document.pdf"

### When to Archive
- Projects not touched in 6+ months
- Completed work that might be referenced later
- Old versions after migration to new systems
- Files you are hesitant to delete (archive first)

## Pro Tips

1. **Start Small** -- Begin with one messy folder to build trust
2. **Regular Maintenance** -- Run weekly cleanup on Downloads
3. **Consistent Naming** -- Use "YYYY-MM-DD - Description" format for important files
4. **Archive Aggressively** -- Move old projects to Archive instead of deleting
5. **Keep Active Separate** -- Maintain clear boundaries between active and archived work

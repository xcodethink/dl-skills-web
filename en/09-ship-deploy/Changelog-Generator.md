> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Development Tools

---
name: changelog-generator
description: Triggers when creating user-facing changelogs or release notes from git commit history -- analyzes commits, categorizes changes, and transforms technical messages into customer-friendly entries.
---

# Changelog Generator

## Overview

This skill transforms technical git commits into polished, user-friendly changelogs. It scans commit history for a given period or version range, categorizes changes into logical groups, filters out internal noise, and produces professionally formatted release notes that customers and users can understand.

## When to Use

- Preparing release notes for a new version
- Creating weekly or monthly product update summaries
- Writing changelog entries for app store submissions
- Generating update notifications or email digests
- Maintaining a public changelog or product updates page

## What It Does

1. **Scans Git History** -- Analyzes commits from a specific time period or between version tags
2. **Categorizes Changes** -- Groups into features, improvements, bug fixes, breaking changes, security
3. **Translates to User Language** -- Converts developer commit messages into customer-friendly descriptions
4. **Formats Professionally** -- Produces clean, structured changelog entries
5. **Filters Noise** -- Excludes internal commits (refactoring, test changes, CI tweaks)

## How to Use

### Basic Usage

From the project repository:

```
Create a changelog from commits since last release
```

```
Generate changelog for all commits from the past week
```

```
Create release notes for version 2.5.0
```

### With a Specific Date Range

```
Create a changelog for all commits between March 1 and March 15
```

### With Custom Style Guidelines

```
Create a changelog for commits since v2.4.0, using my changelog
guidelines from CHANGELOG_STYLE.md
```

## Example Output

```markdown
# Updates -- Week of March 10, 2024

## New Features

- **Team Workspaces**: Create separate workspaces for different
  projects. Invite team members and keep everything organized.

- **Keyboard Shortcuts**: Press ? to see all available shortcuts.
  Navigate faster without touching your mouse.

## Improvements

- **Faster Sync**: Files now sync 2x faster across devices
- **Better Search**: Search now includes file contents, not just titles

## Fixes

- Fixed issue where large images would not upload
- Resolved timezone confusion in scheduled posts
- Corrected notification badge count
```

## Tips

- Run from the git repository root
- Specify date ranges for focused changelogs
- Use a `CHANGELOG_STYLE.md` file for consistent formatting across releases
- Review and adjust the generated changelog before publishing
- Save output directly to `CHANGELOG.md`

## Related Use Cases

- Creating GitHub release notes
- Writing app store update descriptions
- Generating email updates for users
- Creating social media announcement posts

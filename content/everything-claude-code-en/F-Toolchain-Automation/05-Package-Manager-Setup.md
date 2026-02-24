> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Package Manager Setup

## Overview

Configure your preferred Node.js package manager (npm/pnpm/yarn/bun) with multi-level detection priority and flexible configuration options.

## Usage

```bash
node scripts/setup-package-manager.js --detect   # Detect current
node scripts/setup-package-manager.js --global pnpm  # Set global
node scripts/setup-package-manager.js --project bun   # Set project
node scripts/setup-package-manager.js --list      # List available
```

## Detection Priority

1. **Environment variable**: `CLAUDE_PACKAGE_MANAGER`
2. **Project config**: `.claude/package-manager.json`
3. **package.json**: `packageManager` field
4. **Lock file**: package-lock.json, yarn.lock, pnpm-lock.yaml, or bun.lockb
5. **Global config**: `~/.claude/package-manager.json`
6. **Fallback**: First available (pnpm > bun > yarn > npm)

## Configuration

### Global (`~/.claude/package-manager.json`)
```json
{ "packageManager": "pnpm" }
```

### Project (`.claude/package-manager.json`)
```json
{ "packageManager": "bun" }
```

### package.json
```json
{ "packageManager": "pnpm@8.6.0" }
```

### Environment Variable (overrides all)
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

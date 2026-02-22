> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: G-Tools-and-Productivity

---
name: repomix
description: Package entire code repositories into single AI-friendly files for LLM analysis, code review, security audits, and documentation generation
---

# Repomix

## Overview

Repomix packages entire code repositories into a single AI-friendly file. Ideal for feeding codebases to LLMs like Claude, ChatGPT, and Gemini for analysis, code review, security audits, and documentation generation.

## When to Use

- Packaging codebases for AI analysis
- Creating repository snapshots for LLM context
- Analyzing third-party libraries
- Preparing security audits
- Generating documentation context
- Investigating bugs across large codebases
- Creating AI-friendly code representations

## Quick Start

### Check Installation
```bash
repomix --version
```

### Install
```bash
# npm
npm install -g repomix

# Homebrew (macOS/Linux)
brew install repomix
```

### Basic Usage
```bash
# Package current directory (generates repomix-output.xml)
repomix

# Specify output format
repomix --style markdown
repomix --style json

# Package remote repository
npx repomix --remote owner/repo

# Custom output with filters
repomix --include "src/**/*.ts" --remove-comments -o output.md
```

## Core Capabilities

### Repository Packaging
- AI-optimized format with clear delimiters
- Multiple output formats: XML, Markdown, JSON, plain text
- Git-aware processing (respects .gitignore)
- Token counting for LLM context management
- Security checks for sensitive information

### Remote Repository Support
Process remote repositories without cloning:
```bash
# Shorthand
npx repomix --remote yamadashy/repomix

# Full URL
npx repomix --remote https://github.com/owner/repo

# Specific commit
npx repomix --remote https://github.com/owner/repo/commit/hash
```

### Comment Removal
Strip comments from supported languages (HTML, CSS, JavaScript, TypeScript, Vue, Svelte, Python, PHP, Ruby, C, C#, Java, Go, Rust, Swift, Kotlin, Dart, Shell, YAML):
```bash
repomix --remove-comments
```

## Common Use Cases

### Code Review Preparation
```bash
# Package feature branch for AI review
repomix --include "src/**/*.ts" --remove-comments -o review.md --style markdown
```

### Security Audit
```bash
# Package third-party library
npx repomix --remote vendor/library --style xml -o audit.xml
```

### Documentation Generation
```bash
# Package docs and code
repomix --include "src/**,docs/**,*.md" --style markdown -o context.md
```

### Bug Investigation
```bash
# Package specific modules
repomix --include "src/auth/**,src/api/**" -o debug-context.xml
```

### Implementation Planning
```bash
# Full codebase context
repomix --remove-comments --copy
```

## CLI Reference

### File Selection
```bash
# Include specific patterns
repomix --include "src/**/*.ts,*.md"

# Additional ignore patterns
repomix -i "tests/**,*.test.js"

# Disable .gitignore rules
repomix --no-gitignore
```

### Output Options
```bash
# Output format
repomix --style markdown  # Or xml, json, plain

# Output file path
repomix -o output.md

# Remove comments
repomix --remove-comments

# Copy to clipboard
repomix --copy
```

### Configuration
```bash
# Use custom config file
repomix -c custom-config.json

# Initialize new config
repomix --init  # Creates repomix.config.json
```

## Token Management

Repomix automatically calculates token counts for individual files, the entire repository, and each output format.

Typical LLM context limits:
- Claude Sonnet 4.5: ~200K tokens
- GPT-4: ~128K tokens
- GPT-3.5: ~16K tokens

## Security Considerations

Repomix uses Secretlint to detect sensitive data (API keys, passwords, credentials, private keys, AWS keys).

Best practices:
1. Always review output before sharing
2. Use `.repomixignore` for sensitive files
3. Enable security checks for unknown codebases
4. Avoid packaging `.env` files
5. Check for hardcoded credentials

To disable security checks:
```bash
repomix --no-security-check
```

## Implementation Workflow

When a user requests repository packaging:

1. **Assess requirements**
   - Identify target repository (local/remote)
   - Determine required output format
   - Check for sensitive data concerns

2. **Configure filters**
   - Set include patterns to match relevant files
   - Add ignore patterns to exclude unnecessary files
   - Enable/disable comment removal

3. **Execute packaging**
   - Run repomix with appropriate options
   - Monitor token count
   - Verify security checks

4. **Validate output**
   - Review generated file
   - Confirm no sensitive data included
   - Check token limits for target LLM

5. **Deliver context**
   - Provide packaged file to user
   - Include token count summary
   - Note any warnings or issues

## Reference Documentation

For detailed information, see:
- [Configuration Reference](./references/configuration.md) - Config files, include/exclude patterns, output formats, advanced options
- [Usage Patterns](./references/usage-patterns.md) - AI analysis workflows, security audit preparation, documentation generation, library evaluation

## Additional Resources

- GitHub: https://github.com/yamadashy/repomix
- Documentation: https://repomix.com/guide/
- MCP Server: Available for AI assistant integration

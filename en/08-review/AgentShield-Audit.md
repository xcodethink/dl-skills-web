# AgentShield Configuration Audit

> **Source**: [affaan-m/everything-claude-code](https://github.com/AffaanM/everything-claude-code)
> **Original file**: skills/security-scan/SKILL.md
> **Category**: E-Security

---

## Overview

Scan your Claude Code configuration (`.claude/` directory) for security vulnerabilities, misconfigurations, and injection risks using [AgentShield](https://github.com/affaan-m/agentshield). Covers CLAUDE.md, settings.json, MCP servers, hooks, and agent definitions.

---

## When to Activate

- Setting up a new Claude Code project
- After modifying `.claude/settings.json`, `CLAUDE.md`, or MCP configs
- Before committing configuration changes
- Onboarding to a repository with existing Claude Code configs
- Periodic security hygiene checks

---

## What It Scans

| File | Checks |
|------|--------|
| `CLAUDE.md` | Hardcoded secrets, auto-run instructions, prompt injection patterns |
| `settings.json` | Overly permissive allow lists, missing deny lists, dangerous bypass flags |
| `mcp.json` | Risky MCP servers, hardcoded env secrets, npx supply chain risks |
| `hooks/` | Command injection via interpolation, data exfiltration, silent error suppression |
| `agents/*.md` | Unrestricted tool access, prompt injection surface, missing model specs |

---

## Usage

### Basic Scan

```bash
npx ecc-agentshield scan                          # Scan current project
npx ecc-agentshield scan --path /path/to/.claude   # Scan specific path
npx ecc-agentshield scan --min-severity medium     # Filter by severity
```

### Output Formats

```bash
npx ecc-agentshield scan                           # Terminal (colored report with grade)
npx ecc-agentshield scan --format json             # JSON (CI/CD integration)
npx ecc-agentshield scan --format markdown         # Markdown (documentation)
npx ecc-agentshield scan --format html > report.html  # HTML (dark-theme report)
```

### Auto-Fix

```bash
npx ecc-agentshield scan --fix
```

Applies safe fixes only:
- Replaces hardcoded secrets with env variable references
- Tightens wildcard permissions to scoped alternatives
- Never modifies manual-only suggestions

### Deep Analysis (Opus 4.6 Three-Agent Pipeline)

```bash
export ANTHROPIC_API_KEY=your-key
npx ecc-agentshield scan --opus --stream
```

Runs three adversarial agents:
1. **Attacker (Red Team)** — Finds attack vectors
2. **Defender (Blue Team)** — Recommends hardening
3. **Auditor (Final Verdict)** — Synthesizes both perspectives

### Initialize Secure Config

```bash
npx ecc-agentshield init
```

Scaffolds `settings.json` (scoped permissions + deny list), `CLAUDE.md` (security best practices), and `mcp.json` placeholder.

### GitHub Action

```yaml
- uses: affaan-m/agentshield@v1
  with:
    path: '.'
    min-severity: 'medium'
    fail-on-findings: true
```

---

## Severity Grades

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 90-100 | Secure configuration |
| B | 75-89 | Minor issues |
| C | 60-74 | Needs attention |
| D | 40-59 | Significant risks |
| F | 0-39 | Critical vulnerabilities |

---

## Interpreting Results

**Critical (fix immediately):**
- Hardcoded API keys/tokens in config files
- `Bash(*)` in allow list (unrestricted shell)
- Command injection in hooks via `${file}` interpolation
- Shell-running MCP servers

**High (fix before production):**
- Auto-run instructions in CLAUDE.md (prompt injection vector)
- Missing deny lists in permissions
- Agents with unnecessary Bash access

**Medium (recommended):**
- Silent error suppression in hooks (`2>/dev/null`, `|| true`)
- Missing PreToolUse security hooks
- `npx -y` auto-install in MCP configs

**Info (awareness):**
- Missing MCP server descriptions
- Prohibitive instructions correctly flagged as good practice

---

## Links

- **GitHub**: [github.com/affaan-m/agentshield](https://github.com/affaan-m/agentshield)
- **npm**: [npmjs.com/package/ecc-agentshield](https://www.npmjs.com/package/ecc-agentshield)

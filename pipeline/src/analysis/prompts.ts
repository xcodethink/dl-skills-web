/**
 * AI prompt templates for skill quality analysis — v2 Enhanced.
 *
 * 9-dimension scoring system focused on building a premium skill library.
 * Key principle: quality over token savings. One golden sentence is worth
 * more than an entire mediocre document.
 */

export function buildAnalysisPrompt(
  skillMarkdown: string,
  existingSkillList: string,
  existingFileIndex: string
): string {
  return `You are a senior curator for a premium AI coding skills platform (claudecodeskills.wayjet.io).
Your mission: build the highest-quality, zero-redundancy skill library that maximizes AI output quality, speed, and efficiency when used by Claude Code or Codex.

CRITICAL MINDSET:
- One golden paragraph extracted from a mediocre document is MORE VALUABLE than publishing the whole document.
- Problem-solving skills (troubleshooting, common errors, config recipes) are RARE and HIGH VALUE — most skills focus on creation, few accumulate problems.
- Quality > token savings. A longer, more complete skill that improves AI output is better than a shorter one.
- Think about what makes AI actually produce better code when reading this skill.

## Skill Content to Evaluate
\`\`\`markdown
${skillMarkdown.slice(0, 20000)}
\`\`\`

## Existing Skills in Our Catalog
${existingSkillList}

## Existing File Index (for merge targets)
${existingFileIndex}

## 9-Dimension Evaluation

Score each dimension from 0-10:

### 1. Content Quality (weight 20%)
How well-written, accurate, and professional is this content?
- 0: Poorly written, factual errors, copy-paste junk
- 5: Decent but generic, could be better
- 10: Exceptionally well-crafted, precise language, every sentence adds value

### 2. Problem Solving Specificity (weight 15%)
Does it solve a SPECIFIC, concrete problem that developers actually face?
- 0: Vague philosophy, no concrete problem addressed
- 5: Addresses a general area but lacks specific solutions
- 10: Pinpoints an exact problem (e.g., "how to configure Google OAuth one-shot", "common TypeScript strict mode errors") with step-by-step resolution

### 3. Scene Fitness (weight 10%)
How well does it fit into a specific usage scenario?
- 0: Too broad to be useful in any specific context
- 5: Somewhat applicable but could fit many scenarios
- 10: Laser-focused on a specific workflow moment (e.g., "before first commit", "during code review", "when debugging auth issues")

### 4. AI Readability (weight 15%)
Can Claude Code / Codex actually parse this and produce better output?
- 0: Human-readable essay format, AI would struggle to extract actionable rules
- 5: Some structure but mixed with narrative
- 10: Crystal-clear instruction format with rules, checklists, conditions, examples — AI can directly follow each instruction

### 5. Rigor & Completeness (weight 15%)
Is it thorough enough? Does it cover edge cases, prerequisites, and failure modes?
- 0: Stub or surface-level
- 5: Covers happy path only
- 10: Comprehensive with edge cases, error handling, prerequisites, verification steps, and "what can go wrong" sections. When appropriate, includes detailed sub-rules.

### 6. Problem Accumulation Value (weight 10%)
Does it capture common errors, pitfalls, gotchas, or troubleshooting knowledge?
- 0: Pure creation/setup content, no error knowledge
- 3: Mentions some common issues
- 7: Dedicated troubleshooting section with real-world errors
- 10: Rich collection of "when you see X, do Y" patterns, common mistakes, and hard-won debugging knowledge. This is RARE and EXTREMELY VALUABLE.

### 7. Granularity Match (weight 5%)
Is the content at the right granularity for its topic?
- 0: Wrong level — either too high-level for a specific topic or too detailed for an overview
- 5: Acceptable but could be more focused
- 10: Perfect granularity — overview topics are properly broad, specific topics drill deep

### 8. Integration Fit (weight 5%)
Should this be a standalone file, or should parts be merged into existing files?
- Score indicates standalone fitness:
  - 0-3: This should NOT be standalone — extract the valuable parts and merge into existing files
  - 4-6: Could go either way — has standalone value but overlaps with existing content
  - 7-10: Clearly standalone — unique enough topic that deserves its own file

### 9. Optimization Potential (weight 5%)
Could this content improve EXISTING files in our catalog?
- 0: No relevant existing files to improve
- 5: Some existing files could benefit from parts of this
- 10: Contains critical improvements for multiple existing files (e.g., missing edge cases, better examples, troubleshooting additions)

## Platform Compatibility Assessment

Evaluate which AI coding platforms this skill is best suited for:

**Claude Code** characteristics:
- File-based skill system (~/.claude/skills/)
- CLAUDE.md project instructions
- Terminal-based, agentic workflow
- Strong at multi-file operations, git, testing
- Extended thinking for complex reasoning

**Codex (OpenAI)** characteristics:
- codex.md / AGENTS.md instruction files
- Sandbox-based, isolated execution
- Good at focused code generation tasks
- Different tool calling patterns
- More structured output preferences

**Cursor** characteristics:
- .cursorrules file
- IDE-integrated, inline suggestions
- Good at code completion and refactoring
- Context from open files

## Required Output

Return ONLY valid JSON, no markdown wrapping:
{
  "scores": {
    "content_quality": { "score": N, "rationale": "..." },
    "problem_solving": { "score": N, "rationale": "..." },
    "scene_fitness": { "score": N, "rationale": "..." },
    "ai_readability": { "score": N, "rationale": "..." },
    "rigor": { "score": N, "rationale": "..." },
    "problem_accumulation": { "score": N, "rationale": "..." },
    "granularity": { "score": N, "rationale": "..." },
    "integration_fit": { "score": N, "rationale": "..." },
    "optimization_potential": { "score": N, "rationale": "..." }
  },
  "weighted_total": N,

  "platform_compatibility": {
    "claude_code": { "score": 0-10, "rationale": "..." },
    "codex": { "score": 0-10, "rationale": "..." },
    "cursor": { "score": 0-10, "rationale": "..." }
  },
  "compatible_with": ["claude-code", "codex", "cursor"],

  "fragment_action": "standalone | merge_into | split_merge | optimize_existing",
  "merge_targets": [
    {
      "target_file": "path/to/existing/file.md or null",
      "extract_content": "The specific paragraph/section to extract and merge (verbatim quote from source)",
      "merge_reason": "Why this fragment improves the target file"
    }
  ],
  "optimization_suggestions": [
    {
      "target_file": "path/to/existing/file.md",
      "suggestion": "What should be improved and how",
      "priority": "high | medium | low"
    }
  ],

  "suggested_category": "think-plan|scaffold|design|frontend|backend|test|debug|review|ship|ai-engineering|data-viz|content|documents|utilities|meta",
  "suggested_tags": ["tag1", "tag2", "tag3"],
  "suggested_type": "discipline|tool|process|reference|troubleshooting",
  "suggested_difficulty": "starter|intermediate|advanced",
  "duplicate_of": "name of existing skill if duplicate, or null",
  "summary_en": "Professional one-line English description (under 80 chars)",
  "summary_cn": "专业的中文一句话描述（80字以内）",
  "recommendation": "ACCEPT|REVIEW|REJECT|MERGE_FRAGMENT",
  "rejection_reason": "null or specific reason for rejection",

  "golden_extracts": [
    "Verbatim quote of the most valuable sentence/paragraph in this document (even if the whole doc is rejected, these might be worth saving)"
  ]
}`;
}

export function buildExistingSkillList(
  skills: Array<{ name: string; category: string; highlight: string }>
): string {
  if (skills.length === 0) return '(Empty catalog — first skills being added)';

  return skills
    .map(s => `- [${s.category}] ${s.name}: ${s.highlight}`)
    .join('\n');
}

export function buildExistingFileIndex(
  files: Array<{ path: string; title: string; category: string }>
): string {
  if (files.length === 0) return '(No existing files)';

  return files
    .map(f => `- ${f.path} [${f.category}]: ${f.title}`)
    .join('\n');
}

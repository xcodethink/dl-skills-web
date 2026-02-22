/**
 * AI prompt templates for skill quality analysis.
 */

export function buildAnalysisPrompt(skillMarkdown: string, existingSkillList: string): string {
  return `You are a senior quality evaluator for an AI coding skills curation platform.
Your job is to assess whether a skill document is worth including in a professional, curated library of Claude Code skills.

## Skill Content to Evaluate
\`\`\`markdown
${skillMarkdown.slice(0, 15000)}
\`\`\`

## Existing Skills in Our Catalog (for uniqueness comparison)
${existingSkillList}

## Evaluation Dimensions

Score each dimension from 0-10:

1. **Relevance** (weight 30%): Is this genuinely an AI agent skill for Claude Code / Cursor / Codex?
   - 0: Generic document, not a skill at all
   - 5: Somewhat related to AI coding but vague
   - 10: Clearly structured as an agent skill with name/description, specific instructions for AI behavior

2. **Structure** (weight 25%): Does it have clear, well-organized instructions?
   - Look for: sections, iron laws/rules, checklists, step-by-step processes, verification gates
   - 0: Wall of unstructured text
   - 10: Professional skill with clear sections, rules, examples, and verification

3. **Actionability** (weight 20%): Can a user paste this directly into ~/.claude/skills/ and use it?
   - 0: Theoretical discussion, not actionable
   - 5: Contains some useful instructions but needs significant editing
   - 10: Ready to use immediately, with specific behavioral instructions for the AI

4. **Uniqueness** (weight 15%): How different is this from existing skills in our catalog?
   - 0: Near-identical duplicate of an existing skill
   - 5: Covers similar ground but with meaningful differences
   - 10: Completely new domain or approach not covered by any existing skill

5. **Completeness** (weight 10%): Is the content thorough enough?
   - 0: Stub or placeholder (under 50 lines)
   - 5: Covers basics but lacks depth or examples
   - 10: Comprehensive with examples, edge cases, and practical guidance (200+ lines)

## Required Output

Return ONLY valid JSON, no markdown wrapping:
{
  "scores": {
    "relevance": { "score": N, "rationale": "One sentence explanation" },
    "structure": { "score": N, "rationale": "One sentence explanation" },
    "actionability": { "score": N, "rationale": "One sentence explanation" },
    "uniqueness": { "score": N, "rationale": "One sentence explanation" },
    "completeness": { "score": N, "rationale": "One sentence explanation" }
  },
  "weighted_total": N,
  "suggested_category": "think-plan|scaffold|design|frontend|backend|test|debug|review|ship|ai-engineering|data-viz|content|documents|utilities|meta",
  "suggested_tags": ["tag1", "tag2", "tag3"],
  "suggested_type": "discipline|tool|process|reference",
  "suggested_difficulty": "starter|intermediate|advanced",
  "duplicate_of": "name of existing skill if duplicate, or null",
  "summary_en": "Professional one-line English description (under 80 chars)",
  "summary_cn": "专业的中文一句话描述（80字以内）",
  "recommendation": "ACCEPT|REVIEW|REJECT",
  "rejection_reason": "null or specific reason for rejection"
}`;
}

export function buildExistingSkillList(skills: Array<{ name: string; category: string; highlight: string }>): string {
  return skills
    .map(s => `- [${s.category}] ${s.name}: ${s.highlight}`)
    .join('\n');
}

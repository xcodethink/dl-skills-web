/**
 * Professional-grade translation prompts.
 *
 * These skills are AI working instructions — translation must be
 * precise, professional, and preserve technical meaning exactly.
 */

export function buildTranslationPrompt(
  markdown: string,
  direction: 'en-to-cn' | 'cn-to-en',
  context: { category: string; type: string; difficulty: string }
): string {
  if (direction === 'en-to-cn') {
    return `You are a senior technical translator specializing in AI engineering and software development documentation.

TASK: Translate this AI coding skill from English to Chinese.

CRITICAL RULES — These are AI working instructions, not casual content. Accuracy is paramount:

1. **Technical accuracy**: Every technical term, code pattern, and behavioral instruction must be translated with ZERO semantic drift.
   - If a sentence says "MUST" in English, use "必须" in Chinese, not "应该" or "建议".
   - If a rule says "NEVER", use "绝对不要" or "严禁", not "避免" or "尽量不要".

2. **Technical terms**: Keep English terms with Chinese annotation.
   - Example: "测试驱动开发（TDD）", "持续集成（CI）", "代码审查（Code Review）"
   - Common AI/dev terms like "Claude Code", "skill", "prompt", "token", "context window" stay in English.

3. **Code blocks**: Translate ONLY comments inside code blocks. All code, variable names, file paths stay in English.
   - \`// Check for edge cases\` → \`// 检查边界条件\`
   - Variable names, function names: NEVER translate.

4. **Structural elements**: Preserve ALL markdown formatting exactly — headings, lists, tables, bold, code blocks, blockquotes.

5. **Iron laws / Rules sections**: These are the most critical parts. Translate with absolute precision. Each rule must carry the same force and specificity as the original.

6. **Add source attribution header**:
   > 来源：[${context.category}] | 类型：${context.type} | 难度：${context.difficulty}

7. **Tone**: Professional technical documentation. Not casual, not overly formal. Match the authority level of the original.

8. **Do NOT**:
   - Add content that doesn't exist in the original
   - Remove any content from the original
   - Soften imperative language
   - Translate code examples, file paths, or CLI commands
   - Use simplified/vague translations for precise technical instructions

CONTENT TO TRANSLATE:
\`\`\`markdown
${markdown.slice(0, 30000)}
\`\`\`

OUTPUT: Return ONLY the translated markdown. No wrapper, no explanation, no markdown code fence around the output.`;
  }

  return `You are a senior technical translator specializing in AI engineering and software development documentation.

TASK: Translate this AI coding skill from Chinese to English.

CRITICAL RULES — These are AI working instructions, not casual content. Accuracy is paramount:

1. **Technical accuracy**: Every technical term, code pattern, and behavioral instruction must be translated with ZERO semantic drift.
   - "必须" → "MUST", not "should" or "consider"
   - "严禁" / "绝对不要" → "NEVER", not "avoid" or "try not to"

2. **Technical terms**: Use standard English technical terminology.
   - "测试驱动开发（TDD）" → "Test-Driven Development (TDD)"
   - Preserve original English terms that were kept in the Chinese text.

3. **Code blocks**: Translate ONLY Chinese comments inside code blocks. All code stays as-is.
   - \`// 检查边界条件\` → \`// Check for edge cases\`

4. **Structural elements**: Preserve ALL markdown formatting exactly.

5. **Iron laws / Rules sections**: Translate with absolute precision. Each rule must carry the same force.

6. **Add source attribution header**:
   > Source: [${context.category}] | Type: ${context.type} | Difficulty: ${context.difficulty}

7. **Tone**: Professional technical documentation. Match the authority and directness of the original.

8. **Do NOT**:
   - Add content that doesn't exist in the original
   - Remove any content
   - Weaken imperative/mandatory language
   - Translate code, file paths, or CLI commands

CONTENT TO TRANSLATE:
\`\`\`markdown
${markdown.slice(0, 30000)}
\`\`\`

OUTPUT: Return ONLY the translated markdown. No wrapper, no explanation, no markdown code fence around the output.`;
}

/**
 * Refine orchestrator — the quality engine.
 *
 * This stage handles two critical tasks that make the platform premium:
 *
 * 1. **Fragment Merging**: Takes MERGE_FRAGMENT candidates and integrates
 *    their valuable parts into existing files — a golden sentence from a
 *    mediocre doc can dramatically improve an existing skill file.
 *
 * 2. **Existing Content Optimization**: Reviews optimization suggestions
 *    from the analysis phase and generates improvement PRs for existing
 *    content — adding missing edge cases, troubleshooting sections, etc.
 *
 * Usage:
 *   node pipeline/refine.js
 */

import Anthropic from '@anthropic-ai/sdk';
import * as db from './db/client.js';

interface MergeTarget {
  target_file: string | null;
  extract_content: string;
  merge_reason: string;
}

interface OptimizationSuggestion {
  target_file: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

interface RefineResult {
  fragmentsMerged: number;
  optimizationsGenerated: number;
  errors: number;
}

/**
 * Process all MERGE_FRAGMENT candidates.
 * Extracts golden content and prepares merge operations.
 */
async function processFragments(): Promise<{ merged: number; errors: number }> {
  const result = await db.execute(
    `SELECT id, raw_markdown, merge_target, merge_content, analysis_json, suggested_category
     FROM candidates
     WHERE status = 'pending_merge'
     ORDER BY score_weighted DESC
     LIMIT 30`
  );

  let merged = 0;
  let errors = 0;

  const client = new Anthropic();

  for (const row of result.results) {
    const id = row.id as string;
    const rawMarkdown = row.raw_markdown as string;
    const mergeTargets: MergeTarget[] = row.merge_target ? JSON.parse(row.merge_target as string) : [];
    const goldenExtracts: string[] = row.merge_content ? JSON.parse(row.merge_content as string) : [];

    console.log(`Processing fragment ${id}...`);

    if (mergeTargets.length === 0 && goldenExtracts.length === 0) {
      console.log(`  No merge targets or golden extracts — skipping.`);
      await db.execute(
        "UPDATE candidates SET status = 'fragment_archived', updated_at = datetime('now') WHERE id = ?",
        [id]
      );
      continue;
    }

    try {
      // For each merge target, generate the refined content
      for (const target of mergeTargets) {
        if (!target.target_file || !target.extract_content) continue;

        console.log(`  Preparing merge into: ${target.target_file}`);
        console.log(`  Reason: ${target.merge_reason}`);

        // Generate the merge instruction (will be applied by publish stage)
        const mergeInstruction = await generateMergeInstruction(
          client,
          target.target_file,
          target.extract_content,
          target.merge_reason,
          rawMarkdown
        );

        if (mergeInstruction) {
          // Store merge instruction for the publish stage
          await db.execute(
            `INSERT INTO candidates (id, source_id, source_path, content_hash, raw_markdown, raw_token_count, format, status,
               merge_target, merge_content, suggested_category, fragment_action)
             VALUES (?, ?, ?, ?, ?, ?, 'fragment-merge', 'translated',
               ?, ?, ?, 'merge_into')
             ON CONFLICT(id) DO NOTHING`,
            [
              `merge-${id}-${Buffer.from(target.target_file).toString('base64').slice(0, 8)}`,
              'pipeline-refine',
              target.target_file,
              `merge-${id}`,
              mergeInstruction.content,
              estimateTokens(mergeInstruction.content),
              JSON.stringify([target]),
              JSON.stringify(mergeInstruction),
              (row.suggested_category as string) || 'utilities',
            ]
          );
          merged++;
        }
      }

      // Store golden extracts for future reference even if no direct merge target
      if (goldenExtracts.length > 0 && mergeTargets.length === 0) {
        console.log(`  ${goldenExtracts.length} golden extracts archived for future merging.`);
      }

      // Mark original candidate as processed
      await db.execute(
        "UPDATE candidates SET status = 'fragment_processed', updated_at = datetime('now') WHERE id = ?",
        [id]
      );
    } catch (err) {
      errors++;
      console.error(`  Error processing fragment ${id}:`, err instanceof Error ? err.message : String(err));
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  return { merged, errors };
}

/**
 * Generate a merge instruction — tells the publish stage exactly how
 * to integrate a fragment into an existing file.
 */
async function generateMergeInstruction(
  client: Anthropic,
  targetFile: string,
  extractContent: string,
  mergeReason: string,
  fullSourceMarkdown: string
): Promise<{ content: string; insertAfterSection: string; type: 'append_section' | 'enhance_section' | 'add_subsection' } | null> {
  const prompt = `You are a technical content editor for a premium AI skills library.

TASK: Generate refined content to merge into an existing skill file.

TARGET FILE: ${targetFile}
MERGE REASON: ${mergeReason}

EXTRACTED CONTENT TO MERGE:
\`\`\`
${extractContent.slice(0, 5000)}
\`\`\`

FULL SOURCE CONTEXT:
\`\`\`
${fullSourceMarkdown.slice(0, 10000)}
\`\`\`

RULES:
1. The merged content must be PROFESSIONAL and CONCISE — no fluff.
2. It should enhance the target file's quality without creating redundancy.
3. Format it as a markdown section that can be inserted into the target file.
4. Include practical examples and edge cases where relevant.
5. If the content is troubleshooting/error knowledge, format as a "Common Issues" or "Troubleshooting" section.
6. If it's enhancement content, format to match the style of the target file.

OUTPUT: Return ONLY valid JSON:
{
  "content": "The refined markdown content to insert (full section with heading)",
  "insertAfterSection": "The heading name after which to insert (e.g., '## Core Rules')",
  "type": "append_section | enhance_section | add_subsection"
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonStr = text.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error(`  Failed to generate merge instruction:`, err instanceof Error ? err.message : String(err));
    return null;
  }
}

/**
 * Process optimization suggestions for existing content.
 * Generates a prioritized list of improvements.
 */
async function processOptimizations(): Promise<{ generated: number; errors: number }> {
  // Collect all high-priority optimization suggestions from recent analyses
  const result = await db.execute(
    `SELECT id, optimization_targets, analysis_json
     FROM candidates
     WHERE optimization_targets IS NOT NULL
       AND status IN ('approved', 'auto_rejected', 'fragment_processed', 'pending_review')
     ORDER BY score_optimization_potential DESC
     LIMIT 20`
  );

  const allSuggestions: Array<OptimizationSuggestion & { sourceId: string }> = [];

  for (const row of result.results) {
    const targets: OptimizationSuggestion[] = JSON.parse(row.optimization_targets as string);
    for (const t of targets) {
      allSuggestions.push({ ...t, sourceId: row.id as string });
    }
  }

  // Deduplicate by target file and merge similar suggestions
  const byFile = new Map<string, Array<OptimizationSuggestion & { sourceId: string }>>();
  for (const s of allSuggestions) {
    const existing = byFile.get(s.target_file) || [];
    existing.push(s);
    byFile.set(s.target_file, existing);
  }

  let generated = 0;
  let errors = 0;

  // Log optimization report
  console.log(`\n--- Optimization Report ---`);
  console.log(`Files with improvement suggestions: ${byFile.size}`);

  for (const [file, suggestions] of byFile) {
    const highPriority = suggestions.filter(s => s.priority === 'high');
    const medPriority = suggestions.filter(s => s.priority === 'medium');

    console.log(`  ${file}: ${highPriority.length} high, ${medPriority.length} medium priority`);
    for (const s of suggestions) {
      console.log(`    [${s.priority}] ${s.suggestion.slice(0, 100)}`);
    }
    generated++;
  }

  // Store optimization report as a special candidate for the publish stage to create an issue/PR
  if (byFile.size > 0) {
    const reportMarkdown = generateOptimizationReport(byFile);
    await db.execute(
      `INSERT INTO candidates (id, source_id, source_path, content_hash, raw_markdown, raw_token_count, format, status, fragment_action)
       VALUES (?, 'pipeline-refine', 'optimization-report', ?, ?, ?, 'optimization-report', 'optimization_ready', 'optimize_existing')
       ON CONFLICT(id) DO UPDATE SET raw_markdown = excluded.raw_markdown, updated_at = datetime('now')`,
      [
        `opt-report-${new Date().toISOString().slice(0, 10)}`,
        `opt-${Date.now()}`,
        reportMarkdown,
        estimateTokens(reportMarkdown),
      ]
    );
  }

  return { generated, errors };
}

function generateOptimizationReport(
  byFile: Map<string, Array<OptimizationSuggestion & { sourceId: string }>>
): string {
  let report = `# Content Optimization Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Files Requiring Optimization\n\n`;

  for (const [file, suggestions] of byFile) {
    report += `### ${file}\n\n`;
    for (const s of suggestions) {
      report += `- **[${s.priority.toUpperCase()}]** ${s.suggestion}\n`;
    }
    report += '\n';
  }

  return report;
}

function estimateTokens(text: string): number {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.round(chineseChars / 2 + otherChars / 4);
}

// --- Main ---

async function main() {
  console.log('\n=== Refine Run ===\n');

  // Step 1: Process fragment merges
  console.log('--- Step 1: Fragment Merging ---');
  const fragmentResult = await processFragments();
  console.log(`  Fragments merged: ${fragmentResult.merged}`);
  console.log(`  Errors: ${fragmentResult.errors}\n`);

  // Step 2: Process optimization suggestions
  console.log('--- Step 2: Optimization Analysis ---');
  const optResult = await processOptimizations();
  console.log(`  Optimizations identified: ${optResult.generated}`);
  console.log(`  Errors: ${optResult.errors}\n`);

  console.log('=== Refine Complete ===');
  console.log(`  Fragments merged: ${fragmentResult.merged}`);
  console.log(`  Optimizations: ${optResult.generated}`);
}

export { processFragments, processOptimizations };

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

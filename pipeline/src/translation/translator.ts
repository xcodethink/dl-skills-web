/**
 * Professional-grade skill translation using Claude API.
 *
 * Translates approved candidates into both CN and EN.
 * Quality standard: precise, professional — these are AI working instructions.
 */

import Anthropic from '@anthropic-ai/sdk';
import { buildTranslationPrompt } from './prompts.js';
import * as db from '../db/client.js';

/**
 * Detect the primary language of a markdown document.
 */
function detectLanguage(text: string): 'cn' | 'en' | 'mixed' {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const totalChars = text.replace(/\s+/g, '').length;
  const ratio = chineseChars / totalChars;

  if (ratio > 0.15) return 'cn';
  if (ratio < 0.05) return 'en';
  return 'mixed';
}

/**
 * Translate a single candidate skill into both languages.
 */
export async function translateCandidate(candidateId: string): Promise<{
  translatedCn: string;
  translatedEn: string;
}> {
  // Fetch the candidate
  const result = await db.execute(
    'SELECT raw_markdown, suggested_category, suggested_type, suggested_difficulty, status FROM candidates WHERE id = ?',
    [candidateId]
  );
  const row = result.results[0];
  if (!row) throw new Error(`Candidate ${candidateId} not found`);
  if (row.status !== 'approved') throw new Error(`Candidate ${candidateId} is not approved (status: ${row.status})`);

  const markdown = row.raw_markdown as string;
  const context = {
    category: (row.suggested_category as string) || 'general',
    type: (row.suggested_type as string) || 'skill',
    difficulty: (row.suggested_difficulty as string) || 'intermediate',
  };

  // Update status
  await db.execute("UPDATE candidates SET status = 'translating', updated_at = datetime('now') WHERE id = ?", [candidateId]);

  const client = new Anthropic();
  const lang = detectLanguage(markdown);

  let translatedCn: string;
  let translatedEn: string;

  if (lang === 'en') {
    // Original is English — translate to Chinese
    translatedEn = markdown;
    translatedCn = await callTranslation(client, markdown, 'en-to-cn', context);
  } else if (lang === 'cn') {
    // Original is Chinese — translate to English
    translatedCn = markdown;
    translatedEn = await callTranslation(client, markdown, 'cn-to-en', context);
  } else {
    // Mixed — translate both ways to get clean versions
    translatedEn = await callTranslation(client, markdown, 'cn-to-en', context);
    translatedCn = await callTranslation(client, markdown, 'en-to-cn', context);
  }

  // Save translations
  await db.execute(
    `UPDATE candidates SET
       translated_cn = ?, translated_en = ?,
       status = 'translated', updated_at = datetime('now')
     WHERE id = ?`,
    [translatedCn, translatedEn, candidateId]
  );

  return { translatedCn, translatedEn };
}

async function callTranslation(
  client: Anthropic,
  markdown: string,
  direction: 'en-to-cn' | 'cn-to-en',
  context: { category: string; type: string; difficulty: string }
): Promise<string> {
  const prompt = buildTranslationPrompt(markdown, direction, context);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return text.trim();
}

/**
 * Translate all approved candidates that haven't been translated yet.
 */
export async function translateAllApproved(): Promise<{
  translated: number;
  errors: number;
}> {
  const result = await db.execute(
    "SELECT id FROM candidates WHERE status = 'approved' ORDER BY created_at ASC LIMIT 20"
  );

  let translated = 0;
  let errors = 0;

  for (const row of result.results) {
    const id = row.id as string;
    console.log(`Translating ${id}...`);

    try {
      await translateCandidate(id);
      translated++;
      console.log(`  Done.`);
    } catch (err) {
      errors++;
      console.error(`  Error: ${err instanceof Error ? err.message : String(err)}`);
      // Reset status to approved so it can be retried
      await db.execute("UPDATE candidates SET status = 'approved', updated_at = datetime('now') WHERE id = ?", [id]);
    }

    // Delay between API calls
    await new Promise(r => setTimeout(r, 2000));
  }

  return { translated, errors };
}

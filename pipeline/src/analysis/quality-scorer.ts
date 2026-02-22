/**
 * AI-powered quality scoring using Claude API.
 */

import Anthropic from '@anthropic-ai/sdk';
import { buildAnalysisPrompt, buildExistingSkillList } from './prompts.js';
import * as db from '../db/client.js';

interface AnalysisResult {
  scores: {
    relevance: { score: number; rationale: string };
    structure: { score: number; rationale: string };
    actionability: { score: number; rationale: string };
    uniqueness: { score: number; rationale: string };
    completeness: { score: number; rationale: string };
  };
  weighted_total: number;
  suggested_category: string;
  suggested_tags: string[];
  suggested_type: string;
  suggested_difficulty: string;
  duplicate_of: string | null;
  summary_en: string;
  summary_cn: string;
  recommendation: 'ACCEPT' | 'REVIEW' | 'REJECT';
  rejection_reason: string | null;
}

export async function analyzeCandidate(
  candidateId: string,
  rawMarkdown: string,
  existingSkills: Array<{ name: string; category: string; highlight: string }>
): Promise<AnalysisResult> {
  const client = new Anthropic();

  const existingList = buildExistingSkillList(existingSkills);
  const prompt = buildAnalysisPrompt(rawMarkdown, existingList);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  // Parse JSON from response (handle potential markdown wrapping)
  const jsonStr = text.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  const analysis: AnalysisResult = JSON.parse(jsonStr);

  // Validate and compute weighted total
  const weights = { relevance: 0.3, structure: 0.25, actionability: 0.2, uniqueness: 0.15, completeness: 0.1 };
  const computedTotal =
    analysis.scores.relevance.score * weights.relevance +
    analysis.scores.structure.score * weights.structure +
    analysis.scores.actionability.score * weights.actionability +
    analysis.scores.uniqueness.score * weights.uniqueness +
    analysis.scores.completeness.score * weights.completeness;
  analysis.weighted_total = Math.round(computedTotal * 10) / 10;

  // Determine recommendation based on scores
  if (analysis.scores.relevance.score < 4 || analysis.weighted_total < 5.0) {
    analysis.recommendation = 'REJECT';
  } else if (analysis.scores.relevance.score >= 6 && analysis.weighted_total >= 7.0) {
    analysis.recommendation = 'ACCEPT';
  } else {
    analysis.recommendation = 'REVIEW';
  }

  // Determine status
  const status = analysis.recommendation === 'REJECT' ? 'auto_rejected' : 'pending_review';

  // Save to D1
  await db.updateCandidateAnalysis(candidateId, {
    analysisJson: JSON.stringify(analysis),
    scoreRelevance: analysis.scores.relevance.score,
    scoreStructure: analysis.scores.structure.score,
    scoreActionability: analysis.scores.actionability.score,
    scoreUniqueness: analysis.scores.uniqueness.score,
    scoreCompleteness: analysis.scores.completeness.score,
    scoreWeighted: analysis.weighted_total,
    aiRecommendation: analysis.recommendation,
    suggestedCategory: analysis.suggested_category,
    suggestedTags: JSON.stringify(analysis.suggested_tags),
    suggestedType: analysis.suggested_type,
    suggestedDifficulty: analysis.suggested_difficulty,
    duplicateOf: analysis.duplicate_of,
    summaryEn: analysis.summary_en,
    summaryCn: analysis.summary_cn,
    status,
  });

  return analysis;
}

export async function analyzeAllPending(
  existingSkills: Array<{ name: string; category: string; highlight: string }>
): Promise<{ analyzed: number; accepted: number; reviewed: number; rejected: number }> {
  // Fetch all pending_analysis candidates from D1
  const result = await db.execute(
    "SELECT id, raw_markdown FROM candidates WHERE status = 'pending_analysis' ORDER BY created_at ASC LIMIT 50"
  );

  let analyzed = 0, accepted = 0, reviewed = 0, rejected = 0;

  for (const row of result.results) {
    const id = row.id as string;
    const markdown = row.raw_markdown as string;

    console.log(`Analyzing candidate ${id}...`);
    try {
      const analysis = await analyzeCandidate(id, markdown, existingSkills);
      analyzed++;

      switch (analysis.recommendation) {
        case 'ACCEPT': accepted++; break;
        case 'REVIEW': reviewed++; break;
        case 'REJECT': rejected++; break;
      }

      console.log(`  Score: ${analysis.weighted_total} → ${analysis.recommendation} (${analysis.suggested_category})`);
    } catch (err) {
      console.error(`  Error analyzing ${id}:`, err instanceof Error ? err.message : err);
    }

    // Small delay between API calls
    await new Promise(r => setTimeout(r, 1000));
  }

  return { analyzed, accepted, reviewed, rejected };
}

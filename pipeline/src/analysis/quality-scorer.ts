/**
 * AI-powered quality scoring using Claude API — v2 Enhanced.
 *
 * 9-dimension scoring with platform compatibility,
 * fragment extraction, and existing content optimization.
 */

import Anthropic from '@anthropic-ai/sdk';
import { buildAnalysisPrompt, buildExistingSkillList, buildExistingFileIndex } from './prompts.js';
import * as db from '../db/client.js';

interface ScoreDimension {
  score: number;
  rationale: string;
}

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

interface PlatformScore {
  score: number;
  rationale: string;
}

export interface AnalysisResult {
  scores: {
    content_quality: ScoreDimension;
    problem_solving: ScoreDimension;
    scene_fitness: ScoreDimension;
    ai_readability: ScoreDimension;
    rigor: ScoreDimension;
    problem_accumulation: ScoreDimension;
    granularity: ScoreDimension;
    integration_fit: ScoreDimension;
    optimization_potential: ScoreDimension;
  };
  weighted_total: number;

  platform_compatibility: {
    claude_code: PlatformScore;
    codex: PlatformScore;
    cursor: PlatformScore;
  };
  compatible_with: string[];

  fragment_action: 'standalone' | 'merge_into' | 'split_merge' | 'optimize_existing';
  merge_targets: MergeTarget[];
  optimization_suggestions: OptimizationSuggestion[];

  suggested_category: string;
  suggested_tags: string[];
  suggested_type: string;
  suggested_difficulty: string;
  duplicate_of: string | null;
  summary_en: string;
  summary_cn: string;
  recommendation: 'ACCEPT' | 'REVIEW' | 'REJECT' | 'MERGE_FRAGMENT';
  rejection_reason: string | null;
  golden_extracts: string[];
}

/** Weights for the 9 scoring dimensions */
const WEIGHTS = {
  content_quality: 0.20,
  problem_solving: 0.15,
  scene_fitness: 0.10,
  ai_readability: 0.15,
  rigor: 0.15,
  problem_accumulation: 0.10,
  granularity: 0.05,
  integration_fit: 0.05,
  optimization_potential: 0.05,
};

export async function analyzeCandidate(
  candidateId: string,
  rawMarkdown: string,
  existingSkills: Array<{ name: string; category: string; highlight: string }>,
  existingFiles: Array<{ path: string; title: string; category: string }>
): Promise<AnalysisResult> {
  const client = new Anthropic();

  const existingList = buildExistingSkillList(existingSkills);
  const fileIndex = buildExistingFileIndex(existingFiles);
  const prompt = buildAnalysisPrompt(rawMarkdown, existingList, fileIndex);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  // Parse JSON from response (handle potential markdown wrapping)
  const jsonStr = text.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  const analysis: AnalysisResult = JSON.parse(jsonStr);

  // Compute weighted total from 9 dimensions
  const computedTotal =
    analysis.scores.content_quality.score * WEIGHTS.content_quality +
    analysis.scores.problem_solving.score * WEIGHTS.problem_solving +
    analysis.scores.scene_fitness.score * WEIGHTS.scene_fitness +
    analysis.scores.ai_readability.score * WEIGHTS.ai_readability +
    analysis.scores.rigor.score * WEIGHTS.rigor +
    analysis.scores.problem_accumulation.score * WEIGHTS.problem_accumulation +
    analysis.scores.granularity.score * WEIGHTS.granularity +
    analysis.scores.integration_fit.score * WEIGHTS.integration_fit +
    analysis.scores.optimization_potential.score * WEIGHTS.optimization_potential;
  analysis.weighted_total = Math.round(computedTotal * 10) / 10;

  // Determine recommendation based on multi-dimensional logic
  analysis.recommendation = determineRecommendation(analysis);

  // Determine compatible_with from platform scores
  if (!analysis.compatible_with || analysis.compatible_with.length === 0) {
    analysis.compatible_with = [];
    if (analysis.platform_compatibility.claude_code.score >= 5) analysis.compatible_with.push('claude-code');
    if (analysis.platform_compatibility.codex.score >= 5) analysis.compatible_with.push('codex');
    if (analysis.platform_compatibility.cursor.score >= 5) analysis.compatible_with.push('cursor');
  }

  // Determine status based on recommendation
  const statusMap: Record<string, string> = {
    'ACCEPT': 'approved',         // High confidence — skip manual review, go straight to translation
    'REVIEW': 'pending_review',   // Medium confidence — needs human eye
    'REJECT': 'auto_rejected',    // Low quality — archive
    'MERGE_FRAGMENT': 'pending_merge', // Valuable fragments — needs refine stage
  };
  const status = statusMap[analysis.recommendation] || 'pending_review';

  // Save to D1
  await db.updateCandidateAnalysis(candidateId, {
    analysisJson: JSON.stringify(analysis),
    scoreRelevance: analysis.scores.content_quality.score,
    scoreStructure: analysis.scores.problem_solving.score,
    scoreActionability: analysis.scores.scene_fitness.score,
    scoreUniqueness: analysis.scores.ai_readability.score,
    scoreCompleteness: analysis.scores.rigor.score,
    scoreProblemAccumulation: analysis.scores.problem_accumulation.score,
    scoreGranularity: analysis.scores.granularity.score,
    scoreIntegrationFit: analysis.scores.integration_fit.score,
    scoreOptimizationPotential: analysis.scores.optimization_potential.score,
    scoreWeighted: analysis.weighted_total,
    aiRecommendation: analysis.recommendation,
    suggestedCategory: analysis.suggested_category,
    suggestedTags: JSON.stringify(analysis.suggested_tags),
    suggestedType: analysis.suggested_type,
    suggestedDifficulty: analysis.suggested_difficulty,
    duplicateOf: analysis.duplicate_of,
    summaryEn: analysis.summary_en,
    summaryCn: analysis.summary_cn,
    compatibleWith: JSON.stringify(analysis.compatible_with),
    compatibilityRationale: JSON.stringify(analysis.platform_compatibility),
    fragmentAction: analysis.fragment_action,
    mergeTarget: analysis.merge_targets.length > 0 ? JSON.stringify(analysis.merge_targets) : null,
    mergeContent: analysis.golden_extracts.length > 0 ? JSON.stringify(analysis.golden_extracts) : null,
    optimizationTargets: analysis.optimization_suggestions.length > 0 ? JSON.stringify(analysis.optimization_suggestions) : null,
    status,
  });

  return analysis;
}

/**
 * Multi-dimensional recommendation logic.
 *
 * Not just a threshold — considers the nature of the content:
 * - Troubleshooting content gets bonus (rare and valuable)
 * - Fragment-worthy content gets MERGE_FRAGMENT instead of REJECT
 * - High optimization_potential triggers MERGE_FRAGMENT even if standalone score is low
 */
function determineRecommendation(analysis: AnalysisResult): 'ACCEPT' | 'REVIEW' | 'REJECT' | 'MERGE_FRAGMENT' {
  const s = analysis.scores;
  const total = analysis.weighted_total;

  // Rule 1: If fragment_action suggests merging, and there are golden extracts
  if (
    analysis.fragment_action !== 'standalone' &&
    (analysis.golden_extracts?.length > 0 || analysis.merge_targets?.length > 0)
  ) {
    // Even low-total content can be MERGE_FRAGMENT if it has valuable fragments
    if (total >= 3.0) return 'MERGE_FRAGMENT';
  }

  // Rule 2: Problem accumulation bonus — troubleshooting content is rare
  const hasTroubleshootingValue = s.problem_accumulation.score >= 7;

  // Rule 3: Hard reject — truly worthless content
  if (s.content_quality.score < 3 && s.ai_readability.score < 3) {
    return 'REJECT';
  }

  // Rule 4: Auto-accept — premium content
  if (total >= 7.0 && s.content_quality.score >= 7 && s.ai_readability.score >= 6) {
    return 'ACCEPT';
  }

  // Rule 5: Troubleshooting bonus — accept at lower threshold
  if (hasTroubleshootingValue && total >= 5.5 && s.ai_readability.score >= 5) {
    return 'ACCEPT';
  }

  // Rule 6: Content with high optimization potential for existing files
  if (s.optimization_potential.score >= 7 && total >= 4.0) {
    return 'MERGE_FRAGMENT';
  }

  // Rule 7: Low standalone value but has merge potential
  if (s.integration_fit.score < 4 && total < 5.5) {
    // Check if there's anything worth extracting
    if (analysis.golden_extracts?.length > 0) return 'MERGE_FRAGMENT';
    return 'REJECT';
  }

  // Rule 8: Medium quality — needs review
  if (total >= 5.0) return 'REVIEW';

  // Rule 9: Below threshold
  if (total < 4.0) return 'REJECT';

  return 'REVIEW';
}

export async function analyzeAllPending(
  existingSkills: Array<{ name: string; category: string; highlight: string }>,
  existingFiles: Array<{ path: string; title: string; category: string }>
): Promise<{ analyzed: number; accepted: number; reviewed: number; rejected: number; mergeFragment: number }> {
  // Fetch all pending_analysis candidates from D1
  const result = await db.execute(
    "SELECT id, raw_markdown FROM candidates WHERE status = 'pending_analysis' ORDER BY created_at ASC LIMIT 50"
  );

  let analyzed = 0, accepted = 0, reviewed = 0, rejected = 0, mergeFragment = 0;

  for (const row of result.results) {
    const id = row.id as string;
    const markdown = row.raw_markdown as string;

    console.log(`Analyzing candidate ${id}...`);
    try {
      const analysis = await analyzeCandidate(id, markdown, existingSkills, existingFiles);
      analyzed++;

      switch (analysis.recommendation) {
        case 'ACCEPT': accepted++; break;
        case 'REVIEW': reviewed++; break;
        case 'REJECT': rejected++; break;
        case 'MERGE_FRAGMENT': mergeFragment++; break;
      }

      const platforms = analysis.compatible_with.join(', ') || 'none';
      console.log(`  Score: ${analysis.weighted_total} → ${analysis.recommendation} | ${analysis.fragment_action} | Platforms: ${platforms} | Category: ${analysis.suggested_category}`);

      if (analysis.golden_extracts?.length > 0) {
        console.log(`  Golden extracts: ${analysis.golden_extracts.length} found`);
      }
      if (analysis.optimization_suggestions?.length > 0) {
        console.log(`  Optimization suggestions: ${analysis.optimization_suggestions.length} for existing files`);
      }
    } catch (err) {
      console.error(`  Error analyzing ${id}:`, err instanceof Error ? err.message : err);
    }

    // Small delay between API calls
    await new Promise(r => setTimeout(r, 1000));
  }

  return { analyzed, accepted, reviewed, rejected, mergeFragment };
}

/**
 * Analysis orchestrator — evaluates pending candidates with AI.
 *
 * Usage:
 *   node pipeline/analyze.js
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { analyzeAllPending } from './analysis/quality-scorer.js';

interface RegistryEntry {
  unifiedCategory: string;
  highlight_cn: string;
  highlight_en: string;
}

async function main() {
  console.log('\n=== AI Analysis Run ===\n');

  // Load existing skills for deduplication comparison
  const registryPath = path.resolve(process.cwd(), 'data/skills-registry.yaml');
  const registryRaw = fs.readFileSync(registryPath, 'utf-8');
  const registry = yaml.load(registryRaw) as Record<string, RegistryEntry>;

  const existingSkills = Object.entries(registry).map(([key, entry]) => ({
    name: key.split('/').pop() || key,
    category: entry.unifiedCategory,
    highlight: entry.highlight_en || entry.highlight_cn || '',
  }));

  console.log(`Loaded ${existingSkills.length} existing skills for comparison.\n`);

  const result = await analyzeAllPending(existingSkills);

  console.log(`\n=== Analysis Complete ===`);
  console.log(`  Analyzed: ${result.analyzed}`);
  console.log(`  Accepted: ${result.accepted}`);
  console.log(`  Needs Review: ${result.reviewed}`);
  console.log(`  Auto-rejected: ${result.rejected}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

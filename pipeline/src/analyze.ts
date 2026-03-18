/**
 * Analysis orchestrator — evaluates pending candidates with AI.
 * v2: 9-dimension scoring with fragment extraction and platform compatibility.
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
  console.log('\n=== AI Analysis Run (v2 — 9-dimension scoring) ===\n');

  // Load existing skills for deduplication comparison
  const registryPath = path.resolve(process.cwd(), 'data/skills-registry.yaml');
  const registryRaw = fs.readFileSync(registryPath, 'utf-8');
  const registry = yaml.load(registryRaw) as Record<string, RegistryEntry>;

  const existingSkills = Object.entries(registry).map(([key, entry]) => ({
    name: key.split('/').pop() || key,
    category: entry.unifiedCategory,
    highlight: entry.highlight_en || entry.highlight_cn || '',
  }));

  // Build existing file index for merge target suggestions
  const contentDir = path.resolve(process.cwd(), 'content');
  const existingFiles = buildFileIndex(contentDir);

  console.log(`Loaded ${existingSkills.length} existing skills for comparison.`);
  console.log(`Indexed ${existingFiles.length} existing content files for merge targeting.\n`);

  const result = await analyzeAllPending(existingSkills, existingFiles);

  console.log(`\n=== Analysis Complete ===`);
  console.log(`  Analyzed: ${result.analyzed}`);
  console.log(`  Accepted (auto-approved): ${result.accepted}`);
  console.log(`  Needs Review: ${result.reviewed}`);
  console.log(`  Auto-rejected: ${result.rejected}`);
  console.log(`  Merge Fragment: ${result.mergeFragment}`);
}

/**
 * Build an index of all existing content files for the AI to reference
 * when suggesting merge targets.
 */
function buildFileIndex(contentDir: string): Array<{ path: string; title: string; category: string }> {
  const files: Array<{ path: string; title: string; category: string }> = [];

  if (!fs.existsSync(contentDir)) return files;

  const sources = fs.readdirSync(contentDir);
  for (const source of sources) {
    const sourcePath = path.join(contentDir, source);
    if (!fs.statSync(sourcePath).isDirectory()) continue;

    const categories = fs.readdirSync(sourcePath);
    for (const category of categories) {
      const catPath = path.join(sourcePath, category);
      if (!fs.statSync(catPath).isDirectory()) continue;

      const skillFiles = fs.readdirSync(catPath).filter(f => f.endsWith('.md'));
      for (const file of skillFiles) {
        const filePath = `content/${source}/${category}/${file}`;
        const title = file.replace(/\.md$/, '').replace(/^\d+-/, '');
        files.push({
          path: filePath,
          title,
          category: category.replace(/^[A-Z]-/, ''),
        });
      }
    }
  }

  return files;
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

/**
 * Channel A: Known Repository Watchlist Monitor
 *
 * Checks each watchlisted repo for new commits since last check.
 * Extracts new/modified skill files and creates candidates.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import yaml from 'js-yaml';
import * as github from '../utils/github-api.js';
import * as db from '../db/client.js';

interface WatchlistEntry {
  repo: string;
  status: 'integrated' | 'pending' | 'archived';
  skill_pattern: string;
  notes?: string;
}

interface DiscoveredSkill {
  sourceId: string;
  sourcePath: string;
  commitSha: string;
  rawMarkdown: string;
  contentHash: string;
  tokenCount: number;
  format: string;
}

export async function discoverFromWatchlist(): Promise<{
  found: number;
  newCandidates: number;
  duplicates: number;
  errors: string[];
}> {
  const watchlistPath = path.resolve(process.cwd(), 'data/discovery/watchlist.yaml');
  const raw = fs.readFileSync(watchlistPath, 'utf-8');
  const data = yaml.load(raw) as { repositories: WatchlistEntry[] };

  const pendingRepos = data.repositories.filter(r => r.status === 'pending' || r.status === 'integrated');

  let found = 0;
  let newCandidates = 0;
  let duplicates = 0;
  const errors: string[] = [];

  for (const entry of pendingRepos) {
    try {
      const [owner, repo] = entry.repo.split('/');
      console.log(`Checking ${entry.repo}...`);

      // Get repo info
      const info = await github.getRepoInfo(owner, repo);
      if (!info || !info.exists) {
        errors.push(`${entry.repo}: repository not found`);
        continue;
      }
      if (info.archived) {
        console.log(`  Skipping archived repo: ${entry.repo}`);
        continue;
      }

      // Get latest commit
      const latestSha = await github.getLatestCommitSha(owner, repo, info.defaultBranch);
      if (!latestSha) {
        errors.push(`${entry.repo}: could not get latest commit`);
        continue;
      }

      // Check if already processed this commit
      const existingSource = await db.getSource(entry.repo);
      if (existingSource?.last_commit_sha === latestSha) {
        console.log(`  No changes since last check.`);
        continue;
      }

      // Ensure source exists in D1
      await db.upsertSource({
        id: entry.repo,
        url: `https://github.com/${entry.repo}`,
        skillPattern: entry.skill_pattern,
        status: entry.status === 'integrated' ? 'active' : 'pending',
        discoveredVia: 'watchlist',
      });

      // Get file tree and find skill files
      const tree = await github.getFileTree(owner, repo, latestSha);
      const skillFiles = filterSkillFiles(tree, entry.skill_pattern);
      console.log(`  Found ${skillFiles.length} potential skill files.`);

      // Fetch and process each skill file
      for (const filePath of skillFiles) {
        found++;
        const content = await github.getFileContent(owner, repo, filePath);
        if (!content || content.length < 100) continue; // Skip tiny files

        const hash = crypto.createHash('sha256').update(normalizeContent(content)).digest('hex');

        // Check for duplicates
        const isDupe = await db.checkDuplicateHash(hash);
        if (isDupe) {
          duplicates++;
          continue;
        }

        // Detect format
        const format = detectFormat(content, filePath);

        // Create candidate
        const candidateId = crypto.randomUUID();
        await db.insertCandidate({
          id: candidateId,
          sourceId: entry.repo,
          sourcePath: filePath,
          sourceCommitSha: latestSha,
          contentHash: hash,
          rawMarkdown: content,
          rawTokenCount: estimateTokens(content),
          format,
        });
        newCandidates++;
        console.log(`  + New candidate: ${filePath}`);
      }

      // Update last checked
      await db.updateSourceChecked(entry.repo, latestSha);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${entry.repo}: ${msg}`);
      console.error(`  Error: ${msg}`);
    }
  }

  return { found, newCandidates, duplicates, errors };
}

function filterSkillFiles(
  tree: Array<{ path: string; type: string; size: number }>,
  pattern: string
): string[] {
  // Convert simple glob to regex
  const regexStr = pattern
    .replace(/\*\*/g, '___GLOBSTAR___')
    .replace(/\*/g, '[^/]*')
    .replace(/___GLOBSTAR___/g, '.*');
  const regex = new RegExp(`^${regexStr}$`);

  return tree
    .filter(f => f.type === 'blob' && f.path.endsWith('.md'))
    .filter(f => regex.test(f.path))
    .filter(f => !isIgnoredFile(f.path))
    .filter(f => f.size > 200 && f.size < 100000) // Skip tiny or huge files
    .map(f => f.path);
}

function isIgnoredFile(filePath: string): boolean {
  const name = path.basename(filePath).toLowerCase();
  return ['readme.md', 'contributing.md', 'changelog.md', 'license.md', 'code_of_conduct.md'].includes(name);
}

function normalizeContent(content: string): string {
  return content.replace(/\s+/g, ' ').trim().toLowerCase();
}

function detectFormat(content: string, filePath: string): string {
  const name = path.basename(filePath).toUpperCase();
  if (name === 'SKILL.MD') return 'standard-skill';
  if (content.startsWith('---\n') && content.includes('\n---\n')) return 'standard-skill';
  return 'flat-markdown';
}

function estimateTokens(text: string): number {
  // Rough estimate: ~4 chars per token for English, ~2 for Chinese
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.round(chineseChars / 2 + otherChars / 4);
}

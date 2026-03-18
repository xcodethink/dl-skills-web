/**
 * Channel B: GitHub Search Discovery
 *
 * Searches GitHub for new skill repositories and files using multiple
 * search strategies, then adds qualifying repos to the watchlist.
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

interface WatchlistData {
  repositories: WatchlistEntry[];
}

/** Trusted organizations — auto-include regardless of stars. */
const TRUSTED_ORGS = new Set([
  'anthropics', 'vercel', 'cloudflare', 'supabase', 'cursor-ai',
]);

/** Minimum stars to auto-include unknown repos. */
const MIN_STARS = 3;

/** Search queries covering different discovery vectors. */
const SEARCH_QUERIES = {
  repos: [
    // Claude Code skills
    'claude-code skills in:name,description fork:false',
    'claude skills agent in:name fork:false stars:>2',
    'claude-code topic:skills fork:false',
    'SKILL.md claude in:readme fork:false stars:>2',
    // Codex / OpenAI agent skills
    'codex skills agent in:name,description fork:false stars:>2',
    'AGENTS.md openai in:readme fork:false stars:>2',
    'codex-cli skills in:name fork:false',
    // Cursor rules
    'cursorrules AI coding in:name,description fork:false stars:>5',
    // Generic AI coding skills
    'AI coding agent skills in:name fork:false stars:>10',
  ],
  code: [
    'filename:SKILL.md path:skills/ "description"',
    '"claude-code" filename:SKILL.md',
    '"iron laws" OR "iron rules" filename:SKILL.md',
    // Codex-specific patterns
    'filename:AGENTS.md "instructions"',
    'filename:codex.md "agent"',
    // Troubleshooting / problem-accumulation content (rare and valuable)
    '"common errors" OR "troubleshooting" OR "gotchas" filename:SKILL.md',
    '"common mistakes" OR "pitfalls" path:skills/',
  ],
};

export async function discoverFromGitHubSearch(): Promise<{
  found: number;
  newCandidates: number;
  duplicates: number;
  errors: string[];
}> {
  const watchlistPath = path.resolve(process.cwd(), 'data/discovery/watchlist.yaml');
  const raw = fs.readFileSync(watchlistPath, 'utf-8');
  const watchlist = yaml.load(raw) as WatchlistData;
  const knownRepos = new Set(watchlist.repositories.map(r => r.repo.toLowerCase()));

  const discovered = new Map<string, { fullName: string; stars: number; reason: string }>();

  let found = 0;
  let newCandidates = 0;
  let duplicates = 0;
  const errors: string[] = [];

  // --- Repository search ---
  for (const query of SEARCH_QUERIES.repos) {
    try {
      console.log(`  Searching repos: "${query}"`);
      const repos = await github.searchRepos(query, 20);

      for (const repo of repos) {
        const key = repo.fullName.toLowerCase();
        if (knownRepos.has(key) || discovered.has(key)) continue;

        found++;
        const [owner] = repo.fullName.split('/');
        const meetsThreshold = repo.stars >= MIN_STARS || TRUSTED_ORGS.has(owner.toLowerCase());

        if (meetsThreshold) {
          discovered.set(key, {
            fullName: repo.fullName,
            stars: repo.stars,
            reason: `repo-search: ${repo.stars} stars`,
          });
        }
      }
    } catch (err) {
      errors.push(`repo-search "${query}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // --- Code search ---
  for (const query of SEARCH_QUERIES.code) {
    try {
      console.log(`  Searching code: "${query}"`);
      const results = await github.searchCode(query, 20);

      for (const item of results) {
        const key = item.repo.toLowerCase();
        if (knownRepos.has(key) || discovered.has(key)) continue;
        found++;
        discovered.set(key, {
          fullName: item.repo,
          stars: 0, // Will be verified below
          reason: `code-search: ${item.path}`,
        });
      }
    } catch (err) {
      errors.push(`code-search "${query}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // --- Verify and register discovered repos ---
  for (const [, entry] of discovered) {
    try {
      const [owner, repo] = entry.fullName.split('/');
      const info = await github.getRepoInfo(owner, repo);
      if (!info || !info.exists || info.archived) continue;

      // Determine skill pattern by inspecting file tree
      const sha = await github.getLatestCommitSha(owner, repo, info.defaultBranch);
      if (!sha) continue;

      const tree = await github.getFileTree(owner, repo, sha);
      const pattern = inferSkillPattern(tree);
      if (!pattern) {
        console.log(`  Skip ${entry.fullName}: no skill files detected`);
        continue;
      }

      // Register in D1
      await db.upsertSource({
        id: entry.fullName,
        url: `https://github.com/${entry.fullName}`,
        skillPattern: pattern,
        status: 'pending',
        discoveredVia: 'search',
      });
      newCandidates++;
      console.log(`  + Discovered: ${entry.fullName} (${info.stars} stars, pattern: ${pattern})`);

      // Also add to local watchlist YAML so next watchlist run picks it up
      watchlist.repositories.push({
        repo: entry.fullName,
        status: 'pending',
        skill_pattern: pattern,
        notes: `Auto-discovered via GitHub search. ${info.stars} stars. ${entry.reason}`,
      });
      knownRepos.add(entry.fullName.toLowerCase());
    } catch (err) {
      errors.push(`verify ${entry.fullName}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Write updated watchlist back
  if (newCandidates > 0) {
    fs.writeFileSync(watchlistPath, yaml.dump(watchlist, { lineWidth: 120, noRefs: true }));
    console.log(`  Updated watchlist.yaml with ${newCandidates} new entries.`);
  }

  return { found, newCandidates, duplicates, errors };
}

/**
 * Inspect a file tree to determine the most likely skill pattern.
 * Returns null if no skill files are detected.
 */
function inferSkillPattern(tree: Array<{ path: string; type: string; size: number }>): string | null {
  const mdFiles = tree.filter(f => f.type === 'blob' && f.path.endsWith('.md'));

  // Check for standard SKILL.md pattern
  const skillMdFiles = mdFiles.filter(f => f.path.endsWith('/SKILL.md') || f.path === 'SKILL.md');
  if (skillMdFiles.length >= 2) {
    // Find common prefix
    const prefix = commonPathPrefix(skillMdFiles.map(f => f.path));
    return prefix ? `${prefix}*/SKILL.md` : 'skills/*/SKILL.md';
  }

  // Check for skills/ directory with markdown files
  const skillDirFiles = mdFiles.filter(f => f.path.startsWith('skills/'));
  if (skillDirFiles.length >= 3) {
    return 'skills/**/*.md';
  }

  // Check for flat markdown collection (many .md files in root or one level deep)
  const topLevelMd = mdFiles.filter(f => {
    const depth = f.path.split('/').length;
    return depth <= 2 && f.size > 200 && f.size < 50000;
  });
  if (topLevelMd.length >= 5) {
    return '**/*.md';
  }

  return null;
}

function commonPathPrefix(paths: string[]): string {
  if (paths.length === 0) return '';
  const parts = paths[0].split('/');
  let prefix = '';
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = parts.slice(0, i + 1).join('/') + '/';
    if (paths.every(p => p.startsWith(candidate))) {
      prefix = candidate;
    } else {
      break;
    }
  }
  return prefix;
}

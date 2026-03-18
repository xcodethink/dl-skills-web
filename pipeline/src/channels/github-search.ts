/**
 * Channel B: GitHub Search Discovery — v2 with Priority Tiers
 *
 * Three-tier priority system:
 *   Tier 1 (Official)  — Platform vendors, always check first, no star threshold
 *   Tier 2 (Notable)   — Known high-quality authors/orgs, low star threshold
 *   Tier 3 (Community) — General search, higher star threshold required
 *
 * Processing order matters: Tier 1 content is analyzed with a quality bonus
 * because official sources are inherently more authoritative.
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
  tier?: number;
  notes?: string;
}

interface WatchlistData {
  repositories: WatchlistEntry[];
}

// =============================================================================
// TIER 1: Official — Platform vendors and framework authors
// Auto-include regardless of stars. Content gets trust bonus in scoring.
// =============================================================================
const TIER1_OFFICIAL = new Set([
  // AI Platform vendors
  'anthropics',           // Claude / Claude Code maker
  'openai',              // Codex / ChatGPT maker
  // Major framework vendors with official skills
  'vercel',              // Next.js, React
  'vercel-labs',         // Vercel experimental
  'cloudflare',          // Workers, D1, R2
  'supabase',            // Database, Auth
  'prisma',              // ORM
  'flutter',             // Mobile framework
  'microsoft',           // VS Code, TypeScript
  'google',              // Angular, Firebase
  'facebook',            // React core
  'meta',                // Meta OSS
  'cursor-ai',           // Cursor IDE
  'anysphere',           // Cursor parent company
]);

// =============================================================================
// TIER 2: Notable — Known high-quality skill authors and orgs
// Lower star threshold (≥2). These are curated community leaders.
// =============================================================================
const TIER2_NOTABLE = new Set([
  // Prolific skill authors
  'obra',                // superpowers — iron law methodology
  'mrgoonie',            // claudekit — comprehensive collection
  'bear2u',              // my-skills — practical tools
  'affaan-m',            // everything-claude-code — mega collection
  'jeffallan',           // claude-skills — full-stack
  'trailofbits',         // Security skills — professional auditor
  'composiohq',          // API integration automation
  'neolabhq',            // Agent design toolkit
  // Notable AI/dev community figures
  'fireship-io',         // Popular dev educator
  'theprimeagen',        // Known dev content creator
  'denoland',            // Deno runtime
  'biomejs',             // Biome formatter/linter
  'astro-community',     // Astro ecosystem
  'withastro',           // Astro framework
  'tailwindlabs',        // Tailwind CSS
  'shadcn-ui',           // UI components
]);

const TIER2_MIN_STARS = 2;

// =============================================================================
// TIER 3: Community — General discovery, higher bar required
// =============================================================================
const TIER3_MIN_STARS = 10;  // Raised from 3 to 10 — quality over quantity

// =============================================================================
// Search queries by tier
// =============================================================================
const SEARCH_QUERIES = {
  // Tier 1: Official sources — always check these patterns
  tier1: {
    repos: [
      'skills in:name org:anthropics fork:false',
      'skills in:name org:vercel-labs fork:false',
      'skills in:name org:openai fork:false',
      'SKILL.md org:anthropics fork:false',
      'AGENTS.md org:openai fork:false',
    ],
    code: [
      'filename:SKILL.md org:anthropics',
      'filename:SKILL.md org:vercel-labs',
      'filename:AGENTS.md org:openai',
    ],
  },

  // Tier 2: Notable authors — targeted searches
  tier2: {
    repos: [
      'claude-code skills in:name,description fork:false stars:>1',
      'claude skills agent in:name fork:false stars:>1',
      'claude-code topic:skills fork:false',
      'codex skills agent in:name,description fork:false stars:>1',
    ],
    code: [
      'filename:SKILL.md path:skills/ "description"',
      '"claude-code" filename:SKILL.md',
      '"iron laws" OR "iron rules" filename:SKILL.md',
      'filename:AGENTS.md "instructions"',
      'filename:codex.md "agent"',
    ],
  },

  // Tier 3: Community discovery — broader but higher bar
  tier3: {
    repos: [
      'SKILL.md claude in:readme fork:false stars:>10',
      'codex-cli skills in:name fork:false stars:>10',
      'cursorrules AI coding in:name,description fork:false stars:>10',
      'AI coding agent skills in:name fork:false stars:>20',
    ],
    code: [
      // Troubleshooting content is rare and HIGH VALUE — search broadly
      '"common errors" OR "troubleshooting" OR "gotchas" filename:SKILL.md',
      '"common mistakes" OR "pitfalls" path:skills/',
    ],
  },
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

  const discovered = new Map<string, { fullName: string; stars: number; tier: number; reason: string }>();

  let found = 0;
  let newCandidates = 0;
  let duplicates = 0;
  const errors: string[] = [];

  // --- Tier 1: Official sources (always first) ---
  console.log('\n  === Tier 1: Official Sources ===');
  await searchTier(SEARCH_QUERIES.tier1, 1, discovered, knownRepos, errors);

  // --- Tier 2: Notable authors ---
  console.log('\n  === Tier 2: Notable Authors ===');
  await searchTier(SEARCH_QUERIES.tier2, 2, discovered, knownRepos, errors);

  // --- Tier 3: Community discovery ---
  console.log('\n  === Tier 3: Community ===');
  await searchTier(SEARCH_QUERIES.tier3, 3, discovered, knownRepos, errors);

  found = discovered.size;

  // --- Verify and register discovered repos (ordered by tier) ---
  const sortedEntries = [...discovered.entries()].sort((a, b) => a[1].tier - b[1].tier);

  for (const [, entry] of sortedEntries) {
    try {
      const [owner, repo] = entry.fullName.split('/');
      const info = await github.getRepoInfo(owner, repo);
      if (!info || !info.exists || info.archived) continue;

      // Apply tier-specific star thresholds
      const ownerLower = owner.toLowerCase();
      const isTier1 = TIER1_OFFICIAL.has(ownerLower);
      const isTier2 = TIER2_NOTABLE.has(ownerLower);

      let meetsThreshold: boolean;
      if (isTier1) {
        meetsThreshold = true; // No star requirement for official
      } else if (isTier2) {
        meetsThreshold = info.stars >= TIER2_MIN_STARS;
      } else {
        meetsThreshold = info.stars >= TIER3_MIN_STARS;
      }

      if (!meetsThreshold) {
        console.log(`  Skip ${entry.fullName}: ${info.stars} stars < tier ${entry.tier} threshold`);
        continue;
      }

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

      const tierLabel = entry.tier === 1 ? '🏛 Official' : entry.tier === 2 ? '⭐ Notable' : '🌐 Community';
      console.log(`  + [${tierLabel}] ${entry.fullName} (${info.stars} stars, pattern: ${pattern})`);

      // Add to local watchlist
      watchlist.repositories.push({
        repo: entry.fullName,
        status: 'pending',
        skill_pattern: pattern,
        tier: entry.tier,
        notes: `[Tier ${entry.tier}] Auto-discovered. ${info.stars} stars. ${entry.reason}`,
      });
      knownRepos.add(entry.fullName.toLowerCase());
    } catch (err) {
      errors.push(`verify ${entry.fullName}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Write updated watchlist back
  if (newCandidates > 0) {
    fs.writeFileSync(watchlistPath, yaml.dump(watchlist, { lineWidth: 120, noRefs: true }));
    console.log(`\n  Updated watchlist.yaml with ${newCandidates} new entries.`);
  }

  return { found, newCandidates, duplicates, errors };
}

/**
 * Execute search queries for a given tier.
 */
async function searchTier(
  queries: { repos: string[]; code: string[] },
  tier: number,
  discovered: Map<string, { fullName: string; stars: number; tier: number; reason: string }>,
  knownRepos: Set<string>,
  errors: string[]
): Promise<void> {
  // Repo search
  for (const query of queries.repos) {
    try {
      console.log(`  Searching repos: "${query}"`);
      const repos = await github.searchRepos(query, 30);

      for (const repo of repos) {
        const key = repo.fullName.toLowerCase();
        if (knownRepos.has(key) || discovered.has(key)) continue;

        // Don't downgrade tier if already discovered at a higher tier
        const existing = discovered.get(key);
        if (existing && existing.tier <= tier) continue;

        discovered.set(key, {
          fullName: repo.fullName,
          stars: repo.stars,
          tier,
          reason: `tier${tier}-repo-search: ${repo.stars} stars`,
        });
      }
    } catch (err) {
      errors.push(`tier${tier}-repo "${query}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Code search
  for (const query of queries.code) {
    try {
      console.log(`  Searching code: "${query}"`);
      const results = await github.searchCode(query, 20);

      for (const item of results) {
        const key = item.repo.toLowerCase();
        if (knownRepos.has(key) || discovered.has(key)) continue;

        discovered.set(key, {
          fullName: item.repo,
          stars: 0,
          tier,
          reason: `tier${tier}-code-search: ${item.path}`,
        });
      }
    } catch (err) {
      errors.push(`tier${tier}-code "${query}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/**
 * Inspect a file tree to determine the most likely skill pattern.
 */
function inferSkillPattern(tree: Array<{ path: string; type: string; size: number }>): string | null {
  const mdFiles = tree.filter(f => f.type === 'blob' && f.path.endsWith('.md'));

  // Check for standard SKILL.md pattern
  const skillMdFiles = mdFiles.filter(f => f.path.endsWith('/SKILL.md') || f.path === 'SKILL.md');
  if (skillMdFiles.length >= 2) {
    const prefix = commonPathPrefix(skillMdFiles.map(f => f.path));
    return prefix ? `${prefix}*/SKILL.md` : 'skills/*/SKILL.md';
  }

  // Check for AGENTS.md pattern (Codex)
  const agentsMdFiles = mdFiles.filter(f => f.path.endsWith('/AGENTS.md') || f.path === 'AGENTS.md');
  if (agentsMdFiles.length >= 1) {
    return '**/*.md';
  }

  // Check for skills/ directory with markdown files
  const skillDirFiles = mdFiles.filter(f => f.path.startsWith('skills/'));
  if (skillDirFiles.length >= 3) {
    return 'skills/**/*.md';
  }

  // Check for flat markdown collection
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

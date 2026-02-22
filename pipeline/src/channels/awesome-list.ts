/**
 * Channel C: Awesome-List Link Extraction
 *
 * Parses awesome-list README files to extract GitHub links to skill
 * repositories, then feeds them through the same registration pipeline
 * as GitHub Search.
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import * as github from '../utils/github-api.js';
import * as db from '../db/client.js';

interface AwesomeListEntry {
  repo: string;
  readme_path: string;
  notes?: string;
}

interface WatchlistEntry {
  repo: string;
  status: 'integrated' | 'pending' | 'archived';
  skill_pattern: string;
  notes?: string;
}

interface WatchlistData {
  repositories: WatchlistEntry[];
}

/** Regex to extract GitHub repo links from markdown. */
const GITHUB_REPO_REGEX = /https?:\/\/github\.com\/([\w.-]+\/[\w.-]+)/g;

/** Repos to ignore (meta repos, non-skill repos). */
const IGNORE_REPOS = new Set([
  'anthropics/claude-code',
  'modelcontextprotocol/servers',
  'anthropics/anthropic-cookbook',
]);

export async function discoverFromAwesomeLists(): Promise<{
  found: number;
  newCandidates: number;
  duplicates: number;
  errors: string[];
}> {
  const awesomePath = path.resolve(process.cwd(), 'data/discovery/awesome-lists.yaml');
  const raw = fs.readFileSync(awesomePath, 'utf-8');
  const data = yaml.load(raw) as { awesome_lists: AwesomeListEntry[] };

  // Load existing watchlist for dedup
  const watchlistPath = path.resolve(process.cwd(), 'data/discovery/watchlist.yaml');
  const watchlistRaw = fs.readFileSync(watchlistPath, 'utf-8');
  const watchlist = yaml.load(watchlistRaw) as WatchlistData;
  const knownRepos = new Set(watchlist.repositories.map(r => r.repo.toLowerCase()));

  let found = 0;
  let newCandidates = 0;
  let duplicates = 0;
  const errors: string[] = [];

  for (const entry of data.awesome_lists) {
    try {
      const [owner, repo] = entry.repo.split('/');
      console.log(`  Parsing ${entry.repo}/${entry.readme_path}...`);

      const content = await github.getFileContent(owner, repo, entry.readme_path);
      if (!content) {
        errors.push(`${entry.repo}: could not fetch ${entry.readme_path}`);
        continue;
      }

      // Extract all GitHub repo links
      const links = extractRepoLinks(content);
      console.log(`  Found ${links.length} GitHub repo links.`);

      for (const link of links) {
        const key = link.toLowerCase();
        if (knownRepos.has(key) || IGNORE_REPOS.has(key)) {
          duplicates++;
          continue;
        }
        found++;

        try {
          const [linkOwner, linkRepo] = link.split('/');
          const info = await github.getRepoInfo(linkOwner, linkRepo);
          if (!info || !info.exists || info.archived) continue;

          // Quick check: does it look like a skill repo?
          const sha = await github.getLatestCommitSha(linkOwner, linkRepo, info.defaultBranch);
          if (!sha) continue;

          const tree = await github.getFileTree(linkOwner, linkRepo, sha);
          const hasMd = tree.some(f =>
            f.type === 'blob' &&
            f.path.endsWith('.md') &&
            f.size > 200 &&
            !['readme.md', 'contributing.md', 'changelog.md', 'license.md'].includes(f.path.toLowerCase())
          );

          if (!hasMd) {
            console.log(`  Skip ${link}: no meaningful .md files`);
            continue;
          }

          // Infer pattern
          const pattern = inferPattern(tree);

          // Register in D1
          await db.upsertSource({
            id: link,
            url: `https://github.com/${link}`,
            skillPattern: pattern,
            status: 'pending',
            discoveredVia: 'awesome-list',
          });

          // Add to local watchlist
          watchlist.repositories.push({
            repo: link,
            status: 'pending',
            skill_pattern: pattern,
            notes: `Via awesome-list ${entry.repo}. ${info.stars} stars.`,
          });
          knownRepos.add(key);
          newCandidates++;
          console.log(`  + Discovered: ${link} (${info.stars} stars)`);
        } catch (err) {
          errors.push(`${link}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    } catch (err) {
      errors.push(`${entry.repo}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Write updated watchlist
  if (newCandidates > 0) {
    fs.writeFileSync(watchlistPath, yaml.dump(watchlist, { lineWidth: 120, noRefs: true }));
    console.log(`  Updated watchlist.yaml with ${newCandidates} new entries.`);
  }

  return { found, newCandidates, duplicates, errors };
}

/**
 * Extract unique GitHub owner/repo pairs from markdown content.
 * Filters out non-repo links (e.g., github.com/features, github.com/topics/).
 */
function extractRepoLinks(markdown: string): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = GITHUB_REPO_REGEX.exec(markdown)) !== null) {
    let repoPath = match[1];
    // Remove trailing slashes, anchors, etc.
    repoPath = repoPath.replace(/\/+$/, '').split('#')[0].split('?')[0];

    // Skip non-repo paths
    if (repoPath.includes('/') && repoPath.split('/').length === 2) {
      const [owner] = repoPath.split('/');
      // Skip GitHub feature pages
      if (['features', 'topics', 'explore', 'settings', 'marketplace', 'sponsors'].includes(owner)) continue;

      const key = repoPath.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        results.push(repoPath);
      }
    }
  }

  return results;
}

function inferPattern(tree: Array<{ path: string; type: string; size: number }>): string {
  const mdFiles = tree.filter(f => f.type === 'blob' && f.path.endsWith('.md'));
  const skillMdFiles = mdFiles.filter(f => f.path.endsWith('/SKILL.md'));
  if (skillMdFiles.length >= 2) return 'skills/*/SKILL.md';

  const skillDir = mdFiles.filter(f => f.path.startsWith('skills/'));
  if (skillDir.length >= 3) return 'skills/**/*.md';

  return '**/*.md';
}

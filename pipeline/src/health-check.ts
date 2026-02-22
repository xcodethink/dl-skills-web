/**
 * Health check — detects stale repos, deleted files, license changes.
 *
 * Usage:
 *   node pipeline/health-check.js
 */

import * as db from './db/client.js';
import * as github from './utils/github-api.js';

interface HealthIssue {
  sourceId: string;
  type: 'repo_deleted' | 'repo_archived' | 'license_changed' | 'stale' | 'source_updated';
  detail: string;
}

async function main() {
  console.log('\n=== Health Check ===\n');

  const result = await db.execute(
    "SELECT id, url, last_checked_at, last_commit_sha, license, status FROM sources WHERE status IN ('active', 'pending')"
  );

  const issues: HealthIssue[] = [];
  const sources = result.results;

  console.log(`Checking ${sources.length} sources...\n`);

  for (const source of sources) {
    const id = source.id as string;
    const [owner, repo] = id.split('/');
    if (!owner || !repo) continue;

    console.log(`  Checking ${id}...`);

    try {
      const info = await github.getRepoInfo(owner, repo);

      if (!info || !info.exists) {
        issues.push({ sourceId: id, type: 'repo_deleted', detail: `Repository ${id} no longer exists.` });
        console.log(`    ISSUE: Repository not found`);
        continue;
      }

      if (info.archived) {
        issues.push({ sourceId: id, type: 'repo_archived', detail: `Repository ${id} has been archived.` });
        console.log(`    ISSUE: Repository archived`);
        continue;
      }

      // License change
      const oldLicense = source.license as string | null;
      if (oldLicense && info.license && oldLicense !== info.license) {
        issues.push({
          sourceId: id,
          type: 'license_changed',
          detail: `License changed from ${oldLicense} to ${info.license}.`,
        });
        console.log(`    ISSUE: License changed (${oldLicense} → ${info.license})`);
      }

      // Staleness: no push in 6 months
      const pushedAt = new Date(info.pushedAt);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      if (pushedAt < sixMonthsAgo) {
        issues.push({
          sourceId: id,
          type: 'stale',
          detail: `No commits since ${info.pushedAt}. Last activity ${Math.round((Date.now() - pushedAt.getTime()) / (1000 * 60 * 60 * 24))} days ago.`,
        });
        console.log(`    WARN: Stale (last push ${info.pushedAt})`);
      }

      // Check for upstream updates (new commits since last check)
      const lastSha = source.last_commit_sha as string | null;
      if (lastSha) {
        const latestSha = await github.getLatestCommitSha(owner, repo, info.defaultBranch);
        if (latestSha && latestSha !== lastSha) {
          issues.push({
            sourceId: id,
            type: 'source_updated',
            detail: `New commits detected. Old: ${lastSha.slice(0, 8)}, New: ${latestSha.slice(0, 8)}.`,
          });
          console.log(`    INFO: Upstream updated`);
        }
      }

      console.log(`    OK`);
    } catch (err) {
      console.error(`    ERROR: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Summary
  console.log(`\n=== Health Check Complete ===`);
  console.log(`  Sources checked: ${sources.length}`);
  console.log(`  Issues found: ${issues.length}`);

  if (issues.length > 0) {
    console.log('\n  Issues:');
    for (const issue of issues) {
      console.log(`    [${issue.type}] ${issue.sourceId}: ${issue.detail}`);
    }

    // In a future phase, create GitHub Issues for critical problems
    const critical = issues.filter(i => i.type === 'repo_deleted' || i.type === 'license_changed');
    if (critical.length > 0) {
      console.log(`\n  ${critical.length} critical issue(s) require attention.`);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

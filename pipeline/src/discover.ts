/**
 * Discovery orchestrator — entry point for the GitHub Action.
 *
 * Usage:
 *   node pipeline/discover.js --channel=all
 *   node pipeline/discover.js --channel=watchlist
 */

import crypto from 'node:crypto';
import { discoverFromWatchlist } from './channels/watchlist.js';
import { discoverFromGitHubSearch } from './channels/github-search.js';
import { discoverFromAwesomeLists } from './channels/awesome-list.js';
import * as db from './db/client.js';

async function main() {
  const channel = process.argv.find(a => a.startsWith('--channel='))?.split('=')[1] || 'all';
  console.log(`\n=== Discovery Run: channel=${channel} ===\n`);

  const runId = crypto.randomUUID();
  await db.insertDiscoveryRun({ id: runId, channel });

  let totalFound = 0;
  let totalNew = 0;
  let totalDupes = 0;
  const allErrors: string[] = [];

  try {
    // Channel A: Watchlist
    if (channel === 'all' || channel === 'watchlist') {
      console.log('--- Channel A: Watchlist ---');
      const result = await discoverFromWatchlist();
      totalFound += result.found;
      totalNew += result.newCandidates;
      totalDupes += result.duplicates;
      allErrors.push(...result.errors);
      console.log(`  Found: ${result.found}, New: ${result.newCandidates}, Dupes: ${result.duplicates}\n`);
    }

    // Channel B: GitHub Search
    if (channel === 'all' || channel === 'search') {
      console.log('--- Channel B: GitHub Search ---');
      const result = await discoverFromGitHubSearch();
      totalFound += result.found;
      totalNew += result.newCandidates;
      totalDupes += result.duplicates;
      allErrors.push(...result.errors);
      console.log(`  Found: ${result.found}, New: ${result.newCandidates}, Dupes: ${result.duplicates}\n`);
    }

    // Channel C: Awesome-Lists
    if (channel === 'all' || channel === 'awesome-lists') {
      console.log('--- Channel C: Awesome-Lists ---');
      const result = await discoverFromAwesomeLists();
      totalFound += result.found;
      totalNew += result.newCandidates;
      totalDupes += result.duplicates;
      allErrors.push(...result.errors);
      console.log(`  Found: ${result.found}, New: ${result.newCandidates}, Dupes: ${result.duplicates}\n`);
    }

    // Complete the run
    await db.completeDiscoveryRun(runId, {
      candidatesFound: totalFound,
      newCandidates: totalNew,
      duplicatesSkipped: totalDupes,
      errors: allErrors.length > 0 ? allErrors : undefined,
      status: 'completed',
    });

    console.log(`=== Discovery Complete ===`);
    console.log(`  Total found: ${totalFound}`);
    console.log(`  New candidates: ${totalNew}`);
    console.log(`  Duplicates skipped: ${totalDupes}`);
    if (allErrors.length > 0) {
      console.log(`  Errors: ${allErrors.length}`);
      allErrors.forEach(e => console.log(`    - ${e}`));
    }
  } catch (err) {
    await db.completeDiscoveryRun(runId, {
      candidatesFound: totalFound,
      newCandidates: totalNew,
      duplicatesSkipped: totalDupes,
      errors: [err instanceof Error ? err.message : String(err)],
      status: 'failed',
    });
    throw err;
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

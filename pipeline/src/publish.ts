/**
 * Publication orchestrator — creates a GitHub PR with translated skills.
 *
 * Usage:
 *   node pipeline/publish.js
 */

import { createPublicationPR } from './publication/pr-creator.js';

async function main() {
  console.log('\n=== Publication Run ===\n');

  const result = await createPublicationPR();

  if (!result) {
    console.log('Nothing to publish.');
    return;
  }

  console.log(`\n=== Publication Complete ===`);
  console.log(`  PR: ${result.prUrl}`);
  console.log(`  Files: ${result.filesAdded}`);
  console.log(`  Skills: ${result.skillsAdded}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

/**
 * Translation orchestrator — translates approved candidates.
 *
 * Usage:
 *   node pipeline/translate.js
 */

import { translateAllApproved } from './translation/translator.js';

async function main() {
  console.log('\n=== Translation Run ===\n');

  const result = await translateAllApproved();

  console.log(`\n=== Translation Complete ===`);
  console.log(`  Translated: ${result.translated}`);
  console.log(`  Errors: ${result.errors}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

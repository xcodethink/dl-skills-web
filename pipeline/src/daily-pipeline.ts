/**
 * Daily Pipeline Orchestrator — runs the full chain end-to-end.
 *
 * discover → analyze → refine → translate → publish
 *
 * This is the entry point for the daily GitHub Action.
 * Each stage is independent and handles its own errors gracefully.
 * If one stage has nothing to do, it simply reports and moves on.
 *
 * Usage:
 *   npx tsx src/daily-pipeline.ts
 *   npx tsx src/daily-pipeline.ts --skip-discover   # Skip discovery (e.g., after manual import)
 *   npx tsx src/daily-pipeline.ts --skip-publish     # Dry run without creating PR
 */

import { execSync } from 'node:child_process';

interface StageResult {
  name: string;
  success: boolean;
  duration: number;
  summary: string;
}

async function runStage(name: string, command: string): Promise<StageResult> {
  const start = Date.now();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  STAGE: ${name}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    execSync(command, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: process.env,
      timeout: 10 * 60 * 1000, // 10 minutes per stage
    });

    const duration = Math.round((Date.now() - start) / 1000);
    return { name, success: true, duration, summary: `Completed in ${duration}s` };
  } catch (err) {
    const duration = Math.round((Date.now() - start) / 1000);
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\n  [!] Stage "${name}" failed after ${duration}s: ${message}\n`);
    return { name, success: false, duration, summary: `Failed: ${message.slice(0, 100)}` };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const skipDiscover = args.includes('--skip-discover');
  const skipPublish = args.includes('--skip-publish');
  const channel = args.find(a => a.startsWith('--channel='))?.split('=')[1] || 'all';

  console.log(`\n${'#'.repeat(60)}`);
  console.log(`  DL Skills — Daily Pipeline`);
  console.log(`  ${new Date().toISOString()}`);
  console.log(`  Channel: ${channel}`);
  console.log(`  Skip discover: ${skipDiscover}`);
  console.log(`  Skip publish: ${skipPublish}`);
  console.log(`${'#'.repeat(60)}`);

  const results: StageResult[] = [];

  // Stage 1: Discover — fetch new skills from GitHub
  if (!skipDiscover) {
    results.push(await runStage(
      '1. Discover',
      `npx tsx src/discover.ts --channel=${channel}`
    ));
  } else {
    console.log('\n  [Skip] Discovery stage skipped.\n');
  }

  // Stage 2: Analyze — AI-powered 9-dimension quality scoring
  results.push(await runStage(
    '2. Analyze',
    'npx tsx src/analyze.ts'
  ));

  // Stage 3: Refine — fragment extraction + existing content optimization
  results.push(await runStage(
    '3. Refine',
    'npx tsx src/refine.ts'
  ));

  // Stage 4: Translate — bilingual professional translation
  results.push(await runStage(
    '4. Translate',
    'npx tsx src/translate.ts'
  ));

  // Stage 5: Publish — create PR with new/updated content
  if (!skipPublish) {
    results.push(await runStage(
      '5. Publish',
      'npx tsx src/publish.ts'
    ));
  } else {
    console.log('\n  [Skip] Publication stage skipped.\n');
  }

  // Summary
  console.log(`\n${'#'.repeat(60)}`);
  console.log(`  DAILY PIPELINE SUMMARY`);
  console.log(`${'#'.repeat(60)}\n`);

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const allSucceeded = results.every(r => r.success);

  for (const r of results) {
    const icon = r.success ? '✓' : '✗';
    console.log(`  ${icon} ${r.name}: ${r.summary}`);
  }

  console.log(`\n  Total duration: ${totalDuration}s`);
  console.log(`  Status: ${allSucceeded ? 'ALL STAGES PASSED' : 'SOME STAGES FAILED'}`);
  console.log('');

  if (!allSucceeded) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

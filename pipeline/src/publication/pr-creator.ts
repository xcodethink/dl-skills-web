/**
 * Publication — pushes translated skills directly to main branch.
 *
 * v2: Full auto mode — no PR, no manual merge needed.
 * Pipeline quality scoring is the gatekeeper. Content that reaches
 * this stage has already passed 9-dimension AI analysis.
 *
 * Flow: push files to main → auto-triggers deploy workflow → site updates
 */

import * as github from '../utils/github-api.js';
import * as db from '../db/client.js';
import { generatePublicationPackage } from './file-generator.js';
import type { PublicationPackage } from './file-generator.js';

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'xcodethink';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'claudecodeSkills';

/**
 * Push translated skills directly to main branch.
 * This triggers the deploy workflow automatically.
 */
export async function createPublicationPR(): Promise<{
  prNumber: number;
  prUrl: string;
  filesAdded: number;
  skillsAdded: number;
} | null> {
  const pkg = await generatePublicationPackage();

  if (pkg.files.length === 0) {
    console.log('No translated candidates ready for publication.');
    return null;
  }

  console.log(`Publishing ${pkg.files.length} files (${pkg.candidateIds.length} skills) directly to main...`);

  // Push each file directly to main branch
  let pushed = 0;
  for (const file of pkg.files) {
    const ok = await github.createOrUpdateFile(
      REPO_OWNER, REPO_NAME, file.path, file.content,
      `[auto] Add skill: ${file.path.split('/').pop()}`, 'main'
    );
    if (!ok) {
      console.warn(`  Warning: failed to push ${file.path}`);
    } else {
      pushed++;
      console.log(`  Pushed: ${file.path}`);
    }
  }

  if (pushed === 0) {
    console.log('No files were pushed successfully.');
    return null;
  }

  // Update candidate statuses in D1
  const date = new Date().toISOString().slice(0, 10);
  for (const id of pkg.candidateIds) {
    await db.execute(
      `UPDATE candidates SET
         status = 'published', published_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ?`,
      [id]
    );
  }

  const summary = buildPublishSummary(pkg);
  console.log(summary);

  console.log(`\nPublished ${pkg.candidateIds.length} skills directly to main.`);
  console.log(`Deploy workflow will auto-trigger → site updates in ~2 minutes.`);

  return {
    prNumber: 0,  // No PR in auto mode
    prUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/commits/main`,
    filesAdded: pushed,
    skillsAdded: pkg.candidateIds.length,
  };
}

function buildPublishSummary(pkg: PublicationPackage): string {
  const lines = ['\n--- Publication Summary ---'];
  for (const r of pkg.registryEntries) {
    const entry = r.entry as Record<string, any>;
    const platforms = (entry.compatibleWith || ['claude-code']).join(', ');
    lines.push(`  ${r.key} | ${entry.unifiedCategory} | ${entry.type} | ${platforms}`);
  }
  return lines.join('\n');
}

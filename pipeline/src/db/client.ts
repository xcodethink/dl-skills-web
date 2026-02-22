/**
 * Cloudflare D1 REST API client for use from GitHub Actions.
 * Uses the Cloudflare API to execute SQL queries against D1.
 */

const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

interface D1Config {
  accountId: string;
  databaseId: string;
  apiToken: string;
}

interface D1Result {
  results: Record<string, unknown>[];
  success: boolean;
  meta: { changes: number; last_row_id: number; rows_read: number; rows_written: number };
}

function getConfig(): D1Config {
  const accountId = process.env.CF_ACCOUNT_ID;
  const databaseId = process.env.D1_DATABASE_ID;
  const apiToken = process.env.CF_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error('Missing required env vars: CF_ACCOUNT_ID, D1_DATABASE_ID, CF_API_TOKEN');
  }

  return { accountId, databaseId, apiToken };
}

export async function query(sql: string, params: unknown[] = []): Promise<D1Result[]> {
  const config = getConfig();
  const url = `${CF_API_BASE}/accounts/${config.accountId}/d1/database/${config.databaseId}/query`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`D1 query failed (${res.status}): ${body}`);
  }

  const data = await res.json() as { result: D1Result[]; success: boolean; errors: unknown[] };
  if (!data.success) {
    throw new Error(`D1 query error: ${JSON.stringify(data.errors)}`);
  }

  return data.result;
}

export async function execute(sql: string, params: unknown[] = []): Promise<D1Result> {
  const results = await query(sql, params);
  return results[0];
}

// --- Convenience methods ---

export async function insertCandidate(candidate: {
  id: string;
  sourceId: string;
  sourcePath: string;
  sourceCommitSha?: string;
  contentHash: string;
  rawMarkdown: string;
  rawTokenCount: number;
  format: string;
}): Promise<void> {
  await execute(
    `INSERT INTO candidates (id, source_id, source_path, source_commit_sha, content_hash, raw_markdown, raw_token_count, format)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO NOTHING`,
    [candidate.id, candidate.sourceId, candidate.sourcePath, candidate.sourceCommitSha || null,
     candidate.contentHash, candidate.rawMarkdown, candidate.rawTokenCount, candidate.format]
  );
}

export async function checkDuplicateHash(hash: string): Promise<boolean> {
  const result = await execute(
    'SELECT 1 FROM candidates WHERE content_hash = ? LIMIT 1',
    [hash]
  );
  return result.results.length > 0;
}

export async function updateCandidateAnalysis(id: string, analysis: {
  analysisJson: string;
  scoreRelevance: number;
  scoreStructure: number;
  scoreActionability: number;
  scoreUniqueness: number;
  scoreCompleteness: number;
  scoreWeighted: number;
  aiRecommendation: string;
  suggestedCategory: string;
  suggestedTags: string;
  suggestedType: string;
  suggestedDifficulty: string;
  duplicateOf: string | null;
  summaryEn: string;
  summaryCn: string;
  status: string;
}): Promise<void> {
  await execute(
    `UPDATE candidates SET
       analysis_json = ?, score_relevance = ?, score_structure = ?, score_actionability = ?,
       score_uniqueness = ?, score_completeness = ?, score_weighted = ?,
       ai_recommendation = ?, suggested_category = ?, suggested_tags = ?,
       suggested_type = ?, suggested_difficulty = ?, duplicate_of = ?,
       summary_en = ?, summary_cn = ?, status = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [analysis.analysisJson, analysis.scoreRelevance, analysis.scoreStructure, analysis.scoreActionability,
     analysis.scoreUniqueness, analysis.scoreCompleteness, analysis.scoreWeighted,
     analysis.aiRecommendation, analysis.suggestedCategory, analysis.suggestedTags,
     analysis.suggestedType, analysis.suggestedDifficulty, analysis.duplicateOf,
     analysis.summaryEn, analysis.summaryCn, analysis.status, id]
  );
}

export async function getSource(id: string): Promise<Record<string, unknown> | null> {
  const result = await execute('SELECT * FROM sources WHERE id = ?', [id]);
  return result.results[0] || null;
}

export async function upsertSource(source: {
  id: string;
  url: string;
  skillPattern?: string;
  status?: string;
  discoveredVia?: string;
}): Promise<void> {
  await execute(
    `INSERT INTO sources (id, url, skill_pattern, status, discovered_via)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       url = excluded.url,
       skill_pattern = COALESCE(excluded.skill_pattern, sources.skill_pattern),
       updated_at = datetime('now')`,
    [source.id, source.url, source.skillPattern || null, source.status || 'pending', source.discoveredVia || 'watchlist']
  );
}

export async function updateSourceChecked(id: string, commitSha: string): Promise<void> {
  await execute(
    `UPDATE sources SET last_checked_at = datetime('now'), last_commit_sha = ?, updated_at = datetime('now') WHERE id = ?`,
    [commitSha, id]
  );
}

export async function insertDiscoveryRun(run: {
  id: string;
  channel: string;
}): Promise<void> {
  await execute(
    'INSERT INTO discovery_runs (id, channel) VALUES (?, ?)',
    [run.id, run.channel]
  );
}

export async function completeDiscoveryRun(id: string, stats: {
  candidatesFound: number;
  newCandidates: number;
  duplicatesSkipped: number;
  errors?: string[];
  status: 'completed' | 'failed';
}): Promise<void> {
  await execute(
    `UPDATE discovery_runs SET
       completed_at = datetime('now'), candidates_found = ?, new_candidates = ?,
       duplicates_skipped = ?, errors = ?, status = ?
     WHERE id = ?`,
    [stats.candidatesFound, stats.newCandidates, stats.duplicatesSkipped,
     stats.errors ? JSON.stringify(stats.errors) : null, stats.status, id]
  );
}

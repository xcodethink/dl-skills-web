/**
 * GET /api/pipeline/stats — Dashboard statistics.
 */

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;

  const [candidates, sources, recentRuns] = await Promise.all([
    db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending_analysis' THEN 1 ELSE 0 END) as pending_analysis,
        SUM(CASE WHEN status = 'pending_review' THEN 1 ELSE 0 END) as pending_review,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'auto_rejected' THEN 1 ELSE 0 END) as auto_rejected,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        AVG(score_weighted) as avg_score
      FROM candidates
    `).first(),

    db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM sources
    `).first(),

    db.prepare(`
      SELECT id, channel, started_at, completed_at, candidates_found, new_candidates, status
      FROM discovery_runs
      ORDER BY started_at DESC
      LIMIT 5
    `).all(),
  ]);

  return new Response(JSON.stringify({
    candidates,
    sources,
    recentRuns: recentRuns.results,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

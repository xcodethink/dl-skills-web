/**
 * GET /api/pipeline/stats — Dashboard statistics + analytics.
 *
 * Returns: candidates counts, sources counts, recent runs,
 *          funnel, category distribution, score distribution, top sources.
 */

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;

  const [candidates, sources, recentRuns, categoryDist, scoreDist, topSources, funnel] = await Promise.all([
    // Existing: candidate counts
    db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending_analysis' THEN 1 ELSE 0 END) as pending_analysis,
        SUM(CASE WHEN status = 'pending_review' THEN 1 ELSE 0 END) as pending_review,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'auto_rejected' THEN 1 ELSE 0 END) as auto_rejected,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'translating' THEN 1 ELSE 0 END) as translating,
        SUM(CASE WHEN status = 'translated' THEN 1 ELSE 0 END) as translated,
        AVG(score_weighted) as avg_score
      FROM candidates
    `).first(),

    // Existing: source counts
    db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM sources
    `).first(),

    // Existing: recent runs
    db.prepare(`
      SELECT id, channel, started_at, completed_at, candidates_found, new_candidates, status
      FROM discovery_runs
      ORDER BY started_at DESC
      LIMIT 10
    `).all(),

    // New: category distribution
    db.prepare(`
      SELECT COALESCE(override_category, suggested_category, 'uncategorized') as category,
             COUNT(*) as count
      FROM candidates
      WHERE status NOT IN ('auto_rejected', 'rejected')
      GROUP BY category
      ORDER BY count DESC
    `).all(),

    // New: score distribution (low < 5, medium 5-7, high >= 7)
    db.prepare(`
      SELECT
        SUM(CASE WHEN score_weighted < 5 THEN 1 ELSE 0 END) as low,
        SUM(CASE WHEN score_weighted >= 5 AND score_weighted < 7 THEN 1 ELSE 0 END) as medium,
        SUM(CASE WHEN score_weighted >= 7 THEN 1 ELSE 0 END) as high
      FROM candidates
      WHERE score_weighted IS NOT NULL
    `).first(),

    // New: top 5 sources by candidate count
    db.prepare(`
      SELECT source_id, COUNT(*) as count,
             SUM(CASE WHEN status IN ('approved', 'translating', 'translated', 'publishing', 'published') THEN 1 ELSE 0 END) as approved_count,
             AVG(score_weighted) as avg_score
      FROM candidates
      GROUP BY source_id
      ORDER BY count DESC
      LIMIT 5
    `).all(),

    // New: pipeline funnel (cumulative lifecycle counts)
    db.prepare(`
      SELECT
        COUNT(*) as discovered,
        SUM(CASE WHEN status NOT IN ('pending_analysis') THEN 1 ELSE 0 END) as analyzed,
        SUM(CASE WHEN status NOT IN ('pending_analysis', 'auto_rejected') THEN 1 ELSE 0 END) as reviewed,
        SUM(CASE WHEN status IN ('approved', 'translating', 'translated', 'publishing', 'published') THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status IN ('translated', 'publishing', 'published') THEN 1 ELSE 0 END) as translated,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published
      FROM candidates
    `).first(),
  ]);

  return new Response(JSON.stringify({
    candidates,
    sources,
    recentRuns: recentRuns.results,
    categoryDistribution: categoryDist.results,
    scoreDistribution: scoreDist,
    topSources: topSources.results,
    funnel,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

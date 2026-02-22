/**
 * GET /api/pipeline/runs — Paginated pipeline run history.
 * Query params: channel, page, limit
 */

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const channel = url.searchParams.get('channel');
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (channel) {
    conditions.push('channel = ?');
    params.push(channel);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countResult, rows] = await Promise.all([
    context.env.DB.prepare(`SELECT COUNT(*) as total FROM discovery_runs ${where}`).bind(...params).first(),
    context.env.DB.prepare(`
      SELECT id, channel, started_at, completed_at, candidates_found,
             new_candidates, duplicates_skipped, errors, status
      FROM discovery_runs ${where}
      ORDER BY started_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all(),
  ]);

  return new Response(JSON.stringify({
    data: rows.results,
    total: (countResult as any)?.total || 0,
    page,
    limit,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

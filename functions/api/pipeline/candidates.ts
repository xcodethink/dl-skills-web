/**
 * GET  /api/pipeline/candidates — List candidates with filtering, sorting, pagination.
 * Query params: status, source, sort, order, page, limit
 */

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const status = url.searchParams.get('status');
  const source = url.searchParams.get('source');
  const sort = url.searchParams.get('sort') || 'created_at';
  const order = url.searchParams.get('order') === 'asc' ? 'ASC' : 'DESC';
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
  const offset = (page - 1) * limit;

  // Validate sort column (whitelist to prevent SQL injection)
  const validSorts = ['created_at', 'score_weighted', 'source_id', 'status', 'ai_recommendation'];
  const sortCol = validSorts.includes(sort) ? sort : 'created_at';

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (source) {
    conditions.push('source_id = ?');
    params.push(source);
  }

  const search = url.searchParams.get('search');
  if (search) {
    const term = `%${search}%`;
    conditions.push('(source_id LIKE ? OR source_path LIKE ? OR summary_en LIKE ? OR summary_cn LIKE ?)');
    params.push(term, term, term, term);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countResult, rows] = await Promise.all([
    context.env.DB.prepare(`SELECT COUNT(*) as total FROM candidates ${where}`).bind(...params).first(),
    context.env.DB.prepare(`
      SELECT id, source_id, source_path, format, score_weighted, ai_recommendation,
             suggested_category, suggested_tags, suggested_type, suggested_difficulty,
             summary_en, summary_cn, duplicate_of, status, created_at, updated_at,
             override_category, override_tags, override_name_cn, override_name_en
      FROM candidates ${where}
      ORDER BY ${sortCol} ${order}
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

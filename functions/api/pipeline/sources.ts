/**
 * GET  /api/pipeline/sources — List all tracked sources.
 * POST /api/pipeline/sources — Add a new source.
 */

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const rows = await context.env.DB.prepare(
    `SELECT s.*, COUNT(c.id) as candidate_count
     FROM sources s
     LEFT JOIN candidates c ON c.source_id = s.id
     GROUP BY s.id
     ORDER BY s.created_at DESC`
  ).all();

  return new Response(JSON.stringify({ data: rows.results }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json<{
    id: string;
    url: string;
    skill_pattern?: string;
    notes?: string;
  }>().catch(() => null);

  if (!body?.id || !body?.url) {
    return new Response(JSON.stringify({ error: 'id and url are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await context.env.DB.prepare(
    `INSERT INTO sources (id, url, skill_pattern, status, discovered_via, notes)
     VALUES (?, ?, ?, 'pending', 'manual', ?)
     ON CONFLICT(id) DO UPDATE SET
       url = excluded.url,
       skill_pattern = COALESCE(excluded.skill_pattern, sources.skill_pattern),
       notes = COALESCE(excluded.notes, sources.notes),
       updated_at = datetime('now')`
  ).bind(body.id, body.url, body.skill_pattern || null, body.notes || null).run();

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};

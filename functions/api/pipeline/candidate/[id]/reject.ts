/**
 * POST /api/pipeline/candidate/:id/reject — Reject a candidate.
 */

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;
  const body = await context.request.json<{ reason?: string }>().catch(() => ({}));

  const candidate = await context.env.DB.prepare(
    "SELECT id, status FROM candidates WHERE id = ?"
  ).bind(id).first<{ id: string; status: string }>();

  if (!candidate) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (['published', 'rejected'].includes(candidate.status)) {
    return new Response(JSON.stringify({ error: `cannot reject candidate in status: ${candidate.status}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await context.env.DB.prepare(
    `UPDATE candidates SET status = 'rejected', reviewed_by = 'admin', reviewed_at = datetime('now'),
     review_notes = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(body.reason || null, id).run();

  return new Response(JSON.stringify({ ok: true, status: 'rejected' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

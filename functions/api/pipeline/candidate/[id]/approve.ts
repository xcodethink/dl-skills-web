/**
 * POST /api/pipeline/candidate/:id/approve — Approve a candidate for translation & publication.
 */

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;

  // Verify candidate exists and is in reviewable state
  const candidate = await context.env.DB.prepare(
    "SELECT id, status FROM candidates WHERE id = ?"
  ).bind(id).first<{ id: string; status: string }>();

  if (!candidate) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!['pending_review', 'analyzed'].includes(candidate.status)) {
    return new Response(JSON.stringify({ error: `cannot approve candidate in status: ${candidate.status}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await context.env.DB.prepare(
    `UPDATE candidates SET status = 'approved', reviewed_by = 'admin', reviewed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`
  ).bind(id).run();

  return new Response(JSON.stringify({ ok: true, status: 'approved' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

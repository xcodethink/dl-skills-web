/**
 * GET   /api/pipeline/candidate/:id — Full candidate detail.
 * PATCH /api/pipeline/candidate/:id — Update candidate fields (admin overrides).
 */

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;

  const row = await context.env.DB.prepare('SELECT * FROM candidates WHERE id = ?')
    .bind(id).first();

  if (!row) {
    return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify(row), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;
  const body = await context.request.json<Record<string, unknown>>().catch(() => ({}));

  // Only allow updating specific override fields
  const allowedFields: Record<string, string> = {
    override_category: 'override_category',
    override_tags: 'override_tags',
    override_type: 'override_type',
    override_difficulty: 'override_difficulty',
    override_name_cn: 'override_name_cn',
    override_name_en: 'override_name_en',
    override_highlight_cn: 'override_highlight_cn',
    override_highlight_en: 'override_highlight_en',
    review_notes: 'review_notes',
  };

  const updates: string[] = [];
  const values: unknown[] = [];

  for (const [key, col] of Object.entries(allowedFields)) {
    if (key in body) {
      updates.push(`${col} = ?`);
      values.push(body[key]);
    }
  }

  if (updates.length === 0) {
    return new Response(JSON.stringify({ error: 'no valid fields to update' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updates.push("updated_at = datetime('now')");
  values.push(id);

  await context.env.DB.prepare(
    `UPDATE candidates SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...values).run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

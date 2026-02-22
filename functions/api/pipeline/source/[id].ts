/**
 * PATCH /api/pipeline/source/:id — Update a source.
 * Allowed fields: skill_pattern, status, notes
 */

interface Env {
  DB: D1Database;
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;
  const body = await context.request.json<Record<string, unknown>>().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: 'Invalid body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const allowed = ['skill_pattern', 'status', 'notes'];
  const sets: string[] = [];
  const params: unknown[] = [];

  for (const key of allowed) {
    if (key in body) {
      sets.push(`${key} = ?`);
      params.push(body[key]);
    }
  }

  if (sets.length === 0) {
    return new Response(JSON.stringify({ error: 'No valid fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  sets.push("updated_at = datetime('now')");
  params.push(id);

  await context.env.DB.prepare(
    `UPDATE sources SET ${sets.join(', ')} WHERE id = ?`
  ).bind(...params).run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

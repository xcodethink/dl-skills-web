/**
 * POST /api/pipeline/auth — Validate admin token.
 * Returns 200 with session info on success, 403 on failure.
 */

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json<{ token: string }>().catch(() => ({ token: '' }));

  if (!body.token || body.token !== context.env.ADMIN_TOKEN) {
    const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';

    // Record failed attempt (rate limiting handled by middleware)
    try {
      const result = await context.env.DB.prepare(
        `SELECT attempts FROM rate_limits WHERE ip = ? AND endpoint = 'admin'`
      ).bind(ip).first<{ attempts: number }>();

      const attempts = (result?.attempts || 0) + 1;
      const lockedUntil = attempts >= 5
        ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
        : null;

      await context.env.DB.prepare(
        `INSERT INTO rate_limits (ip, endpoint, attempts, locked_until, last_attempt_at)
         VALUES (?, 'admin', ?, ?, datetime('now'))
         ON CONFLICT(ip, endpoint) DO UPDATE SET
           attempts = ?, locked_until = ?, last_attempt_at = datetime('now')`
      ).bind(ip, attempts, lockedUntil, attempts, lockedUntil).run();
    } catch { /* ignore */ }

    return new Response(JSON.stringify({ error: 'forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

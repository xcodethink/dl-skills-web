/**
 * Cloudflare Pages Functions middleware.
 *
 * - Validates Bearer token on /api/pipeline/* routes
 * - Rate limits by IP (5 failures → 15 min lockout)
 * - Returns generic 403 for all auth failures (no info leakage)
 */

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  ALLOWED_IPS?: string;
}

const FORBIDDEN = () => new Response(JSON.stringify({ error: 'forbidden' }), {
  status: 403,
  headers: { 'Content-Type': 'application/json' },
});

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  // Only protect /api/pipeline/* routes
  if (!url.pathname.startsWith('/api/pipeline/')) {
    return context.next();
  }

  // Allow CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';

  // IP whitelist check (optional)
  if (context.env.ALLOWED_IPS) {
    const allowed = context.env.ALLOWED_IPS.split(',').map(s => s.trim());
    if (!allowed.includes(ip)) {
      return FORBIDDEN();
    }
  }

  // Rate limit check
  const isLocked = await checkRateLimit(context.env.DB, ip);
  if (isLocked) {
    return FORBIDDEN();
  }

  // Auth endpoint is special — validates token and returns session info
  if (url.pathname === '/api/pipeline/auth') {
    return context.next();
  }

  // Bearer token validation for all other endpoints
  const authHeader = context.request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || token !== context.env.ADMIN_TOKEN) {
    await recordFailedAttempt(context.env.DB, ip);
    return FORBIDDEN();
  }

  // Token valid — continue
  const response = await context.next();

  // Add CORS headers
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    headers,
  });
};

async function checkRateLimit(db: D1Database, ip: string): Promise<boolean> {
  try {
    const result = await db.prepare(
      `SELECT attempts, locked_until FROM rate_limits WHERE ip = ? AND endpoint = 'admin'`
    ).bind(ip).first<{ attempts: number; locked_until: string | null }>();

    if (!result) return false;

    if (result.locked_until) {
      const lockExpiry = new Date(result.locked_until);
      if (lockExpiry > new Date()) return true;

      // Lock expired — reset
      await db.prepare(
        `DELETE FROM rate_limits WHERE ip = ? AND endpoint = 'admin'`
      ).bind(ip).run();
    }

    return false;
  } catch {
    return false; // DB errors should not block access
  }
}

async function recordFailedAttempt(db: D1Database, ip: string): Promise<void> {
  try {
    const result = await db.prepare(
      `SELECT attempts FROM rate_limits WHERE ip = ? AND endpoint = 'admin'`
    ).bind(ip).first<{ attempts: number }>();

    const attempts = (result?.attempts || 0) + 1;
    const lockedUntil = attempts >= 5
      ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
      : null;

    await db.prepare(
      `INSERT INTO rate_limits (ip, endpoint, attempts, locked_until, last_attempt_at)
       VALUES (?, 'admin', ?, ?, datetime('now'))
       ON CONFLICT(ip, endpoint) DO UPDATE SET
         attempts = ?, locked_until = ?, last_attempt_at = datetime('now')`
    ).bind(ip, attempts, lockedUntil, attempts, lockedUntil).run();
  } catch {
    // Fail open — don't block on DB errors
  }
}

/**
 * Cloudflare Worker entry point — handles API routes + serves static assets.
 *
 * Replaces the functions/ directory (Pages Functions) with a single Worker
 * that can bind D1, environment variables, etc.
 */

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_TOKEN: string;
  ALLOWED_IPS?: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

const FORBIDDEN = () => json({ error: 'forbidden' }, 403);

// ─── Router ──────────────────────────────────────────────────────────────

type Handler = (req: Request, env: Env, params: Record<string, string>) => Promise<Response>;

interface Route {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: Handler;
}

const routes: Route[] = [];

function addRoute(method: string, path: string, handler: Handler) {
  const paramNames: string[] = [];
  const pattern = path.replace(/:(\w+)/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  routes.push({ method, pattern: new RegExp(`^${pattern}$`), paramNames, handler });
}

function matchRoute(method: string, pathname: string): { handler: Handler; params: Record<string, string> } | null {
  for (const route of routes) {
    if (route.method !== method) continue;
    const match = pathname.match(route.pattern);
    if (match) {
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
      return { handler: route.handler, params };
    }
  }
  return null;
}

// ─── Middleware: Auth & Rate Limiting ─────────────────────────────────────

async function checkRateLimit(db: D1Database, ip: string): Promise<boolean> {
  try {
    const result = await db.prepare(
      `SELECT attempts, locked_until FROM rate_limits WHERE ip = ? AND endpoint = 'admin'`
    ).bind(ip).first<{ attempts: number; locked_until: string | null }>();
    if (!result) return false;
    if (result.locked_until) {
      if (new Date(result.locked_until) > new Date()) return true;
      await db.prepare(`DELETE FROM rate_limits WHERE ip = ? AND endpoint = 'admin'`).bind(ip).run();
    }
    return false;
  } catch {
    return false;
  }
}

async function recordFailedAttempt(db: D1Database, ip: string): Promise<void> {
  try {
    const result = await db.prepare(
      `SELECT attempts FROM rate_limits WHERE ip = ? AND endpoint = 'admin'`
    ).bind(ip).first<{ attempts: number }>();
    const attempts = (result?.attempts || 0) + 1;
    const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;
    await db.prepare(
      `INSERT INTO rate_limits (ip, endpoint, attempts, locked_until, last_attempt_at)
       VALUES (?, 'admin', ?, ?, datetime('now'))
       ON CONFLICT(ip, endpoint) DO UPDATE SET
         attempts = ?, locked_until = ?, last_attempt_at = datetime('now')`
    ).bind(ip, attempts, lockedUntil, attempts, lockedUntil).run();
  } catch { /* fail open */ }
}

async function authMiddleware(req: Request, env: Env): Promise<Response | null> {
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown';

  // IP whitelist
  if (env.ALLOWED_IPS) {
    const allowed = env.ALLOWED_IPS.split(',').map(s => s.trim());
    if (!allowed.includes(ip)) return FORBIDDEN();
  }

  // Rate limit
  if (await checkRateLimit(env.DB, ip)) return FORBIDDEN();

  // Bearer token
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || token !== env.ADMIN_TOKEN) {
    await recordFailedAttempt(env.DB, ip);
    return FORBIDDEN();
  }

  return null; // Auth passed
}

// ─── API Handlers ────────────────────────────────────────────────────────

// POST /api/pipeline/auth
const handleAuth: Handler = async (req, env) => {
  const body = await req.json<{ token: string }>().catch(() => ({ token: '' }));
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown';

  if (await checkRateLimit(env.DB, ip)) return FORBIDDEN();

  if (!body.token || body.token !== env.ADMIN_TOKEN) {
    await recordFailedAttempt(env.DB, ip);
    return FORBIDDEN();
  }
  return json({ ok: true });
};

// GET /api/pipeline/stats
const handleStats: Handler = async (_req, env) => {
  const [candidates, sources, recentRuns] = await Promise.all([
    env.DB.prepare(`
      SELECT COUNT(*) as total,
        SUM(CASE WHEN status = 'pending_analysis' THEN 1 ELSE 0 END) as pending_analysis,
        SUM(CASE WHEN status = 'pending_review' THEN 1 ELSE 0 END) as pending_review,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'auto_rejected' THEN 1 ELSE 0 END) as auto_rejected,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        AVG(score_weighted) as avg_score
      FROM candidates
    `).first(),
    env.DB.prepare(`
      SELECT COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM sources
    `).first(),
    env.DB.prepare(`
      SELECT id, channel, started_at, completed_at, candidates_found, new_candidates, status
      FROM discovery_runs ORDER BY started_at DESC LIMIT 5
    `).all(),
  ]);
  return json({ candidates, sources, recentRuns: recentRuns.results });
};

// GET /api/pipeline/candidates
const handleCandidates: Handler = async (req, env) => {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const source = url.searchParams.get('source');
  const sort = url.searchParams.get('sort') || 'created_at';
  const order = url.searchParams.get('order') === 'asc' ? 'ASC' : 'DESC';
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
  const offset = (page - 1) * limit;

  const validSorts = ['created_at', 'score_weighted', 'source_id', 'status', 'ai_recommendation'];
  const sortCol = validSorts.includes(sort) ? sort : 'created_at';

  const conditions: string[] = [];
  const params: unknown[] = [];
  if (status) { conditions.push('status = ?'); params.push(status); }
  if (source) { conditions.push('source_id = ?'); params.push(source); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countResult, rows] = await Promise.all([
    env.DB.prepare(`SELECT COUNT(*) as total FROM candidates ${where}`).bind(...params).first(),
    env.DB.prepare(`
      SELECT id, source_id, source_path, format, score_weighted, ai_recommendation,
             suggested_category, suggested_tags, suggested_type, suggested_difficulty,
             summary_en, summary_cn, duplicate_of, status, created_at, updated_at,
             override_category, override_tags, override_name_cn, override_name_en
      FROM candidates ${where}
      ORDER BY ${sortCol} ${order}
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all(),
  ]);

  return json({ data: rows.results, total: (countResult as any)?.total || 0, page, limit });
};

// GET /api/pipeline/candidate/:id
const handleCandidateGet: Handler = async (_req, env, params) => {
  const row = await env.DB.prepare('SELECT * FROM candidates WHERE id = ?').bind(params.id).first();
  if (!row) return json({ error: 'not found' }, 404);
  return json(row);
};

// PATCH /api/pipeline/candidate/:id
const handleCandidatePatch: Handler = async (req, env, params) => {
  const body = await req.json<Record<string, unknown>>().catch(() => ({}));
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
    if (key in body) { updates.push(`${col} = ?`); values.push(body[key]); }
  }
  if (updates.length === 0) return json({ error: 'no valid fields to update' }, 400);

  updates.push("updated_at = datetime('now')");
  values.push(params.id);
  await env.DB.prepare(`UPDATE candidates SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return json({ ok: true });
};

// POST /api/pipeline/candidate/:id/approve
const handleApprove: Handler = async (_req, env, params) => {
  const candidate = await env.DB.prepare(
    "SELECT id, status FROM candidates WHERE id = ?"
  ).bind(params.id).first<{ id: string; status: string }>();

  if (!candidate) return json({ error: 'not found' }, 404);
  if (!['pending_review', 'analyzed'].includes(candidate.status)) {
    return json({ error: `cannot approve candidate in status: ${candidate.status}` }, 400);
  }

  await env.DB.prepare(
    `UPDATE candidates SET status = 'approved', reviewed_by = 'admin', reviewed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`
  ).bind(params.id).run();
  return json({ ok: true, status: 'approved' });
};

// POST /api/pipeline/candidate/:id/reject
const handleReject: Handler = async (req, env, params) => {
  const body = await req.json<{ reason?: string }>().catch(() => ({}));
  const candidate = await env.DB.prepare(
    "SELECT id, status FROM candidates WHERE id = ?"
  ).bind(params.id).first<{ id: string; status: string }>();

  if (!candidate) return json({ error: 'not found' }, 404);
  if (['published', 'rejected'].includes(candidate.status)) {
    return json({ error: `cannot reject candidate in status: ${candidate.status}` }, 400);
  }

  await env.DB.prepare(
    `UPDATE candidates SET status = 'rejected', reviewed_by = 'admin', reviewed_at = datetime('now'),
     review_notes = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(body.reason || null, params.id).run();
  return json({ ok: true, status: 'rejected' });
};

// GET /api/pipeline/sources
const handleSourcesGet: Handler = async (_req, env) => {
  const rows = await env.DB.prepare(
    `SELECT s.*, COUNT(c.id) as candidate_count
     FROM sources s LEFT JOIN candidates c ON c.source_id = s.id
     GROUP BY s.id ORDER BY s.created_at DESC`
  ).all();
  return json({ data: rows.results });
};

// POST /api/pipeline/sources
const handleSourcesPost: Handler = async (req, env) => {
  const body = await req.json<{ id: string; url: string; skill_pattern?: string; notes?: string }>().catch(() => null);
  if (!body?.id || !body?.url) return json({ error: 'id and url are required' }, 400);

  await env.DB.prepare(
    `INSERT INTO sources (id, url, skill_pattern, status, discovered_via, notes)
     VALUES (?, ?, ?, 'pending', 'manual', ?)
     ON CONFLICT(id) DO UPDATE SET
       url = excluded.url,
       skill_pattern = COALESCE(excluded.skill_pattern, sources.skill_pattern),
       notes = COALESCE(excluded.notes, sources.notes),
       updated_at = datetime('now')`
  ).bind(body.id, body.url, body.skill_pattern || null, body.notes || null).run();
  return json({ ok: true }, 201);
};

// ─── Register routes ─────────────────────────────────────────────────────

addRoute('POST', '/api/pipeline/auth', handleAuth);
addRoute('GET', '/api/pipeline/stats', handleStats);
addRoute('GET', '/api/pipeline/candidates', handleCandidates);
addRoute('GET', '/api/pipeline/candidate/:id', handleCandidateGet);
addRoute('PATCH', '/api/pipeline/candidate/:id', handleCandidatePatch);
addRoute('POST', '/api/pipeline/candidate/:id/approve', handleApprove);
addRoute('POST', '/api/pipeline/candidate/:id/reject', handleReject);
addRoute('GET', '/api/pipeline/sources', handleSourcesGet);
addRoute('POST', '/api/pipeline/sources', handleSourcesPost);

// ─── Main fetch handler ─────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Non-API routes → serve static assets
    if (!url.pathname.startsWith('/api/pipeline/')) {
      return env.ASSETS.fetch(request);
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Route matching
    const match = matchRoute(request.method, url.pathname);
    if (!match) return json({ error: 'not found' }, 404);

    // Auth (skip for /auth endpoint itself)
    if (url.pathname !== '/api/pipeline/auth') {
      const authResult = await authMiddleware(request, env);
      if (authResult) return authResult;
    }

    // Handle request
    const response = await match.handler(request, env, match.params);

    // Add CORS headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    return new Response(response.body, { status: response.status, headers });
  },
} satisfies ExportedHandler<Env>;

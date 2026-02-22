/**
 * GET /api/pipeline/settings — System overview / configuration info.
 */

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;

  const [tableCounts, lastRuns] = await Promise.all([
    // Table row counts
    Promise.all([
      db.prepare('SELECT COUNT(*) as count FROM sources').first(),
      db.prepare('SELECT COUNT(*) as count FROM candidates').first(),
      db.prepare('SELECT COUNT(*) as count FROM discovery_runs').first(),
    ]),

    // Last run per channel
    db.prepare(`
      SELECT channel, started_at, status
      FROM discovery_runs
      WHERE id IN (
        SELECT id FROM discovery_runs d2
        WHERE d2.channel = discovery_runs.channel
        ORDER BY started_at DESC
        LIMIT 1
      )
      GROUP BY channel
      ORDER BY started_at DESC
    `).all(),
  ]);

  return new Response(JSON.stringify({
    tables: {
      sources: (tableCounts[0] as any)?.count || 0,
      candidates: (tableCounts[1] as any)?.count || 0,
      discovery_runs: (tableCounts[2] as any)?.count || 0,
    },
    lastRunByChannel: lastRuns.results,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

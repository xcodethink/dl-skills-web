/**
 * ConsoleApp — Admin panel for the skill curation pipeline.
 *
 * Single Preact island with hash-based routing:
 *   #login     → Login screen (default if not authenticated)
 *   #dash      → Dashboard with stats
 *   #queue     → Candidate review queue
 *   #detail/:id → Candidate detail + actions
 *   #sources   → Source repository management
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'preact/hooks';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Candidate {
  id: string;
  source_id: string;
  source_path: string;
  format: string;
  score_weighted: number | null;
  ai_recommendation: string | null;
  suggested_category: string | null;
  suggested_tags: string | null;
  suggested_type: string | null;
  suggested_difficulty: string | null;
  summary_en: string | null;
  summary_cn: string | null;
  duplicate_of: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  override_category: string | null;
  override_name_cn: string | null;
  override_name_en: string | null;
}

interface CandidateDetail extends Candidate {
  raw_markdown: string;
  raw_token_count: number | null;
  analysis_json: string | null;
  score_relevance: number | null;
  score_structure: number | null;
  score_actionability: number | null;
  score_uniqueness: number | null;
  score_completeness: number | null;
  review_notes: string | null;
  translated_cn: string | null;
  translated_en: string | null;
  override_tags: string | null;
  override_type: string | null;
  override_difficulty: string | null;
  override_highlight_cn: string | null;
  override_highlight_en: string | null;
}

interface Source {
  id: string;
  url: string;
  skill_pattern: string | null;
  status: string;
  last_checked_at: string | null;
  last_commit_sha: string | null;
  discovered_via: string | null;
  candidate_count: number;
  created_at: string;
}

interface Stats {
  candidates: {
    total: number;
    pending_analysis: number;
    pending_review: number;
    approved: number;
    auto_rejected: number;
    rejected: number;
    published: number;
    avg_score: number | null;
  };
  sources: { total: number; active: number; pending: number };
  recentRuns: Array<{
    id: string;
    channel: string;
    started_at: string;
    completed_at: string | null;
    candidates_found: number;
    new_candidates: number;
    status: string;
  }>;
}

type View = 'login' | 'dash' | 'queue' | 'detail' | 'sources';

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  apiBase: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const S = {
  card: 'bg-[#18181b] border border-[#27272a] rounded-lg p-5',
  input: 'w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-[#fafafa] placeholder-[#52525b] focus:outline-none focus:border-[#8B5CF6]',
  btn: 'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150',
  btnPrimary: 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white',
  btnSuccess: 'bg-[#10B981] hover:bg-[#059669] text-white',
  btnDanger: 'bg-[#EF4444] hover:bg-[#DC2626] text-white',
  btnGhost: 'border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46]',
  badge: 'inline-block px-2 py-0.5 rounded text-xs font-medium',
  th: 'text-left text-xs font-medium text-[#a1a1aa] uppercase tracking-wider px-4 py-3',
  td: 'px-4 py-3 text-sm',
  label: 'text-xs font-medium text-[#a1a1aa] uppercase tracking-wider mb-1',
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ConsoleApp({ apiBase }: Props) {
  const [token, setToken] = useState<string>(() => {
    try { return sessionStorage.getItem('_ct') || ''; } catch { return ''; }
  });
  const [view, setView] = useState<View>('login');
  const [detailId, setDetailId] = useState<string>('');

  // Route from hash
  useEffect(() => {
    function onHash() {
      const hash = location.hash.slice(1);
      if (!token) { setView('login'); return; }
      if (hash.startsWith('detail/')) {
        setView('detail');
        setDetailId(hash.slice(7));
      } else if (['dash', 'queue', 'sources'].includes(hash)) {
        setView(hash as View);
      } else {
        setView('dash');
      }
    }
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, [token]);

  const api = useCallback(async (path: string, opts?: RequestInit) => {
    const res = await fetch(`${apiBase}${path}`, {
      ...opts,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...opts?.headers,
      },
    });
    if (res.status === 403) {
      setToken('');
      sessionStorage.removeItem('_ct');
      setView('login');
      throw new Error('Unauthorized');
    }
    return res.json();
  }, [apiBase, token]);

  const onLogin = (t: string) => {
    setToken(t);
    sessionStorage.setItem('_ct', t);
    location.hash = '#dash';
  };

  if (view === 'login' || !token) {
    return <LoginView apiBase={apiBase} onLogin={onLogin} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f10' }}>
      <Nav view={view} onLogout={() => { setToken(''); sessionStorage.removeItem('_ct'); location.hash = '#login'; }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        {view === 'dash' && <DashView api={api} />}
        {view === 'queue' && <QueueView api={api} />}
        {view === 'detail' && <DetailView api={api} id={detailId} />}
        {view === 'sources' && <SourcesView api={api} />}
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ view, onLogout }: { view: View; onLogout: () => void }) {
  const links: Array<{ id: View; label: string; hash: string }> = [
    { id: 'dash', label: 'Dashboard', hash: '#dash' },
    { id: 'queue', label: 'Queue', hash: '#queue' },
    { id: 'sources', label: 'Sources', hash: '#sources' },
  ];

  return (
    <nav style={{ borderBottom: '1px solid #27272a', background: '#09090b', padding: '0 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 48, gap: 24 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#8B5CF6', letterSpacing: '-0.02em' }}>Pipeline</span>
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {links.map(l => (
            <a
              key={l.id}
              href={l.hash}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                color: view === l.id ? '#fafafa' : '#71717a',
                background: view === l.id ? '#27272a' : 'transparent',
                textDecoration: 'none',
                transition: 'all 150ms',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
        <button onClick={onLogout} style={{ fontSize: 12, color: '#52525b', background: 'none', border: 'none', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginView({ apiBase, onLogin }: { apiBase: string; onLogin: (token: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: Event) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiBase}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: value.trim() }),
      });

      if (res.ok) {
        onLogin(value.trim());
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={submit} style={{ width: 320 }}>
        <input
          type="password"
          value={value}
          onInput={(e: any) => setValue(e.target.value)}
          placeholder="Access token"
          autoFocus
          style={{
            width: '100%',
            background: '#09090b',
            border: '1px solid #27272a',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 14,
            color: '#fafafa',
            outline: 'none',
          }}
        />
        {error && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 8 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: 12,
            padding: '10px 0',
            background: '#8B5CF6',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '...' : 'Enter'}
        </button>
      </form>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function DashView({ api }: { api: (path: string, opts?: RequestInit) => Promise<any> }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api('/stats').then(setStats).catch(() => {});
  }, []);

  if (!stats) return <div style={{ color: '#52525b', padding: 40, textAlign: 'center' }}>Loading...</div>;

  const c = stats.candidates;
  const cards = [
    { label: 'Pending Review', value: c.pending_review, color: '#F59E0B' },
    { label: 'Pending Analysis', value: c.pending_analysis, color: '#3B82F6' },
    { label: 'Approved', value: c.approved, color: '#10B981' },
    { label: 'Published', value: c.published, color: '#8B5CF6' },
    { label: 'Rejected', value: (c.auto_rejected || 0) + (c.rejected || 0), color: '#EF4444' },
    { label: 'Total', value: c.total, color: '#a1a1aa' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Dashboard</h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
        {cards.map(card => (
          <div key={card.label} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.value || 0}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      {(c.pending_review > 0) && (
        <a href="#queue?status=pending_review" style={{
          display: 'inline-block', padding: '8px 16px', background: '#F59E0B', color: '#000',
          borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 24,
        }}>
          Review {c.pending_review} candidates
        </a>
      )}

      {/* Sources summary */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Sources</h2>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#a1a1aa' }}>
          <span>Total: <strong style={{ color: '#fafafa' }}>{stats.sources.total}</strong></span>
          <span>Active: <strong style={{ color: '#10B981' }}>{stats.sources.active}</strong></span>
          <span>Pending: <strong style={{ color: '#F59E0B' }}>{stats.sources.pending}</strong></span>
        </div>
      </div>

      {/* Recent discovery runs */}
      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Runs</h2>
        {stats.recentRuns.length === 0 ? (
          <div style={{ fontSize: 13, color: '#52525b' }}>No runs yet</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #27272a' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 11, color: '#71717a', textTransform: 'uppercase' }}>Channel</th>
                <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 11, color: '#71717a', textTransform: 'uppercase' }}>Date</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#71717a', textTransform: 'uppercase' }}>Found</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#71717a', textTransform: 'uppercase' }}>New</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 11, color: '#71717a', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentRuns.map(run => (
                <tr key={run.id} style={{ borderBottom: '1px solid #1e1e21' }}>
                  <td style={{ padding: '8px 0', fontSize: 13 }}>{run.channel}</td>
                  <td style={{ padding: '8px 0', fontSize: 13, color: '#a1a1aa' }}>{formatDate(run.started_at)}</td>
                  <td style={{ padding: '8px 0', fontSize: 13, textAlign: 'right' }}>{run.candidates_found}</td>
                  <td style={{ padding: '8px 0', fontSize: 13, textAlign: 'right', color: '#10B981' }}>{run.new_candidates}</td>
                  <td style={{ padding: '8px 0', fontSize: 13, textAlign: 'right' }}>
                    <StatusBadge status={run.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Queue ───────────────────────────────────────────────────────────────────

function QueueView({ api }: { api: (path: string, opts?: RequestInit) => Promise<any> }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [sort, setSort] = useState('score_weighted');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: statusFilter, sort, order, page: String(page), limit: '20' });
      const data = await api(`/candidates?${params}`);
      setCandidates(data.data || []);
      setTotal(data.total || 0);
    } catch { /* handled by api() */ }
    setLoading(false);
  }, [api, statusFilter, sort, order, page]);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === candidates.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(candidates.map(c => c.id)));
    }
  };

  const batchApprove = async () => {
    for (const id of selected) {
      await api(`/candidate/${id}/approve`, { method: 'POST' });
    }
    setSelected(new Set());
    load();
  };

  const batchReject = async () => {
    for (const id of selected) {
      await api(`/candidate/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason: 'Batch rejected' }) });
    }
    setSelected(new Set());
    load();
  };

  const statuses = ['pending_review', 'pending_analysis', 'approved', 'auto_rejected', 'rejected', 'published'];
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Review Queue</h1>
        <span style={{ fontSize: 13, color: '#71717a' }}>{total} candidates</span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: '1px solid',
              borderColor: statusFilter === s ? '#8B5CF6' : '#27272a',
              background: statusFilter === s ? 'rgba(139,92,246,0.1)' : 'transparent',
              color: statusFilter === s ? '#8B5CF6' : '#71717a',
              cursor: 'pointer',
            }}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Batch actions */}
      {selected.size > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#a1a1aa' }}>{selected.size} selected</span>
          <button onClick={batchApprove} style={{ ...btnStyle, background: '#10B981' }}>Approve All</button>
          <button onClick={batchReject} style={{ ...btnStyle, background: '#EF4444' }}>Reject All</button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ color: '#52525b', padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : candidates.length === 0 ? (
        <div style={{ color: '#52525b', padding: 40, textAlign: 'center' }}>No candidates found</div>
      ) : (
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #27272a' }}>
                <th style={{ padding: '10px 12px', width: 32 }}>
                  <input type="checkbox" checked={selected.size === candidates.length && candidates.length > 0} onChange={toggleAll} />
                </th>
                <th style={thStyle}>Source / Path</th>
                <th style={thStyle}>Summary</th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => { setSort('score_weighted'); setOrder(o => o === 'desc' ? 'asc' : 'desc'); }}>
                  Score {sort === 'score_weighted' ? (order === 'desc' ? '↓' : '↑') : ''}
                </th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>AI</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr
                  key={c.id}
                  style={{ borderBottom: '1px solid #1e1e21', cursor: 'pointer' }}
                  onClick={() => { location.hash = `#detail/${c.id}`; }}
                >
                  <td style={{ padding: '10px 12px' }} onClick={e => { e.stopPropagation(); toggleSelect(c.id); }}>
                    <input type="checkbox" checked={selected.has(c.id)} />
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>
                    <div style={{ fontWeight: 500, color: '#fafafa' }}>{c.source_id}</div>
                    <div style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>{c.source_path}</div>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#a1a1aa', maxWidth: 300 }}>
                    {c.summary_en || c.summary_cn || '—'}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 600, color: scoreColor(c.score_weighted) }}>
                    {c.score_weighted?.toFixed(1) || '—'}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#a1a1aa' }}>
                    {c.override_category || c.suggested_category || '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <RecommendBadge rec={c.ai_recommendation} />
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={btnStyle}>Prev</button>
          <span style={{ fontSize: 13, color: '#71717a', lineHeight: '32px' }}>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={btnStyle}>Next</button>
        </div>
      )}
    </div>
  );
}

// ─── Detail ──────────────────────────────────────────────────────────────────

function DetailView({ api, id }: { api: (path: string, opts?: RequestInit) => Promise<any>; id: string }) {
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [tab, setTab] = useState<'content' | 'analysis' | 'overrides'>('content');

  useEffect(() => {
    setLoading(true);
    api(`/candidate/${id}`).then(data => { setCandidate(data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const approve = async () => {
    setActionLoading(true);
    await api(`/candidate/${id}/approve`, { method: 'POST' });
    setCandidate(c => c ? { ...c, status: 'approved' } : c);
    setActionLoading(false);
  };

  const reject = async () => {
    const reason = prompt('Rejection reason (optional):');
    setActionLoading(true);
    await api(`/candidate/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) });
    setCandidate(c => c ? { ...c, status: 'rejected' } : c);
    setActionLoading(false);
  };

  const saveOverrides = async (overrides: Record<string, unknown>) => {
    await api(`/candidate/${id}`, { method: 'PATCH', body: JSON.stringify(overrides) });
    const data = await api(`/candidate/${id}`);
    setCandidate(data);
  };

  if (loading || !candidate) return <div style={{ color: '#52525b', padding: 40, textAlign: 'center' }}>Loading...</div>;

  const analysis = candidate.analysis_json ? JSON.parse(candidate.analysis_json) : null;
  const scores = [
    { label: 'Relevance', value: candidate.score_relevance, weight: '30%', rationale: analysis?.scores?.relevance?.rationale },
    { label: 'Structure', value: candidate.score_structure, weight: '25%', rationale: analysis?.scores?.structure?.rationale },
    { label: 'Actionability', value: candidate.score_actionability, weight: '20%', rationale: analysis?.scores?.actionability?.rationale },
    { label: 'Uniqueness', value: candidate.score_uniqueness, weight: '15%', rationale: analysis?.scores?.uniqueness?.rationale },
    { label: 'Completeness', value: candidate.score_completeness, weight: '10%', rationale: analysis?.scores?.completeness?.rationale },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <a href="#queue" style={{ color: '#71717a', fontSize: 13, textDecoration: 'none' }}>← Queue</a>
        <span style={{ color: '#27272a' }}>|</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{candidate.source_path}</span>
        <StatusBadge status={candidate.status} />
        {candidate.score_weighted != null && (
          <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor(candidate.score_weighted) }}>
            {candidate.score_weighted.toFixed(1)}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#71717a', marginBottom: 20 }}>
        <span>Source: <strong style={{ color: '#a1a1aa' }}>{candidate.source_id}</strong></span>
        <span>Format: {candidate.format}</span>
        <span>Tokens: ~{candidate.raw_token_count}</span>
        <span>Created: {formatDate(candidate.created_at)}</span>
      </div>

      {/* Actions */}
      {['pending_review', 'analyzed'].includes(candidate.status) && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={approve} disabled={actionLoading} style={{ ...btnStyle, background: '#10B981', color: 'white' }}>
            Approve
          </button>
          <button onClick={reject} disabled={actionLoading} style={{ ...btnStyle, background: '#EF4444', color: 'white' }}>
            Reject
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #27272a', paddingBottom: 1 }}>
        {(['content', 'analysis', 'overrides'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: 'transparent', border: 'none',
              borderBottom: tab === t ? '2px solid #8B5CF6' : '2px solid transparent',
              color: tab === t ? '#fafafa' : '#71717a',
            }}
          >
            {t === 'content' ? 'Content' : t === 'analysis' ? 'AI Analysis' : 'Overrides'}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {tab === 'content' && (
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {candidate.summary_en && <div style={{ fontSize: 13, color: '#a1a1aa' }}>EN: {candidate.summary_en}</div>}
            {candidate.summary_cn && <div style={{ fontSize: 13, color: '#a1a1aa' }}>CN: {candidate.summary_cn}</div>}
          </div>
          <pre style={{
            fontSize: 12, lineHeight: 1.6, color: '#d4d4d8', background: '#09090b',
            padding: 16, borderRadius: 6, overflow: 'auto', maxHeight: 600, whiteSpace: 'pre-wrap',
          }}>
            {candidate.raw_markdown}
          </pre>
        </div>
      )}

      {/* Analysis tab */}
      {tab === 'analysis' && (
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: 20 }}>
          {!analysis ? (
            <div style={{ color: '#52525b' }}>No analysis available</div>
          ) : (
            <div>
              {/* Score bars */}
              <div style={{ marginBottom: 24 }}>
                {scores.map(s => (
                  <div key={s.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: '#a1a1aa' }}>{s.label} ({s.weight})</span>
                      <span style={{ fontWeight: 600, color: scoreColor(s.value) }}>{s.value ?? '—'}</span>
                    </div>
                    <div style={{ height: 6, background: '#27272a', borderRadius: 3 }}>
                      <div style={{ height: '100%', borderRadius: 3, background: scoreColor(s.value), width: `${(s.value ?? 0) * 10}%`, transition: 'width 300ms' }} />
                    </div>
                    {s.rationale && <div style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>{s.rationale}</div>}
                  </div>
                ))}
              </div>

              {/* AI suggestion summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InfoCell label="Category" value={analysis.suggested_category} />
                <InfoCell label="Type" value={analysis.suggested_type} />
                <InfoCell label="Difficulty" value={analysis.suggested_difficulty} />
                <InfoCell label="Recommendation" value={analysis.recommendation} />
                <InfoCell label="Tags" value={(analysis.suggested_tags || []).join(', ')} />
                {analysis.duplicate_of && <InfoCell label="Duplicate Of" value={analysis.duplicate_of} />}
                {analysis.rejection_reason && <InfoCell label="Rejection Reason" value={analysis.rejection_reason} />}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overrides tab */}
      {tab === 'overrides' && (
        <OverridesForm candidate={candidate} onSave={saveOverrides} />
      )}
    </div>
  );
}

// ─── Overrides Form ──────────────────────────────────────────────────────────

function OverridesForm({ candidate, onSave }: { candidate: CandidateDetail; onSave: (o: Record<string, unknown>) => Promise<void> }) {
  const [values, setValues] = useState({
    override_category: candidate.override_category || candidate.suggested_category || '',
    override_type: candidate.override_type || candidate.suggested_type || '',
    override_difficulty: candidate.override_difficulty || candidate.suggested_difficulty || '',
    override_tags: candidate.override_tags || candidate.suggested_tags || '',
    override_name_cn: candidate.override_name_cn || '',
    override_name_en: candidate.override_name_en || '',
    override_highlight_cn: candidate.override_highlight_cn || '',
    override_highlight_en: candidate.override_highlight_en || '',
    review_notes: candidate.review_notes || '',
  });
  const [saving, setSaving] = useState(false);

  const update = (key: string, val: string) => setValues(v => ({ ...v, [key]: val }));

  const submit = async (e: Event) => {
    e.preventDefault();
    setSaving(true);
    await onSave(values);
    setSaving(false);
  };

  const categories = [
    'think-plan', 'scaffold', 'design', 'frontend', 'backend',
    'test', 'debug', 'review', 'ship', 'ai-engineering',
    'data-viz', 'content', 'documents', 'utilities', 'meta',
  ];

  return (
    <form onSubmit={submit} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <Field label="Category">
          <select value={values.override_category} onChange={(e: any) => update('override_category', e.target.value)} style={inputStyle}>
            <option value="">— Use AI suggestion —</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Type">
          <select value={values.override_type} onChange={(e: any) => update('override_type', e.target.value)} style={inputStyle}>
            <option value="">— Use AI suggestion —</option>
            {['discipline', 'tool', 'process', 'reference'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Difficulty">
          <select value={values.override_difficulty} onChange={(e: any) => update('override_difficulty', e.target.value)} style={inputStyle}>
            <option value="">— Use AI suggestion —</option>
            {['starter', 'intermediate', 'advanced'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Tags (JSON array)">
          <input value={values.override_tags} onInput={(e: any) => update('override_tags', e.target.value)} style={inputStyle} placeholder='["tag1","tag2"]' />
        </Field>
        <Field label="Name (CN)">
          <input value={values.override_name_cn} onInput={(e: any) => update('override_name_cn', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Name (EN)">
          <input value={values.override_name_en} onInput={(e: any) => update('override_name_en', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Highlight (CN)">
          <input value={values.override_highlight_cn} onInput={(e: any) => update('override_highlight_cn', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Highlight (EN)">
          <input value={values.override_highlight_en} onInput={(e: any) => update('override_highlight_en', e.target.value)} style={inputStyle} />
        </Field>
      </div>
      <Field label="Review Notes">
        <textarea
          value={values.review_notes}
          onInput={(e: any) => update('review_notes', e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </Field>
      <button type="submit" disabled={saving} style={{ ...btnStyle, background: '#8B5CF6', color: 'white', marginTop: 16 }}>
        {saving ? 'Saving...' : 'Save Overrides'}
      </button>
    </form>
  );
}

// ─── Sources View ────────────────────────────────────────────────────────────

function SourcesView({ api }: { api: (path: string, opts?: RequestInit) => Promise<any> }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    api('/sources').then(data => { setSources(data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const addSource = async (source: { id: string; url: string; skill_pattern: string }) => {
    await api('/sources', { method: 'POST', body: JSON.stringify(source) });
    const data = await api('/sources');
    setSources(data.data || []);
    setShowAdd(false);
  };

  if (loading) return <div style={{ color: '#52525b', padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Sources</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={{ ...btnStyle, background: '#8B5CF6', color: 'white' }}>
          {showAdd ? 'Cancel' : '+ Add Source'}
        </button>
      </div>

      {showAdd && <AddSourceForm onAdd={addSource} />}

      <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #27272a' }}>
              <th style={thStyle}>Repository</th>
              <th style={thStyle}>Pattern</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Candidates</th>
              <th style={thStyle}>Last Checked</th>
              <th style={thStyle}>Via</th>
            </tr>
          </thead>
          <tbody>
            {sources.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #1e1e21' }}>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>
                  <a href={s.url} target="_blank" rel="noopener" style={{ color: '#8B5CF6', textDecoration: 'none' }}>{s.id}</a>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#71717a', fontFamily: 'monospace' }}>{s.skill_pattern || '—'}</td>
                <td style={{ padding: '10px 12px' }}><StatusBadge status={s.status} /></td>
                <td style={{ padding: '10px 12px', fontSize: 13, textAlign: 'center' }}>{s.candidate_count}</td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#71717a' }}>{s.last_checked_at ? formatDate(s.last_checked_at) : 'Never'}</td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#52525b' }}>{s.discovered_via || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddSourceForm({ onAdd }: { onAdd: (s: { id: string; url: string; skill_pattern: string }) => Promise<void> }) {
  const [id, setId] = useState('');
  const [url, setUrl] = useState('');
  const [pattern, setPattern] = useState('**/*.md');
  const [saving, setSaving] = useState(false);

  const submit = async (e: Event) => {
    e.preventDefault();
    if (!id || !url) return;
    setSaving(true);
    await onAdd({ id, url, skill_pattern: pattern });
    setSaving(false);
  };

  // Auto-fill from URL
  const onUrlChange = (val: string) => {
    setUrl(val);
    const m = val.match(/github\.com\/([\w.-]+\/[\w.-]+)/);
    if (m && !id) setId(m[1]);
  };

  return (
    <form onSubmit={submit} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="Repository URL">
          <input value={url} onInput={(e: any) => onUrlChange(e.target.value)} placeholder="https://github.com/owner/repo" style={inputStyle} />
        </Field>
        <Field label="ID (owner/repo)">
          <input value={id} onInput={(e: any) => setId(e.target.value)} placeholder="owner/repo" style={inputStyle} />
        </Field>
        <Field label="Skill Pattern">
          <input value={pattern} onInput={(e: any) => setPattern(e.target.value)} placeholder="**/*.md" style={inputStyle} />
        </Field>
      </div>
      <button type="submit" disabled={saving || !id || !url} style={{ ...btnStyle, background: '#10B981', color: 'white' }}>
        {saving ? 'Adding...' : 'Add Source'}
      </button>
    </form>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending_analysis: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
    pending_review: { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24' },
    analyzed: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
    approved: { bg: 'rgba(16,185,129,0.15)', text: '#34D399' },
    translating: { bg: 'rgba(139,92,246,0.15)', text: '#A78BFA' },
    translated: { bg: 'rgba(139,92,246,0.15)', text: '#A78BFA' },
    published: { bg: 'rgba(139,92,246,0.15)', text: '#A78BFA' },
    auto_rejected: { bg: 'rgba(239,68,68,0.12)', text: '#F87171' },
    rejected: { bg: 'rgba(239,68,68,0.12)', text: '#F87171' },
    active: { bg: 'rgba(16,185,129,0.15)', text: '#34D399' },
    pending: { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24' },
    running: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
    completed: { bg: 'rgba(16,185,129,0.15)', text: '#34D399' },
    failed: { bg: 'rgba(239,68,68,0.12)', text: '#F87171' },
  };
  const c = colors[status] || { bg: 'rgba(113,113,122,0.15)', text: '#71717a' };

  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, background: c.bg, color: c.text }}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function RecommendBadge({ rec }: { rec: string | null }) {
  if (!rec) return <span style={{ color: '#52525b', fontSize: 12 }}>—</span>;
  const colors: Record<string, string> = { ACCEPT: '#10B981', REVIEW: '#F59E0B', REJECT: '#EF4444' };
  return <span style={{ fontSize: 12, fontWeight: 600, color: colors[rec] || '#71717a' }}>{rec}</span>;
}

function InfoCell({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div style={{ background: '#09090b', borderRadius: 6, padding: '10px 14px' }}>
      <div style={{ fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#d4d4d8' }}>{value || '—'}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: any }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={{ display: 'block', fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score: number | null | undefined): string {
  if (score == null) return '#52525b';
  if (score >= 7) return '#10B981';
  if (score >= 5) return '#F59E0B';
  return '#EF4444';
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

const thStyle: Record<string, string | number> = {
  textAlign: 'left',
  padding: '10px 12px',
  fontSize: 11,
  color: '#71717a',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 500,
};

const inputStyle: Record<string, string | number> = {
  width: '100%',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: 6,
  padding: '8px 12px',
  fontSize: 13,
  color: '#fafafa',
  outline: 'none',
};

const btnStyle: Record<string, string | number> = {
  padding: '6px 14px',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
};

// Admin console API abstraction layer
// Pattern: adminApi.ts from 管理后台API层.md spec

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Candidate {
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

export interface CandidateDetail extends Candidate {
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
  published_at: string | null;
  published_path_cn: string | null;
  published_path_en: string | null;
  pr_number: number | null;
  pr_url: string | null;
}

export interface Source {
  id: string;
  url: string;
  skill_pattern: string | null;
  status: string;
  last_checked_at: string | null;
  last_commit_sha: string | null;
  discovered_via: string | null;
  candidate_count: number;
  approved_count: number;
  avg_score: number | null;
  created_at: string;
  notes: string | null;
}

export interface Stats {
  candidates: {
    total: number;
    pending_analysis: number;
    pending_review: number;
    approved: number;
    auto_rejected: number;
    rejected: number;
    published: number;
    translating: number;
    translated: number;
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
  categoryDistribution: Array<{ category: string; count: number }>;
  scoreDistribution: { low: number; medium: number; high: number };
  topSources: Array<{ source_id: string; count: number; approved_count: number; avg_score: number | null }>;
  funnel: {
    discovered: number;
    analyzed: number;
    reviewed: number;
    approved: number;
    translated: number;
    published: number;
  };
}

export interface PipelineRun {
  id: string;
  channel: string;
  started_at: string;
  completed_at: string | null;
  candidates_found: number;
  new_candidates: number;
  duplicates_skipped: number;
  errors: string | null;
  status: string;
}

export interface PipelineRunListResponse {
  data: PipelineRun[];
  total: number;
}

export interface CandidateListResponse {
  data: Candidate[];
  total: number;
}

export interface SourceListResponse {
  data: Source[];
}

export interface SettingsInfo {
  tables: { sources: number; candidates: number; discovery_runs: number };
  lastRunByChannel: Array<{ channel: string; started_at: string; status: string }>;
}

// ─── Session Management ─────────────────────────────────────────────────────

const SESSION_KEY = '_ct';

export function getToken(): string {
  try { return sessionStorage.getItem(SESSION_KEY) || ''; } catch { return ''; }
}

export function setToken(token: string): void {
  sessionStorage.setItem(SESSION_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// ─── Core Fetch ─────────────────────────────────────────────────────────────

type OnUnauthorized = () => void;

let _onUnauthorized: OnUnauthorized = () => {
  clearToken();
  location.reload();
};

export function setOnUnauthorized(fn: OnUnauthorized): void {
  _onUnauthorized = fn;
}

async function adminFetch<T>(apiBase: string, path: string, opts?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${apiBase}${path}`, {
    ...opts,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...opts?.headers,
    },
  });

  if (res.status === 403) {
    _onUnauthorized();
    throw new Error('Unauthorized');
  }

  return res.json() as Promise<T>;
}

// ─── API Functions ──────────────────────────────────────────────────────────

export async function login(apiBase: string, token: string): Promise<boolean> {
  const res = await fetch(`${apiBase}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return res.ok;
}

export function fetchStats(apiBase: string): Promise<Stats> {
  return adminFetch<Stats>(apiBase, '/stats');
}

export function fetchCandidates(
  apiBase: string,
  params: { status?: string; sort?: string; order?: string; page?: number; limit?: number; search?: string; source?: string },
): Promise<CandidateListResponse> {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.sort) qs.set('sort', params.sort);
  if (params.order) qs.set('order', params.order);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.search) qs.set('search', params.search);
  if (params.source) qs.set('source', params.source);
  return adminFetch<CandidateListResponse>(apiBase, `/candidates?${qs}`);
}

export function fetchCandidate(apiBase: string, id: string): Promise<CandidateDetail> {
  return adminFetch<CandidateDetail>(apiBase, `/candidate/${id}`);
}

export function approveCandidate(apiBase: string, id: string): Promise<unknown> {
  return adminFetch(apiBase, `/candidate/${id}/approve`, { method: 'POST' });
}

export function rejectCandidate(apiBase: string, id: string, reason?: string): Promise<unknown> {
  return adminFetch(apiBase, `/candidate/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function updateCandidate(apiBase: string, id: string, overrides: Record<string, unknown>): Promise<unknown> {
  return adminFetch(apiBase, `/candidate/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(overrides),
  });
}

export function fetchSources(apiBase: string): Promise<SourceListResponse> {
  return adminFetch<SourceListResponse>(apiBase, '/sources');
}

export function addSource(apiBase: string, data: { id: string; url: string; skill_pattern: string }): Promise<unknown> {
  return adminFetch(apiBase, '/sources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSource(apiBase: string, id: string, data: Record<string, unknown>): Promise<unknown> {
  return adminFetch(apiBase, `/source/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function fetchRuns(
  apiBase: string,
  params?: { channel?: string; page?: number; limit?: number },
): Promise<PipelineRunListResponse> {
  const qs = new URLSearchParams();
  if (params?.channel) qs.set('channel', params.channel);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return adminFetch<PipelineRunListResponse>(apiBase, `/runs?${qs}`);
}

export function fetchSettings(apiBase: string): Promise<SettingsInfo> {
  return adminFetch<SettingsInfo>(apiBase, '/settings');
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function scoreColor(score: number | null | undefined): string {
  if (score == null) return 'text-[#52525b]';
  if (score >= 7) return 'text-emerald-400';
  if (score >= 5) return 'text-amber-400';
  return 'text-red-400';
}

export function scoreColorRaw(score: number | null | undefined): string {
  if (score == null) return '#52525b';
  if (score >= 7) return '#10B981';
  if (score >= 5) return '#F59E0B';
  return '#EF4444';
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function formatDuration(start: string, end: string | null): string {
  if (!end) return '—';
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

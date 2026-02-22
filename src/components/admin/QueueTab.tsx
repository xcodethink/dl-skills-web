import { useState, useEffect, useCallback } from 'preact/hooks';
import { labels, type AdminLang } from '../../lib/adminLabels';
import {
  fetchCandidates, fetchSources, approveCandidate, rejectCandidate,
  scoreColor, type Candidate, type Source,
} from '../../lib/adminApi';
import StatusBadge, { RecommendBadge } from './shared';

interface Props {
  apiBase: string;
  lang: AdminLang;
}

const STATUSES = ['pending_review', 'pending_analysis', 'approved', 'auto_rejected', 'rejected', 'published'];

export default function QueueTab({ apiBase, lang }: Props) {
  const l = labels[lang];
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [sourceFilter, setSourceFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState('score_weighted');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sources, setSources] = useState<Source[]>([]);

  // Load sources for filter dropdown
  useEffect(() => {
    fetchSources(apiBase).then(d => setSources(d.data || [])).catch(() => {});
  }, [apiBase]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCandidates(apiBase, {
        status: statusFilter,
        sort,
        order,
        page,
        search: search || undefined,
        source: sourceFilter || undefined,
      });
      setCandidates(data.data || []);
      setTotal(data.total || 0);
    } catch { /* handled by api */ }
    setLoading(false);
  }, [apiBase, statusFilter, sourceFilter, search, sort, order, page]);

  useEffect(() => { load(); }, [load]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

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
      await approveCandidate(apiBase, id);
    }
    setSelected(new Set());
    load();
  };

  const batchReject = async () => {
    for (const id of selected) {
      await rejectCandidate(apiBase, id, 'Batch rejected');
    }
    setSelected(new Set());
    load();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold">{l.queue_title}</h1>
        <span class="text-sm text-[#71717a]">{l.candidates_count.replace('{n}', String(total))}</span>
      </div>

      {/* Search + Source filter */}
      <div class="flex gap-3 flex-wrap">
        <div class="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchInput}
            onInput={(e: any) => setSearchInput(e.target.value)}
            placeholder={l.search_candidates}
            class="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-1.5 pl-8 text-sm text-[#fafafa] outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors"
          />
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52525b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
        <select
          value={sourceFilter}
          onChange={(e: any) => { setSourceFilter(e.target.value); setPage(1); }}
          class="bg-[#09090b] border border-[#27272a] rounded-md px-3 py-1.5 text-sm text-[#a1a1aa] outline-none focus:border-[#8B5CF6] transition-colors"
        >
          <option value="">{l.filter_source}</option>
          {sources.map(s => (
            <option key={s.id} value={s.id}>{s.id}</option>
          ))}
        </select>
      </div>

      {/* Status filters */}
      <div class="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            class={`px-3 py-1 rounded-md text-xs font-medium border transition-colors
              ${statusFilter === s
                ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]'
                : 'border-[#27272a] text-[#71717a] hover:text-[#a1a1aa] hover:border-[#3f3f46]'
              }`}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Batch actions */}
      {selected.size > 0 && (
        <div class="flex items-center gap-3">
          <span class="text-sm text-[#a1a1aa]">{l.selected_count.replace('{n}', String(selected.size))}</span>
          <button onClick={batchApprove} class="px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
            {l.batch_approve}
          </button>
          <button onClick={batchReject} class="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors">
            {l.batch_reject}
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div class="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} class="bg-[#18181b] rounded-lg h-12" />)}
        </div>
      ) : candidates.length === 0 ? (
        <div class="text-[#52525b] text-center py-12">{l.no_candidates}</div>
      ) : (
        <div class="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b border-[#27272a]">
                  <th class="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selected.size === candidates.length && candidates.length > 0}
                      onChange={toggleAll}
                      class="rounded border-[#3f3f46]"
                    />
                  </th>
                  <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.source_path}</th>
                  <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.summary}</th>
                  <th
                    class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3 cursor-pointer hover:text-[#a1a1aa]"
                    onClick={() => { setSort('score_weighted'); setOrder(o => o === 'desc' ? 'asc' : 'desc'); }}
                  >
                    {l.score} {sort === 'score_weighted' ? (order === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.category}</th>
                  <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.ai_rec}</th>
                  <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.status}</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr
                    key={c.id}
                    class="border-b border-[#1e1e21] cursor-pointer hover:bg-[#1e1e21]/50 transition-colors"
                    onClick={() => { location.hash = `#detail/${c.id}`; }}
                  >
                    <td class="py-2.5 px-3" onClick={(e: Event) => { e.stopPropagation(); toggleSelect(c.id); }}>
                      <input type="checkbox" checked={selected.has(c.id)} class="rounded border-[#3f3f46]" />
                    </td>
                    <td class="py-2.5 px-3 text-sm">
                      <div class="font-medium text-[#fafafa]">{c.source_id}</div>
                      <div class="text-[11px] text-[#52525b] mt-0.5">{c.source_path}</div>
                    </td>
                    <td class="py-2.5 px-3 text-sm text-[#a1a1aa] max-w-[300px] truncate">
                      {c.summary_en || c.summary_cn || '—'}
                    </td>
                    <td class={`py-2.5 px-3 text-sm font-semibold ${scoreColor(c.score_weighted)}`}>
                      {c.score_weighted?.toFixed(1) || '—'}
                    </td>
                    <td class="py-2.5 px-3 text-xs text-[#a1a1aa]">
                      {c.override_category || c.suggested_category || '—'}
                    </td>
                    <td class="py-2.5 px-3">
                      <RecommendBadge rec={c.ai_recommendation} />
                    </td>
                    <td class="py-2.5 px-3">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div class="flex justify-center items-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            class="px-3 py-1.5 rounded-md text-sm font-medium border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {l.prev}
          </button>
          <span class="text-sm text-[#71717a]">
            {l.page_of.replace('{page}', String(page)).replace('{total}', String(totalPages))}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            class="px-3 py-1.5 rounded-md text-sm font-medium border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {l.next}
          </button>
        </div>
      )}
    </div>
  );
}

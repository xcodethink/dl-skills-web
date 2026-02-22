import { useState, useEffect, useCallback } from 'preact/hooks';
import { labels, type AdminLang } from '../../lib/adminLabels';
import { fetchCandidates, formatDate, scoreColor, type Candidate } from '../../lib/adminApi';
import StatusBadge from './shared';

interface Props {
  apiBase: string;
  lang: AdminLang;
}

export default function PublishedTab({ apiBase, lang }: Props) {
  const l = labels[lang];
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCandidates(apiBase, {
        status: 'published',
        sort,
        order,
        page,
        limit: 20,
      });
      setCandidates(data.data || []);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  }, [apiBase, sort, order, page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold">{l.published_title}</h1>
        <span class="text-sm text-[#71717a]">{l.published_count.replace('{n}', String(total))}</span>
      </div>

      {/* Table */}
      {loading ? (
        <div class="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} class="bg-[#18181b] rounded-lg h-12" />)}
        </div>
      ) : candidates.length === 0 ? (
        <div class="text-center py-16">
          <div class="text-3xl mb-3">📦</div>
          <div class="text-[#52525b]">{l.no_published}</div>
        </div>
      ) : (
        <div class="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b border-[#27272a]">
                  <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.name}</th>
                  <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.category}</th>
                  <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.source}</th>
                  <th
                    class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3 cursor-pointer hover:text-[#a1a1aa]"
                    onClick={() => { setSort('score_weighted'); setOrder(o => o === 'desc' ? 'asc' : 'desc'); }}
                  >
                    {l.score} {sort === 'score_weighted' ? (order === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th
                    class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3 cursor-pointer hover:text-[#a1a1aa]"
                    onClick={() => { setSort('created_at'); setOrder(o => o === 'desc' ? 'asc' : 'desc'); }}
                  >
                    {l.published_at} {sort === 'created_at' ? (order === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.status}</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => {
                  const name = c.override_name_en || c.override_name_cn || c.summary_en || c.source_path;
                  return (
                    <tr
                      key={c.id}
                      class="border-b border-[#1e1e21] cursor-pointer hover:bg-[#1e1e21]/50 transition-colors"
                      onClick={() => { location.hash = `#detail/${c.id}`; }}
                    >
                      <td class="py-2.5 px-3 text-sm">
                        <div class="font-medium text-[#fafafa]">{name}</div>
                        <div class="text-[11px] text-[#52525b] mt-0.5">{c.source_path}</div>
                      </td>
                      <td class="py-2.5 px-3 text-xs text-[#a1a1aa]">
                        {c.override_category || c.suggested_category || '—'}
                      </td>
                      <td class="py-2.5 px-3 text-xs text-[#71717a]">{c.source_id}</td>
                      <td class={`py-2.5 px-3 text-sm font-semibold ${scoreColor(c.score_weighted)}`}>
                        {c.score_weighted?.toFixed(1) || '—'}
                      </td>
                      <td class="py-2.5 px-3 text-xs text-[#71717a]">{formatDate(c.updated_at)}</td>
                      <td class="py-2.5 px-3"><StatusBadge status={c.status} /></td>
                    </tr>
                  );
                })}
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

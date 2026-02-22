import { useState, useEffect, useCallback } from 'preact/hooks';
import { labels, type AdminLang } from '../../lib/adminLabels';
import { fetchStats, fetchRuns, formatDate, formatDuration, type Stats, type PipelineRun } from '../../lib/adminApi';
import StatusBadge from './shared';
import { SectionCard } from './charts';

interface Props {
  apiBase: string;
  lang: AdminLang;
}

// ─── Pipeline Stage Card ────────────────────────────────────────────────────

function StageCard({ name, icon, lastRun, pendingCount, color }: {
  name: string;
  icon: string;
  lastRun: { time: string; status: string } | null;
  pendingCount: number;
  color: string;
}) {
  return (
    <div class="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${color}20`, color }}>
          {icon}
        </div>
        <span class="text-sm font-semibold text-[#fafafa]">{name}</span>
      </div>
      <div class="space-y-1.5">
        {lastRun ? (
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-[#52525b]">{formatDate(lastRun.time)}</span>
            <StatusBadge status={lastRun.status} />
          </div>
        ) : (
          <span class="text-[11px] text-[#52525b]">—</span>
        )}
        {pendingCount > 0 && (
          <div class="text-xs text-amber-400 font-medium">{pendingCount} pending</div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

const CHANNELS = ['', 'watchlist', 'search', 'awesome-list'];

export default function PipelineTab({ apiBase, lang }: Props) {
  const l = labels[lang];
  const [stats, setStats] = useState<Stats | null>(null);
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [runsTotal, setRunsTotal] = useState(0);
  const [runsPage, setRunsPage] = useState(1);
  const [channelFilter, setChannelFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  useEffect(() => {
    fetchStats(apiBase).then(setStats).catch(() => {});
  }, [apiBase]);

  const loadRuns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRuns(apiBase, {
        channel: channelFilter || undefined,
        page: runsPage,
        limit: 15,
      });
      setRuns(data.data || []);
      setRunsTotal(data.total || 0);
    } catch {}
    setLoading(false);
  }, [apiBase, channelFilter, runsPage]);

  useEffect(() => { loadRuns(); }, [loadRuns]);

  const totalPages = Math.ceil(runsTotal / 15);

  // Build stage cards from stats
  const lastRunMap: Record<string, { time: string; status: string }> = {};
  if (stats?.recentRuns) {
    for (const run of stats.recentRuns) {
      if (!lastRunMap[run.channel]) {
        lastRunMap[run.channel] = { time: run.started_at, status: run.status };
      }
    }
  }

  const c = stats?.candidates;
  const stages = [
    { name: l.stage_discover, icon: '🔍', lastRun: lastRunMap['watchlist'] || lastRunMap['search'] || lastRunMap['awesome-list'] || null, pendingCount: 0, color: '#3B82F6' },
    { name: l.stage_analyze, icon: '🧠', lastRun: null, pendingCount: c?.pending_analysis || 0, color: '#06B6D4' },
    { name: l.stage_translate, icon: '🌐', lastRun: null, pendingCount: c?.approved || 0, color: '#8B5CF6' },
    { name: l.stage_publish, icon: '🚀', lastRun: null, pendingCount: (c?.translating || 0) + (c?.translated || 0), color: '#10B981' },
    { name: l.stage_health, icon: '💚', lastRun: null, pendingCount: 0, color: '#F59E0B' },
  ];

  return (
    <div class="space-y-6">
      <h1 class="text-lg font-bold">{l.pipeline_title}</h1>

      {/* Stage overview cards */}
      <div>
        <h2 class="text-sm font-semibold text-[#a1a1aa] mb-3">{l.pipeline_stages}</h2>
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {stages.map(s => (
            <StageCard key={s.name} {...s} />
          ))}
        </div>
      </div>

      {/* Pipeline flow visualization */}
      {stats?.funnel && (
        <SectionCard title={l.pipeline_funnel}>
          <div class="flex items-center gap-2 overflow-x-auto py-2">
            {[
              { label: l.discovered, value: stats.funnel.discovered, color: '#3B82F6' },
              { label: l.analyzed, value: stats.funnel.analyzed, color: '#06B6D4' },
              { label: l.reviewed, value: stats.funnel.reviewed, color: '#F59E0B' },
              { label: l.approved, value: stats.funnel.approved, color: '#10B981' },
              { label: l.translated, value: stats.funnel.translated, color: '#8B5CF6' },
              { label: l.published, value: stats.funnel.published, color: '#EC4899' },
            ].map((stage, i, arr) => (
              <div key={stage.label} class="flex items-center gap-2">
                <div class="text-center px-3 py-2 rounded-lg bg-[#09090b] min-w-[80px]">
                  <div class="text-lg font-bold" style={{ color: stage.color }}>{stage.value}</div>
                  <div class="text-[10px] text-[#71717a]">{stage.label}</div>
                </div>
                {i < arr.length - 1 && (
                  <div class="text-[#3f3f46] shrink-0">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Run history */}
      <SectionCard title={l.run_history}>
        {/* Channel filter */}
        <div class="flex gap-2 mb-4 flex-wrap">
          {CHANNELS.map(ch => (
            <button
              key={ch}
              onClick={() => { setChannelFilter(ch); setRunsPage(1); }}
              class={`px-3 py-1 rounded-md text-xs font-medium border transition-colors
                ${channelFilter === ch
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]'
                  : 'border-[#27272a] text-[#71717a] hover:text-[#a1a1aa] hover:border-[#3f3f46]'
                }`}
            >
              {ch || l.all}
            </button>
          ))}
        </div>

        {loading ? (
          <div class="animate-pulse space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} class="bg-[#09090b] rounded-lg h-10" />)}
          </div>
        ) : runs.length === 0 ? (
          <div class="text-sm text-[#52525b] text-center py-8">{l.no_runs}</div>
        ) : (
          <>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b border-[#27272a]">
                    <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2 px-3">{l.channel}</th>
                    <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2 px-3">{l.date}</th>
                    <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2 px-3">{l.duration}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2 px-3">{l.found}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2 px-3">{l.new_col}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2 px-3">{l.duplicates}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2 px-3">{l.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map(run => {
                    const errors = run.errors ? JSON.parse(run.errors) : [];
                    const hasErrors = errors.length > 0;
                    return (
                      <>
                        <tr
                          key={run.id}
                          class={`border-b border-[#1e1e21] ${hasErrors ? 'cursor-pointer hover:bg-[#1e1e21]/50' : ''} transition-colors`}
                          onClick={() => hasErrors && setExpandedRun(expandedRun === run.id ? null : run.id)}
                        >
                          <td class="py-2 px-3 text-sm">{run.channel}</td>
                          <td class="py-2 px-3 text-sm text-[#a1a1aa]">{formatDate(run.started_at)}</td>
                          <td class="py-2 px-3 text-sm text-[#71717a]">{formatDuration(run.started_at, run.completed_at)}</td>
                          <td class="py-2 px-3 text-sm text-right">{run.candidates_found}</td>
                          <td class="py-2 px-3 text-sm text-right text-emerald-400">{run.new_candidates}</td>
                          <td class="py-2 px-3 text-sm text-right text-[#71717a]">{run.duplicates_skipped}</td>
                          <td class="py-2 px-3 text-right">
                            <div class="flex items-center justify-end gap-1.5">
                              <StatusBadge status={run.status} />
                              {hasErrors && (
                                <span class="text-[10px] text-red-400">({errors.length})</span>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandedRun === run.id && hasErrors && (
                          <tr key={`${run.id}-errors`}>
                            <td colSpan={7} class="px-3 py-2 bg-[#09090b]">
                              <div class="text-xs text-red-400 space-y-1">
                                {errors.map((err: string, i: number) => (
                                  <div key={i} class="font-mono">{err}</div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div class="flex justify-center items-center gap-3 mt-4">
                <button
                  disabled={runsPage <= 1}
                  onClick={() => setRunsPage(p => p - 1)}
                  class="px-3 py-1.5 rounded-md text-sm font-medium border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {l.prev}
                </button>
                <span class="text-sm text-[#71717a]">
                  {l.page_of.replace('{page}', String(runsPage)).replace('{total}', String(totalPages))}
                </span>
                <button
                  disabled={runsPage >= totalPages}
                  onClick={() => setRunsPage(p => p + 1)}
                  class="px-3 py-1.5 rounded-md text-sm font-medium border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {l.next}
                </button>
              </div>
            )}
          </>
        )}
      </SectionCard>
    </div>
  );
}

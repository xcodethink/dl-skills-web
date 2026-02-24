import { useState, useEffect } from 'preact/hooks';
import { labels, type AdminLang } from '../../lib/adminLabels';
import { fetchStats, formatDate, scoreColor, type Stats } from '../../lib/adminApi';
import StatusBadge from './shared';
import { StatCard, FunnelChart, HorizontalBarChart, ScoreDistribution, DonutChart, SectionCard } from './charts';

interface Props {
  apiBase: string;
  lang: AdminLang;
}

export default function DashTab({ apiBase, lang }: Props) {
  const l = labels[lang];
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats(apiBase)
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiBase]);

  if (loading) {
    return (
      <div class="animate-pulse space-y-4">
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} class="bg-[#18181b] rounded-xl h-[72px]" />
          ))}
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} class="bg-[#18181b] rounded-xl h-[72px]" />
          ))}
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-[#18181b] rounded-xl h-56" />
          <div class="bg-[#18181b] rounded-xl h-56" />
        </div>
      </div>
    );
  }

  if (!stats) return <div class="text-[#52525b] text-center py-12">{l.loading}</div>;

  const c = stats.candidates;
  const totalRejected = (c.auto_rejected || 0) + (c.rejected || 0);
  const totalDiscoveryRuns = stats.recentRuns.length;

  // ─── Row 1: Pipeline status cards ──────────────────────────────────
  const row1 = [
    { label: l.pending_review,   value: c.pending_review,   icon: 'clock',        color: 'amber' },
    { label: l.pending_analysis, value: c.pending_analysis, icon: 'activity',      color: 'blue' },
    { label: l.approved,         value: c.approved,         icon: 'check-circle',  color: 'green' },
    { label: l.published,        value: c.published,        icon: 'rocket',        color: 'purple' },
    { label: l.rejected,         value: totalRejected,      icon: 'x-circle',      color: 'red' },
  ];

  // ─── Row 2: Summary metrics ────────────────────────────────────────
  const row2 = [
    { label: l.total,            value: c.total,                        icon: 'layers',     color: 'gray' },
    { label: l.avg_score,        value: c.avg_score?.toFixed(1) || '—', icon: 'star',       color: 'cyan' },
    { label: l.sources_total,    value: stats.sources.total,            icon: 'globe',      color: 'blue' },
    { label: l.sources_active,   value: stats.sources.active,           icon: 'zap',        color: 'green' },
    { label: l.discovery_runs,   value: totalDiscoveryRuns,             icon: 'bar-chart',  color: 'purple' },
  ];

  // Funnel stages
  const f = stats.funnel;
  const funnelStages = [
    { label: l.discovered, value: f?.discovered || 0, color: '#3B82F6' },
    { label: l.analyzed,   value: f?.analyzed   || 0, color: '#06B6D4' },
    { label: l.reviewed,   value: f?.reviewed   || 0, color: '#F59E0B' },
    { label: l.approved,   value: f?.approved   || 0, color: '#10B981' },
    { label: l.translated, value: f?.translated || 0, color: '#8B5CF6' },
    { label: l.published,  value: f?.published  || 0, color: '#EC4899' },
  ];

  // Category bars
  const categoryBars = (stats.categoryDistribution || []).map(d => ({
    label: d.category,
    value: d.count,
  }));

  // Score distribution
  const sd = stats.scoreDistribution || { low: 0, medium: 0, high: 0 };

  // Status donut
  const statusSegments = [
    { label: l.pending_review,   value: c.pending_review,   color: '#F59E0B' },
    { label: l.pending_analysis, value: c.pending_analysis, color: '#3B82F6' },
    { label: l.approved,         value: c.approved,         color: '#10B981' },
    { label: l.published,        value: c.published,        color: '#8B5CF6' },
    { label: l.rejected,         value: totalRejected,      color: '#EF4444' },
  ].filter(s => s.value > 0);

  // Top sources
  const topSrcs = stats.topSources || [];

  return (
    <div class="space-y-6">
      {/* ═══ KPI Row 1: Pipeline Status ═══ */}
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {row1.map(card => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} color={card.color} />
        ))}
      </div>

      {/* ═══ KPI Row 2: Summary Metrics ═══ */}
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {row2.map(card => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} color={card.color} />
        ))}
      </div>

      {/* Quick action */}
      {c.pending_review > 0 && (
        <a
          href="#queue?status=pending_review"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-black rounded-lg text-sm font-semibold no-underline hover:bg-amber-400 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          {l.review_candidates.replace('{n}', String(c.pending_review))}
        </a>
      )}

      {/* ═══ Pipeline Funnel ═══ */}
      <SectionCard title={l.pipeline_funnel}>
        <FunnelChart stages={funnelStages} />
      </SectionCard>

      {/* ═══ 2-column: Category + Status Donut ═══ */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title={l.category_distribution}>
          {categoryBars.length === 0 ? (
            <div class="text-sm text-[#52525b] py-6 text-center">{l.no_data}</div>
          ) : (
            <HorizontalBarChart items={categoryBars} maxItems={10} />
          )}
        </SectionCard>

        <SectionCard title={l.status_distribution || 'Status Distribution'}>
          {statusSegments.length === 0 ? (
            <div class="text-sm text-[#52525b] py-6 text-center">{l.no_data}</div>
          ) : (
            <DonutChart segments={statusSegments} centerLabel="total" />
          )}
        </SectionCard>
      </div>

      {/* ═══ 2-column: Score Distribution + Sources Summary ═══ */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title={l.score_distribution}>
          <ScoreDistribution
            low={sd.low || 0}
            medium={sd.medium || 0}
            high={sd.high || 0}
            labels={{ low: l.score_low, medium: l.score_medium, high: l.score_high }}
          />
        </SectionCard>

        <SectionCard title={l.sources_summary}>
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-[#09090b] rounded-lg p-3 text-center">
              <div class="text-lg font-bold text-[#fafafa]">{stats.sources.total}</div>
              <div class="text-[11px] text-[#71717a]">{l.sources_total}</div>
            </div>
            <div class="bg-[#09090b] rounded-lg p-3 text-center">
              <div class="text-lg font-bold text-emerald-400">{stats.sources.active}</div>
              <div class="text-[11px] text-[#71717a]">{l.sources_active}</div>
            </div>
            <div class="bg-[#09090b] rounded-lg p-3 text-center">
              <div class="text-lg font-bold text-amber-400">{stats.sources.pending}</div>
              <div class="text-[11px] text-[#71717a]">{l.sources_pending}</div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ═══ 2-column: Top Sources + Recent Runs ═══ */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title={l.top_sources}>
          {topSrcs.length === 0 ? (
            <div class="text-sm text-[#52525b] py-6 text-center">{l.no_data}</div>
          ) : (
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b border-[#27272a]">
                    <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.source}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.candidates_col}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.approval_rate}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.avg_score}</th>
                  </tr>
                </thead>
                <tbody>
                  {topSrcs.map(s => {
                    const rate = s.count > 0 ? Math.round((s.approved_count / s.count) * 100) : 0;
                    return (
                      <tr key={s.source_id} class="border-b border-[#1e1e21]">
                        <td class="py-2.5 text-sm text-[#a1a1aa]">{s.source_id}</td>
                        <td class="py-2.5 text-sm text-right tabular-nums">{s.count}</td>
                        <td class="py-2.5 text-sm text-right tabular-nums">
                          <span class={rate >= 50 ? 'text-emerald-400' : 'text-amber-400'}>{rate}%</span>
                        </td>
                        <td class={`py-2.5 text-sm text-right tabular-nums font-semibold ${scoreColor(s.avg_score)}`}>
                          {s.avg_score?.toFixed(1) || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard title={l.recent_runs}>
          {stats.recentRuns.length === 0 ? (
            <div class="text-sm text-[#52525b] py-6 text-center">{l.no_runs}</div>
          ) : (
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b border-[#27272a]">
                    <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.channel}</th>
                    <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.date}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.found}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.new_col}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRuns.map(run => (
                    <tr key={run.id} class="border-b border-[#1e1e21]">
                      <td class="py-2.5 text-sm">{run.channel}</td>
                      <td class="py-2.5 text-sm text-[#a1a1aa]">{formatDate(run.started_at)}</td>
                      <td class="py-2.5 text-sm text-right tabular-nums">{run.candidates_found}</td>
                      <td class="py-2.5 text-sm text-right tabular-nums text-emerald-400">{run.new_candidates}</td>
                      <td class="py-2.5 text-right"><StatusBadge status={run.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

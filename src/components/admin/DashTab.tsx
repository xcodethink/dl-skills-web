import { useState, useEffect } from 'preact/hooks';
import { labels, type AdminLang } from '../../lib/adminLabels';
import { fetchStats, formatDate, scoreColor, type Stats } from '../../lib/adminApi';
import StatusBadge from './shared';
import { FunnelChart, HorizontalBarChart, ScoreDistribution, SectionCard } from './charts';

interface Props {
  apiBase: string;
  lang: AdminLang;
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div class="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
      <div class="text-[11px] text-[#71717a] uppercase tracking-wider mb-1">{label}</div>
      <div class="text-2xl font-bold" style={{ color }}>{value || 0}</div>
    </div>
  );
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
        <div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} class="bg-[#18181b] rounded-xl h-20" />
          ))}
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-[#18181b] rounded-xl h-48" />
          <div class="bg-[#18181b] rounded-xl h-48" />
        </div>
      </div>
    );
  }

  if (!stats) return <div class="text-[#52525b] text-center py-12">{l.loading}</div>;

  const c = stats.candidates;
  const cards = [
    { label: l.pending_review, value: c.pending_review, color: '#F59E0B' },
    { label: l.pending_analysis, value: c.pending_analysis, color: '#3B82F6' },
    { label: l.approved, value: c.approved, color: '#10B981' },
    { label: l.published, value: c.published, color: '#8B5CF6' },
    { label: l.rejected, value: (c.auto_rejected || 0) + (c.rejected || 0), color: '#EF4444' },
    { label: l.total, value: c.total, color: '#a1a1aa' },
    { label: l.avg_score, value: c.avg_score?.toFixed(1) || '—', color: '#06B6D4' },
  ];

  // Funnel stages
  const f = stats.funnel;
  const funnelStages = [
    { label: l.discovered, value: f?.discovered || 0, color: '#3B82F6' },
    { label: l.analyzed, value: f?.analyzed || 0, color: '#06B6D4' },
    { label: l.reviewed, value: f?.reviewed || 0, color: '#F59E0B' },
    { label: l.approved, value: f?.approved || 0, color: '#10B981' },
    { label: l.translated, value: f?.translated || 0, color: '#8B5CF6' },
    { label: l.published, value: f?.published || 0, color: '#EC4899' },
  ];

  // Category bars
  const categoryBars = (stats.categoryDistribution || []).map(d => ({
    label: d.category,
    value: d.count,
  }));

  // Score distribution
  const sd = stats.scoreDistribution || { low: 0, medium: 0, high: 0 };

  // Top sources
  const topSrcs = stats.topSources || [];

  return (
    <div class="space-y-6">
      {/* KPI stat cards */}
      <div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {cards.map(card => (
          <StatCard key={card.label} label={card.label} value={card.value} color={card.color} />
        ))}
      </div>

      {/* Quick action */}
      {c.pending_review > 0 && (
        <a
          href="#queue?status=pending_review"
          class="inline-block px-4 py-2 bg-amber-500 text-black rounded-md text-sm font-semibold no-underline hover:bg-amber-400 transition-colors"
        >
          {l.review_candidates.replace('{n}', String(c.pending_review))}
        </a>
      )}

      {/* Pipeline Funnel */}
      <SectionCard title={l.pipeline_funnel}>
        <FunnelChart stages={funnelStages} />
      </SectionCard>

      {/* 2-column: Category distribution + Score distribution */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title={l.category_distribution}>
          {categoryBars.length === 0 ? (
            <div class="text-sm text-[#52525b]">{l.no_data}</div>
          ) : (
            <HorizontalBarChart items={categoryBars} maxItems={10} />
          )}
        </SectionCard>

        <div class="space-y-4">
          <SectionCard title={l.score_distribution}>
            <ScoreDistribution
              low={sd.low || 0}
              medium={sd.medium || 0}
              high={sd.high || 0}
              labels={{ low: l.score_low, medium: l.score_medium, high: l.score_high }}
            />
          </SectionCard>

          {/* Sources summary */}
          <SectionCard title={l.sources_summary}>
            <div class="flex gap-6 text-sm text-[#a1a1aa]">
              <span>{l.sources_total}: <strong class="text-[#fafafa]">{stats.sources.total}</strong></span>
              <span>{l.sources_active}: <strong class="text-emerald-400">{stats.sources.active}</strong></span>
              <span>{l.sources_pending}: <strong class="text-amber-400">{stats.sources.pending}</strong></span>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* 2-column: Top sources + Recent runs */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top sources */}
        <SectionCard title={l.top_sources}>
          {topSrcs.length === 0 ? (
            <div class="text-sm text-[#52525b]">{l.no_data}</div>
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
                        <td class="py-2 text-sm text-[#a1a1aa]">{s.source_id}</td>
                        <td class="py-2 text-sm text-right">{s.count}</td>
                        <td class="py-2 text-sm text-right">
                          <span class={rate >= 50 ? 'text-emerald-400' : 'text-amber-400'}>{rate}%</span>
                        </td>
                        <td class={`py-2 text-sm text-right font-semibold ${scoreColor(s.avg_score)}`}>
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

        {/* Recent runs */}
        <SectionCard title={l.recent_runs}>
          {stats.recentRuns.length === 0 ? (
            <div class="text-sm text-[#52525b]">{l.no_runs}</div>
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
                      <td class="py-2 text-sm">{run.channel}</td>
                      <td class="py-2 text-sm text-[#a1a1aa]">{formatDate(run.started_at)}</td>
                      <td class="py-2 text-sm text-right">{run.candidates_found}</td>
                      <td class="py-2 text-sm text-right text-emerald-400">{run.new_candidates}</td>
                      <td class="py-2 text-right"><StatusBadge status={run.status} /></td>
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

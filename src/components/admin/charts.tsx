// Admin chart components — pure CSS/SVG, no external libraries

// ─── Funnel Chart ────────────────────────────────────────────────────────────

interface FunnelStage {
  label: string;
  value: number;
  color: string;
}

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(...stages.map(s => s.value), 1);

  return (
    <div class="flex items-end gap-1 sm:gap-2">
      {stages.map((stage, i) => {
        const height = Math.max(8, (stage.value / max) * 100);
        const prevValue = i > 0 ? stages[i - 1].value : null;
        const rate = prevValue && prevValue > 0
          ? Math.round((stage.value / prevValue) * 100)
          : null;

        return (
          <div key={stage.label} class="flex-1 flex flex-col items-center gap-1">
            {/* Conversion rate arrow */}
            {rate !== null && (
              <div class="text-[10px] text-[#52525b] font-medium mb-0.5">
                {rate}%
              </div>
            )}
            {rate === null && <div class="h-4" />}

            {/* Bar */}
            <div class="w-full flex justify-center">
              <div
                class="w-full max-w-[60px] rounded-t-md transition-all duration-500"
                style={{ height: `${height}px`, backgroundColor: stage.color, opacity: 0.85 }}
              />
            </div>

            {/* Value */}
            <div class="text-sm font-bold text-[#fafafa]">{stage.value}</div>

            {/* Label */}
            <div class="text-[10px] text-[#71717a] text-center leading-tight">{stage.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Horizontal Bar Chart ────────────────────────────────────────────────────

interface BarItem {
  label: string;
  value: number;
  color?: string;
}

const BAR_COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

export function HorizontalBarChart({ items, maxItems = 10 }: { items: BarItem[]; maxItems?: number }) {
  const visible = items.slice(0, maxItems);
  const max = Math.max(...visible.map(i => i.value), 1);

  return (
    <div class="space-y-2">
      {visible.map((item, i) => (
        <div key={item.label} class="flex items-center gap-2">
          <div class="w-28 sm:w-32 text-xs text-[#a1a1aa] truncate text-right shrink-0">{item.label}</div>
          <div class="flex-1 h-5 bg-[#27272a] rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(2, (item.value / max) * 100)}%`,
                backgroundColor: item.color || BAR_COLORS[i % BAR_COLORS.length],
              }}
            />
          </div>
          <div class="w-8 text-xs text-[#a1a1aa] text-right shrink-0">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Score Distribution ──────────────────────────────────────────────────────

interface ScoreDistProps {
  low: number;
  medium: number;
  high: number;
  labels: { low: string; medium: string; high: string };
}

export function ScoreDistribution({ low, medium, high, labels: l }: ScoreDistProps) {
  const total = low + medium + high || 1;
  const segments = [
    { label: l.high, value: high, color: '#10B981', pct: Math.round((high / total) * 100) },
    { label: l.medium, value: medium, color: '#F59E0B', pct: Math.round((medium / total) * 100) },
    { label: l.low, value: low, color: '#EF4444', pct: Math.round((low / total) * 100) },
  ];

  return (
    <div class="space-y-3">
      {/* Stacked bar */}
      <div class="h-6 flex rounded-full overflow-hidden bg-[#27272a]">
        {segments.map(s => s.value > 0 && (
          <div
            key={s.label}
            class="h-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
          >
            {s.pct >= 10 && <span class="text-[10px] font-bold text-white">{s.pct}%</span>}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div class="flex justify-center gap-4">
        {segments.map(s => (
          <div key={s.label} class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span class="text-xs text-[#a1a1aa]">{s.label}: <strong class="text-[#fafafa]">{s.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section Card ────────────────────────────────────────────────────────────

export function SectionCard({ title, children }: { title: string; children: any }) {
  return (
    <div class="bg-[#18181b] border border-[#27272a] rounded-xl p-5">
      <h2 class="text-sm font-semibold text-[#fafafa] mb-4">{title}</h2>
      {children}
    </div>
  );
}

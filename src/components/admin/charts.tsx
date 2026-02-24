// Admin chart components — pure CSS/SVG, no external libraries
// Follows 统计卡片.md + 图表组件.md design specs (dark mode adapted)

// ─── Icon SVG paths (inline, no external dependency) ─────────────────────────

const ICONS: Record<string, string> = {
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  'x-circle': '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3"/>',
  'bar-chart': '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
};

function IconSvg({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || ICONS['activity'] }}
    />
  );
}

// ─── Color System (dark mode adapted from spec) ──────────────────────────────

const STAT_COLORS: Record<string, { bg: string; text: string }> = {
  blue:   { bg: 'bg-blue-500/10',   text: 'text-blue-400'   },
  green:  { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  amber:  { bg: 'bg-amber-500/10',  text: 'text-amber-400'  },
  red:    { bg: 'bg-red-500/10',    text: 'text-red-400'    },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  cyan:   { bg: 'bg-cyan-500/10',   text: 'text-cyan-400'   },
  gray:   { bg: 'bg-zinc-500/10',   text: 'text-zinc-400'   },
  pink:   { bg: 'bg-pink-500/10',   text: 'text-pink-400'   },
};

// ─── StatCard (matches 统计卡片.md spec — dark mode) ─────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  const c = STAT_COLORS[color] || STAT_COLORS.blue;

  return (
    <div class="bg-[#18181b] border border-[#27272a] rounded-xl p-4 flex items-center gap-3">
      <div class={`w-9 h-9 rounded-lg ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
        <IconSvg name={icon} size={18} />
      </div>
      <div class="min-w-0">
        <div class="text-xl font-bold text-[#fafafa]">{value}</div>
        <div class="text-xs text-[#71717a] truncate">{label}</div>
      </div>
    </div>
  );
}

// ─── Funnel Chart ────────────────────────────────────────────────────────────

interface FunnelStage {
  label: string;
  value: number;
  color: string;
}

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(...stages.map(s => s.value), 1);

  return (
    <div class="flex items-end gap-2 sm:gap-3 py-2">
      {stages.map((stage, i) => {
        const height = Math.max(12, (stage.value / max) * 80);
        const prevValue = i > 0 ? stages[i - 1].value : null;
        const rate = prevValue && prevValue > 0
          ? Math.round((stage.value / prevValue) * 100)
          : null;

        return (
          <div key={stage.label} class="flex-1 flex flex-col items-center gap-1.5">
            {rate !== null && (
              <div class="text-[10px] text-[#52525b] font-medium">{rate}%</div>
            )}
            {rate === null && <div class="h-4" />}

            <div class="w-full flex justify-center">
              <div
                class="w-full max-w-[52px] rounded-t-md transition-all duration-500"
                style={{ height: `${height}px`, backgroundColor: stage.color, opacity: 0.8 }}
              />
            </div>

            <div class="text-sm font-bold text-[#fafafa]">{stage.value}</div>
            <div class="text-[10px] text-[#71717a] text-center leading-tight whitespace-nowrap">{stage.label}</div>
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
          <div class="flex-1 h-[18px] bg-[#27272a] rounded overflow-hidden">
            <div
              class="h-full rounded transition-all duration-500"
              style={{
                width: `${Math.max(1.5, (item.value / max) * 100)}%`,
                backgroundColor: item.color || BAR_COLORS[i % BAR_COLORS.length],
                opacity: 0.75,
              }}
            />
          </div>
          <div class="w-10 text-xs text-[#a1a1aa] text-right shrink-0 tabular-nums font-medium">{item.value}</div>
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

// ─── Donut Chart ─────────────────────────────────────────────────────────────

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({ segments, centerLabel }: { segments: DonutSegment[]; centerLabel?: string }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const size = 120;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div class="flex items-center gap-6">
      <div class="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#27272a" stroke-width={strokeWidth} />
          {segments.map(seg => {
            const pct = seg.value / total;
            const dashLen = pct * circumference;
            const dashOffset = -offset * circumference;
            offset += pct;
            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                stroke-width={strokeWidth}
                stroke-dasharray={`${dashLen} ${circumference - dashLen}`}
                stroke-dashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg>
        {centerLabel && (
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-lg font-bold text-[#fafafa]">{total}</span>
          </div>
        )}
      </div>
      <div class="space-y-2">
        {segments.map(seg => (
          <div key={seg.label} class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span class="text-xs text-[#a1a1aa]">{seg.label}</span>
            <span class="text-xs font-semibold text-[#fafafa] ml-1">
              {seg.value} ({Math.round((seg.value / total) * 100 * 10) / 10}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section Card ────────────────────────────────────────────────────────────

export function SectionCard({ title, children, action }: { title: string; children: any; action?: any }) {
  return (
    <div class="bg-[#18181b] border border-[#27272a] rounded-xl p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-[#fafafa]">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

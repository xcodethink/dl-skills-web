// Shared admin components: StatusBadge, RecommendBadge, InfoCell, Field

export default function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    // Green — healthy/active
    pending_analysis: 'bg-blue-500/15 text-blue-400 ring-blue-400/20',
    pending_review: 'bg-amber-500/15 text-amber-400 ring-amber-400/20',
    analyzed: 'bg-blue-500/15 text-blue-400 ring-blue-400/20',
    approved: 'bg-emerald-500/15 text-emerald-400 ring-emerald-400/20',
    translating: 'bg-violet-500/15 text-violet-400 ring-violet-400/20',
    translated: 'bg-violet-500/15 text-violet-400 ring-violet-400/20',
    published: 'bg-violet-500/15 text-violet-400 ring-violet-400/20',
    auto_rejected: 'bg-red-500/12 text-red-400 ring-red-400/20',
    rejected: 'bg-red-500/12 text-red-400 ring-red-400/20',
    active: 'bg-emerald-500/15 text-emerald-400 ring-emerald-400/20',
    pending: 'bg-amber-500/15 text-amber-400 ring-amber-400/20',
    running: 'bg-blue-500/15 text-blue-400 ring-blue-400/20',
    completed: 'bg-emerald-500/15 text-emerald-400 ring-emerald-400/20',
    failed: 'bg-red-500/12 text-red-400 ring-red-400/20',
  };

  const classes = colorMap[status] || 'bg-zinc-500/15 text-zinc-400 ring-zinc-400/20';

  return (
    <span class={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset ${classes}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function RecommendBadge({ rec }: { rec: string | null }) {
  if (!rec) return <span class="text-[#52525b] text-xs">—</span>;
  const colors: Record<string, string> = {
    ACCEPT: 'text-emerald-400',
    REVIEW: 'text-amber-400',
    REJECT: 'text-red-400',
  };
  return <span class={`text-xs font-semibold ${colors[rec] || 'text-[#71717a]'}`}>{rec}</span>;
}

export function InfoCell({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div class="bg-[#09090b] rounded-md p-3">
      <div class="text-[10px] text-[#52525b] uppercase tracking-wider mb-1">{label}</div>
      <div class="text-sm text-[#d4d4d8]">{value || '—'}</div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: any }) {
  return (
    <div class="mb-1">
      <label class="block text-[11px] text-[#71717a] uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

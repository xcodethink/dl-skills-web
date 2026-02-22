import { useState, useEffect } from 'preact/hooks';
import { labels, type AdminLang } from '../../lib/adminLabels';
import {
  fetchCandidate, approveCandidate, rejectCandidate, updateCandidate,
  scoreColor, scoreColorRaw, formatDate, type CandidateDetail,
} from '../../lib/adminApi';
import StatusBadge, { InfoCell, Field } from './shared';

interface Props {
  apiBase: string;
  lang: AdminLang;
  id: string;
}

const INPUT = 'w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-[#fafafa] outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors';

export default function DetailTab({ apiBase, lang, id }: Props) {
  const l = labels[lang];
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [tab, setTab] = useState<'content' | 'analysis' | 'overrides'>('content');

  useEffect(() => {
    setLoading(true);
    fetchCandidate(apiBase, id)
      .then(data => { setCandidate(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [apiBase, id]);

  const approve = async () => {
    setActionLoading(true);
    await approveCandidate(apiBase, id);
    setCandidate(c => c ? { ...c, status: 'approved' } : c);
    setActionLoading(false);
  };

  const reject = async () => {
    const reason = prompt(l.rejection_reason);
    setActionLoading(true);
    await rejectCandidate(apiBase, id, reason || undefined);
    setCandidate(c => c ? { ...c, status: 'rejected' } : c);
    setActionLoading(false);
  };

  const saveOverrides = async (overrides: Record<string, unknown>) => {
    await updateCandidate(apiBase, id, overrides);
    const data = await fetchCandidate(apiBase, id);
    setCandidate(data);
  };

  if (loading) {
    return (
      <div class="animate-pulse space-y-4">
        <div class="bg-[#18181b] rounded-xl h-8 w-48" />
        <div class="bg-[#18181b] rounded-xl h-4 w-96" />
        <div class="bg-[#18181b] rounded-xl h-64" />
      </div>
    );
  }

  if (!candidate) return <div class="text-[#52525b] text-center py-12">{l.loading}</div>;

  const analysis = candidate.analysis_json ? JSON.parse(candidate.analysis_json) : null;
  const scores = [
    { label: l.relevance, value: candidate.score_relevance, weight: '30%', rationale: analysis?.scores?.relevance?.rationale },
    { label: l.structure, value: candidate.score_structure, weight: '25%', rationale: analysis?.scores?.structure?.rationale },
    { label: l.actionability, value: candidate.score_actionability, weight: '20%', rationale: analysis?.scores?.actionability?.rationale },
    { label: l.uniqueness, value: candidate.score_uniqueness, weight: '15%', rationale: analysis?.scores?.uniqueness?.rationale },
    { label: l.completeness, value: candidate.score_completeness, weight: '10%', rationale: analysis?.scores?.completeness?.rationale },
  ];

  const tabs: Array<{ id: 'content' | 'analysis' | 'overrides'; labelKey: string }> = [
    { id: 'content', labelKey: 'tab_content' },
    { id: 'analysis', labelKey: 'tab_analysis' },
    { id: 'overrides', labelKey: 'tab_overrides' },
  ];

  return (
    <div class="space-y-5">
      {/* Header */}
      <div class="flex items-center gap-3 flex-wrap">
        <a href="#queue" class="text-[#71717a] text-sm no-underline hover:text-[#a1a1aa] transition-colors">
          ← {l.back_to_queue}
        </a>
        <span class="text-[#27272a]">|</span>
        <span class="text-sm font-semibold">{candidate.source_path}</span>
        <StatusBadge status={candidate.status} />
        {candidate.score_weighted != null && (
          <span class={`text-sm font-bold ${scoreColor(candidate.score_weighted)}`}>
            {candidate.score_weighted.toFixed(1)}
          </span>
        )}
      </div>

      {/* Meta */}
      <div class="flex gap-4 text-sm text-[#71717a] flex-wrap">
        <span>{l.source}: <strong class="text-[#a1a1aa]">{candidate.source_id}</strong></span>
        <span>{l.format}: {candidate.format}</span>
        <span>{l.tokens}: ~{candidate.raw_token_count}</span>
        <span>{l.created}: {formatDate(candidate.created_at)}</span>
      </div>

      {/* Actions */}
      {['pending_review', 'analyzed'].includes(candidate.status) && (
        <div class="flex gap-2">
          <button
            onClick={approve}
            disabled={actionLoading}
            class="px-4 py-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors"
          >
            {l.approve}
          </button>
          <button
            onClick={reject}
            disabled={actionLoading}
            class="px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-500 text-white disabled:opacity-50 transition-colors"
          >
            {l.reject}
          </button>
        </div>
      )}

      {/* Tab switcher */}
      <div class="flex gap-1 border-b border-[#27272a]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            class={`px-4 py-2 text-sm font-medium transition-colors border-b-2
              ${tab === t.id
                ? 'border-[#8B5CF6] text-[#fafafa]'
                : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
              }`}
          >
            {l[t.labelKey]}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {tab === 'content' && (
        <div class="bg-[#18181b] border border-[#27272a] rounded-xl p-5">
          <div class="flex gap-4 mb-3 flex-wrap">
            {candidate.summary_en && <div class="text-sm text-[#a1a1aa]">EN: {candidate.summary_en}</div>}
            {candidate.summary_cn && <div class="text-sm text-[#a1a1aa]">CN: {candidate.summary_cn}</div>}
          </div>
          <pre class="text-xs leading-relaxed text-[#d4d4d8] bg-[#09090b] p-4 rounded-md overflow-auto max-h-[600px] whitespace-pre-wrap">
            {candidate.raw_markdown}
          </pre>
        </div>
      )}

      {/* Analysis tab */}
      {tab === 'analysis' && (
        <div class="bg-[#18181b] border border-[#27272a] rounded-xl p-5">
          {!analysis ? (
            <div class="text-[#52525b]">{l.no_analysis}</div>
          ) : (
            <div class="space-y-6">
              {/* Score bars */}
              <div class="space-y-3">
                {scores.map(s => (
                  <div key={s.label}>
                    <div class="flex justify-between text-xs mb-1">
                      <span class="text-[#a1a1aa]">{s.label} ({s.weight})</span>
                      <span class="font-semibold" style={{ color: scoreColorRaw(s.value) }}>{s.value ?? '—'}</span>
                    </div>
                    <div class="h-1.5 bg-[#27272a] rounded-full">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        style={{ background: scoreColorRaw(s.value), width: `${(s.value ?? 0) * 10}%` }}
                      />
                    </div>
                    {s.rationale && <div class="text-[11px] text-[#52525b] mt-1">{s.rationale}</div>}
                  </div>
                ))}
              </div>

              {/* AI suggestion grid */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCell label={l.category} value={analysis.suggested_category} />
                <InfoCell label={l.type} value={analysis.suggested_type} />
                <InfoCell label={l.difficulty} value={analysis.suggested_difficulty} />
                <InfoCell label={l.recommendation} value={analysis.recommendation} />
                <InfoCell label={l.tags} value={(analysis.suggested_tags || []).join(', ')} />
                {analysis.duplicate_of && <InfoCell label={l.duplicate_of} value={analysis.duplicate_of} />}
                {analysis.rejection_reason && <InfoCell label={l.rejection_label} value={analysis.rejection_reason} />}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overrides tab */}
      {tab === 'overrides' && (
        <OverridesForm candidate={candidate} onSave={saveOverrides} lang={lang} />
      )}
    </div>
  );
}

// ─── Overrides Form ───────────────────────────────────────────────────────

function OverridesForm({ candidate, onSave, lang }: {
  candidate: CandidateDetail;
  onSave: (o: Record<string, unknown>) => Promise<void>;
  lang: AdminLang;
}) {
  const l = labels[lang];
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

  const selectClass = INPUT;

  return (
    <form onSubmit={submit} class="bg-[#18181b] border border-[#27272a] rounded-xl p-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label={l.override_category}>
          <select value={values.override_category} onChange={(e: any) => update('override_category', e.target.value)} class={selectClass}>
            <option value="">{l.use_ai_suggestion}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label={l.override_type}>
          <select value={values.override_type} onChange={(e: any) => update('override_type', e.target.value)} class={selectClass}>
            <option value="">{l.use_ai_suggestion}</option>
            {['discipline', 'tool', 'process', 'reference'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label={l.override_difficulty}>
          <select value={values.override_difficulty} onChange={(e: any) => update('override_difficulty', e.target.value)} class={selectClass}>
            <option value="">{l.use_ai_suggestion}</option>
            {['starter', 'intermediate', 'advanced'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label={l.override_tags}>
          <input value={values.override_tags} onInput={(e: any) => update('override_tags', e.target.value)} class={INPUT} placeholder='["tag1","tag2"]' />
        </Field>
        <Field label={l.name_cn}>
          <input value={values.override_name_cn} onInput={(e: any) => update('override_name_cn', e.target.value)} class={INPUT} />
        </Field>
        <Field label={l.name_en}>
          <input value={values.override_name_en} onInput={(e: any) => update('override_name_en', e.target.value)} class={INPUT} />
        </Field>
        <Field label={l.highlight_cn}>
          <input value={values.override_highlight_cn} onInput={(e: any) => update('override_highlight_cn', e.target.value)} class={INPUT} />
        </Field>
        <Field label={l.highlight_en}>
          <input value={values.override_highlight_en} onInput={(e: any) => update('override_highlight_en', e.target.value)} class={INPUT} />
        </Field>
      </div>
      <Field label={l.review_notes}>
        <textarea
          value={values.review_notes}
          onInput={(e: any) => update('review_notes', e.target.value)}
          rows={3}
          class={`${INPUT} resize-y`}
        />
      </Field>
      <button
        type="submit"
        disabled={saving}
        class="mt-4 px-4 py-2 rounded-md text-sm font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white disabled:opacity-50 transition-colors"
      >
        {saving ? l.saving : l.save_overrides}
      </button>
    </form>
  );
}

import { useState, useEffect } from 'preact/hooks';
import { labels, type AdminLang } from '../../lib/adminLabels';
import { fetchSources, addSource, updateSource, formatDate, scoreColor, type Source } from '../../lib/adminApi';
import StatusBadge, { Field } from './shared';

const INPUT = 'w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-[#fafafa] outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors';

interface Props {
  apiBase: string;
  lang: AdminLang;
}

export default function SourcesTab({ apiBase, lang }: Props) {
  const l = labels[lang];
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reload = async () => {
    const fresh = await fetchSources(apiBase);
    setSources(fresh.data || []);
  };

  useEffect(() => {
    fetchSources(apiBase)
      .then(data => { setSources(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [apiBase]);

  const handleAdd = async (data: { id: string; url: string; skill_pattern: string }) => {
    await addSource(apiBase, data);
    await reload();
    setShowAdd(false);
  };

  const handleArchive = async (id: string) => {
    if (!confirm(l.delete_confirm_message)) return;
    await updateSource(apiBase, id, { status: 'archived' });
    await reload();
  };

  const handleEditSave = async (id: string, data: Record<string, unknown>) => {
    await updateSource(apiBase, id, data);
    await reload();
    setEditingId(null);
  };

  if (loading) {
    return (
      <div class="animate-pulse space-y-3">
        <div class="bg-[#18181b] rounded-xl h-10 w-48" />
        {[...Array(3)].map((_, i) => <div key={i} class="bg-[#18181b] rounded-xl h-12" />)}
      </div>
    );
  }

  const isStale = (s: Source) => {
    if (!s.last_checked_at) return false;
    const daysSince = (Date.now() - new Date(s.last_checked_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 30;
  };

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex justify-between items-center">
        <h1 class="text-lg font-bold">{l.sources_title}</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          class="px-4 py-2 rounded-md text-sm font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors"
        >
          {showAdd ? l.cancel : l.add_source}
        </button>
      </div>

      {/* Add form */}
      {showAdd && <AddSourceForm onAdd={handleAdd} lang={lang} />}

      {/* Table */}
      <div class="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-[#27272a]">
                <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.repository}</th>
                <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.pattern}</th>
                <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.status}</th>
                <th class="text-center text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.candidates}</th>
                <th class="text-center text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.approved_col}</th>
                <th class="text-center text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.avg_score_col}</th>
                <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.last_checked}</th>
                <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.via}</th>
                <th class="text-center text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2.5 px-3">{l.actions}</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(s => (
                <tr key={s.id} class="border-b border-[#1e1e21]">
                  <td class="py-2.5 px-3 text-sm">
                    <a href={s.url} target="_blank" rel="noopener" class="text-[#8B5CF6] no-underline hover:underline">{s.id}</a>
                  </td>
                  <td class="py-2.5 px-3 text-xs text-[#71717a] font-mono">{s.skill_pattern || '—'}</td>
                  <td class="py-2.5 px-3">
                    <div class="flex items-center gap-1.5">
                      <StatusBadge status={s.status} />
                      {isStale(s) && (
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-400/20">
                          {l.source_stale}
                        </span>
                      )}
                    </div>
                  </td>
                  <td class="py-2.5 px-3 text-sm text-center">{s.candidate_count}</td>
                  <td class="py-2.5 px-3 text-sm text-center text-emerald-400">{s.approved_count || 0}</td>
                  <td class={`py-2.5 px-3 text-sm text-center font-semibold ${scoreColor(s.avg_score)}`}>
                    {s.avg_score?.toFixed(1) || '—'}
                  </td>
                  <td class="py-2.5 px-3 text-xs text-[#71717a]">{s.last_checked_at ? formatDate(s.last_checked_at) : l.never}</td>
                  <td class="py-2.5 px-3 text-xs text-[#52525b]">{s.discovered_via || '—'}</td>
                  <td class="py-2.5 px-3 text-center">
                    <div class="flex justify-center gap-1">
                      <button
                        onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                        class="px-2 py-1 text-[11px] text-[#a1a1aa] hover:text-[#8B5CF6] transition-colors"
                      >
                        {l.edit}
                      </button>
                      {s.status !== 'archived' && (
                        <button
                          onClick={() => handleArchive(s.id)}
                          class="px-2 py-1 text-[11px] text-[#52525b] hover:text-red-400 transition-colors"
                        >
                          {l.archive}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline edit form */}
      {editingId && (
        <EditSourceForm
          source={sources.find(s => s.id === editingId)!}
          onSave={(data) => handleEditSave(editingId, data)}
          onCancel={() => setEditingId(null)}
          lang={lang}
        />
      )}
    </div>
  );
}

// ─── Add Source Form ──────────────────────────────────────────────────────

function AddSourceForm({ onAdd, lang }: {
  onAdd: (s: { id: string; url: string; skill_pattern: string }) => Promise<void>;
  lang: AdminLang;
}) {
  const l = labels[lang];
  const [id, setId] = useState('');
  const [url, setUrl] = useState('');
  const [pattern, setPattern] = useState('**/*.md');
  const [saving, setSaving] = useState(false);

  const onUrlChange = (val: string) => {
    setUrl(val);
    const m = val.match(/github\.com\/([\w.-]+\/[\w.-]+)/);
    if (m && !id) setId(m[1]);
  };

  const submit = async (e: Event) => {
    e.preventDefault();
    if (!id || !url) return;
    setSaving(true);
    await onAdd({ id, url, skill_pattern: pattern });
    setSaving(false);
  };

  return (
    <form onSubmit={submit} class="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <Field label={l.repo_url}>
          <input value={url} onInput={(e: any) => onUrlChange(e.target.value)} placeholder="https://github.com/owner/repo" class={INPUT} />
        </Field>
        <Field label={l.repo_id}>
          <input value={id} onInput={(e: any) => setId(e.target.value)} placeholder="owner/repo" class={INPUT} />
        </Field>
        <Field label={l.skill_pattern}>
          <input value={pattern} onInput={(e: any) => setPattern(e.target.value)} placeholder="**/*.md" class={INPUT} />
        </Field>
      </div>
      <button
        type="submit"
        disabled={saving || !id || !url}
        class="px-4 py-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors"
      >
        {saving ? l.adding : l.add}
      </button>
    </form>
  );
}

// ─── Edit Source Form ────────────────────────────────────────────────────

function EditSourceForm({ source, onSave, onCancel, lang }: {
  source: Source;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  lang: AdminLang;
}) {
  const l = labels[lang];
  const [pattern, setPattern] = useState(source.skill_pattern || '');
  const [notes, setNotes] = useState(source.notes || '');
  const [saving, setSaving] = useState(false);

  const submit = async (e: Event) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ skill_pattern: pattern || null, notes: notes || null });
    setSaving(false);
  };

  return (
    <form onSubmit={submit} class="bg-[#18181b] border border-[#8B5CF6]/30 rounded-xl p-4">
      <h3 class="text-sm font-semibold text-[#fafafa] mb-3">{l.edit_source}: {source.id}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field label={l.skill_pattern}>
          <input value={pattern} onInput={(e: any) => setPattern(e.target.value)} class={INPUT} />
        </Field>
        <Field label={l.notes}>
          <input value={notes} onInput={(e: any) => setNotes(e.target.value)} class={INPUT} />
        </Field>
      </div>
      <div class="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          class="px-4 py-2 rounded-md text-sm font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white disabled:opacity-50 transition-colors"
        >
          {saving ? l.saving : l.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          class="px-4 py-2 rounded-md text-sm font-medium border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
        >
          {l.cancel}
        </button>
      </div>
    </form>
  );
}

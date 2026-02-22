import { useState, useEffect } from 'preact/hooks';
import { labels, type AdminLang } from '../../lib/adminLabels';
import { fetchSettings, formatDate, type SettingsInfo } from '../../lib/adminApi';
import StatusBadge from './shared';
import { SectionCard } from './charts';

interface Props {
  apiBase: string;
  lang: AdminLang;
}

export default function SettingsTab({ apiBase, lang }: Props) {
  const l = labels[lang];
  const [settings, setSettings] = useState<SettingsInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings(apiBase)
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiBase]);

  if (loading) {
    return (
      <div class="animate-pulse space-y-4">
        <div class="bg-[#18181b] rounded-xl h-8 w-32" />
        <div class="bg-[#18181b] rounded-xl h-40" />
        <div class="bg-[#18181b] rounded-xl h-32" />
      </div>
    );
  }

  if (!settings) return <div class="text-[#52525b] text-center py-12">{l.loading}</div>;

  const tables = [
    { name: 'sources', count: settings.tables.sources },
    { name: 'candidates', count: settings.tables.candidates },
    { name: 'discovery_runs', count: settings.tables.discovery_runs },
  ];

  return (
    <div class="space-y-6">
      <h1 class="text-lg font-bold">{l.settings_title}</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System info */}
        <SectionCard title={l.system_info}>
          <div class="space-y-4">
            <div class="text-xs text-[#52525b] font-mono mb-4">{l.pipeline_version}</div>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b border-[#27272a]">
                    <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.table_name}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.row_count}</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map(t => (
                    <tr key={t.name} class="border-b border-[#1e1e21]">
                      <td class="py-2 text-sm font-mono text-[#a1a1aa]">{t.name}</td>
                      <td class="py-2 text-sm text-right font-semibold text-[#fafafa]">{t.count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>

        {/* Last run by channel */}
        <SectionCard title={l.last_run_by_channel}>
          {settings.lastRunByChannel.length === 0 ? (
            <div class="text-sm text-[#52525b]">{l.no_runs}</div>
          ) : (
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b border-[#27272a]">
                    <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.channel}</th>
                    <th class="text-left text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.last_run}</th>
                    <th class="text-right text-[11px] font-medium text-[#71717a] uppercase tracking-wider py-2">{l.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.lastRunByChannel.map(ch => (
                    <tr key={ch.channel} class="border-b border-[#1e1e21]">
                      <td class="py-2 text-sm text-[#a1a1aa]">{ch.channel}</td>
                      <td class="py-2 text-xs text-[#71717a]">{formatDate(ch.started_at)}</td>
                      <td class="py-2 text-right"><StatusBadge status={ch.status} /></td>
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

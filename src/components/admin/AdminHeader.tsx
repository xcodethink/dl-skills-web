import { labels, setAdminLang, type AdminLang } from '../../lib/adminLabels';
import { iconPaths } from '../icons';
import type { View } from './AdminSidebar';

function SvgIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      class={className || 'w-4 h-4'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      innerHTML={iconPaths[name] || ''}
    />
  );
}

const viewTitleKeys: Record<string, string> = {
  dash: 'dash_title',
  pipeline: 'pipeline_title',
  queue: 'queue_title',
  published: 'published_title',
  sources: 'sources_title',
  settings: 'settings_title',
  detail: 'tab_content',
};

interface Props {
  activeView: View;
  lang: AdminLang;
  onLangChange: (lang: AdminLang) => void;
  onMenuToggle: () => void;
  onLogout: () => void;
}

export default function AdminHeader({ activeView, lang, onLangChange, onMenuToggle, onLogout }: Props) {
  const l = labels[lang];

  const switchLang = (newLang: AdminLang) => {
    setAdminLang(newLang);
    onLangChange(newLang);
  };

  return (
    <header class="h-12 shrink-0 border-b border-[#1e1e21] bg-[#09090b] px-4 flex items-center gap-4">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        class="lg:hidden p-1 text-[#71717a] hover:text-[#fafafa] transition-colors"
      >
        <SvgIcon name="menu" className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 class="text-sm font-semibold text-[#fafafa] flex-1">
        {l[viewTitleKeys[activeView]] || ''}
      </h1>

      {/* Language toggle */}
      <div class="flex bg-[#27272a] rounded-md p-0.5">
        <button
          onClick={() => switchLang('en')}
          class={`px-2.5 py-1 text-xs font-medium rounded transition-colors
            ${lang === 'en'
              ? 'bg-[#3f3f46] text-[#fafafa] shadow-sm'
              : 'text-[#71717a] hover:text-[#a1a1aa]'
            }`}
        >
          EN
        </button>
        <button
          onClick={() => switchLang('zh')}
          class={`px-2.5 py-1 text-xs font-medium rounded transition-colors
            ${lang === 'zh'
              ? 'bg-[#3f3f46] text-[#fafafa] shadow-sm'
              : 'text-[#71717a] hover:text-[#a1a1aa]'
            }`}
        >
          中文
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        class="flex items-center gap-1.5 text-xs text-[#52525b] hover:text-red-400 transition-colors"
      >
        <SvgIcon name="log-out" className="w-3.5 h-3.5" />
        {l.logout}
      </button>
    </header>
  );
}

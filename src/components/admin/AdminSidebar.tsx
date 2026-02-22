import { labels, type AdminLang } from '../../lib/adminLabels';
import { iconPaths } from '../icons';

export type View = 'dash' | 'pipeline' | 'queue' | 'published' | 'sources' | 'settings' | 'detail';

interface NavItem {
  id: View;
  labelKey: string;
  icon: string;
  hash: string;
}

interface NavGroup {
  labelKey: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    labelKey: 'nav_group_operations',
    items: [
      { id: 'dash', labelKey: 'nav_dashboard', icon: 'bar-chart', hash: '#dash' },
      { id: 'pipeline', labelKey: 'nav_pipeline', icon: 'activity', hash: '#pipeline' },
    ],
  },
  {
    labelKey: 'nav_group_content',
    items: [
      { id: 'queue', labelKey: 'nav_queue', icon: 'clipboard-list', hash: '#queue' },
      { id: 'published', labelKey: 'nav_published', icon: 'check-circle', hash: '#published' },
    ],
  },
  {
    labelKey: 'nav_group_management',
    items: [
      { id: 'sources', labelKey: 'nav_sources', icon: 'github', hash: '#sources' },
      { id: 'settings', labelKey: 'nav_settings', icon: 'settings', hash: '#settings' },
    ],
  },
];

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

interface Props {
  activeView: View;
  onNavigate: (view: View) => void;
  open: boolean;
  onClose: () => void;
  lang: AdminLang;
}

export default function AdminSidebar({ activeView, onNavigate, open, onClose, lang }: Props) {
  const l = labels[lang];

  const handleClick = (item: NavItem) => {
    location.hash = item.hash;
    onNavigate(item.id);
    onClose();
  };

  const sidebar = (
    <aside class="flex flex-col w-56 h-screen bg-[#09090b] border-r border-[#1e1e21] overflow-y-auto">
      {/* Brand */}
      <div class="h-14 px-4 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <SvgIcon name="shield" className="w-5 h-5 text-[#8B5CF6]" />
          <span class="text-sm font-bold text-[#8B5CF6] tracking-tight">{l.brand}</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          class="lg:hidden p-1 text-[#52525b] hover:text-[#fafafa] transition-colors"
        >
          <SvgIcon name="x" className="w-4 h-4" />
        </button>
      </div>

      {/* Nav groups */}
      <nav class="flex-1 px-2 pb-4">
        {navGroups.map((group) => (
          <div key={group.labelKey}>
            <div class="text-[11px] font-medium text-[#52525b] uppercase tracking-wider mt-6 mb-1 px-3">
              {l[group.labelKey]}
            </div>
            {group.items.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item)}
                  class={`w-full flex items-center gap-2.5 py-2 px-3 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-[#27272a] text-[#8B5CF6] border-l-2 border-[#8B5CF6] -ml-[2px] pl-[14px]'
                      : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
                    }`}
                >
                  <SvgIcon name={item.icon} className="w-4 h-4 shrink-0" />
                  {l[item.labelKey]}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Desktop — always visible */}
      <div class="hidden lg:block shrink-0">
        {sidebar}
      </div>

      {/* Mobile — overlay drawer */}
      <div class={`lg:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          class={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
        />
        {/* Drawer */}
        <div class={`absolute inset-y-0 left-0 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          {sidebar}
        </div>
      </div>
    </>
  );
}

import { useState, useMemo, useEffect, useRef } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { iconPaths } from './icons';
import { t } from '../i18n/translations';
import type { Lang } from '../i18n/translations';

// --- Types ---

interface SkillSummary {
  id: string;
  title_cn: string;
  title_en: string;
  highlight_cn: string;
  highlight_en: string;
  tags: string[];
  type: string;
  verified: boolean;
  source: string;
  slug_cn: string;
  slug_en?: string;
  unifiedCategory: string;
  estimatedReadMinutes: number;
  compatibleWith: string[];
  views: number;
  copies: number;
  invocations: number;
}

interface CategoryInfo {
  id: string;
  name_cn: string;
  name_en: string;
  icon: string;
  phase: 'pipeline' | 'specialist';
  order: number;
  scene: string;
  skillCount?: number;
}

interface SceneInfo {
  id: string;
  name_cn: string;
  name_en: string;
  icon: string;
}

interface ResolvedSkillSummary {
  title_cn: string;
  title_en: string;
  source: string;
  slug_cn: string;
  slug_en?: string;
  rawContent: string;
}

interface WorkflowStepSummary {
  id: string;
  name_cn: string;
  name_en: string;
  mode: string;
  description_cn: string;
  description_en: string;
  quality_cn: string;
  quality_en: string;
  verification_cn: string;
  verification_en: string;
  skillCount: number;
  resolvedSkills: ResolvedSkillSummary[];
}

interface WorkflowSummary {
  id: string;
  name_cn: string;
  name_en: string;
  description_cn: string;
  description_en: string;
  icon: string;
  coverage: 'full' | 'partial';
  entry_cn: string;
  entry_en: string;
  exit_cn: string;
  exit_en: string;
  stepCount: number;
  steps: WorkflowStepSummary[];
}

type ActiveView = 'skills' | 'workflows';

interface Props {
  skills: SkillSummary[];
  contentMap: Record<string, string>;
  categories: CategoryInfo[];
  scenes: SceneInfo[];
  workflows?: WorkflowSummary[];
}

// --- Constants ---

const MCP_CONFIG = JSON.stringify({
  "claude-code-skills": {
    type: "url",
    url: "https://claudecodeskills.wayjet.io/mcp",
  }
}, null, 2);

const NAV_TAB_IDS: { id: ActiveView | 'setup' | 'about'; icon: string }[] = [
  { id: 'skills', icon: 'sparkles' },
  { id: 'workflows', icon: 'rocket' },
  { id: 'setup', icon: 'zap' },
  { id: 'about', icon: 'info' },
];

const NAV_TAB_KEYS: Record<string, { cn: string; en: string }> = {
  skills: { cn: '技能', en: 'Skills' },
  workflows: { cn: '工作流', en: 'Workflows' },
  setup: { cn: '接入', en: 'Setup' },
  about: { cn: '关于', en: 'About' },
};

// --- Helpers ---

function IconSvg({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
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
      class={className}
      dangerouslySetInnerHTML={{ __html: iconPaths[name] || iconPaths['code'] }}
    />
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

/** Select bilingual field by lang */
function pick<T extends Record<string, any>>(obj: T, field: string, lang: Lang): string {
  return (lang === 'cn' ? obj[`${field}_cn`] : obj[`${field}_en`]) || obj[`${field}_cn`] || '';
}

function CopyBtn({ text, label, copiedLabel, variant = 'primary' }: { text: string; label: string; copiedLabel: string; variant?: 'primary' | 'secondary' }) {
  const [copied, setCopied] = useState(false);
  const handle = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const cls = variant === 'primary'
    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30'
    : 'bg-surface-alt text-text-secondary hover:text-accent hover:bg-accent-muted border border-border/60 hover:border-accent/30';
  return (
    <button
      onClick={handle}
      class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${cls}`}
    >
      <IconSvg name={copied ? 'check' : 'copy'} size={12} />
      {copied ? copiedLabel : label}
    </button>
  );
}

// --- Setup Modal ---

function SetupModal({ onClose, skillCount, lang }: { onClose: () => void; skillCount: number; lang: Lang }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div class="relative bg-surface rounded-2xl border border-border/60 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-bold text-text-primary">{t(lang, 'setup.quickGuide')}</h3>
            <button onClick={onClose} class="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-alt cursor-pointer">
              <IconSvg name="x" size={18} />
            </button>
          </div>

          <div class="space-y-5">
            <div class="flex items-start gap-3">
              <span class="shrink-0 w-7 h-7 rounded-lg bg-accent-muted text-accent text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p class="text-sm font-medium text-text-primary">{t(lang, 'setup.openConfig')}</p>
                <p class="text-xs text-text-secondary mt-1">
                  {t(lang, 'setup.editFile')} <code class="bg-surface-alt px-1.5 py-0.5 rounded-md font-mono border border-border/60">~/.claude/settings.json</code>
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="shrink-0 w-7 h-7 rounded-lg bg-accent-muted text-accent text-xs font-bold flex items-center justify-center">2</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text-primary">{t(lang, 'setup.addMcp')}</p>
                <p class="text-xs text-text-secondary mt-1 mb-2">{t(lang, 'setup.addInstructions')}</p>
                <div class="relative bg-[#1C1917] text-gray-100 rounded-xl p-4 font-mono text-xs border border-white/[0.06]">
                  <pre class="overflow-x-auto whitespace-pre">{MCP_CONFIG}</pre>
                  <div class="absolute top-2 right-2">
                    <CopyBtn text={MCP_CONFIG} label="Copy" copiedLabel={t(lang, 'ui.copied')} variant="secondary" />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="shrink-0 w-7 h-7 rounded-lg bg-accent-muted text-accent text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p class="text-sm font-medium text-text-primary">{t(lang, 'setup.restart')}</p>
                <p class="text-xs text-text-secondary mt-1">{skillCount} {t(lang, 'setup.autoActivate')}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
            <a href="/setup" class="text-xs text-accent hover:text-accent-hover">
              {t(lang, 'ui.viewGuide')}
            </a>
            <button onClick={onClose} class="px-4 py-2 rounded-xl text-sm font-medium bg-surface-alt text-text-secondary hover:bg-accent-muted hover:text-accent border border-border/60 cursor-pointer">
              {t(lang, 'ui.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function Workspace({ skills, contentMap, categories, scenes, workflows = [] }: Props) {
  // Language state
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'cn';
    const stored = localStorage.getItem('lang');
    if (stored === 'cn' || stored === 'en') return stored;
    return navigator.language.startsWith('zh') ? 'cn' : 'en';
  });

  // Listen for language changes from Base.astro toggle
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === 'cn' || detail === 'en') setLang(detail);
    };
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  // State
  const [activeView, setActiveView] = useState<ActiveView>('skills');
  const [selectedScene, setSelectedScene] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'cc' | 'general'>('all');
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [navSlot, setNavSlot] = useState<HTMLElement | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  // Find portal target after mount
  useEffect(() => {
    setNavSlot(document.getElementById('workspace-nav-slot'));
  }, []);

  // Categories for current scene
  const sceneCats = useMemo(() => {
    if (selectedScene === 'all') {
      return categories.filter(c => (c.skillCount || 0) > 0).sort((a, b) => a.order - b.order);
    }
    return categories
      .filter(c => c.scene === selectedScene && (c.skillCount || 0) > 0)
      .sort((a, b) => a.order - b.order);
  }, [categories, selectedScene]);

  // Skill count for current scene
  const sceneSkillCount = useMemo(() => {
    if (selectedScene === 'all') return skills.length;
    const catIds = new Set(categories.filter(c => c.scene === selectedScene).map(c => c.id));
    return skills.filter(s => catIds.has(s.unifiedCategory)).length;
  }, [skills, categories, selectedScene]);

  // Featured skills for carousel
  const featured = useMemo(() => {
    const seen = new Set<string>();
    const picks: SkillSummary[] = [];
    for (const s of skills) {
      if (s.verified && (s.highlight_cn || s.highlight_en) && !seen.has(s.unifiedCategory) && picks.length < 5) {
        picks.push(s);
        seen.add(s.unifiedCategory);
      }
    }
    return picks;
  }, [skills]);

  // Carousel auto-rotate
  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => setCarouselIdx(i => (i + 1) % featured.length), 3000);
    return () => clearInterval(timer);
  }, [featured.length]);

  // Platform stats (CC vs General)
  const ccCount = useMemo(() => skills.filter(s => s.compatibleWith.includes('claude-code') && !s.compatibleWith.includes('any')).length, [skills]);
  const generalCount = useMemo(() => skills.length - ccCount, [skills, ccCount]);

  // Filtered skills (scene → category → platform → search)
  const filteredSkills = useMemo(() => {
    let r = skills;
    // Scene filter
    if (selectedScene !== 'all') {
      const catIds = new Set(categories.filter(c => c.scene === selectedScene).map(c => c.id));
      r = r.filter(s => catIds.has(s.unifiedCategory));
    }
    // Category filter
    if (selectedCategory) {
      r = r.filter(s => s.unifiedCategory === selectedCategory);
    }
    // Platform filter
    if (platformFilter === 'cc') {
      r = r.filter(s => s.compatibleWith.includes('claude-code') && !s.compatibleWith.includes('any'));
    } else if (platformFilter === 'general') {
      r = r.filter(s => s.compatibleWith.includes('any') || !s.compatibleWith.includes('claude-code'));
    }
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(s =>
        s.title_cn.toLowerCase().includes(q) ||
        s.title_en.toLowerCase().includes(q) ||
        s.highlight_cn.toLowerCase().includes(q) ||
        s.highlight_en.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return r;
  }, [skills, categories, selectedScene, selectedCategory, platformFilter, searchQuery]);

  // Grouped skills (for browsing without search/category filter)
  const groupedSkills = useMemo(() => {
    if (selectedCategory || searchQuery.trim()) return [];
    return sceneCats
      .map(cat => ({
        ...cat,
        skills: skills.filter(s => s.unifiedCategory === cat.id),
      }))
      .filter(g => g.skills.length > 0);
  }, [sceneCats, skills, selectedCategory, searchQuery]);

  const isGroupedView = !selectedCategory && !searchQuery.trim();

  // URL hash sync — read on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'workflows') {
      setActiveView('workflows');
    } else if (hash.startsWith('workflows/')) {
      const wfId = hash.split('/')[1];
      if (wfId && workflows.some(w => w.id === wfId)) {
        setActiveView('workflows');
        setSelectedWorkflow(wfId);
      } else {
        setActiveView('workflows');
      }
    } else if (hash) {
      const scene = scenes.find(s => s.id === hash);
      if (scene) {
        setSelectedScene(hash);
      } else {
        const [scenePart, catPart] = hash.split('/');
        const sceneMatch = scenes.find(s => s.id === scenePart);
        if (sceneMatch && catPart) {
          setSelectedScene(scenePart);
          setSelectedCategory(catPart);
        } else if (categories.some(c => c.id === hash)) {
          const cat = categories.find(c => c.id === hash);
          if (cat) {
            setSelectedScene(cat.scene);
            setSelectedCategory(cat.id);
          }
        }
      }
    }
  }, []);

  // URL hash sync — write on state change
  useEffect(() => {
    if (activeView === 'workflows') {
      if (selectedWorkflow) {
        window.history.replaceState(null, '', `#workflows/${selectedWorkflow}`);
      } else {
        window.history.replaceState(null, '', '#workflows');
      }
    } else if (selectedScene !== 'all' && selectedCategory) {
      window.history.replaceState(null, '', `#${selectedScene}/${selectedCategory}`);
    } else if (selectedScene !== 'all') {
      window.history.replaceState(null, '', `#${selectedScene}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [selectedScene, selectedCategory, activeView, selectedWorkflow]);

  // ⌘K shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (activeView !== 'skills') setActiveView('skills');
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && !showSetupModal) {
        setSearchQuery('');
        searchRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showSetupModal, activeView]);

  // Handlers
  const pickScene = (sceneId: string) => {
    setSelectedScene(sceneId);
    setSelectedCategory(null);
    setActiveSectionId(null);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const pickCategory = (id: string | null) => {
    setSelectedCategory(id);
    setActiveSectionId(null);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const scrollToSection = (catId: string) => {
    setActiveSectionId(catId);
    const el = document.getElementById(`section-${catId}`);
    if (el && scrollRef.current) {
      const container = scrollRef.current;
      const elTop = el.offsetTop - container.offsetTop;
      container.scrollTo({ top: elTop, behavior: 'smooth' });
    }
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === 'setup') {
      setShowSetupModal(true);
    } else if (tabId === 'about') {
      window.location.href = '/about';
    } else {
      setActiveView(tabId as ActiveView);
      if (tabId === 'workflows') setSelectedWorkflow(null);
      scrollRef.current?.scrollTo({ top: 0 });
    }
  };

  // Language toggle handler
  const handleLangToggle = () => {
    const next: Lang = lang === 'cn' ? 'en' : 'cn';
    setLang(next);
    localStorage.setItem('lang', next);
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next === 'cn' ? 'zh-CN' : 'en';
  };

  // Close mobile nav on escape
  useEffect(() => {
    if (!mobileNavOpen) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileNavOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [mobileNavOpen]);

  // --- Nav Tabs (rendered via portal into Base.astro nav bar) ---
  const navTabs = (
    <div class="flex items-center gap-0.5 md:gap-1">
      {/* Desktop: horizontal nav tabs */}
      <div class="hidden md:flex items-center gap-1">
        {NAV_TAB_IDS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            class={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              (tab.id === 'skills' && activeView === 'skills') || (tab.id === 'workflows' && activeView === 'workflows')
                ? 'text-accent bg-accent-muted'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
            }`}
          >
            <IconSvg name={tab.icon} size={14} />
            {NAV_TAB_KEYS[tab.id][lang]}
          </button>
        ))}
        <div class="w-px h-4 bg-border/40 mx-1" />
      </div>

      {/* Mobile: hamburger button */}
      <button
        onClick={() => setMobileNavOpen(true)}
        class="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-alt/80 transition-all duration-200 cursor-pointer"
        aria-label="Open menu"
      >
        <IconSvg name="menu" size={20} />
      </button>

      <button
        onClick={handleLangToggle}
        class="px-2 py-1.5 rounded-xl text-xs font-semibold text-text-tertiary hover:text-text-primary hover:bg-surface-alt/80 transition-all duration-200 cursor-pointer"
      >
        {lang === 'cn' ? 'EN' : '中'}
      </button>
    </div>
  );

  // --- Mobile Nav Drawer ---
  const mobileNavDrawer = mobileNavOpen && (
    <div class="fixed inset-0 z-[60] md:hidden">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
      <div class="absolute top-0 right-0 bottom-0 w-64 bg-surface border-l border-border/60 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Drawer header */}
        <div class="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <span class="text-sm font-bold text-text-primary">{t(lang, 'ui.menu')}</span>
          <button
            onClick={() => setMobileNavOpen(false)}
            class="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-alt cursor-pointer"
          >
            <IconSvg name="x" size={18} />
          </button>
        </div>

        {/* Nav items */}
        <div class="flex-1 p-4 space-y-1">
          {NAV_TAB_IDS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { handleTabClick(tab.id); setMobileNavOpen(false); }}
              class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                (tab.id === 'skills' && activeView === 'skills') || (tab.id === 'workflows' && activeView === 'workflows')
                  ? 'text-accent bg-accent-muted'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
              }`}
            >
              <IconSvg name={tab.icon} size={18} />
              {NAV_TAB_KEYS[tab.id][lang]}
            </button>
          ))}
        </div>

      </div>
    </div>
  );

  // --- Render ---
  return (
    <div class="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-x-hidden overflow-y-hidden">

      {/* Portal: render nav tabs into Base.astro nav bar */}
      {navSlot && createPortal(navTabs, navSlot)}

      {/* Mobile nav drawer */}
      {mobileNavDrawer}

      {/* ========== Scene Bar (Level 2 - full width) ========== */}
      {activeView === 'skills' && (
        <div class="shrink-0 bg-surface/80 backdrop-blur-md border-b border-border/40 px-4 sm:px-6 overflow-x-hidden">
          <div class="flex items-center gap-0 overflow-x-auto scroll-fade-x" style={{ scrollbarWidth: 'none', overscrollBehaviorX: 'contain', WebkitOverflowScrolling: 'touch' }}>
            {scenes.map(scene => (
              <button
                key={scene.id}
                onClick={() => pickScene(scene.id)}
                class={`shrink-0 flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-all duration-200 cursor-pointer border-b-2 whitespace-nowrap ${
                  selectedScene === scene.id
                    ? 'text-accent border-accent'
                    : 'text-text-secondary hover:text-text-primary border-transparent hover:border-border'
                }`}
              >
                <IconSvg name={scene.icon} size={14} />
                {pick(scene, 'name', lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========== Sidebar + Content Row ========== */}
      <div class="flex flex-1 overflow-hidden">

      {/* ========== Sidebar ========== */}
      <aside class="w-[220px] shrink-0 border-r border-border/40 bg-surface overflow-y-auto hidden lg:block">
        {activeView === 'skills' && (
          <div class="p-4 space-y-0.5">
            {/* "All in scene" button */}
            <button
              onClick={() => pickCategory(null)}
              class={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                !selectedCategory
                  ? 'text-accent bg-accent-muted'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
              }`}
            >
              <span>{t(lang, 'ui.all')}</span>
              <span class="text-xs text-text-tertiary">{sceneSkillCount}</span>
            </button>

            {/* Scene sub-categories — grouped by scene in "all" mode */}
            {sceneCats.length > 1 && selectedScene === 'all' && (
              scenes.filter(s => s.id !== 'all').map(scene => {
                const cats = sceneCats.filter(c => c.scene === scene.id);
                if (cats.length === 0) return null;
                return (
                  <div key={scene.id}>
                    <p class="mt-4 first:mt-2 text-[11px] text-text-tertiary font-medium px-3 tracking-wider">
                      {pick(scene, 'name', lang)}
                    </p>
                    {cats.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => pickCategory(cat.id)}
                        class={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[13px] transition-all duration-200 cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'text-accent bg-accent-muted font-medium'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
                        }`}
                      >
                        <IconSvg name={cat.icon} size={14} className="shrink-0 opacity-60" />
                        <span class="flex-1 text-left truncate">{pick(cat, 'name', lang)}</span>
                        <span class="text-[11px] text-text-tertiary">{cat.skillCount || 0}</span>
                      </button>
                    ))}
                  </div>
                );
              })
            )}

            {/* Flat category list when a specific scene is selected */}
            {sceneCats.length > 1 && selectedScene !== 'all' && (
              <>
                <p class="mt-5 text-[11px] text-text-tertiary font-medium px-3 tracking-wider">
                  {pick(scenes.find(s => s.id === selectedScene) || scenes[0], 'name', lang) || t(lang, 'ui.category')}
                </p>
                {sceneCats.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => pickCategory(cat.id)}
                    class={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'text-accent bg-accent-muted font-medium'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
                    }`}
                  >
                    <IconSvg name={cat.icon} size={15} className="shrink-0 opacity-60" />
                    <span class="flex-1 text-left truncate">{pick(cat, 'name', lang)}</span>
                    <span class="text-xs text-text-tertiary">{cat.skillCount || 0}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        {activeView === 'workflows' && (
          <div class="p-4 space-y-1">
            <p class="text-[11px] text-text-tertiary font-medium px-3 uppercase tracking-wider mb-2">{t(lang, 'wf.list')}</p>
            {workflows.map(wf => (
              <button
                key={wf.id}
                onClick={() => { setSelectedWorkflow(wf.id); scrollRef.current?.scrollTo({ top: 0 }); }}
                class={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                  selectedWorkflow === wf.id
                    ? 'text-accent bg-accent-muted font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
                }`}
              >
                <IconSvg name={wf.icon} size={15} className="shrink-0 opacity-60" />
                <span class="flex-1 text-left truncate">{pick(wf, 'name', lang)}</span>
                <span class="text-xs text-text-tertiary">{wf.stepCount}{t(lang, 'ui.nStep')}</span>
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* ========== Main Area ========== */}
      <div class="flex-1 flex flex-col min-w-0">

        {/* ===== Skills View ===== */}
        {activeView === 'skills' && (
          <>
            {/* --- Single scrollable area: Carousel + Search (sticky) + Content --- */}
            <div class="flex-1 overflow-y-auto" ref={scrollRef}>

            {/* --- Carousel + Setup Card (scrolls with content) --- */}
            <div class="px-4 sm:px-6 pt-5 pb-4">
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Featured Carousel */}
                <div
                  class="md:col-span-3 relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500/10 via-indigo-500/8 to-blue-500/5 border border-border/60 h-[140px] sm:h-[150px]"
                  onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    const diff = touchStartX.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 50) {
                      setCarouselIdx(i => diff > 0
                        ? (i + 1) % featured.length
                        : (i - 1 + featured.length) % featured.length);
                    }
                  }}
                >
                  <div class="absolute inset-0 pointer-events-none">
                    <div class="absolute top-0 left-1/4 w-48 h-48 bg-violet-400/15 rounded-full blur-3xl" />
                    <div class="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
                  </div>
                  {featured.map((skill, i) => (
                    <a
                      key={skill.id}
                      href={`/skills/${skill.source}/${lang === 'en' && skill.slug_en ? skill.slug_en : skill.slug_cn}`}
                      class={`absolute inset-0 p-5 flex flex-col justify-between transition-opacity duration-500 ${
                        i === carouselIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <div>
                        <div class="flex items-center gap-2 mb-1.5">
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-accent-muted text-accent font-medium">{t(lang, 'ui.featured')}</span>
                          {skill.verified && (
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-medium">Verified</span>
                          )}
                        </div>
                        <h3 class="text-base font-bold text-text-primary line-clamp-1">{pick(skill, 'title', lang)}</h3>
                        <p class="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed max-w-lg">{pick(skill, 'highlight', lang)}</p>
                      </div>
                      <div class="flex items-center gap-1.5 text-xs text-accent font-medium">
                        {t(lang, 'ui.viewDetail')} <IconSvg name="chevron-right" size={12} />
                      </div>
                    </a>
                  ))}
                  {featured.length > 1 && (
                    <div class="absolute bottom-3 right-4 flex items-center gap-1.5 z-20">
                      {featured.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCarouselIdx(i)}
                          class={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            i === carouselIdx ? 'bg-accent w-5' : 'bg-text-tertiary/40 hover:bg-text-tertiary/60 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Setup Card */}
                <div class="md:col-span-2 rounded-2xl border border-border/60 bg-surface p-4 flex flex-col justify-between relative overflow-hidden h-[140px] sm:h-[150px]">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-3xl pointer-events-none" />
                  <div class="relative">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-1.5">
                        <IconSvg name="zap" size={14} className="text-accent" />
                        <h3 class="text-sm font-bold text-text-primary">{t(lang, 'setup.title')}</h3>
                      </div>
                      <button
                        onClick={() => setShowSetupModal(true)}
                        class="text-[11px] text-accent hover:text-accent-hover font-medium cursor-pointer"
                      >
                        {t(lang, 'ui.detailLink')}
                      </button>
                    </div>
                    <div class="bg-[#1C1917] text-gray-300 rounded-lg p-2.5 font-mono text-[10px] leading-relaxed border border-white/[0.06] overflow-hidden">
                      <div class="truncate">{"{"} "claude-code-skills": {"{"}</div>
                      <div class="truncate pl-3">"type": "url",</div>
                      <div class="truncate pl-3">"url": "...wayjet.io/mcp"</div>
                      <div class="truncate">{"}"} {"}"}</div>
                    </div>
                  </div>
                  <div class="relative flex items-center justify-between mt-2">
                    <span class="text-[10px] text-text-tertiary">
                      {skills.length} {t(lang, 'ui.nActivated')}
                      <span class="mx-1 opacity-40">·</span>
                      <span class="text-blue-600 dark:text-blue-400">{ccCount}</span> {t(lang, 'ui.ccCount')}
                      <span class="mx-1 opacity-40">·</span>
                      <span>{generalCount}</span> {t(lang, 'ui.generalCount')}
                    </span>
                    <CopyBtn text={MCP_CONFIG} label={t(lang, 'ui.copyConfig')} copiedLabel={t(lang, 'ui.copied')} variant="secondary" />
                  </div>
                </div>
              </div>
            </div>

            {/* --- Search Bar (sticky within scroll container) --- */}
            <div class="sticky top-0 z-10 bg-surface border-b border-border/40 px-4 sm:px-6 py-3">
              <div class="flex items-center gap-3">
                <div class="relative flex-1">
                  <IconSvg name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                    placeholder={t(lang, 'ui.search')}
                    class="w-full pl-9 pr-4 py-2.5 bg-surface-alt/60 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all duration-200 placeholder:text-text-tertiary"
                  />
                </div>
                {/* Platform filter toggle */}
                <div class="flex items-center shrink-0">
                  {(['all', 'cc', 'general'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setPlatformFilter(f)}
                      class={`px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 cursor-pointer border whitespace-nowrap first:rounded-l-lg last:rounded-r-lg ${
                        platformFilter === f
                          ? f === 'cc'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                            : f === 'general'
                              ? 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-600'
                              : 'bg-accent/10 text-accent border-accent/30'
                          : 'bg-surface text-text-tertiary border-border/60 hover:text-text-secondary'
                      }`}
                    >
                      {t(lang, `ui.filter${f.charAt(0).toUpperCase() + f.slice(1)}` as any)}
                    </button>
                  ))}
                </div>
                {/* Mobile category dropdown */}
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => pickCategory((e.target as HTMLSelectElement).value || null)}
                  class="lg:hidden px-3 py-2.5 border border-border/60 rounded-xl text-sm bg-surface-alt"
                >
                  <option value="">{t(lang, 'ui.all')}</option>
                  {sceneCats.map(c => (
                    <option key={c.id} value={c.id}>{pick(c, 'name', lang)}</option>
                  ))}
                </select>
                <span class="shrink-0 text-xs text-text-tertiary whitespace-nowrap hidden sm:inline">
                  {filteredSkills.length} {t(lang, 'ui.nSkills')}
                </span>
              </div>

              {/* Horizontal category quick-nav (only in grouped view with multiple categories) */}
              {isGroupedView && sceneCats.length > 1 && (
                <div class="flex items-center gap-1.5 mt-3 overflow-x-auto scroll-fade-x pb-0.5" style={{ scrollbarWidth: 'none', overscrollBehaviorX: 'contain' }}>
                  {sceneCats.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => scrollToSection(cat.id)}
                      class={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                        activeSectionId === cat.id
                          ? 'bg-accent text-white shadow-sm shadow-accent/20'
                          : 'bg-surface-alt text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
                      }`}
                    >
                      {pick(cat, 'name', lang)}
                      <span class="ml-1 opacity-60">{cat.skillCount || 0}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* --- Skills Content --- */}
            <div class="p-4 sm:p-6">
                {filteredSkills.length === 0 ? (
                  <div class="flex flex-col items-center justify-center py-20 text-text-tertiary">
                    <IconSvg name="search" size={32} className="mb-3 opacity-40" />
                    <p class="text-sm">{t(lang, 'ui.noMatch')}</p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        class="mt-2 text-xs text-accent hover:text-accent-hover cursor-pointer"
                      >
                        {t(lang, 'ui.clearSearch')}
                      </button>
                    )}
                  </div>
                ) : isGroupedView ? (
                  <div class="space-y-10">
                    {groupedSkills.map(group => (
                      <section key={group.id} id={`section-${group.id}`}>
                        <div class="flex items-center gap-3 mb-4">
                          <div class="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center">
                            <IconSvg name={group.icon} size={16} className="text-accent" />
                          </div>
                          <h2 class="text-sm font-bold text-text-primary">{pick(group, 'name', lang)}</h2>
                          <span class="text-xs text-text-tertiary">{group.skills.length} {t(lang, 'ui.nSkills')}</span>
                        </div>
                        <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                          {group.skills.map(skill => (
                            <SkillCard key={skill.id} skill={skill} lang={lang} />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredSkills.map(skill => (
                      <SkillCard key={skill.id} skill={skill} lang={lang} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ===== Workflows View ===== */}
        {activeView === 'workflows' && (
          <div class="flex-1 overflow-y-auto" ref={scrollRef}>
            {!selectedWorkflow ? (
              /* --- Workflow List --- */
              <div class="p-4 sm:p-6">
                <div class="mb-8">
                  <h1 class="text-xl font-bold text-text-primary">{t(lang, 'wf.title')}</h1>
                  <p class="text-sm text-text-secondary mt-1">
                    {t(lang, 'wf.desc')}
                  </p>
                </div>

                <div class="grid sm:grid-cols-2 gap-4">
                  {workflows.map(wf => (
                    <WorkflowCardInline key={wf.id} workflow={wf} lang={lang} onSelect={() => { setSelectedWorkflow(wf.id); scrollRef.current?.scrollTo({ top: 0 }); }} />
                  ))}
                </div>

                {workflows.length === 0 && (
                  <div class="flex flex-col items-center justify-center py-20 text-text-tertiary">
                    <IconSvg name="rocket" size={32} className="mb-3 opacity-40" />
                    <p class="text-sm">{t(lang, 'ui.noWorkflows')}</p>
                  </div>
                )}
              </div>
            ) : (
              /* --- Workflow Detail (inline) --- */
              <WorkflowDetail
                workflow={workflows.find(w => w.id === selectedWorkflow)!}
                lang={lang}
                onBack={() => setSelectedWorkflow(null)}
              />
            )}
          </div>
        )}
      </div>
      </div>

      {/* ========== Setup Modal ========== */}
      {showSetupModal && (
        <SetupModal onClose={() => setShowSetupModal(false)} skillCount={skills.length} lang={lang} />
      )}
    </div>
  );
}

// --- Skill Card ---

function SkillCard({ skill, lang }: { skill: SkillSummary; lang: Lang }) {
  return (
    <a
      href={`/skills/${skill.source}/${lang === 'en' && skill.slug_en ? skill.slug_en : skill.slug_cn}`}
      class="block p-4 rounded-2xl border border-border/60 bg-surface hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group"
    >
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors duration-200 line-clamp-1">
          {pick(skill, 'title', lang)}
        </h3>
        <div class="flex items-center gap-1 shrink-0">
          {skill.verified && (
            <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-medium">
              Verified
            </span>
          )}
          {skill.compatibleWith.includes('claude-code') && !skill.compatibleWith.includes('any') ? (
            <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium">
              ⚡CC
            </span>
          ) : (
            <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400 font-medium">
              🌐{lang === 'cn' ? '通用' : 'General'}
            </span>
          )}
        </div>
      </div>

      {(skill.highlight_cn || skill.highlight_en) && (
        <p class="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">{pick(skill, 'highlight', lang)}</p>
      )}

      <div class="flex items-center gap-1.5 mt-3">
        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-alt text-text-secondary">
          {t(lang, `type.${skill.type}` as any) || skill.type}
        </span>
        {skill.tags.slice(0, 2).map(tag => (
          <span key={tag} class="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-muted text-accent">{tag}</span>
        ))}
      </div>

      {/* Stats row */}
      <div class="flex items-center gap-3 mt-3 pt-3 border-t border-border/40">
        <span class="flex items-center gap-1 text-[10px] text-text-tertiary" title={t(lang, 'ui.viewsTooltip')}>
          <IconSvg name="eye" size={11} className="opacity-50" />
          {formatCount(skill.views)}
        </span>
        <span class="flex items-center gap-1 text-[10px] text-text-tertiary" title={t(lang, 'ui.copiesTooltip')}>
          <IconSvg name="copy" size={11} className="opacity-50" />
          {formatCount(skill.copies)}
        </span>
        <span class="flex items-center gap-1 text-[10px] text-text-tertiary" title={t(lang, 'ui.invocationsTooltip')}>
          <IconSvg name="zap" size={11} className="opacity-50" />
          {formatCount(skill.invocations)}
        </span>
        <span class="ml-auto text-[10px] text-text-tertiary">{skill.estimatedReadMinutes} min</span>
      </div>
    </a>
  );
}

// --- Workflow Card (inline, onClick instead of link) ---

function WorkflowCardInline({ workflow, lang, onSelect }: { workflow: WorkflowSummary; lang: Lang; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      class="w-full text-left rounded-2xl border border-border/60 bg-surface hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group overflow-hidden cursor-pointer"
    >
      <div class="p-5 pb-4">
        <div class="flex items-start gap-3">
          <div class="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent-muted to-accent/10 flex items-center justify-center">
            <IconSvg name={workflow.icon} size={20} className="text-accent" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-text-primary group-hover:text-accent transition-colors duration-200">
                {pick(workflow, 'name', lang)}
              </h3>
              <span class={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                workflow.coverage === 'full'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
              }`}>
                {workflow.coverage === 'full' ? t(lang, 'ui.fullCoverage') : t(lang, 'ui.partialCoverage')}
              </span>
            </div>
            <p class="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
              {pick(workflow, 'description', lang)}
            </p>
          </div>
        </div>
      </div>

      <div class="px-5 pb-4">
        <div class="flex items-center gap-1 overflow-x-auto scroll-fade-x" style={{ scrollbarWidth: 'none' }}>
          {workflow.steps.map((step, i) => (
            <div key={step.id} class="flex items-center shrink-0">
              {i > 0 && (
                <IconSvg name="chevron-right" size={10} className="text-text-tertiary/40 mx-0.5" />
              )}
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-surface-alt text-text-secondary whitespace-nowrap">
                {pick(step, 'name', lang)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div class="px-5 py-3 bg-surface-alt/30 border-t border-border/40 flex items-center justify-between">
        <div class="flex items-center gap-3 text-[10px] text-text-tertiary">
          <span>{workflow.stepCount} {t(lang, 'ui.nSteps')}</span>
          <span class="w-px h-3 bg-border/40" />
          <span>{workflow.steps.reduce((sum, s) => sum + s.skillCount, 0)} {t(lang, 'ui.nSkills')}</span>
        </div>
        <span class="text-xs text-accent font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {t(lang, 'ui.viewDetail')} <IconSvg name="chevron-right" size={12} />
        </span>
      </div>
    </button>
  );
}

// --- Workflow Detail (inline in main area) ---

const MODE_LABELS: Record<string, Record<Lang, string>> = {
  solo: { cn: 'Solo', en: 'Solo' },
  multi: { cn: '多人协作', en: 'Multi-Agent' },
  'solo-or-multi': { cn: '可多人', en: 'Solo or Multi' },
};

function WorkflowDetail({ workflow, lang, onBack }: { workflow: WorkflowSummary; lang: Lang; onBack: () => void }) {
  const allContent = workflow.steps
    .flatMap(step => step.resolvedSkills?.map(s => s.rawContent) || [])
    .join('\n\n---\n\n');
  const skillCount = workflow.steps.reduce((sum, s) => sum + s.skillCount, 0);

  return (
    <div class="p-4 sm:p-6">
      {/* Back button (visible on mobile where sidebar is hidden) */}
      <button
        onClick={onBack}
        class="lg:hidden flex items-center gap-1 text-sm text-text-tertiary hover:text-accent transition-colors duration-200 mb-4 cursor-pointer"
      >
        <IconSvg name="arrow-left" size={14} />
        {lang === 'cn' ? '返回工作流列表' : 'Back to workflows'}
      </button>

      {/* Header */}
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center text-text-secondary shrink-0">
          <IconSvg name={workflow.icon} size={22} />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-text-primary">
              {pick(workflow, 'name', lang)}
            </h1>
            <span class={`text-xs px-2 py-0.5 rounded-full ${
              workflow.coverage === 'full'
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
            }`}>
              {workflow.coverage === 'full'
                ? (lang === 'cn' ? '完整覆盖' : 'Full Coverage')
                : (lang === 'cn' ? '部分覆盖' : 'Partial')}
            </span>
          </div>
          <p class="text-sm text-text-secondary mt-1.5">
            {pick(workflow, 'description', lang)}
          </p>
        </div>
      </div>

      {/* Entry / Exit */}
      <div class="mt-6 grid sm:grid-cols-2 gap-4">
        <div class="p-4 rounded-xl bg-gradient-to-r from-accent/5 to-transparent border-l-4 border-accent">
          <p class="text-xs text-text-tertiary font-medium mb-1">
            {lang === 'cn' ? '入口条件' : 'Entry Condition'}
          </p>
          <p class="text-sm text-text-primary">{pick(workflow, 'entry', lang)}</p>
        </div>
        <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 to-transparent border-l-4 border-emerald-500">
          <p class="text-xs text-text-tertiary font-medium mb-1">
            {lang === 'cn' ? '交付物' : 'Deliverables'}
          </p>
          <p class="text-sm text-text-primary">{pick(workflow, 'exit', lang)}</p>
        </div>
      </div>

      {/* Copy All */}
      {allContent && (
        <div class="mt-6">
          <CopyBtn
            text={allContent}
            label={lang === 'cn' ? `复制全部 ${skillCount} 个技能` : `Copy all ${skillCount} skills`}
            copiedLabel={t(lang, 'ui.copied')}
            variant="primary"
          />
        </div>
      )}

      {/* Steps */}
      <div class="mt-10">
        <h2 class="text-lg font-bold tracking-tight text-text-primary mb-6">
          {workflow.stepCount} {lang === 'cn' ? '个步骤' : 'Steps'}
        </h2>

        <div class="space-y-4">
          {workflow.steps.map((step, i) => (
            <div key={step.id} class="relative">
              {i < workflow.steps.length - 1 && (
                <div class="absolute left-5 top-[calc(100%)] w-px h-4 bg-gradient-to-b from-border to-transparent" />
              )}

              <div class="p-5 rounded-2xl border border-border/60 hover:border-accent/20 transition-colors duration-300">
                <div class="flex items-center gap-3">
                  <span class="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 text-accent text-sm font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <h3 class="text-base font-semibold text-text-primary">
                        {pick(step, 'name', lang)}
                      </h3>
                      <span class={`text-xs px-2 py-0.5 rounded-full ${
                        step.mode === 'multi' || step.mode === 'solo-or-multi'
                          ? 'bg-accent-muted text-accent'
                          : 'bg-surface-alt text-text-tertiary'
                      }`}>
                        {MODE_LABELS[step.mode]?.[lang] || step.mode}
                      </span>
                    </div>
                    <p class="text-sm text-text-secondary mt-0.5">
                      {pick(step, 'description', lang)}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {step.resolvedSkills && step.resolvedSkills.length > 0 && (
                  <div class="mt-4 flex flex-wrap gap-2">
                    {step.resolvedSkills.map(skill => (
                      <div key={skill.slug_cn} class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-alt border border-border/60">
                        <a
                          href={`/skills/${skill.source}/${lang === 'en' && skill.slug_en ? skill.slug_en : skill.slug_cn}`}
                          class="text-sm text-text-primary hover:text-accent transition-colors duration-200"
                        >
                          {lang === 'cn' ? skill.title_cn : (skill.title_en || skill.title_cn)}
                        </a>
                        <CopyBtn text={skill.rawContent} label="Copy" copiedLabel={t(lang, 'ui.copied')} variant="secondary" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Quality criteria */}
                {(step.quality_cn || step.quality_en) && (
                  <div class="mt-4">
                    <p class="text-xs font-medium text-text-secondary mb-1.5">
                      {lang === 'cn' ? '质量标准' : 'Quality Criteria'}
                    </p>
                    <div class="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                      {(lang === 'cn' ? step.quality_cn : (step.quality_en || step.quality_cn)).trim()}
                    </div>
                  </div>
                )}

                {/* Verification gate */}
                {(step.verification_cn || step.verification_en) && (
                  <div class="mt-4 p-3 rounded-xl bg-gradient-to-r from-accent/5 to-transparent border border-accent/10">
                    <p class="text-xs font-medium text-accent mb-1">
                      {lang === 'cn' ? '验证门' : 'Verification Gate'}
                    </p>
                    <p class="text-sm text-text-secondary">
                      {lang === 'cn' ? step.verification_cn : (step.verification_en || step.verification_cn)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

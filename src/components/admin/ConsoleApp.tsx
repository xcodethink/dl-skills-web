/**
 * ConsoleApp — Admin panel for the skill curation pipeline.
 *
 * Sidebar + Header layout with hash-based routing:
 *   #login       → Login screen (default if not authenticated)
 *   #dash        → Dashboard with stats + analytics
 *   #pipeline    → Pipeline monitor + run history
 *   #queue       → Candidate review queue
 *   #detail/:id  → Candidate detail + actions
 *   #published   → Published skills browser
 *   #sources     → Source repository management
 *   #settings    → System settings overview
 *
 * Supports Chinese and English (toggle in header).
 */

import { useState, useEffect } from 'preact/hooks';
import { Component, type ComponentChildren } from 'preact';
import { getAdminLang, setAdminLang, type AdminLang } from '../../lib/adminLabels';
import { getToken, setToken, clearToken, setOnUnauthorized } from '../../lib/adminApi';
import AdminLogin from './AdminLogin';
import AdminSidebar, { type View } from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashTab from './DashTab';
import QueueTab from './QueueTab';
import DetailTab from './DetailTab';
import SourcesTab from './SourcesTab';
import PipelineTab from './PipelineTab';
import PublishedTab from './PublishedTab';
import SettingsTab from './SettingsTab';

// ─── Props ──────────────────────────────────────────────────────────────────

interface Props {
  apiBase: string;
}

// ─── Error Boundary ─────────────────────────────────────────────────────────

interface EBState { hasError: boolean; isChunkError: boolean }

class ErrorBoundary extends Component<{ children: ComponentChildren }, EBState> {
  state: EBState = { hasError: false, isChunkError: false };

  static getDerivedStateFromError(error: Error) {
    const isChunk = error.message?.includes('Loading chunk') ||
                    error.message?.includes('dynamically imported module');
    return { hasError: true, isChunkError: isChunk };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div class="text-center py-16">
          <p class="text-[#71717a] mb-4">
            {this.state.isChunkError
              ? 'Failed to load module. Network issue?'
              : 'Something went wrong.'}
          </p>
          <button
            class="px-4 py-2 text-sm bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
            onClick={() => {
              this.setState({ hasError: false });
              if (this.state.isChunkError) location.reload();
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Hash routing helpers ───────────────────────────────────────────────────

const VIEWS: View[] = ['dash', 'pipeline', 'queue', 'published', 'sources', 'settings'];

function parseHash(hash: string): { view: View; detailId?: string } {
  const h = hash.slice(1); // remove #
  if (h.startsWith('detail/')) return { view: 'detail', detailId: h.slice(7) };
  if (VIEWS.includes(h as View)) return { view: h as View };
  return { view: 'dash' };
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ConsoleApp({ apiBase }: Props) {
  const [token, setTokenState] = useState<string>(getToken);
  const [lang, setLang] = useState<AdminLang>(getAdminLang);
  const [view, setView] = useState<View>('dash');
  const [detailId, setDetailId] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Wire up unauthorized callback
  useEffect(() => {
    setOnUnauthorized(() => {
      clearToken();
      setTokenState('');
      setView('dash');
      location.hash = '#login';
    });
  }, []);

  // Hash-based routing
  useEffect(() => {
    function onHash() {
      if (!token) return;
      const { view: v, detailId: id } = parseHash(location.hash);
      setView(v);
      if (id) setDetailId(id);
    }
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, [token]);

  const handleLogin = (t: string) => {
    setToken(t);
    setTokenState(t);
    location.hash = '#dash';
  };

  const handleLogout = () => {
    clearToken();
    setTokenState('');
    location.hash = '#login';
  };

  const handleLangChange = (newLang: AdminLang) => {
    setAdminLang(newLang);
    setLang(newLang);
  };

  // Not authenticated → login screen
  if (!token) {
    return <AdminLogin apiBase={apiBase} lang={lang} onLogin={handleLogin} />;
  }

  // Resolve active sidebar highlight (detail → queue)
  const sidebarView: View = view === 'detail' ? 'queue' : view;

  // Authenticated → sidebar + header + content
  return (
    <div class="flex h-screen bg-[#0f0f10] text-[#fafafa]">
      {/* Sidebar */}
      <AdminSidebar
        activeView={sidebarView}
        onNavigate={(v) => setView(v)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        lang={lang}
      />

      {/* Main area */}
      <div class="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AdminHeader
          activeView={view}
          lang={lang}
          onLangChange={handleLangChange}
          onMenuToggle={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Content */}
        <main class="flex-1 overflow-y-auto">
          <div class="max-w-[1200px] mx-auto p-4 lg:p-6">
            <ErrorBoundary>
              {view === 'dash' && <DashTab apiBase={apiBase} lang={lang} />}
              {view === 'pipeline' && <PipelineTab apiBase={apiBase} lang={lang} />}
              {view === 'queue' && <QueueTab apiBase={apiBase} lang={lang} />}
              {view === 'detail' && <DetailTab apiBase={apiBase} lang={lang} id={detailId} />}
              {view === 'published' && <PublishedTab apiBase={apiBase} lang={lang} />}
              {view === 'sources' && <SourcesTab apiBase={apiBase} lang={lang} />}
              {view === 'settings' && <SettingsTab apiBase={apiBase} lang={lang} />}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

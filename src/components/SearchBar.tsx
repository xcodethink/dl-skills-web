import { useState, useRef, useEffect } from 'preact/hooks';

interface SearchResult {
  title: string;
  url: string;
  excerpt: string;
  source: string;
}

export default function SearchBar({ lang = 'cn' }: { lang?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pagefind, setPagefind] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPagefind() {
      try {
        const pfPath = '/pagefind/pagefind.js';
        const pf = await import(/* @vite-ignore */ pfPath);
        await pf.init();
        setPagefind(pf);
      } catch {
        // Pagefind not available in dev mode
      }
    }
    loadPagefind();

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (pagefind) {
      const search = await pagefind.search(value);
      const items = await Promise.all(
        search.results.slice(0, 8).map(async (r: any) => {
          const data = await r.data();
          return {
            title: data.meta?.title || 'Untitled',
            url: data.url,
            excerpt: data.excerpt,
            source: data.meta?.source || '',
          };
        })
      );
      setResults(items);
      setIsOpen(items.length > 0);
    }
  };

  return (
    <div ref={containerRef} class="relative w-full max-w-2xl mx-auto">
      <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onInput={(e) => handleSearch((e.target as HTMLInputElement).value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={lang === 'cn' ? '搜索技能... ⌘K' : 'Search skills... ⌘K'}
          class="w-full pl-12 pr-4 py-4 bg-surface/80 dark:bg-surface-alt/80 backdrop-blur-sm border border-border/60 rounded-2xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 focus:shadow-lg focus:shadow-accent/5 transition-all duration-300 placeholder:text-text-tertiary"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div class="absolute top-full mt-3 w-full bg-surface/95 dark:bg-surface-alt/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50">
          {results.map((result) => (
            <a
              key={result.url}
              href={result.url}
              class="block px-5 py-3.5 hover:bg-surface-alt/80 transition-colors duration-200 border-b border-border/30 last:border-0"
            >
              <div class="font-medium text-sm text-text-primary">{result.title}</div>
              {result.excerpt && (
                <div
                  class="text-xs text-text-secondary mt-1 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: result.excerpt }}
                />
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'preact/hooks';
import { labels, type AdminLang } from '../../lib/adminLabels';
import { login } from '../../lib/adminApi';
import { iconPaths } from '../icons';

interface Props {
  apiBase: string;
  lang: AdminLang;
  onLogin: (token: string) => void;
}

export default function AdminLogin({ apiBase, lang, onLogin }: Props) {
  const l = labels[lang];
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: Event) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    setError('');

    try {
      const ok = await login(apiBase, value.trim());
      if (ok) {
        onLogin(value.trim());
      } else {
        setError(l.login_error);
      }
    } catch {
      setError(l.login_connect_error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-[#0f0f10]">
      <form onSubmit={submit} class="w-80">
        {/* Icon + Title */}
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#8B5CF6]/10 mb-4">
            <svg class="w-6 h-6 text-[#8B5CF6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path innerHTML={iconPaths.shield} />
            </svg>
          </div>
          <h1 class="text-lg font-semibold text-[#fafafa]">{l.login_title}</h1>
        </div>

        {/* Input */}
        <input
          type="password"
          value={value}
          onInput={(e: any) => setValue(e.target.value)}
          placeholder={l.login_placeholder}
          autoFocus
          class="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 text-sm text-[#fafafa] placeholder-[#52525b] outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors"
        />

        {/* Error */}
        {error && (
          <div class="text-red-400 text-xs mt-2">{error}</div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          class="w-full mt-3 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? l.login_loading : l.login_btn}
        </button>
      </form>
    </div>
  );
}

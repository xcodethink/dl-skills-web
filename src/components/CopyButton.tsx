import { useState } from 'preact/hooks';

interface Props {
  text: string;
  label?: string;
  variant?: 'primary' | 'secondary';
}

export default function CopyButton({ text, label = 'Copy', variant = 'primary' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const baseClasses = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer';
  const variantClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30'
    : 'bg-surface-alt text-text-secondary hover:text-accent hover:bg-accent-muted border border-border/60 hover:border-accent/30';

  return (
    <button onClick={handleCopy} class={`${baseClasses} ${variantClasses}`}>
      {copied ? (
        <>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {label === 'Copy' ? 'Copied!' : `${label} ✓`}
        </>
      ) : (
        <>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

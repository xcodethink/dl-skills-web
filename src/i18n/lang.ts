// Language detection and persistence utilities

import type { Lang } from './translations';

export function detectLang(): Lang {
  if (typeof window === 'undefined') return 'cn';
  const stored = localStorage.getItem('lang');
  if (stored === 'cn' || stored === 'en') return stored;
  return navigator.language.startsWith('zh') ? 'cn' : 'en';
}

export function setLang(lang: Lang): void {
  localStorage.setItem('lang', lang);
  document.documentElement.dataset.lang = lang;
}

export function toggleLang(): Lang {
  const current = detectLang();
  const next: Lang = current === 'cn' ? 'en' : 'cn';
  setLang(next);
  return next;
}

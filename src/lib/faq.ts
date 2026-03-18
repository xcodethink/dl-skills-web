import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface FaqItem {
  id: string;
  category: 'general' | 'setup' | 'usage' | 'technical';
  question_cn: string;
  question_en: string;
  answer_cn: string;
  answer_en: string;
}

const DATA_DIR = path.resolve(import.meta.dirname, '../../data');

let _faq: FaqItem[] | null = null;

export function loadFaq(): FaqItem[] {
  if (_faq) return _faq;
  const filePath = path.join(DATA_DIR, 'faq.yaml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as { faq: FaqItem[] };
  _faq = data.faq;
  return _faq;
}

export function getFaqByCategory(category: string): FaqItem[] {
  return loadFaq().filter(f => f.category === category);
}

const categoryLabels: Record<string, { cn: string; en: string }> = {
  general: { cn: '基本问题', en: 'General' },
  setup: { cn: '安装配置', en: 'Setup' },
  usage: { cn: '使用方法', en: 'Usage' },
  technical: { cn: '技术问题', en: 'Technical' },
};

export function getFaqCategoryLabel(category: string, lang: 'cn' | 'en'): string {
  return categoryLabels[category]?.[lang] || category;
}

export const FAQ_CATEGORIES = ['general', 'setup', 'usage', 'technical'] as const;

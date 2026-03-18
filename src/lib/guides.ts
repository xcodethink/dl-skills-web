import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface Guide {
  id: string;
  title_cn: string;
  title_en: string;
  description_cn: string;
  description_en: string;
  icon: string;
  difficulty: 'starter' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  tags: string[];
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  skills: string[];
}

const DATA_DIR = path.resolve(import.meta.dirname, '../../data');

let _guides: Guide[] | null = null;

export function loadGuides(): Guide[] {
  if (_guides) return _guides;
  const filePath = path.join(DATA_DIR, 'guides.yaml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as { guides: Guide[] };
  _guides = data.guides;
  return _guides;
}

export function getGuideById(id: string): Guide | undefined {
  return loadGuides().find(g => g.id === id);
}

export function getFeaturedGuides(): Guide[] {
  return loadGuides().filter(g => g.featured);
}

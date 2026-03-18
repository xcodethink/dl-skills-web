import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface BlogPost {
  id: string;
  title_cn: string;
  title_en: string;
  description_cn: string;
  description_en: string;
  author: string;
  category: 'insight' | 'tutorial' | 'story' | 'update';
  tags: string[];
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
}

const DATA_DIR = path.resolve(import.meta.dirname, '../../data');

let _posts: BlogPost[] | null = null;

export function loadBlogPosts(): BlogPost[] {
  if (_posts) return _posts;
  const filePath = path.join(DATA_DIR, 'blog.yaml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as { posts: BlogPost[] };
  _posts = data.posts;
  return _posts;
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return loadBlogPosts().find(p => p.id === id);
}

export function getFeaturedPosts(): BlogPost[] {
  return loadBlogPosts().filter(p => p.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return loadBlogPosts().filter(p => p.category === category);
}

const categoryLabels: Record<string, { cn: string; en: string }> = {
  insight: { cn: '洞察', en: 'Insight' },
  tutorial: { cn: '教程', en: 'Tutorial' },
  story: { cn: '故事', en: 'Story' },
  update: { cn: '更新', en: 'Update' },
};

export function getCategoryLabel(category: string, lang: 'cn' | 'en'): string {
  return categoryLabels[category]?.[lang] || category;
}

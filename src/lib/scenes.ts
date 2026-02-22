// Scene definitions for top-level navigation
// Maps 15 unified categories into 6 user-facing scenes (+ "all")

export interface Scene {
  id: string;
  name_cn: string;
  name_en: string;
  icon: string;
}

export const SCENES: Scene[] = [
  { id: 'all',              name_cn: '全部',     name_en: 'All',            icon: 'layout-grid' },
  { id: 'coding',           name_cn: '编程开发', name_en: 'Coding',         icon: 'code' },
  { id: 'design',           name_cn: '设计创意', name_en: 'Design',         icon: 'palette' },
  { id: 'content',          name_cn: '内容创作', name_en: 'Content',        icon: 'pencil' },
  { id: 'data',             name_cn: '数据分析', name_en: 'Data',           icon: 'bar-chart' },
  { id: 'ai-engineering',   name_cn: 'AI 工程',  name_en: 'AI Engineering', icon: 'bot' },
  { id: 'productivity',     name_cn: '效率提升', name_en: 'Productivity',   icon: 'zap' },
];

// Scene → category IDs mapping
export const SCENE_CATEGORIES: Record<string, string[]> = {
  coding:           ['think-plan', 'scaffold', 'frontend', 'backend', 'test', 'debug', 'review', 'ship'],
  design:           ['design'],
  content:          ['content'],
  data:             ['data-viz'],
  'ai-engineering': ['ai-engineering'],
  productivity:     ['utilities', 'documents', 'meta'],
};

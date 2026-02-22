import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

// --- Types ---

export interface SkillMeta {
  id: string;
  source: string;
  language: 'cn' | 'en';
  originalCategory: string;
  filename: string;
  filePath: string;
  title: string;
  sourceUrl: string;
  sourceOrg: string;
  sourceRepo: string;
  rawContent: string;
  lineCount: number;
  estimatedReadMinutes: number;
  hasIronLaw: boolean;
  hasChecklist: boolean;
  hasCodeExamples: boolean;
  // From registry
  unifiedCategory: string;
  tags: string[];
  type: 'discipline' | 'tool' | 'process' | 'reference';
  difficulty: 'starter' | 'intermediate' | 'advanced';
  verified: boolean;
  compatibleWith: string[];
  highlight: string;
  pairedId?: string;
  slug: string;
}

export interface Category {
  id: string;
  name_cn: string;
  name_en: string;
  icon: string;
  phase: 'pipeline' | 'specialist';
  order: number;
  mode: 'solo' | 'multi' | 'solo-or-multi';
  scene: string;
  description_cn: string;
  description_en: string;
  skillCount?: number;
}

export interface WorkflowStep {
  id: string;
  name_cn: string;
  name_en: string;
  mode: 'solo' | 'multi' | 'solo-or-multi';
  description_cn: string;
  description_en?: string;
  skills: string[];
  quality_cn: string;
  quality_en?: string;
  verification_cn: string;
  verification_en?: string;
  resolvedSkills?: SkillMeta[];
}

export interface Workflow {
  id: string;
  name_cn: string;
  name_en: string;
  description_cn: string;
  description_en?: string;
  icon: string;
  coverage: 'full' | 'partial';
  entry_cn: string;
  entry_en?: string;
  exit_cn: string;
  exit_en?: string;
  steps: WorkflowStep[];
}

interface RegistryEntry {
  unifiedCategory: string;
  tags: string[];
  type: 'discipline' | 'tool' | 'process' | 'reference';
  difficulty: 'starter' | 'intermediate' | 'advanced';
  verified: boolean;
  compatibleWith: string[];
  highlight_cn: string;
  highlight_en: string;
  paired_en?: string;
  paired_cn?: string;
}

// --- Globals ---

const PROJECT_ROOT = path.resolve(import.meta.dirname, '../../');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');
const DATA_DIR = path.join(PROJECT_ROOT, 'data');

// --- Source Registry ---

export interface SourceInfo {
  id: string;
  name: string;
  repo: string;
  url: string;
  desc_cn: string;
  desc_en: string;
  verified: boolean;
}

let _sources: SourceInfo[] | null = null;
export function loadSources(): SourceInfo[] {
  if (_sources) return _sources;
  const filePath = path.join(DATA_DIR, 'sources.yaml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as { sources: SourceInfo[] };
  _sources = data.sources;
  return _sources;
}

function getSourceIds(): string[] {
  return loadSources().map(s => s.id);
}

// --- Loaders ---

let _registry: Record<string, RegistryEntry> | null = null;
// Reverse lookup: EN paired key → CN registry entry (so EN skills get metadata)
let _enToRegistry: Record<string, RegistryEntry> | null = null;

function loadRegistry(): Record<string, RegistryEntry> {
  if (_registry) return _registry;
  const filePath = path.join(DATA_DIR, 'skills-registry.yaml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  _registry = yaml.load(raw) as Record<string, RegistryEntry>;

  // Build reverse map: paired_en value → registry entry
  _enToRegistry = {};
  for (const entry of Object.values(_registry)) {
    if (entry.paired_en) {
      _enToRegistry[entry.paired_en] = entry;
    }
  }

  return _registry;
}

let _categories: Category[] | null = null;
export function loadCategories(): Category[] {
  if (_categories) return _categories;
  const filePath = path.join(DATA_DIR, 'categories.yaml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as { categories: Category[] };
  _categories = data.categories;
  return _categories;
}

let _workflows: Workflow[] | null = null;
export function loadWorkflows(): Workflow[] {
  if (_workflows) return _workflows;
  const filePath = path.join(DATA_DIR, 'workflows.yaml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as { workflows: Workflow[] };
  _workflows = data.workflows;
  return _workflows;
}

// --- Skill Scanning ---

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

function extractSourceInfo(content: string): { url: string; org: string; repo: string } {
  const match = content.match(/来源：\[([^\]]+)\]\(([^)]+)\)/);
  if (match) {
    const parts = match[1].split('/');
    return {
      url: match[2],
      org: parts[0] || '',
      repo: parts[1] || parts[0] || '',
    };
  }
  // Try English format: Source:
  const matchEn = content.match(/Source:\s*\[([^\]]+)\]\(([^)]+)\)/i);
  if (matchEn) {
    const parts = matchEn[1].split('/');
    return {
      url: matchEn[2],
      org: parts[0] || '',
      repo: parts[1] || parts[0] || '',
    };
  }
  return { url: '', org: '', repo: '' };
}

function makeSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function makeRegistryKey(source: string, originalCategory: string, filename: string): string {
  const name = filename.replace(/\.md$/, '');
  if (originalCategory) {
    return `${source}/${originalCategory}/${name}`;
  }
  return `${source}/${name}`;
}

function scanSkillFiles(sourceDir: string, source: string, lang: 'cn' | 'en'): SkillMeta[] {
  const skills: SkillMeta[] = [];
  const dirPath = path.join(CONTENT_DIR, sourceDir);

  if (!fs.existsSync(dirPath)) return skills;

  const registry = loadRegistry();

  // Check if source has category subdirectories
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'README.md' || entry.name.startsWith('.')) continue;

    if (entry.isDirectory()) {
      // Category directory
      const categoryDir = path.join(dirPath, entry.name);
      const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md') && f !== 'README.md');

      for (const file of files) {
        const filePath = path.join(categoryDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const registryKey = makeRegistryKey(source, entry.name, file);
        // Direct lookup first; for EN skills, fall back to reverse map (CN entry that pairs to this EN key)
        const regEntry = registry[registryKey] || (lang === 'en' && _enToRegistry ? _enToRegistry[registryKey] : undefined);

        skills.push(buildSkillMeta({
          content,
          source,
          lang,
          originalCategory: entry.name,
          filename: file,
          filePath: `${sourceDir}/${entry.name}/${file}`,
          registryKey,
          regEntry,
        }));
      }
    } else if (entry.name.endsWith('.md')) {
      // Flat file (like dataviz)
      const filePath = path.join(dirPath, entry.name);
      const content = fs.readFileSync(filePath, 'utf-8');
      const registryKey = makeRegistryKey(source, '', entry.name);
      const regEntry = registry[registryKey] || (lang === 'en' && _enToRegistry ? _enToRegistry[registryKey] : undefined);

      skills.push(buildSkillMeta({
        content,
        source,
        lang,
        originalCategory: '',
        filename: entry.name,
        filePath: `${sourceDir}/${entry.name}`,
        registryKey,
        regEntry,
      }));
    }
  }

  return skills;
}

interface BuildSkillParams {
  content: string;
  source: string;
  lang: 'cn' | 'en';
  originalCategory: string;
  filename: string;
  filePath: string;
  registryKey: string;
  regEntry?: RegistryEntry;
}

function buildSkillMeta(params: BuildSkillParams): SkillMeta {
  const { content, source, lang, originalCategory, filename, filePath, registryKey, regEntry } = params;
  const lines = content.split('\n');
  const sourceInfo = extractSourceInfo(content);
  const slug = makeSlug(filename);

  return {
    id: registryKey,
    source,
    language: lang,
    originalCategory,
    filename,
    filePath,
    title: extractTitle(content),
    sourceUrl: sourceInfo.url,
    sourceOrg: sourceInfo.org,
    sourceRepo: sourceInfo.repo,
    rawContent: content,
    lineCount: lines.length,
    estimatedReadMinutes: Math.max(1, Math.round(lines.length / 50)),
    hasIronLaw: /铁律|iron\s*law|NEVER|ALWAYS.*FIRST/i.test(content),
    hasChecklist: /验证清单|checklist|check\s*list/i.test(content),
    hasCodeExamples: /```\w+/.test(content),
    // Registry data (with defaults)
    unifiedCategory: regEntry?.unifiedCategory || guessCategory(originalCategory, source),
    tags: regEntry?.tags || [],
    type: regEntry?.type || 'reference',
    difficulty: regEntry?.difficulty || 'intermediate',
    verified: regEntry?.verified ?? (source === 'superpowers'),
    compatibleWith: regEntry?.compatibleWith || ['claude-code'],
    highlight: (lang === 'cn' ? regEntry?.highlight_cn : regEntry?.highlight_en) || '',
    pairedId: lang === 'cn' ? regEntry?.paired_en : regEntry?.paired_cn,
    slug,
  };
}

function guessCategory(originalCategory: string, _source: string): string {
  const cat = originalCategory.toLowerCase();
  if (cat.includes('规划') || cat.includes('planning')) return 'think-plan';
  if (cat.includes('初始化') || cat.includes('init') || cat.includes('scaffold')) return 'scaffold';
  if (cat.includes('设计') || cat.includes('design') || cat.includes('ui')) return 'design';
  if (cat.includes('前端') || cat.includes('frontend')) return 'frontend';
  if (cat.includes('后端') || cat.includes('backend')) return 'backend';
  if (cat.includes('方法论') || cat.includes('methodology')) return 'test';
  if (cat.includes('评审') || cat.includes('review') || cat.includes('质量') || cat.includes('quality')) return 'review';
  if (cat.includes('devops') || cat.includes('部署') || cat.includes('deploy') || cat.includes('git')) return 'ship';
  if (cat.includes('agent') || cat.includes('ai') || cat.includes('提示词') || cat.includes('prompt')) return 'ai-engineering';
  if (cat.includes('可视化') || cat.includes('viz') || cat.includes('data')) return 'data-viz';
  if (cat.includes('内容') || cat.includes('content') || cat.includes('营销') || cat.includes('marketing')) return 'content';
  if (cat.includes('文档') || cat.includes('document')) return 'documents';
  if (cat.includes('工具') || cat.includes('tool') || cat.includes('效率') || cat.includes('productivity') || cat.includes('多媒体')) return 'utilities';
  if (cat.includes('元') || cat.includes('meta')) return 'meta';
  return 'utilities'; // fallback
}

// --- Public API ---

let _allSkills: SkillMeta[] | null = null;

export function getAllSkills(): SkillMeta[] {
  if (_allSkills) return _allSkills;

  const skills: SkillMeta[] = [];
  for (const source of getSourceIds()) {
    skills.push(...scanSkillFiles(`${source}-cn`, source, 'cn'));
    skills.push(...scanSkillFiles(`${source}-en`, source, 'en'));
  }

  _allSkills = skills;
  return skills;
}

export function getSkillsByLanguage(lang: 'cn' | 'en'): SkillMeta[] {
  return getAllSkills().filter(s => s.language === lang);
}

export function getSkillsByCategory(categoryId: string, lang?: 'cn' | 'en'): SkillMeta[] {
  let skills = getAllSkills().filter(s => s.unifiedCategory === categoryId);
  if (lang) skills = skills.filter(s => s.language === lang);
  return skills;
}

export function getSkillsBySource(source: string, lang?: 'cn' | 'en'): SkillMeta[] {
  let skills = getAllSkills().filter(s => s.source === source);
  if (lang) skills = skills.filter(s => s.language === lang);
  return skills;
}

export function getSkillById(id: string): SkillMeta | undefined {
  return getAllSkills().find(s => s.id === id);
}

export function getSkillBySourceAndSlug(source: string, slug: string, lang: 'cn' | 'en'): SkillMeta | undefined {
  return getAllSkills().find(s => s.source === source && s.slug === slug && s.language === lang);
}

export function getCategoriesWithCounts(lang: 'cn' | 'en'): Category[] {
  const categories = loadCategories();
  const skills = getSkillsByLanguage(lang);

  return categories.map(cat => ({
    ...cat,
    skillCount: skills.filter(s => s.unifiedCategory === cat.id).length,
  }));
}

export function getWorkflowsWithSkills(lang: 'cn' | 'en'): Workflow[] {
  const workflows = loadWorkflows();
  const allSkills = getAllSkills();

  return workflows.map(workflow => ({
    ...workflow,
    steps: workflow.steps.map(step => ({
      ...step,
      resolvedSkills: step.skills
        .map(skillKey => {
          const cnSkill = allSkills.find(s => s.id === skillKey && s.language === 'cn');
          const enSkill = cnSkill?.pairedId
            ? allSkills.find(s => s.id === cnSkill.pairedId && s.language === 'en')
            : undefined;
          return lang === 'cn' ? cnSkill : (enSkill || cnSkill);
        })
        .filter((s): s is SkillMeta => s !== undefined),
    })),
  }));
}

export function getRelatedSkills(skill: SkillMeta, limit = 3): SkillMeta[] {
  const allSkills = getSkillsByLanguage(skill.language);
  return allSkills
    .filter(s => s.id !== skill.id)
    .map(s => ({
      skill: s,
      score: computeRelatedness(skill, s),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.skill);
}

function computeRelatedness(a: SkillMeta, b: SkillMeta): number {
  let score = 0;
  if (a.unifiedCategory === b.unifiedCategory) score += 3;
  if (a.source === b.source) score += 1;
  if (a.type === b.type) score += 1;
  const sharedTags = a.tags.filter(t => b.tags.includes(t)).length;
  score += sharedTags * 2;
  return score;
}

// --- Stats ---

export function getStats() {
  const cnSkills = getSkillsByLanguage('cn');
  const enSkills = getSkillsByLanguage('en');
  const sources = new Set(getAllSkills().map(s => s.source));
  const verified = cnSkills.filter(s => s.verified).length;

  return {
    totalCn: cnSkills.length,
    totalEn: enSkills.length,
    total: cnSkills.length + enSkills.length,
    sources: sources.size,
    verified,
    categories: loadCategories().length,
    workflows: loadWorkflows().length,
  };
}

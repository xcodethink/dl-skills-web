/**
 * Generates content files and registry entries from translated candidates.
 *
 * v2: Supports platform compatibility tags (claude-code, codex, cursor),
 *     fragment merges, and troubleshooting type.
 *
 * Maps candidates to the project's content structure:
 *   content/{source}-cn/{category}/{seq}-{name}.md
 *   content/{source}-en/{category}/{seq}-{name}.md
 */

import * as db from '../db/client.js';

/** Unified category mapping from AI category IDs to directory names. */
const CATEGORY_MAP: Record<string, { cn: string; en: string; letter: string }> = {
  'think-plan': { cn: 'A-思考与规划', en: 'A-Think-and-Plan', letter: 'A' },
  'scaffold': { cn: 'B-项目脚手架', en: 'B-Project-Scaffold', letter: 'B' },
  'design': { cn: 'C-系统设计', en: 'C-System-Design', letter: 'C' },
  'frontend': { cn: 'D-前端开发', en: 'D-Frontend', letter: 'D' },
  'backend': { cn: 'E-后端开发', en: 'E-Backend', letter: 'E' },
  'test': { cn: 'F-测试', en: 'F-Testing', letter: 'F' },
  'debug': { cn: 'G-调试', en: 'G-Debug', letter: 'G' },
  'review': { cn: 'H-代码审查', en: 'H-Code-Review', letter: 'H' },
  'ship': { cn: 'I-部署交付', en: 'I-Ship', letter: 'I' },
  'ai-engineering': { cn: 'J-AI工程', en: 'J-AI-Engineering', letter: 'J' },
  'data-viz': { cn: 'K-数据可视化', en: 'K-Data-Viz', letter: 'K' },
  'content': { cn: 'L-内容创作', en: 'L-Content', letter: 'L' },
  'documents': { cn: 'M-文档', en: 'M-Documents', letter: 'M' },
  'utilities': { cn: 'N-实用工具', en: 'N-Utilities', letter: 'N' },
  'meta': { cn: 'O-元技能', en: 'O-Meta', letter: 'O' },
};

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface RegistryEntry {
  key: string;
  entry: Record<string, unknown>;
}

export interface PublicationPackage {
  files: GeneratedFile[];
  registryEntries: RegistryEntry[];
  candidateIds: string[];
}

/**
 * Generate publication files for all translated candidates.
 */
export async function generatePublicationPackage(): Promise<PublicationPackage> {
  const result = await db.execute(
    `SELECT c.*, s.id as src_id
     FROM candidates c
     JOIN sources s ON c.source_id = s.id
     WHERE c.status = 'translated'
     ORDER BY c.score_weighted DESC
     LIMIT 50`
  );

  const files: GeneratedFile[] = [];
  const registryEntries: RegistryEntry[] = [];
  const candidateIds: string[] = [];

  for (const row of result.results) {
    const id = row.id as string;
    const sourceId = row.source_id as string;
    const category = (row.override_category || row.suggested_category || 'utilities') as string;
    const translatedCn = row.translated_cn as string;
    const translatedEn = row.translated_en as string;

    if (!translatedCn || !translatedEn) continue;

    // Derive names
    const nameCn = (row.override_name_cn || row.summary_cn || deriveNameFromPath(row.source_path as string)) as string;
    const nameEn = (row.override_name_en || row.summary_en || deriveNameFromPath(row.source_path as string)) as string;
    const highlightCn = (row.override_highlight_cn || row.summary_cn || '') as string;
    const highlightEn = (row.override_highlight_en || row.summary_en || '') as string;

    const catInfo = CATEGORY_MAP[category] || CATEGORY_MAP['utilities'];
    const sourceName = deriveSourceName(sourceId);

    // Generate sequence number (count existing files + 1)
    const seq = String(files.filter(f => f.path.includes(`${sourceName}-cn/${catInfo.cn}/`)).length + 1).padStart(2, '0');

    const slugCn = `${seq}-${sanitizeFilename(nameCn)}`;
    const slugEn = `${seq}-${sanitizeFilename(nameEn)}`;

    const pathCn = `content/${sourceName}-cn/${catInfo.cn}/${slugCn}.md`;
    const pathEn = `content/${sourceName}-en/${catInfo.en}/${slugEn}.md`;

    files.push({ path: pathCn, content: translatedCn });
    files.push({ path: pathEn, content: translatedEn });

    // Parse platform compatibility
    const compatibleWith = parseCompatibility(row);
    const skillType = (row.override_type || row.suggested_type || 'tool') as string;

    // Registry entry with enhanced fields
    const registryKey = `${sourceName}/${catInfo.cn}/${slugCn}`;
    registryEntries.push({
      key: registryKey,
      entry: {
        unifiedCategory: category,
        tags: JSON.parse((row.override_tags || row.suggested_tags || '[]') as string),
        type: skillType,
        difficulty: (row.override_difficulty || row.suggested_difficulty || 'intermediate') as string,
        verified: false,
        compatibleWith,
        highlight_cn: highlightCn,
        highlight_en: highlightEn,
        paired_en: `${sourceName}/${catInfo.en}/${slugEn}`,
      },
    });

    candidateIds.push(id);
  }

  return { files, registryEntries, candidateIds };
}

/**
 * Parse platform compatibility from candidate row.
 * Returns an array like ['claude-code', 'codex', 'cursor'].
 */
function parseCompatibility(row: Record<string, unknown>): string[] {
  // Try the new compatible_with field first
  if (row.compatible_with) {
    try {
      const parsed = JSON.parse(row.compatible_with as string);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { /* fall through */ }
  }

  // Fallback: default to claude-code only
  return ['claude-code'];
}

function deriveSourceName(sourceId: string): string {
  // "anthropics/skills" → "anthropics-skills"
  return sourceId.replace(/\//g, '-').toLowerCase();
}

function deriveNameFromPath(sourcePath: string): string {
  const name = sourcePath.split('/').pop() || 'skill';
  return name.replace(/\.md$/i, '').replace(/^SKILL$/i, 'skill');
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

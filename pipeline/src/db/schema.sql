-- =============================================================================
-- DL Skills Pipeline — D1 Database Schema
-- =============================================================================

-- Tracked source repositories
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,                    -- e.g. "anthropics/skills"
  url TEXT NOT NULL,                      -- e.g. "https://github.com/anthropics/skills"
  skill_pattern TEXT,                     -- e.g. "skills/*/SKILL.md"
  status TEXT NOT NULL DEFAULT 'pending', -- pending | active | archived
  last_checked_at TEXT,
  last_commit_sha TEXT,
  discovered_via TEXT,                    -- watchlist | search | awesome-list
  stars INTEGER DEFAULT 0,
  license TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  notes TEXT
);

-- Candidate skills discovered by the pipeline
CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,                    -- UUID v4
  source_id TEXT NOT NULL REFERENCES sources(id),
  source_path TEXT NOT NULL,              -- e.g. "skills/docx/SKILL.md"
  source_commit_sha TEXT,
  content_hash TEXT,                      -- SHA256 of normalized content (dedup)

  -- Raw content
  raw_markdown TEXT NOT NULL,
  raw_token_count INTEGER,
  format TEXT,                            -- standard-skill | flat-markdown | awesome-link | mixed | single-file

  -- AI analysis results (9-dimension scoring)
  analysis_json TEXT,                     -- Full JSON from Claude
  score_relevance REAL,                   -- Renamed: content_quality — 内容本身质量
  score_structure REAL,                   -- Renamed: problem_solving — 具体解决什么问题
  score_actionability REAL,               -- Renamed: scene_fitness — 适合什么场景
  score_uniqueness REAL,                  -- Renamed: ai_readability — AI 能否读懂
  score_completeness REAL,                -- Renamed: rigor — 严谨性和全面性
  score_weighted REAL,
  -- New scoring dimensions
  score_problem_accumulation REAL,        -- 问题积累价值（常见错误、踩坑记录）
  score_granularity REAL,                 -- 细分场景匹配度
  score_integration_fit REAL,             -- 片段并入 vs 独立文件的判断
  score_optimization_potential REAL,      -- 对已有内容的优化潜力
  ai_recommendation TEXT,                 -- ACCEPT | REVIEW | REJECT | MERGE_FRAGMENT
  suggested_category TEXT,                -- Mapped to unified category ID
  suggested_tags TEXT,                    -- JSON array: ["tdd", "testing"]
  suggested_type TEXT,                    -- discipline | tool | process | reference | troubleshooting
  suggested_difficulty TEXT,              -- starter | intermediate | advanced
  duplicate_of TEXT,                      -- Existing skill ID if duplicate, else null
  summary_en TEXT,                        -- One-line English summary
  summary_cn TEXT,                        -- One-line Chinese summary

  -- Platform compatibility
  compatible_with TEXT,                   -- JSON array: ["claude-code", "codex", "cursor"]
  compatibility_rationale TEXT,           -- Why this suits specific platforms

  -- Fragment extraction (for partial merging)
  fragment_action TEXT,                   -- standalone | merge_into | split_merge | optimize_existing
  merge_target TEXT,                      -- Target file path if fragment_action = merge_into
  merge_content TEXT,                     -- Extracted fragment content to merge
  optimization_targets TEXT,              -- JSON array of existing files that need optimization

  -- Review state machine:
  -- pending_analysis → analyzed → pending_review → approved → translating → translated → publishing → published
  -- pending_analysis → analyzed → auto_rejected
  -- pending_review → rejected
  status TEXT NOT NULL DEFAULT 'pending_analysis',
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_notes TEXT,

  -- Admin overrides (nullable — if null, use AI suggestion)
  override_category TEXT,
  override_tags TEXT,                     -- JSON array
  override_type TEXT,
  override_difficulty TEXT,
  override_name_cn TEXT,
  override_name_en TEXT,
  override_highlight_cn TEXT,
  override_highlight_en TEXT,

  -- Translation (professional-grade, not "acceptable")
  translated_cn TEXT,                     -- Full CN markdown
  translated_en TEXT,                     -- Full EN markdown
  translation_reviewed INTEGER NOT NULL DEFAULT 0,

  -- Publication
  published_at TEXT,
  published_path_cn TEXT,                 -- e.g. "newSource-cn/A-类别/01-名称.md"
  published_path_en TEXT,
  registry_key TEXT,                      -- Key in skills-registry.yaml
  pr_number INTEGER,                      -- GitHub PR number
  pr_url TEXT,

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Discovery run logs
CREATE TABLE IF NOT EXISTS discovery_runs (
  id TEXT PRIMARY KEY,                    -- UUID v4
  channel TEXT NOT NULL,                  -- watchlist | search | awesome-list
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  candidates_found INTEGER NOT NULL DEFAULT 0,
  new_candidates INTEGER NOT NULL DEFAULT 0,
  duplicates_skipped INTEGER NOT NULL DEFAULT 0,
  errors TEXT,                            -- JSON array of error messages
  status TEXT NOT NULL DEFAULT 'running'  -- running | completed | failed
);

-- Rate limiting for admin API
CREATE TABLE IF NOT EXISTS rate_limits (
  ip TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT,
  last_attempt_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (ip, endpoint)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_source ON candidates(source_id);
CREATE INDEX IF NOT EXISTS idx_candidates_score ON candidates(score_weighted DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_hash ON candidates(content_hash);
CREATE INDEX IF NOT EXISTS idx_sources_status ON sources(status);
CREATE INDEX IF NOT EXISTS idx_discovery_runs_channel ON discovery_runs(channel);

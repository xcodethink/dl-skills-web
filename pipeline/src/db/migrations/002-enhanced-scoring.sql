-- Migration 002: Enhanced 9-dimension scoring + platform compatibility + fragment extraction
-- Run this against existing D1 database to add new columns

ALTER TABLE candidates ADD COLUMN score_problem_accumulation REAL;
ALTER TABLE candidates ADD COLUMN score_granularity REAL;
ALTER TABLE candidates ADD COLUMN score_integration_fit REAL;
ALTER TABLE candidates ADD COLUMN score_optimization_potential REAL;
ALTER TABLE candidates ADD COLUMN compatible_with TEXT;
ALTER TABLE candidates ADD COLUMN compatibility_rationale TEXT;
ALTER TABLE candidates ADD COLUMN fragment_action TEXT;
ALTER TABLE candidates ADD COLUMN merge_target TEXT;
ALTER TABLE candidates ADD COLUMN merge_content TEXT;
ALTER TABLE candidates ADD COLUMN optimization_targets TEXT;

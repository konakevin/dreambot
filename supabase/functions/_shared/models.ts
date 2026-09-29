/**
 * Single source of truth for Anthropic model IDs (Deno / Edge Functions).
 *
 * Mirrors scripts/lib/models.js — keep both files in sync when bumping.
 * Sonnet 4 (claude-sonnet-4-20250514) was retired by Anthropic 2026-06-15.
 */

export const SONNET = 'claude-sonnet-4-6';
export const HAIKU = 'claude-haiku-4-5-20251001';
/** Sonnet 5.5. Nothing defaults to it: a job moves by engine_config.llm_models (anthropic.ts, LLM_MIGRATION.md).
 *  SONNET stays 4.6 until the migration's cleanup step. */
export const SONNET_5_5 = 'claude-sonnet-5-5';

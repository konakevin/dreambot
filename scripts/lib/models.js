/**
 * Single source of truth for Anthropic model IDs.
 *
 * Update model versions HERE — everything else imports from this file.
 *
 * Sonnet 4 (claude-sonnet-4-20250514) was retired by Anthropic 2026-06-15.
 * Sonnet 4.5 (claude-sonnet-4-5-20250929) was also rolled forward to keep
 * the codebase on one current stable model.
 */

const SONNET = 'claude-sonnet-4-6';
const HAIKU = 'claude-haiku-4-5-20251001';
// Sonnet 5.5. Nothing defaults to it: production jobs move by engine_config.llm_models (scripts/lib/anthropic.js,
// LLM_MIGRATION.md), and offline scripts opt in with --llm-model. SONNET stays 4.6 until the migration's cleanup.
const SONNET_5_5 = 'claude-sonnet-5-5';
// Sonnet 5, for one job: the cast race read (cast_ethnicity), which 5.5 declines (LLM_5_5_TUNING.md 2.1).
const SONNET_5 = 'claude-sonnet-5';

module.exports = { SONNET, HAIKU, SONNET_5_5, SONNET_5 };

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

module.exports = { SONNET, HAIKU };

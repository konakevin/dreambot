/**
 * Single source of truth for Anthropic model IDs (Deno / Edge Functions).
 *
 * Mirrors scripts/lib/models.js — keep both files in sync when bumping.
 * Sonnet 4 (claude-sonnet-4-20250514) was retired by Anthropic 2026-06-15.
 */

export const SONNET = 'claude-sonnet-4-6';
export const HAIKU = 'claude-haiku-4-5-20251001';

-- Migration 136: Add style_summary column to uploads for the DLT pipeline.
--
-- Captured at insert time (one Haiku call per dream) by a distiller that
-- strips subjects from the raw ai_prompt and keeps only style descriptors:
-- palette, lighting, technique, mood, atmosphere, texture. ~15-25 words.
--
-- Used by Dream Like This: the source post's style_summary becomes the
-- styleReference passed to the V4 compiler, eliminating subject bleed
-- (where, e.g., a vampire/cathedral DLT'd to "me on a Tahiti beach"
-- previously contaminated the new render with gothic architecture).
--
-- NULL means "not yet distilled OR no style signal extractable" — DLT
-- falls back to ai_prompt with the existing (weaker) filtering. So this
-- column is purely additive; no read path will break if it's NULL.
--
-- Backfill: scripts/backfill-style-summary.js processes all publicly-
-- viewable posts (is_posted=true OR is_active=true) where style_summary
-- IS NULL AND ai_prompt IS NOT NULL. Throttled to stay well under
-- Anthropic rate limits.

ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS style_summary text;

COMMENT ON COLUMN public.uploads.style_summary IS
  'Subject-stripped style fingerprint distilled from ai_prompt by Haiku at insert time. ~15-25 words capturing palette, lighting, technique, mood, atmosphere, texture. NULL means not yet distilled or no style signal extractable — DLT falls back to ai_prompt.';

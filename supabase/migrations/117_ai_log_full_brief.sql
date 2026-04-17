-- Migration 117: AI generation log — full brief + fallback audit trail
--
-- Phase 1 of the V4 hardening plan (V4_HARDENING_PLAN.md).
-- Expands ai_generation_log so every generation captures the full LLM
-- conversation (Sonnet brief + raw response, Haiku vision describe) and
-- the fallback audit trail.
-- Also drops dead `dream_templates` table (superseded by bot_seeds +
-- nightly_seeds split in migration 111).
--
-- Additive only — no existing column is modified. Rollback-safe.
--
-- LLM split (end-state after Phase 3):
--   Sonnet 4.5 — ALL prompt-writing (V4 compiler, nightly, any Kontext rewrite)
--   Haiku 4.5 — vision only (describeWithVision for photo reimagine + cast)

-- 1. Observability columns on ai_generation_log
ALTER TABLE public.ai_generation_log
  ADD COLUMN IF NOT EXISTS sonnet_brief            text,
  ADD COLUMN IF NOT EXISTS sonnet_raw_response     text,
  ADD COLUMN IF NOT EXISTS vision_description      text,
  ADD COLUMN IF NOT EXISTS fallback_reasons        text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS replicate_prediction_id text;

-- 2. Drop dead schema — dream_templates was replaced by bot_seeds + nightly_seeds
--    in migration 111. Nothing reads or writes to it anymore.
DROP TABLE IF EXISTS public.dream_templates;

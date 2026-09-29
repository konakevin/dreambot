-- 574_llm_routing.sql — which Anthropic model each job runs on, from the dashboard (LLM_MIGRATION.md, step 0).
--
-- WHY. Moving Sonnet 4.6 → 5.5 is not a model-id swap: 5.5 thinks by default (the text arrives after thinking
-- blocks, which every call site used to miss), rejects an assistant prefill, and counts our text as ~1.35x the
-- tokens. The Edge client (supabase/functions/_shared/anthropic.ts) and the Node client (scripts/lib/anthropic.js)
-- now send each model its own body. These columns decide which model a JOB (create_brief, nightly_slots,
-- quality_gate, cast_describe, ... the LLM_JOBS table in anthropic.ts) runs on, so every move is a row edit with
-- an instant rollback and each job can move alone, after its own parity gate.
--
-- Every column defaults to the behaviour before this migration: empty maps = every job on its code default
-- (Sonnet 4.6 or Haiku, exactly as before). Nothing changes when this applies.
--
--   llm_models            jsonb job → model. A value is "model" or "model@effort" or {"model": ..., "effort": ...}.
--                         e.g. {"create_brief": "claude-sonnet-5-5@medium"}. A model the client has no profile for
--                         is ignored (the default runs) and stamped llm_config_invalid:<job>:<value>.
--   llm_preview_user_ids  accounts that get llm_preview_models on top of llm_models (the Kevin-only canary).
--   llm_preview_models    jsonb, same shape as llm_models.
--   essence_card_generation
--                         write a location essence card for a nightly place that has none. The old generator
--                         pre-filled the reply with "{", which Sonnet 4.6 rejects with a 400, so no card has been
--                         written since 2026-05-11 and nightly has run on existing cards only. Off keeps exactly
--                         that. On (Kevin's call: it changes nightly) uses the fixed, prefill-free generator.
--   bot_run_log.llm_models
--                         which model(s) wrote a bot run's text, as the stamps the Node client records
--                         ("bot_prompt:claude-sonnet-4-6", fallbacks included). NULL for rows before 574.
--
-- Service-role reads only: engine_config's LLM columns are read by the edge functions and bot scripts, never by
-- the client, and bot_run_log is not client-read (the migration-278 column-grant rule covers users and uploads).
--
-- ROLLBACK of any job move (instant, no deploy):
--   UPDATE public.engine_config SET llm_models = llm_models - '<job>' WHERE id = 1;
-- Everything back to the code defaults:
--   UPDATE public.engine_config SET llm_models = '{}', llm_preview_models = '{}' WHERE id = 1;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS llm_models jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS llm_preview_user_ids uuid[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS llm_preview_models jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS essence_card_generation boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.engine_config.llm_models IS
  'Anthropic model per job (LLM_JOBS in supabase/functions/_shared/anthropic.ts): {"job": "model" | "model@effort" | {"model","effort"}}. Empty = code defaults (Sonnet 4.6 / Haiku). Mig 574, LLM_MIGRATION.md.';
COMMENT ON COLUMN public.engine_config.llm_preview_user_ids IS
  'Accounts that get llm_preview_models on top of llm_models (canary). Mig 574.';
COMMENT ON COLUMN public.engine_config.llm_preview_models IS
  'Same shape as llm_models; applies only to llm_preview_user_ids. Mig 574.';
COMMENT ON COLUMN public.engine_config.essence_card_generation IS
  'Write a location essence card for a nightly place with none. Off = existing cards only (what ran in practice since 2026-05-11, when the prefill 400s began). Mig 574.';

ALTER TABLE public.bot_run_log
  ADD COLUMN IF NOT EXISTS llm_models text;

COMMENT ON COLUMN public.bot_run_log.llm_models IS
  'Which Anthropic model(s) wrote this run''s text, as the Node client''s stamps (job:model, fallbacks included). NULL before mig 574. LLM_MIGRATION.md.';

-- 580_llm_canary_kevin_race_read_sonnet5.sql — LLM_5_5_TUNING.md W2 / 2.1: the cast race read on Sonnet 5 for Kevin.
--
-- Sonnet 5.5 declines to infer race from a photo (4/63 answered on the labelled set). Kevin picked Sonnet 5 as the
-- replacement on 2026-09-29. Measured on the 21 labelled cast photos x 3 runs, the production prompt unchanged:
--   Sonnet 5 63/63 · Sonnet 4.6 63/63 · Haiku 4.5 57/63 · Opus 5.5 6/63 ("Uncertain") · Sonnet 5.5 4/63 (declines)
-- and again through the real vision.ts path (scripts/qa-llm-parity.ts --suites=cast --arms=4.6,5.0, 3 runs): 63/63,
-- stamped llm:cast_ethnicity:claude-sonnet-5, 0 fallbacks, 0 refusals. The Sonnet 5 profile (thinking disabled,
-- tokenScale 1.35) ships in _shared/anthropic.ts; describe-photo is deployed with it.
-- Sonnet 5 is for this ONE read: on hair colour it gave grey false positives (4.5-9% of non-grey heads), so
-- cast_hair / cast_describe are tuned on 5.5 separately (tracker 2.2 / 2.3).
--
-- Kevin's account only (llm_preview_user_ids); everyone moves at the final cutover.
-- ROLLBACK (instant): UPDATE public.engine_config SET llm_preview_models = llm_preview_models - 'cast_ethnicity' WHERE id = 1;

UPDATE public.engine_config
   SET llm_preview_models = llm_preview_models || '{"cast_ethnicity": "claude-sonnet-5"}'::jsonb
 WHERE id = 1;

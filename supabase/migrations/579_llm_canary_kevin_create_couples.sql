-- 579_llm_canary_kevin_create_couples.sql — LLM_5_5_TUNING.md W1: the Create couple jobs join Kevin's 5.5 canary.
--
-- Evidence (2026-09-29, LLM_5_5_TUNING.md 1.6 / 1.7): two samples of each model on the 20 Create couple inputs.
--   first-try face-swap hold  5.5 37/39 (+1 Fly 500) vs 4.6 37/39;  degraded to a solo 2 vs 2
--   scenery score             5.5 16.10 / 17.55 vs 4.6 13.87 / 15.26
--   Kevin's blind votes       5.5 picked 12/19 on the fresh pairs, 19/39 over both votes (bar 45%)
--   outfit text harness       garments 74/74 on both, misfit 0/34 on both (step 1)
-- No overlay is needed: the nightly wardrobe-length overlay (mig 577 row slots55-r1.1c-wardrobe-12w) is nightly_slots
-- only; Create's couple outfits were already shorter on 5.5 than on 4.6.
--
-- Only Kevin (llm_preview_user_ids) gets these; everyone else is unchanged. create_brief + restyle_brief stay on
-- 5.5 from mig 576.
--
-- ROLLBACK of this step only (instant, no deploy):
--   UPDATE public.engine_config
--      SET llm_preview_models = llm_preview_models - 'create_slots' - 'scene_split' - 'outfit_reader'
--    WHERE id = 1;

UPDATE public.engine_config
   SET llm_preview_models = llm_preview_models || '{"create_slots": "claude-sonnet-5-5@high", "scene_split": "claude-sonnet-5-5@high", "outfit_reader": "claude-sonnet-5-5@high"}'::jsonb
 WHERE id = 1;

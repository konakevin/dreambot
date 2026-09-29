-- 576_llm_canary_kevin.sql — LLM migration step 3.1: Sonnet 5.5 on Kevin's account only, for the jobs that won.
-- LLM_MIGRATION.md.
--
-- Step 1 (text) and step 2 (paired renders + Kevin's blind vote, 2026-09-29) split cleanly by job:
--   create_brief  (Create solos + text prompts): text parity better on every measure; blind vote 5.5 picked 8/10
--                 Create solos, 55/117 over all pairs (47%, bar 45%); solo swap hold 23/23 both models.
--   restyle_brief: the same prompt shape as create_brief (0 logged restyle rewrites in 30 days to vote on).
-- NOT moving: the couple slot writers (create_slots 35% of Kevin's picks, nightly couples 41%; nightly first-try swap
-- hold 86.8% vs 95%: 5.5 writes crouching / setting-down actions that turn faces away), scene_split and
-- outfit_reader (couple pipeline), every nightly job, and the cast photo reads (5.5 declines to infer race).
--
-- This is the canary: only Kevin (llm_preview_user_ids) gets llm_preview_models. Everyone else is unchanged.
-- Watch: node scripts/llm-rollout-report.mjs (per job x model: fallbacks, refusals, truncation, swap hold).
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET llm_preview_models = '{}' WHERE id = 1;

UPDATE public.engine_config
   SET llm_preview_user_ids = ARRAY['eab700d8-f11a-4f47-a3a1-addda6fb67ec']::uuid[],
       llm_preview_models = '{"create_brief": "claude-sonnet-5-5@high", "restyle_brief": "claude-sonnet-5-5@high"}'::jsonb
 WHERE id = 1;

-- 583_llm_canary_bloombot_judges.sql — LLM_5_5_TUNING.md W6 (5.3 / 5.4): one public bot + the quality checks on 5.5.
--
-- bot_prompt (the bot brief → Flux prompt): step 1 bench 60/60 on both models, 3.8 s vs 9.3 s; Kevin's blind vote on
--   bot renders 18/35 (51%). Canary = ONE public bot, BloomBot (flowers/gardens, no people: the lowest-risk public
--   feed), 2 posts/day. A bot is a user, so its id in llm_preview_user_ids routes its runs through llm_preview_models
--   (scripts/lib/botEngine.js); its stamps land in bot_run_log.llm_models.
-- quality_gate (BROKEN / PROFILE re-render check) + scene_people (people in a must-be-empty fallback scene): step 1 on
--   labelled images 5.5 caught 12/12 broken renders vs 4.6 10/12, 0 false alarms on both; people judge 100% vs 74%.
--   Canary = Kevin's renders (already in llm_preview_user_ids).
-- The preview map is shared by every preview user; each account only calls the jobs its own pipeline uses (bots never
-- call create_* / cast_*, Kevin never calls bot_prompt), so nothing else changes. Everyone else is unchanged.
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config
--      SET llm_preview_user_ids = array_remove(llm_preview_user_ids, 'e66747c9-23b1-4931-8ea8-cfb8e05b7616'::uuid),
--          llm_preview_models = llm_preview_models - 'bot_prompt' - 'quality_gate' - 'scene_people'
--    WHERE id = 1;

UPDATE public.engine_config
   SET llm_preview_user_ids = (
         SELECT array_agg(DISTINCT x)
           FROM unnest(llm_preview_user_ids || ARRAY['e66747c9-23b1-4931-8ea8-cfb8e05b7616']::uuid[]) AS x
       ),
       llm_preview_models = llm_preview_models || '{"bot_prompt": "claude-sonnet-5-5@high", "quality_gate": "claude-sonnet-5-5@high", "scene_people": "claude-sonnet-5-5@high"}'::jsonb
 WHERE id = 1;

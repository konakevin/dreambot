-- 584_llm_cutover_everyone_55.sql — LLM_5_5_TUNING.md W7: EVERYONE on Sonnet 5.5 for 2 weeks (Kevin 2026-09-29:
-- "cut everyone over to 5.5 for 2 weeks, i will then monitor renders and dreams"; keep the ability to cut back).
-- Kevin's go: 2026-09-30 05:21 UTC ("just flip it all to 5.5 now, we don't need the night cool off"). Flipped before
-- the 08:00 UTC nightly enqueue, so tonight's batch is the first 5.5 nightly for everyone (day 1 of the 2-week watch).
--
-- Evidence (all in LLM_5_5_TUNING.md): nightly couples 52% in Kevin's blind vote with slots55-r1.1c-wardrobe-12w,
-- scenery 16.76 vs 16.12, first-try hold 36/40 vs 73/80; Create couples 19/39 (fresh 12/19); Create solos 80%; bots 51%;
-- scene + holiday nightlies 14/19 (74%) with the scene-length overlays; judges 12/12 vs 10/12 and 100% vs 74%; cast reads hair 77/78, age 75/81,
-- race on Sonnet 5 63/63; location beats 93% in range; declines 1/25 vs 4.6 2/25.
--
-- What changes: engine_config.llm_models routes every Sonnet job below for every account, and the four kept nightly
-- overlays switch on (couple outfit length, location-beat length, scene + holiday prompt length; each applies to its
-- job on 5.5 only). The cast overlays have been active since mig 582. 4.6 stays in every fallback chain (job model →
-- 4.6 → Haiku), so a 5.5 failure still gets a dream. The overlay rows' exact text is recorded here (repo = record).
--
-- ROLLBACK for everyone (instant, no deploy; overlays only touch 5.5 calls, so they can stay):
--   UPDATE public.engine_config SET llm_models = '{}'::jsonb WHERE id = 1;
-- Partial rollback of one job: UPDATE public.engine_config SET llm_models = llm_models - '<job>' WHERE id = 1;

UPDATE public.engine_config
   SET llm_models = '{
         "create_brief":   "claude-sonnet-5-5@high",
         "create_slots":   "claude-sonnet-5-5@high",
         "scene_split":    "claude-sonnet-5-5@high",
         "outfit_reader":  "claude-sonnet-5-5@high",
         "restyle_brief":  "claude-sonnet-5-5@high",
         "nightly_brief":  "claude-sonnet-5-5@high",
         "nightly_slots":  "claude-sonnet-5-5@high",
         "location_beat":  "claude-sonnet-5-5@high",
         "essence_card":   "claude-sonnet-5-5@high",
         "quality_gate":   "claude-sonnet-5-5@high",
         "scene_people":   "claude-sonnet-5-5@high",
         "cast_describe":  "claude-sonnet-5-5@high",
         "cast_hair":      "claude-sonnet-5-5@high",
         "cast_ethnicity": "claude-sonnet-5",
         "bot_prompt":     "claude-sonnet-5-5@high"
       }'::jsonb,
       -- The canary map is now the same for everyone; clear it so a rollback of llm_models rolls back every account.
       llm_preview_models = '{}'::jsonb,
       llm_preview_user_ids = '{}'::uuid[]
 WHERE id = 1;

INSERT INTO public.llm_prompt_overlays (key, job, model, mode, find, body, active, note) VALUES
  ('beat55-r3.1-length', 'location_beat', 'claude-sonnet-5-5', 'append', NULL,
   'Keep the phrase SHORT: 10 to 16 words, counted, and never more than 18. One clause, or two joined by a comma; no second sentence and no list of details.',
   true, 'LLM_5_5_TUNING.md 3.1: location beats in 8-20 words 68.3% -> 93.3% on 5.5 (4.6 86.7%). Active from the cutover (mig 584).'),
  ('scene55-r3.2-pure-length', 'nightly_brief', 'claude-sonnet-5-5', 'replace', 'Write a Flux AI prompt (50-75 words, comma-separated).',
   'Write a Flux AI prompt (120-160 words, comma-separated). Spend the extra words on concrete detail in every layer of the locked subject (foreground, midground, background, sky and light), with named materials, textures and colours; add nothing that is not part of this place.',
   true, 'LLM_5_5_TUNING.md 3.2: scene prompts 120-160 words on 5.5 (4.6 overruns the 50-75 ask to ~160); scenery 20.20 vs 4.6 19.61, 0/19 cut off; Kevin blind 14/19. Active from the cutover (mig 584).'),
  ('scene55-r3.2-holiday-length', 'nightly_brief', 'claude-sonnet-5-5', 'replace', 'Write a Flux AI prompt (55-80 words, comma-separated).',
   'Write a Flux AI prompt (120-160 words, comma-separated). Spend the extra words on concrete detail in every layer of the scene (foreground, midground, background, sky and light), with named materials, textures and colours; add nothing that is not part of this scene.',
   true, 'LLM_5_5_TUNING.md 3.2: the holiday postcard twin of scene55-r3.2-pure-length. Active from the cutover (mig 584).')
ON CONFLICT (key) DO UPDATE
   SET job = EXCLUDED.job, model = EXCLUDED.model, mode = EXCLUDED.mode, find = EXCLUDED.find, body = EXCLUDED.body,
       active = EXCLUDED.active, note = EXCLUDED.note, updated_at = now();

UPDATE public.llm_prompt_overlays SET active = true, updated_at = now() WHERE key = 'slots55-r1.1c-wardrobe-12w';

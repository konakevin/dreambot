-- 582_llm_cast_reads_55_kevin.sql — LLM_5_5_TUNING.md W2 (2.2 / 2.3): the cast hair + describe reads on 5.5 for Kevin,
-- with their 5.5-only prompt overlays switched on; plus the kept nightly overlay recorded here (still inactive).
--
-- Why overlays: on the 27 labelled cast photos x 3 runs (scripts/qa-llm-parity.ts --suites=cast), untuned 5.5 read
-- hair 65/78 (4.6 78/78) because it EXPLAINED instead of answering ("Dark brown eyebrows suggest the hair is dyed
-- blonde; the natural…", "The head is fully covered by a cloth wrap, so…"), ran out of its 27-token budget and
-- returned nothing; and it hedged ("Light brown to blonde", "greying" on a black-haired man: 3/66 grey false
-- positives). Its age reads all leaned OLD (15 reads > 5y over, 0 under).
--   5.5 + both overlays: hair 77/78, grey false positives 0/66, age within 5y 75/81 (4.6 68/81), MAE 2.6 (4.6 3.5),
--   header line 81/81.
-- An overlay applies ONLY to its job on its model (anthropic.ts applyOverlays), so 4.6 prompts are unchanged, and a 5.5
-- call that falls back to 4.6 gets 4.6's own text. Today only Kevin's account calls these jobs on 5.5.
--
-- The rows were created by the tuning rounds; this migration makes the repo the record of their exact text.
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET llm_preview_models = llm_preview_models - 'cast_hair' - 'cast_describe' WHERE id = 1;
--   UPDATE public.llm_prompt_overlays SET active = false WHERE key IN ('hair55-r2.2-answer-only', 'describe55-r2.3-age-lean');

INSERT INTO public.llm_prompt_overlays (key, job, model, mode, find, body, active, note) VALUES
  ('hair55-r2.2-answer-only', 'cast_hair', 'claude-sonnet-5-5', 'append', NULL,
   'Answer with 1 to 4 color words on one line and nothing else: no explanation, no reasoning, no ranges (never "X to Y"), no notes in brackets. Name the color the hair shows in this photo; dyed or bleached hair counts as the color it shows. If a hat, scarf or wrap covers the hair, answer your best guess from the hairline, eyebrows and beard, still in color words only. If only some strands are grey, answer the main color alone.',
   true, 'LLM_5_5_TUNING.md 2.2: hair 65/78 -> 77/78 on 5.5 (4.6 78/78), grey false positives 3/66 -> 0/66. ACTIVE: applies to 5.5 cast_hair calls only.'),
  ('describe55-r2.3-age-lean', 'cast_describe', 'claude-sonnet-5-5', 'append', NULL,
   'For the AGE line: a beard, grey or thinning hair, a head covering or a serious expression does not by itself make someone older. Judge the age from the skin, the eyes and the face, and when torn between two ages, give the lower one.',
   true, 'LLM_5_5_TUNING.md 2.3: age within 5y 66/81 -> 75/81 on 5.5 (4.6 68/81), MAE 3.3 -> 2.6, 0 read >5y young. ACTIVE: applies to 5.5 cast_describe calls only.'),
  ('slots55-r1.1c-wardrobe-12w', 'nightly_slots', 'claude-sonnet-5-5', 'replace', 'left_wardrobe (8-15 words)',
   'left_wardrobe (8-15 words; the same limit applies to right_wardrobe. Aim for about 12 words and NEVER more than 15 in either field: count the words before you answer. Three or four pieces, each named in two or three words with its colour or material, and no extra accessories. A short outfit leaves room for the place in the picture; a long list crowds it out)',
   false, 'LLM_5_5_TUNING.md 1.1: nightly couple scenery 13.04 -> 16.76 on 5.5 (4.6 16.12), Kevin blind 21/40. INACTIVE until nightly moves (the final cutover, W7).')
ON CONFLICT (key) DO UPDATE
   SET job = EXCLUDED.job, model = EXCLUDED.model, mode = EXCLUDED.mode, find = EXCLUDED.find, body = EXCLUDED.body,
       active = EXCLUDED.active, note = EXCLUDED.note, updated_at = now();

UPDATE public.engine_config
   SET llm_preview_models = llm_preview_models || '{"cast_hair": "claude-sonnet-5-5@high", "cast_describe": "claude-sonnet-5-5@high"}'::jsonb
 WHERE id = 1;

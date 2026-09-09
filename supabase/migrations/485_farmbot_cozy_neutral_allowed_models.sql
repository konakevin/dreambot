-- 485_farmbot_cozy_neutral_allowed_models.sql
--
-- FarmBot rebuild (2026-09-08): bot.allowedModels was switched to
-- [flux-2-pro, gemini-2-image, gpt-image-2, flux-2-flex] after a controlled
-- model head-to-head, but the dream_mediums.allowed_models row for
-- farmbot_cozy_neutral still listed the OLD lineup
-- [flux-1.1-pro-ultra, flux-1.1-pro, gpt-image-2, gemini-2-image].
--
-- modelPicker.js intersects bot.allowedModels with the medium's
-- allowed_models before picking — the bot list only FILTERS the medium's
-- list, it doesn't widen it (same gotcha documented in
-- BOT_SCENE_QUALITY_PLAYBOOK.md's BloomBot section). Since the two lists
-- only overlapped on gpt-image-2 + gemini-2-image, flux-2-pro and
-- flux-2-flex were silently unreachable in every real production render,
-- even though they were the models actually proven clean in the head-to-head
-- test. Widen the DB row to match the intended lineup.
UPDATE public.dream_mediums
SET allowed_models = ARRAY[
  'black-forest-labs/flux-2-pro',
  'google/gemini-2-image',
  'openai/gpt-image-2',
  'black-forest-labs/flux-2-flex'
]
WHERE key = 'farmbot_cozy_neutral';

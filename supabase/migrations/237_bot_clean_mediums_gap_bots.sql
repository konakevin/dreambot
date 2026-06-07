-- Migration 237: clean-render bot mediums for gpt-image-2 + nano-banana
--
-- Context: gpt-image-2 and nano-banana (google/gemini-2-image) read a bot's
-- stylized medium + painterly prompt prefix as "go fully abstract / ornamental
-- plate" and drop the subject. The bot engine fixes this via
-- bot.cleanMediumByModel (scripts/lib/cleanMediumByModel.js) — when one of those
-- models rolls, it swaps to a bot-only "*_gpt_clean" medium. 6 bots already had
-- the gpt-2-only version (bloombot/gothbot/dragonbot/mechbot/starbot/steambot);
-- this migration:
--   1) adds the clean-medium DB rows for the 3 gap bots (brickbot/oceanbot/yumbot),
--      mirroring the existing bot-only *_gpt_clean rows (is_bot_only, inactive —
--      the real directive lives in each bot's shared-blocks GPT_CLEAN, injected
--      via index.js mediumStyles; this row is for record/DLT resolution),
--   2) widens allowed_models to include nano-banana on every clean medium that a
--      bot now renders with banana (all except dragonbot, which is gpt-2-only),
--   3) adds dlt_clean_mediums rows for the 3 new mediums (playbook hard rule:
--      a new bot medium MUST have a clean DLT row; the clean string IS the
--      style-only fragment, so it doubles as the DLT clean medium).
--
-- Pure data (idempotent). Run in the Supabase dashboard SQL editor.

-- 1) Gap-bot clean medium rows.
INSERT INTO public.dream_mediums
  (key, label, directive, flux_fragment, allowed_models, is_bot_only, is_active,
   is_public, face_swaps, character_render_mode, sort_order)
VALUES
  ('brickbot_gpt_clean', 'BrickBot Clean (gpt-2 + banana)',
   'Clean LEGO diorama render with readable subjects (gpt-image-2 + nano-banana — actual directive lives in scripts/bots/brickbot/shared-blocks.js GPT_CLEAN, injected via index.js mediumStyles).',
   'Clean LEGO diorama photography, crisp brick-built scene with clearly readable minifigures and brick architecture, vibrant LEGO color palette, soft studio lighting, MOC-showcase register',
   ARRAY['openai/gpt-image-2','google/gemini-2-image'], true, false, true, false, 'natural', 9999),
  ('oceanbot_gpt_clean', 'OceanBot Clean (gpt-2 + banana)',
   'Clean ocean render with readable subjects (gpt-image-2 + nano-banana — actual directive lives in scripts/bots/oceanbot/shared-blocks.js GPT_CLEAN, injected via index.js mediumStyles).',
   'Cinematic ocean illustration, clean editorial render with clearly readable ships, sea life, and underwater scenes, rich jewel-tone nautical palette with atmospheric depth, age-of-sail and deep-sea register',
   ARRAY['openai/gpt-image-2','google/gemini-2-image'], true, false, true, false, 'natural', 9999),
  ('yumbot_gpt_clean', 'YumBot Clean (gpt-2 + banana)',
   'Clean kawaii-food render with readable subjects (gpt-image-2 + nano-banana — actual directive lives in scripts/bots/yumbot/shared-blocks.js GPT_CLEAN, injected via index.js mediumStyles).',
   'Clean kawaii food-character illustration, crisp designer-collectible render with clearly readable smiling food characters and scenes, pastel pearlescent color palette, glossy Pop-Mart register',
   ARRAY['openai/gpt-image-2','google/gemini-2-image'], true, false, true, false, 'natural', 9999)
ON CONFLICT (key) DO NOTHING;

-- 2) Widen allowed_models to include nano-banana on the clean mediums of every
--    bot that now renders with banana (all gpt-2 clean bots EXCEPT dragonbot,
--    which has no nano-banana in its lineup). Cosmetic/record (the swap is
--    forced, not gated by this), but keeps the row truthful.
UPDATE public.dream_mediums
SET allowed_models = ARRAY['openai/gpt-image-2','google/gemini-2-image']
WHERE key IN (
  'bloombot_gpt_clean','gothbot_gpt_clean','mechbot_gpt_clean',
  'starbot_gpt_clean','steambot_gpt_clean'
);

-- 3) DLT clean rows for the 3 new mediums (style-only fragment = the clean string).
INSERT INTO public.dlt_clean_mediums (medium_key, clean_flux_fragment, clean_directive)
VALUES
  ('brickbot_gpt_clean',
   'Clean LEGO diorama photography, crisp brick-built scene with clearly readable minifigures and brick architecture, vibrant LEGO color palette, soft studio lighting, MOC-showcase register',
   'Render as a clean LEGO diorama: physical brick-built scene, readable minifigures and brick architecture, vibrant LEGO palette, soft studio lighting.'),
  ('oceanbot_gpt_clean',
   'Cinematic ocean illustration, clean editorial render with clearly readable ships, sea life, and underwater scenes, rich jewel-tone nautical palette with atmospheric depth, age-of-sail and deep-sea register',
   'Render as a clean cinematic ocean illustration: readable ships, sea life, and underwater scenes, rich jewel-tone nautical palette, atmospheric depth.'),
  ('yumbot_gpt_clean',
   'Clean kawaii food-character illustration, crisp designer-collectible render with clearly readable smiling food characters and scenes, pastel pearlescent color palette, glossy Pop-Mart register',
   'Render as a clean kawaii food-character illustration: readable smiling food characters and scenes, pastel pearlescent palette, glossy designer-collectible finish.')
ON CONFLICT (medium_key) DO NOTHING;

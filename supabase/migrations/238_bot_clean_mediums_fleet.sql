-- Migration 238: clean-render bot mediums for the remaining gpt-2/banana bots
--
-- Context: extends the cleanMediumByModel "no-style" override (migration 237,
-- scripts/lib/cleanMediumByModel.js) to every other bot that ALREADY uses
-- gpt-image-2 and/or nano-banana, so the whole fleet renders those two models
-- cleanly. This does NOT enable any new models — it only adds a clean medium for
-- the models each bot already allows:
--   • chibibot, dinobot, pixelbot, retrobot — gpt-image-2 + nano-banana
--   • faebot, mangabot                       — nano-banana only (no gpt-2 in lineup;
--                                              mangabot keeps its gpt-2 ban)
-- (earthbot / tinybot / toybot use neither model, so they get nothing.)
--
-- Each row mirrors the existing bot-only *_gpt_clean rows (is_bot_only, inactive;
-- real directive lives in the bot's shared-blocks GPT_CLEAN via index.js
-- mediumStyles) + a dlt_clean_mediums row (clean string = the style fragment).
--
-- Pure data (idempotent). Run in the Supabase dashboard SQL editor.

INSERT INTO public.dream_mediums
  (key, label, directive, flux_fragment, allowed_models, is_bot_only, is_active,
   is_public, face_swaps, character_render_mode, sort_order)
VALUES
  ('chibibot_gpt_clean', 'ChibiBot Clean (gpt-2 + banana)',
   'Clean chibi render with readable subjects (actual directive in scripts/bots/chibibot/shared-blocks.js GPT_CLEAN via mediumStyles).',
   'Clean cute chibi character illustration, crisp render with clearly readable big-eyed rounded characters and cozy scenes, soft pastel palette, warm gentle lighting, designer-collectible register',
   ARRAY['openai/gpt-image-2','google/gemini-2-image'], true, false, true, false, 'natural', 9999),
  ('dinobot_gpt_clean', 'DinoBot Clean (gpt-2 + banana)',
   'Clean dinosaur render with readable subjects (actual directive in scripts/bots/dinobot/shared-blocks.js GPT_CLEAN via mediumStyles).',
   'Clean cinematic dinosaur illustration, crisp render with clearly readable species-accurate dinosaurs and lush prehistoric environments, rich naturalistic palette, atmospheric depth, documentary register',
   ARRAY['openai/gpt-image-2','google/gemini-2-image'], true, false, true, false, 'natural', 9999),
  ('pixelbot_gpt_clean', 'PixelBot Clean (gpt-2 + banana)',
   'Clean pixel-art render with readable subjects (actual directive in scripts/bots/pixelbot/shared-blocks.js GPT_CLEAN via mediumStyles).',
   'Clean crisp pixel-art illustration, readable pixel-art game scene with clear sprites and environment, vibrant limited palette, sharp pixel grid, retro-game register',
   ARRAY['openai/gpt-image-2','google/gemini-2-image'], true, false, true, false, 'natural', 9999),
  ('retrobot_gpt_clean', 'RetroBot Clean (gpt-2 + banana)',
   'Clean retro render with readable subjects (actual directive in scripts/bots/retrobot/shared-blocks.js GPT_CLEAN via mediumStyles).',
   'Clean nostalgic retro illustration, crisp render with clearly readable vintage subjects and period scenes, warm faded palette, soft analog lighting, era-authentic register',
   ARRAY['openai/gpt-image-2','google/gemini-2-image'], true, false, true, false, 'natural', 9999),
  ('faebot_gpt_clean', 'FaeBot Clean (banana)',
   'Clean fae render with readable subjects (actual directive in scripts/bots/faebot/shared-blocks.js GPT_CLEAN via mediumStyles).',
   'Clean enchanted-fae fantasy illustration, crisp render with clearly readable fae figures and lush forest scenes, rich jewel-tone palette, soft magical lighting, storybook fantasy register',
   ARRAY['google/gemini-2-image'], true, false, true, false, 'natural', 9999),
  ('mangabot_gpt_clean', 'MangaBot Clean (banana)',
   'Clean anime render with readable subjects (actual directive in scripts/bots/mangabot/shared-blocks.js GPT_CLEAN via mediumStyles).',
   'Clean cel-shaded anime illustration, crisp render with clearly readable characters and recognizable anime environments, vibrant saturated palette, atmospheric depth, hand-drawn anime register',
   ARRAY['google/gemini-2-image'], true, false, true, false, 'natural', 9999)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.dlt_clean_mediums (medium_key, clean_flux_fragment, clean_directive)
VALUES
  ('chibibot_gpt_clean',
   'Clean cute chibi character illustration, crisp render with clearly readable big-eyed rounded characters and cozy scenes, soft pastel palette, warm gentle lighting, designer-collectible register',
   'Render as a clean cute chibi illustration: readable big-eyed rounded characters and cozy scenes, soft pastel palette, warm gentle lighting.'),
  ('dinobot_gpt_clean',
   'Clean cinematic dinosaur illustration, crisp render with clearly readable species-accurate dinosaurs and lush prehistoric environments, rich naturalistic palette, atmospheric depth, documentary register',
   'Render as a clean cinematic dinosaur illustration: readable species-accurate dinosaurs and lush prehistoric environments, rich naturalistic palette, atmospheric depth.'),
  ('pixelbot_gpt_clean',
   'Clean crisp pixel-art illustration, readable pixel-art game scene with clear sprites and environment, vibrant limited palette, sharp pixel grid, retro-game register',
   'Render as a clean crisp pixel-art scene: readable sprites and environment, vibrant limited palette, sharp pixel grid.'),
  ('retrobot_gpt_clean',
   'Clean nostalgic retro illustration, crisp render with clearly readable vintage subjects and period scenes, warm faded palette, soft analog lighting, era-authentic register',
   'Render as a clean nostalgic retro illustration: readable vintage subjects and period scenes, warm faded palette, soft analog lighting.'),
  ('faebot_gpt_clean',
   'Clean enchanted-fae fantasy illustration, crisp render with clearly readable fae figures and lush forest scenes, rich jewel-tone palette, soft magical lighting, storybook fantasy register',
   'Render as a clean enchanted-fae fantasy illustration: readable fae figures and lush forest scenes, rich jewel-tone palette, soft magical lighting.'),
  ('mangabot_gpt_clean',
   'Clean cel-shaded anime illustration, crisp render with clearly readable characters and recognizable anime environments, vibrant saturated palette, atmospheric depth, hand-drawn anime register',
   'Render as a clean cel-shaded anime illustration: readable characters and recognizable anime environments, vibrant saturated palette, atmospheric depth.')
ON CONFLICT (medium_key) DO NOTHING;

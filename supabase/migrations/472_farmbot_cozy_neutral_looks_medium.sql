-- 472_farmbot_cozy_neutral_looks_medium.sql — FarmBot's "Medium Looks" neutral
-- medium (BOT_SCENE_QUALITY_PLAYBOOK.md). Mirrors chibibot_neutral /
-- mangabot_anime_neutral exactly: a dream_mediums row (pickModel reads
-- allowed_models — a missing row silently breaks the picker, per MangaBot's
-- own hard-won lesson) + the required dlt_clean_mediums row for Dream Like
-- This (skipping this one is not optional either).
--
-- FarmBot is a SECRET bot (is_public=false on its users row) — this medium
-- is bot-only regardless, matching the precedent rows exactly.

INSERT INTO public.dream_mediums (
  key, label, directive, is_active, is_bot_only, is_public, is_character_only, face_swaps,
  engine, allowed_models, preferred_model, flux_fragment
) VALUES (
  'farmbot_cozy_neutral',
  'FarmBot Cozy (looks)',
  'Neutral cozy-farm medium for FarmBot per-render look-register axis — locks the cozy/adorable/no-humans cast identity, defers render style entirely to the rolled look (actual fragment in shared-blocks.js FARMBOT_COZY_NEUTRAL via mediumStyles).',
  false,
  true,
  true,
  false,
  false,
  null,
  ARRAY[
    'black-forest-labs/flux-1.1-pro-ultra',
    'black-forest-labs/flux-1.1-pro',
    'openai/gpt-image-2',
    'google/gemini-2-image'
  ],
  null,
  'Every render is warm, adorable, and cozy — never scary, never gritty, never photoreal/documentary. Keep the composition the scene below describes — a hero farm animal OR a place (farm stand / barn / farmhouse / field / pond) with farm life happening in it. If a creature appears (only where the scene calls for one), it is an adorable stylized farm animal in whatever proportions and character-design language the look register above calls for, NEVER a human, NEVER a realistic animal. The animation style, rendering medium, finish, and palette are set entirely by the look-register tokens that lead the prompt.'
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.dlt_clean_mediums (medium_key, clean_flux_fragment, clean_directive)
VALUES (
  'farmbot_cozy_neutral',
  'Cozy farm-life illustration, warm adorable render of a farm animal or farm scene, gentle storybook charm, soft golden light.',
  'Render as a cozy farm-life illustration: adorable, warm, gentle storybook charm, soft golden light.'
)
ON CONFLICT (medium_key) DO NOTHING;

-- 226_bot_gpt_clean_mediums.sql
--
-- Per-bot "_gpt_clean" mediums for the new mediumByModel mechanism
-- (botEngine commit bf2d7096, 2026-06-05).
--
-- When openai/gpt-image-2 is rolled for one of the 6 bots wired to use
-- this mechanism (gothbot / starbot / mechbot / steambot / dragonbot /
-- bloombot), the bot's mediumByModel entry forces the medium to its
-- "_gpt_clean" key. Each bot then carries a positive-only directive in
-- mediumStyles[bot_gpt_clean] that neutralizes the over-abstract /
-- over-painterly drift GPT-Image-2 produces on the bot's default
-- mediums. Mirrors the 2026-06-05 OceanBot mystical-mermaid cleanup
-- (commit b0776fb9) keyed by model rather than path.
--
-- All 6 rows are bot-only (is_active=false, is_bot_only=true) — they
-- never appear in the user-facing medium picker. The flux_fragment +
-- directive are intentionally stub-ish; the actual prompt content lives
-- in each bot's shared-blocks.js GPT_CLEAN constant and is injected via
-- the mediumStyles override in the bot's index.js.
--
-- allowed_models is locked to openai/gpt-image-2 only — these mediums
-- are NEVER used with another model (mediumByModel only routes them
-- when GPT-Image-2 is the rolled model).

INSERT INTO public.dream_mediums (
  key, label, directive, flux_fragment,
  is_active, is_bot_only, is_character_only,
  face_swaps, character_render_mode,
  allowed_models,
  sort_order
) VALUES
  (
    'gothbot_gpt_clean',
    'GothBot GPT Clean',
    'Cinematic gothic fantasy illustration with clean readable subjects (gpt-image-2 only — actual directive lives in scripts/bots/gothbot/shared-blocks.js GPT_CLEAN constant, injected via index.js mediumStyles).',
    'cinematic gothic fantasy illustration, clean editorial-poster render',
    false, true, false, false, 'natural',
    ARRAY['openai/gpt-image-2'],
    9999
  ),
  (
    'starbot_gpt_clean',
    'StarBot GPT Clean',
    'Cinematic sci-fi illustration with clean readable subjects (gpt-image-2 only — actual directive lives in scripts/bots/starbot/shared-blocks.js GPT_CLEAN constant, injected via index.js mediumStyles).',
    'cinematic sci-fi illustration, clean editorial-poster render',
    false, true, false, false, 'natural',
    ARRAY['openai/gpt-image-2'],
    9999
  ),
  (
    'mechbot_gpt_clean',
    'MechBot GPT Clean',
    'Cinematic mech illustration with clean readable subjects (gpt-image-2 only — actual directive lives in scripts/bots/mechbot/shared-blocks.js GPT_CLEAN constant, injected via index.js mediumStyles).',
    'cinematic mech illustration, clean editorial-poster render',
    false, true, false, false, 'natural',
    ARRAY['openai/gpt-image-2'],
    9999
  ),
  (
    'steambot_gpt_clean',
    'SteamBot GPT Clean',
    'Cinematic steampunk illustration with clean readable subjects (gpt-image-2 only — actual directive lives in scripts/bots/steambot/shared-blocks.js GPT_CLEAN constant, injected via index.js mediumStyles).',
    'cinematic steampunk illustration, clean editorial-poster render',
    false, true, false, false, 'natural',
    ARRAY['openai/gpt-image-2'],
    9999
  ),
  (
    'dragonbot_gpt_clean',
    'DragonBot GPT Clean',
    'Cinematic epic-fantasy illustration with clean readable subjects (gpt-image-2 only — actual directive lives in scripts/bots/dragonbot/shared-blocks.js GPT_CLEAN constant, injected via index.js mediumStyles).',
    'cinematic epic-fantasy illustration, clean editorial-poster render',
    false, true, false, false, 'natural',
    ARRAY['openai/gpt-image-2'],
    9999
  ),
  (
    'bloombot_gpt_clean',
    'BloomBot GPT Clean',
    'Cinematic floral illustration with clean readable subjects (gpt-image-2 only — actual directive lives in scripts/bots/bloombot/shared-blocks.js GPT_CLEAN constant, injected via index.js mediumStyles).',
    'cinematic floral illustration, clean editorial-poster render',
    false, true, false, false, 'natural',
    ARRAY['openai/gpt-image-2'],
    9999
  )
ON CONFLICT (key) DO NOTHING;

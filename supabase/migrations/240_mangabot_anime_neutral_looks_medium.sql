-- Migration 240: mangabot_anime_neutral — the MangaBot "looks" medium
--
-- Context: MangaBot's single 'anime' medium + bot-wide PROMPT_PREFIX
-- ("Ghibli / Shinkai / Kyoto Animation tradition, cel-shaded clean linework…")
-- front-load ONE fixed anime look on every render — CLIP anchors there
-- regardless of path. To break that lock we add a per-render "look register"
-- axis (12 color-anime styles rolled via rollSharedDNA): the look-enabled paths
-- route to this NEUTRAL medium so the fixed-style prefix is bypassed and the
-- rolled look leads. Pattern mirrors yumbot_food_neutral (playbook: "Medium
-- Looks" architecture). The 4 style-locked paths (ghibli-countryside,
-- ghibli-painterly, slice-of-life, samurai-era) keep the original 'anime'
-- medium and are NOT affected.
--
-- The real medium fragment lives in scripts/bots/mangabot/shared-blocks.js
-- (ANIME_NEUTRAL), injected via index.js mediumStyles — botEngine overrides
-- the DB flux_fragment with bot.mediumStyles[medium]. This DB row exists for
-- (a) the model picker (pickModel reads dream_mediums.allowed_models) and
-- (b) DLT resolution. is_bot_only + inactive → hidden from user V4/nightly.
--
-- allowed_models is FLUX-ONLY (mirrors the 'anime' medium's flux models, minus
-- nano-banana): banana reads stylized look tokens as "go abstract" and would
-- route through cleanMediumByModel to mangabot_gpt_clean, SKIPPING the look.
-- Keeping banana out of this medium's pool means the picker never rolls it on
-- look paths, so the look always shows. Banana still serves the 4 style-locked
-- paths via the 'anime' medium.
--
-- Pure data (idempotent). Run in the Supabase dashboard SQL editor.

-- 1) The looks medium row.
INSERT INTO public.dream_mediums
  (key, label, directive, flux_fragment, allowed_models, is_bot_only, is_active,
   is_public, face_swaps, character_render_mode, sort_order)
VALUES
  ('mangabot_anime_neutral', 'MangaBot Anime (looks)',
   'Neutral anime medium for MangaBot''s per-render look-register axis — locks the anime-illustration identity but defers the specific art-style to the rolled look (actual fragment lives in scripts/bots/mangabot/shared-blocks.js ANIME_NEUTRAL, injected via index.js mediumStyles).',
   'The entire scene is rendered as 2D hand-drawn Japanese anime/manga art — characters, creatures, and environments all in authentic anime illustration with drawn linework and painted backgrounds, never photoreal, never 3D CGI, never Western cartoon. The specific art-style era, linework weight, shading method, and color treatment are set by the look-register tokens that lead the prompt.',
   ARRAY['black-forest-labs/flux-2-max','black-forest-labs/flux-1.1-pro','black-forest-labs/flux-1.1-pro-ultra'],
   true, false, true, false, 'natural', 9999)
ON CONFLICT (key) DO NOTHING;

-- 2) DLT clean row (playbook hard rule: every new bot medium needs one). The
--    look that produced a given post is baked into that post's saved ai_prompt,
--    not the medium — so for "Dream Like This" the medium degrades to a generic
--    clean anime style applied to the user's subject (style-only, subject-stripped).
INSERT INTO public.dlt_clean_mediums (medium_key, clean_flux_fragment, clean_directive)
VALUES
  ('mangabot_anime_neutral',
   'Hand-drawn Japanese anime/manga illustration, clean cel-shaded render with crisp drawn linework, painted backgrounds and vibrant saturated palette, authentic anime art style.',
   'Render as a hand-drawn Japanese anime/manga illustration: clean cel-shaded art, crisp linework, painted backgrounds, vibrant anime palette.')
ON CONFLICT (medium_key) DO NOTHING;

-- Migration 241: chibibot_neutral — the ChibiBot "looks" medium
--
-- Context: ChibiBot currently coin-flips between two style identities as
-- mediums (chibibot_render = Pop-Mart designer-vinyl, chibibot_pixar = modern
-- animated-feature). This medium replaces that on the look-enabled paths with a
-- per-render "look register" axis (13 cute film/storybook styles — Pixar /
-- DreamWorks / Disney-CG / Illumination / Sony / Cartoon-Saloon / classic-Disney
-- / Klaus / flat-2D / Ghibli / storybook / mid-century-gouache / Pop-Mart). The
-- look leads CLIP; this NEUTRAL medium hard-locks ChibiBot's identity (an
-- adorable chibi CREATURE at chibi proportions — NEVER a human) but defers the
-- render style to the rolled look. Pattern mirrors yumbot_food_neutral and
-- mangabot_anime_neutral (playbook: "Medium Looks" architecture).
--
-- The real fragment lives in scripts/bots/chibibot/shared-blocks.js
-- (CHIBI_NEUTRAL), injected via index.js mediumStyles — botEngine overrides the
-- DB flux_fragment with bot.mediumStyles[medium]. This DB row exists for the
-- model picker (reads dream_mediums.allowed_models) + DLT resolution.
-- is_bot_only + inactive → hidden from user V4/nightly/restyle.
--
-- allowed_models = full 7-model lineup (5 flux + gpt-image-2 + nano-banana).
-- ChibiBot was historically locked to flux-1.1-pro-ultra to protect the OLD
-- Pop-Mart-vinyl medium (flux-1.1-pro rendered vinyl as glassy metal) — the new
-- film/storybook looks don't have that issue, so the lineup is opened up for
-- model+look variety (2026-06-07, Kevin's call). gpt-2 + nano-banana are
-- INCLUDED here AND added to cleanMediumByModel.skipPaths in index.js for the
-- look paths, so they render WITH the rolled look (chibibot_neutral) instead of
-- swapping to the look-blind chibibot_gpt_clean — verified they hold the look +
-- chibi creature with no abstract drift. creature-world keeps its flux-dev lock.
--
-- Pure data (idempotent). Run in the Supabase dashboard SQL editor.

-- 1) The looks medium row.
INSERT INTO public.dream_mediums
  (key, label, directive, flux_fragment, allowed_models, is_bot_only, is_active,
   is_public, face_swaps, character_render_mode, sort_order)
VALUES
  ('chibibot_neutral', 'ChibiBot Cute (looks)',
   'Neutral chibi-creature medium for ChibiBot''s per-render look-register axis — locks the adorable-chibi-creature identity + proportions but defers the render style to the rolled look (actual fragment lives in scripts/bots/chibibot/shared-blocks.js CHIBI_NEUTRAL, injected via index.js mediumStyles).',
   'Every figure in frame is an adorable chibi CREATURE — a real animal or a cute fantasy critter — at chibi proportions (oversized round head, big sparkling eyes), NEVER a human or human child. Keep the composition the scene below describes — a hero creature OR a village / landscape / interior populated by chibi creatures. The animation style, rendering medium, finish, and palette are set by the look-register tokens that lead the prompt.',
   ARRAY['black-forest-labs/flux-dev','black-forest-labs/flux-1.1-pro','black-forest-labs/flux-1.1-pro-ultra','black-forest-labs/flux-2-pro','black-forest-labs/flux-2-max','openai/gpt-image-2','google/gemini-2-image'],
   true, false, true, false, 'natural', 9999)
ON CONFLICT (key) DO NOTHING;

-- 2) DLT clean row (playbook hard rule: every new bot medium needs one). The
--    look that produced a post is baked into that post's saved ai_prompt, not
--    the medium — so for "Dream Like This" the medium degrades to a generic
--    clean cute-chibi-creature style applied to the user's subject.
INSERT INTO public.dlt_clean_mediums (medium_key, clean_flux_fragment, clean_directive)
VALUES
  ('chibibot_neutral',
   'Adorable chibi-creature illustration, clean cute render with a big-eyed rounded chibi creature at chibi proportions, soft pastel palette, warm gentle lighting, wholesome storybook charm.',
   'Render as an adorable chibi creature: big-eyed rounded chibi proportions, soft pastel palette, warm gentle lighting, wholesome cute charm.')
ON CONFLICT (medium_key) DO NOTHING;

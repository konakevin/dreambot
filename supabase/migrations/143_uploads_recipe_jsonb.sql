-- Migration 143: Add recipe (JSONB) and flux_seed (BIGINT) columns to uploads
-- for the DLT recipe-replay architecture.
--
-- Recipe captures the LOOK ANCHORS at posting time (medium directive,
-- vibe directive, palette, lighting, atmosphere, camera, model — the
-- ROLLED VALUES VERBATIM). At DLT time, the recipe replays those anchors
-- against the new user's subject + cast/photo through the normal create
-- flow, replacing the user's medium/vibe pickers with recipe-locked
-- values. This means the source's look reproduces faithfully even as
-- the engine evolves (no path-builder/Sonnet/Haiku invocation at DLT).
--
-- DLT scope = MEDIUM + LOOK only. Recipe never stores cast, scene,
-- emotion, or subject information — those are entirely the DLT-user's
-- own input. Privacy invariant is automatic by construction.
--
-- flux_seed is captured if Replicate exposes it on the prediction
-- response (often does for flux-dev / flux-pro / flux-1.1-pro). NULL
-- when unknown. Reusing the seed gives stronger reproduction; without
-- it, the recipe still reproduces the look (just not pixel-identical).
--
-- NULL recipe = old post / pre-Phase-1 — DLT falls back to the existing
-- style_summary path (Plan C). Zero-regression scenario.
--
-- Schema (TypeScript shape; see scripts/lib/recipeBuilder.js for source
-- of truth):
--   {
--     version: 1,
--     model: string,
--     flux_seed: number | null,
--     medium_key: string,
--     vibe_key: string,
--     prompt_prefix: string,
--     medium_style_override: string,
--     prompt_suffix: string,
--     camera: string | null,
--     lighting: string,
--     scene_palette: string,
--     color_palette: string,
--     chaos_block: string | null,
--     sensory_block: string | null,
--     blow_it_up_block: string | null,
--     bot_username: string | null,
--     path: string | null,
--     ai_prompt: string
--   }

ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS recipe jsonb;

ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS flux_seed bigint;

COMMENT ON COLUMN public.uploads.recipe IS
  'Frozen LOOK recipe captured at posting time for DLT recipe-replay. Contains medium directive, vibe directive, palette, lighting, atmosphere, camera, model — rolled values verbatim. NEVER contains cast/scene/subject info. NULL = pre-Phase-1 post (DLT falls back to style_summary).';

COMMENT ON COLUMN public.uploads.flux_seed IS
  'Replicate flux seed used for this render, when exposed on the prediction response. Reused at DLT time for stronger look reproduction. NULL when unknown.';

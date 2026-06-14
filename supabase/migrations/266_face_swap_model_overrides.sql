-- 266_face_swap_model_overrides.sql
-- Per-(model × medium) curated medium-fragment overrides for the CREATE engine's
-- face-swap renders, + per-medium "recommended models" hints for the picker.
--
-- WHY:
--   Some image models ignore stylized medium fragments and render photoreal
--   (flux-1.1-pro on anime/watercolor) — see the 2026-06-13 model×medium audit.
--   Nightly already solves this for itself via a CODE library keyed by MODEL
--   only (_shared/faceSwapModelOverrides.ts), but nightly can swap to any style
--   because it ROLLS the medium. In CREATE the user picks a specific medium, so
--   the override must be keyed by (model, medium) and must still render THAT
--   medium's look. This table is that per-(model, medium) curated library.
--
--   Curation workflow (same as the nightly library): render candidate fragments
--   for a (model, medium) cell, Kevin hearts the winner, insert its exact
--   fragment here. Empty table = no behavior change (every model passes through
--   with its normal fragment). Obedient models (flux-2 family, gemini) get no
--   rows.
--
-- The picker-side hint (which models render a given medium well) lives in
-- dream_mediums.client_meta.recommended_models (migration 251 passthrough), so
-- the client steers users toward good models per medium with no RPC change.

-- ── 1. The override table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.face_swap_model_overrides (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  model        text NOT NULL,              -- full Replicate slug, e.g. 'black-forest-labs/flux-1.1-pro'
  medium_key   text NOT NULL,              -- dream_mediums.key the override applies to
  fragment     text NOT NULL,              -- curated style fragment swapped into the face-swap render
  banned_vibes text[] NOT NULL DEFAULT '{}',
  is_active    boolean NOT NULL DEFAULT true,
  note         text,                       -- curation note: date hearted + the look
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- One model can have multiple fragments per medium (rotation for variety), so
-- the unique guard is on the row content, not (model, medium).
CREATE INDEX IF NOT EXISTS idx_fsmo_lookup
  ON public.face_swap_model_overrides (model, medium_key)
  WHERE is_active;

ALTER TABLE public.face_swap_model_overrides ENABLE ROW LEVEL SECURITY;

-- Read-only to clients; the Edge Function reads it with the service role. No
-- public write policy — curation happens via the dashboard / service role.
DROP POLICY IF EXISTS "fsmo read" ON public.face_swap_model_overrides;
CREATE POLICY "fsmo read" ON public.face_swap_model_overrides
  FOR SELECT USING (true);

-- Table ships EMPTY. Rows are added by the curation loop (render → heart → insert).

-- ── 2. Per-medium recommended models (picker hint) ──────────────────────────
-- Seeded from the 2026-06-13 audit: which models render each medium's style well
-- AND swap faces cleanly. Stored in client_meta so the picker can read
-- medium.client_meta.recommended_models with no RPC/rebuild (migration 251).
-- flux-schnell is intentionally absent everywhere (broken swap collages).

-- Heavily-stylized 2D (cel/flat) — GPT goes realistic here, flux-1.1 goes photoreal.
UPDATE public.dream_mediums SET client_meta =
  coalesce(client_meta, '{}'::jsonb) || jsonb_build_object('recommended_models',
    ARRAY['black-forest-labs/flux-2-flex','black-forest-labs/flux-2-dev',
          'black-forest-labs/flux-2-max','google/gemini-3-image-preview',
          'google/gemini-2-image'])
WHERE key IN ('anime','comics','pop_art','vaporwave');

-- Painterly / illustrated mediums.
UPDATE public.dream_mediums SET client_meta =
  coalesce(client_meta, '{}'::jsonb) || jsonb_build_object('recommended_models',
    ARRAY['black-forest-labs/flux-2-dev','black-forest-labs/flux-2-max',
          'black-forest-labs/flux-2-pro','google/gemini-3-image-preview',
          'openai/gpt-image-2'])
WHERE key IN ('watercolor','canvas','pencil','illustration','storybook','fairytale');

-- Photoreal mediums — Flux-1.1-pro is fine here (its default look IS this).
UPDATE public.dream_mediums SET client_meta =
  coalesce(client_meta, '{}'::jsonb) || jsonb_build_object('recommended_models',
    ARRAY['black-forest-labs/flux-2-max','black-forest-labs/flux-2-pro',
          'google/gemini-3-image-preview','openai/gpt-image-2',
          'black-forest-labs/flux-1.1-pro'])
WHERE key IN ('photography','hyperreal','render');

-- Embodied / craft mediums (likeness, not literal swap).
UPDATE public.dream_mediums SET client_meta =
  coalesce(client_meta, '{}'::jsonb) || jsonb_build_object('recommended_models',
    ARRAY['black-forest-labs/flux-2-max','black-forest-labs/flux-2-pro',
          'black-forest-labs/flux-2-dev','google/gemini-3-image-preview',
          'openai/gpt-image-2'])
WHERE key IN ('animation','claymation','lego','vinyl','pixels','handcrafted');

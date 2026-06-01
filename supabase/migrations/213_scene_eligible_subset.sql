-- Migration 213: scene-eligible mediums + models subset for nightly's pure_scene + epic_tiny.
--
-- Per Kevin 2026-06-01: nightly renders that roll non-character composition
-- (pure_scene or epic_tiny per dreamAlgorithm.ts) should use a curated subset
-- of "lush, layered, painterly" mediums + premium models — never storybook /
-- kids / drawing-coded mediums, never cheaper dev/flex models.
--
-- DB-driven so the subset is editable via SQL without code deploy. Mirrors
-- the existing `is_dream_eligible` / `dream_eligible_face_swap` curation
-- pattern. The runtime check lives in nightly-dreams/index.ts: after
-- rollDream returns composition, if it's pure_scene OR epic_tiny AND the
-- already-picked medium isn't in this scene-eligible set, the medium is
-- re-rolled from this pool (mirroring the existing character→stylized
-- re-roll at line ~405 for hyperreal/render/photography on character path).
-- The model is then intersected with this scene-eligible model list +
-- the medium's allowed_models so only valid pairings render.
--
-- Initial set (Kevin's spec):
--   Mediums:  canvas, photography, hyperreal, render, illustration
--   Models:   flux-1.1-pro, flux-1.1-pro-ultra, flux-2-pro, flux-2-max,
--             google/gemini-2-image, openai/gpt-image-2

-- ── Medium gate ──
ALTER TABLE dream_mediums
  ADD COLUMN IF NOT EXISTS is_scene_eligible BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN dream_mediums.is_scene_eligible IS
  'When true, this medium is eligible for nightly pure_scene + epic_tiny composition rolls. Curated for lush layered painterly/photoreal scenes. Used by resolveMediumFromDb(''dream_eligible_scene'') in nightly-dreams. Toggle via SQL UPDATE without code deploy.';

UPDATE dream_mediums
SET is_scene_eligible = true
WHERE key IN ('canvas', 'photography', 'hyperreal', 'render', 'illustration');

-- ── Model gate (singleton config table) ──
-- A single-row table holding engine-level config arrays/maps. Future engine
-- knobs can be added as additional columns. The CHECK constraint pins the
-- id to 1 so any inserts beyond the singleton fail loudly (no accidental
-- second-row drift).
CREATE TABLE IF NOT EXISTS engine_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  scene_eligible_models TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE engine_config IS
  'Singleton row holding engine-level config arrays. Future knobs add columns here.';
COMMENT ON COLUMN engine_config.scene_eligible_models IS
  'Replicate model ids eligible for nightly pure_scene + epic_tiny renders. At runtime intersected with the picked medium''s allowed_models so only valid pairings fire. Edit via SQL UPDATE without code deploy.';

INSERT INTO engine_config (id, scene_eligible_models)
VALUES (
  1,
  ARRAY[
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-1.1-pro-ultra',
    'black-forest-labs/flux-2-pro',
    'black-forest-labs/flux-2-max',
    'google/gemini-2-image',
    'openai/gpt-image-2'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET scene_eligible_models = EXCLUDED.scene_eligible_models,
      updated_at = now();

-- ── RLS: engine-only config, no client access ──
-- Service role bypasses RLS so Edge Functions still read/write. Anon and
-- authenticated client roles get NO policies = default deny. The iOS app
-- never touches engine_config; only nightly-dreams Edge Function does
-- (via fetchSceneEligibleModels() in _shared/dreamStyles.ts).
ALTER TABLE engine_config ENABLE ROW LEVEL SECURITY;

-- ── Verification queries (run manually after migration) ──
-- SELECT key, is_scene_eligible FROM dream_mediums WHERE is_active ORDER BY key;
-- SELECT scene_eligible_models FROM engine_config WHERE id = 1;

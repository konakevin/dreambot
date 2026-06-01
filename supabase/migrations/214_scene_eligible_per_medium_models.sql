-- Migration 214: per-medium scene-eligible model overrides.
--
-- Mig 213 introduced engine_config.scene_eligible_models as a GLOBAL list
-- of models eligible for nightly pure_scene + epic_tiny renders. Kevin's
-- 90-render review surfaced that some mediums want a TIGHTER subset than
-- the global default (e.g. photography + hyperreal both drop flux-2-pro
-- while canvas + illustration keep all 6).
--
-- This migration adds an optional per-medium override:
--   dream_mediums.scene_eligible_models TEXT[]
--     NULL = use the engine_config global
--     non-null = use this list instead (still intersected with allowed_models)
--
-- Runtime fall-through in nightly-dreams: if a scene-eligible medium has a
-- non-null per-medium list, use it; otherwise fall back to engine_config.
-- Either way the result is still intersected with the medium's allowed_models
-- as a safety net (no model gets picked that the medium can't actually run).
--
-- Also encodes Kevin's review verdict (2026-06-01):
--   canvas       — keep all 6 (NULL — use global)
--   photography  — drop flux-2-pro
--   hyperreal    — drop flux-2-pro
--   illustration — keep all 6 (NULL — use global)
--   render       — DROP medium from scene-eligible entirely

ALTER TABLE dream_mediums
  ADD COLUMN IF NOT EXISTS scene_eligible_models TEXT[];

COMMENT ON COLUMN dream_mediums.scene_eligible_models IS
  'Per-medium override for the nightly scene-composition model gate. NULL = use engine_config.scene_eligible_models global. Non-null = use this list instead (still intersected with allowed_models as safety net). Migration 214.';

-- photography — drop flux-2-pro
UPDATE dream_mediums
SET scene_eligible_models = ARRAY[
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-1.1-pro-ultra',
  'black-forest-labs/flux-2-max',
  'google/gemini-2-image',
  'openai/gpt-image-2'
]
WHERE key = 'photography';

-- hyperreal — drop flux-2-pro
UPDATE dream_mediums
SET scene_eligible_models = ARRAY[
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-1.1-pro-ultra',
  'black-forest-labs/flux-2-max',
  'google/gemini-2-image',
  'openai/gpt-image-2'
]
WHERE key = 'hyperreal';

-- render — remove from scene-eligible set entirely
UPDATE dream_mediums
SET is_scene_eligible = false
WHERE key = 'render';

-- canvas + illustration left at NULL — fall back to engine_config global (all 6)

-- ── Verification (run manually) ──
-- SELECT key, is_scene_eligible, scene_eligible_models FROM dream_mediums
--   WHERE is_scene_eligible ORDER BY key;

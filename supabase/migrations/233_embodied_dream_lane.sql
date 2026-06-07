-- Embodied dream lane — nightly engine pipeline for embodied mediums
-- (LEGO minifig user / pixel-art sprite / Funko Pop / Sackboy doll).
--
-- The nightly engine rolls an archetype at the top of the try block:
--   p(embodied_dream)  = embodied_dream_rate           (default 0.20)
--   p(existing)        = 1 - embodied_dream_rate
--
-- If embodied: own pipeline picks medium + composition + cast + scene,
-- then renders via Flux (no face swap). If not: existing pipeline runs
-- exactly as before (face_swap / scene / epic_tiny rolls unchanged).
--
-- Within embodied:
--   p(embodied_character) = embodied_character_rate    (default 0.65)
--   p(embodied_scene)     = 1 - embodied_character_rate
--
-- Within embodied_character (only when user has plus_one cast):
--   p(dual cast)          = embodied_dual_rate         (default 0.50)
--   p(self only)          = 1 - embodied_dual_rate
--
-- All rates live on engine_config (singleton row) — SQL-tunable, no deploy.

ALTER TABLE engine_config
  ADD COLUMN IF NOT EXISTS embodied_dream_rate NUMERIC(4,3) NOT NULL DEFAULT 0.200,
  ADD COLUMN IF NOT EXISTS embodied_character_rate NUMERIC(4,3) NOT NULL DEFAULT 0.650,
  ADD COLUMN IF NOT EXISTS embodied_dual_rate NUMERIC(4,3) NOT NULL DEFAULT 0.500;

-- Per-medium flag for "this medium works as a scene-only render too"
-- (location built in the medium, no cast figures).
-- LEGO landscapes, pixel-art JRPG worlds, Sackboy dioramas all work.
-- Vinyl/Funko is character-coded — a Funko city makes no sense — kept FALSE.
ALTER TABLE dream_mediums
  ADD COLUMN IF NOT EXISTS embodied_scene_eligible BOOLEAN NOT NULL DEFAULT FALSE;

-- Wire the four art mediums into the nightly rotation. character_render_mode
-- is already 'embodied' on all four; face_swaps is already FALSE on all four;
-- this just flips dream_eligible so they enter the embodied lane's medium pool.
UPDATE dream_mediums
SET is_dream_eligible = TRUE
WHERE key IN ('pixels', 'lego', 'handcrafted', 'vinyl');

-- Vinyl/Funko stays character-only. LEGO, pixels, handcrafted also work as
-- scene-only renders.
UPDATE dream_mediums
SET embodied_scene_eligible = TRUE
WHERE key IN ('pixels', 'lego', 'handcrafted');

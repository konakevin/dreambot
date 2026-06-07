-- Embodied mediums simplification — drop the standalone embodied lane.
-- Embodied mediums (lego, pixels, handcrafted) now live inside the existing
-- pure_scene composition path with a weighted sub-roll between "natural
-- scene" mediums (canvas/hyperreal/illustration) and "embodied scene"
-- mediums (lego/pixels/handcrafted).
--
-- Vinyl (Funko) is character-coded; it has no sensible scene-only render so
-- it drops out of the nightly pool entirely. Still available in the create
-- screen via is_active=true + is_public=true.

-- Drop the per-lane knobs from migration 233 — superseded by scene_embodied_rate.
ALTER TABLE engine_config
  DROP COLUMN IF EXISTS embodied_dream_rate,
  DROP COLUMN IF EXISTS embodied_character_rate,
  DROP COLUMN IF EXISTS embodied_dual_rate;

-- New knob: within the pure_scene + epic_tiny medium re-roll, what fraction
-- of picks come from the embodied subset (lego/pixels/handcrafted) vs the
-- natural subset (canvas/hyperreal/illustration). 0.30 default = roughly
-- 1-in-3 scene nightlies will render in the embodied register.
ALTER TABLE engine_config
  ADD COLUMN IF NOT EXISTS scene_embodied_rate NUMERIC(4,3) NOT NULL DEFAULT 0.300;

-- Drop the scene-eligible flag added in migration 233 — superseded by
-- the broader is_scene_eligible flag. The natural/embodied split now lives
-- on character_render_mode (which already exists per-medium).
ALTER TABLE dream_mediums
  DROP COLUMN IF EXISTS embodied_scene_eligible;

-- Pull vinyl out of the nightly rotation (character-coded, no scene path).
UPDATE dream_mediums
SET is_dream_eligible = FALSE
WHERE key = 'vinyl';

-- Promote the three embodied mediums into the scene-eligible pool — they
-- now compete inside dream_eligible_scene with canvas/hyperreal/illustration
-- via the weighted sub-roll.
UPDATE dream_mediums
SET is_scene_eligible = TRUE
WHERE key IN ('lego', 'pixels', 'handcrafted');

-- lego + handcrafted previously had is_dream_eligible set in 233; keep that
-- since they still need to satisfy the dream_eligible_scene filter (which
-- intersects is_dream_eligible + is_scene_eligible). Pixels too.
UPDATE dream_mediums
SET is_dream_eligible = TRUE
WHERE key IN ('lego', 'pixels', 'handcrafted');

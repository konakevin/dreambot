-- 516_scenario_action_column.sql (2026-09-13)
--
-- WHY. A scenario row is a single sentence carrying BOTH the place and what the people are doing, e.g.
--   "Soaring above a lost city of submerged pillars blanketed in soft coral, she holds a glowing sea lantern at hip
--    level face radiant with wonder, he floats beside her arms loosely spread grinning in awe at the camera."
-- The nightly engine assigns that whole string to the PLACE slot (`dualSpecialScene`), so everything after the
-- first comma is read as scenery. Nothing in the prompt then tells the people to do anything, and the only
-- instruction describing them is the face-swap safety block — stand side by side, face the camera, keep a gap
-- between the heads. Flux renders exactly that: two people standing at attention, while the scene text claims they
-- are soaring. Kevin, on one of those renders: "what kind of pose is that? where did it come from?"
--
-- Roughly 1,090 of 2,920 live ACTIVE couple scenarios lose their verb this way.
--
-- WHAT. An `action` column on both scenario tables, holding ONLY the people clause. The backfill is mechanical
-- (scratchpad/split-scenarios.js splits each scene at its first subject-pronoun clause) — the words stay Kevin's,
-- they are only reassigned to the slot that reaches the model. Rows with no clean split keep `action` NULL and are
-- covered by the engine-side guard instead, so nothing is guessed at.
--
-- Additive and inert until the engine reads it; `scene` is untouched, so every existing render path behaves
-- identically until the read lands.
ALTER TABLE public.dual_scenarios ADD COLUMN IF NOT EXISTS action text;
ALTER TABLE public.single_scenarios ADD COLUMN IF NOT EXISTS action text;

COMMENT ON COLUMN public.dual_scenarios.action IS
  'The people clause split out of `scene` (mig 516): what the couple is DOING. Fed to the prompt action slot so the pose is not lost when `scene` is consumed as the place. NULL = no clean split; the engine falls back to a pose pool.';
COMMENT ON COLUMN public.single_scenarios.action IS
  'The people clause split out of `scene` (mig 516): what the person is DOING. NULL = no clean split; the engine falls back to a pose pool.';

-- 354: scenario seeds can force a MEDIUM (funny audit follow-up, 2026-07-09).
--
-- The photo-genre parody categories (80s mall glamour shots, decade-eras
-- fashion portraits) only land at full strength when the render reads as an
-- actual PHOTOGRAPH — a watercolor of a laser-grid backdrop loses the joke.
-- `medium_key` (nullable) on a scenario row overrides the nightly medium roll
-- for that render; null = the rolled medium (today's behavior). The engine
-- only honors face-swap-capable natural-render mediums (guarded in
-- nightly-dreams), so a bad value degrades to the roll instead of breaking.
--
-- Companion change (code): photography re-enabled for nightly
-- (is_dream_eligible + the hardcoded face-swap auto-roll exclusion) — the
-- "uncanny composites" rationale predates the identity-gate + sharpening
-- upgrades.

ALTER TABLE public.dual_scenarios ADD COLUMN IF NOT EXISTS medium_key text;
ALTER TABLE public.single_scenarios ADD COLUMN IF NOT EXISTS medium_key text;

-- Glamour shots only — the mall-studio-photo conceit needs the photo medium.
-- decade_eras deliberately NOT forced (Kevin 2026-07-09): era scenes should
-- roll the normal medium mix.
UPDATE public.dual_scenarios
  SET medium_key = 'photography'
  WHERE category = 'glamour_shot_retro';
UPDATE public.single_scenarios
  SET medium_key = 'photography'
  WHERE category = 'glamour_shot_retro';

-- Re-enable photography in the nightly auto-roll pools (dream_eligible +
-- scene pool membership already true via is_scene_eligible).
UPDATE public.dream_mediums
  SET is_dream_eligible = true, nightly_skip = false
  WHERE key = 'photography';

-- 162 — Hyperreal medium for nightly + user pickers
--
-- Adds a user-facing equivalent of EarthBot's bot-only `earthbot_hyperreal`
-- medium so nightly scene-only renders (and manual create) can use the
-- ray-traced Unreal-Engine-style flux fragment that's been producing
-- consistent banger landscape renders. EarthBot's row stays bot-only and
-- untouched.
--
-- Idempotent — uses ON CONFLICT (key) DO UPDATE so re-running the
-- migration is safe.

INSERT INTO public.dream_mediums (
  key,
  label,
  directive,
  flux_fragment,
  is_active,
  is_bot_only,
  is_character_only,
  is_scene_only,
  face_swaps,
  nightly_skip,
  is_dream_eligible,
  character_render_mode,
  sort_order
)
SELECT
  'hyperreal',
  'Hyperreal',
  directive,
  flux_fragment,
  true,           -- is_active: visible in user pickers
  false,          -- is_bot_only: false (user-facing)
  false,          -- is_character_only
  false,          -- is_scene_only
  false,          -- face_swaps: not used for scene-only path
  false,          -- nightly_skip
  true,           -- is_dream_eligible: auto-rolled in nightly
  'natural',
  100
FROM public.dream_mediums
WHERE key = 'earthbot_hyperreal'
ON CONFLICT (key) DO UPDATE SET
  directive = EXCLUDED.directive,
  flux_fragment = EXCLUDED.flux_fragment,
  is_active = EXCLUDED.is_active,
  is_dream_eligible = EXCLUDED.is_dream_eligible;

NOTIFY pgrst, 'reload schema';

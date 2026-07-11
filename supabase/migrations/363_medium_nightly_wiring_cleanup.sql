-- 363_medium_nightly_wiring_cleanup.sql
--
-- Single source of truth for nightly medium eligibility. Before this, a
-- medium's nightly fate was decided by THREE unsynced sources: is_dream_eligible
-- (flag), engine_config.dream_art_mediums (csv), and embodied_mediums_mid/high
-- (csv). Moving fairytale/storybook/kawaii to embodied left is_dream_eligible
-- lying on embodied rows, and 7 embodied mediums never cast-as-character in
-- nightly. Companion code change makes the Dream Art pool derive from
-- per-medium flags (character_render_mode='embodied' && is_dream_eligible), so
-- dream_art_mediums is no longer read (column left in place, now vestigial).
--
-- After this: is_dream_eligible is THE "in nightly?" switch; face_swaps /
-- character_render_mode pick the lane; dream_art_share is purely the 70/30
-- probability. Data-only; idempotent + re-runnable.

-- 1. Enable every active user-facing medium for nightly (7 Real Face + 10 Dream Art).
UPDATE public.dream_mediums
SET is_dream_eligible = true
WHERE key IN (
  -- Real Face (face_swaps=true, character_render_mode='natural')
  'canvas','comics','illustration','pencil','photography','pop_art','watercolor',
  -- Dream Art (face_swaps=false, character_render_mode='embodied')
  'animation','anime','claymation','fairytale','handcrafted','kawaii','lego','pixels','storybook','vinyl'
);

-- 2. Truthful is_character_only on the embodied CAST mediums (match the other 6
--    embodied). Forces `character` composition when a cast is present (never the
--    tiny-figure epic_tiny roll); no-cast dreams still resolve to pure_scene
--    before this check, so scene-only use is unaffected.
UPDATE public.dream_mediums
SET is_character_only = true
WHERE key IN ('anime','fairytale','kawaii','storybook');

-- 3. Deprecated mediums stay fully retired (keys: hyperreal=Magazine,
--    render=Octane, vaporwave). Off in the picker + every nightly lane.
UPDATE public.dream_mediums
SET is_active = false, is_dream_eligible = false, is_scene_eligible = false
WHERE key IN ('hyperreal','render','vaporwave');

-- 4. 70/30 Real Face / Dream Art split (was 0.15).
UPDATE public.engine_config
SET dream_art_share = 0.30
WHERE id = 1;

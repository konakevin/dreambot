-- 455_engine_config_identity_degrade_floor.sql (2026-09-03, audit L3)
--
-- Make the dual-swap "wrong person" floor live-tunable. Below this per-face ArcFace
-- similarity, a best sub-threshold dual is treated as the WRONG person (not a weak
-- likeness) and degrades to a solo-of-self instead of shipping
-- (_shared/dualSwapPipeline.ts). Kevin hand-raised it 0.15 → 0.25 on 2026-08-31 via a
-- code deploy; this makes the next calibration a dashboard flip.
--
-- Read by fetchEngineConfig (cached) in nightly-dreams + generate-dream and passed to
-- genderSafeDualSwap as identityDegradeFloor; the hardcoded 0.25 remains the fallback.
--
-- Run in the Supabase dashboard SQL editor.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS identity_degrade_floor numeric NOT NULL DEFAULT 0.25;

COMMENT ON COLUMN public.engine_config.identity_degrade_floor IS
  'Dual face-swap wrong-person floor: a best sub-threshold dual with min per-face ArcFace sim below this degrades to solo-of-self instead of shipping. Successful duals score 0.5-0.75; mis-cropped strangers ~0.16-0.18. Default 0.25 (Kevin 2026-08-31 calibration).';

-- 446: DYNAMIC pose pool — hero-grade cinematic stances for cast dreams.
--
-- Nightly cast renders were landing on the COMPANION/PARTNER chore-fidget poses
-- ("one touching a monument, the other standing back", "peeling fruit", etc.),
-- which read like a posed costume-rental photo. This adds a new `dynamic` pool
-- (dual) + `dynamic_solo` pool (solo) of powerful, energetic, SWAP-SAFE stances
-- (heads clearly apart, faces forward, no contact). The pickers now roll it 55%
-- of the time for nightly (see pickDualAction / pickSingleAction). The code
-- arrays (DUAL_ACTIONS_DYNAMIC / DYNAMIC_ACTIONS) are the fallback; the rows
-- below are seeded by scripts/seed-dynamic-poses.js so they can be tuned live.
--
-- Rollback (dashboard, no deploy): drops the pool below its 80% floor → the
-- loader serves the code array; or fully off by reweighting the picker to 0.
--   UPDATE action_poses SET disabled=true WHERE pool IN ('dynamic','dynamic_solo');

ALTER TABLE public.action_poses
  DROP CONSTRAINT IF EXISTS action_poses_pool_check;
ALTER TABLE public.action_poses
  ADD CONSTRAINT action_poses_pool_check CHECK (
    (cast_type = 'dual' AND pool IN ('active', 'companion', 'partner', 'playful', 'glamour', 'dynamic'))
    OR (cast_type = 'solo' AND pool IN ('active', 'candid', 'portrait', 'glamour', 'dynamic_solo'))
  );

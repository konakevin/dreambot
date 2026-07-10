-- 353: bespoke pose pools for scenario seeds (funny audit follow-up, 2026-07-09).
--
-- A scenario row can now name the pose pool its renders should draw from
-- (`pose_pool`, nullable — NULL = today's behavior: playful for dual goofy,
-- candid/portrait for solo). First user: the glamour_shot_retro category pairs
-- with a curated 'glamour' pose pool in action_poses (earnest chin-on-fist /
-- over-the-shoulder mall-studio poses — the missing 20% of the Glamour Shots
-- joke). The mechanism is generic: decade_eras / elegant can map to their own
-- pools later with zero engine changes.

ALTER TABLE public.dual_scenarios ADD COLUMN IF NOT EXISTS pose_pool text;
ALTER TABLE public.single_scenarios ADD COLUMN IF NOT EXISTS pose_pool text;

-- Widen the action_poses pool CHECK (351) to allow the curated glamour pool
-- on both cast types.
ALTER TABLE public.action_poses DROP CONSTRAINT IF EXISTS action_poses_pool_check;
ALTER TABLE public.action_poses
  ADD CONSTRAINT action_poses_pool_check CHECK (
    (cast_type = 'dual' AND pool IN ('active', 'companion', 'partner', 'playful', 'glamour'))
    OR (cast_type = 'solo' AND pool IN ('active', 'candid', 'portrait', 'glamour'))
  );

-- Backfill: the 50 glamour-shot scenario seeds draw from the glamour pose pool.
UPDATE public.dual_scenarios SET pose_pool = 'glamour' WHERE category = 'glamour_shot_retro';
UPDATE public.single_scenarios SET pose_pool = 'glamour' WHERE category = 'glamour_shot_retro';

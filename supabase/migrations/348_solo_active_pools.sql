-- 348: Phase B of ACTION_POSE_EXPANSION_PLAN.md — solo-side active pools.
--
-- 1) single_action_pose_pct: % of plain-location SOLO face-swap dreams that
--    roll a pose from the biome-tagged solo active pool
--    (_shared/pools/single_actions_active.ts). Ships DARK (default 0 here and
--    in the engineConfig.ts fallback).
-- 2) single_scene_{goofy,elegant,active}_pct: the solo special-scene roll
--    split, previously hardcoded 20/20. Defaults preserve today's behavior;
--    active defaults 0 (dark) until its pool is seeded + owner-flipped.
-- 3) single_scenarios pool CHECK widens to accept 'active' rows (seeded by
--    scripts/seed-active-scenarios.js --solo).

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS single_action_pose_pct numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS single_scene_goofy_pct numeric NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS single_scene_elegant_pct numeric NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS single_scene_active_pct numeric NOT NULL DEFAULT 0;

ALTER TABLE public.single_scenarios
  DROP CONSTRAINT IF EXISTS single_scenarios_pool_check;
ALTER TABLE public.single_scenarios
  ADD CONSTRAINT single_scenarios_pool_check CHECK (pool IN ('goofy', 'elegant', 'active'));

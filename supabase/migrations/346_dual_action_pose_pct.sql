-- 346: Phase A of ACTION_POSE_EXPANSION_PLAN.md — biome-tagged ACTIVE couple
-- pose pool rollout percentage.
--
-- dual_action_pose_pct = the % (0-100) of plain-location dual face-swap dreams
-- that roll a pose from the new biome-tagged ACTIVE pool
-- (_shared/pools/dual_actions_active.ts) instead of the classic
-- companion/partner pools. Ships DARK: default 0 here AND in the edge
-- fallback (engineConfig.ts), so applying this migration changes nothing.
-- Rollout per the plan: 10 (nightly soak, watch dual_reject:* + identity_sim
-- vs baseline) -> 25. Rollback = set 0. Server-only field — the client never
-- reads it, so get_engine_config() is deliberately NOT extended.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dual_action_pose_pct numeric NOT NULL DEFAULT 0;

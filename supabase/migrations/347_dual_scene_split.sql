-- 347: tunable special-scene roll split for dual face-swap nightlies
-- (ACTION_POSE_EXPANSION_PLAN.md). Was hardcoded 20% goofy / 20% elegant /
-- 60% location in nightly-dreams. Now dashboard-tunable, plus the new ACTIVE
-- scenario pool's share (defaults 0 = dark; the pool itself is dual_scenarios
-- rows with pool='active', seeded separately by scripts/seed-active-scenarios.js).
-- Defaults preserve today's behavior exactly. Rollback = reset to 20/20/0.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dual_scene_goofy_pct numeric NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS dual_scene_elegant_pct numeric NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS dual_scene_active_pct numeric NOT NULL DEFAULT 0;

-- The ACTIVE pool needs the pool CHECK widened (migration 270 allowed only
-- goofy/elegant). Seeding (scripts/seed-active-scenarios.js) fails on the old
-- constraint until this is applied — by design, the pool ships dark anyway.
ALTER TABLE public.dual_scenarios
  DROP CONSTRAINT IF EXISTS dual_scenarios_pool_check;
ALTER TABLE public.dual_scenarios
  ADD CONSTRAINT dual_scenarios_pool_check CHECK (pool IN ('goofy', 'elegant', 'active'));

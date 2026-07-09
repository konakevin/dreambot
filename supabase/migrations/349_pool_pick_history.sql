-- 349: per-user pool pick history — the "users truly don't see common
-- poses/scenarios" mechanism (ACTION_POSE_EXPANSION_PLAN.md, owner directive
-- 2026-07-09: pools as wide/deep as possible + no visible repetition).
--
-- Random picks repeat far sooner than pool size suggests (birthday paradox);
-- a shuffle-bag beats raw pool growth. One row per (user, pool, item) pick;
-- the edge reader filters candidates against the user's recent picks and
-- RESETS the bag (scoped delete) when the pool is nearly exhausted, so every
-- entry is seen before any repeats. Server-only table (service role writes;
-- no client access needed — deliberately NO grants to anon/authenticated).

CREATE TABLE IF NOT EXISTS public.pool_pick_history (
  id         bigserial PRIMARY KEY,
  user_id    uuid NOT NULL,
  pool       text NOT NULL,
  item_key   text NOT NULL,
  picked_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pool_pick_history_user_pool_idx
  ON public.pool_pick_history (user_id, pool, picked_at DESC);

ALTER TABLE public.pool_pick_history ENABLE ROW LEVEL SECURITY;
-- No policies: service-role only.

-- Retention: picks older than 180 days are past any bag's horizon.
SELECT cron.schedule(
  'prune-pool-pick-history',
  '20 5 * * *',
  $$DELETE FROM public.pool_pick_history WHERE picked_at < now() - interval '180 days'$$
);

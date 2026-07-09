-- 351: POSE_POOLS_DB_MIGRATION_PLAN.md — classic pose pools + scene clusters
-- become DB-loadable. Applies DARK: loaders activate per pool only when that
-- pool is seeded to >= 80% of its code-array count; until then (and on ANY
-- loader error) the code arrays serve, byte-identical to today.
--
-- Rollback per pool (dashboard, no deploy):
--   UPDATE action_poses SET disabled=true WHERE pool='companion';   -- etc.
--   UPDATE location_spots SET disabled=true WHERE kind='spot';      -- etc.
-- (drops the pool below its floor -> code fallback on the next isolate)

-- action_poses grows a pool column; existing rows are the ACTIVE pools.
ALTER TABLE public.action_poses
  ADD COLUMN IF NOT EXISTS pool text NOT NULL DEFAULT 'active';

ALTER TABLE public.action_poses
  DROP CONSTRAINT IF EXISTS action_poses_pool_check;
ALTER TABLE public.action_poses
  ADD CONSTRAINT action_poses_pool_check CHECK (
    (cast_type = 'dual' AND pool IN ('active', 'companion', 'partner', 'playful'))
    OR (cast_type = 'solo' AND pool IN ('active', 'candid', 'portrait'))
  );

CREATE INDEX IF NOT EXISTS action_poses_pool_idx
  ON public.action_poses (cast_type, pool) WHERE NOT disabled;

-- Scene clusters: per-location spots/activities (exact lowercase location_key;
-- the matcher in code is unchanged).
CREATE TABLE IF NOT EXISTS public.location_spots (
  id           bigserial PRIMARY KEY,
  location_key text NOT NULL,
  kind         text NOT NULL CHECK (kind IN ('spot', 'activity')),
  text         text NOT NULL,
  disabled     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS location_spots_key_kind_idx
  ON public.location_spots (location_key, kind) WHERE NOT disabled;

ALTER TABLE public.location_spots ENABLE ROW LEVEL SECURITY;
-- No policies: service-role only.

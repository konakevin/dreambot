-- 350: Stage 5c + pose-pool DB promotion (ACTION_POSE_EXPANSION_PLAN.md Phase D).
--
-- 1) single_composition_expanded_pct: % of solo face-swap NIGHTLY renders that
--    use an expanded composition preset (three-quarter / environmental-wide)
--    instead of the classic waist-up frontal. Ships DARK (default 0). The
--    Stage-8 identity gates (CodeFormer restore + post-swap ArcFace verify)
--    are the safety net that makes smaller-face presets shippable.
-- 2) action_poses: the active pose pools promoted from code arrays to a
--    dashboard-tunable table (cull with disabled=true, seed with no deploy).
--    The code arrays REMAIN as the fallback when the table is empty/unreachable
--    (dual_scenarios loader pattern) — applying this migration changes nothing
--    until rows are seeded (scripts/seed-action-poses-db.js copies the code
--    entries in).

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS single_composition_expanded_pct numeric NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.action_poses (
  id         bigserial PRIMARY KEY,
  cast_type  text NOT NULL CHECK (cast_type IN ('dual', 'solo')),
  text       text NOT NULL,
  biomes     text[],            -- NULL = universal (any location biome)
  weight     numeric NOT NULL DEFAULT 1,
  disabled   boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS action_poses_cast_type_idx
  ON public.action_poses (cast_type) WHERE NOT disabled;

ALTER TABLE public.action_poses ENABLE ROW LEVEL SECURITY;
-- No policies: service-role only (server reads at render time).

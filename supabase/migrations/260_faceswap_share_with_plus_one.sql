-- Higher nightly face-swap share when the user has BOTH self + a +1 (2026-06-12).
--
-- The dual-cast showcase case: when a user uploaded both a self photo and a
-- +1, bump the face-swap portion from the base 70% (self-only) to 90%. The
-- 60/20/20 dual/self/+1 split is unchanged — it just scales to the larger
-- share, so per all dreams for a both-cast user:
--
--   54% dual / 18% self / 18% +1   (= 90% face-swap)
--   10% scene-territory            (chaos-gated embodied, else 50/50 pure/tiny)
--
-- Self-only users are unaffected (still 70% face-swap via face_swap_share).
-- Read by _shared/chaosTier.ts:rollNightlyDreamType. SQL-tunable like the rest
-- of the mig-239 nightly distribution knobs — no deploy needed to retune.

ALTER TABLE engine_config
  ADD COLUMN IF NOT EXISTS face_swap_share_with_plus_one NUMERIC(4,3) NOT NULL DEFAULT 0.900;

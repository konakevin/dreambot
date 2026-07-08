-- 344: Stage 2 face-restoration config (FACE_SWAP_UPGRADE_PLAN.md)
--
-- Post-swap CodeFormer restoration, bench-picked 2026-07-08 (fidelity 0.9 —
-- Kevin: "the sharper (highest) ones look best"). Ships DARK: enabled=false
-- is the default both here and in the edge fallback (engineConfig.ts), so
-- applying this migration changes nothing. The Stage-2 flip is a one-row
-- UPDATE (nightly soaks first per the staged rollout contract):
-- Two-step flip per the staged contract (nightly soaks 48h before Create):
--   step 1: UPDATE engine_config SET face_restore_enabled = true WHERE id = 1;
--           (nightly-dreams only — generate-dream additionally requires the
--           create flag below)
--   step 2: UPDATE engine_config SET face_restore_create_enabled = true WHERE id = 1;
-- Rollback = set either back to false. Server-only fields — the client never
-- reads them, so get_engine_config() is deliberately NOT extended.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS face_restore_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS face_restore_create_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS face_restore_fidelity numeric NOT NULL DEFAULT 0.9;

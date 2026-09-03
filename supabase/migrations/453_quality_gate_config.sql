-- Render quality gate knobs (NIGHTLY_IMPRESS_PLAN §1, 2026-09-03).
-- Code defaults already apply (mode 'enforce', retries 2) — these columns make
-- the gate LIVE-TUNABLE from the dashboard: set mode 'off' to kill judge cost
-- instantly, 'shadow' for telemetry-only.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS quality_gate_mode text NOT NULL DEFAULT 'enforce',
  ADD COLUMN IF NOT EXISTS quality_gate_max_retries integer NOT NULL DEFAULT 2;

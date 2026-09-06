-- NIGHTLY_NO_PLAIN_RENDERS_PLAN.md F2 (2026-09-06): when a couple face-swap fails every retry the render is rebuilt
-- as a SOLO. That rebuild carried the flux-1.1-pro override fragment and rendered on the couple's model — the
-- tightest-cropping combination in the 520-render audit (63% tight, 3 of the 4 true headshots). It now renders the
-- medium's REAL fragment on this model. '' = the couple's own model (old behaviour).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS solo_rebuild_model text NOT NULL DEFAULT 'black-forest-labs/flux-2-flex';

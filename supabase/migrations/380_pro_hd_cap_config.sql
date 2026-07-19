-- 380: move the Pro monthly HD-download cap into engine_config (parity with Basic).
--
-- The Basic tier's monthly HD cap already lives in engine_config
-- (basic_hd_downloads_per_month, default 20) so it's tunable from the dashboard
-- with no redeploy. The Pro cap was hardcoded `PRO_HQ_CAP_PER_MONTH = 100` in
-- upscale-image/index.ts — inconsistent, and un-tunable without a code push
-- (Architect audit A7, 2026-07-19). This adds the matching config column so both
-- tiers' caps are DB-driven; upscale-image now reads it.
--
-- Default 100 preserves today's behavior exactly. Apply in the Supabase SQL editor.
-- Re-runnable. No grant needed: engine_config is service-role-only (read by the
-- edge function via the service client), not client-selectable.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS pro_hd_downloads_per_month integer NOT NULL DEFAULT 100;

COMMENT ON COLUMN public.engine_config.pro_hd_downloads_per_month IS
  'Max HD downloads per calendar month for Pro users (own dreams are always free + uncapped; this meters downloads of other users posts). Enforced by the upscale-image edge fn. Sibling of basic_hd_downloads_per_month.';

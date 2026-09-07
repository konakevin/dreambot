-- 469_bots_seasonal_pct.sql — bots get a FLAT seasonal draw rate, independent of
-- nightly's own per-holiday ramp curve on the same public.holidays row.
--
-- Kevin (2026-09-07): "bots should have a 30% chance to draw from holiday
-- pools" — a simple flat dial, not nightly's escalating ramp (nightly's
-- Halloween row is currently flat 10% anyway, but the two surfaces should be
-- independently tunable). Bots still key off public.holidays for WHEN a
-- holiday is in season (window + is_active) — only the INTENSITY diverges.
--
-- This is the second half of turning bot seasonal content on: migration 467
-- added the master kill switch (bots_seasonal_enabled, started false). Both
-- changes are inert until the code that reads them (scripts/lib/botSeasonal.js)
-- is committed + pushed to main — the bot dispatcher runs off the deployed
-- branch, not a local working tree, so flipping this now is safe to ship
-- ahead of the code.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS bots_seasonal_pct integer NOT NULL DEFAULT 30;

UPDATE public.engine_config SET bots_seasonal_enabled = true WHERE id = 1;

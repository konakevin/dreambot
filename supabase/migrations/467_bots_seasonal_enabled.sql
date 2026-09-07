-- 467_bots_seasonal_enabled.sql — master kill switch for BOT seasonal/holiday
-- content, independent of nightly's own engine_config.holidays_enabled (migration
-- 437). Bots read the same public.holidays calendar + ramp math nightly uses
-- (scripts/lib/holidayWindow.js, parity-locked against _shared/holidayWindow.ts)
-- but gate on this SEPARATE switch, so turning nightly holiday dreams on/off never
-- affects bots and vice versa — each surface ships and rolls out independently.
--
-- Starts FALSE (dark): a bot's seasonalPaths[] only fires once this is flipped on
-- for real, after the destination bot's paths are promoted + confirmed
-- (ALPHABOT.md promotion checklist).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS bots_seasonal_enabled boolean NOT NULL DEFAULT false;

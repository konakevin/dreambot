-- 479 — Holiday postcard BACKFILL marker (HOLIDAY_DAY_OF_PLAN.md §7b).
-- The in-isolate holiday-postcard composite hits the edge resource limit (HTTP 546) on large sources
-- (seedream-4 returns 1440×2560 PNGs, ~6 MB; 4 of 16 day-of postcards failed 2026-09-08). The render now
-- records the holiday key here when the overlay was NOT applied; the display-variant cron (sharp, real
-- compute, every 10 min) composites the overlay out-of-process, writes a stamped HQ + display copy and
-- clears the marker. Service-role only — the client never reads it (no column grant on purpose).
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS postcard_pending text;
CREATE INDEX IF NOT EXISTS uploads_postcard_pending_idx
  ON public.uploads (created_at DESC) WHERE postcard_pending IS NOT NULL;
COMMENT ON COLUMN public.uploads.postcard_pending IS
  'Holiday key whose postcard overlay still needs compositing out-of-process (scripts/backfill-display-variants.js); NULL = done / not needed.';

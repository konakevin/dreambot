-- Roll back migration 147 — animate-this POC abandoned 2026-05-04.
-- Nothing in the app reads video_url and no rows are populated.

ALTER TABLE public.uploads DROP COLUMN IF EXISTS video_url;

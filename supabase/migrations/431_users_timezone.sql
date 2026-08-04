-- 431_users_timezone.sql (2026-08-04)
--
-- Timezone-aware nightly dreams: store each user's device IANA timezone so the
-- nightly cron can fire during THEIR night instead of one global 08:00 UTC instant.
--
-- Store the IANA NAME ('America/Los_Angeles'), never a raw UTC offset — the name
-- resolves DST correctly at compute time; an offset would be wrong half the year.
-- Nullable: old accounts / capture failures fall back to the legacy 08:00 UTC fire.
--
-- COLUMN-LEVEL GRANTS (migration 278 doctrine): `users` uses column grants, so a new
-- column is silently client-invisible + un-writable until granted. The client both
-- reads it (to skip a no-op write) and writes it (self-sync on launch), so grant
-- SELECT + UPDATE to authenticated. NOT anon (no need to expose it publicly).
-- Re-runnable.

BEGIN;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS timezone text;

GRANT SELECT (timezone) ON public.users TO authenticated;
GRANT UPDATE (timezone) ON public.users TO authenticated;

COMMIT;

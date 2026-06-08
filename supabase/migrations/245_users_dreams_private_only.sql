-- 245_users_dreams_private_only.sql — persisted "Private only" filter for the
-- profile Dreams album.
--
-- The Dreams tab has a "Private only" toggle that filters the album to unposted
-- (private) dreams. Per Kevin it's a per-profile SETTING that persists across
-- sessions, so it lives on the user row. Pure data column, idempotent.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS dreams_private_only boolean NOT NULL DEFAULT false;

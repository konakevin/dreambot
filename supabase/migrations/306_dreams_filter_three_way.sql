-- Migration 306: 3-way Dreams album filter (all / posted / private).
--
-- The profile Dreams tab had a 2-way All / Private toggle persisted in
-- users.dreams_private_only (boolean). Add a "Posted" option between them
-- (only the dreams that are live on the public feed, is_public = true).
--
-- A boolean can't hold 3 states, so add a text column. Backfill from the old
-- boolean (true → 'private') so existing users keep their choice. The old
-- dreams_private_only column is left in place (vestigial) to avoid touching
-- anything else that might still read it.
--
-- users uses COLUMN-LEVEL grants (migration 278/281) — a new column is
-- invisible to the client (read) and un-writable (update) until granted, so the
-- GRANTs below are load-bearing, not optional.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS dreams_filter text NOT NULL DEFAULT 'all';

UPDATE public.users SET dreams_filter = 'private' WHERE dreams_private_only = true;

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_dreams_filter_chk;
ALTER TABLE public.users
  ADD CONSTRAINT users_dreams_filter_chk CHECK (dreams_filter IN ('all', 'posted', 'private'));

GRANT SELECT (dreams_filter) ON public.users TO anon, authenticated;
GRANT UPDATE (dreams_filter) ON public.users TO authenticated;

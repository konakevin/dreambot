-- 555_drop_users_header_upload_fk.sql — OUTAGE FIX, 2026-09-25.
--
-- Migration 554 added users.header_upload_id REFERENCES public.uploads(id). That created a
-- SECOND foreign-key relationship between uploads and users (users_header_upload_id_fkey next
-- to uploads_user_id_fkey), and PostgREST then refuses every un-hinted `users!inner(...)` embed
-- from uploads with PGRST201 "more than one relationship was found". That embed is POST_SELECT
-- (lib/mapPost.ts) and six more hooks, so every profile grid, every Dreams album, likes,
-- favourites and reposts came back EMPTY on every device, while the main feed (get_feed, an
-- RPC with no embed) kept working. Kevin, 2026-09-25: "all bots feeds look empty if you go to
-- their profile to view their album … i've confirmed it on multiple user's devices now … my
-- albums are showing empty too". Same failure class as migration 367 (upload_media.source_upload_id),
-- recorded in the POST_SELECT comment.
--
-- Fix that needs NO app build: drop the constraint, keep the column. Per 554a the header is a
-- COPY of the picture and header_upload_id is informational ("ON DELETE SET NULL leaves the
-- header in place"), so the FK's only remaining job was cosmetic. Every header read goes through
-- get_public_profile (a SQL join, not an embed) and every write through the set-profile-header
-- edge function, so nothing depends on the constraint. The partial index stays for the
-- quarantine trigger's lookup.
--
-- Follow-up (needs a build): hint every client embed as users!uploads_user_id_fkey so a future FK
-- cannot repeat this, and a CI guard that fails on a bare users embed from uploads.
-- Re-adding the FK later is safe ONLY after every shipped build carries the hinted embed.

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_header_upload_id_fkey;

COMMENT ON COLUMN public.users.header_upload_id IS
  'The post the header was copied from (informational, no FK — migration 555: a users→uploads FK makes every un-hinted uploads→users embed ambiguous in PostgREST).';

-- PostgREST reloads its relationship cache on DDL via Supabase''s event trigger; ask explicitly too.
NOTIFY pgrst, 'reload schema';

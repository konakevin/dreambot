-- Backfill posted_at for legacy public uploads (2026-06-08).
--
-- Context: the Posts grid hooks (useUserPosts, usePublicProfilePosts) now
-- order by posted_at DESC so a private dream made public weeks later lands
-- at the top of the grid. But uploads from before the publish-timestamp
-- was reliably set have posted_at = NULL — and Postgres sorts NULLs FIRST
-- in DESC ordering, which buries every recent post beneath the legacy ones.
--
-- Snapshot at migration time: ~676 of ~913 public-by-Kevin uploads had
-- posted_at IS NULL; the picture is similar across other users with
-- pre-2026-06 activity.
--
-- Fix: for every public upload with NULL posted_at, set posted_at to its
-- created_at — the effective "this is when it went public" timestamp for
-- legacy data. Going forward, every publish path (newPost.tsx + every Edge
-- Function that flips is_public=true) already sets posted_at explicitly,
-- so no NEW NULLs land. Idempotent — safe to re-run.
--
-- Pure data, no DDL. Run in the Supabase dashboard SQL editor.

UPDATE public.uploads
SET    posted_at = created_at
WHERE  is_public = true
  AND  posted_at IS NULL;

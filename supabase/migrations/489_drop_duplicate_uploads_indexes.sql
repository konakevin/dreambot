-- 489_drop_duplicate_uploads_indexes.sql — drop the two byte-identical duplicate indexes on uploads.
--
-- The Supabase performance advisor (2026-09-09) flagged two identical pairs. Live stats picked the keeper:
--   idx_uploads_feed_recency (282)  == idx_uploads_public_posted (391)  — 0 scans vs 7,248  → drop 282's
--   idx_uploads_user_dreams  (075)  == idx_uploads_user_created  (084)  — 0 scans vs 127,304 → drop 075's
-- Both dropped indexes are unused copies (the planner always picked the sibling); every write to uploads
-- was maintaining ~5 MB of dead btree for nothing. Definitions kept: (posted_at DESC) WHERE is_public AND
-- posted_at IS NOT NULL, and (user_id, created_at DESC).
-- lock_timeout: DROP INDEX takes a brief ACCESS EXCLUSIVE lock on uploads (the feed's table); fail fast
-- instead of queueing behind a long reader and stalling the app.
SET lock_timeout = '3s';
DROP INDEX IF EXISTS public.idx_uploads_feed_recency;
DROP INDEX IF EXISTS public.idx_uploads_user_dreams;

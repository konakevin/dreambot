-- Migration 022: Performance indexes
--
-- 1. Partial index on users.needs_rank_recalc
--    The hourly pg_cron job scans WHERE needs_rank_recalc = true to find
--    users whose rank needs recalculating. Without an index this is a full
--    table scan every hour. A partial index on true-only rows is tiny and fast.
CREATE INDEX IF NOT EXISTS users_needs_rank_recalc_idx
  ON public.users (id)
  WHERE needs_rank_recalc = true;

-- 2. Composite index on uploads(user_id, created_at DESC) WHERE is_active
--    Every profile grid (own posts + public profile posts) queries:
--      WHERE user_id = ? AND is_active = true ORDER BY created_at DESC
--    This index covers that query entirely without touching the full table.
CREATE INDEX IF NOT EXISTS uploads_user_created_idx
  ON public.uploads (user_id, created_at DESC)
  WHERE is_active = true;

-- Database cleanup: remove legacy cruft, dead functions, orphaned indexes,
-- unused tables, and stale columns identified in the schema audit.

-- ============================================================
-- 1. Drop zombie functions (referenced dropped tables/columns)
-- ============================================================
DROP FUNCTION IF EXISTS public.update_vibe_scores() CASCADE;
DROP FUNCTION IF EXISTS public.refresh_wilson_score() CASCADE;
DROP FUNCTION IF EXISTS public.wilson_lower_bound(integer, integer) CASCADE;

-- ============================================================
-- 2. Drop dead RPCs (never called from client, superseded)
-- ============================================================
DROP FUNCTION IF EXISTS public.get_inbox(uuid, integer, integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_unread_share_count(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_vibe_stats(uuid, uuid) CASCADE;

-- ============================================================
-- 3. Drop unused tables
-- ============================================================
DROP TABLE IF EXISTS public.feature_flags CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.recipe_registry CASCADE;

-- ============================================================
-- 4. Drop stale columns on users (rank/subscription system removed)
-- ============================================================
ALTER TABLE public.users DROP COLUMN IF EXISTS pro_subscription;
ALTER TABLE public.users DROP COLUMN IF EXISTS subscription_expires;
ALTER TABLE public.users DROP COLUMN IF EXISTS upload_count_week;
ALTER TABLE public.users DROP COLUMN IF EXISTS week_reset_date;
ALTER TABLE public.users DROP COLUMN IF EXISTS needs_rank_recalc;
ALTER TABLE public.users DROP COLUMN IF EXISTS preferred_categories;

-- ============================================================
-- 5. Drop dead indexes (columns were dropped, these may already be gone)
-- ============================================================
DROP INDEX IF EXISTS public.uploads_feed_idx;
DROP INDEX IF EXISTS public.idx_uploads_twin_of;
DROP INDEX IF EXISTS public.users_needs_rank_recalc_idx;

-- ============================================================
-- 6. Drop duplicate indexes (keep the better-named one)
-- ============================================================
-- favorites: keep favorites_user_id_idx, drop duplicate
DROP INDEX IF EXISTS public.idx_favorites_user;

-- follows: keep follows_follower_id_idx / follows_following_id_idx
DROP INDEX IF EXISTS public.idx_follows_follower;
DROP INDEX IF EXISTS public.idx_follows_following;

-- friendships: keep friendships_user_a_status_idx / friendships_user_b_status_idx
DROP INDEX IF EXISTS public.idx_friendships_user_a;
DROP INDEX IF EXISTS public.idx_friendships_user_b;

-- likes: keep likes_user_id_idx
DROP INDEX IF EXISTS public.idx_likes_user;

-- notifications: keep idx_notifications_unread, drop duplicate
DROP INDEX IF EXISTS public.idx_notifications_unseen;

-- ============================================================
-- 7. Enable RLS on any remaining unprotected tables
-- ============================================================
-- (feature_flags and achievements were dropped above)
-- recipe_registry was dropped above

-- ============================================================
-- 8. Add index for feed scoring (view_count used in engagement rate)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_uploads_view_count
  ON public.uploads(view_count DESC)
  WHERE is_active = true;

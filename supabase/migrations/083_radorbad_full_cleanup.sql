-- Migration 083: Full RadOrBad cleanup + twin removal
--
-- Removes ALL remaining legacy systems:
-- 1. votes table (completely orphaned since migration 076)
-- 2. RadOrBad columns on uploads (rad_votes, bad_votes, total_votes, wilson_score)
-- 3. RadOrBad columns on friendships (shared_votes, agreed_votes)
-- 4. Twin system (twin_of, twin_count columns, triggers, notification type)
-- 5. Unused RPC functions
-- 6. Updates get_feed to remove twin_count from return

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. DROP votes table
-- ══════════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS public.votes CASCADE;

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. DROP RadOrBad columns from uploads (drop dependent objects first)
-- ══════════════════════════════════════════════════════════════════════════════

-- Drop dependent trigger and view that reference these columns
DROP TRIGGER IF EXISTS sync_wilson_score ON uploads;
DROP TRIGGER IF EXISTS trg_sync_wilson ON uploads;
DROP FUNCTION IF EXISTS public.sync_wilson_score() CASCADE;
DROP VIEW IF EXISTS public.uploads_with_score CASCADE;

ALTER TABLE public.uploads
  DROP COLUMN IF EXISTS rad_votes CASCADE,
  DROP COLUMN IF EXISTS bad_votes CASCADE,
  DROP COLUMN IF EXISTS total_votes CASCADE,
  DROP COLUMN IF EXISTS wilson_score CASCADE;

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. DROP RadOrBad columns from friendships
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.friendships
  DROP COLUMN IF EXISTS shared_votes,
  DROP COLUMN IF EXISTS agreed_votes;

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. DROP twin system
-- ══════════════════════════════════════════════════════════════════════════════

-- Drop twin triggers
DROP TRIGGER IF EXISTS trg_update_twin_count ON uploads;
DROP TRIGGER IF EXISTS trg_notify_post_twin ON uploads;

-- Drop twin functions
DROP FUNCTION IF EXISTS public.update_twin_count() CASCADE;
DROP FUNCTION IF EXISTS public.notify_post_twin() CASCADE;

-- Drop twin columns
ALTER TABLE public.uploads
  DROP COLUMN IF EXISTS twin_of,
  DROP COLUMN IF EXISTS twin_count;

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. DROP unused RPC functions
-- ══════════════════════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.are_friends(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_friend_count(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_vibe_suggestions(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS public.wilson_lower_bound(bigint, bigint) CASCADE;

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. UPDATE get_feed — remove twin_count from return type
-- ══════════════════════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.get_feed(uuid, integer, integer, double precision);

CREATE FUNCTION public.get_feed(
  p_user_id uuid,
  p_limit   integer DEFAULT 20,
  p_offset  integer DEFAULT 0,
  p_seed    double precision DEFAULT 0.0
)
RETURNS TABLE(
  id            uuid,
  user_id       uuid,
  image_url     text,
  width         integer,
  height        integer,
  caption       text,
  created_at    timestamptz,
  username      text,
  avatar_url    text,
  comment_count integer,
  like_count    integer,
  fuse_count    integer,
  ai_prompt     text,
  ai_concept    jsonb,
  bot_message   text,
  dream_medium  text,
  dream_vibe    text,
  feed_score    double precision
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  WITH user_blocks AS (
    SELECT blocked_id FROM blocked_users WHERE blocker_id = p_user_id
  ),
  user_reports AS (
    SELECT upload_id FROM reports WHERE reporter_id = p_user_id AND upload_id IS NOT NULL
  )
  SELECT
    up.id, up.user_id, up.image_url,
    up.width, up.height, up.caption, up.created_at,
    u.username, u.avatar_url,
    up.comment_count, up.like_count, up.fuse_count,
    up.ai_prompt, up.ai_concept, up.bot_message,
    up.dream_medium, up.dream_vibe,
    (
      (1.0 / POWER(GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0) + 2.0, 1.8) / 0.2871) * 0.35
      + CASE WHEN follows.following_id IS NOT NULL THEN 0.20 ELSE 0.0 END
      + (LN(1.0 + up.like_count) / LN(1.0 + 10000.0)) * 0.20
      + (LN(1.0 + up.comment_count) / LN(1.0 + 1000.0)) * 0.15
      + ((ABS(HASHTEXT(p_user_id::text || up.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
    ) AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  LEFT JOIN public.follows follows ON follows.follower_id = p_user_id AND follows.following_id = up.user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND up.user_id NOT IN (SELECT blocked_id FROM user_blocks)
    AND up.id NOT IN (SELECT upload_id FROM user_reports)
  ORDER BY feed_score DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, integer, double precision) TO authenticated;

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. ADD missing indexes for common query patterns
-- ══════════════════════════════════════════════════════════════════════════════

-- Feed/explore queries filter by these columns heavily
CREATE INDEX IF NOT EXISTS idx_uploads_dream_medium ON public.uploads (dream_medium) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_uploads_dream_vibe ON public.uploads (dream_vibe) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_uploads_is_posted ON public.uploads (user_id, is_posted) WHERE is_posted = true;
CREATE INDEX IF NOT EXISTS idx_uploads_fuse_of ON public.uploads (fuse_of) WHERE fuse_of IS NOT NULL;

-- Notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_unseen ON public.notifications (recipient_id) WHERE seen_at IS NULL;

-- Migration 076: Remove RadOrBad legacy systems
--
-- DreamBot has fully moved away from the rad/bad voting model.
-- Now we only have likes (no downvotes), no vote streaks, no milestones,
-- no rad_score/user_rank/wilson_score, no category preferences.
--
-- This migration:
-- 1. Drops vote-based triggers and cron functions
-- 2. Drops vote_streaks, streak_cron_state, rank_thresholds tables
-- 3. Drops milestone trigger
-- 4. Rewrites get_feed to use likes instead of votes for engagement signal
-- 5. Rewrites get_public_profile to remove rad_score/user_rank
-- 6. Drops get_friends_feed, get_friend_votes_on_post, get_top_streaks RPCs
-- 7. Drops refresh_vote_streaks, check_post_milestone functions
-- 8. Cleans up notification type constraint

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. DROP TRIGGERS
-- ══════════════════════════════════════════════════════════════════════════════

-- Vote count triggers on votes table
DROP TRIGGER IF EXISTS on_vote_inserted ON votes;
DROP TRIGGER IF EXISTS trg_update_user_rank ON votes;
DROP TRIGGER IF EXISTS trg_post_milestone ON votes;

-- Wilson score trigger on uploads
DROP TRIGGER IF EXISTS trg_sync_wilson ON uploads;

-- Vote affinity trigger (table already dropped in 051)
DROP TRIGGER IF EXISTS on_vote_affinity ON votes;

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. DROP FUNCTIONS
-- ══════════════════════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.handle_new_vote() CASCADE;
DROP FUNCTION IF EXISTS public.handle_vote_affinity() CASCADE;
DROP FUNCTION IF EXISTS public.sync_wilson_score() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_rank() CASCADE;
DROP FUNCTION IF EXISTS public.check_post_milestone() CASCADE;
DROP FUNCTION IF EXISTS public.refresh_vote_streaks() CASCADE;
DROP FUNCTION IF EXISTS public.refresh_rank_thresholds() CASCADE;
DROP FUNCTION IF EXISTS public.get_top_streaks(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_friends_feed(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_friend_votes_on_post(uuid, uuid) CASCADE;

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. DROP TABLES
-- ══════════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS public.vote_streaks CASCADE;
DROP TABLE IF EXISTS public.streak_cron_state CASCADE;
DROP TABLE IF EXISTS public.rank_thresholds CASCADE;
DROP TABLE IF EXISTS public.post_milestones CASCADE;

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. REWRITE get_feed — replace total_votes engagement signal with like_count
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
  twin_count    integer,
  fuse_count    integer,
  ai_prompt     text,
  ai_concept    jsonb,
  bot_message   text,
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
    up.comment_count, up.like_count, up.twin_count, up.fuse_count,
    up.ai_prompt, up.ai_concept, up.bot_message,
    (
      -- Recency: time decay (35% weight)
      (1.0 / POWER(GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0) + 2.0, 1.8) / 0.2871) * 0.35
      -- Following boost (20% weight)
      + CASE WHEN follows.following_id IS NOT NULL THEN 0.20 ELSE 0.0 END
      -- Engagement: likes (20% weight)
      + (LN(1.0 + up.like_count) / LN(1.0 + 10000.0)) * 0.20
      -- Engagement: comments (15% weight)
      + (LN(1.0 + up.comment_count) / LN(1.0 + 1000.0)) * 0.15
      -- Randomness: seeded hash for variety (10% weight)
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
-- 5. REWRITE get_public_profile — remove rad_score and user_rank
-- ══════════════════════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE FUNCTION public.get_public_profile(p_user_id uuid)
RETURNS TABLE (
  id              uuid,
  username        text,
  avatar_url      text,
  post_count      bigint,
  follower_count  bigint,
  following_count bigint,
  friend_count    bigint
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    u.id, u.username, u.avatar_url,
    (SELECT COUNT(*) FROM public.uploads up WHERE up.user_id = u.id AND up.is_active = true) AS post_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.following_id = u.id) AS follower_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.follower_id = u.id) AS following_count,
    (SELECT COUNT(*) FROM public.friendships fs
     WHERE (fs.user_a = u.id OR fs.user_b = u.id) AND fs.status = 'accepted') AS friend_count
  FROM public.users u
  WHERE u.id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. REWRITE get_pending_requests — remove user_rank
-- ══════════════════════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.get_pending_requests(uuid);

CREATE FUNCTION public.get_pending_requests(p_user_id uuid)
RETURNS TABLE(
  requester_id  uuid,
  username      text,
  avatar_url    text,
  requested_at  timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    f.requester       AS requester_id,
    u.username,
    u.avatar_url,
    f.created_at      AS requested_at
  FROM public.friendships f
  JOIN public.users u ON u.id = f.requester
  WHERE (f.user_a = p_user_id OR f.user_b = p_user_id)
    AND f.requester != p_user_id
    AND f.status = 'pending'
  ORDER BY f.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_pending_requests(uuid) TO authenticated;

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. UPDATE notification type constraint — remove post_milestone
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_share',
    'friend_request', 'friend_accepted',
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'post_like', 'post_fuse', 'post_twin',
    'post_milestone', 'comment'  -- legacy types kept for old rows
  ));

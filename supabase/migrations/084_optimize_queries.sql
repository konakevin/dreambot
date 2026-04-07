-- Migration 084: Query optimizations
--
-- 1. Rewrite get_shareable_vibers — replace correlated subquery with LEFT JOIN
-- 2. Add composite index for feed query (is_active + created_at)
-- 3. Add index for user uploads by created_at (profile grids)

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. Rewrite get_shareable_vibers — O(N) correlated subquery → O(1) JOIN
-- ══════════════════════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.get_shareable_vibers(uuid);

CREATE FUNCTION public.get_shareable_vibers(p_user_id uuid)
RETURNS TABLE(
  user_id           uuid,
  username          text,
  avatar_url        text,
  interaction_count bigint,
  vibe_score        integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    u.id AS user_id,
    u.username,
    u.avatar_url,
    COALESCE(sc.cnt, 0) AS interaction_count,
    0::integer AS vibe_score
  FROM friendships f
  JOIN users u
    ON u.id = CASE
      WHEN f.user_a = p_user_id THEN f.user_b
      ELSE f.user_a
    END
  LEFT JOIN (
    SELECT
      CASE
        WHEN ps.sender_id = p_user_id THEN ps.receiver_id
        ELSE ps.sender_id
      END AS friend_id,
      COUNT(*) AS cnt
    FROM post_shares ps
    WHERE ps.sender_id = p_user_id OR ps.receiver_id = p_user_id
    GROUP BY 1
  ) sc ON sc.friend_id = u.id
  WHERE (f.user_a = p_user_id OR f.user_b = p_user_id)
    AND f.status = 'accepted'
  ORDER BY interaction_count DESC, u.username ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_shareable_vibers(uuid) TO authenticated;

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. Composite index for feed query — most common query in the app
-- ══════════════════════════════════════════════════════════════════════════════

-- The feed RPC filters is_active=true then sorts by feed_score (computed),
-- but the initial scan needs to find active posts quickly
CREATE INDEX IF NOT EXISTS idx_uploads_active_created
  ON public.uploads (created_at DESC)
  WHERE is_active = true;

-- User's own uploads ordered by date (profile grid, My Dreams, My Posts)
CREATE INDEX IF NOT EXISTS idx_uploads_user_created
  ON public.uploads (user_id, created_at DESC);

-- Post shares for the shareable vibers query
CREATE INDEX IF NOT EXISTS idx_post_shares_sender ON public.post_shares (sender_id);
CREATE INDEX IF NOT EXISTS idx_post_shares_receiver ON public.post_shares (receiver_id);

-- Likes lookup by user (for like ID set)
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes (user_id);

-- Favorites lookup by user (for favorite ID set)
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites (user_id);

-- Follows lookup (both directions used frequently)
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows (following_id);

-- Friendships lookup (both users)
CREATE INDEX IF NOT EXISTS idx_friendships_user_a ON public.friendships (user_a, status);
CREATE INDEX IF NOT EXISTS idx_friendships_user_b ON public.friendships (user_b, status);

-- Comments by upload (comment overlay)
CREATE INDEX IF NOT EXISTS idx_comments_upload ON public.comments (upload_id, created_at DESC);

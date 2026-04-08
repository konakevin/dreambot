-- Feed Algorithm v2: engagement velocity, cold start, per-tab ranking
-- Replaces the flat 5-factor scoring with TikTok/Instagram-inspired algorithm.

DROP FUNCTION IF EXISTS public.get_feed;

CREATE FUNCTION public.get_feed(
  p_user_id uuid,
  p_limit   integer DEFAULT 20,
  p_offset  integer DEFAULT 0,
  p_seed    double precision DEFAULT 0.0,
  p_tab     text DEFAULT 'forYou'
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
SET search_path = ''
AS $$
  WITH user_blocks AS (
    SELECT blocked_id FROM public.blocked_users WHERE blocker_id = p_user_id
  ),
  user_reports AS (
    SELECT upload_id FROM public.reports WHERE reporter_id = p_user_id AND upload_id IS NOT NULL
  ),
  user_follows AS (
    SELECT following_id FROM public.follows WHERE follower_id = p_user_id
  ),
  user_friends AS (
    SELECT CASE WHEN user_a = p_user_id THEN user_b ELSE user_a END AS friend_id
    FROM public.friendships
    WHERE (user_a = p_user_id OR user_b = p_user_id)
      AND status = 'accepted'
  ),
  scored AS (
    SELECT
      up.id, up.user_id, up.image_url,
      up.width, up.height, up.caption, up.created_at,
      u.username, u.avatar_url,
      up.comment_count, up.like_count, up.fuse_count,
      up.ai_prompt, up.ai_concept, up.bot_message,
      up.dream_medium, up.dream_vibe,

      CASE
        -- ============================================================
        -- EXPLORE (forYou) — full algorithm
        -- ============================================================
        WHEN p_tab = 'forYou' THEN (
          -- Hours since post (floored at 0.1 to avoid division by zero)
          -- Freshness: exponential decay, peaks at 0, ~0.1 at 48h
          EXP(-0.05 * GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0)) * 0.30

          -- Engagement velocity: engagement per hour, logarithmic scale
          -- Comments worth 2x, fuses worth 3x (deeper engagement signals)
          + LN(1.0 + (up.like_count + up.comment_count * 2 + up.fuse_count * 3)::float
                / GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 1.0))
            / 5.0 * 0.30

          -- Absolute engagement: lets older viral content resurface
          + LN(1.0 + up.like_count + up.comment_count * 2)
            / LN(1.0 + 5000.0) * 0.15

          -- Following boost: posts from people you follow rank higher
          + CASE WHEN uf.following_id IS NOT NULL THEN 0.15 ELSE 0.0 END

          -- Seeded randomness: prevents stale ordering, varies per session
          + ((ABS(HASHTEXT(p_user_id::text || up.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10

          -- Cold start bonus: new posts (<4 hours) get guaranteed visibility
          + CASE WHEN EXTRACT(EPOCH FROM (now() - up.created_at)) < 14400 THEN 0.20 ELSE 0.0 END
        )

        -- ============================================================
        -- FOLLOWING — light ranking: recent posts first, older by engagement
        -- ============================================================
        WHEN p_tab = 'following' THEN (
          -- Recent posts (< 24h) get a big boost so they appear first (chrono feel)
          CASE WHEN EXTRACT(EPOCH FROM (now() - up.created_at)) < 86400
            THEN 1.0 - (EXTRACT(EPOCH FROM (now() - up.created_at)) / 86400.0) * 0.3
            ELSE 0.0
          END

          -- Older posts ranked by engagement
          + LN(1.0 + up.like_count + up.comment_count * 2 + up.fuse_count * 3)
            / LN(1.0 + 5000.0) * 0.30

          -- Light recency decay for older posts
          + EXP(-0.02 * GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0)) * 0.10
        )

        -- ============================================================
        -- DREAMERS — pure reverse-chrono (intimate feed)
        -- ============================================================
        WHEN p_tab = 'dreamers' THEN (
          -- Simple time-based score: newer = higher
          1.0 / (1.0 + EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0)
        )

        ELSE 0.0
      END AS feed_score

    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    WHERE up.is_active = true
      AND up.user_id != p_user_id
      AND (up.is_moderated = false OR up.is_approved = true)
      AND up.user_id NOT IN (SELECT blocked_id FROM user_blocks)
      AND up.id NOT IN (SELECT upload_id FROM user_reports)
      -- Tab-specific user filtering
      AND (
        CASE
          WHEN p_tab = 'following' THEN up.user_id IN (SELECT following_id FROM user_follows)
          WHEN p_tab = 'dreamers' THEN up.user_id IN (SELECT friend_id FROM user_friends)
          ELSE true  -- forYou shows all posts
        END
      )
  )
  SELECT
    scored.id, scored.user_id, scored.image_url,
    scored.width, scored.height, scored.caption, scored.created_at,
    scored.username, scored.avatar_url,
    scored.comment_count, scored.like_count, scored.fuse_count,
    scored.ai_prompt, scored.ai_concept, scored.bot_message,
    scored.dream_medium, scored.dream_vibe,
    scored.feed_score
  FROM scored
  ORDER BY scored.feed_score DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

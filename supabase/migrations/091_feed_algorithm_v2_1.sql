-- Feed Algorithm v2.1: incorporates share_count, save_count, view_count.
-- Engagement rate = weighted engagement / unique views (when available).

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

      -- Weighted engagement total:
      -- likes=1, comments=2, fuses=3, shares=2, saves=1.5
      (up.like_count + up.comment_count * 2 + up.fuse_count * 3
       + up.share_count * 2 + up.save_count * 1.5)::float AS weighted_engagement,

      -- Hours since post
      GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.1) AS hours_age,

      -- Is following
      CASE WHEN uf.following_id IS NOT NULL THEN true ELSE false END AS is_following,

      -- Unique viewer count (floor at 10 to avoid divide-by-tiny-number)
      GREATEST(up.view_count, 10)::float AS views

    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    WHERE up.is_active = true
      AND up.user_id != p_user_id
      AND (up.is_moderated = false OR up.is_approved = true)
      AND up.user_id NOT IN (SELECT blocked_id FROM user_blocks)
      AND up.id NOT IN (SELECT upload_id FROM user_reports)
      AND (
        CASE
          WHEN p_tab = 'following' THEN up.user_id IN (SELECT following_id FROM user_follows)
          WHEN p_tab = 'dreamers' THEN up.user_id IN (SELECT friend_id FROM user_friends)
          ELSE true
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

    CASE
      -- ============================================================
      -- EXPLORE (forYou) — full algorithm
      -- ============================================================
      WHEN p_tab = 'forYou' THEN (
        -- Freshness: exponential decay
        EXP(-0.05 * scored.hours_age) * 0.25

        -- Engagement velocity: engagement per hour
        + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.25

        -- Engagement rate: engagement / views (when impressions exist)
        + LN(1.0 + scored.weighted_engagement / scored.views) / 3.0 * 0.10

        -- Absolute engagement: lets older viral content resurface
        + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.15

        -- Following boost
        + CASE WHEN scored.is_following THEN 0.15 ELSE 0.0 END

        -- Seeded randomness
        + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10

        -- Cold start bonus: <4 hours old
        + CASE WHEN scored.hours_age < 4.0 THEN 0.20 ELSE 0.0 END
      )

      -- ============================================================
      -- FOLLOWING — light ranking
      -- ============================================================
      WHEN p_tab = 'following' THEN (
        CASE WHEN scored.hours_age < 24.0
          THEN 1.0 - (scored.hours_age / 24.0) * 0.3
          ELSE 0.0
        END
        + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.30
        + EXP(-0.02 * scored.hours_age) * 0.10
      )

      -- ============================================================
      -- DREAMERS — pure reverse-chrono
      -- ============================================================
      WHEN p_tab = 'dreamers' THEN (
        1.0 / (1.0 + scored.hours_age)
      )

      ELSE 0.0
    END AS feed_score

  FROM scored
  ORDER BY feed_score DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

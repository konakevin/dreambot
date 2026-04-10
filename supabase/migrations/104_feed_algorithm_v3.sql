-- Feed Algorithm v3 — Professional-grade overhaul
-- Changes: creator affinity, seen-post penalty, dynamic creator throttle,
-- steeper engagement weights, graduated cold start, wider randomness,
-- smooth following-tab decay (no 24h cliff)

DROP FUNCTION IF EXISTS public.get_feed;

CREATE FUNCTION public.get_feed(
  p_user_id       uuid,
  p_limit         integer DEFAULT 20,
  p_offset        integer DEFAULT 0,
  p_seed          double precision DEFAULT 0.0,
  p_tab           text DEFAULT 'forYou',
  p_cursor_score  double precision DEFAULT NULL,
  p_cursor_id     uuid DEFAULT NULL,
  p_medium        text DEFAULT NULL,
  p_vibe          text DEFAULT NULL
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
    SELECT blocked_id AS uid FROM public.blocked_users WHERE blocker_id = p_user_id
    UNION
    SELECT blocker_id AS uid FROM public.blocked_users WHERE blocked_id = p_user_id
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
  public_users AS (
    SELECT id FROM public.users WHERE is_public = true
  ),

  -- Per-creator affinity: how much has this user engaged with each creator?
  user_affinity AS (
    SELECT
      up2.user_id AS creator_id,
      LN(1.0 + (
        COUNT(DISTINCT l.id) * 1.0
        + COUNT(DISTINCT c.id) * 3.0
        + COUNT(DISTINCT fav.id) * 2.0
      )) / LN(1.0 + 50.0) AS affinity
    FROM public.uploads up2
    LEFT JOIN public.likes l ON l.upload_id = up2.id AND l.user_id = p_user_id
    LEFT JOIN public.comments c ON c.upload_id = up2.id AND c.user_id = p_user_id
    LEFT JOIN public.favorites fav ON fav.upload_id = up2.id AND fav.user_id = p_user_id
    WHERE l.id IS NOT NULL OR c.id IS NOT NULL OR fav.id IS NOT NULL
    GROUP BY up2.user_id
  ),

  scored AS (
    SELECT
      up.id, up.user_id, up.image_url,
      up.width, up.height, up.caption, up.created_at,
      u.username, u.avatar_url,
      up.comment_count, up.like_count, up.fuse_count,
      up.ai_prompt, up.ai_concept, up.bot_message,
      up.dream_medium, up.dream_vibe,

      -- Steeper engagement weights: comments 8x, fuses 10x, shares 5x, saves 3x
      (up.like_count + up.comment_count * 8 + up.fuse_count * 10
       + up.share_count * 5 + up.save_count * 3)::float AS weighted_engagement,

      GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.1) AS hours_age,

      CASE WHEN uf.following_id IS NOT NULL THEN true ELSE false END AS is_following,

      -- View count floor at 1 (not 10) for accurate engagement rate on new posts
      GREATEST(up.view_count, 1)::float AS views,

      -- How many times this user has seen this post
      COALESCE(pi.view_count, 0) AS user_view_count,

      -- Creator affinity (0.0-1.0)
      COALESCE(ua.affinity, 0.0) AS affinity

    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    LEFT JOIN public.post_impressions pi ON pi.upload_id = up.id AND pi.user_id = p_user_id
    LEFT JOIN user_affinity ua ON ua.creator_id = up.user_id
    WHERE up.is_active = true
      AND up.user_id != p_user_id
      AND (up.is_moderated = false OR up.is_approved = true)
      AND up.user_id NOT IN (SELECT uid FROM user_blocks)
      AND up.id NOT IN (SELECT upload_id FROM user_reports)
      AND (
        up.user_id IN (SELECT id FROM public_users)
        OR up.user_id IN (SELECT friend_id FROM user_friends)
      )
      AND (
        CASE
          WHEN p_tab = 'following' THEN up.user_id IN (SELECT following_id FROM user_follows)
          WHEN p_tab = 'dreamers' THEN up.user_id IN (SELECT friend_id FROM user_friends)
          ELSE true
        END
      )
      AND (p_medium IS NULL OR up.dream_medium = p_medium)
      AND (p_vibe IS NULL OR up.dream_vibe = p_vibe)
  ),

  final_scored AS (
    SELECT
      scored.*,
      CASE
        -- ═══ forYou: full multi-factor algorithm ═══
        WHEN p_tab = 'forYou' THEN (
          -- Freshness: 12h half-life
          EXP(-0.058 * scored.hours_age) * 0.20

          -- Engagement velocity (primary signal): engagement per hour
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.25

          -- Engagement rate: engagement per viewer
          + LN(1.0 + scored.weighted_engagement / scored.views) / 3.0 * 0.10

          -- Absolute engagement
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.10

          -- Following boost + affinity: friends get up to 0.30
          + CASE WHEN scored.is_following
              THEN 0.15 + scored.affinity * 0.15
              ELSE 0.0
            END

          -- Non-following affinity: past engagement still matters
          + CASE WHEN NOT scored.is_following
              THEN scored.affinity * 0.08
              ELSE 0.0
            END

          -- Seeded randomness: wider band (0.15)
          + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.15

          -- Cold start: graduated bonus
          + CASE
              WHEN scored.hours_age < 1.0 THEN 0.25
              WHEN scored.hours_age < 4.0 THEN 0.15
              WHEN scored.hours_age < 8.0 THEN 0.05
              ELSE 0.0
            END
        )
        -- Seen-post penalty (multiplicative)
        * CASE
            WHEN scored.user_view_count = 0 THEN 1.0
            WHEN scored.user_view_count = 1 THEN 0.6
            ELSE 0.35
          END

        -- ═══ following: smooth decay, affinity-driven ═══
        WHEN p_tab = 'following' THEN (
          -- Smooth 18h half-life (no 24h cliff)
          EXP(-0.039 * scored.hours_age) * 0.30

          -- Engagement
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.25

          -- Affinity: people you interact with most rise to top
          + scored.affinity * 0.20

          -- Engagement velocity
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.15

          -- Light randomness
          + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
        )
        -- Gentler seen penalty for following tab
        * CASE
            WHEN scored.user_view_count = 0 THEN 1.0
            WHEN scored.user_view_count = 1 THEN 0.75
            ELSE 0.50
          END

        -- ═══ dreamers: mostly chronological with light engagement ═══
        WHEN p_tab = 'dreamers' THEN (
          1.0 / (1.0 + scored.hours_age * 0.1)
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 500.0) * 0.05
        )
        * CASE WHEN scored.user_view_count > 0 THEN 0.7 ELSE 1.0 END

        ELSE 0.0
      END AS computed_score
    FROM scored
  ),

  -- Count distinct creators for dynamic throttle
  creator_pool AS (
    SELECT COUNT(DISTINCT fs.user_id) AS cnt
    FROM final_scored fs
    WHERE
      (p_cursor_score IS NULL OR p_cursor_id IS NULL)
      OR (fs.computed_score < p_cursor_score)
      OR (fs.computed_score = p_cursor_score AND fs.id < p_cursor_id)
  ),

  -- Dynamic creator throttle: max posts per creator adapts to pool size
  throttled AS (
    SELECT
      fs.*,
      ROW_NUMBER() OVER (
        PARTITION BY fs.user_id
        ORDER BY fs.computed_score DESC
      ) AS creator_rank
    FROM final_scored fs
    WHERE
      (p_cursor_score IS NULL OR p_cursor_id IS NULL)
      OR (fs.computed_score < p_cursor_score)
      OR (fs.computed_score = p_cursor_score AND fs.id < p_cursor_id)
  )

  SELECT
    throttled.id, throttled.user_id, throttled.image_url,
    throttled.width, throttled.height, throttled.caption, throttled.created_at,
    throttled.username, throttled.avatar_url,
    throttled.comment_count, throttled.like_count, throttled.fuse_count,
    throttled.ai_prompt, throttled.ai_concept, throttled.bot_message,
    throttled.dream_medium, throttled.dream_vibe,
    throttled.computed_score AS feed_score
  FROM throttled
  WHERE throttled.creator_rank <= GREATEST(1, p_limit / GREATEST((SELECT cnt FROM creator_pool), 1))
  ORDER BY throttled.computed_score DESC, throttled.id DESC
  LIMIT p_limit;
$$;

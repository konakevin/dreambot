-- Phase 3: Cursor-based pagination for consistent infinite scroll.
-- Uses feed_score + id as composite cursor. New posts don't shift existing results.

DROP FUNCTION IF EXISTS public.get_feed;

CREATE FUNCTION public.get_feed(
  p_user_id     uuid,
  p_limit       integer DEFAULT 20,
  p_offset      integer DEFAULT 0,
  p_seed        double precision DEFAULT 0.0,
  p_tab         text DEFAULT 'forYou',
  p_cursor_score double precision DEFAULT NULL,
  p_cursor_id   uuid DEFAULT NULL
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

      (up.like_count + up.comment_count * 2 + up.fuse_count * 3
       + up.share_count * 2 + up.save_count * 1.5)::float AS weighted_engagement,

      GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.1) AS hours_age,

      CASE WHEN uf.following_id IS NOT NULL THEN true ELSE false END AS is_following,

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
  ),
  final_scored AS (
    SELECT
      scored.*,
      CASE
        WHEN p_tab = 'forYou' THEN (
          EXP(-0.05 * scored.hours_age) * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.views) / 3.0 * 0.10
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.15
          + CASE WHEN scored.is_following THEN 0.15 ELSE 0.0 END
          + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
          + CASE WHEN scored.hours_age < 4.0 THEN 0.20 ELSE 0.0 END
        )
        WHEN p_tab = 'following' THEN (
          CASE WHEN scored.hours_age < 24.0
            THEN 1.0 - (scored.hours_age / 24.0) * 0.3
            ELSE 0.0
          END
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.30
          + EXP(-0.02 * scored.hours_age) * 0.10
        )
        WHEN p_tab = 'dreamers' THEN (
          1.0 / (1.0 + scored.hours_age)
        )
        ELSE 0.0
      END AS computed_score
    FROM scored
  )
  SELECT
    final_scored.id, final_scored.user_id, final_scored.image_url,
    final_scored.width, final_scored.height, final_scored.caption, final_scored.created_at,
    final_scored.username, final_scored.avatar_url,
    final_scored.comment_count, final_scored.like_count, final_scored.fuse_count,
    final_scored.ai_prompt, final_scored.ai_concept, final_scored.bot_message,
    final_scored.dream_medium, final_scored.dream_vibe,
    final_scored.computed_score AS feed_score
  FROM final_scored
  WHERE
    -- Cursor filter: only return rows AFTER the cursor position
    -- When no cursor, return from the beginning
    (p_cursor_score IS NULL OR p_cursor_id IS NULL)
    OR (final_scored.computed_score < p_cursor_score)
    OR (final_scored.computed_score = p_cursor_score AND final_scored.id < p_cursor_id)
  ORDER BY final_scored.computed_score DESC, final_scored.id DESC
  LIMIT p_limit;
$$;

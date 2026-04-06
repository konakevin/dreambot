-- Add dream_medium and dream_vibe to get_feed RPC output

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
    up.comment_count, up.like_count, up.twin_count, up.fuse_count,
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

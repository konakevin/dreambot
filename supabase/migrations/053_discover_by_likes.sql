-- Migration 053: Discover dreamers by shared likes (replaces vote-based suggestions)
-- New users with no likes get popular accounts as fallback.

DROP FUNCTION IF EXISTS public.get_vibe_suggestions(uuid, integer);

CREATE FUNCTION public.get_vibe_suggestions(p_user_id uuid, p_limit integer DEFAULT 20)
RETURNS TABLE(
  user_id       uuid,
  username      text,
  avatar_url    text,
  user_rank     text,
  vibe_score    integer,
  shared_count  integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH my_likes AS (
    SELECT upload_id FROM favorites WHERE user_id = p_user_id
  ),
  my_like_count AS (
    SELECT COUNT(*) AS cnt FROM my_likes
  ),
  -- Users who liked the same posts as me
  overlap AS (
    SELECT
      f.user_id AS other_id,
      COUNT(*)::integer AS shared,
      SUM(CASE WHEN f.upload_id IN (SELECT upload_id FROM my_likes) THEN 1 ELSE 0 END)::integer AS agreed
    FROM favorites f
    WHERE f.user_id != p_user_id
      AND f.upload_id IN (SELECT upload_id FROM my_likes)
      AND NOT EXISTS (
        SELECT 1 FROM friendships fr
        WHERE fr.user_a = LEAST(p_user_id, f.user_id)
          AND fr.user_b = GREATEST(p_user_id, f.user_id)
      )
    GROUP BY f.user_id
    HAVING COUNT(*) >= 2
  ),
  -- Fallback: popular accounts (most posts) for new users with few likes
  popular AS (
    SELECT
      u.id AS other_id,
      u.username,
      u.avatar_url,
      NULL::text AS user_rank,
      0 AS vibe_score,
      0 AS shared_count
    FROM users u
    WHERE u.id != p_user_id
      AND NOT EXISTS (
        SELECT 1 FROM friendships fr
        WHERE fr.user_a = LEAST(p_user_id, u.id)
          AND fr.user_b = GREATEST(p_user_id, u.id)
      )
    ORDER BY (SELECT COUNT(*) FROM uploads WHERE user_id = u.id AND is_active = true) DESC
    LIMIT p_limit
  )
  -- If user has enough likes, use overlap; otherwise fall back to popular
  SELECT
    u.id AS user_id,
    u.username,
    u.avatar_url,
    NULL::text AS user_rank,
    (o.agreed * 100 / o.shared)::integer AS vibe_score,
    o.shared AS shared_count
  FROM overlap o
  JOIN users u ON u.id = o.other_id
  WHERE (SELECT cnt FROM my_like_count) >= 3
  ORDER BY (o.agreed::float / o.shared) DESC, o.shared DESC
  LIMIT p_limit

  UNION ALL

  SELECT user_id, username, avatar_url, user_rank, vibe_score, shared_count
  FROM popular
  WHERE (SELECT cnt FROM my_like_count) < 3
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_vibe_suggestions(uuid, integer) TO authenticated;

-- Migration 055: Fix ALL RPCs that reference dropped user_rank column
-- Audit found 3 broken RPCs after migration 051 dropped user_rank

-- 1. get_vibe_suggestions — already recreated in 053 but still references user_rank in return type
DROP FUNCTION IF EXISTS public.get_vibe_suggestions(uuid, integer);

CREATE FUNCTION public.get_vibe_suggestions(p_user_id uuid, p_limit integer DEFAULT 20)
RETURNS TABLE(
  user_id       uuid,
  username      text,
  avatar_url    text,
  vibe_score    integer,
  shared_count  integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  like_count integer;
BEGIN
  SELECT COUNT(*) INTO like_count FROM favorites WHERE favorites.user_id = p_user_id;

  IF like_count >= 3 THEN
    RETURN QUERY
    SELECT
      u.id AS user_id,
      u.username,
      u.avatar_url,
      (COUNT(*)::integer * 100 / GREATEST(like_count, 1))::integer AS vibe_score,
      COUNT(*)::integer AS shared_count
    FROM favorites f
    JOIN users u ON u.id = f.user_id
    WHERE f.upload_id IN (SELECT fav.upload_id FROM favorites fav WHERE fav.user_id = p_user_id)
      AND f.user_id != p_user_id
      AND NOT EXISTS (
        SELECT 1 FROM friendships fr
        WHERE fr.user_a = LEAST(p_user_id, f.user_id)
          AND fr.user_b = GREATEST(p_user_id, f.user_id)
      )
    GROUP BY u.id, u.username, u.avatar_url
    HAVING COUNT(*) >= 2
    ORDER BY COUNT(*) DESC
    LIMIT p_limit;
  ELSE
    RETURN QUERY
    SELECT
      u.id AS user_id,
      u.username,
      u.avatar_url,
      0::integer AS vibe_score,
      0::integer AS shared_count
    FROM users u
    WHERE u.id != p_user_id
      AND NOT EXISTS (
        SELECT 1 FROM friendships fr
        WHERE fr.user_a = LEAST(p_user_id, u.id)
          AND fr.user_b = GREATEST(p_user_id, u.id)
      )
      AND EXISTS (SELECT 1 FROM uploads WHERE uploads.user_id = u.id AND is_active = true)
    ORDER BY (SELECT COUNT(*) FROM uploads WHERE uploads.user_id = u.id AND is_active = true) DESC
    LIMIT p_limit;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_vibe_suggestions(uuid, integer) TO authenticated;

-- 2. get_pending_requests
DROP FUNCTION IF EXISTS public.get_pending_requests(uuid);

CREATE FUNCTION public.get_pending_requests(p_user_id uuid)
RETURNS TABLE(
  requester_id  uuid,
  username      text,
  avatar_url    text,
  requested_at  timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT
    fs.requester AS requester_id,
    u.username,
    u.avatar_url,
    fs.created_at AS requested_at
  FROM friendships fs
  JOIN users u ON u.id = fs.requester
  WHERE fs.status = 'pending'
    AND (
      (fs.user_a = p_user_id AND fs.requester = fs.user_b)
      OR (fs.user_b = p_user_id AND fs.requester = fs.user_a)
    )
  ORDER BY fs.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_pending_requests(uuid) TO authenticated;

-- 3. get_comments
DROP FUNCTION IF EXISTS public.get_comments(uuid, integer, integer);

CREATE FUNCTION public.get_comments(
  p_upload_id uuid,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id          uuid,
  user_id     uuid,
  username    text,
  avatar_url  text,
  body        text,
  parent_id   uuid,
  created_at  timestamptz,
  like_count  integer,
  reply_count integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT
    c.id, c.user_id, u.username, u.avatar_url,
    c.body, c.parent_id, c.created_at,
    COALESCE(c.like_count, 0) AS like_count,
    (SELECT COUNT(*)::integer FROM comments r WHERE r.parent_id = c.id) AS reply_count
  FROM comments c
  JOIN users u ON u.id = c.user_id
  WHERE c.upload_id = p_upload_id
    AND c.parent_id IS NULL
  ORDER BY c.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

GRANT EXECUTE ON FUNCTION public.get_comments(uuid, integer, integer) TO authenticated;

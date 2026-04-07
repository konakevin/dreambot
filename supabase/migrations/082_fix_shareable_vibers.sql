-- Migration 082: Fix get_shareable_vibers — remove RadOrBad columns
--
-- The old version referenced shared_votes, agreed_votes (dropped),
-- and user_rank (dropped). Simplified to just order by share interaction count.

DROP FUNCTION IF EXISTS public.get_shareable_vibers(uuid);

CREATE FUNCTION public.get_shareable_vibers(p_user_id uuid)
RETURNS TABLE(
  user_id         uuid,
  username        text,
  avatar_url      text,
  interaction_count bigint,
  vibe_score      integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    u.id AS user_id,
    u.username,
    u.avatar_url,
    (
      SELECT COUNT(*)
      FROM post_shares ps
      WHERE (ps.sender_id = p_user_id AND ps.receiver_id = u.id)
         OR (ps.sender_id = u.id AND ps.receiver_id = p_user_id)
    ) AS interaction_count,
    0::integer AS vibe_score
  FROM friendships f
  JOIN users u
    ON u.id = CASE
      WHEN f.user_a = p_user_id THEN f.user_b
      ELSE f.user_a
    END
  WHERE (f.user_a = p_user_id OR f.user_b = p_user_id)
    AND f.status = 'accepted'
  ORDER BY interaction_count DESC, u.username ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_shareable_vibers(uuid) TO authenticated;

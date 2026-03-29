-- Migration 037: Ordered vibers list for the share sheet
--
-- Returns accepted friends ordered by interaction count (shares sent/received)
-- then by similarity score. Used by the share post modal.

DROP FUNCTION IF EXISTS public.get_shareable_vibers(uuid);

CREATE FUNCTION public.get_shareable_vibers(p_user_id uuid)
RETURNS TABLE(
  user_id         uuid,
  username        text,
  avatar_url      text,
  user_rank       text,
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
    u.user_rank,
    -- Count shares in both directions
    (
      SELECT COUNT(*)
      FROM post_shares ps
      WHERE (ps.sender_id = p_user_id AND ps.receiver_id = u.id)
         OR (ps.sender_id = u.id AND ps.receiver_id = p_user_id)
    ) AS interaction_count,
    -- Similarity score from friendship counters
    CASE
      WHEN f.shared_votes >= 5
      THEN (f.agreed_votes * 100 / f.shared_votes)
      ELSE 0
    END::integer AS vibe_score
  FROM friendships f
  JOIN users u
    ON u.id = CASE
      WHEN f.user_a = p_user_id THEN f.user_b
      ELSE f.user_a
    END
  WHERE (f.user_a = p_user_id OR f.user_b = p_user_id)
    AND f.status = 'accepted'
  ORDER BY interaction_count DESC, vibe_score DESC, u.username ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_shareable_vibers(uuid) TO authenticated;

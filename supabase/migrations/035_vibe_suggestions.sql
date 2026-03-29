-- Migration 035: Vibe suggestions — discover users with similar taste
--
-- On-demand RPC that ranks non-viber users by vote agreement %.
-- Requires at least 5 shared votes to surface. Returns top N matches.

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
  WITH my_votes AS (
    SELECT upload_id, vote
    FROM votes
    WHERE voter_id = p_user_id
  ),
  overlap AS (
    SELECT
      v.voter_id,
      COUNT(*)::integer AS shared,
      SUM(CASE WHEN v.vote = mv.vote THEN 1 ELSE 0 END)::integer AS agreed
    FROM votes v
    JOIN my_votes mv ON mv.upload_id = v.upload_id
    WHERE v.voter_id != p_user_id
      -- Exclude any existing friendship (pending or accepted)
      AND NOT EXISTS (
        SELECT 1 FROM friendships f
        WHERE f.user_a = LEAST(p_user_id, v.voter_id)
          AND f.user_b = GREATEST(p_user_id, v.voter_id)
      )
    GROUP BY v.voter_id
    HAVING COUNT(*) >= 5
  )
  SELECT
    u.id AS user_id,
    u.username,
    u.avatar_url,
    u.user_rank,
    (o.agreed * 100 / o.shared)::integer AS vibe_score,
    o.shared AS shared_count
  FROM overlap o
  JOIN users u ON u.id = o.voter_id
  ORDER BY (o.agreed::float / o.shared) DESC, o.shared DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_vibe_suggestions(uuid, integer) TO authenticated;

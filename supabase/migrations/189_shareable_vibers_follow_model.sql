-- ============================================================
-- 189 — get_shareable_vibers: move off the dead friendships table
-- ============================================================
-- The share-to-a-viber picker still queried `friendships`, which has had no
-- writers since migration 116 killed friend-requests for the pure-follow
-- ("Instagram") model — so the list was stale/shrinking. Rewrite it to the
-- follow model.
--
-- Semantics: "vibers" = MUTUAL FOLLOWS (you follow them AND they follow you) —
-- the faithful replacement for the old mutual-accepted friendship (both parties
-- opted in, the right bar for "I can send this person a dream"). Ordering +
-- interaction-count (shares between you) + bidirectional block filter preserved.
-- Signature is unchanged, so useShareableVibers + generated types need no change.
-- ============================================================

DROP FUNCTION IF EXISTS public.get_shareable_vibers(uuid);
CREATE FUNCTION public.get_shareable_vibers(p_user_id uuid)
RETURNS TABLE(
  user_id uuid, username text, avatar_url text, interaction_count bigint, vibe_score integer
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT
    u.id AS user_id, u.username, u.avatar_url,
    COALESCE(sc.cnt, 0) AS interaction_count, 0::integer AS vibe_score
  FROM public.follows f_out                              -- p_user_id -> them
  JOIN public.follows f_in                               -- them -> p_user_id (mutual)
    ON f_in.follower_id = f_out.following_id
   AND f_in.following_id = p_user_id
  JOIN public.users u ON u.id = f_out.following_id
  LEFT JOIN (
    SELECT
      CASE WHEN ps.sender_id = p_user_id THEN ps.receiver_id ELSE ps.sender_id END AS friend_id,
      COUNT(*) AS cnt
    FROM public.post_shares ps
    WHERE ps.sender_id = p_user_id OR ps.receiver_id = p_user_id
    GROUP BY 1
  ) sc ON sc.friend_id = u.id
  WHERE f_out.follower_id = p_user_id
    AND NOT public.block_exists(p_user_id, u.id)
  ORDER BY interaction_count DESC, u.username ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_shareable_vibers(uuid) TO authenticated, service_role;

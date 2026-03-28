-- Migration 026: Following Feed RPC
--
-- Returns posts uploaded by people the user follows, that the user hasn't voted on.
-- Same return shape as get_feed.

CREATE FUNCTION public.get_following_feed(p_user_id uuid, p_limit integer DEFAULT 50)
RETURNS TABLE(
  id            uuid,
  user_id       uuid,
  categories    text[],
  image_url     text,
  media_type    text,
  thumbnail_url text,
  width         integer,
  height        integer,
  caption       text,
  created_at    timestamptz,
  total_votes   integer,
  rad_votes     integer,
  bad_votes     integer,
  username      text,
  user_rank     text,
  avatar_url    text,
  feed_score    double precision
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    up.id,
    up.user_id,
    up.categories,
    up.image_url,
    up.media_type,
    up.thumbnail_url,
    up.width,
    up.height,
    up.caption,
    up.created_at,
    up.total_votes,
    up.rad_votes,
    up.bad_votes,
    u.username,
    u.user_rank,
    u.avatar_url,
    0.0 AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  JOIN public.follows f ON f.following_id = up.user_id AND f.follower_id = p_user_id
  LEFT JOIN public.votes my_vote
    ON my_vote.upload_id = up.id
    AND my_vote.voter_id = p_user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND my_vote.id IS NULL
  ORDER BY up.created_at DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_following_feed(uuid, integer) TO authenticated;

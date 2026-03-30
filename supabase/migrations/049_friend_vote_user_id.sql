-- Migration 049: Add user_id to friend_votes JSON in get_friends_feed
-- Needed so streak avatar balls can navigate to the friend's profile

DROP FUNCTION IF EXISTS public.get_friends_feed(uuid, integer);

CREATE FUNCTION public.get_friends_feed(p_user_id uuid, p_limit integer DEFAULT 50)
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
  feed_score    double precision,
  friend_votes  jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    up.id, up.user_id, up.categories, up.image_url, up.media_type,
    up.thumbnail_url, up.width, up.height, up.caption, up.created_at,
    up.total_votes, up.rad_votes, up.bad_votes,
    u.username, u.user_rank, u.avatar_url,
    0.0 AS feed_score,
    json_agg(
      json_build_object(
        'user_id', friend.id,
        'username', friend.username,
        'avatar_url', friend.avatar_url,
        'user_rank', friend.user_rank,
        'vote', friend_vote.vote::text,
        'rad_streak', COALESCE(vs.rad_streak, 0),
        'bad_streak', COALESCE(vs.bad_streak, 0)
      )
    )::jsonb AS friend_votes
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  JOIN public.votes friend_vote ON friend_vote.upload_id = up.id
  JOIN public.users friend ON friend.id = friend_vote.voter_id
  JOIN public.friendships fs
    ON fs.user_a = LEAST(p_user_id, friend_vote.voter_id)
    AND fs.user_b = GREATEST(p_user_id, friend_vote.voter_id)
    AND fs.status = 'accepted'
  LEFT JOIN public.vote_streaks vs
    ON vs.user_a = LEAST(p_user_id, friend_vote.voter_id)
    AND vs.user_b = GREATEST(p_user_id, friend_vote.voter_id)
  LEFT JOIN public.votes my_vote
    ON my_vote.upload_id = up.id AND my_vote.voter_id = p_user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND friend_vote.vote IN ('rad', 'bad')
    AND friend_vote.voter_id != p_user_id
    AND my_vote.id IS NULL
  GROUP BY up.id, up.user_id, up.categories, up.image_url, up.media_type,
           up.thumbnail_url, up.width, up.height, up.caption, up.created_at,
           up.total_votes, up.rad_votes, up.bad_votes, u.username, u.user_rank, u.avatar_url
  ORDER BY up.created_at DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_friends_feed(uuid, integer) TO authenticated;

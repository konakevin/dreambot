-- Migration 027: Update friends feed to include friend votes as JSON
--
-- Replaces get_friends_feed with a version that returns a friend_votes
-- JSON array showing which mutual follows voted and how.
-- Uses GROUP BY + json_agg instead of DISTINCT ON — more efficient.

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
    0.0 AS feed_score,
    json_agg(
      json_build_object(
        'username', friend.username,
        'avatar_url', friend.avatar_url,
        'user_rank', friend.user_rank,
        'vote', friend_vote.vote::text
      )
    )::jsonb AS friend_votes
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  -- Mutual follow's vote on this post
  JOIN public.votes friend_vote ON friend_vote.upload_id = up.id
  JOIN public.users friend ON friend.id = friend_vote.voter_id
  -- The voter follows me
  JOIN public.follows f1
    ON f1.follower_id = friend_vote.voter_id
    AND f1.following_id = p_user_id
  -- I follow the voter (mutual)
  JOIN public.follows f2
    ON f2.follower_id = p_user_id
    AND f2.following_id = friend_vote.voter_id
  -- I haven't voted on this post
  LEFT JOIN public.votes my_vote
    ON my_vote.upload_id = up.id
    AND my_vote.voter_id = p_user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND friend_vote.vote IN ('rad', 'bad')
    AND my_vote.id IS NULL
  GROUP BY up.id, up.user_id, up.categories, up.image_url, up.media_type,
           up.thumbnail_url, up.width, up.height, up.caption, up.created_at,
           up.total_votes, up.rad_votes, up.bad_votes, u.username, u.user_rank, u.avatar_url
  ORDER BY up.created_at DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_friends_feed(uuid, integer) TO authenticated;

-- Migration 033: Add session seed to get_feed for shuffle-on-refresh
--
-- The noise component was deterministic per (user, post), so refreshing
-- always returned the same ordering.  Adding p_seed mixes a client-side
-- random float into the hash, giving a fresh shuffle on every pull-to-refresh
-- while keeping order stable within a single session.

DROP FUNCTION IF EXISTS public.get_feed(uuid, integer);
DROP FUNCTION IF EXISTS public.get_feed(uuid, integer, double precision);

CREATE FUNCTION public.get_feed(
  p_user_id uuid,
  p_limit   integer DEFAULT 50,
  p_seed    double precision DEFAULT 0.0
)
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
SECURITY DEFINER
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
    (
      -- QUALITY 30%: Wilson confidence score
      COALESCE(up.wilson_score, 0.5) * 0.30
      -- FRESHNESS 25%: Gravity decay
      + (
          1.0 / POWER(
            GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0) + 2.0,
            1.8
          ) / 0.2871
        ) * 0.25
      -- ENGAGEMENT 20%: Log-scaled votes
      + (LN(1.0 + up.total_votes) / LN(1.0 + 1000000.0)) * 0.20
      -- SOCIAL 15%: Following bonus
      + CASE WHEN follows.following_id IS NOT NULL THEN 0.15 ELSE 0.0 END
      -- NOISE 10%: Seed-based shuffle (changes on refresh, stable within session)
      + ((ABS(HASHTEXT(p_user_id::text || up.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
    ) AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  LEFT JOIN public.follows follows
    ON follows.follower_id  = p_user_id
    AND follows.following_id = up.user_id
  LEFT JOIN public.votes v
    ON v.upload_id = up.id
    AND v.voter_id = p_user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND v.upload_id IS NULL
  ORDER BY feed_score DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, double precision) TO authenticated;

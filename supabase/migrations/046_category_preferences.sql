-- Migration 046: User category preferences for feed filtering

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferred_categories text[] DEFAULT NULL;
-- NULL = all categories (default), empty array = nothing, array = only those

-- Update get_feed to filter by preferred categories
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
  comment_count integer,
  feed_score    double precision
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  WITH user_prefs AS (
    SELECT preferred_categories FROM users WHERE id = p_user_id
  )
  SELECT
    up.id, up.user_id, up.categories, up.image_url, up.media_type,
    up.thumbnail_url, up.width, up.height, up.caption, up.created_at,
    up.total_votes, up.rad_votes, up.bad_votes,
    u.username, u.user_rank, u.avatar_url,
    up.comment_count,
    (
      COALESCE(up.wilson_score, 0.5) * 0.30
      + (1.0 / POWER(GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0) + 2.0, 1.8) / 0.2871) * 0.25
      + (LN(1.0 + up.total_votes) / LN(1.0 + 1000000.0)) * 0.20
      + CASE WHEN follows.following_id IS NOT NULL THEN 0.15 ELSE 0.0 END
      + ((ABS(HASHTEXT(p_user_id::text || up.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
    ) AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  LEFT JOIN public.follows follows ON follows.follower_id = p_user_id AND follows.following_id = up.user_id
  LEFT JOIN public.votes v ON v.upload_id = up.id AND v.voter_id = p_user_id
  CROSS JOIN user_prefs
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND v.upload_id IS NULL
    -- Filter by preferred categories (NULL = show all)
    AND (user_prefs.preferred_categories IS NULL OR up.categories && user_prefs.preferred_categories)
  ORDER BY feed_score DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, double precision) TO authenticated;

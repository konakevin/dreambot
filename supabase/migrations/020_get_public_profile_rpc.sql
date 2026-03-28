-- Migration 020: get_public_profile RPC
--
-- Replaces 4 separate Supabase queries in usePublicProfile with a single
-- server-side function call. All counts are computed in one round trip.

CREATE OR REPLACE FUNCTION public.get_public_profile(p_user_id uuid)
RETURNS TABLE (
  id             uuid,
  username       text,
  user_rank      text,
  rad_score      float,
  post_count     bigint,
  follower_count bigint,
  following_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT
    u.id,
    u.username,
    u.user_rank,
    u.rad_score,
    (
      SELECT COUNT(*)
      FROM public.uploads up
      WHERE up.user_id = u.id
        AND up.is_active = true
    ) AS post_count,
    (
      SELECT COUNT(*)
      FROM public.follows f
      WHERE f.following_id = u.id
    ) AS follower_count,
    (
      SELECT COUNT(*)
      FROM public.follows f
      WHERE f.follower_id = u.id
    ) AS following_count
  FROM public.users u
  WHERE u.id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;

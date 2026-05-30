-- 210: extend get_public_profile to return users.created_at.
--
-- Profile layout takes an X-style nudge — a "📅 Joined May 2026" chip
-- beneath the bio. Needs the user's account creation date, which the
-- existing RPC (migration 207) doesn't return.
--
-- Body is identical to 207's, plus the new `created_at` column.

BEGIN;

DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE FUNCTION public.get_public_profile(p_user_id uuid)
RETURNS TABLE (
  id              uuid,
  username        text,
  display_name    text,
  bio             text,
  avatar_url      text,
  is_public       boolean,
  created_at      timestamptz,
  post_count      bigint,
  follower_count  bigint,
  following_count bigint,
  is_following    boolean,
  has_request     boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    u.id,
    u.username,
    u.display_name,
    u.bio,
    u.avatar_url,
    u.is_public,
    u.created_at,
    (SELECT COUNT(*) FROM public.uploads up
     WHERE up.user_id = u.id AND up.is_public = true) AS post_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.following_id = u.id) AS follower_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.follower_id = u.id) AS following_count,
    EXISTS (
      SELECT 1 FROM public.follows
      WHERE follower_id = auth.uid() AND following_id = u.id
    ) AS is_following,
    EXISTS (
      SELECT 1 FROM public.follow_requests
      WHERE requester_id = auth.uid() AND target_id = u.id
    ) AS has_request
  FROM public.users u
  WHERE u.id = p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = p_user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = p_user_id)
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated, anon;

COMMIT;

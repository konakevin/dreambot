-- 326_block_aware_profile_counts.sql (2026-07-05)
--
-- Off-by-one follower/following counts vs the visible lists (Kevin repro:
-- "kev" showed follower_count 3 while the viewer — who had blocked one of the
-- followers — saw a 2-row list). The users-table RLS hides blocked users
-- (either direction) from the follower/following LIST joins, but
-- get_public_profile counted RAW follows rows, so the header count and the
-- list disagreed for any viewer with a block among them.
--
-- Fix: counts become VIEWER-RELATIVE — a follows row is excluded when the
-- counted counterpart user is blocked either direction relative to
-- auth.uid(). Anonymous callers (auth.uid() IS NULL) see full counts, same
-- as before. Same DROP/CREATE pattern as 210 (RETURNS TABLE change-free).

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
    (SELECT COUNT(*) FROM public.follows f
     WHERE f.following_id = u.id
       AND NOT EXISTS (
         SELECT 1 FROM public.blocked_users b
         WHERE (b.blocker_id = auth.uid() AND b.blocked_id = f.follower_id)
            OR (b.blocker_id = f.follower_id AND b.blocked_id = auth.uid())
       )) AS follower_count,
    (SELECT COUNT(*) FROM public.follows f
     WHERE f.follower_id = u.id
       AND NOT EXISTS (
         SELECT 1 FROM public.blocked_users b
         WHERE (b.blocker_id = auth.uid() AND b.blocked_id = f.following_id)
            OR (b.blocker_id = f.following_id AND b.blocked_id = auth.uid())
       )) AS following_count,
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

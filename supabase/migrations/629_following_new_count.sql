-- 629: the Following tab's new-post count. Kevin 2026-09-30: "a little number indicator on the # of new posts in a
-- users 'Following' tab whenever they load the app"; bots count like any account ("a follower is a follower"); it
-- clears "when the user taps the following tab (views the following tab)".
--
-- users.last_following_view_at: when this user last opened Following. Existing rows start at the moment this runs,
-- so nobody's first launch shows a backlog; new signups get now() by default. Deliberately NOT granted to clients
-- (users uses column grants, mig 278): the two functions below are its only readers and writers.
--
-- get_following_new_count(): posts from accounts the caller follows (bots included), posted since that moment, under
-- the Following feed's own filters (get_feed, mig 488: public, posted, not the caller's own, moderation, blocks either
-- way, not reported by the caller), so every post the number counts is in the feed when they open it. Reposts are
-- not counted. Capped at 10: the app shows "9+", and the cap keeps the read to a short range scan of
-- idx_uploads_is_public (user_id, posted_at DESC) per followed account.
-- mark_following_viewed(): stamps now().
--
-- Both act on auth.uid() only and take no user id, so nobody can read or reset another user's count.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS last_following_view_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.get_following_new_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT count(*)::int FROM (
    SELECT 1
    FROM public.follows f
    JOIN public.uploads up ON up.user_id = f.following_id
    WHERE f.follower_id = auth.uid()
      AND up.is_public = true
      AND up.posted_at > (SELECT u.last_following_view_at FROM public.users u WHERE u.id = auth.uid())
      AND up.user_id <> auth.uid()
      AND (up.is_moderated = false OR up.is_approved = true)
      AND NOT EXISTS (
        SELECT 1 FROM public.blocked_users b
        WHERE (b.blocker_id = auth.uid() AND b.blocked_id = up.user_id)
           OR (b.blocker_id = up.user_id AND b.blocked_id = auth.uid())
      )
      AND NOT EXISTS (
        SELECT 1 FROM public.reports r WHERE r.reporter_id = auth.uid() AND r.upload_id = up.id
      )
    LIMIT 10
  ) s;
$$;

CREATE OR REPLACE FUNCTION public.mark_following_viewed()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE public.users SET last_following_view_at = now() WHERE id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_following_new_count() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mark_following_viewed() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_following_new_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_following_viewed() TO authenticated;

-- 575_get_my_like_ids.sql — the signed-in user's liked post ids in ONE response. 2026-09-28.
--
-- The heart on a feed card is red when the post is in the client's likeIds set (hooks/useLikeIds.ts).
-- That set was read from `likes` 1,000 rows at a time (PostgREST's max-rows cap), so a heavy liker
-- (Kevin: ~5,600 likes) needed ~6 sequential round trips, and the first Home card rendered before it
-- landed: the heart showed empty, then filled red half a second later. A single row carrying a uuid[]
-- is not subject to the 1,000-row cap, so this returns the whole set in one round trip.
--
-- SECURITY INVOKER: likes are readable by signed-in users (RLS), and the function only ever reads the
-- caller's own rows (auth.uid()). New functions are server-only by default since migration 567, so the
-- client grant is explicit.

CREATE OR REPLACE FUNCTION public.get_my_like_ids()
RETURNS uuid[]
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT coalesce(array_agg(l.upload_id), '{}'::uuid[])
  FROM public.likes l
  WHERE l.user_id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_my_like_ids() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_like_ids() TO authenticated, service_role;

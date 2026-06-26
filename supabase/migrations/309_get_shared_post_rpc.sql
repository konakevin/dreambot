-- 309: get_shared_post(id) — view a single post by its (unguessable UUID) id,
-- even when the post is PRIVATE (uploads.is_public = false). 2026-06-24.
--
-- Enables "share a private dream by link": the share sheet produces
-- https://dreambotapp.com/post/<id>, and anyone with that link can view the
-- post on the web share page even though it is not in the public feed. The post
-- id is a v4 UUID (122 bits) — knowing it IS the access grant (the "unlisted"
-- model, like an unlisted video / "anyone with the link" doc).
--
-- SECURITY DEFINER so it bypasses the uploads RLS (which requires is_public =
-- true). It is anon-callable (the web share page uses the anon key). Guards keep
-- it safe:
--   • author account must be public (users.is_public = true) — a fully-private
--     account or a decommissioned bot does NOT leak posts via link. (Relax this
--     line if account-private users should also be able to share single posts.)
--   • not moderation-removed (is_moderated = false OR is_approved = true)
--   • respects blocks in BOTH directions (null-safe: anon viewer = no block ctx)
--   • must be a real posted dream (posted_at IS NOT NULL)
-- It intentionally does NOT require uploads.is_public = true — that's the point.

CREATE OR REPLACE FUNCTION public.get_shared_post(p_id uuid)
RETURNS TABLE (
  id         uuid,
  user_id    uuid,
  image_url  text,
  like_count integer,
  username   text,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    up.id,
    up.user_id,
    up.image_url,
    up.like_count,
    us.username,
    us.avatar_url
  FROM public.uploads up
  JOIN public.users us ON us.id = up.user_id
  WHERE up.id = p_id
    AND up.posted_at IS NOT NULL
    AND (up.is_moderated = false OR up.is_approved = true)
    AND us.is_public = true
    AND NOT EXISTS (
      SELECT 1
      FROM public.blocked_users b
      WHERE (b.blocker_id = up.user_id AND b.blocked_id = auth.uid())
         OR (b.blocker_id = auth.uid()  AND b.blocked_id = up.user_id)
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_post(uuid) TO anon, authenticated;

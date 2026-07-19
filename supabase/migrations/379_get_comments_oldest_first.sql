-- 379: top-level comments show OLDEST first (ascending), matching replies.
--
-- get_comments ordered `created_at DESC` (newest at top); get_replies already
-- orders `created_at ASC`. Kevin 2026-07-19: comments + replies should both read
-- oldest → newest, top to bottom. This flips ONLY the top-level order to ASC so
-- the two threads are consistent. get_replies is already correct (migration 317),
-- left untouched.
--
-- Body is reproduced verbatim from migration 317 with the single ORDER BY change.
-- Return shape is UNCHANGED → no types regen needed. CREATE OR REPLACE (identical
-- signature + return type) preserves the existing grants, so no re-GRANT needed.
--
-- Client side (paired commit): the overlay's optimistic insert + merge now APPEND
-- new comments at the bottom (newest last) and scroll-to-end after posting, so a
-- just-posted comment lands at the bottom of the ascending thread.
--
-- Apply in the Supabase dashboard SQL editor. Re-runnable.

CREATE OR REPLACE FUNCTION public.get_comments(
  p_upload_id uuid,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid, user_id uuid, username text, avatar_url text, body text,
  parent_id uuid, created_at timestamptz, like_count integer, reply_count integer
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT
    c.id, c.user_id, u.username, u.avatar_url,
    c.body, c.parent_id, c.created_at,
    COALESCE(c.like_count, 0) AS like_count,
    (SELECT COUNT(*)::integer FROM public.comments r WHERE r.parent_id = c.id) AS reply_count
  FROM public.comments c
  JOIN public.users u ON u.id = c.user_id
  WHERE c.upload_id = p_upload_id
    AND c.parent_id IS NULL
    AND NOT public.block_exists(auth.uid(), c.user_id)
    AND NOT EXISTS (
      SELECT 1 FROM public.reports r
      WHERE r.comment_id = c.id AND r.reporter_id = auth.uid()
    )
  ORDER BY c.created_at ASC
  LIMIT p_limit OFFSET p_offset;
$$;

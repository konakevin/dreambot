-- 436: restore `is_liked` to get_comments (per-viewer "have I liked this comment").
--
-- BUG (reported 2026-08-18): open a post you commented on in a PRIOR session →
-- the comment you liked shows the correct like_count (e.g. "1") but the heart is
-- NOT highlighted, as if you hadn't liked it. Tapping the heart then flashes
-- liked → unliked and won't stick.
--
-- ROOT CAUSE: get_comments stopped returning `is_liked`. Migration 187 returned
-- it; migration 317 ("hide reported comments") rewrote get_comments and SILENTLY
-- DROPPED the is_liked column from both the RETURNS TABLE and the SELECT — while
-- its own header claimed "Return shape of get_comments is UNCHANGED". Migration
-- 379 (oldest-first order) then copied 317's body forward verbatim, carrying the
-- regression to the live function. get_replies kept is_liked, which is why REPLIES
-- reflect like-state correctly but top-level comments never do.
--
-- The client always mapped `row.is_liked` (hooks/useComments.ts) — with the column
-- absent it read `undefined` → false → empty heart on every load. And because the
-- like toggle keys off that false state (hooks/useToggleCommentLike.ts), tapping
-- runs the INSERT branch, hits the comment_likes UNIQUE(user_id, comment_id)
-- constraint (the like already exists), errors, and the optimistic update reverts
-- → the "flash then un-highlight" symptom. This ONE fix resolves both.
--
-- Body reproduced verbatim from migration 379 (the live version: oldest-first
-- ORDER BY c.created_at ASC + the block + report filters) with is_liked re-added,
-- mirroring how get_replies computes it. RETURNS shape CHANGES (adds is_liked) →
-- DROP FUNCTION first (CREATE OR REPLACE can't change the return type: 42P13), and
-- re-GRANT after (DROP wipes grants). Regenerate types/database.ts after applying.
--
-- Apply in the Supabase dashboard SQL editor. Re-runnable.

DROP FUNCTION IF EXISTS public.get_comments(uuid, integer, integer);
CREATE FUNCTION public.get_comments(
  p_upload_id uuid,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid, user_id uuid, username text, avatar_url text, body text,
  parent_id uuid, created_at timestamptz, like_count integer, reply_count integer,
  is_liked boolean
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT
    c.id, c.user_id, u.username, u.avatar_url,
    c.body, c.parent_id, c.created_at,
    COALESCE(c.like_count, 0) AS like_count,
    (SELECT COUNT(*)::integer FROM public.comments r WHERE r.parent_id = c.id) AS reply_count,
    EXISTS (
      SELECT 1 FROM public.comment_likes cl
      WHERE cl.comment_id = c.id AND cl.user_id = auth.uid()
    ) AS is_liked
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

-- restore grants (DROP wipes them)
GRANT EXECUTE ON FUNCTION public.get_comments(uuid, integer, integer) TO authenticated, service_role;

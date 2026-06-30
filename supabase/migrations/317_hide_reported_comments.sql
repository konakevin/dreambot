-- 317_hide_reported_comments.sql
-- App Store 1.2 parity: a comment a user REPORTED should disappear from that
-- reporter's view and stay gone on refetch — exactly how get_feed already hides
-- a post the user reported. The client also removes it from cache immediately
-- (lib/reportContent.ts); this is the durable, server-side half.
--
-- Adds one per-reporter exclusion to get_comments AND get_replies:
--   AND NOT EXISTS (reports row by this viewer for this comment)
--
-- get_comments is reproduced verbatim from migration 187 (verified against the
-- LIVE function's column set) plus the one filter line.
--
-- get_replies is ALSO REWRITTEN here because the live version (migration 039) is
-- BROKEN: it still selects u.user_rank, a column dropped in migration 051, so
-- every call errors ("column u.user_rank does not exist") and replies never load
-- in the app. The corrected body mirrors get_comments (drops user_rank, keeps the
-- is_liked the client maps, adds the same block + report filters).
--
-- Return shape of get_comments is UNCHANGED (no types regen needed). get_replies'
-- shape changes (user_rank removed) → regenerate types/database.ts after applying.

-- Supporting index so the per-comment NOT EXISTS isn't a seq scan on reports.
CREATE INDEX IF NOT EXISTS idx_reports_comment_reporter
  ON public.reports (reporter_id, comment_id)
  WHERE comment_id IS NOT NULL;

-- ── get_comments — hide blocked users + comments the viewer reported ─────────
DROP FUNCTION IF EXISTS public.get_comments(uuid, integer, integer);
CREATE FUNCTION public.get_comments(
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
  ORDER BY c.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ── get_replies — fixed (drop user_rank) + same block + report filters ───────
DROP FUNCTION IF EXISTS public.get_replies(uuid, integer);
CREATE FUNCTION public.get_replies(
  p_comment_id uuid,
  p_limit integer DEFAULT 50
)
RETURNS TABLE(
  id uuid, user_id uuid, username text, avatar_url text, body text,
  parent_id uuid, created_at timestamptz, like_count integer, is_liked boolean
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT
    c.id, c.user_id, u.username, u.avatar_url, c.body, c.parent_id, c.created_at,
    COALESCE(c.like_count, 0) AS like_count,
    EXISTS (
      SELECT 1 FROM public.comment_likes cl
      WHERE cl.comment_id = c.id AND cl.user_id = auth.uid()
    ) AS is_liked
  FROM public.comments c
  JOIN public.users u ON u.id = c.user_id
  WHERE c.parent_id = p_comment_id
    AND NOT public.block_exists(auth.uid(), c.user_id)
    AND NOT EXISTS (
      SELECT 1 FROM public.reports r
      WHERE r.comment_id = c.id AND r.reporter_id = auth.uid()
    )
  ORDER BY c.created_at ASC
  LIMIT p_limit;
$$;

-- restore grants (DROP wipes them)
GRANT EXECUTE ON FUNCTION public.get_comments(uuid, integer, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_replies(uuid, integer) TO authenticated, service_role;

-- ============================================================
-- 186 — Blocking, Phase 1: write-layer enforcement
-- ============================================================
-- Hard-block model: if A blocks B, NEITHER can interact with the other.
-- Today blocking only hides feed + profiles (get_feed 175, get_public_profile
-- 116) and severs follows (block_user 116). Comments, likes, favorites, shares,
-- and re-follows still leak through. This migration stops the *blocked* party
-- from interacting at the WRITE layer — which also prevents the notifications
-- those interactions would spawn (no comment/like => no notification).
--
-- Implemented as RESTRICTIVE policies: they are AND-ed with the existing
-- permissive policies, so we don't need to know/rename current policy names,
-- and we can't accidentally widen access. service_role has BYPASSRLS, so bot
-- posting / Edge Functions are unaffected.
-- ============================================================

-- Shared helper: true if EITHER user has blocked the other (bidirectional).
-- SECURITY DEFINER so it can read blocked_users regardless of caller RLS.
CREATE OR REPLACE FUNCTION public.block_exists(a uuid, b uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = a AND blocked_id = b)
       OR (blocker_id = b AND blocked_id = a)
  );
$$;

REVOKE ALL ON FUNCTION public.block_exists(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.block_exists(uuid, uuid) TO authenticated, service_role;

-- ── COMMENTS ────────────────────────────────────────────────
-- Can't comment on a post whose owner is in a block relationship with you.
DROP POLICY IF EXISTS "no_comment_when_blocked" ON public.comments;
CREATE POLICY "no_comment_when_blocked"
  ON public.comments AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    NOT public.block_exists(
      auth.uid(),
      (SELECT user_id FROM public.uploads WHERE id = upload_id)
    )
  );

-- ── LIKES ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "no_like_when_blocked" ON public.likes;
CREATE POLICY "no_like_when_blocked"
  ON public.likes AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    NOT public.block_exists(
      auth.uid(),
      (SELECT user_id FROM public.uploads WHERE id = upload_id)
    )
  );

-- ── FAVORITES ───────────────────────────────────────────────
DROP POLICY IF EXISTS "no_favorite_when_blocked" ON public.favorites;
CREATE POLICY "no_favorite_when_blocked"
  ON public.favorites AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    NOT public.block_exists(
      auth.uid(),
      (SELECT user_id FROM public.uploads WHERE id = upload_id)
    )
  );

-- ── POST_SHARES ─────────────────────────────────────────────
-- Can't share a dream TO (or as) someone in a block relationship.
DROP POLICY IF EXISTS "no_share_when_blocked" ON public.post_shares;
CREATE POLICY "no_share_when_blocked"
  ON public.post_shares AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    NOT public.block_exists(auth.uid(), receiver_id)
  );

-- ── FOLLOWS ─────────────────────────────────────────────────
-- block_user (116) already severs existing follows; this prevents a NEW
-- follow being inserted while a block is in place (either direction).
DROP POLICY IF EXISTS "no_follow_when_blocked" ON public.follows;
CREATE POLICY "no_follow_when_blocked"
  ON public.follows AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    NOT public.block_exists(auth.uid(), following_id)
  );

-- follow_requests too — a blocked user shouldn't be able to request to follow.
DROP POLICY IF EXISTS "no_follow_request_when_blocked" ON public.follow_requests;
CREATE POLICY "no_follow_request_when_blocked"
  ON public.follow_requests AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    NOT public.block_exists(auth.uid(), target_id)
  );

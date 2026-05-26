-- ============================================================
-- 187 — Blocking, Phase 2: read-layer filters (defense-in-depth)
-- ============================================================
-- Phase 1 (186) stops blocked users from creating new interactions. This
-- phase hides any PRE-EXISTING rows (interactions from before a block) on the
-- read side, and keeps blocked users out of the share picker. Bidirectional:
-- if either party blocked the other, the content is hidden.
--
-- Each function below is the current definition (get_comments 055, get_inbox
-- 038, get_notifications 039, get_shareable_vibers 084) reproduced verbatim,
-- fully schema-qualified with a locked search_path, plus ONE block-filter line.
-- ============================================================

-- ── get_comments — hide comments from blocked users ─────────
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
  ORDER BY c.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ── get_notifications — hide notifications from blocked actors ─
DROP FUNCTION IF EXISTS public.get_notifications(uuid, integer, integer);
CREATE FUNCTION public.get_notifications(p_user_id uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
RETURNS TABLE(
  id uuid, actor_id uuid, actor_username text, actor_avatar_url text, type text,
  upload_id uuid, comment_id uuid, body text, image_url text, thumbnail_url text,
  created_at timestamptz, is_seen boolean
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT
    n.id, n.actor_id, u.username AS actor_username, u.avatar_url AS actor_avatar_url,
    n.type, n.upload_id, n.comment_id, n.body, up.image_url, up.thumbnail_url,
    n.created_at, (n.seen_at IS NOT NULL) AS is_seen
  FROM public.notifications n
  JOIN public.users u ON u.id = n.actor_id
  LEFT JOIN public.uploads up ON up.id = n.upload_id
  WHERE n.recipient_id = p_user_id
    AND NOT public.block_exists(p_user_id, n.actor_id)
  ORDER BY n.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- NOTE: get_inbox (the legacy share-inbox RPC, 038) is intentionally NOT
-- redefined here — it's dead code (no app caller; received shares surface as
-- 'share' notifications via get_notifications, already filtered above) and has
-- been broken since migration 051 dropped users.user_rank. Leaving it untouched.

-- ── get_shareable_vibers — keep blocked users out of the share picker ─
-- NOTE: still reads the legacy `friendships` table (dead since migration 116's
-- Instagram refactor — see project note). Block-filtered here; the
-- friendships->follows rewrite is a separate product decision, flagged to Kevin.
DROP FUNCTION IF EXISTS public.get_shareable_vibers(uuid);
CREATE FUNCTION public.get_shareable_vibers(p_user_id uuid)
RETURNS TABLE(
  user_id uuid, username text, avatar_url text, interaction_count bigint, vibe_score integer
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT
    u.id AS user_id, u.username, u.avatar_url,
    COALESCE(sc.cnt, 0) AS interaction_count, 0::integer AS vibe_score
  FROM public.friendships f
  JOIN public.users u
    ON u.id = CASE WHEN f.user_a = p_user_id THEN f.user_b ELSE f.user_a END
  LEFT JOIN (
    SELECT
      CASE WHEN ps.sender_id = p_user_id THEN ps.receiver_id ELSE ps.sender_id END AS friend_id,
      COUNT(*) AS cnt
    FROM public.post_shares ps
    WHERE ps.sender_id = p_user_id OR ps.receiver_id = p_user_id
    GROUP BY 1
  ) sc ON sc.friend_id = u.id
  WHERE (f.user_a = p_user_id OR f.user_b = p_user_id)
    AND f.status = 'accepted'
    AND NOT public.block_exists(p_user_id, u.id)
  ORDER BY interaction_count DESC, u.username ASC;
$$;

-- restore grants (DROP wipes them)
GRANT EXECUTE ON FUNCTION public.get_comments(uuid, integer, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_notifications(uuid, integer, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_shareable_vibers(uuid) TO authenticated, service_role;

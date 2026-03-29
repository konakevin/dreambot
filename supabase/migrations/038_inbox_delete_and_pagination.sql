-- Migration 038: Inbox delete policy + paginated inbox RPC

-- ── 1. Delete policy ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can delete their shares" ON post_shares;
CREATE POLICY "Users can delete their shares"
  ON post_shares FOR DELETE
  USING (receiver_id = auth.uid());

-- ── 2. Paginated inbox RPC (replaces non-paginated version) ─────────────────

DROP FUNCTION IF EXISTS public.get_inbox(uuid, integer);
DROP FUNCTION IF EXISTS public.get_inbox(uuid, integer, integer);

CREATE FUNCTION public.get_inbox(p_user_id uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
RETURNS TABLE(
  share_id          uuid,
  sender_id         uuid,
  sender_username   text,
  sender_avatar_url text,
  upload_id         uuid,
  image_url         text,
  media_type        text,
  thumbnail_url     text,
  width             integer,
  height            integer,
  caption           text,
  categories        text[],
  post_user_id      uuid,
  post_username     text,
  post_avatar_url   text,
  post_user_rank    text,
  total_votes       integer,
  rad_votes         integer,
  bad_votes         integer,
  post_created_at   timestamptz,
  shared_at         timestamptz,
  is_seen           boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    ps.id AS share_id,
    ps.sender_id,
    sender.username AS sender_username,
    sender.avatar_url AS sender_avatar_url,
    up.id AS upload_id,
    up.image_url,
    up.media_type,
    up.thumbnail_url,
    up.width,
    up.height,
    up.caption,
    up.categories,
    up.user_id AS post_user_id,
    poster.username AS post_username,
    poster.avatar_url AS post_avatar_url,
    poster.user_rank AS post_user_rank,
    up.total_votes,
    up.rad_votes,
    up.bad_votes,
    up.created_at AS post_created_at,
    ps.created_at AS shared_at,
    (ps.seen_at IS NOT NULL) AS is_seen
  FROM post_shares ps
  JOIN users sender ON sender.id = ps.sender_id
  JOIN uploads up ON up.id = ps.upload_id
  JOIN users poster ON poster.id = up.user_id
  WHERE ps.receiver_id = p_user_id
    AND up.is_active = true
  ORDER BY ps.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

GRANT EXECUTE ON FUNCTION public.get_inbox(uuid, integer, integer) TO authenticated;

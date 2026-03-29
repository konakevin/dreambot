-- Migration 036: Post sharing — send posts to vibers
--
-- One-way shares with no chat. Sender picks vibers, they get an inbox item.
-- Tapping an inbox item loads the post into the Explore feed deck.

-- ── 1. Table ────────────────────────────────────────────────────────────────

CREATE TABLE public.post_shares (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  upload_id   uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  seen_at     timestamptz
);

CREATE INDEX idx_post_shares_receiver ON post_shares(receiver_id, created_at DESC);
CREATE INDEX idx_post_shares_unread ON post_shares(receiver_id) WHERE seen_at IS NULL;

-- ── 2. RLS ──────────────────────────────────────────────────────────────────

ALTER TABLE post_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shares sent to them"
  ON post_shares FOR SELECT
  USING (receiver_id = auth.uid());

CREATE POLICY "Users can send shares"
  ON post_shares FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can mark their shares as seen"
  ON post_shares FOR UPDATE
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- ── 3. Inbox RPC — returns full post data for display + deck injection ──────

DROP FUNCTION IF EXISTS public.get_inbox(uuid, integer);

CREATE FUNCTION public.get_inbox(p_user_id uuid, p_limit integer DEFAULT 50)
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
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_inbox(uuid, integer) TO authenticated;

-- ── 4. Unread count RPC ─────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS public.get_unread_share_count(uuid);

CREATE FUNCTION public.get_unread_share_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM post_shares
  WHERE receiver_id = p_user_id
    AND seen_at IS NULL;
$$;

GRANT EXECUTE ON FUNCTION public.get_unread_share_count(uuid) TO authenticated;

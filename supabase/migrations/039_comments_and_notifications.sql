-- Migration 039: Comments system + unified notifications
--
-- Two-level comments (top-level + replies, no deeper).
-- Unified notifications table replaces post_shares as inbox source.
-- Triggers handle denormalized counts and notification creation.

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. COMMENTS TABLE
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS comment_count integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id   uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id   uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 500),
  like_count  integer NOT NULL DEFAULT 0,
  reply_count integer NOT NULL DEFAULT 0,
  is_deleted  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_upload ON comments(upload_id, created_at DESC) WHERE parent_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id, created_at ASC) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id, created_at DESC);

-- Enforce max 2 levels: parent_id must reference a top-level comment
CREATE OR REPLACE FUNCTION enforce_comment_depth()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM comments WHERE id = NEW.parent_id AND parent_id IS NOT NULL) THEN
      RAISE EXCEPTION 'Replies to replies are not allowed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_comment_depth ON comments;
CREATE TRIGGER trg_enforce_comment_depth
  BEFORE INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION enforce_comment_depth();

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. COMMENT LIKES TABLE
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.comment_likes (
  user_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  comment_id uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, comment_id)
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. DENORMALIZED COUNT TRIGGERS
-- ══════════════════════════════════════════════════════════════════════════════

-- 3a. Like count on comments
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET like_count = like_count - 1 WHERE id = OLD.comment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_comment_like_count ON comment_likes;
CREATE TRIGGER trg_comment_like_count
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_like_count();

-- 3b. Reply count on parent comment + comment count on uploads
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment upload comment count
    UPDATE uploads SET comment_count = comment_count + 1 WHERE id = NEW.upload_id;
    -- Increment parent reply count (if reply)
    IF NEW.parent_id IS NOT NULL THEN
      UPDATE comments SET reply_count = reply_count + 1 WHERE id = NEW.parent_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE uploads SET comment_count = comment_count - 1 WHERE id = OLD.upload_id;
    IF OLD.parent_id IS NOT NULL THEN
      UPDATE comments SET reply_count = reply_count - 1 WHERE id = OLD.parent_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_comment_counts ON comments;
CREATE TRIGGER trg_comment_counts
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_counts();

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. NOTIFICATIONS TABLE
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  actor_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type         text NOT NULL CHECK (type IN ('post_comment', 'comment_reply', 'comment_mention', 'post_share')),
  upload_id    uuid REFERENCES public.uploads(id) ON DELETE CASCADE,
  comment_id   uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  body         text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  seen_at      timestamptz
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_id) WHERE seen_at IS NULL;

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. NOTIFICATION TRIGGERS
-- ══════════════════════════════════════════════════════════════════════════════

-- 5a. Comment on a post → notify post owner
-- 5b. Reply to a comment → notify comment owner
-- 5c. @mention in comment → notify mentioned users
CREATE OR REPLACE FUNCTION create_comment_notifications()
RETURNS TRIGGER AS $$
DECLARE
  v_post_owner_id uuid;
  v_parent_owner_id uuid;
  v_mentioned_username text;
  v_mentioned_user_id uuid;
  v_body_preview text;
BEGIN
  v_body_preview := LEFT(NEW.body, 100);

  -- Get post owner
  SELECT user_id INTO v_post_owner_id FROM uploads WHERE id = NEW.upload_id;

  IF NEW.parent_id IS NULL THEN
    -- Top-level comment: notify post owner (unless commenting on own post)
    IF v_post_owner_id IS NOT NULL AND v_post_owner_id != NEW.user_id THEN
      INSERT INTO notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_post_owner_id, NEW.user_id, 'post_comment', NEW.upload_id, NEW.id, v_body_preview);
    END IF;
  ELSE
    -- Reply: notify parent comment owner (unless replying to own comment)
    SELECT user_id INTO v_parent_owner_id FROM comments WHERE id = NEW.parent_id;
    IF v_parent_owner_id IS NOT NULL AND v_parent_owner_id != NEW.user_id THEN
      INSERT INTO notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_parent_owner_id, NEW.user_id, 'comment_reply', NEW.upload_id, NEW.id, v_body_preview);
    END IF;
  END IF;

  -- @mentions: find all @username patterns and notify those users
  FOR v_mentioned_username IN
    SELECT DISTINCT m[1] FROM regexp_matches(NEW.body, '@([a-zA-Z0-9_.]+)', 'g') AS m
  LOOP
    SELECT id INTO v_mentioned_user_id FROM users WHERE username = v_mentioned_username;
    -- Don't notify: self, post owner (already notified), parent owner (already notified)
    IF v_mentioned_user_id IS NOT NULL
       AND v_mentioned_user_id != NEW.user_id
       AND v_mentioned_user_id IS DISTINCT FROM v_post_owner_id
       AND v_mentioned_user_id IS DISTINCT FROM v_parent_owner_id
    THEN
      INSERT INTO notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_mentioned_user_id, NEW.user_id, 'comment_mention', NEW.upload_id, NEW.id, v_body_preview);
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_comment_notifications ON comments;
CREATE TRIGGER trg_comment_notifications
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION create_comment_notifications();

-- 5d. Post share → notification
CREATE OR REPLACE FUNCTION create_share_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (recipient_id, actor_id, type, upload_id, body, created_at)
  VALUES (NEW.receiver_id, NEW.sender_id, 'post_share', NEW.upload_id, NULL, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_share_notification ON post_shares;
CREATE TRIGGER trg_share_notification
  AFTER INSERT ON post_shares
  FOR EACH ROW EXECUTE FUNCTION create_share_notification();

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. BACKFILL: existing post_shares → notifications
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO notifications (recipient_id, actor_id, type, upload_id, created_at, seen_at)
SELECT ps.receiver_id, ps.sender_id, 'post_share', ps.upload_id, ps.created_at, ps.seen_at
FROM post_shares ps
WHERE NOT EXISTS (
  SELECT 1 FROM notifications n
  WHERE n.recipient_id = ps.receiver_id
    AND n.actor_id = ps.sender_id
    AND n.type = 'post_share'
    AND n.upload_id = ps.upload_id
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. RLS POLICIES
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Comments: anyone can read, owner can insert/delete
DROP POLICY IF EXISTS "Anyone can read comments" ON comments;
CREATE POLICY "Anyone can read comments" ON comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert comments" ON comments;
CREATE POLICY "Users can insert comments" ON comments FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments" ON comments FOR UPDATE USING (user_id = auth.uid());

-- Comment likes
DROP POLICY IF EXISTS "Anyone can read comment likes" ON comment_likes;
CREATE POLICY "Anyone can read comment likes" ON comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like comments" ON comment_likes;
CREATE POLICY "Users can like comments" ON comment_likes FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can unlike comments" ON comment_likes;
CREATE POLICY "Users can unlike comments" ON comment_likes FOR DELETE USING (user_id = auth.uid());

-- Notifications
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (recipient_id = auth.uid());

-- ══════════════════════════════════════════════════════════════════════════════
-- 8. RPCS
-- ══════════════════════════════════════════════════════════════════════════════

-- 8a. Get top-level comments for a post (paginated)
DROP FUNCTION IF EXISTS public.get_comments(uuid, integer, integer);

CREATE FUNCTION public.get_comments(p_upload_id uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
RETURNS TABLE(
  id          uuid,
  user_id     uuid,
  username    text,
  avatar_url  text,
  user_rank   text,
  body        text,
  like_count  integer,
  reply_count integer,
  created_at  timestamptz,
  is_liked    boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    c.id, c.user_id, u.username, u.avatar_url, u.user_rank,
    CASE WHEN c.is_deleted THEN '[deleted]' ELSE c.body END AS body,
    c.like_count, c.reply_count, c.created_at,
    EXISTS(SELECT 1 FROM comment_likes cl WHERE cl.comment_id = c.id AND cl.user_id = auth.uid()) AS is_liked
  FROM comments c
  JOIN users u ON u.id = c.user_id
  WHERE c.upload_id = p_upload_id
    AND c.parent_id IS NULL
  ORDER BY c.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

GRANT EXECUTE ON FUNCTION public.get_comments(uuid, integer, integer) TO authenticated;

-- 8b. Get replies for a comment
DROP FUNCTION IF EXISTS public.get_replies(uuid, integer);

CREATE FUNCTION public.get_replies(p_comment_id uuid, p_limit integer DEFAULT 50)
RETURNS TABLE(
  id          uuid,
  user_id     uuid,
  username    text,
  avatar_url  text,
  user_rank   text,
  body        text,
  like_count  integer,
  parent_id   uuid,
  created_at  timestamptz,
  is_liked    boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    c.id, c.user_id, u.username, u.avatar_url, u.user_rank,
    CASE WHEN c.is_deleted THEN '[deleted]' ELSE c.body END AS body,
    c.like_count, c.parent_id, c.created_at,
    EXISTS(SELECT 1 FROM comment_likes cl WHERE cl.comment_id = c.id AND cl.user_id = auth.uid()) AS is_liked
  FROM comments c
  JOIN users u ON u.id = c.user_id
  WHERE c.parent_id = p_comment_id
  ORDER BY c.created_at ASC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_replies(uuid, integer) TO authenticated;

-- 8c. Unified notifications (replaces get_inbox)
DROP FUNCTION IF EXISTS public.get_notifications(uuid, integer, integer);

CREATE FUNCTION public.get_notifications(p_user_id uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
RETURNS TABLE(
  id              uuid,
  actor_id        uuid,
  actor_username  text,
  actor_avatar_url text,
  type            text,
  upload_id       uuid,
  comment_id      uuid,
  body            text,
  image_url       text,
  thumbnail_url   text,
  created_at      timestamptz,
  is_seen         boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    n.id,
    n.actor_id,
    u.username AS actor_username,
    u.avatar_url AS actor_avatar_url,
    n.type,
    n.upload_id,
    n.comment_id,
    n.body,
    up.image_url,
    up.thumbnail_url,
    n.created_at,
    (n.seen_at IS NOT NULL) AS is_seen
  FROM notifications n
  JOIN users u ON u.id = n.actor_id
  LEFT JOIN uploads up ON up.id = n.upload_id
  WHERE n.recipient_id = p_user_id
  ORDER BY n.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

GRANT EXECUTE ON FUNCTION public.get_notifications(uuid, integer, integer) TO authenticated;

-- 8d. Unread notification count (replaces get_unread_share_count)
DROP FUNCTION IF EXISTS public.get_unread_notification_count(uuid);

CREATE FUNCTION public.get_unread_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM notifications
  WHERE recipient_id = p_user_id
    AND seen_at IS NULL;
$$;

GRANT EXECUTE ON FUNCTION public.get_unread_notification_count(uuid) TO authenticated;

-- ══════════════════════════════════════════════════════════════════════════════
-- 9. UPDATE FEED RPCS TO INCLUDE comment_count
-- ══════════════════════════════════════════════════════════════════════════════

-- 9a. get_feed
DROP FUNCTION IF EXISTS public.get_feed(uuid, integer, double precision);

CREATE FUNCTION public.get_feed(
  p_user_id uuid,
  p_limit   integer DEFAULT 50,
  p_seed    double precision DEFAULT 0.0
)
RETURNS TABLE(
  id            uuid,
  user_id       uuid,
  categories    text[],
  image_url     text,
  media_type    text,
  thumbnail_url text,
  width         integer,
  height        integer,
  caption       text,
  created_at    timestamptz,
  total_votes   integer,
  rad_votes     integer,
  bad_votes     integer,
  username      text,
  user_rank     text,
  avatar_url    text,
  comment_count integer,
  feed_score    double precision
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    up.id, up.user_id, up.categories, up.image_url, up.media_type,
    up.thumbnail_url, up.width, up.height, up.caption, up.created_at,
    up.total_votes, up.rad_votes, up.bad_votes,
    u.username, u.user_rank, u.avatar_url,
    up.comment_count,
    (
      COALESCE(up.wilson_score, 0.5) * 0.30
      + (1.0 / POWER(GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0) + 2.0, 1.8) / 0.2871) * 0.25
      + (LN(1.0 + up.total_votes) / LN(1.0 + 1000000.0)) * 0.20
      + CASE WHEN follows.following_id IS NOT NULL THEN 0.15 ELSE 0.0 END
      + ((ABS(HASHTEXT(p_user_id::text || up.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
    ) AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  LEFT JOIN public.follows follows ON follows.follower_id = p_user_id AND follows.following_id = up.user_id
  LEFT JOIN public.votes v ON v.upload_id = up.id AND v.voter_id = p_user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND v.upload_id IS NULL
  ORDER BY feed_score DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, double precision) TO authenticated;

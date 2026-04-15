-- ══════════════════════════════════════════════════════════════════════════════
-- Instagram-Like Privacy & Visibility Refactor
--
-- Replaces the vestigial is_approved/is_moderated/is_active/is_posted system
-- with a clean two-column model: is_public (boolean) + posted_at (timestamptz).
-- Kills friendships — pure Instagram follow model.
-- Rewrites RLS policies to use follows instead of friendships.
-- ══════════════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. Add new columns to uploads
-- ══════════════════════════════════════════════════════════════════════════════

-- is_public: whether this post is shared (true) or private to owner (false)
-- Replaces is_active. Dreams start private (false).
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- posted_at: when the user first made this dream public.
-- NULL = never posted. Non-null = first post timestamp.
-- Used for feed freshness scoring and album UI (post icon vs eye icon).
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS posted_at timestamptz;

-- description: user-written description, entered on New Post screen.
-- Separate from caption (auto-generated from ai_prompt).
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS description text;

-- Indexes for feed queries
CREATE INDEX IF NOT EXISTS idx_uploads_is_public ON public.uploads(user_id, posted_at DESC)
  WHERE is_public = true;

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. Backfill existing data
-- ══════════════════════════════════════════════════════════════════════════════

-- Posts that were is_active=true → public, posted_at = created_at
UPDATE public.uploads
SET is_public = true, posted_at = created_at
WHERE is_active = true AND is_public = false;

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. Rewrite uploads RLS policies — followers instead of friends
-- ══════════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Owner sees own uploads" ON public.uploads;
DROP POLICY IF EXISTS "Public profile active posts visible" ON public.uploads;
DROP POLICY IF EXISTS "Public profile public posts visible" ON public.uploads;
DROP POLICY IF EXISTS "Friends see private profile active posts" ON public.uploads;
DROP POLICY IF EXISTS "Followers see private profile public posts" ON public.uploads;

-- Owner always sees ALL their uploads (dream album)
CREATE POLICY "Owner sees own uploads"
  ON public.uploads FOR SELECT
  USING (auth.uid() = user_id);

-- Public account + public post → visible to everyone (unless blocked)
CREATE POLICY "Public profile public posts visible"
  ON public.uploads FOR SELECT
  USING (
    is_public = true
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = uploads.user_id AND u.is_public = true
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = uploads.user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = uploads.user_id)
    )
  );

-- Private account + public post → visible only to followers (unless blocked)
CREATE POLICY "Followers see private profile public posts"
  ON public.uploads FOR SELECT
  USING (
    is_public = true
    AND EXISTS (
      SELECT 1 FROM public.follows
      WHERE follower_id = auth.uid() AND following_id = uploads.user_id
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = uploads.user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = uploads.user_id)
    )
  );

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. Rewrite get_feed — followers instead of friends, posted_at freshness
-- ══════════════════════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.get_feed;

CREATE FUNCTION public.get_feed(
  p_user_id       uuid,
  p_limit         integer DEFAULT 20,
  p_offset        integer DEFAULT 0,
  p_seed          double precision DEFAULT 0.0,
  p_tab           text DEFAULT 'forYou',
  p_cursor_score  double precision DEFAULT NULL,
  p_cursor_id     uuid DEFAULT NULL,
  p_medium        text DEFAULT NULL,
  p_vibe          text DEFAULT NULL
)
RETURNS TABLE(
  id            uuid,
  user_id       uuid,
  image_url     text,
  width         integer,
  height        integer,
  caption       text,
  description   text,
  created_at    timestamptz,
  posted_at     timestamptz,
  username      text,
  avatar_url    text,
  comment_count integer,
  like_count    integer,
  fuse_count    integer,
  ai_prompt     text,
  ai_concept    jsonb,
  bot_message   text,
  dream_medium  text,
  dream_vibe    text,
  feed_score    double precision
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  WITH user_blocks AS (
    SELECT blocked_id AS uid FROM public.blocked_users WHERE blocker_id = p_user_id
    UNION
    SELECT blocker_id AS uid FROM public.blocked_users WHERE blocked_id = p_user_id
  ),
  user_reports AS (
    SELECT upload_id FROM public.reports WHERE reporter_id = p_user_id AND upload_id IS NOT NULL
  ),
  user_follows AS (
    SELECT following_id FROM public.follows WHERE follower_id = p_user_id
  ),
  public_users AS (
    SELECT id FROM public.users WHERE is_public = true
  ),
  scored AS (
    SELECT
      up.id, up.user_id, up.image_url,
      up.width, up.height, up.caption, up.description,
      up.created_at, up.posted_at,
      u.username, u.avatar_url,
      up.comment_count, up.like_count, up.fuse_count,
      up.ai_prompt, up.ai_concept, up.bot_message,
      up.dream_medium, up.dream_vibe,

      (up.like_count + up.comment_count * 2 + up.fuse_count * 3
       + up.share_count * 2 + up.save_count * 1.5)::float AS weighted_engagement,

      -- Use posted_at for freshness (when user shared it, not when AI generated it)
      GREATEST(EXTRACT(EPOCH FROM (now() - up.posted_at)) / 3600.0, 0.1) AS hours_age,

      CASE WHEN uf.following_id IS NOT NULL THEN true ELSE false END AS is_following,

      GREATEST(up.view_count, 10)::float AS views

    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    WHERE up.is_public = true
      AND up.posted_at IS NOT NULL
      AND up.user_id != p_user_id
      AND up.user_id NOT IN (SELECT uid FROM user_blocks)
      AND up.id NOT IN (SELECT upload_id FROM user_reports)
      -- Privacy: public profiles visible to all, private profiles visible to followers
      AND (
        up.user_id IN (SELECT id FROM public_users)
        OR up.user_id IN (SELECT following_id FROM user_follows)
      )
      -- Tab-specific filtering
      AND (
        CASE
          WHEN p_tab = 'following' THEN up.user_id IN (SELECT following_id FROM user_follows)
          ELSE true  -- forYou shows all (already filtered by privacy above)
        END
      )
      -- Optional medium/vibe filters
      AND (p_medium IS NULL OR up.dream_medium = p_medium)
      AND (p_vibe IS NULL OR up.dream_vibe = p_vibe)
  ),
  final_scored AS (
    SELECT
      scored.*,
      CASE
        WHEN p_tab = 'forYou' THEN (
          EXP(-0.05 * scored.hours_age) * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.views) / 3.0 * 0.10
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.15
          + CASE WHEN scored.is_following THEN 0.15 ELSE 0.0 END
          + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
          + CASE WHEN scored.hours_age < 4.0 THEN 0.20 ELSE 0.0 END
        )
        WHEN p_tab = 'following' THEN (
          CASE WHEN scored.hours_age < 24.0
            THEN 1.0 - (scored.hours_age / 24.0) * 0.3
            ELSE 0.0
          END
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.30
          + EXP(-0.02 * scored.hours_age) * 0.10
        )
        ELSE 0.0
      END AS computed_score
    FROM scored
  )
  SELECT
    final_scored.id, final_scored.user_id, final_scored.image_url,
    final_scored.width, final_scored.height, final_scored.caption,
    final_scored.description, final_scored.created_at, final_scored.posted_at,
    final_scored.username, final_scored.avatar_url,
    final_scored.comment_count, final_scored.like_count, final_scored.fuse_count,
    final_scored.ai_prompt, final_scored.ai_concept, final_scored.bot_message,
    final_scored.dream_medium, final_scored.dream_vibe,
    final_scored.computed_score AS feed_score
  FROM final_scored
  WHERE
    (p_cursor_score IS NULL OR p_cursor_id IS NULL)
    OR (final_scored.computed_score < p_cursor_score)
    OR (final_scored.computed_score = p_cursor_score AND final_scored.id < p_cursor_id)
  ORDER BY final_scored.computed_score DESC, final_scored.id DESC
  LIMIT p_limit;
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. Rewrite get_public_profile — followers instead of friends, add is_following
-- ══════════════════════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE FUNCTION public.get_public_profile(p_user_id uuid)
RETURNS TABLE (
  id              uuid,
  username        text,
  avatar_url      text,
  is_public       boolean,
  post_count      bigint,
  follower_count  bigint,
  following_count bigint,
  is_following    boolean,
  has_request     boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    u.id, u.username, u.avatar_url, u.is_public,
    (SELECT COUNT(*) FROM public.uploads up
     WHERE up.user_id = u.id AND up.is_public = true) AS post_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.following_id = u.id) AS follower_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.follower_id = u.id) AS following_count,
    EXISTS (
      SELECT 1 FROM public.follows
      WHERE follower_id = auth.uid() AND following_id = u.id
    ) AS is_following,
    EXISTS (
      SELECT 1 FROM public.follow_requests
      WHERE requester_id = auth.uid() AND target_id = u.id
    ) AS has_request
  FROM public.users u
  WHERE u.id = p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = p_user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = p_user_id)
    );
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. Create approve_follow_and_follow_back RPC
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.approve_follow_and_follow_back(p_requester_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Approve: requester follows target (me)
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (p_requester_id, auth.uid())
  ON CONFLICT DO NOTHING;

  -- Follow back: I follow the requester
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (auth.uid(), p_requester_id)
  ON CONFLICT DO NOTHING;

  -- Remove the request
  DELETE FROM public.follow_requests
  WHERE requester_id = p_requester_id AND target_id = auth.uid();

  -- Notify the requester
  INSERT INTO public.notifications (recipient_id, actor_id, type, body)
  VALUES (p_requester_id, auth.uid(), 'follow_accepted', NULL);
END;
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. Rewrite block_user — remove friendship deletion
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.block_user(p_blocked_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert block
  INSERT INTO public.blocked_users (blocker_id, blocked_id)
  VALUES (auth.uid(), p_blocked_id)
  ON CONFLICT DO NOTHING;

  -- Remove follows in both directions
  DELETE FROM public.follows
  WHERE (follower_id = auth.uid() AND following_id = p_blocked_id)
     OR (follower_id = p_blocked_id AND following_id = auth.uid());

  -- Remove follow requests in both directions
  DELETE FROM public.follow_requests
  WHERE (requester_id = auth.uid() AND target_id = p_blocked_id)
     OR (requester_id = p_blocked_id AND target_id = auth.uid());
END;
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- 8. Update freeze trigger — protect new columns, keep old frozen
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.freeze_upload_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Service role bypass
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Frozen columns: client cannot change these
  IF NEW.is_approved      IS DISTINCT FROM OLD.is_approved     THEN NEW.is_approved      := OLD.is_approved;     END IF;
  IF NEW.is_moderated     IS DISTINCT FROM OLD.is_moderated    THEN NEW.is_moderated     := OLD.is_moderated;    END IF;
  IF NEW.user_id          IS DISTINCT FROM OLD.user_id         THEN NEW.user_id          := OLD.user_id;         END IF;
  IF NEW.image_url        IS DISTINCT FROM OLD.image_url       THEN NEW.image_url        := OLD.image_url;       END IF;
  IF NEW.is_ai_generated  IS DISTINCT FROM OLD.is_ai_generated THEN NEW.is_ai_generated  := OLD.is_ai_generated; END IF;
  IF NEW.ai_prompt        IS DISTINCT FROM OLD.ai_prompt       THEN NEW.ai_prompt        := OLD.ai_prompt;       END IF;
  IF NEW.dream_medium     IS DISTINCT FROM OLD.dream_medium    THEN NEW.dream_medium     := OLD.dream_medium;    END IF;
  IF NEW.dream_vibe       IS DISTINCT FROM OLD.dream_vibe      THEN NEW.dream_vibe       := OLD.dream_vibe;      END IF;
  IF NEW.fuse_of          IS DISTINCT FROM OLD.fuse_of         THEN NEW.fuse_of          := OLD.fuse_of;         END IF;
  IF NEW.bot_message      IS DISTINCT FROM OLD.bot_message     THEN NEW.bot_message      := OLD.bot_message;     END IF;
  IF NEW.from_wish        IS DISTINCT FROM OLD.from_wish       THEN NEW.from_wish        := OLD.from_wish;       END IF;

  -- New rule: posted_at can only be set once (first post). Cannot be changed after.
  IF OLD.posted_at IS NOT NULL AND NEW.posted_at IS DISTINCT FROM OLD.posted_at THEN
    NEW.posted_at := OLD.posted_at;
  END IF;

  RETURN NEW;
END;
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- 9. Update notification type constraint — add follow types
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_share',
    'follow_request', 'follow_accepted',
    'friend_request', 'friend_accepted',   -- legacy types for old rows
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'post_like', 'post_fuse', 'post_twin',
    'post_milestone', 'comment'
  ));

-- ══════════════════════════════════════════════════════════════════════════════
-- 10. Drop friendship RPCs and triggers (table kept for rollback safety)
-- ══════════════════════════════════════════════════════════════════════════════

-- Friendship notification trigger
DROP TRIGGER IF EXISTS trg_friendship_notification ON public.friendships;
DROP FUNCTION IF EXISTS public.create_friendship_notification();

-- Friendship freeze trigger
DROP TRIGGER IF EXISTS trg_freeze_friendship_columns ON public.friendships;
DROP FUNCTION IF EXISTS public.freeze_friendship_columns_on_update();

-- Friendship RPCs
DROP FUNCTION IF EXISTS public.send_friend_request(uuid);
DROP FUNCTION IF EXISTS public.respond_friend_request(uuid, boolean);
DROP FUNCTION IF EXISTS public.remove_friend(uuid);
DROP FUNCTION IF EXISTS public.get_friend_ids(uuid);
DROP FUNCTION IF EXISTS public.get_pending_requests(uuid);
DROP FUNCTION IF EXISTS public.get_friend_count(uuid);
DROP FUNCTION IF EXISTS public.are_friends(uuid, uuid);
DROP FUNCTION IF EXISTS public.check_friend_request_rate_limit(uuid);

-- Legacy feed functions that used friendships
DROP FUNCTION IF EXISTS public.get_friends_feed(uuid, integer);
DROP FUNCTION IF EXISTS public.get_friend_votes_on_post(uuid, uuid);
DROP FUNCTION IF EXISTS public.refresh_vote_streaks();
DROP FUNCTION IF EXISTS public.get_top_streaks(uuid);

-- ══════════════════════════════════════════════════════════════════════════════
-- 11. Update finalize_nightly_upload to also set description if provided
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.finalize_nightly_upload(
  p_upload_id uuid,
  p_bot_message text DEFAULT NULL,
  p_from_wish text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  ALTER TABLE public.uploads DISABLE TRIGGER trg_freeze_upload_columns;

  UPDATE public.uploads
  SET bot_message = p_bot_message,
      from_wish = p_from_wish
  WHERE id = p_upload_id;

  ALTER TABLE public.uploads ENABLE TRIGGER trg_freeze_upload_columns;
END;
$$;

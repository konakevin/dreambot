-- Privacy & Visibility Overhaul
-- Adds public/private profiles, bidirectional blocking, privacy-aware feeds.

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. Add is_public to users (default: public, Instagram-style)
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

-- Index for feed queries that filter on public profiles
CREATE INDEX IF NOT EXISTS idx_users_is_public ON public.users(id) WHERE is_public = true;

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. Drop dead visibility column on uploads (never enforced anywhere)
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.uploads DROP COLUMN IF EXISTS visibility;

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. Rewrite uploads RLS policies — privacy + bidirectional blocks
-- ══════════════════════════════════════════════════════════════════════════════

-- Drop all existing SELECT policies on uploads
DROP POLICY IF EXISTS "Approved uploads are viewable by everyone" ON public.uploads;
DROP POLICY IF EXISTS "Users can view their own uploads" ON public.uploads;
DROP POLICY IF EXISTS "Friends can view each others uploads" ON public.uploads;
DROP POLICY IF EXISTS "uploads_select_active" ON public.uploads;
DROP POLICY IF EXISTS "uploads_select_own" ON public.uploads;
DROP POLICY IF EXISTS "uploads_select_friends" ON public.uploads;

-- Owner always sees their own uploads (including My Dreams)
CREATE POLICY "Owner sees own uploads"
  ON public.uploads FOR SELECT
  USING (auth.uid() = user_id);

-- Public profile + active post = visible to everyone (unless blocked)
CREATE POLICY "Public profile active posts visible"
  ON public.uploads FOR SELECT
  USING (
    is_active = true
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

-- Friends see active posts from private profiles (unless blocked)
CREATE POLICY "Friends see private profile active posts"
  ON public.uploads FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.friendships
      WHERE status = 'accepted'
        AND (
          (user_a = auth.uid() AND user_b = uploads.user_id)
          OR (user_b = auth.uid() AND user_a = uploads.user_id)
        )
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = uploads.user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = uploads.user_id)
    )
  );

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. Rewrite users RLS — hide blocked users bidirectionally
-- ══════════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "users_select_all" ON public.users;

CREATE POLICY "Users visible unless blocked"
  ON public.users FOR SELECT
  USING (
    id = auth.uid()
    OR NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = id)
    )
  );

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. Fix blocked_users RLS — bidirectional reads
-- ══════════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Users can manage own blocks" ON public.blocked_users;
DROP POLICY IF EXISTS "blocked_users_select" ON public.blocked_users;
DROP POLICY IF EXISTS "blocked_users_insert" ON public.blocked_users;
DROP POLICY IF EXISTS "blocked_users_delete" ON public.blocked_users;

CREATE POLICY "Users can view blocks involving them"
  ON public.blocked_users FOR SELECT
  USING (blocker_id = auth.uid() OR blocked_id = auth.uid());

CREATE POLICY "Users can insert own blocks"
  ON public.blocked_users FOR INSERT
  WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can delete own blocks"
  ON public.blocked_users FOR DELETE
  USING (blocker_id = auth.uid());

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. block_user RPC — atomically block + remove friendship + remove follows
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.block_user(p_blocked_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_a uuid := LEAST(v_uid, p_blocked_id);
  v_b uuid := GREATEST(v_uid, p_blocked_id);
BEGIN
  -- Insert block
  INSERT INTO public.blocked_users (blocker_id, blocked_id)
  VALUES (v_uid, p_blocked_id)
  ON CONFLICT DO NOTHING;

  -- Remove friendship (if any)
  DELETE FROM public.friendships
  WHERE user_a = v_a AND user_b = v_b;

  -- Remove follows in both directions
  DELETE FROM public.follows
  WHERE (follower_id = v_uid AND following_id = p_blocked_id)
     OR (follower_id = p_blocked_id AND following_id = v_uid);
END;
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. Rewrite get_feed — privacy-aware + bidirectional blocks + medium/vibe filters
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
  created_at    timestamptz,
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
    -- BIDIRECTIONAL: exclude users who blocked us OR we blocked
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
  user_friends AS (
    SELECT CASE WHEN user_a = p_user_id THEN user_b ELSE user_a END AS friend_id
    FROM public.friendships
    WHERE (user_a = p_user_id OR user_b = p_user_id)
      AND status = 'accepted'
  ),
  public_users AS (
    SELECT id FROM public.users WHERE is_public = true
  ),
  scored AS (
    SELECT
      up.id, up.user_id, up.image_url,
      up.width, up.height, up.caption, up.created_at,
      u.username, u.avatar_url,
      up.comment_count, up.like_count, up.fuse_count,
      up.ai_prompt, up.ai_concept, up.bot_message,
      up.dream_medium, up.dream_vibe,

      (up.like_count + up.comment_count * 2 + up.fuse_count * 3
       + up.share_count * 2 + up.save_count * 1.5)::float AS weighted_engagement,

      GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.1) AS hours_age,

      CASE WHEN uf.following_id IS NOT NULL THEN true ELSE false END AS is_following,

      GREATEST(up.view_count, 10)::float AS views

    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    WHERE up.is_active = true
      AND up.user_id != p_user_id
      AND (up.is_moderated = false OR up.is_approved = true)
      AND up.user_id NOT IN (SELECT uid FROM user_blocks)
      AND up.id NOT IN (SELECT upload_id FROM user_reports)
      -- Privacy: public profiles visible to all, private profiles visible to friends only
      AND (
        up.user_id IN (SELECT id FROM public_users)
        OR up.user_id IN (SELECT friend_id FROM user_friends)
      )
      -- Tab-specific filtering
      AND (
        CASE
          WHEN p_tab = 'following' THEN up.user_id IN (SELECT following_id FROM user_follows)
          WHEN p_tab = 'dreamers' THEN up.user_id IN (SELECT friend_id FROM user_friends)
          ELSE true  -- forYou shows all (already filtered by privacy above)
        END
      )
      -- Optional medium/vibe filters (for Explore/Categories screen)
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
        WHEN p_tab = 'dreamers' THEN (
          1.0 / (1.0 + scored.hours_age)
        )
        ELSE 0.0
      END AS computed_score
    FROM scored
  )
  SELECT
    final_scored.id, final_scored.user_id, final_scored.image_url,
    final_scored.width, final_scored.height, final_scored.caption, final_scored.created_at,
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
-- 8. Rewrite get_public_profile — add is_public, bidirectional block, fix post_count
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
  friend_count    bigint
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    u.id, u.username, u.avatar_url, u.is_public,
    (SELECT COUNT(*) FROM public.uploads up
     WHERE up.user_id = u.id AND up.is_posted = true) AS post_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.following_id = u.id) AS follower_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.follower_id = u.id) AS following_count,
    (SELECT COUNT(*) FROM public.friendships fs
     WHERE (fs.user_a = u.id OR fs.user_b = u.id) AND fs.status = 'accepted') AS friend_count
  FROM public.users u
  WHERE u.id = p_user_id
    -- Bidirectional block check: return nothing if blocked
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = p_user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = p_user_id)
    );
$$;

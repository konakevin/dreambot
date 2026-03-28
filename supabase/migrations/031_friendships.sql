-- Migration 031: Friendship System
--
-- Adds explicit friend connections separate from follows.
-- Friends require a request + acceptance. Two-way by design.
-- Replaces "mutual follows" in all streak/social RPCs.
--
-- 1. friendships table
-- 2. Indexes + RLS
-- 3. RPCs: send_friend_request, respond_friend_request, remove_friend,
--          get_friend_ids, get_pending_requests, get_friend_count
-- 4. Rewire existing RPCs to use friendships instead of mutual follows
-- 5. Update get_public_profile with friend_count

-- ── 1. Friendships table ─────────────────────────────────────────────────────

CREATE TABLE public.friendships (
  user_a     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_b     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  requester  uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_a, user_b),
  CHECK (user_a < user_b)
);

-- ── 2. Indexes + RLS ─────────────────────────────────────────────────────────

CREATE INDEX friendships_user_a_status_idx ON public.friendships (user_a, status);
CREATE INDEX friendships_user_b_status_idx ON public.friendships (user_b, status);
CREATE INDEX friendships_pending_idx ON public.friendships (user_b, status) WHERE status = 'pending';

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Users can send friend requests"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = requester);

CREATE POLICY "Users can update friendships they're part of"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Users can delete friendships they're part of"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_a OR auth.uid() = user_b);

-- ── 3. New RPCs ──────────────────────────────────────────────────────────────

-- Send friend request
CREATE OR REPLACE FUNCTION public.send_friend_request(p_target_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_user_a uuid;
  v_user_b uuid;
BEGIN
  IF p_target_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot friend yourself';
  END IF;

  v_user_a := LEAST(auth.uid(), p_target_id);
  v_user_b := GREATEST(auth.uid(), p_target_id);

  INSERT INTO public.friendships (user_a, user_b, status, requester)
  VALUES (v_user_a, v_user_b, 'pending', auth.uid())
  ON CONFLICT (user_a, user_b) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.send_friend_request(uuid) TO authenticated;

-- Respond to friend request (accept or decline)
CREATE OR REPLACE FUNCTION public.respond_friend_request(p_requester_id uuid, p_accept boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_user_a uuid;
  v_user_b uuid;
BEGIN
  v_user_a := LEAST(auth.uid(), p_requester_id);
  v_user_b := GREATEST(auth.uid(), p_requester_id);

  IF p_accept THEN
    -- Accept: update status
    UPDATE public.friendships
    SET status = 'accepted'
    WHERE user_a = v_user_a AND user_b = v_user_b
      AND status = 'pending'
      AND requester = p_requester_id;

    -- Auto-follow both ways
    INSERT INTO public.follows (follower_id, following_id)
    VALUES (auth.uid(), p_requester_id)
    ON CONFLICT (follower_id, following_id) DO NOTHING;

    INSERT INTO public.follows (follower_id, following_id)
    VALUES (p_requester_id, auth.uid())
    ON CONFLICT (follower_id, following_id) DO NOTHING;
  ELSE
    -- Decline: delete the request
    DELETE FROM public.friendships
    WHERE user_a = v_user_a AND user_b = v_user_b
      AND status = 'pending'
      AND requester = p_requester_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.respond_friend_request(uuid, boolean) TO authenticated;

-- Remove friend
CREATE OR REPLACE FUNCTION public.remove_friend(p_friend_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_user_a uuid;
  v_user_b uuid;
BEGIN
  v_user_a := LEAST(auth.uid(), p_friend_id);
  v_user_b := GREATEST(auth.uid(), p_friend_id);

  DELETE FROM public.friendships
  WHERE user_a = v_user_a AND user_b = v_user_b;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_friend(uuid) TO authenticated;

-- Get accepted friend IDs for a user
CREATE OR REPLACE FUNCTION public.get_friend_ids(p_user_id uuid)
RETURNS TABLE(friend_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT CASE WHEN user_a = p_user_id THEN user_b ELSE user_a END AS friend_id
  FROM public.friendships
  WHERE (user_a = p_user_id OR user_b = p_user_id)
    AND status = 'accepted';
$$;

GRANT EXECUTE ON FUNCTION public.get_friend_ids(uuid) TO authenticated;

-- Get pending incoming friend requests
CREATE OR REPLACE FUNCTION public.get_pending_requests(p_user_id uuid)
RETURNS TABLE(
  requester_id  uuid,
  username      text,
  avatar_url    text,
  user_rank     text,
  requested_at  timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT
    f.requester       AS requester_id,
    u.username,
    u.avatar_url,
    u.user_rank,
    f.created_at      AS requested_at
  FROM public.friendships f
  JOIN public.users u ON u.id = f.requester
  WHERE (f.user_a = p_user_id OR f.user_b = p_user_id)
    AND f.requester != p_user_id
    AND f.status = 'pending'
  ORDER BY f.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_pending_requests(uuid) TO authenticated;

-- Get friend count
CREATE OR REPLACE FUNCTION public.get_friend_count(p_user_id uuid)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT COUNT(*)
  FROM public.friendships
  WHERE (user_a = p_user_id OR user_b = p_user_id)
    AND status = 'accepted';
$$;

GRANT EXECUTE ON FUNCTION public.get_friend_count(uuid) TO authenticated;

-- ── 4. Rewire existing RPCs: mutual follows → friendships ────────────────────

-- Helper: check if two users are friends
CREATE OR REPLACE FUNCTION public.are_friends(a uuid, b uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.friendships
    WHERE user_a = LEAST(a, b) AND user_b = GREATEST(a, b)
      AND status = 'accepted'
  );
$$;

-- Rewire get_friends_feed
DROP FUNCTION IF EXISTS public.get_friends_feed(uuid, integer);

CREATE FUNCTION public.get_friends_feed(p_user_id uuid, p_limit integer DEFAULT 50)
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
  feed_score    double precision,
  friend_votes  jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    up.id, up.user_id, up.categories, up.image_url, up.media_type,
    up.thumbnail_url, up.width, up.height, up.caption, up.created_at,
    up.total_votes, up.rad_votes, up.bad_votes,
    u.username, u.user_rank, u.avatar_url,
    0.0 AS feed_score,
    json_agg(
      json_build_object(
        'username', friend.username,
        'avatar_url', friend.avatar_url,
        'user_rank', friend.user_rank,
        'vote', friend_vote.vote::text,
        'streak', COALESCE(vs.current_streak, 0)
      )
    )::jsonb AS friend_votes
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  JOIN public.votes friend_vote ON friend_vote.upload_id = up.id
  JOIN public.users friend ON friend.id = friend_vote.voter_id
  -- Friend check (replaces double-join on follows)
  JOIN public.friendships fs
    ON fs.user_a = LEAST(p_user_id, friend_vote.voter_id)
    AND fs.user_b = GREATEST(p_user_id, friend_vote.voter_id)
    AND fs.status = 'accepted'
  LEFT JOIN public.vote_streaks vs
    ON vs.user_a = LEAST(p_user_id, friend_vote.voter_id)
    AND vs.user_b = GREATEST(p_user_id, friend_vote.voter_id)
  LEFT JOIN public.votes my_vote
    ON my_vote.upload_id = up.id AND my_vote.voter_id = p_user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND friend_vote.vote IN ('rad', 'bad')
    AND friend_vote.voter_id != p_user_id
    AND my_vote.id IS NULL
  GROUP BY up.id, up.user_id, up.categories, up.image_url, up.media_type,
           up.thumbnail_url, up.width, up.height, up.caption, up.created_at,
           up.total_votes, up.rad_votes, up.bad_votes, u.username, u.user_rank, u.avatar_url
  ORDER BY up.created_at DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_friends_feed(uuid, integer) TO authenticated;

-- Rewire get_friend_votes_on_post
DROP FUNCTION IF EXISTS public.get_friend_votes_on_post(uuid, uuid);

CREATE FUNCTION public.get_friend_votes_on_post(p_user_id uuid, p_upload_id uuid)
RETURNS TABLE(
  friend_username text,
  friend_avatar   text,
  friend_rank     text,
  vote            text,
  streak          integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT
    friend.username  AS friend_username,
    friend.avatar_url AS friend_avatar,
    friend.user_rank  AS friend_rank,
    fv.vote::text     AS vote,
    COALESCE(vs.current_streak, 0) AS streak
  FROM public.votes fv
  JOIN public.users friend ON friend.id = fv.voter_id
  JOIN public.friendships fs
    ON fs.user_a = LEAST(p_user_id, fv.voter_id)
    AND fs.user_b = GREATEST(p_user_id, fv.voter_id)
    AND fs.status = 'accepted'
  LEFT JOIN public.vote_streaks vs
    ON vs.user_a = LEAST(p_user_id, fv.voter_id)
    AND vs.user_b = GREATEST(p_user_id, fv.voter_id)
  WHERE fv.upload_id = p_upload_id
    AND fv.voter_id != p_user_id
    AND fv.vote IN ('rad', 'bad');
$$;

GRANT EXECUTE ON FUNCTION public.get_friend_votes_on_post(uuid, uuid) TO authenticated;

-- Rewire refresh_vote_streaks (cron)
DROP FUNCTION IF EXISTS public.refresh_vote_streaks();

CREATE FUNCTION public.refresh_vote_streaks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_watermark     timestamptz;
  v_new_watermark timestamptz;
  rec             RECORD;
BEGIN
  SELECT last_processed_at INTO v_watermark
  FROM public.streak_cron_state WHERE id = 1;

  SELECT MAX(created_at) INTO v_new_watermark
  FROM public.votes
  WHERE created_at > v_watermark;

  IF v_new_watermark IS NULL THEN
    RETURN;
  END IF;

  FOR rec IN
    WITH new_votes AS (
      SELECT v.voter_id, v.upload_id, v.vote::text AS vote, v.created_at
      FROM public.votes v
      WHERE v.created_at > v_watermark
        AND v.vote IN ('rad', 'bad')
    ),
    completed_pairs AS (
      SELECT
        LEAST(nv.voter_id, v2.voter_id)    AS user_a,
        GREATEST(nv.voter_id, v2.voter_id) AS user_b,
        nv.upload_id,
        CASE WHEN nv.vote = v2.vote::text THEN true ELSE false END AS is_match,
        CASE WHEN nv.vote = v2.vote::text THEN nv.vote ELSE NULL END AS match_type,
        GREATEST(nv.created_at, v2.created_at) AS pair_time
      FROM new_votes nv
      JOIN public.votes v2
        ON v2.upload_id = nv.upload_id
        AND v2.voter_id != nv.voter_id
        AND v2.vote IN ('rad', 'bad')
      -- Verify friendship (replaces mutual follow check)
      JOIN public.friendships fs
        ON fs.user_a = LEAST(nv.voter_id, v2.voter_id)
        AND fs.user_b = GREATEST(nv.voter_id, v2.voter_id)
        AND fs.status = 'accepted'
    ),
    deduped AS (
      SELECT DISTINCT ON (user_a, user_b, upload_id)
        user_a, user_b, upload_id, is_match, match_type, pair_time
      FROM completed_pairs
    ),
    ordered AS (
      SELECT *,
        ROW_NUMBER() OVER (PARTITION BY user_a, user_b ORDER BY pair_time ASC) AS rn
      FROM deduped
    )
    SELECT * FROM ordered
    ORDER BY user_a, user_b, rn
  LOOP
    INSERT INTO public.vote_streaks (user_a, user_b, current_streak, best_streak, streak_type, last_upload_id, last_matched_at, updated_at)
    VALUES (
      rec.user_a, rec.user_b,
      CASE WHEN rec.is_match THEN 1 ELSE 0 END,
      CASE WHEN rec.is_match THEN 1 ELSE 0 END,
      rec.match_type, rec.upload_id, rec.pair_time, now()
    )
    ON CONFLICT (user_a, user_b) DO UPDATE SET
      current_streak = CASE
        WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz) THEN
          CASE WHEN rec.is_match THEN vote_streaks.current_streak + 1 ELSE 0 END
        ELSE vote_streaks.current_streak
      END,
      best_streak = GREATEST(
        vote_streaks.best_streak,
        CASE
          WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz) AND rec.is_match
          THEN vote_streaks.current_streak + 1
          ELSE vote_streaks.current_streak
        END
      ),
      streak_type = CASE
        WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz) THEN
          CASE WHEN rec.is_match THEN rec.match_type ELSE NULL END
        ELSE vote_streaks.streak_type
      END,
      last_upload_id = CASE
        WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz)
        THEN rec.upload_id ELSE vote_streaks.last_upload_id
      END,
      last_matched_at = CASE
        WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz)
        THEN rec.pair_time ELSE vote_streaks.last_matched_at
      END,
      updated_at = now();
  END LOOP;

  UPDATE public.streak_cron_state
  SET last_processed_at = v_new_watermark, updated_at = now()
  WHERE id = 1;
END;
$$;

-- Rewire get_top_streaks
DROP FUNCTION IF EXISTS public.get_top_streaks(uuid);

CREATE FUNCTION public.get_top_streaks(p_user_id uuid)
RETURNS TABLE (
  friend_id       uuid,
  friend_username text,
  friend_avatar   text,
  friend_rank     text,
  current_streak  integer,
  best_streak     integer,
  streak_type     text
)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT
    friend.id           AS friend_id,
    friend.username      AS friend_username,
    friend.avatar_url    AS friend_avatar,
    friend.user_rank     AS friend_rank,
    vs.current_streak,
    vs.best_streak,
    vs.streak_type
  FROM public.vote_streaks vs
  JOIN public.users friend
    ON friend.id = CASE
      WHEN vs.user_a = p_user_id THEN vs.user_b
      ELSE vs.user_a
    END
  -- Only show streaks with actual friends
  JOIN public.friendships fs
    ON fs.user_a = vs.user_a AND fs.user_b = vs.user_b
    AND fs.status = 'accepted'
  WHERE (vs.user_a = p_user_id OR vs.user_b = p_user_id)
    AND vs.current_streak > 0
  ORDER BY vs.current_streak DESC, vs.best_streak DESC
  LIMIT 3;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_streaks(uuid) TO authenticated;

-- ── 5. Update get_public_profile with friend_count ───────────────────────────

DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE FUNCTION public.get_public_profile(p_user_id uuid)
RETURNS TABLE (
  id              uuid,
  username        text,
  user_rank       text,
  rad_score       float,
  avatar_url      text,
  post_count      bigint,
  follower_count  bigint,
  following_count bigint,
  friend_count    bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT
    u.id, u.username, u.user_rank, u.rad_score, u.avatar_url,
    (SELECT COUNT(*) FROM public.uploads up WHERE up.user_id = u.id AND up.is_active = true) AS post_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.following_id = u.id) AS follower_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.follower_id = u.id) AS following_count,
    (SELECT COUNT(*) FROM public.friendships fs
     WHERE (fs.user_a = u.id OR fs.user_b = u.id) AND fs.status = 'accepted') AS friend_count
  FROM public.users u
  WHERE u.id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;

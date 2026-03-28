-- Migration 032: Dual streaks (rad + bad tracked independently)
--
-- Replaces single current_streak/streak_type with rad_streak + bad_streak.
-- Both run independently. Rad streak resets on a disagreement where the
-- pair voted differently. Same for bad. They only reset when both users
-- vote on the same post and disagree.

-- ── 1. Add new columns, keep old ones temporarily ────────────────────────────

ALTER TABLE public.vote_streaks
  ADD COLUMN IF NOT EXISTS rad_streak integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bad_streak integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS best_rad_streak integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS best_bad_streak integer NOT NULL DEFAULT 0;

-- Copy existing data
UPDATE public.vote_streaks SET
  rad_streak = CASE WHEN streak_type = 'rad' THEN current_streak ELSE 0 END,
  bad_streak = CASE WHEN streak_type = 'bad' THEN current_streak ELSE 0 END,
  best_rad_streak = CASE WHEN streak_type = 'rad' THEN best_streak ELSE 0 END,
  best_bad_streak = CASE WHEN streak_type = 'bad' THEN best_streak ELSE 0 END;

-- ── 2. Rewire refresh_vote_streaks ───────────────────────────────────────────

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
        nv.vote AS vote_a,
        v2.vote::text AS vote_b,
        GREATEST(nv.created_at, v2.created_at) AS pair_time
      FROM new_votes nv
      JOIN public.votes v2
        ON v2.upload_id = nv.upload_id
        AND v2.voter_id != nv.voter_id
        AND v2.vote IN ('rad', 'bad')
      JOIN public.friendships fs
        ON fs.user_a = LEAST(nv.voter_id, v2.voter_id)
        AND fs.user_b = GREATEST(nv.voter_id, v2.voter_id)
        AND fs.status = 'accepted'
    ),
    deduped AS (
      SELECT DISTINCT ON (user_a, user_b, upload_id)
        user_a, user_b, upload_id, vote_a, vote_b, pair_time
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
    INSERT INTO public.vote_streaks (
      user_a, user_b, current_streak, best_streak, streak_type,
      rad_streak, bad_streak, best_rad_streak, best_bad_streak,
      last_upload_id, last_matched_at, updated_at
    )
    VALUES (
      rec.user_a, rec.user_b, 0, 0, NULL,
      CASE WHEN rec.vote_a = 'rad' AND rec.vote_b = 'rad' THEN 1 ELSE 0 END,
      CASE WHEN rec.vote_a = 'bad' AND rec.vote_b = 'bad' THEN 1 ELSE 0 END,
      CASE WHEN rec.vote_a = 'rad' AND rec.vote_b = 'rad' THEN 1 ELSE 0 END,
      CASE WHEN rec.vote_a = 'bad' AND rec.vote_b = 'bad' THEN 1 ELSE 0 END,
      rec.upload_id, rec.pair_time, now()
    )
    ON CONFLICT (user_a, user_b) DO UPDATE SET
      rad_streak = CASE
        WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz) THEN
          CASE
            WHEN rec.vote_a = 'rad' AND rec.vote_b = 'rad' THEN vote_streaks.rad_streak + 1
            WHEN rec.vote_a != rec.vote_b THEN 0
            ELSE vote_streaks.rad_streak
          END
        ELSE vote_streaks.rad_streak
      END,
      bad_streak = CASE
        WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz) THEN
          CASE
            WHEN rec.vote_a = 'bad' AND rec.vote_b = 'bad' THEN vote_streaks.bad_streak + 1
            WHEN rec.vote_a != rec.vote_b THEN 0
            ELSE vote_streaks.bad_streak
          END
        ELSE vote_streaks.bad_streak
      END,
      best_rad_streak = GREATEST(
        vote_streaks.best_rad_streak,
        CASE
          WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz)
            AND rec.vote_a = 'rad' AND rec.vote_b = 'rad'
          THEN vote_streaks.rad_streak + 1
          ELSE vote_streaks.rad_streak
        END
      ),
      best_bad_streak = GREATEST(
        vote_streaks.best_bad_streak,
        CASE
          WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz)
            AND rec.vote_a = 'bad' AND rec.vote_b = 'bad'
          THEN vote_streaks.bad_streak + 1
          ELSE vote_streaks.bad_streak
        END
      ),
      -- Keep legacy columns in sync for backwards compat
      current_streak = CASE
        WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz)
          AND rec.vote_a = rec.vote_b
        THEN CASE WHEN rec.vote_a = 'rad' THEN vote_streaks.rad_streak + 1 ELSE vote_streaks.bad_streak + 1 END
        ELSE 0
      END,
      best_streak = GREATEST(vote_streaks.best_streak, vote_streaks.current_streak),
      streak_type = CASE
        WHEN rec.pair_time > COALESCE(vote_streaks.last_matched_at, '1970-01-01'::timestamptz)
          AND rec.vote_a = rec.vote_b THEN rec.vote_a
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

-- ── 3. Rewire get_top_streaks to return both streak types ────────────────────

DROP FUNCTION IF EXISTS public.get_top_streaks(uuid);

CREATE FUNCTION public.get_top_streaks(p_user_id uuid)
RETURNS TABLE (
  friend_id        uuid,
  friend_username  text,
  friend_avatar    text,
  friend_rank      text,
  current_streak   integer,
  best_streak      integer,
  streak_type      text,
  rad_streak       integer,
  bad_streak       integer,
  best_rad_streak  integer,
  best_bad_streak  integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT
    friend.id            AS friend_id,
    friend.username       AS friend_username,
    friend.avatar_url     AS friend_avatar,
    friend.user_rank      AS friend_rank,
    GREATEST(vs.rad_streak, vs.bad_streak) AS current_streak,
    GREATEST(vs.best_rad_streak, vs.best_bad_streak) AS best_streak,
    CASE WHEN vs.rad_streak >= vs.bad_streak THEN 'rad' ELSE 'bad' END AS streak_type,
    vs.rad_streak,
    vs.bad_streak,
    vs.best_rad_streak,
    vs.best_bad_streak
  FROM public.vote_streaks vs
  JOIN public.users friend
    ON friend.id = CASE
      WHEN vs.user_a = p_user_id THEN vs.user_b
      ELSE vs.user_a
    END
  JOIN public.friendships fs
    ON fs.user_a = vs.user_a AND fs.user_b = vs.user_b
    AND fs.status = 'accepted'
  WHERE (vs.user_a = p_user_id OR vs.user_b = p_user_id)
    AND (vs.rad_streak > 0 OR vs.bad_streak > 0)
  ORDER BY GREATEST(vs.rad_streak, vs.bad_streak) DESC
  LIMIT 10;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_streaks(uuid) TO authenticated;

-- ── 4. Update friend_votes JSON to include both streaks ──────────────────────

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
        'rad_streak', COALESCE(vs.rad_streak, 0),
        'bad_streak', COALESCE(vs.bad_streak, 0)
      )
    )::jsonb AS friend_votes
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  JOIN public.votes friend_vote ON friend_vote.upload_id = up.id
  JOIN public.users friend ON friend.id = friend_vote.voter_id
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

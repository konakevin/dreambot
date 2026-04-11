-- Migration 107: Feed algorithm v3 bugfixes
-- Root causes fixed:
--  1. record_impression crashed on every call (boolean = integer) so NO impressions
--     have ever been recorded in post_impressions, making the seen-penalty a no-op.
--  2. get_feed's pagination cursor compared pre-throttle computed_score but returned
--     post-throttle feed_score, corrupting pagination boundaries.
--  3. Creator throttle PARTITION ran inside the cursor-filtered subset, so it
--     restarted at rank=1 per page, letting the same creator dominate every page.
--  4. Following boost (up to 0.30) dominated every other signal.
--  5. Seen-penalty at 0.35x was too weak to demote already-seen content.

-- ───────────────────────────────────────────────────────────────────────
-- Fix 1: record_impression — use xmax trick to detect insert vs update
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.record_impression(p_user_id uuid, p_upload_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_was_insert boolean;
BEGIN
  INSERT INTO public.post_impressions (user_id, upload_id)
  VALUES (p_user_id, p_upload_id)
  ON CONFLICT (user_id, upload_id)
  DO UPDATE SET
    view_count = public.post_impressions.view_count + 1,
    last_seen = now()
  RETURNING (xmax = 0) INTO v_was_insert;

  IF v_was_insert THEN
    UPDATE public.uploads SET view_count = view_count + 1 WHERE id = p_upload_id;
  END IF;
END;
$$;

-- ───────────────────────────────────────────────────────────────────────
-- Fix 2-5: Rewrite get_feed
--  - Creator throttle computed over the full pool (before cursor filter)
--  - Cursor compares final feed_score (post-throttle)
--  - Following boost capped at 0.15
--  - Randomness widened to 0.25
--  - Seen-penalty much more aggressive: 1.0 / 0.25 / 0.10 / 0.03
-- ───────────────────────────────────────────────────────────────────────
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

  -- Per-creator affinity: how much has this user engaged with each creator?
  user_affinity AS (
    SELECT
      up2.user_id AS creator_id,
      LN(1.0 + (
        COUNT(DISTINCT l.id) * 1.0
        + COUNT(DISTINCT c.id) * 3.0
        + COUNT(DISTINCT fav.id) * 2.0
      )) / LN(1.0 + 50.0) AS affinity
    FROM public.uploads up2
    LEFT JOIN public.likes l ON l.upload_id = up2.id AND l.user_id = p_user_id
    LEFT JOIN public.comments c ON c.upload_id = up2.id AND c.user_id = p_user_id
    LEFT JOIN public.favorites fav ON fav.upload_id = up2.id AND fav.user_id = p_user_id
    WHERE l.id IS NOT NULL OR c.id IS NOT NULL OR fav.id IS NOT NULL
    GROUP BY up2.user_id
  ),

  scored AS (
    SELECT
      up.id, up.user_id, up.image_url,
      up.width, up.height, up.caption, up.created_at,
      u.username, u.avatar_url,
      up.comment_count, up.like_count, up.fuse_count,
      up.ai_prompt, up.ai_concept, up.bot_message,
      up.dream_medium, up.dream_vibe,

      (up.like_count + up.comment_count * 8 + up.fuse_count * 10
       + up.share_count * 5 + up.save_count * 3)::float AS weighted_engagement,

      GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.1) AS hours_age,

      CASE WHEN uf.following_id IS NOT NULL THEN true ELSE false END AS is_following,

      GREATEST(up.view_count, 1)::float AS views,

      -- How many times this user has seen this post
      COALESCE(pi.view_count, 0) AS user_view_count,

      COALESCE(ua.affinity, 0.0) AS affinity

    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    LEFT JOIN public.post_impressions pi ON pi.upload_id = up.id AND pi.user_id = p_user_id
    LEFT JOIN user_affinity ua ON ua.creator_id = up.user_id
    WHERE up.is_active = true
      AND up.user_id != p_user_id
      AND (up.is_moderated = false OR up.is_approved = true)
      AND up.user_id NOT IN (SELECT uid FROM user_blocks)
      AND up.id NOT IN (SELECT upload_id FROM user_reports)
      AND (
        up.user_id IN (SELECT id FROM public_users)
        OR up.user_id IN (SELECT friend_id FROM user_friends)
      )
      AND (
        CASE
          WHEN p_tab = 'following' THEN up.user_id IN (SELECT following_id FROM user_follows)
          WHEN p_tab = 'dreamers' THEN up.user_id IN (SELECT friend_id FROM user_friends)
          ELSE true
        END
      )
      AND (p_medium IS NULL OR up.dream_medium = p_medium)
      AND (p_vibe IS NULL OR up.dream_vibe = p_vibe)
  ),

  final_scored AS (
    SELECT
      scored.*,
      CASE
        -- ═══ forYou: rebalanced multi-factor ═══
        WHEN p_tab = 'forYou' THEN (
          -- Freshness: 12h half-life
          EXP(-0.058 * scored.hours_age) * 0.20

          -- Engagement velocity (now 0.30, was 0.25)
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.30

          -- Engagement rate
          + LN(1.0 + scored.weighted_engagement / scored.views) / 3.0 * 0.10

          -- Absolute engagement
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.10

          -- Following boost CAPPED at 0.15 (was 0.30)
          + CASE WHEN scored.is_following
              THEN 0.08 + scored.affinity * 0.07
              ELSE 0.0
            END

          -- Non-following affinity still matters
          + CASE WHEN NOT scored.is_following
              THEN scored.affinity * 0.08
              ELSE 0.0
            END

          -- Randomness WIDENED to 0.25 (was 0.15)
          + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.25

          -- Cold start
          + CASE
              WHEN scored.hours_age < 1.0 THEN 0.25
              WHEN scored.hours_age < 4.0 THEN 0.15
              WHEN scored.hours_age < 8.0 THEN 0.05
              ELSE 0.0
            END
        )
        -- Aggressive seen-penalty: basically banish after 3 views
        * CASE
            WHEN scored.user_view_count = 0 THEN 1.0
            WHEN scored.user_view_count = 1 THEN 0.25
            WHEN scored.user_view_count = 2 THEN 0.10
            ELSE 0.03
          END

        -- ═══ following: smooth decay, affinity-driven ═══
        WHEN p_tab = 'following' THEN (
          EXP(-0.039 * scored.hours_age) * 0.30
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.25
          + scored.affinity * 0.20
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.15
          + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.15
        )
        -- Stronger seen penalty for following too
        * CASE
            WHEN scored.user_view_count = 0 THEN 1.0
            WHEN scored.user_view_count = 1 THEN 0.45
            WHEN scored.user_view_count = 2 THEN 0.20
            ELSE 0.08
          END

        -- ═══ dreamers: mostly chronological ═══
        WHEN p_tab = 'dreamers' THEN (
          1.0 / (1.0 + scored.hours_age * 0.1)
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 500.0) * 0.05
        )
        * CASE WHEN scored.user_view_count > 0 THEN 0.5 ELSE 1.0 END

        ELSE 0.0
      END AS computed_score
    FROM scored
  ),

  -- Creator throttle computed over the FULL pool (no cursor filter yet).
  -- This fixes the bug where ROW_NUMBER restarted per-page.
  throttled AS (
    SELECT
      fs.*,
      ROW_NUMBER() OVER (
        PARTITION BY fs.user_id
        ORDER BY fs.computed_score DESC
      ) AS creator_rank
    FROM final_scored fs
  ),

  -- Compute the final feed_score WITH throttle applied, then filter by cursor on THAT value.
  with_final_score AS (
    SELECT
      throttled.*,
      throttled.computed_score * CASE
        WHEN throttled.creator_rank = 1 THEN 1.0
        WHEN throttled.creator_rank = 2 THEN 0.4
        WHEN throttled.creator_rank = 3 THEN 0.15
        ELSE 0.05
      END AS final_score
    FROM throttled
  )

  SELECT
    ws.id, ws.user_id, ws.image_url,
    ws.width, ws.height, ws.caption, ws.created_at,
    ws.username, ws.avatar_url,
    ws.comment_count, ws.like_count, ws.fuse_count,
    ws.ai_prompt, ws.ai_concept, ws.bot_message,
    ws.dream_medium, ws.dream_vibe,
    ws.final_score AS feed_score
  FROM with_final_score ws
  WHERE
    p_cursor_score IS NULL OR p_cursor_id IS NULL
    OR ws.final_score < p_cursor_score
    OR (ws.final_score = p_cursor_score AND ws.id < p_cursor_id)
  ORDER BY ws.final_score DESC, ws.id DESC
  LIMIT p_limit;
$$;

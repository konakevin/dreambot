-- 243_get_feed_reposts.sql — Repost feature Phase 3: surface reposts in get_feed.
--
-- Adds repost surfaces to the feed (REPOST_FEATURE_PLAN.md §5). Body is migration
-- 219 PLUS:
--   • repost_agg CTE — per upload, the reposters the VIEWER follows (count +
--     latest reposter). GROUP BY upload_id collapses many reposters into one row,
--     which handles dedup + "reposted by N" for free.
--   • weighted_engagement gains `repost_count * 2.0` (a repost ≈ 2× a like; X's
--     open-sourced ranker weights a retweet 1.0 vs a like 0.5).
--   • surface_type: a card is a 'repost' (attributed to the follow) only on
--     following/forYou when a FOLLOWED user reposted it AND the viewer does NOT
--     follow the author (if you follow the author it stays their 'original').
--   • Following candidate set expands to include uploads reposted by a follow.
--     A repost surface floats at the REPOST time (surface_ts) so it resurfaces.
--   • forYou gets a social-proof boost when followed users reposted the post.
--   • New return columns: repost_count, surface_type, reposter_id, reposter_name,
--     reposters_more, reposted_at.
--
-- Privacy: the author-public-OR-followed visibility filter is UNCHANGED, so a
-- repost can never leak a private-account post to a non-follower.
--
-- Run in the Supabase dashboard SQL editor (DDL).

DROP FUNCTION IF EXISTS public.get_feed(uuid, integer, integer, double precision, text, double precision, uuid, text, text, uuid);

CREATE FUNCTION public.get_feed(
  p_user_id       uuid,
  p_limit         integer DEFAULT 20,
  p_offset        integer DEFAULT 0,
  p_seed          double precision DEFAULT 0.0,
  p_tab           text DEFAULT 'forYou',
  p_cursor_score  double precision DEFAULT NULL,
  p_cursor_id     uuid DEFAULT NULL,
  p_medium        text DEFAULT NULL,
  p_vibe          text DEFAULT NULL,
  p_bot_user_id   uuid DEFAULT NULL
)
RETURNS TABLE(
  id                uuid,
  user_id           uuid,
  image_url         text,
  image_url_hq      text,
  image_url_display text,
  thumbhash         text,
  width             integer,
  height            integer,
  caption           text,
  description       text,
  created_at        timestamptz,
  posted_at         timestamptz,
  username          text,
  avatar_url        text,
  comment_count     integer,
  like_count        integer,
  fuse_count        integer,
  ai_prompt         text,
  ai_concept        jsonb,
  bot_message       text,
  dream_medium      text,
  dream_vibe        text,
  model             text,
  repost_count      integer,
  surface_type      text,
  reposter_id       uuid,
  reposter_name     text,
  reposters_more    integer,
  reposted_at       timestamptz,
  feed_score        double precision
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
  -- Reposts of each upload by users the VIEWER follows. GROUP BY upload_id is
  -- the dedup + collapse: one row per upload, with the count and the most-recent
  -- reposter for attribution ("Reposted by {latest} and {count-1} others").
  repost_agg AS (
    SELECT
      r.upload_id,
      count(*)::int AS followed_reposter_count,
      max(r.created_at) AS latest_repost_at,
      (array_agg(r.reposter_id ORDER BY r.created_at DESC))[1] AS latest_reposter_id,
      (array_agg(ru.username  ORDER BY r.created_at DESC))[1] AS latest_reposter_name
    FROM public.post_reposts r
    JOIN public.users ru ON ru.id = r.reposter_id
    WHERE r.reposter_id IN (SELECT following_id FROM user_follows)
    GROUP BY r.upload_id
  ),
  scored AS (
    SELECT
      up.id, up.user_id, up.image_url, up.image_url_hq,
      up.image_url_display, up.thumbhash,
      up.width, up.height, up.caption, up.description,
      up.created_at, up.posted_at,
      u.username, u.avatar_url,
      up.comment_count, up.like_count, up.fuse_count,
      up.ai_prompt, up.ai_concept, up.bot_message,
      up.dream_medium, up.dream_vibe, up.model,
      up.repost_count,

      (ra.upload_id IS NOT NULL) AS has_followed_repost,
      COALESCE(ra.followed_reposter_count, 0) AS followed_reposter_count,
      ra.latest_repost_at, ra.latest_reposter_id, ra.latest_reposter_name,

      -- A 'repost' surface (attributed to the follow) only when a FOLLOWED user
      -- reposted it and the viewer does NOT follow the author. Never on 'bots'.
      CASE
        WHEN p_tab IN ('following', 'forYou')
             AND ra.upload_id IS NOT NULL
             AND uf.following_id IS NULL
          THEN 'repost'
        ELSE 'original'
      END AS surface_type,

      (up.like_count + up.comment_count * 2 + up.fuse_count * 3
       + up.share_count * 2 + up.save_count * 1.5
       + up.repost_count * 2.0)::float AS weighted_engagement,

      -- Age from the placement timestamp: on Following a repost surface floats at
      -- REPOST time (so it resurfaces); everything else ages from posted_at
      -- (forYou treats a repost as a ranking boost, not a recency reset).
      GREATEST(EXTRACT(EPOCH FROM (now() -
        CASE
          WHEN p_tab = 'following'
               AND ra.upload_id IS NOT NULL
               AND uf.following_id IS NULL
            THEN ra.latest_repost_at
          ELSE up.posted_at
        END
      )) / 3600.0, 0.1) AS hours_age,

      CASE WHEN uf.following_id IS NOT NULL THEN true ELSE false END AS is_following,

      GREATEST(up.view_count, 10)::float AS views

    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    LEFT JOIN repost_agg ra ON ra.upload_id = up.id
    WHERE up.is_public = true
      AND up.posted_at IS NOT NULL
      AND (p_tab = 'bots' OR up.user_id != p_user_id)
      AND (up.is_moderated = false OR up.is_approved = true)
      AND up.user_id NOT IN (SELECT uid FROM user_blocks)
      AND up.id NOT IN (SELECT upload_id FROM user_reports)
      AND (
        up.user_id IN (SELECT id FROM public_users)
        OR up.user_id IN (SELECT following_id FROM user_follows)
      )
      AND (
        CASE
          WHEN p_tab = 'following' THEN
            -- originals from follows, PLUS posts reposted by a follow
            (up.user_id IN (SELECT following_id FROM user_follows)
             OR ra.upload_id IS NOT NULL)
          WHEN p_tab = 'bots' THEN
            up.is_ai_generated = true
            AND up.user_id IN (SELECT id FROM public.users WHERE is_bot = true)
            AND (p_bot_user_id IS NULL OR up.user_id = p_bot_user_id)
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
        WHEN p_tab = 'forYou' THEN (
          EXP(-0.05 * scored.hours_age) * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.views) / 3.0 * 0.10
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.15
          + CASE WHEN scored.is_following THEN 0.15 ELSE 0.0 END
          + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
          + CASE WHEN scored.hours_age < 4.0 THEN 0.20 ELSE 0.0 END
          -- social-proof: followed users reposting it is a strong endorsement
          + CASE WHEN scored.has_followed_repost
                 THEN LEAST(0.20, 0.08 + 0.04 * scored.followed_reposter_count)
                 ELSE 0.0 END
        )
        WHEN p_tab = 'following' THEN (
          CASE WHEN scored.hours_age < 24.0
            THEN 1.0 - (scored.hours_age / 24.0) * 0.3
            ELSE 0.0
          END
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.30
          + EXP(-0.02 * scored.hours_age) * 0.10
        )
        WHEN p_tab = 'bots' THEN
          EXTRACT(EPOCH FROM scored.posted_at) / 1e10
        ELSE 0.0
      END AS computed_score
    FROM scored
  )
  SELECT
    final_scored.id, final_scored.user_id, final_scored.image_url,
    final_scored.image_url_hq,
    final_scored.image_url_display, final_scored.thumbhash,
    final_scored.width, final_scored.height, final_scored.caption,
    final_scored.description, final_scored.created_at, final_scored.posted_at,
    final_scored.username, final_scored.avatar_url,
    final_scored.comment_count, final_scored.like_count, final_scored.fuse_count,
    final_scored.ai_prompt, final_scored.ai_concept, final_scored.bot_message,
    final_scored.dream_medium, final_scored.dream_vibe, final_scored.model,
    final_scored.repost_count,
    final_scored.surface_type,
    CASE WHEN final_scored.surface_type = 'repost' THEN final_scored.latest_reposter_id END AS reposter_id,
    CASE WHEN final_scored.surface_type = 'repost' THEN final_scored.latest_reposter_name END AS reposter_name,
    CASE WHEN final_scored.surface_type = 'repost'
         THEN GREATEST(final_scored.followed_reposter_count - 1, 0) ELSE 0 END AS reposters_more,
    CASE WHEN final_scored.surface_type = 'repost' THEN final_scored.latest_repost_at END AS reposted_at,
    final_scored.computed_score AS feed_score
  FROM final_scored
  WHERE
    (p_cursor_score IS NULL OR p_cursor_id IS NULL)
    OR (final_scored.computed_score < p_cursor_score)
    OR (final_scored.computed_score = p_cursor_score AND final_scored.id < p_cursor_id)
  ORDER BY final_scored.computed_score DESC, final_scored.id DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, integer, double precision, text, double precision, uuid, text, text, uuid) TO authenticated;

-- 448_get_feed_narrow_sort.sql — perf refactor of get_feed (was mig 419).
--
-- get_feed SCORED + SORTED the entire ~24k-candidate set carrying ~30 FAT output
-- columns (image urls, caption, ai_prompt text, ai_concept jsonb) — 172k shared
-- buffers / ~1.0s per call, the app's hottest query + the launch-feed spinner.
--
-- This restructures the PROJECTION only (result-IDENTICAL — same candidates, same
-- score, same order): the score + sort now run over a NARROW row (id + score
-- inputs + repost fields), the fat columns + the users(author) join are fetched
-- only for the final top-N, and the viewer's post_impressions are pre-selected
-- into a CTE (same data, better join shape). Every SCORE term, the candidate
-- FILTER, the cursor, and the output columns are VERBATIM from mig 419.
--
-- PROVEN before swap (2026-08-27): A/B diff over 12 param sets (all tabs × 4
-- seeds) + page-2 cursors = 480 rows → byte-identical order + columns, scores
-- within now()-drift tol. EXPLAIN: 172,582 → 103,660 buffers (-40%), 1022 →
-- 737ms (-28%); end-to-end RPC 1075 → 720ms (-33%).
--
-- Run in the Supabase dashboard SQL editor (DDL). Signature unchanged, so
-- CREATE OR REPLACE preserves grants; the GRANT below is belt-and-suspenders.

CREATE OR REPLACE FUNCTION public.get_feed(
  p_user_id       uuid,
  p_limit         integer DEFAULT 20,
  p_offset        integer DEFAULT 0,
  p_seed          double precision DEFAULT 0.0,
  p_shuffle       double precision DEFAULT 0.10,
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
  allow_reposts     boolean,
  allow_downloads   boolean,
  comment_count     integer,
  like_count        integer,
  ai_prompt         text,
  ai_concept        jsonb,
  bot_message       text,
  dream_medium      text,
  dream_vibe        text,
  model             text,
  face_swap_mode    text,
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
  -- The viewer's own impressions, pulled ONCE (same data as the per-row
  -- correlated join in mig 419 — result-identical; lets the planner hash a small
  -- set instead of probing post_impressions 24k times).
  my_impressions AS (
    SELECT upload_id, view_count, last_seen
    FROM public.post_impressions
    WHERE user_id = p_user_id
  ),
  repost_agg AS (
    SELECT
      r.upload_id,
      count(*)::int AS followed_reposter_count,
      max(r.first_reposted_at) AS latest_repost_at,
      (array_agg(r.reposter_id ORDER BY r.first_reposted_at DESC))[1] AS latest_reposter_id,
      (array_agg(ru.username  ORDER BY r.first_reposted_at DESC))[1] AS latest_reposter_name
    FROM public.post_reposts r
    JOIN public.users ru ON ru.id = r.reposter_id
    WHERE r.reposter_id IN (SELECT following_id FROM user_follows)
      AND r.active = true
      AND r.activations = 1
    GROUP BY r.upload_id
  ),
  -- NARROW candidate + score inputs. Same FROM / filters as mig 419's `scored`,
  -- but NO fat output columns and NO users(author) join (moved to the final
  -- fetch). Only id + the fields the SCORE and the repost OUTPUT need survive.
  scored AS (
    SELECT
      up.id,
      up.user_id,
      up.posted_at,   -- raw; the bots-tab score ranks on EXTRACT(EPOCH FROM posted_at)

      (ra.upload_id IS NOT NULL) AS has_followed_repost,
      COALESCE(ra.followed_reposter_count, 0) AS followed_reposter_count,
      ra.latest_repost_at, ra.latest_reposter_id, ra.latest_reposter_name,

      CASE
        WHEN p_tab IN ('following', 'forYou')
             AND ra.upload_id IS NOT NULL
             AND uf.following_id IS NULL
          THEN 'repost'
        ELSE 'original'
      END AS surface_type,

      (up.like_count + up.comment_count * 2
       + up.share_count * 2 + up.save_count * 1.5
       + up.repost_count * 2.0)::float AS weighted_engagement,

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

      GREATEST(up.view_count, 10)::float AS views,

      COALESCE(pi.view_count, 0) AS user_view_count,
      GREATEST(EXTRACT(EPOCH FROM (now() - pi.last_seen)) / 86400.0, 0.0) AS days_since_seen

    FROM public.uploads up
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    LEFT JOIN repost_agg ra ON ra.upload_id = up.id
    LEFT JOIN my_impressions pi ON pi.upload_id = up.id
    WHERE up.is_public = true
      AND up.posted_at IS NOT NULL
      AND (p_tab <> 'forYou'
           OR up.posted_at > now() - interval '60 days'
           OR uf.following_id IS NOT NULL
           OR ra.upload_id IS NOT NULL
           OR (up.posted_at > now() - interval '365 days'
               AND ABS(HASHTEXT(up.id::text || p_seed::text)) % 20 = 0))
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
      scored.id,
      scored.surface_type,
      scored.followed_reposter_count,
      scored.latest_reposter_id,
      scored.latest_reposter_name,
      scored.latest_repost_at,
      CASE
        WHEN p_tab = 'forYou' THEN (
          EXP(-0.05 * scored.hours_age) * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.views) / 3.0 * 0.10
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.15
          + CASE WHEN scored.is_following THEN 0.15 ELSE 0.0 END
          + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * LEAST(p_shuffle, 0.15)
          + CASE WHEN scored.hours_age < 4.0 THEN 0.20 ELSE 0.0 END
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
      END
      * CASE
          WHEN scored.user_view_count = 0 THEN 1.0
          ELSE LEAST(1.0,
            CASE p_tab
              WHEN 'following' THEN
                CASE WHEN scored.user_view_count = 1 THEN 0.75 ELSE 0.50 END
              WHEN 'bots' THEN 1.0
              ELSE
                CASE
                  WHEN scored.user_view_count = 1 THEN 0.55
                  WHEN scored.user_view_count = 2 THEN 0.35
                  ELSE 0.20
                END
            END
            + (1.0 - CASE p_tab
                WHEN 'following' THEN
                  CASE WHEN scored.user_view_count = 1 THEN 0.75 ELSE 0.50 END
                WHEN 'bots' THEN 1.0
                ELSE
                  CASE
                    WHEN scored.user_view_count = 1 THEN 0.55
                    WHEN scored.user_view_count = 2 THEN 0.35
                    ELSE 0.20
                  END
              END)
              * GREATEST(
                  LEAST(scored.days_since_seen / 21.0, 1.0),
                  1.0 - LEAST(scored.hours_age / 72.0, 1.0)
                )
          )
        END AS computed_score
    FROM scored
  ),
  ranked AS (
    SELECT
      final_scored.id,
      final_scored.surface_type,
      final_scored.followed_reposter_count,
      final_scored.latest_reposter_id,
      final_scored.latest_reposter_name,
      final_scored.latest_repost_at,
      final_scored.computed_score
    FROM final_scored
    WHERE
      (p_cursor_score IS NULL OR p_cursor_id IS NULL)
      OR (final_scored.computed_score < p_cursor_score)
      OR (final_scored.computed_score = p_cursor_score AND final_scored.id < p_cursor_id)
    ORDER BY final_scored.computed_score DESC, final_scored.id DESC
    LIMIT p_limit
  )
  SELECT
    up.id, up.user_id, up.image_url, up.image_url_hq,
    up.image_url_display, up.thumbhash,
    up.width, up.height, up.caption, up.description,
    up.created_at, up.posted_at,
    u.username, u.avatar_url, u.allow_reposts, u.allow_downloads,
    up.comment_count, up.like_count,
    up.ai_prompt, up.ai_concept, up.bot_message,
    up.dream_medium, up.dream_vibe, up.model,
    up.face_swap_mode,
    up.repost_count,
    ranked.surface_type,
    CASE WHEN ranked.surface_type = 'repost' THEN ranked.latest_reposter_id END AS reposter_id,
    CASE WHEN ranked.surface_type = 'repost' THEN ranked.latest_reposter_name END AS reposter_name,
    CASE WHEN ranked.surface_type = 'repost'
         THEN GREATEST(ranked.followed_reposter_count - 1, 0) ELSE 0 END AS reposters_more,
    CASE WHEN ranked.surface_type = 'repost' THEN ranked.latest_repost_at END AS reposted_at,
    ranked.computed_score AS feed_score
  FROM ranked
  JOIN public.uploads up ON up.id = ranked.id
  JOIN public.users u ON u.id = up.user_id
  ORDER BY ranked.computed_score DESC, ranked.id DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, integer, double precision, double precision, text, double precision, uuid, text, text, uuid) TO authenticated;

-- Retire the temp validation function.
DROP FUNCTION IF EXISTS public.get_feed_v2(
  uuid, integer, integer, double precision, double precision,
  text, double precision, uuid, text, text, uuid
);

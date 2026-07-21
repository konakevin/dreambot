-- 391: get_feed candidate windowing + partial index (hot-query cost cut).
--
-- get_feed runs on every feed page/refresh/launch across Home, Explore and
-- Bots (a ~19-call burst at launch) and was scoring the ENTIRE 365-day public
-- catalog per call (~1s each) — the standing driver of the recurring PostgREST
-- pool-saturation episodes. This bounds the SCORED candidate set for forYou:
--   • all posts < 60 days old
--   • ALL followed-author content, any age (friends never window out)
--   • followed reposts (any age)
--   • a seed-rotating 5% hash-sample of the 60-365d catalog (the callback
--     supply — different old posts become eligible on every reshuffle)
-- Following/bots tabs are already naturally narrow and are unchanged. The
-- impression-penalty behavior (388/389/390) is untouched — locked by
-- feedSeenPenalty.dbspec.ts. Plus the partial index the WHERE clause wants.
-- Body otherwise verbatim 390. Apply in the dashboard SQL editor.

CREATE INDEX IF NOT EXISTS idx_uploads_public_posted
  ON public.uploads (posted_at DESC)
  WHERE is_public = true AND posted_at IS NOT NULL;

DROP FUNCTION IF EXISTS public.get_feed(
  uuid, integer, integer, double precision, double precision,
  text, double precision, uuid, text, text, uuid
);

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
      u.username, u.avatar_url, u.allow_reposts, u.allow_downloads,
      up.comment_count, up.like_count,
      up.ai_prompt, up.ai_concept, up.bot_message,
      up.dream_medium, up.dream_vibe, up.model,
      up.face_swap_mode,
      up.repost_count,

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

      -- Viewer's per-post seen state (migration 388 — the restored v3
      -- seen-penalty; post_impressions has fed this since migration 090).
      COALESCE(pi.view_count, 0) AS user_view_count,
      GREATEST(EXTRACT(EPOCH FROM (now() - pi.last_seen)) / 86400.0, 0.0) AS days_since_seen

    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    LEFT JOIN repost_agg ra ON ra.upload_id = up.id
    LEFT JOIN public.post_impressions pi
      ON pi.upload_id = up.id AND pi.user_id = p_user_id
    WHERE up.is_public = true
      AND up.posted_at IS NOT NULL
      -- ▼▼ Candidate windowing (migration 391, was a flat 365d window from 282).
      --    get_feed is the app's hottest query and it SCORED the entire eligible
      --    catalog per page request (~1s/call, the recurring PostgREST pool-
      --    pressure driver). The scored set is now: everything <60 days, ALL
      --    followed-author content (any age — friends' history stays fully
      --    eligible), followed reposts, plus a SEED-ROTATING 5% sample of the
      --    60-365d catalog — which is precisely the "callbacks" supply, and the
      --    sample rotates with every reshuffle so different old posts become
      --    eligible each refresh. Cuts the scored set ~10x at current scale.
      AND (p_tab <> 'forYou'
           OR up.posted_at > now() - interval '60 days'
           OR uf.following_id IS NOT NULL
           OR ra.upload_id IS NOT NULL
           OR (up.posted_at > now() - interval '365 days'
               AND ABS(HASHTEXT(up.id::text || p_seed::text)) % 20 = 0))
      -- ▲▲
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
      scored.*,
      CASE
        WHEN p_tab = 'forYou' THEN (
          EXP(-0.05 * scored.hours_age) * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.views) / 3.0 * 0.10
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.15
          + CASE WHEN scored.is_following THEN 0.15 ELSE 0.0 END
          -- Jitter CLAMPED to 0.15 (migration 389). The 0.45 manual-refresh
          -- strength predates the seen-penalty: it was brute-force variety
          -- compensating for a ranker that couldn't suppress seen posts. With
          -- the penalty live it drowned the signal — the un-suppressed pool is
          -- fresh-but-low-engagement posts (base ~0.2) vs the whole unseen
          -- back catalog (~0.15), so +-0.45 of noise made the mid-feed a random
          -- draw over months-old content (measured: median feed age 51 DAYS at
          -- 0.45 vs 12 hours at 0.18; clamp 0.15 ~= 85% under-48h with ~15%
          -- older discovery/callbacks — the intended mix). Near-ties still
          -- rotate per seed; principled variety now comes from impressions.
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
      -- ═══ Impression discounting (migration 388) ═══════════════════════════
      -- Multiplicative seen-penalty with TIME RECOVERY. Restores what feed v3
      -- (migration 104) had before a rewrite dropped it: without this, the
      -- ranker can't know the viewer has seen a post, so high-baseline posts
      -- (followed + popular) re-serve every session for WEEKS (Kevin had posts
      -- served 34x; 2026-07-21 audit). Base penalty grades with view count;
      -- the penalty then relaxes linearly back to 1.0 over 21 days since the
      -- LAST view, so old favorites can still resurface as "callbacks" — an
      -- unseen-lately banger ranks again, yesterday's does not. The Following
      -- tab uses the gentler v3-style curve (followers WANT their accounts'
      -- posts around); the bots tab is chronological and takes no penalty.
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
              -- Age-aware waiver (migration 390): the penalty relaxes toward
              -- 1.0 for YOUNG posts — full repeats allowed at posting, tapering
              -- to the full penalty by 72h of post age. Small-catalog reality:
              -- ~72 bot posts/day vs heavier consumption means an active user
              -- exhausts the fresh pool daily; hard-suppressing seen-once
              -- FRESH posts (friends' especially) backfilled the feed with
              -- old bot catalog ('all I see is bots', Kevin 2026-07-21).
              -- Repeats within a post's first days are the deliberate trade;
              -- week-old+ posts keep FULL suppression (the original stuck-post
              -- fix targeted weeks-old pinners — unaffected by this waiver).
              * GREATEST(
                  LEAST(scored.days_since_seen / 21.0, 1.0),
                  1.0 - LEAST(scored.hours_age / 72.0, 1.0)
                )
          )
        END AS computed_score
    FROM scored
  )
  SELECT
    final_scored.id, final_scored.user_id, final_scored.image_url,
    final_scored.image_url_hq,
    final_scored.image_url_display, final_scored.thumbhash,
    final_scored.width, final_scored.height, final_scored.caption,
    final_scored.description, final_scored.created_at, final_scored.posted_at,
    final_scored.username, final_scored.avatar_url, final_scored.allow_reposts,
    final_scored.allow_downloads,
    final_scored.comment_count, final_scored.like_count,
    final_scored.ai_prompt, final_scored.ai_concept, final_scored.bot_message,
    final_scored.dream_medium, final_scored.dream_vibe, final_scored.model,
    final_scored.face_swap_mode,
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

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, integer, double precision, double precision, text, double precision, uuid, text, text, uuid) TO authenticated;

-- 544_feed_fresh_first_throwback_turns.sql — fresher For You feed + diverse throwbacks, 2026-09-22.
-- Kevin: "it feels like it is a bit over emphasizing older posts from friends ... I tend to see some
-- pretty bad clustering on the throwbacks ... I don't see the same half dozen over and over."
--
-- WHAT WAS MEASURED (live data, simulation reproduced the live feed exactly before any change)
--   1. Bots post ~32/day in ~6 bursts (every ~3-4h); people post ~4/day. The +0.20 "brand new" bonus
--      covers only 4h (one burst), and the recency term halves every ~14h, so a post 4-24h old ties
--      with any months-old post from a followed account (follow bonus 0.15, never fades). A returning
--      user who follows few bots saw 13 of today's 32 posts; the rest sank as deep as #4,411.
--   2. Throwbacks were a LIKES LOOP. For posts past the recency window the only non-random signal is
--      engagement, and at the tail of a ~22k-post pool a ~0.03 edge wins every slot: 100% of the
--      throwbacks shown came from the 3.6% of old posts with 3+ engagement, 96% were posts the viewer
--      had liked himself, and one friend held 20% of all throwback slots. Pure random is NOT the fix:
--      98% of old followed posts are bot posts, so friends would vanish.
--
-- THE CHANGE (For You only; Following + Bots tabs untouched; Explore rides the For You formula)
--   A. feed_unseen_fresh_bonus (0.40) for posts younger than feed_unseen_fresh_hours (24) that the
--      viewer has NOT seen. 0.40 > the ~0.33 max any old post can score, so today's unseen posts
--      always lead; once seen, the post falls back to the normal formula (no daily re-serving).
--   B. Posts at least feed_older_post_hours (168 = 7d) old ignore engagement
--      (feed_older_ignore_engagement) — likes still lift NEW posts, not throwbacks.
--   C. Older posts TAKE TURNS between accounts: within one author, each older post's score drops by
--      feed_older_turn_step (0.04) per rank, so every followed account's best random pick comes before
--      anyone's second. Ranking within the author uses the full score, so recently-seen posts sink.
--   Simulated on Kevin's feed (30 opens): distinct throwbacks 366 → 560, repeated in 3+ opens
--   127 → 28, self-liked 96% → 41%, max single-account share 20% → ~4.5%, friends' share 43% → 35%,
--   under-3-day posts in the first 60: 23 → 30.
--
-- Every knob is an engine_config column with an in-function fallback (a missing row never breaks the
-- feed). Body otherwise verbatim from 492 (plpgsql + force_custom_plan + #variable_conflict use_column
-- + the self-or-service auth guard + anon revoked).
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET feed_unseen_fresh_bonus = 0, feed_older_ignore_engagement = false,
--          feed_older_turn_step = 0 WHERE id = 1;
--   That reproduces 492's scores exactly. Full revert = re-apply 492's get_feed definition.


ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS feed_unseen_fresh_bonus      double precision NOT NULL DEFAULT 0.40,
  ADD COLUMN IF NOT EXISTS feed_unseen_fresh_hours      double precision NOT NULL DEFAULT 24,
  ADD COLUMN IF NOT EXISTS feed_older_post_hours        double precision NOT NULL DEFAULT 168,
  ADD COLUMN IF NOT EXISTS feed_older_ignore_engagement boolean          NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS feed_older_turn_step         double precision NOT NULL DEFAULT 0.04;

COMMENT ON COLUMN public.engine_config.feed_unseen_fresh_bonus IS
  'For You: score bonus for posts younger than feed_unseen_fresh_hours the viewer has NOT seen. 0 = off.';
COMMENT ON COLUMN public.engine_config.feed_unseen_fresh_hours IS
  'For You: age window (hours) for feed_unseen_fresh_bonus.';
COMMENT ON COLUMN public.engine_config.feed_older_post_hours IS
  'For You: posts at least this old (hours) are "older": engagement ignored + take turns per author.';
COMMENT ON COLUMN public.engine_config.feed_older_ignore_engagement IS
  'For You: true = likes/comments/etc do not score older posts (breaks the self-like throwback loop).';
COMMENT ON COLUMN public.engine_config.feed_older_turn_step IS
  'For You: per-rank score step within one author''s older posts (round-robin across accounts). 0 = off.';

create or replace function public.get_feed(
  p_user_id uuid, p_limit integer default 20, p_offset integer default 0,
  p_seed double precision default 0.0, p_shuffle double precision default 0.10,
  p_tab text default 'forYou'::text, p_cursor_score double precision default null::double precision,
  p_cursor_id uuid default null::uuid, p_medium text default null::text,
  p_vibe text default null::text, p_bot_user_id uuid default null::uuid
)
returns table(
  id uuid, user_id uuid, image_url text, image_url_hq text, image_url_display text,
  thumbhash text, width integer, height integer, caption text, description text,
  created_at timestamp with time zone, posted_at timestamp with time zone,
  username text, avatar_url text, allow_reposts boolean, allow_downloads boolean,
  comment_count integer, like_count integer, ai_prompt text, ai_concept jsonb,
  bot_message text, dream_medium text, dream_vibe text, model text,
  face_swap_mode text, repost_count integer, surface_type text, reposter_id uuid,
  reposter_name text, reposters_more integer, reposted_at timestamp with time zone,
  feed_score double precision, media jsonb, media_count smallint
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = ''
SET plan_cache_mode = force_custom_plan
AS $$
#variable_conflict use_column
DECLARE
  v_fresh_bonus  double precision;
  v_fresh_hours  double precision;
  v_older_hours  double precision;
  v_older_no_eng boolean;
  v_turn_step    double precision;
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read feed for a different user';
  END IF;

  SELECT ec.feed_unseen_fresh_bonus, ec.feed_unseen_fresh_hours, ec.feed_older_post_hours,
         ec.feed_older_ignore_engagement, ec.feed_older_turn_step
    INTO v_fresh_bonus, v_fresh_hours, v_older_hours, v_older_no_eng, v_turn_step
    FROM public.engine_config ec WHERE ec.id = 1;
  v_fresh_bonus  := COALESCE(v_fresh_bonus, 0.40);
  v_fresh_hours  := COALESCE(v_fresh_hours, 24);
  v_older_hours  := COALESCE(v_older_hours, 168);
  v_older_no_eng := COALESCE(v_older_no_eng, true);
  v_turn_step    := COALESCE(v_turn_step, 0.04);

  RETURN QUERY
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
  scored AS (
    SELECT
      up.id,
      up.user_id,
      up.posted_at,

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
  aged AS (
    SELECT
      scored.*,
      -- 544: "older" post (For You only) — engagement ignored + takes turns per author.
      (p_tab = 'forYou' AND v_older_hours > 0 AND scored.hours_age >= v_older_hours) AS is_older
    FROM scored
  ),
  final_scored AS (
    SELECT
      aged.id,
      aged.user_id,
      aged.is_older,
      aged.surface_type,
      aged.followed_reposter_count,
      aged.latest_reposter_id,
      aged.latest_reposter_name,
      aged.latest_repost_at,
      CASE
        WHEN p_tab = 'forYou' THEN (
          EXP(-0.05 * aged.hours_age) * 0.25
          + CASE WHEN aged.is_older AND v_older_no_eng THEN 0.0 ELSE (
              LN(1.0 + aged.weighted_engagement / aged.hours_age) / 5.0 * 0.25
              + LN(1.0 + aged.weighted_engagement / aged.views) / 3.0 * 0.10
              + LN(1.0 + aged.weighted_engagement) / LN(1.0 + 5000.0) * 0.15
            ) END
          + CASE WHEN aged.is_following THEN 0.15 ELSE 0.0 END
          + ((ABS(HASHTEXT(p_user_id::text || aged.id::text || p_seed::text)) % 1000)::float / 1000.0) * LEAST(p_shuffle, 0.15)
          + CASE WHEN aged.hours_age < 4.0 THEN 0.20 ELSE 0.0 END
          + CASE WHEN aged.has_followed_repost
                 THEN LEAST(0.20, 0.08 + 0.04 * aged.followed_reposter_count)
                 ELSE 0.0 END
          -- 544: today's posts the viewer has not seen yet always lead.
          + CASE WHEN aged.user_view_count = 0 AND aged.hours_age < v_fresh_hours
                 THEN v_fresh_bonus ELSE 0.0 END
        )
        WHEN p_tab = 'following' THEN (
          CASE WHEN aged.hours_age < 24.0
            THEN 1.0 - (aged.hours_age / 24.0) * 0.3
            ELSE 0.0
          END
          + LN(1.0 + aged.weighted_engagement) / LN(1.0 + 5000.0) * 0.30
          + EXP(-0.02 * aged.hours_age) * 0.10
        )
        WHEN p_tab = 'bots' THEN
          EXTRACT(EPOCH FROM aged.posted_at) / 1e10
        ELSE 0.0
      END
      * CASE
          WHEN aged.user_view_count = 0 THEN 1.0
          ELSE LEAST(1.0,
            CASE p_tab
              WHEN 'following' THEN
                CASE WHEN aged.user_view_count = 1 THEN 0.75 ELSE 0.50 END
              WHEN 'bots' THEN 1.0
              ELSE
                CASE
                  WHEN aged.user_view_count = 1 THEN 0.55
                  WHEN aged.user_view_count = 2 THEN 0.35
                  ELSE 0.20
                END
            END
            + (1.0 - CASE p_tab
                WHEN 'following' THEN
                  CASE WHEN aged.user_view_count = 1 THEN 0.75 ELSE 0.50 END
                WHEN 'bots' THEN 1.0
                ELSE
                  CASE
                    WHEN aged.user_view_count = 1 THEN 0.55
                    WHEN aged.user_view_count = 2 THEN 0.35
                    ELSE 0.20
                  END
              END)
              * GREATEST(
                  LEAST(aged.days_since_seen / 21.0, 1.0),
                  1.0 - LEAST(aged.hours_age / 72.0, 1.0)
                )
          )
        END AS base_score
    FROM aged
  ),
  turned AS (
    -- 544: older posts take turns between accounts — each author's Nth-best older post
    -- drops (N-1) steps, so every account's best pick precedes anyone's second.
    SELECT
      final_scored.*,
      CASE
        WHEN final_scored.is_older AND v_turn_step > 0 THEN
          final_scored.base_score - v_turn_step * (ROW_NUMBER() OVER (
            PARTITION BY final_scored.user_id, final_scored.is_older
            ORDER BY final_scored.base_score DESC, final_scored.id DESC) - 1)
        ELSE final_scored.base_score
      END AS computed_score
    FROM final_scored
  ),
  ranked AS (
    SELECT
      turned.id,
      turned.surface_type,
      turned.followed_reposter_count,
      turned.latest_reposter_id,
      turned.latest_reposter_name,
      turned.latest_repost_at,
      turned.computed_score
    FROM turned
    WHERE
      (p_cursor_score IS NULL OR p_cursor_id IS NULL)
      OR (turned.computed_score < p_cursor_score)
      OR (turned.computed_score = p_cursor_score AND turned.id < p_cursor_id)
    ORDER BY turned.computed_score DESC, turned.id DESC
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
    ranked.computed_score AS feed_score,
    (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'url', m.image_url, 'display', m.image_url_display,
               'hq', m.image_url_hq, 'thumbhash', m.thumbhash,
               'width', m.width, 'height', m.height) ORDER BY m.position), '[]'::jsonb)
      FROM public.upload_media m WHERE m.upload_id = up.id
    ) AS media,
    up.media_count
  FROM ranked
  JOIN public.uploads up ON up.id = ranked.id
  JOIN public.users u ON u.id = up.user_id
  ORDER BY ranked.computed_score DESC, ranked.id DESC;
END
$$;

-- Re-close the anon grant (492): a (re)definition can drift EXECUTE back open.
revoke execute on function public.get_feed(
  uuid, integer, integer, double precision, double precision, text,
  double precision, uuid, text, text, uuid
) from anon;

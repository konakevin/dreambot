-- Architect security audit (2026-09-10) — RPC identity-spoofing hardening.
--
-- A cluster of SECURITY DEFINER functions take a p_user_id argument and use it to
-- scope a read/write, but never verify the CALLER actually is that user (no
-- auth.uid() check anywhere in the body). Since SECURITY DEFINER bypasses RLS
-- entirely, the function itself is the only access-control layer for these — and
-- it was missing. Concretely this let any authenticated caller (get_feed: even an
-- unauthenticated one, see below) pass an arbitrary victim's uuid and read that
-- victim's personalized feed / notification inbox / dream forensics, or silently
-- mark their inbox seen / delete their notifications.
--
-- Fix pattern: the same self-or-service-role guard already used correctly by
-- charge_sparkles/grant_sparkles/refund_sparkles (migrations 184/258/278) —
--   IF current_setting('role', true) <> 'service_role'
--      AND p_user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION ...
-- — applied to every function below. No signature changes, so CREATE OR REPLACE
-- is safe (no DROP FUNCTION needed per the project's 42P13 rule).
--
-- Functions originally LANGUAGE sql are converted to LANGUAGE plpgsql (the guard
-- needs procedural IF/RAISE) wrapping the identical original query in RETURN QUERY
-- or SELECT ... INTO — no query logic changes, just the language wrapper + guard.

------------------------------------------------------------------------------
-- get_feed — CRITICAL. Migration 488 silently widened the grant to `anon`
-- (previously authenticated-only since this function's origin) with no mention
-- of an access-model change in that migration's own commentary; combined with
-- the missing self-check, this let ANY caller — even unauthenticated — read any
-- user's personalized feed, including private-account posts only their
-- followers should see (SECURITY DEFINER bypasses the uploads RLS that would
-- otherwise block it). Revoke anon, and add the self-check.
------------------------------------------------------------------------------
revoke execute on function public.get_feed(
  uuid, integer, integer, double precision, double precision, text,
  double precision, uuid, text, text, uuid
) from anon;

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
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read feed for a different user';
  END IF;

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

------------------------------------------------------------------------------
-- Notification-inbox IDOR family (HIGH) — get_inbox, mark_inbox_viewed,
-- delete_group, get_group_actors, mark_group_seen, get_new_notification_count,
-- get_unread_notification_count, get_unread_group_count: all trusted p_user_id
-- with zero auth.uid() check, letting any authenticated caller read, seen-mark,
-- or delete another user's notification inbox by passing their uuid.
------------------------------------------------------------------------------
revoke execute on function public.get_inbox(uuid, integer, integer) from anon;
revoke execute on function public.mark_inbox_viewed(uuid) from anon;
revoke execute on function public.delete_group(uuid, text) from anon;
revoke execute on function public.get_group_actors(uuid, text, integer, integer) from anon;
revoke execute on function public.mark_group_seen(uuid, text) from anon;
revoke execute on function public.get_new_notification_count(uuid) from anon;
revoke execute on function public.get_unread_notification_count(uuid) from anon;
revoke execute on function public.get_unread_group_count(uuid) from anon;
revoke execute on function public.get_shareable_vibers(uuid) from anon;

create or replace function public.get_inbox(p_user_id uuid, p_limit integer default 20, p_offset integer default 0)
returns table(
  group_key text, type text, subtype text, category text, preview_actor_ids uuid[],
  preview_usernames text[], preview_avatars text[], actor_count integer, event_count integer,
  upload_id uuid, comment_id uuid, reference_id uuid, upload_image_url text,
  upload_thumbhash text, body text, last_at timestamp with time zone,
  any_unseen boolean, is_new_since_view boolean
)
language plpgsql
stable security definer
set search_path to ''
as $function$
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read inbox for a different user';
  END IF;

  RETURN QUERY
  WITH
    viewer AS (
      SELECT last_inbox_view_at FROM public.users WHERE id = p_user_id
    ),
    mine AS (
      SELECT *
      FROM public.notifications n
      WHERE n.recipient_id = p_user_id
        AND (n.actor_id IS NULL OR NOT public.block_exists(p_user_id, n.actor_id))
        AND NOT (n.type = 'dream_generated' AND COALESCE(n.subtype, '') = 'manual')
    ),
    actor_latest AS (
      SELECT group_key, actor_id, MAX(created_at) AS latest_for_actor
      FROM mine
      GROUP BY group_key, actor_id
    ),
    actor_top3 AS (
      SELECT group_key,
             actor_id,
             latest_for_actor,
             ROW_NUMBER() OVER (PARTITION BY group_key ORDER BY latest_for_actor DESC) AS rn
      FROM actor_latest
    ),
    actor_previews AS (
      SELECT
        a.group_key,
        ARRAY_AGG(a.actor_id ORDER BY a.latest_for_actor DESC) FILTER (WHERE a.rn <= 3) AS preview_actor_ids,
        ARRAY_AGG(u.username ORDER BY a.latest_for_actor DESC) FILTER (WHERE a.rn <= 3) AS preview_usernames,
        ARRAY_AGG(u.avatar_url ORDER BY a.latest_for_actor DESC) FILTER (WHERE a.rn <= 3) AS preview_avatars
      FROM actor_top3 a
      LEFT JOIN public.users u ON u.id = a.actor_id
      GROUP BY a.group_key
    ),
    grouped AS (
      SELECT
        m.group_key,
        MAX(m.created_at)                                       AS last_at,
        BOOL_OR(m.seen_at IS NULL)                              AS any_unseen,
        COUNT(DISTINCT m.actor_id)                              AS actor_count,
        COUNT(*) FILTER (WHERE m.seen_at IS NULL)              AS event_count,
        (ARRAY_AGG(m.type         ORDER BY m.created_at DESC))[1] AS type,
        (ARRAY_AGG(m.subtype      ORDER BY m.created_at DESC))[1] AS subtype,
        (ARRAY_AGG(m.upload_id    ORDER BY m.created_at DESC))[1] AS upload_id,
        (ARRAY_AGG(m.comment_id   ORDER BY m.created_at DESC))[1] AS comment_id,
        (ARRAY_AGG(m.reference_id ORDER BY m.created_at DESC))[1] AS reference_id,
        (ARRAY_AGG(m.body         ORDER BY m.created_at DESC))[1] AS body
      FROM mine m
      GROUP BY m.group_key
    )
  SELECT
    g.group_key,
    g.type,
    g.subtype,
    public.notification_category(g.type)                        AS category,
    p.preview_actor_ids,
    p.preview_usernames,
    p.preview_avatars,
    g.actor_count::int                                          AS actor_count,
    g.event_count::int                                          AS event_count,
    g.upload_id,
    g.comment_id,
    g.reference_id,
    COALESCE(up.image_url_display, up.image_url)                AS upload_image_url,
    up.thumbhash                                                AS upload_thumbhash,
    g.body,
    g.last_at,
    g.any_unseen,
    ((viewer.last_inbox_view_at IS NULL OR g.last_at > viewer.last_inbox_view_at)
      AND g.any_unseen) AS is_new_since_view
  FROM grouped g
  LEFT JOIN actor_previews p ON p.group_key = g.group_key
  LEFT JOIN public.uploads up ON up.id = g.upload_id
  CROSS JOIN viewer
  ORDER BY g.last_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$;

create or replace function public.mark_inbox_viewed(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot update inbox-view state for a different user';
  END IF;

  UPDATE public.users
  SET last_inbox_view_at = now()
  WHERE id = p_user_id;
END;
$function$;

create or replace function public.delete_group(p_user_id uuid, p_group_key text)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot delete notifications for a different user';
  END IF;

  DELETE FROM public.notifications
   WHERE recipient_id = p_user_id
     AND group_key    = p_group_key;
END;
$function$;

create or replace function public.get_group_actors(p_user_id uuid, p_group_key text, p_limit integer default 50, p_offset integer default 0)
returns table(actor_id uuid, username text, avatar_url text, latest_at timestamp with time zone)
language plpgsql
stable security definer
set search_path to ''
as $function$
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read group actors for a different user';
  END IF;

  RETURN QUERY
  SELECT
    n.actor_id,
    u.username,
    u.avatar_url,
    MAX(n.created_at) AS latest_at
  FROM public.notifications n
  LEFT JOIN public.users u ON u.id = n.actor_id
  WHERE n.recipient_id = p_user_id
    AND n.group_key    = p_group_key
  GROUP BY n.actor_id, u.username, u.avatar_url
  ORDER BY latest_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$;

create or replace function public.mark_group_seen(p_user_id uuid, p_group_key text)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot mark notifications seen for a different user';
  END IF;

  UPDATE public.notifications
     SET seen_at = COALESCE(seen_at, now())
   WHERE recipient_id = p_user_id
     AND group_key    = p_group_key;
END;
$function$;

create or replace function public.get_new_notification_count(p_user_id uuid)
returns integer
language plpgsql
stable security definer
set search_path to ''
as $function$
DECLARE v_count integer;
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read notification count for a different user';
  END IF;

  WITH
    viewer AS (SELECT last_inbox_view_at AS lv FROM public.users WHERE id = p_user_id),
    grp AS (
      SELECT
        n.group_key,
        BOOL_OR(n.seen_at IS NULL) AS any_unseen,
        MAX(n.created_at)          AS last_at
      FROM public.notifications n
      WHERE n.recipient_id = p_user_id
        AND NOT (n.type = 'dream_generated' AND COALESCE(n.subtype, '') = 'manual')
      GROUP BY n.group_key
    )
  SELECT COUNT(*)::int INTO v_count
  FROM grp g, viewer v
  WHERE g.any_unseen
    AND (v.lv IS NULL OR g.last_at > v.lv);

  RETURN v_count;
END;
$function$;

create or replace function public.get_unread_notification_count(p_user_id uuid)
returns integer
language plpgsql
stable security definer
set search_path to ''
as $function$
DECLARE v_count integer;
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read notification count for a different user';
  END IF;

  SELECT COUNT(*)::integer INTO v_count
  FROM public.notifications
  WHERE recipient_id = p_user_id
    AND seen_at IS NULL;

  RETURN v_count;
END;
$function$;

create or replace function public.get_unread_group_count(p_user_id uuid)
returns integer
language plpgsql
stable security definer
set search_path to ''
as $function$
DECLARE v_count integer;
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read group count for a different user';
  END IF;

  SELECT count(distinct n.group_key)::int INTO v_count
  FROM public.notifications n
  WHERE n.recipient_id = p_user_id
    AND n.seen_at IS NULL
    AND public.category_enabled_for(p_user_id, public.notification_category(n.type), 'inbox');

  RETURN v_count;
END;
$function$;

create or replace function public.get_shareable_vibers(p_user_id uuid)
returns table(user_id uuid, username text, avatar_url text, interaction_count bigint, vibe_score integer)
language plpgsql
stable security definer
set search_path to ''
as $function$
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read shareable vibers for a different user';
  END IF;

  RETURN QUERY
  SELECT
    u.id AS user_id, u.username, u.avatar_url,
    COALESCE(sc.cnt, 0) AS interaction_count, 0::integer AS vibe_score
  FROM public.follows f_out
  JOIN public.follows f_in
    ON f_in.follower_id = f_out.following_id
   AND f_in.following_id = p_user_id
  JOIN public.users u ON u.id = f_out.following_id
  LEFT JOIN (
    SELECT
      CASE WHEN ps.sender_id = p_user_id THEN ps.receiver_id ELSE ps.sender_id END AS friend_id,
      COUNT(*) AS cnt
    FROM public.post_shares ps
    WHERE ps.sender_id = p_user_id OR ps.receiver_id = p_user_id
    GROUP BY 1
  ) sc ON sc.friend_id = u.id
  WHERE f_out.follower_id = p_user_id
    AND NOT public.block_exists(p_user_id, u.id)
  ORDER BY interaction_count DESC, u.username ASC;
END;
$function$;

------------------------------------------------------------------------------
-- Diagnostic RPCs (HIGH) — no auth check + un-migrated (schema drift). Backfilled
-- here so they're finally under version control, with the same self-or-service
-- guard. dream_forensics_recent otherwise leaks another user's dream-failure
-- forensics; fetch_nightly_history otherwise leaks another user's nightly history.
------------------------------------------------------------------------------
revoke execute on function public.dream_forensics_recent(uuid, integer) from anon;
revoke execute on function public.fetch_nightly_history(uuid) from anon;

create or replace function public.dream_forensics_recent(p_user_id uuid, p_hours integer default 24)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
DECLARE v_result jsonb;
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read dream forensics for a different user';
  END IF;

  SELECT COALESCE(jsonb_agg(row ORDER BY (row->>'pushed_at') DESC), '[]'::jsonb) INTO v_result
  FROM (
    SELECT jsonb_build_object(
      'pushed_at', n.created_at,
      'subtype', n.subtype,
      'body', n.body,
      'job_id', n.reference_id,
      'forensics', CASE WHEN n.reference_id IS NOT NULL
                        THEN public.dream_forensics(n.reference_id)
                        ELSE NULL END
    ) AS row
    FROM notifications n
    WHERE n.recipient_id = p_user_id
      AND n.type = 'dream_failed'
      AND n.created_at >= now() - make_interval(hours => p_hours)
  ) sub;

  RETURN v_result;
END;
$function$;

create or replace function public.fetch_nightly_history(p_user_id uuid)
returns table(created_at timestamp with time zone, rolled_axes jsonb)
language plpgsql
stable security definer
set search_path to 'public'
as $function$
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot read nightly history for a different user';
  END IF;

  RETURN QUERY
  SELECT l.created_at, l.rolled_axes
  FROM public.ai_generation_log l
  WHERE l.user_id = p_user_id
    AND l.rolled_axes->>'engine' LIKE 'nightly-%'
    AND l.created_at >= now() - interval '21 days'
  ORDER BY l.created_at DESC
  LIMIT 21;
END;
$function$;

------------------------------------------------------------------------------
-- record_impression — HIGH. Migration 432's rewrite (moving the view_count bump
-- into a trigger) silently dropped the cross-user guard migration 109 had added
-- ("Reject cross-user impression abuse"). Re-adding it closes the view-count
-- feed-gaming vector this reopened.
------------------------------------------------------------------------------
revoke execute on function public.record_impression(uuid, uuid) from anon;

create or replace function public.record_impression(p_user_id uuid, p_upload_id uuid)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot record impression for a different user';
  END IF;

  INSERT INTO public.post_impressions (user_id, upload_id)
  VALUES (p_user_id, p_upload_id)
  ON CONFLICT (user_id, upload_id)
  DO UPDATE SET
    view_count = public.post_impressions.view_count + 1,
    last_seen = now();
  -- uploads.view_count is maintained by trg_update_view_count (migration 432).
END;
$function$;

------------------------------------------------------------------------------
-- Money RPCs — grant cleanup.
--
-- refund_sparkles (CRITICAL): granted to `authenticated` since migration 185,
-- never revoked, and ZERO app code calls it directly (verified via repo grep) —
-- the only intended caller is server-side refund flows. It has no check that a
-- job actually failed, so a client calling it directly after a dream finishes
-- rendering refunds the charge while keeping the delivered image. Restrict to
-- service_role only; refund-self-moderation (tightened separately, edge
-- function) remains the one legitimate client-triggered refund path.
--
-- charge_sparkles / grant_sparkles / spend_sparkles / gift_sparkles /
-- reconcile_sparkles: each already has the correct internal self-or-service
-- guard, so an anon caller (auth.uid() IS NULL) is already rejected at the
-- exception — but all five are currently ALSO granted to `anon`, which serves
-- no legitimate purpose (an unauthenticated caller can never pass the guard) and
-- is needless attack surface. Revoking anon is pure hardening, no behavior
-- change for any real caller.
------------------------------------------------------------------------------
revoke execute on function public.refund_sparkles(uuid, integer, text, uuid) from authenticated, anon;

revoke execute on function public.charge_sparkles(uuid, integer, text, uuid) from anon;
revoke execute on function public.grant_sparkles(uuid, integer, text) from anon;
revoke execute on function public.spend_sparkles(uuid, integer, text, uuid) from anon;
revoke execute on function public.gift_sparkles(uuid, integer, text, uuid) from anon;
revoke execute on function public.reconcile_sparkles(uuid) from anon;

------------------------------------------------------------------------------
-- ensure_dream_generated_notification — migration 343 originally restricted
-- this to service_role only (REVOKE ALL FROM public; GRANT TO service_role).
-- Live ACL currently shows anon+authenticated ALSO have EXECUTE (drifted back
-- open at some point — the exact "Supabase re-grants EXECUTE to anon/
-- authenticated by default on any (re)defined function unless explicitly
-- revoked again" footgun this audit found elsewhere). The two real call sites
-- (generate-dream, restyle-photo) both run server-side with service-role
-- clients; the client-facing equivalent is request_dream_notification, which
-- correctly derives the actor from auth.uid() rather than a parameter. Re-close
-- the drift.
------------------------------------------------------------------------------
revoke execute on function public.ensure_dream_generated_notification(uuid, uuid, text) from anon, authenticated;

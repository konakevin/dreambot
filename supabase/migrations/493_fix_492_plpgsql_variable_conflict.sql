-- 493_fix_492_plpgsql_variable_conflict.sql — HOTFIX: inbox RPCs broken by migration 492 (2026-09-11).
--
-- 492 converted these SECURITY DEFINER functions from LANGUAGE sql to plpgsql (RETURN QUERY) to add the
-- self-or-service-role guard, but omitted `#variable_conflict use_column`. In plpgsql every RETURNS TABLE
-- output column is a VARIABLE, so an unqualified reference to `group_key` / `type` / `upload_id` … inside
-- the query is ambiguous → every call failed at runtime:
--   ERROR 42702: column reference "group_key" is ambiguous (get_inbox, from ~21:19Z on 2026-09-10)
-- The client hook threw, TanStack retried, the inbox screen fell through to "All caught up" while the
-- badge (get_new_notification_count, a scalar function, unaffected) still counted the unseen rows.
-- Same defect class in the other three RETURNS TABLE conversions (get_group_actors, get_shareable_vibers,
-- fetch_nightly_history): fixed here the same way whether or not each currently trips it.
--
-- Fix: the identical 492 definitions (guard + body, no logic change) with `#variable_conflict use_column`
-- as the first line of each body — the directive get_feed (488/492) already carries. Grants from 492 are
-- preserved by CREATE OR REPLACE. Locked by __tests__/lib/plpgsqlVariableConflictGuard.test.ts.

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
#variable_conflict use_column
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

create or replace function public.get_group_actors(p_user_id uuid, p_group_key text, p_limit integer default 50, p_offset integer default 0)
returns table(actor_id uuid, username text, avatar_url text, latest_at timestamp with time zone)
language plpgsql
stable security definer
set search_path to ''
as $function$
#variable_conflict use_column
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

create or replace function public.get_shareable_vibers(p_user_id uuid)
returns table(user_id uuid, username text, avatar_url text, interaction_count bigint, vibe_score integer)
language plpgsql
stable security definer
set search_path to ''
as $function$
#variable_conflict use_column
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

create or replace function public.fetch_nightly_history(p_user_id uuid)
returns table(created_at timestamp with time zone, rolled_axes jsonb)
language plpgsql
stable security definer
set search_path to 'public'
as $function$
#variable_conflict use_column
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

-- 358_inbox_event_count_unseen_only.sql (2026-07-10)
--
-- "N dreams are ready" should count only dreams the user HASN'T viewed yet.
--
-- A day's manual (Create-screen) dreams share one group_key (migration 340), so
-- a queued batch collapses into one inbox row whose event_count drives the
-- "N dreams are ready" copy + the scoped pager. But event_count was COUNT(*) —
-- EVERY dream in the day-group, including ones the user already viewed. So a
-- user who dreamed a few (viewed them), then dreamed a few more, saw the count
-- balloon to include the old, already-seen dreams (Kevin 2026-07-10).
--
-- Fix: event_count = COUNT of UNSEEN rows (seen_at IS NULL). seen_at is set when
-- a dream is viewed — the Dreams-tab auto-acknowledge (migration 340) AND, as of
-- the companion client change, when the user opens the aggregated notification
-- itself. So a viewed dream drops out of the count and never reappears in a
-- later aggregate.
--
-- Safe for every OTHER type: seen_at is only ever set on dream_generated rows,
-- so for likes/reposts/etc. `FILTER (WHERE seen_at IS NULL)` == COUNT(*) — the
-- value is unchanged. event_count's only consumers are the dream-ready copy and
-- the scoped-album gate (both dream-only), so this is a pure value refinement.
--
-- Return type is byte-identical to migration 340 → CREATE OR REPLACE (no DROP,
-- no type regen needed).

BEGIN;

CREATE OR REPLACE FUNCTION public.get_inbox(
  p_user_id  uuid,
  p_limit    integer DEFAULT 20,
  p_offset   integer DEFAULT 0
)
RETURNS TABLE(
  group_key             text,
  type                  text,
  subtype               text,
  category              text,
  preview_actor_ids     uuid[],
  preview_usernames     text[],
  preview_avatars       text[],
  actor_count           integer,
  event_count           integer,
  upload_id             uuid,
  comment_id            uuid,
  reference_id          uuid,
  upload_image_url      text,
  upload_thumbhash      text,
  body                  text,
  last_at               timestamptz,
  any_unseen            boolean,
  is_new_since_view     boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  WITH
    viewer AS (
      SELECT last_inbox_view_at FROM public.users WHERE id = p_user_id
    ),
    mine AS (
      SELECT *
      FROM public.notifications n
      WHERE n.recipient_id = p_user_id
        AND (n.actor_id IS NULL OR NOT public.block_exists(p_user_id, n.actor_id))
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
        -- Only UNSEEN rows count toward "N dreams are ready" (migration 358).
        -- For non-dream types seen_at is always NULL, so this equals COUNT(*).
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
$$;

GRANT EXECUTE ON FUNCTION public.get_inbox(uuid, integer, integer) TO authenticated;

COMMIT;

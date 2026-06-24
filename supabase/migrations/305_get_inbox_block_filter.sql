-- Migration 305: filter blocked users out of the grouped inbox (get_inbox).
--
-- Audit gap (2026-06-23): block enforcement was added to the OLD ungrouped
-- `get_notifications` RPC (migration 187), but the app's inbox uses the grouped
-- `get_inbox` RPC (migration 223), which had NO block filter. Result: after you
-- block someone, their PAST notifications (a like / comment / follow from before
-- the block) still show in your inbox. New events are already prevented by the
-- restrictive RLS policies (migration 186 — a blocked user can't insert a like /
-- comment / follow), so this only leaks pre-block history, but that's still the
-- "blocked = invisible" expectation broken.
--
-- Fix: drop blocked actors at the source `mine` CTE so every downstream grouping,
-- preview and count excludes them. block_exists() is bidirectional (covers both
-- "I blocked them" and "they blocked me"). System notifications have a NULL
-- actor_id (welcome gift, dream-ready) — those are kept (NULL is never blocked).
--
-- This is a pure CREATE OR REPLACE of the migration-223 definition with one added
-- WHERE condition in `mine`; everything else is byte-identical.

CREATE OR REPLACE FUNCTION public.get_inbox(
  p_user_id  uuid,
  p_limit    integer DEFAULT 20,
  p_offset   integer DEFAULT 0
)
RETURNS TABLE(
  group_key             text,
  type                  text,
  category              text,
  preview_actor_ids     uuid[],
  preview_usernames     text[],
  preview_avatars       text[],
  actor_count           integer,
  upload_id             uuid,
  comment_id            uuid,
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
        -- Hide notifications from a blocked user (either direction). NULL
        -- actor_id (system notifications) is never blocked, so it's kept.
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
        (ARRAY_AGG(m.type        ORDER BY m.created_at DESC))[1] AS type,
        (ARRAY_AGG(m.upload_id   ORDER BY m.created_at DESC))[1] AS upload_id,
        (ARRAY_AGG(m.comment_id  ORDER BY m.created_at DESC))[1] AS comment_id,
        (ARRAY_AGG(m.body        ORDER BY m.created_at DESC))[1] AS body
      FROM mine m
      GROUP BY m.group_key
    )
  SELECT
    g.group_key,
    g.type,
    public.notification_category(g.type)                        AS category,
    p.preview_actor_ids,
    p.preview_usernames,
    p.preview_avatars,
    g.actor_count::int                                          AS actor_count,
    g.upload_id,
    g.comment_id,
    COALESCE(up.image_url_display, up.image_url)                AS upload_image_url,
    up.thumbhash                                                AS upload_thumbhash,
    g.body,
    g.last_at,
    g.any_unseen,
    -- True when this group's most-recent event happened after the user's
    -- last inbox open. Drives the "new" pip badge on the row. NULL
    -- last_inbox_view_at (never opened inbox) → everything is new.
    (viewer.last_inbox_view_at IS NULL OR g.last_at > viewer.last_inbox_view_at) AS is_new_since_view
  FROM grouped g
  LEFT JOIN actor_previews p ON p.group_key = g.group_key
  LEFT JOIN public.uploads up ON up.id = g.upload_id
  CROSS JOIN viewer
  ORDER BY g.last_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

GRANT EXECUTE ON FUNCTION public.get_inbox(uuid, integer, integer) TO authenticated;

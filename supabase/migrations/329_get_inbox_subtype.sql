-- 329_get_inbox_subtype.sql (2026-07-05)
--
-- get_inbox never returned `subtype`, so every client branch that reads
-- InboxGroup.subtype has been DEAD since it was written:
--   • dream_generated: `subtype === 'manual'` → "The dream you made" never
--     fired — Create-screen dreams showed "Last night's dream" (the bug
--     Kevin reported 2026-07-05)
--   • dream_failed: the 'rejected' (NSFW re-prompt) and 'nightly_failed'
--     alert branches in app/inbox.tsx handleTap never fired — every failure
--     fell through to the generic retry alert
--   • trial/pro reminder rows were unaffected (their body IS the subject)
--
-- Fix: re-create get_inbox with `subtype` in the return set, taken from the
-- group's newest row (same ARRAY_AGG-first pattern as type/body). Function is
-- otherwise byte-identical to migration 305's version (block filter intact).
--
-- After applying: regenerate types (supabase gen types typescript) — the
-- client hook (useInboxGrouped mapRow) already reads row.subtype and
-- null-coalesces, so old clients keep working and new clients light up.

BEGIN;

DROP FUNCTION IF EXISTS public.get_inbox(uuid, integer, integer);

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
        (ARRAY_AGG(m.subtype     ORDER BY m.created_at DESC))[1] AS subtype,
        (ARRAY_AGG(m.upload_id   ORDER BY m.created_at DESC))[1] AS upload_id,
        (ARRAY_AGG(m.comment_id  ORDER BY m.created_at DESC))[1] AS comment_id,
        (ARRAY_AGG(m.body        ORDER BY m.created_at DESC))[1] AS body
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

COMMIT;

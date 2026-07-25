-- 398_nightly_inbox_null_subtype_fix.sql (2026-07-25)
--
-- BUGFIX — nightly dreams silently vanished from the inbox + badge.
--
-- Migration 396 filtered user-created dreams out of get_inbox +
-- get_new_notification_count with:
--
--     AND NOT (n.type = 'dream_generated' AND n.subtype = 'manual')
--
-- That assumed nightly dreams carry a NON-NULL subtype. They don't: the nightly
-- render (dream-queue-worker/dispatchers/nightly.ts) inserts the dream_generated
-- row with NO subtype → subtype IS NULL. In SQL three-valued logic:
--
--     NULL = 'manual'            -> NULL   (not FALSE!)
--     TRUE AND NULL              -> NULL
--     NOT NULL                   -> NULL
--     WHERE ... NULL             -> excluded
--
-- So every NULL-subtype nightly dream was ALSO filtered out — hidden from the
-- inbox list AND the unread badge. (Manual dreams set subtype='manual'
-- explicitly since migration 343, so those filtered correctly; only nightly,
-- relying on the implicit NULL, got trapped.) Confirmed live 2026-07-25: 95
-- nightly notifications over 4 days, get_inbox returned 0 dream rows for
-- affected users. Nightly is a PAID feature — these must never be missed.
--
-- THE PUSH is unaffected by this file (it fires off the notifications INSERT
-- trigger, not these read functions) — the push suppression bug is fixed
-- separately in send-push. This file fixes the IN-APP inbox + badge.
--
-- THE FIX (two layers, defense in depth):
--   1. NULL-SAFE FILTER — compare with COALESCE(subtype,'') so a NULL subtype is
--      treated as "not manual" (kept), never trapped by three-valued logic. This
--      alone restores every existing + future nightly row.
--   2. BACKFILL — set the historical NULL-subtype nightly rows to an EXPLICIT
--      subtype='nightly' so the data is honest and self-documenting (and the
--      companion edge fix makes new nightly inserts explicit too). No more
--      "NULL implicitly means nightly."
--
-- Bias note: the filter is a NEGATIVE filter (exclude manual; show everything
-- else). For a notification inbox that is the SAFE direction — a new/unknown
-- dream_generated subtype would fail OPEN (shown), never silently hidden. We
-- would rather show a notification we didn't intend than miss a paid one.
--
-- Return types are byte-identical to migrations 358 / 359 / 396 → CREATE OR
-- REPLACE, no DROP, no type regen needed. Re-runnable.

BEGIN;

-- ── Backfill: legacy NULL-subtype dream_generated rows are all nightly ───────
-- Manual dreams have carried an explicit subtype='manual' since migration 343,
-- so any dream_generated with a NULL subtype is a nightly (or pre-343) auto
-- dream. Make them explicit. Idempotent (re-running matches nothing).
UPDATE public.notifications
SET subtype = 'nightly'
WHERE type = 'dream_generated' AND subtype IS NULL;

-- ── get_inbox: NULL-safe manual filter ───────────────────────────────────────
-- Body identical to migration 396 EXCEPT the filter now uses COALESCE so a
-- NULL subtype can't be trapped by three-valued logic.
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
        -- USER-CREATED (Create-screen) dreams are surfaced by the render dock +
        -- Dreams album, not the inbox (migration 396). NIGHTLY dreams stay (not
        -- in the dock; the inbox row + push is their signal), as does
        -- dream_FAILED. COALESCE keeps this NULL-SAFE: a NULL subtype is "not
        -- manual" → kept, never trapped by three-valued logic (migration 398).
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
$$;

GRANT EXECUTE ON FUNCTION public.get_inbox(uuid, integer, integer) TO authenticated;

-- ── get_new_notification_count: NULL-safe manual filter ─────────────────────
CREATE OR REPLACE FUNCTION public.get_new_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH
    viewer AS (SELECT last_inbox_view_at AS lv FROM public.users WHERE id = p_user_id),
    grp AS (
      SELECT
        n.group_key,
        BOOL_OR(n.seen_at IS NULL) AS any_unseen,
        MAX(n.created_at)          AS last_at
      FROM public.notifications n
      WHERE n.recipient_id = p_user_id
        -- User-created dreams don't badge (dock + album signal them). Nightly
        -- dreams + dream_FAILED still count. NULL-safe via COALESCE so a nightly
        -- (NULL subtype) is never trapped out of the badge (migration 398).
        AND NOT (n.type = 'dream_generated' AND COALESCE(n.subtype, '') = 'manual')
      GROUP BY n.group_key
    )
  SELECT COUNT(*)::int
  FROM grp g, viewer v
  WHERE g.any_unseen
    AND (v.lv IS NULL OR g.last_at > v.lv);
$$;

GRANT EXECUTE ON FUNCTION public.get_new_notification_count(uuid) TO authenticated;

COMMIT;

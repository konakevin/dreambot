-- 396_dreams_out_of_inbox.sql (2026-07-23)
--
-- DECISION — USER-CREATED dreams leave the inbox. The render dock (in-app
-- "cooking" rings) + the Dreams album now signal the dreams a user makes on the
-- Create screen, so those no longer clutter the social inbox. This filters
-- type='dream_generated' AND subtype='manual' out of BOTH get_inbox (the list)
-- and get_new_notification_count (the badge). Dreams are CONTENT, not activity
-- (Kevin 2026-07-23).
--
-- KEPT ON PURPOSE:
--   • NIGHTLY dreams (subtype <> 'manual') — they arrive while the user is
--     away/asleep and are NOT in the dock, so the inbox row (+ its morning push)
--     is their signal. They stay in the inbox + badge.
--   • dream_FAILED — a failed dream has no album tile and the dock flash is
--     transient, so it needs a durable "it failed + you were refunded" signal.
--
-- THE PUSH IS UNCHANGED. The completion push for a queued-and-left dream is fired
-- by the trigger on the notifications INSERT (migration 196) → send-push. We
-- still INSERT the dream_generated row, so "Queue This → we'll notify you" keeps
-- working when the app is CLOSED (the dock only helps in-app). We just stop
-- SURFACING that row in the inbox list + badge — it becomes, in effect, a
-- push-delivery record.
--
-- FILTER-FOR-NOW / FUTURE DIRECTION (if we revisit):
--   1. DECOUPLE the push from the inbox row — fire the completion push from a
--      dedicated path and stop inserting the dream_generated notification at all
--      (cleaner than keeping an invisible row just to trigger the push).
--   2. Add an album "new since last viewed" tile indicator (track a
--      last_dreams_view_at; badge tiles newer than it) so the album itself
--      explains new dreams — the intended companion to this change.
--   The Dreams-tab auto-acknowledge (migration 340) + the dream-individual badge
--   counting (359) are now vestigial (dreams no longer badge) but harmless;
--   remove them alongside (1)/(2).
--
-- Return types are byte-identical to migrations 358 / 359 → CREATE OR REPLACE,
-- no DROP, no type regen needed.

BEGIN;

-- ── get_inbox: drop dream_generated from the grouped list ────────────────────
-- Body identical to migration 358 EXCEPT the one added filter in `mine`.
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
        -- Dreams album now, not the inbox (migration 396). NIGHTLY dreams stay
        -- (not in the dock; the inbox row + push is their signal), as does
        -- dream_FAILED.
        AND NOT (n.type = 'dream_generated' AND n.subtype = 'manual')
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

-- ── get_new_notification_count: drop user-created dreams from the badge ──────
-- With user-created dreams excluded, this counts 1-per-group. Nightly dreams
-- remain (one per night, unique group_key), so each still badges as 1 until
-- viewed (the dream-individual counting from migration 359 was only needed for
-- manual bursts, which no longer badge).
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
        -- dreams + dream_FAILED still count (migration 396).
        AND NOT (n.type = 'dream_generated' AND n.subtype = 'manual')
      GROUP BY n.group_key
    )
  SELECT COUNT(*)::int
  FROM grp g, viewer v
  WHERE g.any_unseen
    AND (v.lv IS NULL OR g.last_at > v.lv);
$$;

GRANT EXECUTE ON FUNCTION public.get_new_notification_count(uuid) TO authenticated;

COMMIT;

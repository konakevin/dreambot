-- 340_dream_notification_aggregation.sql (2026-07-07)
--
-- Reduce dream-notification fatigue (Kevin): a user who queues several dreams
-- and waits gets one red badge per dream and one inbox row per dream, even when
-- they're sitting on Profile → Dreams watching each one arrive.
--
-- Three changes, all pure function redefinitions (no schema/columns — seen_at,
-- group_key, subtype already exist; seen_at has been a dead column since the
-- 223 timestamp-badge migration, so re-activating it is a no-op for every other
-- type):
--
--   1. notification_group_key — a day's MANUAL (Create-screen) dream_generated
--      notifications share one group_key, so they collapse into a single inbox
--      row ("N dreams are ready"). Nightly / welcome / first-dream keep their
--      own per-row key (their copy is special and they're ~one per day).
--
--   2. get_new_notification_count — count DISTINCT groups with new + unseen
--      activity, not raw rows. So an aggregated "5 dreams" is ONE badge unit
--      (matching the single inbox row it renders as — the _layout.tsx comment
--      already called this the "distinct-group badge"; the SQL just never was),
--      AND a per-row seen flag (used by the Dreams-tab auto-acknowledge) drops
--      that row out of the count.
--
--   3. get_inbox — return event_count (rows per group) for the "N dreams are
--      ready" copy, and gate the "new" pip on an unseen row too (so a dream the
--      client auto-acknowledged while on the Dreams tab shows no pip).
--
-- After applying: regenerate types (supabase gen types typescript) — get_inbox
-- gains an event_count column.

BEGIN;

-- ── 1. group_key: aggregate a day's manual dreams ───────────────────────────
-- Signature changes (adds p_subtype + p_created_at, both needed to bucket
-- manual dreams by recipient+day), so DROP the old one first.
DROP FUNCTION IF EXISTS public.notification_group_key(uuid, text, uuid, uuid, uuid);

CREATE FUNCTION public.notification_group_key(
  p_id           uuid,
  p_type         text,
  p_subtype      text,
  p_recipient_id uuid,
  p_upload_id    uuid,
  p_comment_id   uuid,
  p_created_at   timestamptz
) RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE
    -- Manual (Create-screen) dreams: bucket by recipient + UTC day so a batch
    -- the user queued collapses into ONE inbox row. UTC-day keeps the function
    -- IMMUTABLE (no session-tz dependency).
    WHEN p_type = 'dream_generated' AND p_subtype = 'manual'
      THEN 'dream:' || p_recipient_id::text || ':'
                    || ((p_created_at AT TIME ZONE 'UTC')::date)::text
    ELSE (
      CASE p_type
        -- ── aggregating types — key = "kind:target" so siblings collapse ──
        WHEN 'post_like'        THEN 'like:post:'        || COALESCE(p_upload_id::text,  p_id::text)
        WHEN 'comment_like'     THEN 'clike:comment:'    || COALESCE(p_comment_id::text, p_id::text)
        WHEN 'post_twin'        THEN 'twin:post:'        || COALESCE(p_upload_id::text,  p_id::text)
        WHEN 'post_fuse'        THEN 'fuse:post:'        || COALESCE(p_upload_id::text,  p_id::text)
        WHEN 'post_milestone'   THEN 'milestone:post:'   || COALESCE(p_upload_id::text,  p_id::text)
        WHEN 'follow_accepted'  THEN 'follow:'           || p_recipient_id::text
        WHEN 'friend_accepted'  THEN 'friend:'           || p_recipient_id::text
        -- ── individual types — key is the row's own id (never collapses) ──
        WHEN 'post_comment'     THEN 'comment:'          || p_id::text
        WHEN 'comment_reply'    THEN 'reply:'            || p_id::text
        WHEN 'comment_mention'  THEN 'mention:'          || p_id::text
        WHEN 'post_share'       THEN 'share:'            || p_id::text
        WHEN 'follow_request'   THEN 'freq:'             || p_id::text
        WHEN 'friend_request'   THEN 'frreq:'            || p_id::text
        -- Nightly / welcome / first-dream dreams stay per-row (special copy).
        WHEN 'dream_generated'  THEN 'dream:'            || p_id::text
        WHEN 'dream_failed'     THEN 'dreamfail:'        || p_id::text
        WHEN 'download_ready'   THEN 'download:'         || p_id::text
        ELSE                         'system:'           || p_id::text
      END
    )
  END;
$$;

-- Trigger now threads subtype + created_at into the key.
CREATE OR REPLACE FUNCTION public.set_notification_group_key()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.group_key IS NULL THEN
    NEW.group_key := public.notification_group_key(
      NEW.id, NEW.type, NEW.subtype, NEW.recipient_id, NEW.upload_id, NEW.comment_id,
      COALESCE(NEW.created_at, now())
    );
  END IF;
  RETURN NEW;
END;
$$;
-- Trigger definition itself is unchanged (still BEFORE INSERT → set_notification_group_key).

-- ── 2. badge count: distinct new+unseen groups ──────────────────────────────
-- Was: COUNT(*) of rows created since last_inbox_view_at (so 5 dreams = 5).
-- Now: COUNT of distinct group_keys whose latest event is after last view AND
-- which still have an unseen row. Aligns the badge with the aggregated inbox
-- rows AND lets the Dreams-tab auto-ack (per-row seen_at) suppress a dream.
CREATE OR REPLACE FUNCTION public.get_new_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH viewer AS (SELECT last_inbox_view_at FROM public.users WHERE id = p_user_id)
  SELECT COUNT(*)::int
  FROM (
    SELECT n.group_key
    FROM public.notifications n
    WHERE n.recipient_id = p_user_id
    GROUP BY n.group_key
    HAVING BOOL_OR(n.seen_at IS NULL)
       AND (
         (SELECT last_inbox_view_at FROM viewer) IS NULL
         OR MAX(n.created_at) > (SELECT last_inbox_view_at FROM viewer)
       )
  ) g;
$$;

GRANT EXECUTE ON FUNCTION public.get_new_notification_count(uuid) TO authenticated;

-- ── 3. get_inbox: event_count + unseen-gated "new" pip ──────────────────────
-- Byte-identical to migration 336 EXCEPT: adds event_count (COUNT(*) per group)
-- and requires an unseen row for is_new_since_view. Return type changes → DROP.
DROP FUNCTION IF EXISTS public.get_inbox(uuid, integer, integer);

CREATE FUNCTION public.get_inbox(
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
        COUNT(*)                                               AS event_count,
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
    -- New since last inbox open AND still has an unseen row. The unseen gate is
    -- what lets a Dreams-tab auto-acknowledged dream (seen_at set) show no pip.
    -- For every other type seen_at is always NULL, so any_unseen is always true
    -- and this is unchanged from migration 336.
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

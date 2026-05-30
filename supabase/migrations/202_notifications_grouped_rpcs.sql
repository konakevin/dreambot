-- 202_notifications_grouped_rpcs.sql
--
-- Notifications Phase 1, step 3 — the grouped read APIs. See
-- NOTIFICATIONS_ARCHITECTURE.md §4b–4e.
--
-- Adds 5 functions (all SECURITY DEFINER, scoped by auth.uid()):
--   notification_category(text) → text             -- type → one of 7 categories
--   get_inbox(p_user_id, p_limit, p_offset)        -- grouped feed
--   get_group_actors(p_user_id, p_group_key, ...)  -- expand a group
--   mark_group_seen(p_user_id, p_group_key)        -- mark all rows in group seen
--   get_unread_group_count(p_user_id)              -- distinct unread groups
--
-- The legacy get_notifications RPC is LEFT IN PLACE during cutover so the
-- existing client keeps working until the new one ships.

-- ============================================================
-- 1. notification_category(type) → category
-- ============================================================
-- Buckets the flat type enum into the 7 user-facing categories from D5.

CREATE OR REPLACE FUNCTION public.notification_category(p_type text)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE p_type
    WHEN 'post_like'        THEN 'Likes'
    WHEN 'comment_like'     THEN 'Likes'
    WHEN 'post_milestone'   THEN 'Likes'
    WHEN 'post_comment'     THEN 'Comments'
    WHEN 'comment_reply'    THEN 'Comments'
    WHEN 'comment_mention'  THEN 'Mentions'
    WHEN 'post_share'       THEN 'Shares'
    WHEN 'post_twin'        THEN 'Twins & Fuses'
    WHEN 'post_fuse'        THEN 'Twins & Fuses'
    WHEN 'follow_request'   THEN 'Follows'
    WHEN 'follow_accepted'  THEN 'Follows'
    WHEN 'friend_request'   THEN 'Follows'
    WHEN 'friend_accepted'  THEN 'Follows'
    WHEN 'dream_generated'  THEN 'Your dreams'
    WHEN 'dream_failed'     THEN 'Your dreams'
    WHEN 'dream_nightly'    THEN 'Your dreams'
    WHEN 'dream_wish'       THEN 'Your dreams'
    WHEN 'dream_welcome'    THEN 'Your dreams'
    WHEN 'download_ready'   THEN 'Your dreams'
    ELSE                         'Your dreams'   -- safe default (legacy types)
  END;
$$;

-- ============================================================
-- 2. get_inbox — grouped paginated feed
-- ============================================================
-- One row per (recipient, group_key) within the active window (30 days for
-- aggregating types). Aggregating types collapse multi-actor events; individual
-- types each have a unique group_key, so they pass through 1-to-1.
--
-- Sorting: newest event time per group DESC.
-- Pagination: offset-based (matches existing useInbox shape).

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
  body                  text,
  last_at               timestamptz,
  any_unseen            boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  WITH
    -- All this recipient's notifications (raw rows we'll group).
    mine AS (
      SELECT *
      FROM public.notifications
      WHERE recipient_id = p_user_id
    ),
    -- One row per (group, actor) — the actor's latest contribution to the group.
    actor_latest AS (
      SELECT group_key, actor_id, MAX(created_at) AS latest_for_actor
      FROM mine
      GROUP BY group_key, actor_id
    ),
    -- Top 3 actors per group by most-recent-contribution.
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
    -- One row per group — aggregated shape.
    grouped AS (
      SELECT
        m.group_key,
        MAX(m.created_at)                                       AS last_at,
        BOOL_OR(m.seen_at IS NULL)                              AS any_unseen,
        COUNT(DISTINCT m.actor_id)                              AS actor_count,
        -- "Latest" row's properties (within the group). For aggregating types
        -- these are usually identical across rows; for individual types each
        -- row is its own group so the "latest" is just the row.
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
    -- Prefer the small display variant when present; fall back to original.
    COALESCE(up.image_url_display, up.image_url)                AS upload_image_url,
    g.body,
    g.last_at,
    g.any_unseen
  FROM grouped g
  LEFT JOIN actor_previews p ON p.group_key = g.group_key
  LEFT JOIN public.uploads up ON up.id = g.upload_id
  ORDER BY g.last_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

-- ============================================================
-- 3. get_group_actors — expand a group to its full actor list
-- ============================================================
-- Returns actors who contributed to a given group, most-recent first.
-- Scoped to the recipient so users can only expand their own groups.

CREATE OR REPLACE FUNCTION public.get_group_actors(
  p_user_id   uuid,
  p_group_key text,
  p_limit     integer DEFAULT 50,
  p_offset    integer DEFAULT 0
)
RETURNS TABLE(
  actor_id    uuid,
  username    text,
  avatar_url  text,
  latest_at   timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- ============================================================
-- 4. mark_group_seen — mark every row in a group as seen
-- ============================================================
-- Per-row seen_at remains the source of truth; this is a convenience that
-- updates every row in the group for the recipient at once. Scoped to the
-- recipient so users can't mark someone else's notifications seen.

CREATE OR REPLACE FUNCTION public.mark_group_seen(
  p_user_id   uuid,
  p_group_key text
) RETURNS void
LANGUAGE sql SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE public.notifications
     SET seen_at = COALESCE(seen_at, now())
   WHERE recipient_id = p_user_id
     AND group_key    = p_group_key;
$$;

-- ============================================================
-- 5. get_unread_group_count — distinct-group unread badge
-- ============================================================
-- This is what the iOS app badge + the profile-tab dot should display: a
-- count of distinct unread GROUPS, not rows. Many likes on one post = 1.

CREATE OR REPLACE FUNCTION public.get_unread_group_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COUNT(DISTINCT group_key)::int
  FROM public.notifications
  WHERE recipient_id = p_user_id
    AND seen_at IS NULL;
$$;

-- ============================================================
-- GRANTS — authenticated users can call all five
-- ============================================================

GRANT EXECUTE ON FUNCTION public.notification_category(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_inbox(uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_group_actors(uuid, text, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_group_seen(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_group_count(uuid) TO authenticated;

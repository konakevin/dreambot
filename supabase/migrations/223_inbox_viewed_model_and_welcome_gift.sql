-- 223_inbox_viewed_model_and_welcome_gift.sql
--
-- Inbox UX simplification (2026-06-04):
--
--   1. "Viewed = read" model. The act of opening the inbox marks every
--      visible notification as seen — no per-row mark-as-seen state to
--      maintain. Implemented via users.last_inbox_view_at + a
--      mark_inbox_viewed() RPC the client fires once on inbox focus.
--      Per-row dot/highlight (anyUnseen) goes away on the client side;
--      replaced with an is_new_since_view boolean computed from
--      notification.created_at > users.last_inbox_view_at.
--
--   2. New get_inbox column: is_new_since_view BOOLEAN. The inbox row
--      shows a small "new" pip on top of the type icon when true.
--
--   3. New get_new_notification_count() RPC. Replaces the old
--      "unread group count" notion — same call signature, different
--      semantics. Returns count of notifications created since the
--      user's last_inbox_view_at. The tab/profile badge consumes this.
--      The legacy get_unread_group_count() is LEFT IN PLACE during
--      cutover so the existing client keeps working until the new one
--      ships, then can be dropped in a follow-up.
--
--   4. Comment notification body cap: LEFT(NEW.body, 100) →
--      LEFT(NEW.body, 28). The inbox row's subtext renders single-line
--      without ellipsis, so the stored body must fit. 28 chars is the
--      single-line budget on a small phone (iPhone SE width minus
--      avatar + thumbnail + time column). Existing rows are NOT
--      retroactively truncated — only new inserts via the trigger.
--
--   5. New notification type 'welcome_gift'. Inserted at onboarding
--      completion when the 25-sparkle welcome grant fires. Routes to
--      /welcome-gift on tap. Distinct from the existing
--      dream_generated/welcome subtype (which is the first-dream
--      onboarding ping, different intent).
--
-- DROP + CREATE get_inbox because Postgres won't add a column to a
-- RETURNS TABLE in place. Body otherwise identical to migration 220 —
-- only the new is_new_since_view column was added (return shape +
-- final SELECT). Also pulls in users.last_inbox_view_at via a LEFT
-- JOIN to compute is_new_since_view per row.

-- ── 1. users.last_inbox_view_at ──
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS last_inbox_view_at TIMESTAMPTZ;

-- ── 2. mark_inbox_viewed RPC ──
CREATE OR REPLACE FUNCTION public.mark_inbox_viewed(p_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE public.users
  SET last_inbox_view_at = now()
  WHERE id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.mark_inbox_viewed(uuid) TO authenticated;

-- ── 3. get_new_notification_count RPC ──
-- Count of notifications created since the user's last_inbox_view_at.
-- NULL last_inbox_view_at (user has never opened inbox) → count all.
CREATE OR REPLACE FUNCTION public.get_new_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COUNT(*)::int
  FROM public.notifications n
  LEFT JOIN public.users u ON u.id = n.recipient_id
  WHERE n.recipient_id = p_user_id
    AND (u.last_inbox_view_at IS NULL OR n.created_at > u.last_inbox_view_at);
$$;

GRANT EXECUTE ON FUNCTION public.get_new_notification_count(uuid) TO authenticated;

-- ── 4. notification_category — register welcome_gift ──
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
    WHEN 'download_ready'   THEN 'Your dreams'
    WHEN 'trial_reminder'   THEN 'Your dreams'
    WHEN 'pro_reminder'     THEN 'Your dreams'
    WHEN 'welcome_gift'     THEN 'Your dreams'
    ELSE 'Other'
  END;
$$;

-- ── 5. Comment trigger cap 100 → 28 ──
-- Re-replace the comment-notify trigger function with the tighter cap.
-- Body otherwise byte-identical to migration 200's version.
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_upload_owner_id uuid;
  v_parent_author_id uuid;
  v_mentioned_user_id uuid;
  v_mention_handle text;
  v_max_mentions int := 5;
  v_mention_count int := 0;
BEGIN
  -- Look up the upload owner.
  SELECT user_id INTO v_upload_owner_id
  FROM public.uploads
  WHERE id = NEW.upload_id;

  -- Notify the post owner (skip if they're the commenter).
  IF v_upload_owner_id IS NOT NULL AND v_upload_owner_id != NEW.user_id THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
    VALUES (v_upload_owner_id, NEW.user_id, 'post_comment', NEW.upload_id, NEW.id, LEFT(NEW.body, 28));
  END IF;

  -- Notify the parent comment author (replies) — but only if they're not also
  -- the post owner (avoid double-notifying the same person).
  IF NEW.parent_id IS NOT NULL THEN
    SELECT user_id INTO v_parent_author_id
    FROM public.comments
    WHERE id = NEW.parent_id;

    IF v_parent_author_id IS NOT NULL
       AND v_parent_author_id != NEW.user_id
       AND v_parent_author_id != v_upload_owner_id THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_parent_author_id, NEW.user_id, 'comment_reply', NEW.upload_id, NEW.id, LEFT(NEW.body, 28));
    END IF;
  END IF;

  -- Notify @mentioned users (capped at v_max_mentions). Skip if the mention
  -- target was already notified above (commenter / post owner / parent author).
  FOR v_mention_handle IN
    SELECT DISTINCT lower(substring(m[1] FROM 2))
    FROM regexp_matches(NEW.body, '@([a-zA-Z0-9_]+)', 'g') AS m
  LOOP
    IF v_mention_count >= v_max_mentions THEN EXIT; END IF;

    SELECT id INTO v_mentioned_user_id
    FROM public.users
    WHERE lower(username) = v_mention_handle
    LIMIT 1;

    IF v_mentioned_user_id IS NULL
       OR v_mentioned_user_id = NEW.user_id
       OR v_mentioned_user_id = v_upload_owner_id
       OR v_mentioned_user_id = v_parent_author_id THEN
      CONTINUE;
    END IF;

    v_mention_count := v_mention_count + 1;

    INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
    VALUES (v_mentioned_user_id, NEW.user_id, 'comment_mention', NEW.upload_id, NEW.id, LEFT(NEW.body, 28));
  END LOOP;

  RETURN NEW;
END;
$$;

-- ── 6. get_inbox — DROP + CREATE with is_new_since_view column ──
DROP FUNCTION IF EXISTS public.get_inbox(uuid, integer, integer);

CREATE FUNCTION public.get_inbox(
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
      FROM public.notifications
      WHERE recipient_id = p_user_id
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

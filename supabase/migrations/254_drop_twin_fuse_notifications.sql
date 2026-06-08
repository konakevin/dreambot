-- 254_drop_twin_fuse_notifications.sql — Twin/Fuse removal (notification side).
--
-- Run AFTER 253. Removes the post_twin / post_fuse notification types and, since
-- they were the only other members of the 'Twins & Fuses' preference category,
-- renames that category to 'Reposts' (post_repost is now its sole member).
--
-- Run in the dashboard SQL editor.

-- ── 1. Delete the stale twin/fuse notifications (so the new CHECK accepts) ──────
DELETE FROM public.notifications WHERE type IN ('post_twin', 'post_fuse');

-- ── 2. Notifications type CHECK without post_twin / post_fuse ───────────────────
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_share',
    'friend_request', 'friend_accepted',
    'follow_request', 'follow_accepted',
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'dream_failed',
    'post_like', 'post_repost',
    'post_milestone', 'comment_like',
    'comment',
    'download_ready'
  ));

-- ── 3. notification_category — reposts get their own category now ───────────────
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
    WHEN 'post_repost'      THEN 'Reposts'
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

-- ── 4. notification_preferences category 'Twins & Fuses' → 'Reposts' ───────────
-- Drop the CHECK first so the data rename is allowed, migrate any saved prefs,
-- then re-add the CHECK with the new category name.
ALTER TABLE public.notification_preferences DROP CONSTRAINT IF EXISTS notification_preferences_category_check;
UPDATE public.notification_preferences SET category = 'Reposts' WHERE category = 'Twins & Fuses';
ALTER TABLE public.notification_preferences ADD CONSTRAINT notification_preferences_category_check
  CHECK (category IN ('Likes', 'Comments', 'Mentions', 'Follows', 'Shares', 'Reposts', 'Your dreams'));

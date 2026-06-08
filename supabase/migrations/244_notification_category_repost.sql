-- 244_notification_category_repost.sql — categorize the post_repost notification.
--
-- notification_category() (migration 202) maps a notification type to one of the
-- 7 preference categories. 'post_repost' (migration 242) wasn't in the CASE, so
-- it fell through ELSE → 'Your dreams' (a personal-dreams bucket that's forced
-- on). A repost is engagement on your post, so it belongs with the reshare/remix
-- family ('Twins & Fuses' — twin = copy, fuse = remix, repost = reshare). Pure
-- CREATE OR REPLACE of an immutable function; re-run safe.

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
    WHEN 'post_repost'      THEN 'Twins & Fuses'
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

-- 384_notifications_reminder_types.sql
--
-- Add 'trial_reminder' and 'pro_reminder' to notifications_type_check.
--
-- The trial/pro expiry reminder feature was built end-to-end EXCEPT this
-- constraint: the cron inserts them (scripts/nightly-dreams.js), the client
-- routes them to /subscribe (lib/notificationRouting.ts:77) and renders them
-- (app/inbox.tsx, hooks/useInboxGrouped.ts), but the type list in
-- notifications_type_check (last rebuilt in migration 334) never included these
-- two types, so EVERY reminder insert failed the CHECK and no reminder ever
-- sent. This was the third of three stacked bugs blocking these reminders
-- (the other two, a nonexistent is_read column and actor_id:null vs a NOT NULL
-- column, were fixed in scripts/nightly-dreams.js on 2026-07-20).
--
-- Rebuilt from the full 334 list + the two reminder types. Idempotent.

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
    'download_ready',
    'report',
    'sparkle_gift',
    'announcement',
    'trial_reminder',
    'pro_reminder'
  ));

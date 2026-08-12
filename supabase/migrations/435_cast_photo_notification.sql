-- 435_cast_photo_notification.sql
--
-- DREAM_CAST_HARDENING_PLAN.md (Kevin, 2026-08-11): a new notification type that
-- tells a user their dream-cast face (self or partner/friend) can't be read, so
-- they've been sitting out their dreams — with a nudge to re-upload a clear solo
-- selfie. Fired during nightly rendering when a face swap is unusable (deduped
-- once per bad photo), and used as a manual re-upload prompt for known-bad casts.
--
-- Adds `cast_photo` to the notifications_type_check allow-list. Extends migration
-- 387's authoritative list (the union of 383 + welcome_gift + the reminder types)
-- verbatim, plus `cast_photo`. Category (notification_category) + group_key
-- (notification_group_key) already have safe ELSE defaults ('Your dreams' +
-- unique 'system:<id>'), so no RPC change is needed — the row surfaces in
-- get_inbox 1-to-1 out of the box. Idempotent.
--
-- DRIFT RECOVERY: the live constraint also permits `dream_off_invite` (4 rows
-- exist, oldest 2026-07-27) — a Dream Off change that was ALTERed directly in
-- the dashboard and never committed as a migration, so 387's file list omits it.
-- Rebuilding from 387 alone would violate the CHECK on those rows. Folded in here
-- to keep the constraint a true superset of what's live (non-destructive).

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_mention', 'post_share',
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
    'welcome_gift',
    'announcement',
    'trial_reminder',
    'pro_reminder',
    'basic_reminder',
    'dream_off_invite', -- drift-recovered (dashboard-only ALTER, see header)
    'cast_photo'
  ));

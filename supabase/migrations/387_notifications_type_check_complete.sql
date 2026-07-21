-- 387_notifications_type_check_complete.sql
--
-- Restore the COMPLETE notifications_type_check list.
--
-- Regression fix: migration 384 rebuilt this constraint from migration 334's
-- (stale) type list instead of migration 383's (the actual latest), which
-- silently DROPPED 'post_mention' (383 had added it) — so @mention-in-caption
-- notifications started failing the CHECK. 385 inherited the same truncated
-- list. Separately, 'welcome_gift' (used by lib/firstDreamKickoff.ts at
-- onboarding) was never in the constraint at all, so its inbox keepsake row
-- has been silently failing (swallowed by the best-effort try/catch there).
--
-- This rebuilds the constraint as the UNION of migration 383's full list +
-- welcome_gift + the three reminder types (trial/pro/basic). Authoritative going
-- forward — supersedes the type lists in 383/384/385. Idempotent.
--
-- ALSO folds in migration 385's basic_subscription_will_renew column (mirror of
-- pro_subscription_will_renew, migration 215) — 385 didn't fully apply, so this
-- makes 387 self-sufficient: applying it alone gives Basic-reminder parity AND
-- fixes the constraint. Economic column, deliberately NOT client-granted (the
-- reminder cron reads it with the service role). IF NOT EXISTS → safe if 385 ran.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS basic_subscription_will_renew boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.users.basic_subscription_will_renew IS
  'Mirror of pro_subscription_will_renew for the Basic tier. RevenueCat CANCELLATION flips it false; the nightly cron gates Basic expiry reminders on false so auto-renewing subs are never false-alarmed. Economic column — not client-granted.';

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
    'basic_reminder'
  ));

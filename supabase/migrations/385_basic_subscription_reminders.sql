-- 385_basic_subscription_reminders.sql
--
-- Bring the Basic subscription to full parity with paid Pro on expiry
-- reminders. Two pieces:
--
--   1. users.basic_subscription_will_renew — mirror of pro_subscription_will_renew
--      (migration 215). RevenueCat's CANCELLATION event flips it to false so the
--      nightly cron knows a Basic sub is actually winding down (auto-renewing
--      subs must NOT get a "your subscription is ending" false alarm). Economic
--      column: deliberately NOT client-granted (self-access, if ever needed,
--      goes through get_my_account like the Pro flag) — the reminder cron reads
--      it with the service role.
--
--   2. 'basic_reminder' added to notifications_type_check (rebuilt from the
--      migration 384 list + this type) so the Basic expiry pings can insert.
--
-- Idempotent / re-runnable.

-- 1. will_renew column (mirror pro_subscription_will_renew, migration 215).
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS basic_subscription_will_renew boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.users.basic_subscription_will_renew IS
  'Mirror of pro_subscription_will_renew for the Basic tier. RevenueCat CANCELLATION flips it false; the nightly cron gates Basic expiry reminders on false so auto-renewing subs are never false-alarmed. Economic column — not client-granted.';

-- 2. Allow the basic_reminder notification type (full list from migration 384 + basic_reminder).
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
    'pro_reminder',
    'basic_reminder'
  ));

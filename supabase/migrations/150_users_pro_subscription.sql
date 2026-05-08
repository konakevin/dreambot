-- 150_users_pro_subscription.sql
--
-- Add pro_subscription boolean to gate Pro-tier features (long-press save
-- to Photos, future unlimited HQ downloads paywall, etc.). Default false.
-- Will be flipped to true by the revenuecat-webhook Edge Function when a
-- user purchases the Pro subscription product (entitlement-based).
--
-- subscription_expires_at is a forward-looking column for entitlement
-- expiration — useful when subscriptions can lapse + need re-validation.
-- NULL means "never expires / not subscribed". Will be set by the webhook.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pro_subscription BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pro_subscription_expires_at TIMESTAMPTZ;

COMMENT ON COLUMN public.users.pro_subscription IS
  'Pro subscription entitlement — true when user has an active Pro subscription. Flipped by revenuecat-webhook on purchase / renewal. Gates long-press Save-to-Photos and future paid features. Default false.';

COMMENT ON COLUMN public.users.pro_subscription_expires_at IS
  'When the Pro subscription expires. NULL = never expires / not subscribed. Set by revenuecat-webhook to RevenueCat entitlement expiration_at_ms.';

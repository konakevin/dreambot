-- 452_users_subscription_period.sql (2026-09-01)
--
-- Stamp the billing period (monthly | yearly) of each active subscription onto the
-- user, so the sparkle-reconcile backstop (scripts/reconcile-subscription-sparkles.js)
-- can tell a MONTHLY sub (owed a grant every ~30 days) from a YEARLY sub (already got
-- 12x its monthly bundle up front and must NOT be re-granted monthly).
--
-- Written by the revenuecat-webhook on INITIAL_PURCHASE / RENEWAL / PRODUCT_CHANGE /
-- UNCANCELLATION (alongside the tier flag + expiry). For subscriptions that predate
-- this stamp, the backstop falls back to inferring the period from the last sparkle
-- grant amount (12x monthly = yearly).
--
-- ⚠️ APPLY THIS BEFORE deploying the updated revenuecat-webhook — the webhook now
-- writes these columns, and an insert/update to a missing column would fail the
-- webhook (breaking real subscription grants). Order: run this migration, THEN
-- `supabase functions deploy revenuecat-webhook --no-verify-jwt`.
--
-- Run in the Supabase dashboard SQL editor.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pro_subscription_period   text,
  ADD COLUMN IF NOT EXISTS basic_subscription_period text;

-- users uses COLUMN-LEVEL grants. Grant SELECT so a future "Pro (yearly)" label in
-- the app can read it; the backstop reads via the service role (bypasses grants).
-- No UPDATE grant — only the webhook (service role) writes it.
GRANT SELECT (pro_subscription_period, basic_subscription_period)
  ON public.users TO anon, authenticated;

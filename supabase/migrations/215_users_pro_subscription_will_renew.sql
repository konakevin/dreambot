-- Migration 215: users.pro_subscription_will_renew column
--
-- Tracks whether a paid Pro user's subscription is going to auto-renew at
-- pro_subscription_expires_at, or whether they've cancelled and will lapse
-- at that moment. Set by the revenuecat-webhook on
-- CANCELLATION / UNCANCELLATION / EXPIRATION / RENEWAL events.
--
-- Why: the nightly-dreams cron sends a "your subscription ends in 3 days"
-- and "tonight is your last Pro nightly dream" reminder to PAID users who
-- have cancelled but still have access. Sending to auto-renewing users
-- would be false alarm — they're not going to lose access. Without this
-- flag we can't distinguish "lapsing" from "auto-renewing" at reminder
-- time. The mirror reminder for trial users (paid_3day / paid_last_night
-- subtypes on the trial_reminder type) already exists; this column gates
-- whether to actually send for the paid path.
--
-- Default TRUE because new subs auto-renew until the user explicitly
-- cancels. Existing rows backfill TRUE for the same reason (any user
-- already on Pro who DOESN'T have a cancellation logged is assumed to
-- still be auto-renewing; the next RevenueCat event will correct any
-- mismatch).

alter table public.users
  add column if not exists pro_subscription_will_renew boolean not null default true;

comment on column public.users.pro_subscription_will_renew is
  'Will the paid Pro subscription auto-renew at pro_subscription_expires_at? Flipped FALSE by revenuecat-webhook on CANCELLATION; flipped TRUE on UNCANCELLATION / RENEWAL / INITIAL_PURCHASE. Used by nightly-dreams to gate the paid-Pro expiry reminder (we only ping cancelled users — auto-renewers don''t need warning). Migration 215.';

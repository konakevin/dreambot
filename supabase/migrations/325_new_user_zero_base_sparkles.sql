-- 325_new_user_zero_base_sparkles.sql (2026-07-05)
--
-- New users should start with EXACTLY 25 sparkles total (Kevin). Previously:
-- users.sparkle_balance DEFAULT 10 (migration 058) + the 25-sparkle
-- welcome_bonus grant at onboarding (engine_config.welcome_sparkle_bonus,
-- granted idempotently via grant_sparkles — migration 258) = 35 total.
--
-- Fix: zero the column default so the ENTIRE starting balance arrives via the
-- ledgered welcome bonus. Existing users are untouched (a default only applies
-- to new rows). The welcome grant's reconcile safety net (lib/welcomeBonus.ts)
-- already guarantees the 25 lands even if the onboarding-time call fails.
--
-- No client changes required — the app reads sparkle_balance, never assumes it.

ALTER TABLE public.users ALTER COLUMN sparkle_balance SET DEFAULT 0;

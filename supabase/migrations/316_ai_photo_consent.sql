-- 316_ai_photo_consent.sql
-- App Store Guidelines 5.1.1(i) / 5.1.2(i): obtain the user's permission IN-APP
-- before sending their photo to a third-party AI service. Records WHEN each user
-- consented (account-bound, one-and-done) so the consent gate stays silent on
-- every device afterward — and we have a timestamp on record if Apple asks.
--
-- Lives on user_first_run (the existing account-bound flags table, migration
-- 284): TABLE-level grants + own-row RLS already cover any new column, and the
-- client already reads/upserts this table RLS-scoped to its own row. NULL =
-- not consented (gate fires); set to now() on "Agree & continue".

ALTER TABLE public.user_first_run
  ADD COLUMN IF NOT EXISTS ai_consent_at timestamptz;

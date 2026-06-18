-- 284_user_first_run_flags.sql
--
-- Move the four first-run intro "seen" flags from device-local AsyncStorage to
-- account-bound DB state.
--
-- The old flags (dreambot.seenFeedIntro.v1 / seenCreateIntro.v1 /
-- seenMediumsIntro.v1 / seenSparkleIntro.v1) lived in AsyncStorage, which is
-- PER-DEVICE: it couldn't distinguish a brand-new account on a previously-used
-- device from a returning user, and it survived app updates (an over-the-top
-- reinstall kept the flags set, silently suppressing every first-run intro —
-- this bit us on a test device on 2026-06-18). Storing the flags per-user fixes
-- both: a new account always re-sees the intros, and a returning user keeps
-- their seen-state across reinstalls + devices.
--
-- All four intros fire POST-onboarding (feed gate / Create intro / Mediums intro
-- / Sparkle intro), so the account always exists by the time one is shown — the
-- row is created lazily on first write (no need to seed it in handle_new_user).

CREATE TABLE IF NOT EXISTS public.user_first_run (
  user_id            uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  seen_feed_intro    boolean NOT NULL DEFAULT false,
  seen_create_intro  boolean NOT NULL DEFAULT false,
  seen_mediums_intro boolean NOT NULL DEFAULT false,
  seen_sparkle_intro boolean NOT NULL DEFAULT false,
  updated_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_first_run IS
  'Account-bound first-run intro seen-flags (migration 284). Replaces the old per-device AsyncStorage flags. Lazily created on first write; absent row = nothing seen.';

ALTER TABLE public.user_first_run ENABLE ROW LEVEL SECURITY;

-- A user reads + writes ONLY their own row. No service-role-only data here, so
-- plain own-row policies suffice. No DELETE policy: the admin "reset tutorials"
-- tool sets the flags back to false (UPDATE), it never deletes the row.
DROP POLICY IF EXISTS "first_run_select_own" ON public.user_first_run;
CREATE POLICY "first_run_select_own" ON public.user_first_run
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "first_run_insert_own" ON public.user_first_run;
CREATE POLICY "first_run_insert_own" ON public.user_first_run
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "first_run_update_own" ON public.user_first_run;
CREATE POLICY "first_run_update_own" ON public.user_first_run
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Table-level grants (this is a brand-new table, NOT users/uploads, so the
-- migration-278 column-level-grant rule does not apply here).
GRANT SELECT, INSERT, UPDATE ON public.user_first_run TO authenticated;

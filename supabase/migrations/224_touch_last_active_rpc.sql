-- 224_touch_last_active_rpc.sql
--
-- Activity heartbeat (2026-06-05):
--
-- users.last_active_at was added by migration 061 but only written once per
-- session at sign-in (app/_layout.tsx DataPrefetcher). That made it useless
-- for "is the user currently in the app" decisions. Generalize it: a small
-- SECURITY DEFINER RPC the client calls on every AppState 'active' transition
-- (debounced to ~once per 10s).
--
-- Consumers (added in the same commit as this migration):
--   - send-push Edge Function: skip the Expo POST if last_active_at is within
--     the last 30s. The notification row is still inserted into the inbox
--     (the user sees it via the in-app indicators — badge dot, profile-tab
--     dot, inbox row). Only the OS banner is suppressed.
--   - app/_layout.tsx: foreground-transition heartbeat. Replaces the one-time
--     write in DataPrefetcher.
--
-- The 30s window is empirical: tighter would miss the "tabbed to Slack for
-- 5 seconds" case (which Kevin reported as the trigger); looser would
-- suppress pushes the user genuinely wants when they reopen after lunch.

CREATE OR REPLACE FUNCTION public.touch_last_active()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE public.users
  SET last_active_at = now()
  WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.touch_last_active() TO authenticated;

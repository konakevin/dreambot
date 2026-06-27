-- ══════════════════════════════════════════════════════════════════════════════
-- 303 — get_bot_users() respects is_public so the bot PILL ROW is DB-driven.
--
-- The pill row (Bots tab, home, settings/bots, onboarding bot-selector) is fed by
-- get_bot_users(). It previously filtered only is_bot=true, so the ONLY way to
-- hide a bot from the pills was a client-side HIDDEN_BOT_USERNAMES edit shipped in
-- an app build. Adding `AND is_public = true` makes deactivation (users.is_public
-- = false) drop a bot from the pills immediately, with no app release.
--
-- 2026-06-22: RetroBot + PixelBot deactivated (is_public=false) — they now vanish
-- from the pills the moment this runs. HumanBot + GlowBot stay is_public=true (their
-- old posts intentionally remain public) and are still pill-hidden by the client-side
-- HIDDEN_BOT_USERNAMES set in hooks/useBotUsers.ts (the "retired but posts visible"
-- case this is_public filter can't express).
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.get_bot_users()
RETURNS TABLE(id uuid, username text, avatar_url text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u.id, u.username, u.avatar_url
  FROM public.users u
  WHERE u.is_bot = true
    AND u.is_public = true
  ORDER BY u.username;
$$;

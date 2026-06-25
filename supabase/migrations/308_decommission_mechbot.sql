-- 308: Decommission MechBot (2026-06-24).
--
-- RUN THIS AFTER migration 307 (which moves MechBot's 8 moved-path posts to
-- StarBot). Order matters: 307 reparents the 409 keep-worthy posts to StarBot
-- FIRST, then this migration hides MechBot — so only its genuinely-dead-path
-- post history (the ~951 non-moved-path posts) goes dark.
--
-- MechBot's paths were either moved to StarBot (8 of them) or retired in place;
-- the bot module + dead-path files stay on disk for reference. This turns the
-- bot OFF and hides it from the app. Fully reversible.
--
-- IDs: MechBot users.id = 587fe0ed-0112-4d8f-9741-ec969419f541
--
-- 1. Hide MechBot from the UI. users.is_public=false removes it from the
--    Bots-page pills + bot selector (get_bot_users RPC filters is_public=true).
--    (Search is handled in the client retire-list — see hooks/useBotUsers.ts +
--    hooks/useSearchUsers.ts.)
UPDATE public.users
SET is_public = false
WHERE id = '587fe0ed-0112-4d8f-9741-ec969419f541';

-- 1b. Hide MechBot's remaining (dead-path) posts from the feed at the POST level.
--     users.is_public=false alone is NOT enough: get_feed (migration 282) shows
--     an author's posts to anyone who FOLLOWS them ("... OR up.user_id IN
--     (followed)"), so followers (e.g. the admin) still saw MechBot otherwise.
--     up.is_public=false is enforced for everyone. The 409 moved-path posts were
--     already reparented to StarBot by migration 307, so they are NOT affected.
--     (is_public is NOT in the freeze-trigger column list, so no DISABLE needed.)
UPDATE public.uploads
SET is_public = false
WHERE user_id = '587fe0ed-0112-4d8f-9741-ec969419f541'
  AND is_public = true;

-- 2. Stop the dispatcher from ever running MechBot (dispatcher selects WHERE
--    active = true). Note left for the audit trail.
UPDATE public.bot_schedules
SET active = false,
    notes  = 'decommissioned 2026-06-24 — 8 paths + their post history moved to StarBot; dead paths kept on disk'
WHERE bot_name = 'mechbot';

-- 3. Clear MechBot's persisted path-cycle shuffle-bag state (harmless to leave,
--    but tidy — it has no meaning for an inactive bot).
DELETE FROM public.bot_path_cycle
WHERE bot_name = 'mechbot';

-- ── Reactivate later (if ever needed) ───────────────────────────────────────
-- UPDATE public.users SET is_public = true WHERE id = '587fe0ed-0112-4d8f-9741-ec969419f541';
-- UPDATE public.bot_schedules SET active = true, consecutive_failures = 0, notes = NULL WHERE bot_name = 'mechbot';
-- (and remove 'mechbot' from HIDDEN_BOT_USERNAMES in hooks/useBotUsers.ts)

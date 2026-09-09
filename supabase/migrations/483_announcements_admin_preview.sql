-- 483: announcements — supreme-admin preview carve-out.
--
-- Lets Kevin preview a DRAFT announcement (is_active=false, or not yet
-- starts_at, or existing_users_only-gated against his own account) exactly
-- as the real client/RLS/useAnnouncement flow would render it, without
-- flipping is_active=true and exposing an unfinished announcement to real
-- users. Same pattern as every other admin-only carve-out in this codebase
-- (get_bot_users migration 339, get_shadow_feed migration 376): an
-- ADDITIONAL permissive policy scoped to the hardcoded supreme-admin UUID —
-- Postgres ORs multiple permissive policies together for the same command,
-- so this only ever ADDS visibility for that one account; every other
-- user's access is governed by the migration-445 policy, unchanged.
CREATE POLICY announcements_admin_preview ON public.announcements
  FOR SELECT TO authenticated
  USING (auth.uid() = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'::uuid);

-- 307: Reparent MechBot's posts for the 8 paths moved to StarBot (2026-06-24).
--
-- The paths robot-moment / scifi-cyborg-female / og-cyborg-female /
-- mech-insect-hybrids / void-lancers / post-apoc-rust-tech / alien-biomechs /
-- killer-cyborgs-male were surgically moved from MechBot to StarBot (StarBot now
-- owns their pools, seeds, archetypes + renders them). This moves the EXISTING
-- post history for those paths (409 rows as of 2026-06-24) onto StarBot so the
-- history is preserved + visible under StarBot once MechBot is decommissioned.
--
-- For each matched upload:
--   • user_id -> StarBot  (reparents the post; likes / comments / impressions
--     follow upload_id, so they stay attached automatically)
--   • caption -> "[path] MechBot" rewritten to "[path] StarBot"
--   • recipe.bot_username -> 'starbot'
--
-- NOT changed (intentionally):
--   • image_url / storage objects — image_url is an absolute public URL and the
--     storage file stays under MechBot's folder; it keeps loading. Harmless.
--   • posted_at — preserved, so posts slot into StarBot's history at their
--     original times.
--
-- The uploads BEFORE-UPDATE sanitize trigger (migration 279) only touches
-- NEW.description (not caption) — it idempotently re-sanitizes the already-clean
-- description and leaves the rewritten caption intact.
--
-- ⚠️ FREEZE TRIGGER: uploads has trg_freeze_upload_columns
-- (freeze_upload_columns_on_update, migration 291) which silently reverts
-- NEW.user_id := OLD.user_id for any non-service_role session. The Supabase SQL
-- editor runs as `postgres` (NOT service_role → line "current_setting('role')"
-- exemption does NOT apply), so the user_id change is reverted unless the
-- trigger is disabled around the UPDATE. We DISABLE/ENABLE it here. (caption +
-- recipe are not frozen, so they update regardless.)
--
-- NOTE: applied to production 2026-06-24 via a service_role script (service_role
-- is exempt from the freeze trigger), because the first SQL-editor run reverted
-- user_id. This file is the correct, re-runnable form for a fresh-DB replay.
--
-- Idempotent: after running, these rows no longer match user_id = MechBot.

ALTER TABLE public.uploads DISABLE TRIGGER trg_freeze_upload_columns;
--
-- IDs: MechBot users.id = 587fe0ed-0112-4d8f-9741-ec969419f541
--      StarBot users.id = 7ff17a0a-772c-4716-8c96-f8344e74085d
--
-- ── Pre-check (expect 409) ──────────────────────────────────────────────────
-- SELECT count(*) FROM public.uploads
--  WHERE user_id = '587fe0ed-0112-4d8f-9741-ec969419f541'
--    AND recipe->>'path' IN ('robot-moment','scifi-cyborg-female','og-cyborg-female',
--      'mech-insect-hybrids','void-lancers','post-apoc-rust-tech','alien-biomechs',
--      'killer-cyborgs-male');

UPDATE public.uploads
SET
  user_id = '7ff17a0a-772c-4716-8c96-f8344e74085d',                 -- StarBot
  caption = replace(caption, 'MechBot', 'StarBot'),
  recipe  = jsonb_set(recipe, '{bot_username}', '"starbot"'::jsonb, true)
WHERE user_id = '587fe0ed-0112-4d8f-9741-ec969419f541'              -- MechBot
  AND recipe->>'path' IN (
    'robot-moment',
    'scifi-cyborg-female',
    'og-cyborg-female',
    'mech-insect-hybrids',
    'void-lancers',
    'post-apoc-rust-tech',
    'alien-biomechs',
    'killer-cyborgs-male'
  );

ALTER TABLE public.uploads ENABLE TRIGGER trg_freeze_upload_columns;

-- ── Post-check ──────────────────────────────────────────────────────────────
-- Expect 409 under StarBot, 0 still under MechBot:
-- SELECT count(*) FROM public.uploads
--  WHERE user_id = '7ff17a0a-772c-4716-8c96-f8344e74085d'
--    AND recipe->>'path' IN ('robot-moment','scifi-cyborg-female','og-cyborg-female',
--      'mech-insect-hybrids','void-lancers','post-apoc-rust-tech','alien-biomechs',
--      'killer-cyborgs-male');
-- SELECT count(*) FROM public.uploads
--  WHERE user_id = '587fe0ed-0112-4d8f-9741-ec969419f541'
--    AND recipe->>'path' IN ('robot-moment','scifi-cyborg-female','og-cyborg-female',
--      'mech-insect-hybrids','void-lancers','post-apoc-rust-tech','alien-biomechs',
--      'killer-cyborgs-male');
--
-- Revert (if ever needed): flip the WHERE to StarBot + the moved paths and set
-- user_id back to MechBot + replace(caption,'StarBot','MechBot') +
-- recipe.bot_username -> 'mechbot'.

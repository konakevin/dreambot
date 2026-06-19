-- 293_confirm_surprise_dream.sql
--
-- Cross-device UX pref: whether to show the "Surprise dream?" confirmation before
-- generating an empty-prompt (random) dream. Default TRUE = confirm, preserving
-- today's behavior. The user can check "Don't show again" on the dialog, or
-- toggle it in Settings → Dream Settings. Stored on users so it follows the
-- account across devices (Kevin: cross-device).
--
-- public.users uses COLUMN-LEVEL grants (migration 278) — a NEW column is
-- silently client-invisible/un-writable until granted. Grant SELECT to both
-- roles (so the client can read it) and UPDATE to authenticated (so the toggle +
-- the dialog checkbox can write it). Idempotent + safe to hand-apply.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS confirm_surprise_dream boolean NOT NULL DEFAULT true;

GRANT SELECT (confirm_surprise_dream) ON public.users TO anon, authenticated;
GRANT UPDATE (confirm_surprise_dream) ON public.users TO authenticated;

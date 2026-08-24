-- Migration 444: admin-only dark-launch flag for location cards.
--
-- Operation Dream Location Expansion: new/revived locations need to be visible to
-- ADMINS only (for QA test-renders) while regular users keep seeing just the live
-- set. When the whole new batch is validated, one UPDATE flips them all live.
--
-- Visibility model in the picker (components/onboarding/LocationPickerStep.tsx):
--   picker_category IS NOT NULL      → in a section (the existing visibility gate)
--   admin_only = false               → everyone sees it
--   admin_only = true                → ONLY users with users.is_admin see it (dark launch)
--
-- Existing cards default to admin_only = false (unchanged: still visible to all).
-- location_cards has no column-level grants (unlike users/uploads), so the new
-- column is readable by anon/authenticated without an extra GRANT.
--
-- Apply in the Supabase dashboard SQL editor. Re-runnable.

ALTER TABLE public.location_cards
  ADD COLUMN IF NOT EXISTS admin_only boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.location_cards.admin_only IS
  'Dark-launch gate: true = visible only to admins (users.is_admin) for QA; false = live to everyone. Flip to false to launch. (mig 444, Operation Dream Location Expansion)';

-- To go live at the end: UPDATE public.location_cards SET admin_only = false WHERE admin_only = true;

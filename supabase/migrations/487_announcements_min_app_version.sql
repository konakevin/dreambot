-- 487: announcements — add a MARKETING-VERSION gate alongside the existing
-- native-build-number gate (min_build, migration 333).
--
-- Kevin (2026-09-09): tie FarmBot's "Introducing FarmBot" announcement to the
-- 1.2.0 release, set up ahead of time (before that build even exists) rather
-- than as a post-build lookup step. min_build can't be set until EAS actually
-- mints a build number for that release (appVersionSource=remote,
-- autoIncrement=true — nothing in this repo maps "1.2.0" to a build number
-- ahead of time). The marketing version string, by contrast, IS known right
-- now — it's literally the version we're about to bump app.config.js to.
--
-- Client-side gate only (same pattern as min_build): RLS doesn't need to
-- know about this column, `useAnnouncement.ts` compares it against
-- Constants.expoConfig.version via lib/appVersion.ts's compareVersions
-- (already unit-tested, fail-open by design — a null/malformed bound never
-- gates, matching min_build's exact semantics).
ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS min_app_version text;

COMMENT ON COLUMN public.announcements.min_app_version IS
  'Marketing version floor (e.g. "1.2.0") — hides this announcement from any client below it. Compared against Constants.expoConfig.version client-side via lib/appVersion.ts compareVersions(). NULL = no gate (shows on any version). Complements min_build (native build number); either or both may be set.';

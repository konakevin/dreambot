-- 209: drop the dormant get_public_vibe_summary RPC.
--
-- Migration 208 added this SECURITY DEFINER RPC to expose a sanitized
-- cross-user slice of user_recipes (aesthetics + art_styles) so the
-- VibeProfilePeek could render on public profile screens. Kevin then
-- pivoted away from user-curated mediums/vibes — onboarding no longer
-- captures them, the nightly engine rolls its own, and the Create
-- screen exposes the full catalog every render. The VibePeek was
-- removed and this RPC has had zero callers since.
--
-- Dropping it keeps the DB lean + makes the type regen clean.

BEGIN;

DROP FUNCTION IF EXISTS public.get_public_vibe_summary(uuid);

COMMIT;

-- 287_reset_my_profile.sql (2026-06-18)
--
-- Server-side "reset me to new" for the in-app Settings → "Reset Profile" test
-- action. The client can flip its own users.has_ai_recipe + delete its own
-- user_recipes (RLS allows self-writes), but it CANNOT delete its dream_queue
-- rows (service-role-managed) — so the old reset left the user's `first_dream`
-- claim behind. On re-onboarding, enqueue-dream's one-free-first-dream guard then
-- returned 409 `first_dream_already_claimed`, trapping the user in the reveal's
-- infinite "Try again" loop (see project_first_dream_failure_loop). This RPC does
-- the whole reset server-side, including releasing the first-dream claim.
--
-- SECURITY DEFINER + auth.uid()-only: a caller can reset ONLY THEMSELVES. Does
-- NOT touch dreams/likes/sparkles/Pro/cast-photos — only the onboarding gate, the
-- vibe recipe, and the free-first-dream claim. (user_first_run tutorial flags are
-- cleared client-side by resetAllFirstRunFlags, so they're left alone here.)

CREATE OR REPLACE FUNCTION public.reset_my_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- onboarding gate → app routes the user back to /(onboarding)
  UPDATE public.users SET has_ai_recipe = false WHERE id = uid;

  -- vibe profile / nightly recipe
  DELETE FROM public.user_recipes WHERE user_id = uid;

  -- release the one-free-first-dream claim so re-onboarding gets a fresh first
  -- dream instead of looping (delete the jobs first, then the queue rows the
  -- enqueue guard checks)
  DELETE FROM public.dream_jobs
  WHERE id IN (
    SELECT id FROM public.dream_queue WHERE user_id = uid AND source = 'first_dream'
  );
  DELETE FROM public.dream_queue WHERE user_id = uid AND source = 'first_dream';
END;
$$;

REVOKE ALL ON FUNCTION public.reset_my_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reset_my_profile() TO authenticated;

COMMENT ON FUNCTION public.reset_my_profile() IS
  'Resets the CALLING user (auth.uid()) to pre-onboarding: has_ai_recipe=false, deletes user_recipes, and releases the free-first-dream claim (dream_queue/dream_jobs source=first_dream). SECURITY DEFINER, self-only. Powers Settings → Reset Profile. Migration 287, 2026-06-18.';

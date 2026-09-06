-- Couple (dual face-swap) model steer (Kevin, 2026-09-05 — SCENE_FIRST_ACTION_PLAN.md §8, dualModelSteer.ts):
-- when the DreamSmart pick for a COUPLE render lands on flux-1.1-pro / Ultra, use the first of
-- flux-2-flex → gemini-2-image → flux-2-max → gpt-image-2 that the medium allows. Evidence: 20/20 clean
-- first-try couple swaps on those models vs 23-40% degrade-to-solo on 1.1-pro over the same seeds.
-- false = off (default, no behavior change until flipped after the natural-roll verification batch).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dual_avoid_flux11pro boolean NOT NULL DEFAULT false;

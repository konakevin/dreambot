-- 539_retire_classical_oil_no_pins_active.sql — scrap `nightly_classical_oil` too; NO active model pins remain,
-- 2026-09-20. Kevin: "i actually don't even like the way this look renders, it looks mildy corny … just disable
-- this one as well, so no nano banana overrides".
--
-- WHY
-- A TASTE call, not a defect. The look held cleanly on Nano Banana Pro — 2 of 2 in the final batch at identity
-- 0.73/0.74 and 0.755/0.727, and every earlier probe held too — but Kevin does not like how it reads. Quality of
-- execution is not the same as wanting the result, and the result is his call.
--
-- WHAT THIS DOES
--   1. `nightly_enabled = false` on the look (mig 500's quarantine lever). Row, grades and fragments all stay.
--   2. Deactivates its Nano Banana Pro pin, so ZERO pins are active. Nothing in the nightly routes to
--      google/gemini-3-image-preview any more, and the nightly is back inside its ≤2-sparkle model cost cap on
--      every surface.
--
-- THE PIN MECHANISM STAYS. `nightly_look_model_pins` (mig 536), its engine branch, its stamps and its tests are
-- all still in place and inert with no active rows — this is the designed OFF state, not a revert. Routing a
-- look to a specific model is now a one-row INSERT whenever it is wanted again, and the two traps it exists to
-- avoid are still documented: a 0 weight in primary_models cannot mean "never" (all-zero weights fall back to
-- UNIFORM), and `approved = false` is a face-swap quality grade, never a routing lever.
--
-- Both looks retired today are recoverable in one field each. colored_pencil went for a real defect (mig 538,
-- it rendered on a literal sheet of paper); classical_oil goes for taste.
--
-- ROLLBACK:
--   UPDATE public.dream_mediums SET nightly_enabled = true WHERE key = 'nightly_classical_oil';
--   UPDATE public.nightly_look_model_pins SET active = true WHERE look_key = 'nightly_classical_oil';
BEGIN;

UPDATE public.dream_mediums
   SET nightly_enabled = false
 WHERE key = 'nightly_classical_oil';

UPDATE public.nightly_look_model_pins
   SET active = false,
       reason = reason || ' | RETIRED 2026-09-20 (mig 539): Kevin, taste — the look reads corny. Held fine technically.'
 WHERE look_key = 'nightly_classical_oil';

COMMIT;

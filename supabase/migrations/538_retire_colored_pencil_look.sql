-- 538_retire_colored_pencil_look.sql — scrap `nightly_colored_pencil` from the nightly rotation, 2026-09-20.
-- Kevin: "just scrap this look" … "so we only have the single look that routes to nano banana pro".
--
-- WHY
-- The look could not stop rendering as an artwork with a margin. On Nano Banana Pro it drew the scene on a
-- literal sheet of cream paper, edges and all, and the app's card crop left visible bands top and bottom.
-- Migration 537 removed every mention of paper, sheet and tooth from its two fragments AND its directive — that
-- killed the hard sheet edge, but three fresh couples still faded to a white margin, because the model's prior
-- for "colored pencil drawing" is an artwork sitting inside the frame rather than filling it. Beating that would
-- have meant a positive extent clause on the FACE-SWAP fragment, which is the one place we are not allowed to
-- push framing: amplifying the frame there shrinks the couple until the dual detector cannot split two clean
-- faces. Not worth the risk for one look, so it is retired instead.
--
-- WHAT THIS DOES
--   1. `nightly_enabled = false` — the standard quarantine lever (mig 500). The row, its grades and its
--      fragments all stay, so re-enabling is a one-field flip if the wording is ever cracked.
--   2. Deactivates its Nano Banana Pro pin (mig 536). The pin would never fire on a disabled look, but leaving
--      it active would misreport the routing: after this, EXACTLY ONE look routes to Nano Banana Pro,
--      `nightly_classical_oil` on couples, which is the state Kevin confirmed.
--
-- NOT TOUCHED: `nightly_classical_oil` keeps its pin and stays enabled. Twelve other looks still name paper or
-- canvas in their fragments (chromolithograph, marker, aquarelle_graphite, lineless_watercolor, watercolor_ink,
-- hand_drawn_illustration, watercolor_paper, oil_pastel, halloween_watercolor_ink + three already disabled).
-- They render correctly on flux and gemini-2, which do not read the phrase literally. Re-check any of them for
-- this same border BEFORE pinning it to Nano Banana Pro.
--
-- ROLLBACK:
--   UPDATE public.dream_mediums SET nightly_enabled = true WHERE key = 'nightly_colored_pencil';
--   UPDATE public.nightly_look_model_pins SET active = true WHERE look_key = 'nightly_colored_pencil';
BEGIN;

UPDATE public.dream_mediums
   SET nightly_enabled = false
 WHERE key = 'nightly_colored_pencil';

UPDATE public.nightly_look_model_pins
   SET active = false,
       reason = reason || ' | RETIRED 2026-09-20 (mig 538): the look renders with a paper margin; pin inert.'
 WHERE look_key = 'nightly_colored_pencil';

COMMIT;

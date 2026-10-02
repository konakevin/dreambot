-- 656_nightly_solo_action_early.sql — nightly SOLO prompts place the action right after "set at", 2026-10-02.
--
-- Kevin flagged three fall / Halloween nightlies (sunnysteph, tiffany, michele) that all rendered the same picture:
-- a woman centred on a path receding behind her, trees on both sides. Each had an action that would have staged
-- her elsewhere (hand on a cracked fountain rim holding a jack-o-lantern, a jack-o-lantern set on the porch step),
-- and flux-1.1-pro dropped it: the solo prompt names the place in "set at", then the ~60-word anchor, and only then
-- the action. Same-seed probe on those prompts (two rounds): the action moved next to the place rendered 12/12
-- (0/12 shipped), and the corridor shot fell 20/24 -> 12/24 (0/24 with the seed repair, mig 657). Same words, only
-- the order moves. On 8 other production solos the actions landed more often (cider poured, coins scooped) with
-- faces and outfits unchanged; one role-led action ("Viking merchant lifts ...") rendered a man on 1 of 4 seeds,
-- which the solo swap guard catches (wrong-gender face -> re-render).
--
--   nightly_solo_action_early  single-cast slot prompts put the action right after the "set at" line
--                              (QA: force_solo_action_early). false = the old order, byte-identical.
--
-- ROLLBACK (instant, no deploy): UPDATE public.engine_config SET nightly_solo_action_early = false WHERE id = 1;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_solo_action_early boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.engine_config.nightly_solo_action_early IS
  'Nightly: single-cast prompts place the action right after "set at" (scene-object actions 0/12 → 12/12 in the same-seed probe). false = old order.';

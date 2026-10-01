-- 647_nightly_gendered_wardrobe.sql — card outfits drawn per person by gender, 2026-10-01. CARD_WARDROBE_GENDER_PLAN.md.
--
-- Kevin: "why are we getting fruity outfits like this for men?" A fantasy or costume card dressed everyone from one
-- shared WARDROBE list that leaned feminine (63 of 67 lists had women-only items), so a man drew "a floor-length
-- translucent organza robe over a jeweled bodysuit" and rendered in a sheer robe. Mig 646 added WARDROBE_MEN (67
-- cards) and WARDROBE_WOMEN (14); this switch makes the nightly engine read them.
--
--   nightly_gendered_wardrobe  each person's card-outfit anchor comes from their own gender's list (fallback
--                              WARDROBE); a couple's brief names whose inspiration is whose. Stamp gendered_wardrobe.
--                              QA: force_gendered_wardrobe. false = the one shared pick, byte-identical.
--
-- Ships OFF: the production nightly engine changes only on Kevin's word after the A/B renders.
-- ROLLBACK (instant, no deploy): UPDATE public.engine_config SET nightly_gendered_wardrobe = false WHERE id = 1;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_gendered_wardrobe boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.engine_config.nightly_gendered_wardrobe IS
  'Nightly: card outfit anchors drawn per person from WARDROBE_MEN / WARDROBE_WOMEN (fallback WARDROBE). false = one shared pick.';

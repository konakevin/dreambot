-- 649_nightly_gendered_wardrobe_live.sql — gendered card wardrobes LIVE on Kevin's word, 2026-10-01 ("yes flip it").
-- CARD_WARDROBE_GENDER_PLAN.md: A/B on Kevin's account, switch off handed the man a women's pick on 5 of 6 cards; on,
-- every man rendered in menswear and women drew their own list.
-- ROLLBACK (instant, no deploy): UPDATE public.engine_config SET nightly_gendered_wardrobe = false WHERE id = 1;

UPDATE public.engine_config SET nightly_gendered_wardrobe = true WHERE id = 1;

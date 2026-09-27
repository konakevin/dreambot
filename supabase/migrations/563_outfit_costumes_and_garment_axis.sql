-- 563_outfit_costumes_and_garment_axis.sql — outfits that follow the prompt, and women no longer default to
-- wide-leg trousers, 2026-09-26. CREATE_OUTFIT_PLAN.md phase 8.
--
-- Kevin: "we seem to have very strong language for clothing added in automatically. even when i prompt
-- this, it still adds weird flowy clothing. i've also noticed there is a disposition to show women in
-- pantsuits." His "sexy Celtic bowhuntress ... sleek and deadly" came back in a draped scarlet toga (the
-- reader never ran, a rolled "soft, fluid and draped" cut won), and "sleek and revealing armor" came back in
-- rolled blush pink. Measured on three accounts' last ~30 dreams: 28% of women's outfits were wide-leg
-- trousers, palazzos or flares; 22% of nightly solo women platform-wide.
--
-- WHAT THE SWITCHES DO
--   create_outfit_costume_read  Create: the outfit reader also fires on a character someone is cast as
--                               ("a Celtic bowhuntress", "pirates") and on style words ("sleek", "sexy"),
--                               and reads ROLE + STYLE per person. A costume keeps its own cut and
--                               materials; armor keeps its metal. Our colour becomes one accent.
--   create_outfit_garment_roll  Create: a woman nobody dressed gets an authored garment family (dress,
--                               skirt, jumpsuit, shorts, slim trousers, coat over a dress), two women share
--                               one, and the cut pool drops its two widest entries.
--   outfit_garment_weights      the family weights, keyed by family (outfitPlan.ts WOMEN_GARMENT_FAMILIES).
--   nightly_garment_roll        nightly: the same families on the wardrobe slot. RESTORE-POINT RULE: stays
--                               false until Kevin says so; QA forces it per request with force_garment_roll.
--
-- Both Create switches also apply to create_outfit_preview_user_ids (Kevin's account) while globally off,
-- so he can test in the app before the flip.
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET create_outfit_costume_read = false, create_outfit_garment_roll = false,
--          nightly_garment_roll = false WHERE id = 1;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS create_outfit_costume_read boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS create_outfit_garment_roll boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS outfit_garment_weights jsonb NOT NULL
    DEFAULT '{"dress": 30, "skirt": 20, "jumpsuit": 10, "shorts": 10, "trousers": 15, "coat_over_dress": 15}'::jsonb,
  ADD COLUMN IF NOT EXISTS nightly_garment_roll boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.engine_config.create_outfit_costume_read IS
  'Create outfits: read the character someone is cast as and the style asked for; armor keeps its own materials. false = today.';
COMMENT ON COLUMN public.engine_config.create_outfit_garment_roll IS
  'Create outfits: authored garment family for women nobody dressed (two women share one) + the V2 cut pool. false = today.';
COMMENT ON COLUMN public.engine_config.outfit_garment_weights IS
  'Weights for the women''s garment families, keyed by family: dress, skirt, jumpsuit, shorts, trousers, coat_over_dress. Unknown keys ignored; all-zero falls back to the defaults.';
COMMENT ON COLUMN public.engine_config.nightly_garment_roll IS
  'Nightly: the women''s garment families on the wardrobe slot. Restore-point rule: off until Kevin flips it. force_garment_roll overrides per request.';

-- 547_create_outfit_plan.sql — Create outfits: per-person colour, silhouette and pattern, and the user's
-- own clothing honored, 2026-09-23. CREATE_OUTFIT_PLAN.md.
--
-- Kevin: "can we make each person wear only their own colour, or even mismatched colors and
-- patterns/fabrics" and "if the user specifies their outfits we need to honor their outfit but add in the
-- color and print … 'show me in a red bikini' we show them in a red bikini."
--
-- WHAT THE SWITCHES DO (generate-dream, Create cast renders on face-swap mediums, solo and couples)
--   create_outfit_rolls      the per-person plan (outfitPlan.ts): each person's own colour, never the
--                            partner's; a silhouette; a pattern or solid. Replaces the one shared palette
--                            Sonnet mirrored in 62% of couples.
--   create_outfit_user_lock  read what the user asked each person to wear (outfitSpec.ts) and lock it:
--                            their garment, their colour, a team/brand's own colours; plain clothes they
--                            asked for are honored; face occluders are dropped. Needs create_outfit_rolls.
--   create_outfit_*_pct      the three independent rolls (Kevin: "we can always mix and match").
--   create_outfit_preview_user_ids
--                            accounts that get both switches while they are globally off, so Kevin can
--                            review real renders before the flip. Seeded with Kevin's account only.
--
-- Measured before shipping (text harness, 34 prompts, couples + solo): user garment 88% -> 100%, user
-- colour 88% -> 100%, wearing the partner's colour 38% -> 0%, dress next to a suit 22% -> 0%, sunglasses
-- on a solo face 6/6 -> 0.
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET create_outfit_rolls = false, create_outfit_user_lock = false,
--          create_outfit_preview_user_ids = '{}' WHERE id = 1;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS create_outfit_rolls boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS create_outfit_user_lock boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS create_outfit_independent_pct integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS create_outfit_separate_cut_pct integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS create_outfit_pattern_pct integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS create_outfit_preview_user_ids uuid[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.engine_config.create_outfit_rolls IS
  'Create: per-person outfit plan (own colour, never the partner''s; silhouette; pattern). false = today.';
COMMENT ON COLUMN public.engine_config.create_outfit_user_lock IS
  'Create: read and lock what the user asked each person to wear. Needs create_outfit_rolls.';
COMMENT ON COLUMN public.engine_config.create_outfit_independent_pct IS
  'Create outfits: % of couples in independent colours (the rest coordinated, one colour each).';
COMMENT ON COLUMN public.engine_config.create_outfit_separate_cut_pct IS
  'Create outfits: % of couples with a different silhouette each (the rest share one).';
COMMENT ON COLUMN public.engine_config.create_outfit_pattern_pct IS
  'Create outfits: % chance per person of a pattern (the rest solid).';
COMMENT ON COLUMN public.engine_config.create_outfit_preview_user_ids IS
  'Create outfits: accounts that get both outfit switches while they are globally off (review before the flip).';

UPDATE public.engine_config
   SET create_outfit_preview_user_ids = ARRAY['eab700d8-f11a-4f47-a3a1-addda6fb67ec']::uuid[]
 WHERE id = 1;

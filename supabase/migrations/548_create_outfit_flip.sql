-- 548_create_outfit_flip.sql — turn the Create outfit plan on for everyone, 2026-09-23.
-- Kevin, after reviewing the preview renders: "the test renders look good to me … go for it".
--
-- What goes live (migration 547, CREATE_OUTFIT_PLAN.md): every Create face-swap dream with the user and/or
-- their +1 gets a per-person outfit plan (each person's own colour, never the partner's; a silhouette; a
-- pattern or solid, rolled 50/50/50), and whatever the user asked each person to wear is read and locked
-- (their garment, their colour, a team/brand's own colours, plain clothes honored, face occluders dropped).
--
-- Evidence before the flip: text harness (34 prompts, couples + solo) user garment / colour / pattern kept
-- 100%, wearing the partner's colour 0%, formal dress-next-to-suit 1/15 (baseline 22%); 24 real renders on
-- Kevin's preview account, all completed, 14/14 couples held the dual swap first try.
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET create_outfit_rolls = false, create_outfit_user_lock = false WHERE id = 1;

UPDATE public.engine_config
   SET create_outfit_rolls = true,
       create_outfit_user_lock = true
 WHERE id = 1;

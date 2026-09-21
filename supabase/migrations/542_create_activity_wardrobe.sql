-- 542_create_activity_wardrobe.sql — dress Create's cast for the ACTIVITY, not a rolled aesthetic, 2026-09-21.
-- Kevin, grading the couple probe: "the outfits we have on are ridiculous" … "half the time it's some fancy
-- outfit, and not ski jacket/pants".
--
-- WHAT WAS WRONG
-- `buildSlotBrief` picks a wardrobe register from `wardrobeMoodFor(input.sceneRegister ?? null)`. Only
-- nightly-dreams sets `sceneRegister`, so EVERY Create cast dream fell to the `casual` subset — which is not
-- casual at all, it is: bold statement pieces / retro resort glamour / sharp tailored outerwear /
-- vintage-cinema wardrobe (hats, gloves, polished shoes) / romantic flowing fabrics / mid-century elegance
-- (structured coats, silk scarves). Four of the six are formalwear registers, which is exactly the "half the
-- time" Kevin measured by eye. On "Show me and Steph snowboarding" the engine produced gold brocade trim,
-- an ivory cravat, a velvet ski jacket with gold piping and wide-leg ivory sateen snow trousers.
--
-- WHY NOT MORE POOLS
-- Kevin: "people could prompt literally anything, so we can't seed countless collections to slot in depending
-- on the activity?" — correct, and it is also unnecessary. Sonnet already knows what people wear to snowboard,
-- scuba dive or work a forge. The register was OVERRIDING that knowledge, not supplying it. And the
-- no-plain-clothes rule Kevin set on 2026-09-18 is enforced INDEPENDENTLY by the PLAIN_CLOTHES regex in
-- _shared/characterSlotPrompt.ts — that validator, not the mood pool, is what killed the
-- merino-pullover-and-cargo-pants renders.
--
-- This RESTORES the 2026-09-18 directive rather than reversing it. His words were "everyone should be tailored
-- for LOCATIONS and built to stand out", and the renders he cited approvingly were a fedora and a cocktail in
-- the city, Star Trek uniforms on the bridge — both place-correct costumes. WARDROBE_MOODS is the
-- implementation that drifted off that intent. The ban list is untouched by this migration.
--
-- ON: the register sentence is replaced with the activity the prompt splitter already extracted, plus an
-- instruction to reach for the elevated name of the functional garment (a brushed midlayer, not a fleece) —
-- because PLAIN_CLOTHES hard-bans fleece / puffer vest / sweater / jeans / "practical" in a wardrobe field, and
-- asking for functional dress without that steer would burn both retries and land on the generic couture
-- fallback, which is strictly worse than the bug.
--
-- OFF (default): byte-identical to today. Nightly and first-dream never read this column at all — first-dream
-- holds no slot input, it POSTs to nightly-dreams.
--
-- ROLLBACK:
--   UPDATE public.engine_config SET create_activity_wardrobe = false WHERE id = 1;
--   ALTER TABLE public.engine_config DROP COLUMN IF EXISTS create_activity_wardrobe;
BEGIN;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS create_activity_wardrobe boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.engine_config.create_activity_wardrobe IS
  'Create only: anchor the wardrobe brief to what the cast is DOING (from promptSceneSplit) instead of a '
  'rolled WARDROBE_MOODS aesthetic. Create never sets sceneRegister, so it drew the formalwear-heavy '
  '"casual" subset and dressed snowboarders in cravats. false = today''s register sentence.';

COMMIT;

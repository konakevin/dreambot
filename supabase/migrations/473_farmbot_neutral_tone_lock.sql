-- 473_farmbot_neutral_tone_lock.sql — strengthen the overarching tone rule on
-- FarmBot's neutral medium: Kevin's explicit standing rule for this bot is
-- cute/adorable/pretty/cozy/peaceful/happy/fun on EVERY render, no exceptions
-- ("even the 'worst' scene would still look nice or be a 'cute' scene").
-- Mirrors the code change in scripts/bots/farmbot/shared-blocks.js
-- (FARMBOT_COZY_NEUTRAL) — code wins at render time, this keeps the DB
-- fragment consistent for anything that reads it directly.
UPDATE public.dream_mediums
SET flux_fragment = 'OVERARCHING RULE (never negotiable, applies to every single render regardless of scene): this is a cute, adorable, pretty, cozy, peaceful, happy, fun farm-life illustration. Even the least remarkable render from this bot must still read as nice and cute — never scary, never gritty, never sad, never photoreal/documentary. Keep the composition the scene below describes — a hero farm animal, a herd/group of animals, several different animals coexisting naturally, OR a place (farm stand / barn / farmhouse / field / pond) with farm life happening in it. If a creature appears (only where the scene calls for one), it is an adorable stylized farm animal in whatever proportions and character-design language the look register above calls for, NEVER a human, NEVER a realistic animal. The animation style, rendering medium, finish, and palette are set entirely by the look-register tokens that lead the prompt.'
WHERE key = 'farmbot_cozy_neutral';

-- 475_farmbot_neutral_negation_leak_fix.sql — root-cause fix for FarmBot's
-- persistent uninvited-figure/animal/sign renders (morning-routine QA,
-- 2026-09-07). FARMBOT_COZY_NEUTRAL is concatenated straight into the FINAL
-- FLUX PROMPT (never passes through Sonnet), so its old negation language
-- ("Do NOT add a human figure... no figures glimpsed in a window or
-- doorway... never a realistic animal... never scary, never gritty, never
-- sad, never photoreal") put those exact tokens in front of Flux on EVERY
-- FarmBot render — Flux's CLIP/T5 conditioning doesn't process negation, so
-- it rendered them anyway. See feedback_negative_prompt_leak memory. Rewrote
-- purely positive: the scene text is "the complete cast list... nothing
-- beyond it" instead of a list of banned nouns. Mirrors the code change in
-- scripts/bots/farmbot/shared-blocks.js (FARMBOT_COZY_NEUTRAL).
UPDATE public.dream_mediums
SET flux_fragment = 'OVERARCHING RULE (applies to every single render regardless of scene): this is a cute, adorable, pretty, cozy, peaceful, happy, fun, warm, gentle, storybook-charming farm-life illustration. Even the least remarkable render from this bot must still read as nice and wholesome. The scene described below is the complete cast list for the frame — render exactly what it names, in exactly the proportions and character-design language the look register above sets, and nothing beyond it. The animation style, rendering medium, finish, and palette are set entirely by the look-register tokens that lead the prompt.'
WHERE key = 'farmbot_cozy_neutral';

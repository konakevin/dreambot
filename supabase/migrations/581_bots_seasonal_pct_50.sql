-- 581_bots_seasonal_pct_50.sql — bots draw holiday content on 50% of posts while a holiday
-- they have content for is in season (was 30%, migration 469). Kevin 2026-09-29.
--
-- Context: in the Fall audit (HOLIDAY_DREAMS_PLAN.md, 2026-09-29) Kevin expected bots to
-- roll Fall about as often as nightly does (Fall peaks at 50% there). The same change moved
-- each bot's existing autumn/pumpkin paths into seasonalPaths.fall (ChibiBot, TinyBot,
-- BloomBot, FarmBot), so the higher rate has content behind it.
--
-- How the dial works (scripts/lib/botSeasonal.js): on each post, a bot with seasonal paths
-- for an in-season holiday draws from them with this probability; when two holidays it has
-- content for are both in season (October: Fall + Halloween), the second roll picks which
-- one by each holiday's own calendar weight. Bots with no seasonal paths are unaffected.
--
-- Rollback: UPDATE public.engine_config SET bots_seasonal_pct = 30 WHERE id = 1;

UPDATE public.engine_config SET bots_seasonal_pct = 50 WHERE id = 1;

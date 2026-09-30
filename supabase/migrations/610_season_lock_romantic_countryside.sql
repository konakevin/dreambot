-- 610: season lock + a romantic countryside biome for Romantic Escapes (Kevin 2026-09-30).
--
-- 1. location_cards.season_lock (spring / summer / autumn / winter, NULL = follow the calendar). A card defined by one
--    season always gets that season's scene-only signal (_shared/sceneSeason.ts seasonMonthFor). QA on 2026-09-30 (an
--    autumn date) put "autumn gold, russet grass, rust-leaved oaks" into Tuscan Villa and russet leaves between the
--    lavender rows; Cherry Blossoms' zen_garden biome asks for "maples turned crimson" in autumn and "bare branches"
--    in winter. Kevin: "we should implement the lock". NULL everywhere else: no other card changes.
-- 2. Tuscan Villa and Lavender Fields move from mediterranean_coastal (which dresses for the BEACH) to the new
--    romantic_countryside biome: outfit setting 'romantic' (flowing and slinky dresses, silk, open-collar linen),
--    its own action register (wine at a linen-draped table, a basket of cut lavender), seasonal, locked to summer.
--    Kevin: "could we not just create a new biome and wire it in for cases like this?"
-- Re-runnable.

ALTER TABLE public.location_cards ADD COLUMN IF NOT EXISTS season_lock text;
ALTER TABLE public.location_cards DROP CONSTRAINT IF EXISTS location_cards_season_lock_check;
ALTER TABLE public.location_cards
  ADD CONSTRAINT location_cards_season_lock_check CHECK (season_lock IN ('spring', 'summer', 'autumn', 'winter'));

COMMENT ON COLUMN public.location_cards.season_lock IS
  'One-season card: the scene-only season signal always reads this season, never the calendar (mig 610). NULL = calendar.';

UPDATE public.location_cards SET season_lock = 'spring' WHERE name = 'cherry blossoms';
UPDATE public.location_cards SET biome = 'romantic_countryside', season_lock = 'summer'
WHERE name IN ('tuscan villa', 'lavender fields');

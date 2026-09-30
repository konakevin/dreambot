-- 604: a romance tile (Kevin 2026-09-30: "gardens and romance is a good tile to keep ... poach a few cards from other
-- tiles to beef it up ... a lot of people, especially couples would like"; he took the moves except Bora Bora).
--
-- Cards moved in: Rose Palace (from Whimsical), Vineyard Estate and Alpine Chalet (from Jet Set), plus the Gardens &
-- Romance scene card (mig 594, from Jet Set). Tiles only: picker_category is unchanged, so released apps and the
-- engine's scenario tags are unaffected.
--
-- The TITLE is the name users see (card names never show); "Romantic Escapes" is a placeholder until Kevin picks one,
-- and changing it is a one-row update. Not admin_only: the three place cards are already live, and no released app
-- reads this table, so the tile appears with the next build. Re-runnable.

INSERT INTO public.picker_tiles (key, title, description, icon, tier, sort_order, admin_only) VALUES
  ('romance', 'Romantic Escapes', 'Rose gardens, wine country, and candlelit evenings', 'heart-outline', 'real', 95, false)
ON CONFLICT (key) DO UPDATE SET
  description = EXCLUDED.description, icon = EXCLUDED.icon, tier = EXCLUDED.tier, sort_order = EXCLUDED.sort_order;

UPDATE public.location_cards SET picker_tile = 'romance'
WHERE name IN ('rose garden palace', 'vineyard estate', 'alpine chalet', 'gardens and romance');

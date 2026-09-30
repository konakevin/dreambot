-- 602: Through Time splits into Ancient Worlds and Vintage Eras (Kevin 2026-09-30: "split it that way"). With the three
-- era scene cards (mig 594) it held 16 eras; someone who loves togas and knights may not want Gatsby parties, and the
-- other way round, the same reasoning as the World Traveler split (mig 592).
--
--   Ancient Worlds (10): Prehistoric, Ancient Egypt, Ancient Greece, Ancient Rome, Viking Age, Silk Road, Medieval
--                        Times, Feudal Japan, Renaissance, Age of Pirates
--   Vintage Eras (6):    Regency England, Victorian London, Roaring 20s, 1940s Noir, 1950s Americana, Retro Decades
--
-- Tiles only: picker_category stays 'through_time', so released apps keep their Through Time tile and the engine and
-- scenario tags are unchanged. Picks are saved by place name, so anyone who picked Through Time sees both new tiles
-- selected. Re-runnable.

INSERT INTO public.picker_tiles (key, title, description, icon, tier, sort_order, admin_only) VALUES
  ('ancient_worlds', 'Ancient Worlds', 'Pyramids, legions, longships, and samurai', 'hourglass-outline', 'real', 80, false),
  ('vintage_eras', 'Vintage Eras', 'Regency balls, gaslit London, jazz clubs, and retro nights', 'film-outline', 'real', 85, false)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, tier = EXCLUDED.tier,
  sort_order = EXCLUDED.sort_order;

UPDATE public.location_cards SET picker_tile = 'ancient_worlds' WHERE name IN (
  'prehistoric', 'ancient egypt', 'ancient greece', 'ancient rome', 'viking longhouse', 'silk road', 'medieval village',
  'feudal japan', 'renaissance venice', 'pirate cove');
UPDATE public.location_cards SET picker_tile = 'vintage_eras' WHERE name IN (
  'regency england', 'victorian london', '1920s speakeasy', '1940s noir', '1950s americana', 'retro decades');

-- Retire the combined tile once nothing points at it.
UPDATE public.picker_tiles SET is_active = false
WHERE key = 'through_time' AND NOT EXISTS (SELECT 1 FROM public.location_cards WHERE picker_tile = 'through_time');

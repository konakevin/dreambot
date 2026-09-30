-- 598: the Sports & Adventure tile is retired and its scenes rehomed (Kevin 2026-09-30: "sports and adventure is
-- somewhat thin ... move the adventure part into nature and wild ... figure out where to put the finish lines and
-- stadium glory"; he chose the rehome over removal). SCENARIO_LOCATION_SCOPE.md.
--
-- Adventure Sports (a scenario card) is dissolved: each scene joins the tile where it happens as a CATEGORY tag, so it
-- is part of that tile's normal scenario mix (Sonnet-sorted, 511 scenes): Nature & Wild 301, Tropical Escapes 74,
-- Beach Towns 57; 79 (urban climbing walls, longboarding a city road) fit nowhere and go dormant.
-- Sports & Arenas becomes CHAMPIONS, a scenario card inside Heroes (482 scenes: stadiums, podiums, finish lines, title
-- fights); its 120 motorsport scenes go to Race Track Garage; 77 that are not really sport moments go dormant.
-- Re-runnable.

UPDATE public.location_cards SET name = 'champions', display_name = 'Champions', picker_tile = 'heroes',
  picker_category = 'heroes_adventure', picker_sort_order = 99
WHERE name = 'sports arenas' AND NOT EXISTS (SELECT 1 FROM public.location_cards WHERE name = 'champions');

-- dual: sports
-- dual: adventure
UPDATE public.dual_scenarios SET location_keys = array_remove(array_remove(location_keys, 'sports arenas'), 'adventure sports')
WHERE location_keys && ARRAY['sports arenas', 'adventure sports'];

-- single: sports
-- single: adventure
UPDATE public.single_scenarios SET location_keys = array_remove(array_remove(location_keys, 'sports arenas'), 'adventure sports')
WHERE location_keys && ARRAY['sports arenas', 'adventure sports'];

DELETE FROM public.location_cards WHERE name = 'adventure sports' AND content_kind = 'scenarios' AND admin_only = true;
UPDATE public.picker_tiles SET is_active = false WHERE key = 'sports_arenas';

-- 623: Just for Fun splits in two (Kevin 2026-09-30: "is there any more subdivision we could give just for fun so that
-- we could have an even number of tiles in thrills and chills?"; he named the halves). The seam is the mood of the
-- scenes, not a place:
--   Just for Fun  the goofy pool: animal mayhem, baby-chick swarms, absurd and cute moments (1,165 couple / 1,570 solo)
--   Game On       the active and elegant rows: skee-ball, karaoke pods, skate bowls, banana boats, drift trikes, glow
--                 nights (544 couple / 846 solo, moved here)
-- Game On is a new scenario card (content_kind 'scenarios', like Just for Fun) in a new tile under the same group,
-- admin-only until the 1.11.0 go-live; nobody holds Just for Fun yet, so no picks move. picker_category game_on is one
-- no released app lists. Rows keep every other tag. Count-guarded. Re-runnable.

INSERT INTO public.picker_tiles (key, title, description, icon, tier, sort_order, admin_only, section) VALUES
  ('game_on', 'Game On', 'Skee-ball, karaoke, skate bowls, and glow-in-the-dark nights', 'game-controller-outline', 'imagined', 195, true,
   (SELECT section FROM public.picker_tiles WHERE key = 'just_for_fun'))
ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon,
  tier = EXCLUDED.tier, sort_order = EXCLUDED.sort_order, section = EXCLUDED.section;

UPDATE public.picker_tiles SET description = 'Silly animals, baby-chick swarms, and delightfully absurd moments'
WHERE key = 'just_for_fun';

INSERT INTO public.location_cards (name, display_name, picker_category, picker_tile, picker_sort_order, content_kind, admin_only) VALUES
  ('game on', 'Game On', 'game_on', 'game_on', 10, 'scenarios', true)
ON CONFLICT (name) DO NOTHING;

DO $$
DECLARE
  d int;
  s int;
BEGIN
  UPDATE public.dual_scenarios
  SET location_keys = array_append(array_remove(location_keys, 'just for fun'), 'game on')
  WHERE 'just for fun' = ANY(location_keys) AND pool NOT IN ('goofy', 'holiday');
  GET DIAGNOSTICS d = ROW_COUNT;
  UPDATE public.single_scenarios
  SET location_keys = array_append(array_remove(location_keys, 'just for fun'), 'game on')
  WHERE 'just for fun' = ANY(location_keys) AND pool NOT IN ('goofy', 'holiday');
  GET DIAGNOSTICS s = ROW_COUNT;
  IF d > 544 OR s > 846 THEN
    RAISE EXCEPTION '623: expected at most 544 couple / 846 solo rows, moved % / %', d, s;
  END IF;
END $$;

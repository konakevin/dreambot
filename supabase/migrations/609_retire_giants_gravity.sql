-- 609: retire Land of Giants and Gravity's Off (Kevin 2026-09-30: "retire those paths that didn't work"). Two QA rounds:
-- every spot reached the prompt, but Flux draws the object and drops the impossible part (scale, inverted physics), so
-- the cards never showed what they are named for. Both were admin-only: no user picks, no scenario tags, no
-- first-dream cards, no location_spots (checked 2026-09-30). Deleted, not disabled (Kevin's standing preference). JSON
-- backup of the 2 cards and 138 spots: scratchpad surreal/retired-cards-backup.json; the daily off-site backup holds
-- them too. Glowing Elements and Impossible Whimsy stay. Count-guarded.

DO $$
DECLARE
  n int;
BEGIN
  SELECT count(*) INTO n FROM public.location_iconic_spots WHERE location_key IN ('land of giants', 'gravity-free realm');
  IF n > 138 THEN
    RAISE EXCEPTION '609: expected at most 138 spots, found %', n;
  END IF;
  DELETE FROM public.location_iconic_spots WHERE location_key IN ('land of giants', 'gravity-free realm');

  SELECT count(*) INTO n FROM public.location_cards WHERE name IN ('land of giants', 'gravity-free realm');
  IF n > 2 THEN
    RAISE EXCEPTION '609: expected at most 2 cards, found %', n;
  END IF;
  DELETE FROM public.location_cards WHERE name IN ('land of giants', 'gravity-free realm');
END $$;

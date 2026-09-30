-- 620: one more tile image from the sheet (Kevin 2026-09-30: "i updated the space image to the mars one"): Mars Colony
-- leads Sci-Fi & Space, the same rule as mig 619 (one below the tile's minimum picker_sort_order).

DO $$
DECLARE
  lo int;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.location_cards
                 WHERE name = 'mars colony' AND picker_tile = 'scifi' AND thumbnail_url IS NOT NULL) THEN
    RAISE EXCEPTION '620: mars colony is not a card with a thumbnail in tile scifi';
  END IF;
  SELECT min(picker_sort_order) INTO lo FROM public.location_cards WHERE picker_tile = 'scifi' AND name <> 'mars colony';
  UPDATE public.location_cards SET picker_sort_order = coalesce(lo, 0) - 1 WHERE name = 'mars colony';
END $$;

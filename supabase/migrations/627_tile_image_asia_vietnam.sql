-- 627: Kevin's new Asia & Pacific tile image (picked on the tile sheet 2026-09-30): Vietnam (Ha Long Bay) leads the
-- tile, the same rule as migs 619 / 620 (one below the tile's minimum picker_sort_order).

DO $$
DECLARE
  lo int;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.location_cards
                 WHERE name = 'vietnam' AND picker_tile = 'asia_pacific' AND thumbnail_url IS NOT NULL) THEN
    RAISE EXCEPTION '627: vietnam is not a card with a thumbnail in tile asia_pacific';
  END IF;
  SELECT min(picker_sort_order) INTO lo FROM public.location_cards WHERE picker_tile = 'asia_pacific' AND name <> 'vietnam';
  UPDATE public.location_cards SET picker_sort_order = coalesce(lo, 0) - 1 WHERE name = 'vietnam';
END $$;

-- 619: Kevin's tile images (2026-09-30, picked on the tile sheet: "ok i'm done voting on the tiles"). A tile's image in
-- the picker is its first card (picker_sort_order) that has a thumbnail, so each picked card moves to the front of its
-- tile: one below the tile's current minimum. Only the picker reads picker_sort_order. The released 1.10.0 app groups by
-- picker_category, so some of its old tiles may change image too (Venice leads the old "Around the World" row).
-- Nature & Wild keeps Yosemite (Kevin reverted his pick). Each card must be in its tile and have a thumbnail.

DO $$
DECLARE
  r record;
  lo int;
BEGIN
  FOR r IN SELECT * FROM (VALUES
      ('americas',           'los angeles'),
      ('asia_pacific',       'hong kong'),
      ('beach_towns',        'coney island'),
      ('europe',             'venice'),
      ('gothic',             'haunted mansion'),
      ('middle_east_africa', 'egypt'),
      ('romance',            'gardens and romance'),
      ('surreal_dreams',     'impossible wonderland'),
      ('tropical_escapes',   'caribbean islands'),
      ('vintage_eras',       'victorian london'),
      ('whimsical',          'fairy tea party')
    ) AS v(tile, card)
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.location_cards
                   WHERE name = r.card AND picker_tile = r.tile AND thumbnail_url IS NOT NULL) THEN
      RAISE EXCEPTION '619: % is not a card with a thumbnail in tile %', r.card, r.tile;
    END IF;
    SELECT min(picker_sort_order) INTO lo FROM public.location_cards WHERE picker_tile = r.tile AND name <> r.card;
    UPDATE public.location_cards SET picker_sort_order = coalesce(lo, 0) - 1 WHERE name = r.card;
  END LOOP;
END $$;

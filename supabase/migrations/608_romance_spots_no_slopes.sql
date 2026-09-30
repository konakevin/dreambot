-- 608: three Romantic Escapes spots say "slopes", and the nightly outfit classifier reads a bare "slopes" as snow
-- (_shared/sceneSetting.ts snow words): QA dressed a lavender-fields dreamer at Hvar in a 1970s ski jacket
-- (outfit_setting:snow:place_name, 2026-09-30). "hillsides" says the same thing. The engine regex itself is a
-- production nightly change, left for Kevin (it touches ~43 spots across ~30 cards). Re-runnable.

UPDATE public.location_iconic_spots SET spot_text = 'Hvar town fortress, lavender-covered hillsides and ancient stone ramparts'
WHERE id = 'aa54b99b-6b2b-4f7b-b6c1-179915255247';
UPDATE public.location_iconic_spots SET spot_text = 'Togetsukyo Bridge, Arashiyama blossom hillsides reflected in the river'
WHERE id = '770f61b3-7022-40d0-a2de-58fc13a22aa5';
UPDATE public.location_iconic_spots SET spot_text = 'Arashiyama Hozu River gorge, blossom-draped hillsides above still water'
WHERE id = 'db475b94-95f7-45c7-9a24-2bdd801f790a';

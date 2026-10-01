-- 642_card_concepts_widened: five card definitions from mig 641 drawn too tight, found by the phase 4 drift review
-- (NIGHTLY_POOL_CLEANUP_PLAN.md). Each card's own rule invites what the definition shut out, so the definition widens
-- and those spots stay:
--   Cancun: its rule names "clifftop Mayan ruins by the sea" (Tulum) and Isla Mujeres sits across the bay.
--   Haleiwa: its rule names "world-famous surf breaks" (Waimea, Pipeline, Sunset Beach).
--   Hanalei: Kauai's north shore around it (Na Pali, Kilauea Point), not the south and west sides.
--   Feudal Japan: Fuji and the classic landscapes ukiyo-e painted belong to it.
--   Tahiti: its rule is "a Tahitian island paradise of French Polynesia"; Bora Bora stays its own card.
-- Appends one sub-region and, where it changes, replaces the last ("never ...") item. Guarded: re-runnable.

UPDATE public.location_cards
SET sub_regions = sub_regions || ARRAY[
      'Isla Mujeres across the bay (Playa Norte, the Punta Sur cliffs and the Ixchel temple ruins, the lighthouse)',
      'Tulum''s clifftop ruins (El Castillo above the Caribbean, the Temple of the Frescoes, the beach below the ramparts)']::text[],
    must_include = must_include[1:cardinality(must_include) - 1]
      || ARRAY['never cenotes, inland jungle, Cozumel, Holbox, or another Caribbean island']::text[]
WHERE name = 'cancun' AND NOT sub_regions @> ARRAY['Isla Mujeres across the bay (Playa Norte, the Punta Sur cliffs and the Ixchel temple ruins, the lighthouse)']::text[];

UPDATE public.location_cards
SET sub_regions = sub_regions || ARRAY['North Shore surf breaks (Waimea Bay, Banzai Pipeline, Sunset Beach, Shark''s Cove, Pu''u o Mahuka above Waimea)']::text[],
    must_include = must_include[1:cardinality(must_include) - 1]
      || ARRAY['never inland Oahu, Honolulu, or the coast beyond the North Shore''s beaches']::text[]
WHERE name = 'haleiwa' AND NOT sub_regions @> ARRAY['North Shore surf breaks (Waimea Bay, Banzai Pipeline, Sunset Beach, Shark''s Cove, Pu''u o Mahuka above Waimea)']::text[];

UPDATE public.location_cards
SET sub_regions = sub_regions || ARRAY['Kauai''s north shore around it (the Na Pali cliffs and Kalalau, Hanakapi''ai, Kilauea Point lighthouse, Secret Beach)']::text[],
    must_include = must_include[1:cardinality(must_include) - 1]
      || ARRAY['never Kauai''s south or west side (Poipu, Waimea Canyon), a resort strip, or another Hawaiian island']::text[]
WHERE name = 'hanalei' AND NOT sub_regions @> ARRAY['Kauai''s north shore around it (the Na Pali cliffs and Kalalau, Hanakapi''ai, Kilauea Point lighthouse, Secret Beach)']::text[];

UPDATE public.location_cards
SET sub_regions = sub_regions || ARRAY['Timeless landscapes as ukiyo-e painted them (Mount Fuji over its lakes, Takachiho and Iya gorges, Kegon Falls, Amanohashidate, pine shores, the Naruto whirlpools)']::text[]
WHERE name = 'feudal japan' AND NOT sub_regions @> ARRAY['Timeless landscapes as ukiyo-e painted them (Mount Fuji over its lakes, Takachiho and Iya gorges, Kegon Falls, Amanohashidate, pine shores, the Naruto whirlpools)']::text[];

UPDATE public.location_cards
SET sub_regions = sub_regions || ARRAY['The wider islands of French Polynesia (Huahine, Raiatea and Taha''a, Rangiroa, Fakarava, Tikehau, the Marquesas)']::text[]
WHERE name = 'tahiti' AND NOT sub_regions @> ARRAY['The wider islands of French Polynesia (Huahine, Raiatea and Taha''a, Rangiroa, Fakarava, Tikehau, the Marquesas)']::text[];

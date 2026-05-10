-- 164 — Per-location seed-generation hints
--
-- Hand-curated guidance per location that gets woven into the gen-iconic-spots
-- meta-prompt. Lets us tune Sonnet's output per location without writing a
-- bespoke script per location. One generic script reads these hints from DB.
--
-- sub_regions: distinct geographic / thematic sub-areas Sonnet should spread
--   coverage across (e.g., "Oahu North Shore" for hawaii, "Highlands" for iceland)
-- must_include: feature categories that must appear in the pool (e.g.,
--   "named beaches", "surf spots", "botanical gardens" for hawaii)

ALTER TABLE public.location_cards
  ADD COLUMN IF NOT EXISTS sub_regions text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS must_include text[] DEFAULT '{}';

-- Hawaii — proof-of-pattern hints
UPDATE public.location_cards SET
  sub_regions = ARRAY[
    'Oahu South Shore (Waikiki, Diamond Head, Hanauma)',
    'Oahu East Side (Lanikai, Kailua, Mokulua, Makapuʻu)',
    'Oahu North Shore (Banzai Pipeline, Waimea Bay, Sunset Beach, Sharkʻs Cove, Pupukea)',
    'Oahu West Side (Kaena Point, Makaha)',
    'Oahu Interior (Manoa Falls, Tantalus, Pillbox hikes, Nuʻuanu Pali)',
    'Maui West (Kāʻanapali, Black Rock, Lahaina, Kapalua, Honolua)',
    'Maui South (Wailea, Makena, Molokini)',
    'Maui Upcountry (Haleakalā, Iao Valley)',
    'Maui Hāna Coast (Road to Hāna, Waiʻanapanapa, Seven Sacred Pools, Twin Falls, Pipiwai bamboo)',
    'Big Island Kona Coast (Kealakekua, Captain Cook Monument)',
    'Big Island Kohala (Hapuna, Mauna Kea Beach, Pololū)',
    'Big Island Hilo Side (Akaka Falls, Rainbow Falls, Hilo Bay)',
    'Big Island South Point (Green Sand, Punaluʻu Black Sand)',
    'Big Island Volcano (Halemaʻumaʻu, Kīlauea Iki, Chain of Craters, Thurston Lava Tube)',
    'Big Island Hāmākua Coast (Waipiʻo Valley, Akaka, Hamakua waterfalls)',
    'Kauai South (Spouting Horn, Poipu, Glass Beach)',
    'Kauai West (Waimea Canyon, Polihale, Kalalau Lookout)',
    'Kauai Nā Pali Coast (Kalalau Trail, Honopu Beach)',
    'Kauai North Shore (Hanalei Bay, Princeville cliffs, Tunnels Beach, Keʻe Beach, Hideaways)',
    'Kauai East (Wailua Falls, Sleeping Giant, Opaekaʻa)',
    'Lanai (Garden of the Gods, Puʻu Pehe Sweetheart Rock, Shipwreck Beach)',
    'Molokai (Sea Cliffs, Halawa Valley, Papohaku Beach)'
  ],
  must_include = ARRAY[
    'named beaches (specific named beaches across all islands)',
    'surf spots (Banzai Pipeline, Waimea Bay, Sunset, Honolua, etc.)',
    'snorkel reefs and coves (Hanauma, Sharkʻs Cove, Tunnels, Molokini, Honolua)',
    'waterfalls (Akaka, Wailua, Manoa, Rainbow, Twin, Maunawili, Seven Sacred Pools)',
    'valleys and canyons (Waimea Canyon, Iao, Waipiʻo, Pololū, Kalalau, Hanapepe)',
    'volcanic features (Halemaʻumaʻu, Mauna Kea summit, craters, lava tubes, cinder cones)',
    'iconic hikes (Diamond Head, Manoa Falls, Pillbox hikes, Olomana, Kalalau, Pipiwai bamboo)',
    'lookouts (Kalalau, Tantalus, Nuʻuanu Pali, Lanikai Pillbox, Pu''u Ualakaʻa)',
    'botanical gardens (Hoʻomaluhia, Foster, Lyon, Limahuli, Allerton, Koko Crater, Waimea Valley)',
    'iconic towns (Haleiwa, Hanalei, Hana, Lahaina, Paia, Hilo, Kona, Kailua)',
    'sea features (Spouting Horn, blowholes, sea arches, lava tubes, sea stacks)',
    'cliffs and coasts (Nā Pali, Hamakua, Molokaʻi sea cliffs, Kīlauea Lighthouse)'
  ]
WHERE name = 'hawaii';

NOTIFY pgrst, 'reload schema';

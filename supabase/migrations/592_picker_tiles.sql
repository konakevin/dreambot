-- 592: the location picker's TILES live in the database (SCENARIO_LOCATION_SCOPE.md, Kevin 2026-09-30: "move it as
-- necessary to accomplish the objective of this seed migration").
--
-- Until now the 12 tiles were hard-coded in LocationPickerStep.tsx (SECTION_META), so every new tile needed an app
-- release. From the app build that reads this table, a tile is a row here and a card joins it via
-- location_cards.picker_tile. Old app versions never read either, and picker_category is untouched, so they keep
-- their 12 tiles exactly as before. The engine and the scenario tags keep using picker_category.
--
-- World Traveler (43 places) splits into four regional tiles (Kevin: "people who want renders in japan or china may
-- not care about new york"). Saved picks are place names, so anyone who picked World Traveler sees all four
-- selected. World Wonders spans every continent: it leaves the picker (picker_tile NULL) but stays a valid card, so
-- saved picks of it keep working; regional wonders cards replace it (a later migration).
--
-- New tiles for the scenario groups start admin_only (visible to admins only) and empty; a tile with no visible cards
-- does not render.

CREATE TABLE IF NOT EXISTS public.picker_tiles (
  key text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,           -- an Ionicons name; the app falls back to a pin for an unknown one
  tier text NOT NULL CHECK (tier IN ('real', 'imagined')),
  sort_order integer NOT NULL,
  admin_only boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.picker_tiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read picker tiles" ON public.picker_tiles;
CREATE POLICY "Anyone can read picker tiles" ON public.picker_tiles FOR SELECT USING (true);
GRANT SELECT ON public.picker_tiles TO anon, authenticated;

INSERT INTO public.picker_tiles (key, title, description, icon, tier, sort_order, admin_only) VALUES
  ('europe',             'Europe',               'Paris, Rome, Highland castles, and the Mediterranean coast', 'library-outline',   'real',     10, false),
  ('asia_pacific',       'Asia & Pacific',       'Tokyo nights, ancient temples, and the Australian coast',   'globe-outline',     'real',     20, false),
  ('americas',           'The Americas',         'New York, Rio, Mexico, and the California coast',          'earth-outline',     'real',     30, false),
  ('middle_east_africa', 'Middle East & Africa', 'Dubai skylines, Egyptian wonders, and Moroccan medinas',    'compass-outline',   'real',     40, false),
  ('tropical_escapes',   'Tropical Escapes',     'Turquoise lagoons and island paradise',                      'sunny-outline',     'real',     50, false),
  ('beach_towns',        'Beach Towns',          'Boardwalks, beach houses, and sunset shores',                'umbrella-outline',  'real',     60, false),
  ('nature',             'Nature & Wild',        'Mountains, canyons, and wild landscapes',                    'leaf-outline',      'real',     70, false),
  ('through_time',       'Through Time',         'Ancient empires and bygone eras',                            'hourglass-outline', 'real',     80, false),
  ('high_life',          'Jet Set',              'Superyachts, penthouses, red carpets, and champagne',        'diamond-outline',   'real',     90, false),
  ('stage_spotlight',    'Stage & Spotlight',    'Concert stages, backstage, film sets, and galas',           'mic-outline',       'real',    100, true),
  ('sports_arenas',      'Sports & Adventure',   'Stadium glory, finish lines, and big thrills',               'trophy-outline',    'real',    110, true),
  ('fantasy',            'Fantasy',              'Elven cities, dragon keeps, and candlelit castles',          'sparkles-outline',  'imagined', 210, false),
  ('gothic',             'Gothic & Haunted',     'Vampire castles, foggy graveyards, haunted halls',           'moon-outline',      'imagined', 220, false),
  ('whimsical',          'Whimsical',            'Fairy-tale castles, candy lands, and sweet escapes',         'flower-outline',    'imagined', 230, false),
  ('just_for_fun',       'Just for Fun',         'Silly adventures, carnivals, and everyday chaos',            'happy-outline',     'imagined', 235, true),
  ('surreal_dreams',     'Surreal Dreams',       'Giant things, broken gravity, and glowing impossible worlds', 'infinite-outline', 'imagined', 238, true),
  ('scifi',              'Sci-Fi & Space',       'Neon megacities, alien worlds, and the stars',               'planet-outline',    'imagined', 240, false),
  ('wild_west',          'Wild West',            'Frontier towns, saloons, and desert standoffs',              'flame-outline',     'imagined', 250, false),
  ('heroes',             'Heroes',               'Rooftops, spy lairs, and daring feats',                      'flash-outline',     'imagined', 260, false)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, tier = EXCLUDED.tier,
  sort_order = EXCLUDED.sort_order;

ALTER TABLE public.location_cards
  ADD COLUMN IF NOT EXISTS picker_tile text REFERENCES public.picker_tiles(key) ON UPDATE CASCADE;

-- The tiles that map 1:1 from a picker_category.
UPDATE public.location_cards SET picker_tile = CASE picker_category
    WHEN 'tropical' THEN 'tropical_escapes'
    WHEN 'beach_towns' THEN 'beach_towns'
    WHEN 'epic_nature' THEN 'nature'
    WHEN 'through_time' THEN 'through_time'
    WHEN 'high_life' THEN 'high_life'
    WHEN 'high_fantasy' THEN 'fantasy'
    WHEN 'gothic_haunted' THEN 'gothic'
    WHEN 'whimsical_fun' THEN 'whimsical'
    WHEN 'scifi_space' THEN 'scifi'
    WHEN 'wild_west' THEN 'wild_west'
    WHEN 'heroes_adventure' THEN 'heroes'
  END
WHERE picker_category IN ('tropical', 'beach_towns', 'epic_nature', 'through_time', 'high_life', 'high_fantasy',
  'gothic_haunted', 'whimsical_fun', 'scifi_space', 'wild_west', 'heroes_adventure');

-- World Traveler, by region.
UPDATE public.location_cards SET picker_tile = 'europe' WHERE name IN (
  'paris', 'london', 'rome', 'venice', 'amsterdam', 'barcelona', 'prague', 'france', 'italy', 'spain', 'germany',
  'greece', 'ireland', 'scotland', 'santorini', 'amalfi coast', 'st ives cornwall', 'cascais portugal',
  'collioure france');
UPDATE public.location_cards SET picker_tile = 'asia_pacific' WHERE name IN (
  'tokyo', 'hong kong', 'seoul', 'singapore', 'sydney', 'japan', 'china', 'thailand', 'vietnam', 'india',
  'australia');
UPDATE public.location_cards SET picker_tile = 'americas' WHERE name IN (
  'new york city', 'los angeles', 'miami', 'san francisco', 'las vegas', 'rio de janeiro', 'mexico', 'brazil');
UPDATE public.location_cards SET picker_tile = 'middle_east_africa' WHERE name IN (
  'dubai', 'egypt', 'morocco', 'turkey');

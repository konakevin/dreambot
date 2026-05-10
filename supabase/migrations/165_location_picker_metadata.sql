-- 165 — DB-driven onboarding location picker
--
-- Adds the metadata columns needed for LocationPickerStep.tsx to render
-- entirely from location_cards instead of a hardcoded array. Eliminates
-- the source-of-truth split between code and DB that produced cruft
-- (hogwarts / disneyland / sea world etc. as orphan rows).
--
-- After this migration: adding a new location = INSERT a row. Removing =
-- set is_approved=false. No code deploy.

ALTER TABLE public.location_cards
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS picker_category text,
  ADD COLUMN IF NOT EXISTS picker_sort_order integer DEFAULT 0;

-- ── Iconic Cities & Travel ─────────────────────────────────────────────
UPDATE public.location_cards SET display_name='New York City',  picker_category='iconic_cities', picker_sort_order=1  WHERE name='new york city';
UPDATE public.location_cards SET display_name='Tokyo',           picker_category='iconic_cities', picker_sort_order=2  WHERE name='tokyo';
UPDATE public.location_cards SET display_name='Paris',           picker_category='iconic_cities', picker_sort_order=3  WHERE name='paris';
UPDATE public.location_cards SET display_name='Venice',          picker_category='iconic_cities', picker_sort_order=4  WHERE name='venice';
UPDATE public.location_cards SET display_name='London',          picker_category='iconic_cities', picker_sort_order=5  WHERE name='london';
UPDATE public.location_cards SET display_name='Dubai',           picker_category='iconic_cities', picker_sort_order=6  WHERE name='dubai';
UPDATE public.location_cards SET display_name='Santorini',       picker_category='iconic_cities', picker_sort_order=7  WHERE name='santorini';
UPDATE public.location_cards SET display_name='Hong Kong',       picker_category='iconic_cities', picker_sort_order=8  WHERE name='hong kong';
UPDATE public.location_cards SET display_name='Rome',            picker_category='iconic_cities', picker_sort_order=9  WHERE name='rome';
UPDATE public.location_cards SET display_name='Los Angeles',     picker_category='iconic_cities', picker_sort_order=10 WHERE name='los angeles';
UPDATE public.location_cards SET display_name='Miami',           picker_category='iconic_cities', picker_sort_order=11 WHERE name='miami';
UPDATE public.location_cards SET display_name='San Francisco',   picker_category='iconic_cities', picker_sort_order=12 WHERE name='san francisco';
UPDATE public.location_cards SET display_name='Barcelona',       picker_category='iconic_cities', picker_sort_order=13 WHERE name='barcelona';
UPDATE public.location_cards SET display_name='Rio de Janeiro',  picker_category='iconic_cities', picker_sort_order=14 WHERE name='rio de janeiro';
UPDATE public.location_cards SET display_name='Seoul',           picker_category='iconic_cities', picker_sort_order=15 WHERE name='seoul';
UPDATE public.location_cards SET display_name='Las Vegas',       picker_category='iconic_cities', picker_sort_order=16 WHERE name='las vegas';

-- ── Tropical Escapes ───────────────────────────────────────────────────
UPDATE public.location_cards SET display_name='Hawaii',                picker_category='tropical', picker_sort_order=1 WHERE name='hawaii';
UPDATE public.location_cards SET display_name='Maldives',              picker_category='tropical', picker_sort_order=2 WHERE name='maldives';
UPDATE public.location_cards SET display_name='Bali',                  picker_category='tropical', picker_sort_order=3 WHERE name='bali';
UPDATE public.location_cards SET display_name='Caribbean Island',      picker_category='tropical', picker_sort_order=4 WHERE name='caribbean island';
UPDATE public.location_cards SET display_name='Costa Rica',            picker_category='tropical', picker_sort_order=5 WHERE name='costa rica';
UPDATE public.location_cards SET display_name='Bora Bora / Tahiti',    picker_category='tropical', picker_sort_order=6 WHERE name='bora bora tahiti';

-- ── Ancient Wonders ────────────────────────────────────────────────────
UPDATE public.location_cards SET display_name='Ancient Egypt',         picker_category='ancient', picker_sort_order=1 WHERE name='ancient egypt';
UPDATE public.location_cards SET display_name='Machu Picchu',          picker_category='ancient', picker_sort_order=2 WHERE name='machu picchu';
UPDATE public.location_cards SET display_name='Angkor Wat',            picker_category='ancient', picker_sort_order=3 WHERE name='angkor wat';
UPDATE public.location_cards SET display_name='Ancient Rome',          picker_category='ancient', picker_sort_order=4 WHERE name='ancient rome';
UPDATE public.location_cards SET display_name='Petra',                 picker_category='ancient', picker_sort_order=5 WHERE name='petra';
UPDATE public.location_cards SET display_name='Taj Mahal',             picker_category='ancient', picker_sort_order=6 WHERE name='taj mahal';
UPDATE public.location_cards SET display_name='Great Wall of China',   picker_category='ancient', picker_sort_order=7 WHERE name='great wall of china';
UPDATE public.location_cards SET display_name='Stonehenge',            picker_category='ancient', picker_sort_order=8 WHERE name='stonehenge';

-- ── Epic Nature ────────────────────────────────────────────────────────
UPDATE public.location_cards SET display_name='Yosemite',              picker_category='epic_nature', picker_sort_order=1  WHERE name='yosemite';
UPDATE public.location_cards SET display_name='Moab / Arches',         picker_category='epic_nature', picker_sort_order=2  WHERE name='moab arches';
UPDATE public.location_cards SET display_name='Swiss Alps',            picker_category='epic_nature', picker_sort_order=3  WHERE name='swiss alps';
UPDATE public.location_cards SET display_name='Iceland',               picker_category='epic_nature', picker_sort_order=4  WHERE name='iceland';
UPDATE public.location_cards SET display_name='Canadian Rockies',      picker_category='epic_nature', picker_sort_order=5  WHERE name='canadian rockies';
UPDATE public.location_cards SET display_name='Grand Canyon',          picker_category='epic_nature', picker_sort_order=6  WHERE name='grand canyon';
UPDATE public.location_cards SET display_name='Zion National Park',    picker_category='epic_nature', picker_sort_order=7  WHERE name='zion national park';
UPDATE public.location_cards SET display_name='Redwood Forest',        picker_category='epic_nature', picker_sort_order=8  WHERE name='redwood forest';
UPDATE public.location_cards SET display_name='Amazon Rainforest',     picker_category='epic_nature', picker_sort_order=9  WHERE name='amazon rainforest';
UPDATE public.location_cards SET display_name='Arctic Wilderness',     picker_category='epic_nature', picker_sort_order=10 WHERE name='arctic wilderness';
UPDATE public.location_cards SET display_name='Sahara Desert',         picker_category='epic_nature', picker_sort_order=11 WHERE name='sahara desert';
UPDATE public.location_cards SET display_name='Big Sur Cliffs',        picker_category='epic_nature', picker_sort_order=12 WHERE name='big sur cliffs';

-- ── Sci-Fi / Futuristic ────────────────────────────────────────────────
UPDATE public.location_cards SET display_name='Alien Planet',          picker_category='scifi', picker_sort_order=1 WHERE name='alien planet';
UPDATE public.location_cards SET display_name='Cyberpunk Megacity',    picker_category='scifi', picker_sort_order=2 WHERE name='cyberpunk megacity';
UPDATE public.location_cards SET display_name='Space Station',         picker_category='scifi', picker_sort_order=3 WHERE name='space station';
UPDATE public.location_cards SET display_name='Mars Colony',           picker_category='scifi', picker_sort_order=4 WHERE name='mars colony';

-- ── Fantasy & Magical Realms ───────────────────────────────────────────
UPDATE public.location_cards SET display_name='Enchanted Forest',           picker_category='fantasy', picker_sort_order=1  WHERE name='enchanted forest';
UPDATE public.location_cards SET display_name='Floating Sky Islands',       picker_category='fantasy', picker_sort_order=2  WHERE name='floating sky islands';
UPDATE public.location_cards SET display_name='Wizard Academy',             picker_category='fantasy', picker_sort_order=3  WHERE name='wizard academy';
UPDATE public.location_cards SET display_name='Underwater City (Atlantis)', picker_category='fantasy', picker_sort_order=4  WHERE name='underwater city atlantis';
UPDATE public.location_cards SET display_name='Ancient Elven City',         picker_category='fantasy', picker_sort_order=5  WHERE name='ancient elven city';
UPDATE public.location_cards SET display_name='Dwarven Fortress',           picker_category='fantasy', picker_sort_order=6  WHERE name='dwarven fortress';
UPDATE public.location_cards SET display_name='Dragon''s Keep',             picker_category='fantasy', picker_sort_order=7  WHERE name='dragons keep';
UPDATE public.location_cards SET display_name='Crystal Caverns',            picker_category='fantasy', picker_sort_order=8  WHERE name='crystal caverns';
UPDATE public.location_cards SET display_name='Cloud Kingdom',              picker_category='fantasy', picker_sort_order=9  WHERE name='cloud kingdom';
UPDATE public.location_cards SET display_name='Fairy Tale Kingdom',         picker_category='fantasy', picker_sort_order=10 WHERE name='fairy tale kingdom';

-- ── Cozy / Aesthetic Worlds ────────────────────────────────────────────
UPDATE public.location_cards SET display_name='Paris Café',                 picker_category='cozy', picker_sort_order=1 WHERE name='paris cafe';
UPDATE public.location_cards SET display_name='Cherry Blossoms',            picker_category='cozy', picker_sort_order=2 WHERE name='cherry blossoms';
UPDATE public.location_cards SET display_name='Japanese Garden',            picker_category='cozy', picker_sort_order=3 WHERE name='japanese garden';
UPDATE public.location_cards SET display_name='Fairy Cottage',              picker_category='cozy', picker_sort_order=4 WHERE name='fairy cottage';
UPDATE public.location_cards SET display_name='Princess Garden Castle',     picker_category='cozy', picker_sort_order=5 WHERE name='princess garden castle';
UPDATE public.location_cards SET display_name='Rose Palace',                picker_category='cozy', picker_sort_order=6 WHERE name='rose palace';

-- ── Gothic / Cinematic Mood ────────────────────────────────────────────
UPDATE public.location_cards SET display_name='Victorian London',           picker_category='gothic', picker_sort_order=1 WHERE name='victorian london';
UPDATE public.location_cards SET display_name='Transylvania',               picker_category='gothic', picker_sort_order=2 WHERE name='transylvania';
UPDATE public.location_cards SET display_name='Haunted Cathedral',          picker_category='gothic', picker_sort_order=3 WHERE name='haunted cathedral';
UPDATE public.location_cards SET display_name='Noir Cityscape',             picker_category='gothic', picker_sort_order=4 WHERE name='noir cityscape';

CREATE INDEX IF NOT EXISTS idx_location_cards_picker
  ON public.location_cards (picker_category, picker_sort_order)
  WHERE is_approved = true;

NOTIFY pgrst, 'reload schema';

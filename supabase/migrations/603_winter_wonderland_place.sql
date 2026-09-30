-- 603: Winter Wonderland becomes a normal PLACE card in Nature & Wild (Kevin 2026-09-30: "move winter wonderland into
-- nature and wild as a normal card"). It was a scenario card (mig 594) holding only tagged scenes; now it has its own
-- recipe and spots, so it works for every dream kind, and its 364 tagged winter scenes stay tagged to it.
-- Kept real-world (Nature & Wild): the world's great snow and ice wonders, specific named places.
-- Recipe from generate-full-location-card.js under a descriptive name (merged here, the temp row deleted); spots
-- Sonnet-authored per sub-region and strictly graded, S and A only (76), eligibility per the playbook:
-- cast = non-wide, scene-only = non-intimate. biome_config + WARDROBE follow from gen-location-biome.js /
-- gen-location-wardrobe.js. admin_only until QA sign-off. Re-runnable.

UPDATE public.location_cards w SET
  content_kind = 'place', biome = 'arctic_polar', is_approved = true,
  tags = t.tags, visual_palette = t.visual_palette, atmosphere = t.atmosphere, architecture = t.architecture,
  light_signature = t.light_signature, texture_details = t.texture_details, cinematic_phrases = t.cinematic_phrases,
  fusion_settings = t.fusion_settings, prompt_version = t.prompt_version, model_version = t.model_version,
  sub_regions = ARRAY['Ice festivals and ice hotels (Harbin Ice and Snow World, Sapporo Snow Festival, Hotel de Glace, ICEHOTEL Jukkasjarvi)', 'Snow-buried villages (Shirakawa-go, Hallstatt, Zermatt, Reine, Cesky Krumlov, Ginzan Onsen)', 'Frozen lakes, ice caves and ice canyons (Lake Baikal, Abraham Lake, Vatnajokull ice caves, Maligne Canyon, Lake Louise)', 'Snow forests and rime ice (Zao snow monsters, Riisitunturi, Biei Blue Pond)', 'Winter landmarks under snow (Harbin Saint Sophia, Neuschwanstein, Lake Bled church)', 'Arctic winter wilderness (Abisko, Tromso, Svalbard, Yellowknife)']::text[],
  must_include = ARRAY['carved ice castles, ice sculptures and ice hotels', 'villages and rooftops buried in deep snow', 'frozen lakes with clear or bubbled ice, and blue glacier ice caves', 'snow-laden forests and rime-frosted trees', 'famous landmarks dressed in snow', 'crisp, bright, wondrous winter: never bleak or grim']::text[]
FROM public.location_cards t
WHERE w.name = 'winter wonderland' AND t.name ILIKE 'winter wonderland, the real world%';

DELETE FROM public.location_cards WHERE name ILIKE 'winter wonderland, the real world%' AND picker_category IS NULL;

INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible) VALUES
  ('winter wonderland', 'Harbin Ice and Snow World illuminated castle towers', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Harbin Ice and Snow World frozen river amphitheater', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Sapporo Snow Festival Odori Park giant snow sculptures', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Sapporo Snow Festival Susukino ice sculpture corridor', 'medium', 'A', true, true, true),
  ('winter wonderland', 'ICEHOTEL Jukkasjarvi art suite carved ice walls', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'ICEHOTEL Jukkasjarvi frozen Torne River exterior entrance', 'medium', 'A', true, true, true),
  ('winter wonderland', 'ICEHOTEL Jukkasjarvi ice chandelier ceremony hall ceiling', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Hotel de Glace Quebec arched ice tunnel passageway', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Arctic SnowHotel Rovaniemi snow-block exterior domed rooms', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Arctic SnowHotel Rovaniemi glass igloo settlement on snowfield', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Harbin Sun Island snow sculpture garden panorama', 'wide', 'A', true, true, false),
  ('winter wonderland', 'ICEHOTEL Jukkasjarvi ice bar sculpted counter and stools', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Shirakawa-go gassho farmhouses beneath deep snow layers', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Ogimachi hamlet rooftops weighted with winter snow', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Hallstatt village reflected in frozen Hallstätter See', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Zermatt car-free lanes between snow-capped stone chalets', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Matterhorn rising above snow-blanketed Zermatt rooftops', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Reine fishing cabins on snow-dusted Lofoten rock outcrops', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Rorbuer red cabins edged with ice above dark fjord water', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Český Krumlov castle tower above snow-covered medieval rooftops', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Ginzan Onsen wooden inn balconies draped in heavy snow', 'medium', 'S', true, true, true),
  ('winter wonderland', 'Ginzan Onsen stone bridge over steaming snow-banked river', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Snow-buried Reine shoreline reflected in still Vestfjorden water', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Ginzan Onsen narrow lantern-lined alley between snow-walled inns', 'intimate', 'S', true, false, true),
  ('winter wonderland', 'Hallstatt wooden dock pilings encased in lake-edge ice', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Lake Baikal''s cracked transparent black ice surface', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Abraham Lake methane ice bubbles trapped beneath clear ice', 'medium', 'S', true, true, true),
  ('winter wonderland', 'Vatnajökull glacier crystal blue ice cave interior', 'intimate', 'S', true, false, true),
  ('winter wonderland', 'Maligne Canyon frozen waterfall ice columns', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Frozen Lake Louise turquoise ice floes and Victoria Glacier', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Lake Baikal pressure ridges and ice hummock fields', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Vatnajökull ice cave ceiling rippled sapphire formations', 'intimate', 'S', true, false, true),
  ('winter wonderland', 'Abraham Lake shoreline ice pancakes and frost-rimmed pebbles', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Maligne Canyon ice bridge over frozen canyon narrows', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Lake Baikal glassy ice sheet above dark Siberian depths', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Vatnajökull ice cave walls glowing electric cobalt blue', 'intimate', 'S', true, false, true),
  ('winter wonderland', 'Abraham Lake vast bubble-patterned ice plain to Rockies', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Maligne Canyon towering ice-curtained sandstone slot walls', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Lake Baikal Olkhon Island ice grotto entrance', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Vatnajökull glacier moulin ice shaft descending into blue', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Frozen Lake Louise Fairview Mountain ice panorama', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Abraham Lake lone bubble cluster beneath sculpted clear ice', 'medium', 'S', true, true, true),
  ('winter wonderland', 'Zao Onsen snow monsters blanketing the volcanic ridge', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Zao snow monster juhyo frozen mid-roar', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Riisitunturi crowned spruce trees in deep snow', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Biei Shirogane Blue Pond ringed by frost-white birches', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Biei Blue Pond cobalt water amid snow-dusted trunks', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Harz Brocken summit forest buried under rime ice', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Zao caldera lake edged by snow monster silhouettes', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Biei Blue Pond dead tree stumps in snow and ice', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Riisitunturi fell plateau of snow-crowned trees stretching to horizon', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Zao snow monster cluster in the crater bowl', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Saint Sophia Cathedral Harbin beneath heavy snow domes', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Saint Basil''s Cathedral Red Square under winter snowfall', 'medium', 'S', true, true, true),
  ('winter wonderland', 'Neuschwanstein Castle rising above snow-blanketed Bavarian Alps', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Bled Island Church surrounded by frozen snow-edged lake', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Harbin Ice and Snow World crystal towers along the Songhua', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Mont Saint-Michel rising from snow-covered tidal flats', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Hallstatt lakeside village under deep alpine snow', 'medium', 'S', true, true, true),
  ('winter wonderland', 'Prague Old Town Square beneath thick snow-laden rooftops', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Hohenzollern Castle snowbound on its forested spur', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Cesky Krumlov Castle quarter wrapped in deep Bohemian snow', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Colosseum exterior walls dusted with rare Roman snow', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Himeji Castle white towers doubled in snow-covered grounds', 'medium', 'S', true, true, true),
  ('winter wonderland', 'Kinkaku-ji Golden Pavilion reflected in snow-rimmed Kyokochi Pond', 'medium', 'S', true, true, true),
  ('winter wonderland', 'Shirakawa-go gassho farmhouses under deep snow', 'wide', 'S', true, true, false),
  ('winter wonderland', 'Inside the Harbin Ice Festival illuminated snow-block corridor', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Frozen snow archway inside Vatnajokull glacier ice cave', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Abisko valley under snow-laden birch forest canopy', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Tromso Arctic Cathedral snow-covered triangular facade', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Svalbard Adventdalen valley glaciers meeting frozen fjord', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Abisko Nuolja mountain snowfield overlooking lake Torneträsk', 'wide', 'A', true, true, false),
  ('winter wonderland', 'Longyearbyen snow-packed stairway between coloured wooden houses', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Kirkenes snow hotel ice-block corridor glowing blue', 'intimate', 'A', true, false, true),
  ('winter wonderland', 'Abisko iced-over Lake Torneträsk shore with pressure ridges', 'medium', 'A', true, true, true),
  ('winter wonderland', 'Longyearbyen Svalbard Global Seed Vault entrance in snowfield', 'medium', 'S', true, true, true)
ON CONFLICT (location_key, spot_text) DO NOTHING;

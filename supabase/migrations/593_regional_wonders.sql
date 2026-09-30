-- 593: World Wonders splits into four regional wonders cards, one per World Traveler region tile (mig 592,
-- SCENARIO_LOCATION_SCOPE.md). World Wonders spans every continent, so after the split it left the picker; these
-- cards replace it inside Europe / Asia & Pacific / The Americas / Middle East & Africa.
--
-- Each card copies World Wonders' recipe fields, but its sub_regions, must_include and the TIME / WEATHER / PHENOMENA /
-- SUBJECT_RULE entries of biome_config are the REGION's own (World Wonders named Angkor, Giza, Petra and Machu Picchu
-- side by side, which would pull a Europe dream to Egypt). The site-naming BANS are dropped: a negated site name
-- still primes the model. CAMERA and WARDROBE are copied as they are.
--
-- Spots: World Wonders' 309 iconic spots were sorted by region (Sonnet, 2026-09-30) and COPIED to the regional card
-- (259; the 50 placeless panoramas stay with World Wonders only). World Wonders keeps all of its spots, so saved
-- picks of it render exactly as before.
--
-- picker_category 'wonders_regional' is one no released app version lists, so these cards stay out of today's
-- picker; admin_only until go-live. Re-runnable.

INSERT INTO public.location_cards (name, display_name, picker_category, picker_tile, picker_sort_order, biome, biome_config,
  fusion_settings, sub_regions, must_include, tags, visual_palette, atmosphere, architecture, light_signature,
  texture_details, cinematic_phrases, thumbnail_url, is_approved, prompt_version, model_version, admin_only)
SELECT 'ancient wonders of europe', 'Wonders of Europe', 'wonders_regional', 'europe', 99, src.biome, jsonb_build_object(
    'BANS', '["NO people, figures, characters, or human forms anywhere in frame","NO modern buildings, vehicles, infrastructure, or contemporary elements near ancient sites","NO intact roofs or restoration — ruins must show authentic weathered, partially-collapsed state","NO fantasy or science-fiction elements — no glowing runes, alien structures, impossible floating stones","NO impossible physics — stones must obey gravity, proportions must match actual ancient engineering"]'::jsonb,
    'CAMERA', src.biome_config->'CAMERA',
    'WARDROBE', src.biome_config->'WARDROBE',
    'TIME', '["Roman Forum sunset — honey-gold light raking across travertine columns, long shadows from Temple of Saturn stretching toward Palatine Hill ruins","Stonehenge midsummer dawn — first sun rising over the Heel Stone, sarsen trilithons black against a pale gold sky, dew silvering the plain","Delphi morning — clear mountain light on the Temple of Apollo terrace, Parnassus cliffs glowing behind, olive valley still in shadow below","Pompeii late afternoon — warm low light along a preserved paved street, Vesuvius hazy blue beyond the ruined walls"]'::jsonb,
    'WEATHER', '["Mediterranean meltemi — strong dry wind sweeping Acropolis plateau, Pentelic marble Parthenon columns bright against deep cobalt sky, cypress trees bending","Roman winter overcast — low gray stratus ceiling over Colosseum arches, travertine darkened with damp, Tiber valley mist creeping through Forum","Atlantic squall over Orkney — slate clouds racing above the Ring of Brodgar, stones dark with rain, a bright break of sun on the moor"]'::jsonb,
    'PHENOMENA', '["Roman Forum moon-rise — full moon ascending directly above Temple of Saturn columns, travertine ruins glowing silver, Capitoline Hill silhouette black","Acropolis alpenglow — Hymettus mountain sunset reflecting rose-pink onto Parthenon marble, Pentelic stone warm against cooling blue sky, Aegean visible distant","Pantheon oculus beam — a single shaft of noon sun falling through the dome''s open eye, a bright disc crossing the coffered ceiling","Stonehenge solstice sunrise — the sun cresting exactly along the avenue axis, light threading through the trilithon gaps"]'::jsonb,
    'SUBJECT_RULE', to_jsonb('Unmistakably recognizable ancient European monument or archaeological site — temples, amphitheaters, stone circles, forums, or hilltop citadels rendered MASSIVE and MONUMENTAL, dominating the frame. Iconic stone architecture (Parthenon columns, Colosseum arches, Stonehenge trilithons, the Pantheon dome, Delphi''s temple terrace) must be subject-hero. Surrounding landscape (Mediterranean coast, olive hills, windswept moor) supports but never overwhelms the ancient wonder.'::text)),
  src.fusion_settings,
  ARRAY['Colosseum & Roman Forum, Italy (Arch of Constantine, Palatine Hill, Pantheon)',
    'Pompeii & Herculaneum beneath Vesuvius, Italy',
    'Acropolis & Athens, Greece (Parthenon, Erechtheion, Temple of Poseidon at Sounion)',
    'Delphi, Olympia & Epidaurus, Greece',
    'Sicily''s Greek temples (Agrigento, Segesta, Syracuse)',
    'Stonehenge & Avebury, England',
    'Orkney & Ireland''s megaliths (Ring of Brodgar, Skara Brae, Newgrange)',
    'Knossos, Mycenae & Meteora, Greece']::text[],
  ARRAY['ancient citadels and hilltop sanctuaries (Acropolis, Mycenae Lion Gate, Delphi)',
    'Greek and Roman temples (Parthenon, Temple of Poseidon at Sounion, Paestum, Segesta, Pantheon)',
    'amphitheaters, theatres and stadiums (Colosseum, Epidaurus Theatre, Syracuse theatre, Olympia stadium)',
    'monumental arches and forums (Arch of Constantine, Roman Forum, Palatine Hill)',
    'stone circles and megaliths (Stonehenge, Avebury, Ring of Brodgar, Callanish, Carnac alignments)',
    'preserved Roman streets (Pompeii, Herculaneum)',
    'cliff-top monasteries and fortresses (Meteora, Mystras, Castel Sant''Angelo)']::text[],
  src.tags, src.visual_palette, src.atmosphere, src.architecture, src.light_signature, src.texture_details,
  src.cinematic_phrases, src.thumbnail_url, true, src.prompt_version, src.model_version, true
FROM public.location_cards src WHERE src.name = 'ancient wonders'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible)
SELECT 'ancient wonders of europe', s.spot_text, s.spot_kind, s.quality_tier, s.is_active, s.pure_scene_eligible, s.character_eligible
FROM public.location_iconic_spots s
WHERE s.location_key = 'ancient wonders' AND s.id IN (
  '03664d7b-5e37-49c0-8374-bd3ead12a169', '0b6f7bce-5fa2-4cd6-9bac-358a835e83c6', '12588152-4fb2-4b1e-b42c-a7bdd989a584', '1449e23a-ee28-4af1-9463-ccc980f20427', '1fde20fe-1354-43f9-b94f-b8946f64112e', '25482395-7f64-4224-a025-eae190646db0', '259d9d1d-cd08-463e-bbb6-63d2ee316a7d', '264268bb-ce09-4695-8305-cf28ce6d6771', '28f403e6-d527-41be-9ff3-65c425e766b3', '2c58f61b-6faf-4da5-b775-87467d1ac285', '2fca60db-a03a-4b32-a097-9d54e435e449', '31f11c30-a90c-4376-bf04-d38fbda33bb9', '350e53de-fa4b-4d80-a5b6-5512da35121c', '3973c865-5515-41f2-829d-92641bbd1be5', '3b6609b2-2772-4314-b628-5c827721df92', '3bc534c9-3fdd-4701-be32-2d5cdc0bba33', '3da0c94d-3ce4-43f9-a39d-447c2cc93d6f', '3dcdc411-65f6-4ab4-a5cd-d1b398daf66e', '416aeecd-4881-4c62-9a68-0a863bfcec6d', '4597b2aa-74a0-49a3-8a55-6a1ecaa1a5cb', '490479c9-2f5a-4cd2-82f2-d0a7e903f082', '4a2cd9c2-0e6e-4fdf-8dcf-38d809d6f9df', '4aee3fd3-44b9-4743-8fc8-2d4f443e83d7', '4bf1c372-c3a7-4243-ade6-413e52f6e21f', '50698780-847c-41dd-a820-581ae859b5de', '50a2543b-3a34-4eb3-b29f-2231d65822fe', '599d5c77-6cc4-442c-94e4-6c86d1ace9db', '5b24676f-5702-4dd2-b66b-408c6927d1cc', '6181eeb4-323f-4301-a679-739efff2e25d', '6a85b575-1f53-4ad9-80c9-ce3520e1eb0b', '6ccdbab8-d671-4007-ac4c-8014716b9b2a', '706465bd-20da-4d69-b2bb-21bab17d3915', '74402f0c-1d53-498f-98b3-8ac955fcef00', '74f35ab1-4f96-4130-896a-90b5d6f05eaa', '80fd2553-ad04-452f-834c-8e50bda87c2c', '908c9468-8e28-4c74-a6d4-173407fc8b8f', '91010d17-565f-4d5e-8755-dffcc6910fd1', '94caa2e2-8822-4912-a8e3-5d49f69aad45', '99f3acc2-eb5c-4a8e-8298-3be8d8e7e7fc', '9c2dfde6-7e07-455a-8831-340efaf6147e', 'a5088d93-c931-48af-ad9f-754d99d8681f', 'aedfd93a-d145-4fe3-9e17-0bbb5cd00cd2', 'b053fa70-391b-4a15-ae47-651a0252f464', 'b369ecca-cce4-4908-a405-6e3eae0efc0c', 'b8cd12a9-8d17-46f1-bf02-991728cc244c', 'bba5843e-da11-4e20-b2c3-5a6099b865fd', 'bba78ddf-5aa7-4bb6-89e6-cd678cc1328f', 'bdd54ad3-15d4-4abd-b4aa-846b530ef58c', 'be04bc6c-0c82-469b-a759-ade618fb3ed5', 'bebd9d6b-c262-4ea4-bb6e-539769c47266', 'c0700b3c-0aa0-4319-b331-2350d341de0e', 'c441aaed-fc18-4eeb-a7e0-57d06a4c075f', 'c4fd52c1-2ace-4c22-8433-3b1fddd8a8c3', 'c66f5367-88b2-4b86-9fe2-aa925f622710', 'c8f7c377-c84e-49bb-b567-4acd5e563919', 'c9d8c456-f802-439a-a7df-1158f4a3a0e6', 'cd374424-ee33-4839-8bfd-801c37da5ccb', 'cec11788-9f44-45a8-a183-94ddd1942e5e', 'd42c0a02-e8ab-4d68-84c9-aabf333006ca', 'd44e4758-2ace-4012-a7d7-078955a72e9e', 'd80aed2d-0a20-4e02-86d2-79eb38289387', 'd9fc99aa-e9ba-45e3-a2db-f2b18fbb395a', 'dbe24a2f-1bb9-4237-9226-d8f12c35c075', 'e046e41e-7844-4091-9fcc-818c3f865921', 'e06df8eb-9a25-427c-a87e-bb9173df9179', 'e274cddf-2841-45c7-9ae5-0f5643e2d9e4', 'eeb087d8-73b9-4651-aa2d-88a0d26d1223', 'efbebad2-c808-4a37-aa91-db36352762ac', 'f2078a93-4bf2-47b3-9279-be884aec36af', 'f276848d-6c83-45d8-b691-f8439dbd1d65'
)
AND NOT EXISTS (SELECT 1 FROM public.location_iconic_spots d WHERE d.location_key = 'ancient wonders of europe' AND d.spot_text = s.spot_text);

INSERT INTO public.location_cards (name, display_name, picker_category, picker_tile, picker_sort_order, biome, biome_config,
  fusion_settings, sub_regions, must_include, tags, visual_palette, atmosphere, architecture, light_signature,
  texture_details, cinematic_phrases, thumbnail_url, is_approved, prompt_version, model_version, admin_only)
SELECT 'ancient wonders of asia', 'Wonders of Asia & Pacific', 'wonders_regional', 'asia_pacific', 99, src.biome, jsonb_build_object(
    'BANS', '["NO people, figures, characters, or human forms anywhere in frame","NO modern buildings, vehicles, infrastructure, or contemporary elements near ancient sites","NO intact roofs or restoration — ruins must show authentic weathered, partially-collapsed state","NO fantasy or science-fiction elements — no glowing runes, alien structures, impossible floating stones","NO impossible physics — stones must obey gravity, proportions must match actual ancient engineering"]'::jsonb,
    'CAMERA', src.biome_config->'CAMERA',
    'WARDROBE', src.biome_config->'WARDROBE',
    'TIME', '["Pre-dawn Angkor Wat — dark Khmer sandstone silhouettes against violet sky, lotus pond reflections perfectly still, first monks'' bells echoing distant","Great Wall moonlit night — weathered brick crenellations silver under full moon, mountain ridges rolling black beneath, distant watchtower lantern glow","Taj Mahal sunrise — white marble turning blush pink, the long reflecting pool perfectly still, Yamuna mist beyond","Bagan dawn — thousands of brick stupas rising from ground mist across the plain, first light catching the spires"]'::jsonb,
    'WEATHER', '["Monsoon approach at Angkor — purple-black storm clouds massing over jungle canopy, Angkor Wat moat surface rippling, humidity thickening air","Chinese mountain mist — cloud sea pouring through the Great Wall''s ridgeline watchtowers, bricks damp and dark","Pacific trade winds on Rapa Nui — grass rippling around the moai, surf booming on black lava, clouds racing past"]'::jsonb,
    'PHENOMENA', '["Angkor Wat dawn alignment — sunrise emerging directly through central tower''s pinnacle, lotus pond mirroring entire temple complex in perfect stillness","Great Wall sunrise — first light igniting watchtower bricks along mountain ridgeline, wall snaking gold across dark peaks, mist valleys still shadowed below","Borobudur volcanic dawn — Merapi and Merbabu cones glowing pink behind stupa tiers, Java mist layering temple terraces, stupas emerging from cloud","Ahu Tongariki sunrise — the sun rising directly behind the fifteen moai, their silhouettes rimmed in gold"]'::jsonb,
    'SUBJECT_RULE', to_jsonb('Unmistakably recognizable ancient Asian or Pacific monument or archaeological site — temple mountains, walls, stupas, palaces, or carved statues rendered MASSIVE and MONUMENTAL, dominating the frame. Iconic architecture (Angkor towers, the Great Wall, Borobudur stupas, the Taj Mahal, the moai of Rapa Nui) must be subject-hero. Surrounding landscape (jungle, mountain ridges, river plains, Pacific coast) supports but never overwhelms the ancient wonder.'::text)),
  src.fusion_settings,
  ARRAY['Angkor, Cambodia (Angkor Wat, Bayon, Ta Prohm, Banteay Srei)',
    'Great Wall & imperial China (Jiayuguan, Forbidden City, Temple of Heaven, Terracotta Army)',
    'Borobudur & Prambanan, Indonesia',
    'Bagan & Shwedagon, Myanmar',
    'Taj Mahal, Hampi & Ellora, India',
    'Sigiriya, Sri Lanka',
    'Ayutthaya & Sukhothai, Thailand',
    'Rapa Nui (Easter Island) moai']::text[],
  ARRAY['temple mountains and sanctuaries (Angkor Wat, Bayon, Borobudur, Prambanan)',
    'the Great Wall and its watchtowers snaking along mountain ridges',
    'imperial palaces and altars (Forbidden City, Temple of Heaven, Potala Palace)',
    'stupa plains and pagodas (Bagan, Shwedagon)',
    'rock-cut temples and cave shrines (Ellora, Mogao Caves, Yungang Grottoes)',
    'marble mausoleums and reflecting pools (Taj Mahal)',
    'the moai of Rapa Nui on their coastal platforms']::text[],
  src.tags, src.visual_palette, src.atmosphere, src.architecture, src.light_signature, src.texture_details,
  src.cinematic_phrases, src.thumbnail_url, true, src.prompt_version, src.model_version, true
FROM public.location_cards src WHERE src.name = 'ancient wonders'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible)
SELECT 'ancient wonders of asia', s.spot_text, s.spot_kind, s.quality_tier, s.is_active, s.pure_scene_eligible, s.character_eligible
FROM public.location_iconic_spots s
WHERE s.location_key = 'ancient wonders' AND s.id IN (
  '099cf170-3d09-422e-9ee2-cb62eb980f08', '0f0bdceb-e6e2-4ced-b6cd-fcd1fc1847ce', '1109cc7a-653f-4bc0-aafb-09850753ceed', '1961a3b1-e323-4e31-8b88-5e7b3f346540', '1b2dff44-a823-4eec-a071-08539d679503', '1b2e1300-5893-4d64-a16c-a520cc1f47c7', '1f4faaf0-704b-42f9-a75b-9258ff83ef7d', '1fbd56d1-8e59-4a9a-b371-72e8cd75c95a', '26408d7f-5671-40f2-b837-96dae64d109b', '28658c0c-7eca-469b-914e-c21146d5ea04', '2ad87a23-4301-439e-a8e5-f6f700686562', '2b3cd70a-83ba-43f2-af0f-45ca9fa5ac27', '2baa4c70-c586-4ac6-a23a-ced7ebd55ac5', '32e01cb4-a5a3-4183-ab20-d797fb25b0a4', '34f8dea5-1783-4c8c-a75e-4a94cf4f0b88', '38595dcb-2ff5-4ffb-83f4-0de39d418215', '395f4341-4206-44e7-996a-395c6a1a95d2', '3e01fac1-fa8f-4633-8753-c8a09569cc55', '49dc32d3-9275-44ac-87ad-0d36957067b7', '4ec056c0-024d-4eb6-9ba5-e7113d2bd4b6', '4ef69911-9593-403c-8ef9-f3e7414e158d', '523e946a-499d-46c0-aff5-a69b268d5bad', '52568983-3ac4-46b1-a9aa-8c1c7af6955e', '5b235162-4e7f-4c2e-bc5f-0826e9632bad', '72b70747-26d1-48bc-9f65-bdd59d478722', '732be92c-fbca-4785-973f-ce8a9847aa2d', '7d48093c-2f13-4c98-bfa7-23f02158e505', '832874d4-206a-487a-b8f0-7202378ba4da', '84fcac87-8723-46e7-8fe2-305c77252599', '89c547d1-950d-421c-8ba5-639c3b48cefc', '8a1d12c4-25fb-418f-8042-701f20479e7f', '8f8d5c30-1b97-484f-91af-0cf9dc100c48', '8fec1be7-4ae5-4b9d-8fb4-73ee6490287c', '924af1b5-efb5-45c8-a785-3070a10cc3d9', '937841a6-d61d-405a-823b-166d097b354c', 'a277a0b3-a44f-487e-94db-b42ef5024821', 'a2fc3e80-9bae-4fc1-9132-03e9fe138a46', 'a46f0520-d0da-44a6-8211-c5daf0d5116c', 'a6d66458-8cca-41a3-80d6-24c3ca06db32', 'a913e578-7c96-402c-b405-144b82db5197', 'aa389d7a-0e6c-4e66-a85d-96c9feb858fe', 'aa51b2d2-adaf-43c7-9099-4c9cd293e540', 'ab28038e-b96f-4a59-a2f4-d90057b408e6', 'aebf1aca-57eb-4ce9-8387-909179129657', 'afe55544-90cf-473a-930a-906dea46538f', 'b3c51c72-1473-46c4-85d5-98ab704679f9', 'b48b04f9-aa3a-4dcb-a2f9-a29874c23156', 'b4c737cc-64f8-4b6d-a05a-42dc77ff8f9f', 'b5c3c0ef-35ac-4d94-b7bb-2292aa3c2154', 'bebd3569-27f7-4902-bf09-7a858f1b0ede', 'bef47575-7d56-4840-9a3a-833dd1f6b5da', 'c46f950c-3c9c-49a1-881f-16fdcbb8b002', 'c4e80568-dc47-4d05-858f-5c9a61319d0d', 'c591479e-1bff-4446-8b41-5d07d92a06bf', 'ce354c43-368c-4d2a-9142-39d8643946fa', 'd2d3728a-9610-4e9d-a0b4-0d589aa7b3c9', 'e00bd495-06de-4298-a4cd-8b06c1fd5caf', 'e5ee28db-7e2c-499d-88b4-e1695958fddf', 'f6e5dc14-d921-4078-b4e6-9cf5abe80057', 'fc810f8e-2655-4e72-a834-077a7949b7d6', 'fdd44057-e434-4452-99d0-e3040cc57eaa', 'ffeca1c2-2d14-4464-a33c-9d82b54e0c74'
)
AND NOT EXISTS (SELECT 1 FROM public.location_iconic_spots d WHERE d.location_key = 'ancient wonders of asia' AND d.spot_text = s.spot_text);

INSERT INTO public.location_cards (name, display_name, picker_category, picker_tile, picker_sort_order, biome, biome_config,
  fusion_settings, sub_regions, must_include, tags, visual_palette, atmosphere, architecture, light_signature,
  texture_details, cinematic_phrases, thumbnail_url, is_approved, prompt_version, model_version, admin_only)
SELECT 'ancient wonders of the americas', 'Wonders of the Americas', 'wonders_regional', 'americas', 99, src.biome, jsonb_build_object(
    'BANS', '["NO people, figures, characters, or human forms anywhere in frame","NO modern buildings, vehicles, infrastructure, or contemporary elements near ancient sites","NO intact roofs or restoration — ruins must show authentic weathered, partially-collapsed state","NO fantasy or science-fiction elements — no glowing runes, alien structures, impossible floating stones","NO impossible physics — stones must obey gravity, proportions must match actual ancient engineering"]'::jsonb,
    'CAMERA', src.biome_config->'CAMERA',
    'WARDROBE', src.biome_config->'WARDROBE',
    'TIME', '["Machu Picchu blue hour — Urubamba canyon mist glowing indigo, Huayna Picchu peak silhouette dark against fading sky, stone terraces softening","Chichen Itza midday — El Castillo limestone blazing white under Yucatan sun, carved serpent shadows stark on pyramid steps, no cloud cover","Teotihuacan sunrise — the Pyramid of the Sun glowing orange at the end of the Avenue of the Dead, the valley still cool and grey","Tulum golden hour — Mayan clifftop ruins warm against the turquoise Caribbean, palms throwing long shadows"]'::jsonb,
    'WEATHER', '["Andean mountain fog — dense cloud bank rolling up through Machu Picchu terraces, granite walls appearing and vanishing, moss-wet stone darkened","Yucatan tropical humidity — thick air softening Chichen Itza outlines, distant rain curtains visible over jungle, clouds building afternoon towers","Desert Southwest monsoon — thunderheads building over Mesa Verde''s canyon, sandstone glowing orange under a dark sky"]'::jsonb,
    'PHENOMENA', '["Kukulkan equinox serpent shadow — afternoon sun casting triangular shadow-pattern down El Castillo steps, feathered-serpent illusion forming on pyramid flank","Machu Picchu cloud inversion — site floating above solid white cloud layer filling Urubamba gorge, peaks emerging like islands, ruins marooned in sky","Tikal canopy fog — jungle mist caught in temple pyramid peaks rising above rainforest, howler monkey dawn calls echoing, temple roofs islands above green","Nazca lines at low sun — raking light etching the giant desert geoglyphs in sharp relief across the pampa"]'::jsonb,
    'SUBJECT_RULE', to_jsonb('Unmistakably recognizable ancient American monument or archaeological site — stepped pyramids, mountaintop citadels, terraces, or cliff dwellings rendered MASSIVE and MONUMENTAL, dominating the frame. Iconic architecture (Machu Picchu terraces, El Castillo at Chichen Itza, Tikal pyramids, the Pyramid of the Sun, Mesa Verde cliff dwellings) must be subject-hero. Surrounding landscape (Andes, jungle, desert canyon, Caribbean coast) supports but never overwhelms the ancient wonder.'::text)),
  src.fusion_settings,
  ARRAY['Machu Picchu & the Sacred Valley, Peru (Huayna Picchu, Ollantaytambo, Sacsayhuamán, Moray)',
    'Chichen Itza & the Yucatán, Mexico (El Castillo, Sacred Cenote, Tulum, Uxmal, Coba)',
    'Teotihuacan & Monte Albán, Mexico',
    'Tikal & Palenque (Guatemala, Chiapas)',
    'Copán, Honduras',
    'Nazca Lines & Lake Titicaca, Peru',
    'Mesa Verde & Chaco Canyon, US Southwest']::text[],
  ARRAY['stepped pyramids and temple mountains (El Castillo, Pyramid of the Sun, Tikal Temple IV, Uxmal)',
    'mountaintop citadels and terraces (Machu Picchu, Ollantaytambo, Pisac, Choquequirao, Moray)',
    'sacred cenotes and water features (Sacred Cenote at Chichen Itza)',
    'ball courts and hieroglyphic stairways (Chichen Itza Great Ball Court, Copán)',
    'cliff dwellings in sandstone alcoves (Mesa Verde Cliff Palace, Balcony House)',
    'desert geoglyphs seen from above (Nazca Lines)',
    'massive fitted-stone walls (Sacsayhuamán)']::text[],
  src.tags, src.visual_palette, src.atmosphere, src.architecture, src.light_signature, src.texture_details,
  src.cinematic_phrases, src.thumbnail_url, true, src.prompt_version, src.model_version, true
FROM public.location_cards src WHERE src.name = 'ancient wonders'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible)
SELECT 'ancient wonders of the americas', s.spot_text, s.spot_kind, s.quality_tier, s.is_active, s.pure_scene_eligible, s.character_eligible
FROM public.location_iconic_spots s
WHERE s.location_key = 'ancient wonders' AND s.id IN (
  '03bb06c6-66a2-431d-aa7c-2128a5486a5b', '05e8a406-3f68-47cf-b197-f9e4f6f16096', '07bf1ca7-0222-44b2-81d0-2ad6cb4d3757', '168ac972-6c38-43c0-ab5a-21662ff8e6f3', '1cb768c3-b8fa-4451-ab67-49e54e12263a', '21dc894d-66c9-4c17-b0bf-8267d77a78de', '282f0417-48fe-40df-884c-2c5a762b001c', '2a705a7e-dcb0-40ef-93af-5c70e1a0d815', '2b9487f4-65ac-4df9-8576-094717931695', '328e6867-dbce-4e9d-9346-4e7604ab38e8', '3544ec6b-80da-419a-8bee-10f5af26b23f', '3779e030-c110-4da3-8762-8404eb9c0954', '3a3f5954-3241-4ae2-8eb1-42b29578f25b', '54e6733d-a688-4d46-a923-e361248a3213', '5cee1fd7-13ee-42b3-a60f-355573a3d222', '60566245-305f-478f-b911-3e56415a15e9', '616f6f29-0790-4c43-9b34-3afebb4f986e', '61d1358c-1c50-4064-afee-1c98c108325f', '636a77f1-5901-400e-9928-d7b5ee4770cf', '66166cf4-ef82-4351-a3d2-f8a5a28b3b3f', '6709c23f-676e-4732-91d1-0182f08f283f', '69813cbc-2f56-435c-82ad-853179ca5f37', '6a5de7b6-df46-45dd-969e-fbd328aaf49a', '74669fe5-4eed-469d-8b36-c86fe7b7977a', '77df04a4-6e36-4ebe-ba29-ab2d8b2181c4', '83ca6006-e899-468f-9390-76ab0402fa77', '841a2cbd-8239-4a5d-b787-153d4fbb4e60', '8db49362-995d-4d97-bfb6-7c997143cf5c', '8fdd6178-f35c-4290-a4dd-2d46574cc0c0', '93a9929f-2331-4f8b-a054-d4376a1dd76a', '96908506-17eb-4c90-adc0-52b3099491e8', 'a847c7a5-bc11-49a1-992b-31380164807e', 'ab3c2b46-7118-4ae0-9513-e357632c9f26', 'af93ef92-d141-4896-85dc-6fcc9b41e0b3', 'b52f4b5f-2005-4019-9d17-c90a9784a38e', 'b5e30b38-52a4-4190-9a98-d3e740a51563', 'b76e6efc-3593-4538-919d-c6ad8dc0e86e', 'ba0b1726-850c-4e4d-ba23-ad5d3b21f903', 'bc99ff90-3d16-4c9e-8d23-09fad90bd3e7', 'c1d06963-649b-4717-8f6e-ce7ce6da7671', 'c491c3b8-ee6e-498b-836e-022769a2b7de', 'c7f939bc-1df3-41c5-863d-23ec7b36c8e6', 'ca1fc3c5-11c5-4211-9734-5d1948abc392', 'd28aa394-99a4-4193-a3e4-9f00f5cb16f1', 'd5e25708-ecbc-4738-9597-ac98b84199b0', 'd6000d4c-f786-49b1-bd8a-9d4a314c71a0', 'd69d5b20-029a-4063-b417-928f7870efef', 'd9c8283c-ac79-49a1-88a5-32815a35cbd9', 'dc9c4346-1252-47a4-8537-9c19102e0886', 'e312a39d-0a6a-4f16-951c-fafa52ed1c3f', 'e4eed1b9-7b46-49d8-93d2-536d1b2ccd60', 'f39287b3-79ab-4763-a8eb-184b4532d906', 'f4558a47-c707-4db1-9e41-1ef514ef1c61', 'f7276f08-db59-4e60-8fb4-16f8e8ae6379', 'f7e23c1a-246a-42ce-96e8-122851e42653'
)
AND NOT EXISTS (SELECT 1 FROM public.location_iconic_spots d WHERE d.location_key = 'ancient wonders of the americas' AND d.spot_text = s.spot_text);

INSERT INTO public.location_cards (name, display_name, picker_category, picker_tile, picker_sort_order, biome, biome_config,
  fusion_settings, sub_regions, must_include, tags, visual_palette, atmosphere, architecture, light_signature,
  texture_details, cinematic_phrases, thumbnail_url, is_approved, prompt_version, model_version, admin_only)
SELECT 'ancient wonders of the middle east and africa', 'Wonders of the Middle East & Africa', 'wonders_regional', 'middle_east_africa', 99, src.biome, jsonb_build_object(
    'BANS', '["NO people, figures, characters, or human forms anywhere in frame","NO modern buildings, vehicles, infrastructure, or contemporary elements near ancient sites","NO intact roofs or restoration — ruins must show authentic weathered, partially-collapsed state","NO fantasy or science-fiction elements — no glowing runes, alien structures, impossible floating stones","NO impossible physics — stones must obey gravity, proportions must match actual ancient engineering"]'::jsonb,
    'CAMERA', src.biome_config->'CAMERA',
    'WARDROBE', src.biome_config->'WARDROBE',
    'TIME', '["Giza mid-morning — harsh white sunlight hammering limestone pyramid faces, sharp triangular shadows cast across pale sand, heat shimmer rising","Petra golden hour — rose-red sandstone Treasury facade igniting in amber-orange, Siq canyon walls glowing warm salmon, long shadows carving detail","Luxor post-storm clarity — Karnak hypostyle columns sharp against rain-cleared sky, sandstone still damp and darkened, Nile-plain air crystalline","Persepolis sunset — the Gate of All Nations and Apadana columns glowing amber against a violet sky"]'::jsonb,
    'WEATHER', '["Saharan khamsin wind — ochre dust haze obscuring pyramid peaks, sand streaming off limestone edges, sky bleached pale bronze","Jordanian desert heat — clear sky with brutal sun, Petra sandstone radiating stored warmth, air shimmering over Siq canyon floor","Anatolian winter clarity — snow on the far ranges above Ephesus, marble streets washed clean, sky hard blue"]'::jsonb,
    'PHENOMENA', '["Giza Sphinx alignment — winter solstice sunset positioning between Khafre and Khufu pyramids as seen from Sphinx paws, three monuments perfectly spaced","Petra Treasury reveal — emerging from narrow Siq darkness into sudden flooded sunlight illuminating rose-red facade, scale shock and color intensity","Karnak hypostyle forest — shafts of sun penetrating between massive papyrus columns, dust motes illuminated in geometric light-beams, hieroglyphs half-lit","Valley of Kings heat mirage — limestone cliffs shimmering above tomb entrances, air distortion creating wave-effect over Theban hills, rock colors vibrating"]'::jsonb,
    'SUBJECT_RULE', to_jsonb('Unmistakably recognizable ancient monument or archaeological site of the Middle East or Africa — pyramids, rock-cut facades, colonnaded temples, or carved colossi rendered MASSIVE and MONUMENTAL, dominating the frame. Iconic architecture (the Great Pyramid, the Petra Treasury, Karnak columns, Abu Simbel, Persepolis, the Library of Celsus) must be subject-hero. Surrounding landscape (desert, the Nile, rose-red canyon, Anatolian hills) supports but never overwhelms the ancient wonder.'::text)),
  src.fusion_settings,
  ARRAY['Giza Plateau, Egypt (Great Pyramid, Sphinx, Khafre''s Pyramid)',
    'Luxor & the Valley of the Kings, Egypt (Karnak, Hatshepsut Temple, Colossi of Memnon)',
    'Abu Simbel, Philae & the Upper Nile, Egypt',
    'Petra & Wadi Rum, Jordan',
    'Ephesus, Göbekli Tepe & Cappadocia, Turkey',
    'Persepolis & Pasargadae, Iran',
    'Baalbek, Palmyra & Jerash (the Levant)',
    'Lalibela, Great Zimbabwe & Leptis Magna (Africa)']::text[],
  ARRAY['pyramids and monumental tombs (Great Pyramid, Step Pyramid of Djoser, Bent Pyramid)',
    'carved rock temples and facades (Petra Treasury, Petra Monastery, Abu Simbel, Lalibela churches)',
    'colonnaded temple halls (Karnak hypostyle hall, Luxor Temple, Philae, Baalbek)',
    'carved stone colossi (Sphinx, Abu Simbel statues, Colossi of Memnon, Mount Nemrut heads)',
    'Roman and Persian ruins (Library of Celsus at Ephesus, Jerash, Persepolis, Palmyra)',
    'desert canyons and approaches (the Siq at Petra, Wadi Rum)',
    'Anatolian wonders (Göbekli Tepe pillars, Cappadocia fairy chimneys)']::text[],
  src.tags, src.visual_palette, src.atmosphere, src.architecture, src.light_signature, src.texture_details,
  src.cinematic_phrases, src.thumbnail_url, true, src.prompt_version, src.model_version, true
FROM public.location_cards src WHERE src.name = 'ancient wonders'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible)
SELECT 'ancient wonders of the middle east and africa', s.spot_text, s.spot_kind, s.quality_tier, s.is_active, s.pure_scene_eligible, s.character_eligible
FROM public.location_iconic_spots s
WHERE s.location_key = 'ancient wonders' AND s.id IN (
  '001b20ce-4557-44ff-8a19-fecdabb1b166', '03ae441e-5b16-4590-a879-fde659ab54a2', '08ab3406-2b15-45d9-b2f8-b2c7732895f2', '0d95a969-6293-4e3b-a594-502e82be710a', '109a3488-5182-404c-bfbd-f083551159ab', '14caf6ea-a5c0-46f9-945f-0a4ee7f55019', '16eb9a16-e236-4f8d-9a2a-086070d84098', '172044e5-29df-4208-b61f-5a54a99ce1db', '1c8837dc-622b-482f-b6ae-be71270f3500', '1fb812ed-a151-4caa-aa50-ae744ad28c2f', '238a6023-3f19-48e2-bf9c-73ff57bf159a', '246dd9b2-80e5-46e1-a7fa-6ebe48d7e117', '24ace53c-4467-45b9-999b-817a3903734d', '24d9e38f-b33c-4e6b-8bb1-1edf66afa760', '26021bca-102c-4a72-89b5-f7f6e2e8f11a', '262eb72f-fabc-4dbc-ba50-87013bac2530', '2d4eb395-aa88-4317-8c5a-b08592904c47', '2d692e6e-086d-4d8b-9381-439ad0800dea', '333e1f7d-60a9-450e-bdea-0c733ef4de8a', '4067b823-dbab-4732-996f-06d5ca47756a', '45f607d8-8aca-4d92-8e3a-499e036933aa', '48c457c8-0253-453d-bc94-43ab403ec05e', '4de4e03d-baa1-42c3-860c-5865fc51c67a', '52a05c05-2673-4869-ba6c-d7471ad980db', '5e461a7e-4236-4f41-9e4a-441ef6d06ec9', '61248cd6-4568-4dbc-9ed5-db7d9851665c', '61f2b596-2c72-4ba3-a5b4-4ee61941d73e', '6accbab1-0d7a-4c0b-8879-e9c9c7cd3e6b', '6be577a7-9223-4192-8bb2-a763016a96fa', '6c96a47f-c376-4f7a-8e9b-28078f27d078', '6d2a5aa6-20b4-4b64-82d2-9ab7a17af858', '6ddbf7e8-e475-4691-a105-b28f0fea9c9f', '71554be9-6af0-4d0e-93f7-1060cab1243b', '751fd4ed-89d1-484a-965c-8c5f68df3f2b', '79241eb0-4425-4c61-abb5-ad839ffc39ff', '7caeb0e9-fb92-4384-9308-18cafa98f195', '7df6fb3a-e560-43de-8ba7-64d3eee440d1', '8106c2d0-4b0c-4dee-b409-62b6cde6bfe4', '8616f785-936b-4b11-8234-66b85ba89eb1', '86c3b9ac-ab79-42f3-b8e0-fd45c30196a8', '8882d659-c5f7-406d-a4b1-5d30f2857e0c', '8b76ac65-9bfc-44ac-9c9e-dd5333f814ed', '8d1fe1b6-90f6-4a5c-bbdd-7a2f51513ed9', '8d4e4d64-835f-42ca-a6ed-1b97eccda31a', '904e5530-bf1f-4063-ab1b-92901a50d1f7', '95858c45-e3cb-4a5f-b6cc-46016bae3c36', '9a3a6b78-ae3d-4082-afcd-20df55c22a57', '9d824278-e729-4780-aa4d-bd9e2df5490d', 'a1628e1f-d419-4473-b316-9c87788100cd', 'a91a7a1d-4537-4255-aaf4-d24eec1ec707', 'b01ce9c6-a10f-4d19-b977-ef6fcd0c62c1', 'b2acfde0-9a24-408d-b61f-8ca7b868ea0e', 'b5a6219c-d2ba-41c2-aed3-4152981b5c2f', 'b8fcc070-c8e2-4c86-a852-7256235e9bcf', 'bb206bb6-6948-4c9f-9231-6cd22c4ac9eb', 'c56ef0b3-92e8-487b-b1a5-a237655e5f78', 'cfcb555a-1e27-4e74-8f27-fd0d095be279', 'd6700915-edd6-4fa7-840e-3436a784b4b9', 'd6e86520-2625-4a10-a0de-fdbb80956075', 'd858fbb4-15f0-43ea-b021-b51caf48d466', 'd8d94cfd-77f8-4aa7-a7eb-3309ac64071d', 'dbe2a2d7-5b6b-4f1e-a07b-c2a852d48f10', 'df607451-f0ff-40fa-8dc5-44607121194d', 'e16b40ce-9dc1-4dcf-ae6a-0482e3f36796', 'e3735b90-02a3-480d-b29e-0578b5074100', 'e7fa4103-c7fd-4374-ac34-4d4e79e72b74', 'eec56578-9434-49ce-9da3-446e4cf9b2fa', 'f3155f1f-7485-4f66-8b3a-686ebfbd6e8c', 'f61ea4c3-0953-4c38-a8bb-ecdd396cc332', 'fb8b160e-b237-43e1-b2b0-531e01d8f951', 'feb16b71-d986-43f0-a05b-431c686717ae', 'feb8ae2d-f218-460f-afe2-4e49debcbcb0'
)
AND NOT EXISTS (SELECT 1 FROM public.location_iconic_spots d WHERE d.location_key = 'ancient wonders of the middle east and africa' AND d.spot_text = s.spot_text);

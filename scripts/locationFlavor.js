/**
 * Per-location flavor + pool-size data for the seed generation pipeline.
 *
 * Both Stage 1 (gen-location-hints.js) and Stage 2 (gen-iconic-spots-50.js)
 * read this module to customize their Sonnet prompts per location, instead
 * of using a single generic template that biases toward coastal/tropical
 * content (which broke for inland regions like China/India/Mexico).
 *
 * Each entry can have:
 *   - count           pool size for Stage 2 (default 100)
 *   - soul            1-2 sentences describing what the location IS
 *   - anchors         array of top must-have specific named landmarks
 *   - emphasis        % rough split of pillar categories
 *   - deemphasize     what to PUSH AWAY from (corrects default biases)
 *
 * Locations with no entry use defaults (count=100, no flavor injection).
 * Locations that just need a count override get a count-only entry.
 */

const FLAVOR = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COUNTRY / REGION METAS — full flavor required
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  china: {
    count: 250,
    soul: "Imperial dynasties, ancient civilization, dramatic karst and mountain landscapes, Buddhist/Taoist heritage, and ultra-modern megacities all coexisting. Spans Beijing imperial complex, Xi'an ancient capital, Shanghai modern skyline, Guilin karst country, and Tibetan/Yunnan highlands.",
    anchors: [
      'Great Wall of China at Mutianyu',
      'Forbidden City exterior aerial',
      'Temple of Heaven',
      'Summer Palace and Kunming Lake',
      'Terracotta Army pits Xian',
      'Ancient City Wall of Xian',
      'Big Wild Goose Pagoda',
      'Shanghai Pudong skyline from the Bund',
      'The Bund colonial waterfront',
      'Yu Garden Shanghai',
      'Li River karst landscape Guilin',
      'Yangshuo cormorant fisherman bamboo raft',
      'Yellow Mountains (Huangshan) granite peaks',
      'Tiger Leaping Gorge',
      'Zhangjiajie sandstone pillar forest',
      'Jiuzhaigou Valley turquoise lakes',
      'Zhangye Danxia rainbow mountains',
      'Yangtze Three Gorges',
      'Chengdu Giant Panda Reserve',
      'Potala Palace Lhasa exterior',
      'Longji rice terraces Longsheng',
      'Hong Kong Victoria Harbour skyline',
      'Hong Kong Peak Tram view',
      'Mogao Caves Dunhuang exterior',
    ],
    emphasis:
      '40% imperial architecture (Great Wall, Forbidden City, temples, pagodas, ancient walls), 35% dramatic landscape (karsts, granite peaks, valleys, gorges, rainbow mountains), 15% modern cityscape (Shanghai Pudong, HK skyline), 10% cultural heritage (pandas, rice terraces)',
    deemphasize:
      "NOT primarily coastal — minimize beaches, surf, coral reefs. China's identity is imperial + mountain + city, not tropical island.",
  },
  india: {
    count: 250,
    soul: "Mughal-era architectural splendor, Hindu/Buddhist sacred sites, dense urban color, Himalayan north, Rajasthan desert palaces, Kerala backwaters, and Goa beaches. Diversity is its essence — every region looks different.",
    anchors: [
      'Taj Mahal at Agra',
      'Red Fort Delhi',
      'Lotus Temple Delhi',
      'Amber Fort Jaipur',
      'Hawa Mahal Pink City Jaipur',
      'Jaipur City Palace',
      'Varanasi Ganges ghats',
      'Manikarnika cremation ghat',
      'Hampi boulder ruins Karnataka',
      'Ajanta Caves rock cliff',
      'Ellora cave temples',
      'Mumbai Gateway of India',
      'Mumbai Marine Drive',
      'Mumbai Dhobi Ghat',
      'Kerala backwaters houseboats',
      'Munnar tea plantation terraces',
      'Goa Palolem Beach',
      'Goa Anjuna Beach',
      'Ladakh Pangong Lake',
      'Leh Palace Himalayas',
      'Nubra Valley sand dunes',
      'Khajuraho temple complex',
      'Meenakshi Amman Temple Madurai',
      'Konark Sun Temple',
      'Mysore Palace',
      'Nilgiri Blue Mountain railway',
      'Rann of Kutch white salt desert',
      'Golden Temple Amritsar',
      'Jaisalmer golden fort',
      'Pushkar holy lake and temples',
    ],
    emphasis:
      '35% Mughal/Rajput architecture (Taj, palaces, forts), 25% Hindu/Buddhist sacred sites (temples, ghats, caves), 20% landscape (Himalayas, deserts, backwaters, ghats), 20% urban color (Mumbai, Delhi, markets)',
    deemphasize:
      "NOT primarily coastal — India's soul is Mughal + spiritual + mountain + urban color. Beaches are only ~10% (Goa/Kerala/Andaman).",
  },
  australia: {
    count: 200,
    soul: 'Continent-scale wilderness, ancient Aboriginal landscape, signature Sydney harbour, Great Barrier Reef, Uluru, vast red Outback, white-sand coasts, and modern coastal cities.',
    anchors: [
      'Sydney Opera House',
      'Sydney Harbour Bridge',
      'Bondi Beach',
      'Royal Botanic Garden Sydney',
      'Uluru / Ayers Rock',
      'Kata Tjuta domes',
      'Kings Canyon',
      'Great Barrier Reef from above',
      'Whitsundays Whitehaven Beach',
      'Twelve Apostles Great Ocean Road',
      'Loch Ard Gorge',
      'Daintree Rainforest canopy walk',
      'Cape Tribulation',
      'Blue Mountains Three Sisters',
      'Jenolan Caves',
      'Kakadu National Park',
      'Litchfield waterfalls',
      'Tasmania Cradle Mountain',
      'Wineglass Bay Tasmania',
      'Melbourne laneways',
      'Brighton Beach bathing boxes',
      'Perth Cottesloe Beach',
      'Rottnest Island coastline',
      'Karijini iron gorges',
      'Pinnacles Desert formations',
      'Lord Howe Island',
      'Ningaloo Reef shore',
    ],
    emphasis:
      '30% iconic Sydney/Melbourne/Perth urban landmarks, 30% Outback red center (Uluru, deserts, canyons), 25% reef/coast (Whitsundays, Great Ocean Road, beaches), 15% varied wilderness (Tasmania, Daintree, Kakadu, Karijini)',
  },
  mexico: {
    count: 200,
    soul: 'Mayan and Aztec archaeological wonders, vibrant colonial hill towns, papel-picado plazas, Pacific surf coast, Caribbean Riviera Maya, cenotes, and dramatic biospheres.',
    anchors: [
      'Chichen Itza El Castillo pyramid',
      'Tulum cliffside Mayan ruins',
      'Palenque jungle ruins',
      'Teotihuacan Pyramid of the Sun',
      'Pyramid of the Moon',
      'Mexico City zocalo with Metropolitan Cathedral',
      'Palacio de Bellas Artes Mexico City',
      'Frida Kahlo Casa Azul Coyoacan',
      'Oaxaca colonial city center',
      'Monte Alban Zapotec ruins',
      'Guanajuato colorful hill town panorama',
      'San Miguel de Allende parroquia',
      'Tulum Beach with Mayan ruins above',
      'Cenote Ik Kil cave swim',
      'Cenote Dos Ojos',
      'Hierve el Agua petrified waterfall',
      'Copper Canyon (Barrancas del Cobre)',
      'Sumidero Canyon Chiapas',
      'Agua Azul cascades',
      'Sian Kaan biosphere reserve',
      'Marietas hidden beach',
      'Cabo San Lucas El Arco',
      'Puerto Vallarta malecon',
      'Real de Catorce desert town',
      'Bacalar Lagoon seven shades of blue',
    ],
    emphasis:
      '30% Mayan/Aztec archaeology (pyramids, ruins), 25% colonial cities (CDMX, Oaxaca, Guanajuato, San Miguel), 25% nature (cenotes, canyons, waterfalls, biospheres), 20% Pacific + Caribbean coast (Tulum, Cabo, Riviera Maya)',
    deemphasize:
      'do not skew entirely coastal — archaeology + colonial cities + nature are equally signature',
  },
  turkey: {
    count: 200,
    soul: 'Ottoman and Byzantine architecture, otherworldly Cappadocia rock formations, Pamukkale travertines, Aegean and Mediterranean ruins, and the Bosphorus crossroad of East and West.',
    anchors: [
      'Hagia Sophia exterior Istanbul',
      'Blue Mosque (Sultan Ahmed)',
      'Topkapi Palace gardens',
      'Bosphorus strait view',
      'Galata Tower Istanbul',
      'Grand Bazaar exterior',
      'Cappadocia fairy chimneys Goreme',
      'Cappadocia hot air balloon valley',
      'Uchisar Castle Cappadocia',
      'Pamukkale white travertine terraces',
      'Hierapolis ancient theatre',
      'Ephesus Library of Celsus',
      'Ephesus Great Theatre',
      'Pergamon Acropolis Turkey',
      'Aphrodisias ancient ruins',
      'Mount Nemrut giant stone heads',
      'Sumela Monastery cliff',
      'Antalya old harbor Kaleici',
      'Oludeniz Blue Lagoon',
      'Butterfly Valley Turkey',
      'Patara Beach Turkey',
      'Lake Van eastern Turkey',
      'Mardin sandstone hill town',
      'Safranbolu Ottoman houses',
      'Ani ruined medieval city',
    ],
    emphasis:
      '30% Istanbul Ottoman+Byzantine (Hagia Sophia, Blue Mosque, Topkapi, Bosphorus), 25% Cappadocia (chimneys, valleys, balloons), 20% ancient ruins (Ephesus, Pergamon, Aphrodisias, Nemrut), 15% natural formations (Pamukkale, Lake Van), 10% coast (Antalya, Oludeniz)',
    deemphasize:
      'do not over-rely on hot air balloon imagery — balloons are an axis, not a pillar; vary scenes',
  },
  thailand: {
    count: 150,
    soul: 'Golden Buddhist temples, limestone karst islands, ancient ruined capitals, jungle waterfalls, vibrant Bangkok river temples, and northern hill country.',
    anchors: [
      'Wat Arun riverside Bangkok',
      'Wat Pho reclining Buddha',
      'Grand Palace Bangkok',
      'Wat Phra Kaew Emerald Buddha',
      'Chao Phraya River temples',
      'Bangkok Chinatown street',
      'Phi Phi Maya Bay',
      'James Bond Island Phang Nga',
      'Railay Beach karsts',
      'Phra Nang Cave Beach',
      'Wat Phra That Doi Suthep Chiang Mai',
      'Chiang Mai Old City walls',
      'White Temple Wat Rong Khun',
      'Blue Temple Wat Rong Suea Ten',
      'Ayutthaya Wat Mahathat Buddha head in tree',
      'Wat Chaiwatthanaram Ayutthaya ruins',
      'Sukhothai Historical Park seated Buddha',
      'Erawan Falls seven tiers',
      'Sticky Waterfall Chiang Mai',
      'Khao Sok Cheow Lan Lake limestone peaks',
      'Koh Tao Sairee Beach',
      'Similan Islands granite boulders',
      'Mae Hong Son loop highland village',
      'Damnoen Saduak floating market',
    ],
    emphasis:
      '30% Buddhist temples (Bangkok, Chiang Mai, north), 30% island/karst (Phi Phi, Krabi, Phang Nga), 20% ancient ruins (Ayutthaya, Sukhothai), 15% jungle/waterfalls, 5% modern Bangkok',
    deemphasize: 'do not make this entirely beach — temples and ruins are equally signature',
  },
  morocco: {
    count: 150,
    soul: 'Imperial cities with vast medinas, Atlas mountain Berber kasbahs, Sahara dunes, blue-painted Chefchaouen, and Atlantic surf coast.',
    anchors: [
      'Jemaa el-Fnaa square Marrakech',
      'Koutoubia Mosque exterior',
      'Bahia Palace courtyard',
      'Majorelle Garden Marrakech',
      'Saadian Tombs',
      'Fes el-Bali medina',
      'Chouara Tannery aerial view',
      'Bou Inania Madrasa courtyard',
      'Chefchaouen blue-painted alley',
      'Chefchaouen Spanish Mosque hill view',
      'Ait Benhaddou kasbah',
      'Telouet Kasbah',
      'Todra Gorge cliffs',
      'Dades Valley canyon road',
      'Erg Chebbi Sahara dunes',
      'Merzouga camel caravan',
      'Atlas Mountains Imlil village',
      'Mount Toubkal',
      'Essaouira fortified harbor',
      'Essaouira blue fishing boats',
      'Casablanca Hassan II Mosque exterior',
      'Rabat Kasbah of the Udayas',
      'Volubilis Roman ruins',
      'Ouzoud Falls Atlas waterfalls',
      'Legzira Beach natural arch',
    ],
    emphasis:
      '30% imperial medina cities (Marrakech, Fes), 25% Atlas/kasbahs (Ait Benhaddou, Telouet, Tinghir, Dades), 20% Sahara dunes and camel scenes, 15% Chefchaouen blue city, 10% Atlantic coast (Essaouira, Legzira, Casablanca)',
  },
  'caribbean islands': {
    count: 200,
    soul: 'Multi-island archipelago — turquoise overwater Bahamas, Jamaican waterfalls and cliffs, Puerto Rico rainforest and old San Juan, US/British Virgin Islands beaches, Aruba/Curacao colonial color, Cuba Habana, and dramatic St. Lucia Pitons.',
    anchors: [
      'Dunns River Falls Jamaica',
      'Negril Seven Mile Beach',
      'Negril cliffs at Ricks Cafe',
      'Blue Mountains Jamaica coffee terraces',
      'Old Havana colonial street',
      'Varadero Beach Cuba',
      'Vinales Valley tobacco fields',
      'El Yunque rainforest Puerto Rico',
      'Old San Juan colonial fort',
      'El Morro fortress San Juan',
      'Flamenco Beach Culebra',
      'Bioluminescent Mosquito Bay Vieques',
      'Trunk Bay St John',
      'Magens Bay St Thomas',
      'The Baths Virgin Gorda BVI',
      'Anegada reef BVI',
      'Grace Bay Turks and Caicos',
      'Chalk Sound Providenciales',
      'Pink Sands Beach Bahamas',
      'Deans Blue Hole Bahamas',
      'Exuma swimming pigs beach',
      'Thunderball Grotto Exuma',
      'Pitons Saint Lucia',
      'Sulphur Springs drive-in volcano',
      'Reduit Beach Saint Lucia',
      'Aruba Eagle Beach divi divi tree',
      'Arikok cliffs Aruba',
      'Curacao Willemstad pastel houses',
      'Bonaire Klein Bonaire reef',
      'Tobago Cays sandbar',
      'Boiling Lake Dominica',
      'Argyle Waterfall Tobago',
    ],
    emphasis:
      '40% named beaches (Trunk Bay, Magens Bay, Grace Bay, Negril, Pink Sands, Flamenco, etc.), 20% colonial historic centers (Old San Juan, Habana, Willemstad), 15% dramatic geology (Pitons, Boiling Lake, Negril Cliffs, Baths boulders), 15% rainforest/waterfalls/blue holes, 10% reefs/snorkel',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STANDALONE CITIES — count + brief soul where useful
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'new york city': {
    count: 90,
    soul: '5 boroughs, dense iconic-spot density — Manhattan skyline, Central Park, Brooklyn Bridge, Statue of Liberty, Times Square, plus outer-borough character.',
  },
  tokyo: {
    count: 90,
    soul: 'Multi-district megacity — Shibuya, Shinjuku, Asakusa, Akihabara, Ginza, Tsukiji, plus Mount Fuji nearby and Tokyo Tower / SkyTree.',
  },
  paris: {
    count: 90,
    soul: 'Iconic boulevards, Haussmann architecture, Eiffel + Louvre + Notre Dame + Versailles, Seine bridges, Montmartre + Latin Quarter, Champs-Élysées.',
  },
  venice: {
    count: 60,
    soul: 'Concentrated archipelago — Grand Canal, St. Marks Basilica, Rialto Bridge, Doges Palace, plus outer islands Murano, Burano, Lido.',
  },
  london: {
    count: 90,
    soul: 'West End, Tower Bridge, Big Ben/Westminster, Buckingham, Tower of London, royal parks, plus Camden + Notting Hill + Greenwich character.',
  },
  dubai: { count: 50 },
  santorini: { count: 50 },
  'hong kong': { count: 60 },
  rome: {
    count: 90,
    soul: 'Ancient ruins (Colosseum, Forum, Pantheon), Renaissance Vatican, Baroque fountains (Trevi, Navona), plus Trastevere + Spanish Steps + Borghese.',
  },
  'los angeles': {
    count: 80,
    soul: 'LA basin sprawl — Hollywood, Venice Beach, Santa Monica Pier, Griffith Observatory, Beverly Hills, downtown DTLA + Echo Park + Malibu coast.',
  },
  miami: { count: 60 },
  'san francisco': {
    count: 70,
    soul: 'Golden Gate, Alcatraz, Chinatown, Painted Ladies, Lombard Street, Coit Tower, plus Mission District + Castro + Marin Headlands views.',
  },
  barcelona: {
    count: 80,
    soul: 'Gaudí (Sagrada Familia, Park Güell, Casa Batlló, Casa Milà), Gothic Quarter, Las Ramblas, Barceloneta beach, Montjuïc.',
  },
  'rio de janeiro': { count: 70 },
  seoul: { count: 70 },
  'las vegas': { count: 50 },
  amsterdam: {
    count: 50,
    soul: 'Concentric canal rings, gabled Dutch houses, ornate bridges, world-class museums (Rijksmuseum, Van Gogh, Anne Frank), Vondelpark + Jordaan + Dam Square.',
  },
  prague: {
    count: 50,
    soul: 'Gothic and Baroque architecture, Charles Bridge statues, red-tiled rooftops, ornate Old Town Square, looming Prague Castle on the hill.',
  },
  singapore: {
    count: 50,
    soul: 'Futuristic Marina Bay Sands + Gardens by the Bay, ArtScience Museum lotus, Merlion, plus Chinatown, Little India, Sentosa, and the Singapore Botanic Gardens.',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // EPIC NATURE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  yosemite: { count: 100 },
  'moab arches': { count: 75 },
  'swiss alps': { count: 100 },
  iceland: { count: 100 },
  'canadian rockies': { count: 100 },
  'grand canyon': { count: 75 },
  'zion national park': { count: 75 },
  'redwood forest': { count: 50 },
  'amazon rainforest': { count: 100 },
  'big sur cliffs': { count: 50 },
  yellowstone: {
    count: 75,
    soul: "America's first national park — geothermal Grand Prismatic + Old Faithful, Lamar/Hayden valleys with bison and elk, Yellowstone Falls and canyon, Mammoth Hot Springs travertine.",
    anchors: [
      'Grand Prismatic Spring aerial',
      'Old Faithful geyser eruption',
      'Mammoth Hot Springs travertine terraces',
      'Lower Yellowstone Falls and canyon',
      'Lamar Valley bison herd',
      'Hayden Valley grassland',
      'Yellowstone Lake',
      'Morning Glory Pool',
      'Norris Geyser Basin',
      'Tower Fall',
      'Mount Washburn lookout',
      'Roosevelt Arch entrance',
      'Black Sand Basin',
      'Castle Geyser',
      'Steamboat Geyser',
    ],
  },
  'african safari': {
    count: 125,
    soul: 'Multi-country meta — Serengeti and Maasai Mara plains, Mount Kilimanjaro and Ngorongoro crater, Okavango Delta, Victoria Falls, Namibian dunes, Kruger acacia bushveld.',
    anchors: [
      'Serengeti acacia plain at watering hole',
      'Maasai Mara wildebeest migration',
      'Mount Kilimanjaro snow peak',
      'Ngorongoro Crater rim',
      'Olduvai Gorge',
      'Victoria Falls full curtain',
      'Okavango Delta channels aerial',
      'Chobe River elephants',
      'Namib Sossusvlei dunes',
      'Deadvlei dead camel-thorn trees',
      'Etosha Pan salt flat',
      'Kruger acacia bushveld',
      'Bwindi Impenetrable Forest gorillas habitat',
      'Lake Manyara flamingos',
      'Tarangire baobab grove',
      'Skeleton Coast shipwreck',
      'Damaraland rock formations',
    ],
    emphasis:
      '40% iconic wildlife landscape (acacia + plains + watering holes), 25% great natural wonders (Vic Falls, Kilimanjaro, Ngorongoro, Sossusvlei), 20% river/delta (Okavango, Chobe, Zambezi), 15% varied terrain (baobabs, dunes, salt pans, gorges)',
  },
  'new zealand': {
    count: 150,
    soul: 'Two-island continent of fjords, alpine peaks, glaciers, lake-and-mountain reflections, geothermal terraces, and dramatic coast — South Island Milford/Aoraki, North Island Tongariro/Rotorua/Bay of Islands.',
    anchors: [
      'Milford Sound Mitre Peak',
      'Doubtful Sound',
      'Aoraki Mount Cook reflected in Hooker Lake',
      'Lake Tekapo Church of the Good Shepherd',
      'Lake Pukaki turquoise',
      'Franz Josef Glacier',
      'Fox Glacier',
      'Wanaka tree in the lake',
      'Roys Peak overlook Wanaka',
      'Queenstown waterfront and Remarkables',
      'Routeburn Track alpine ridge',
      'Tongariro Crossing emerald lakes',
      'Mount Ngauruhoe',
      'Mount Taranaki perfect cone',
      'Champagne Pool Wai-O-Tapu',
      'Rotorua geothermal terraces',
      'Bay of Islands Hole in the Rock',
      'Cape Reinga lighthouse',
      'Cathedral Cove arch Coromandel',
      'Moeraki Boulders coast',
      'Punakaiki Pancake Rocks',
      'Hobbiton Shire',
      'Abel Tasman beach',
      'Lake Matheson reflections',
    ],
    emphasis:
      '35% fjords + alpine peaks (Milford, Aoraki, Routeburn), 25% lakes and reflections (Tekapo, Pukaki, Wanaka, Matheson), 20% volcanic/geothermal (Tongariro, Rotorua, Champagne Pool), 20% coast/varied (Bay of Islands, Cathedral Cove, Moeraki, Hobbiton)',
  },
  patagonia: {
    count: 75,
    soul: 'Granite spires, glacial turquoise lakes, austral guanaco plains, and the Perito Moreno glacier — Chilean Torres del Paine + Argentine Los Glaciares.',
    anchors: [
      'Torres del Paine three granite spires',
      'Cuernos del Paine horns',
      'Lake Pehoe reflections',
      'Grey Glacier',
      'Perito Moreno glacier face',
      'Mount Fitz Roy at dawn',
      'Cerro Torre',
      'Laguna de los Tres',
      'Marble Caves Carrera Lake',
      'El Chalten village under peaks',
      'Tierra del Fuego beech forest',
      'Magellan Strait coast',
      'Falklands penguin colony shore',
    ],
  },
  'norwegian fjords': {
    count: 75,
    soul: 'Deep glacial fjords with sheer cliffs, cascading waterfalls, red wooden cabins, and aurora-lit winter skies — Geirangerfjord, Nærøyfjord, Lofoten, Pulpit Rock.',
    anchors: [
      'Geirangerfjord Seven Sisters waterfalls',
      'Naerofjord (UNESCO)',
      'Pulpit Rock (Preikestolen) cliff',
      'Trolltunga rock ledge',
      'Kjeragbolten boulder wedged in chasm',
      'Lofoten Reine red cabins',
      'Hamnoy fishing village Lofoten',
      'Senja Tungeneset Devils Teeth',
      'Atlantic Road Norway',
      'Bergen Bryggen colorful warehouses',
      'Stalheim Valley overlook',
      'Sognefjord widest',
      'Hardangerfjord fruit orchards',
      'Voringfossen waterfall',
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FANTASY WORLDS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'gothic realm': {
    count: 100,
    soul: 'A composite gothic realm — vampire-castle silhouettes, foggy Victorian London streets, dark cathedral interiors, noir cobblestone alleys, haunted Carpathian peaks, ravens and gas lamps.',
    anchors: [
      'Towering gothic cathedral with flying buttresses',
      'Vampire castle on misty mountain peak',
      'Foggy Victorian London cobblestone street',
      'Gaslit alley between brick tenements',
      'Cemetery with weathered angel statues',
      'Crumbling abbey ruin in moor',
      'Crow-filled bare oak silhouette',
      'Bell tower against full moon',
      'Wrought-iron cemetery gate',
      'Stone gargoyle perched on parapet',
      'Catacombs entrance archway',
      'Dilapidated mansion on hillside',
      'Carpathian peak wreathed in fog',
      'Stone bridge with statues at twilight',
      'Empty noir city plaza with neon sign reflections',
    ],
  },
  'fairy cottage': { count: 50 },
  'princess garden castle': { count: 50 },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TROPICAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  maldives: { count: 75 },
  bali: {
    count: 100,
    soul: 'Hindu temples, terraced rice fields, jungle waterfalls, volcanic peaks, and beach + reef breaks — Ubud, Tegallalang, Mount Batur, Tanah Lot, Uluwatu.',
  },
  'costa rica': {
    count: 100,
    soul: 'Cloud forests, volcanoes, monkey-filled rainforest, and Pacific surf coast — Arenal, Monteverde, Tortuguero, Manuel Antonio, Corcovado.',
  },
  'bora bora tahiti': { count: 60 },
};

/**
 * Get flavor data for a location, with defaults.
 * @param {string} locationName lowercased location_cards.name
 * @returns {{count:number, soul?:string, anchors?:string[], emphasis?:string, deemphasize?:string}}
 */
function getFlavor(locationName) {
  const entry = FLAVOR[locationName] || {};
  return {
    count: entry.count ?? 100,
    soul: entry.soul,
    anchors: entry.anchors,
    emphasis: entry.emphasis,
    deemphasize: entry.deemphasize,
  };
}

/**
 * Build a "LOCATION IDENTITY" block to inject into Sonnet prompts.
 * Returns an empty string when no flavor is registered (so the call site
 * falls back to its generic template).
 */
function flavorBlock(locationName) {
  const f = getFlavor(locationName);
  if (!f.soul && !f.anchors && !f.emphasis && !f.deemphasize) return '';
  const parts = [`━━━ LOCATION IDENTITY — "${locationName}" ━━━`];
  if (f.soul) parts.push(`What this location IS:\n${f.soul}`);
  if (f.anchors && f.anchors.length > 0) {
    parts.push(
      `Required iconic anchors — the pool MUST include entries depicting most of these (or their exterior view, if architectural):\n${f.anchors.map((a) => `  - ${a}`).join('\n')}`
    );
  }
  if (f.emphasis) parts.push(`Pillar emphasis mix:\n${f.emphasis}`);
  if (f.deemphasize) parts.push(`AVOID OVER-INDEXING ON:\n${f.deemphasize}`);
  return '\n\n' + parts.join('\n\n') + '\n';
}

module.exports = { FLAVOR, getFlavor, flavorBlock };

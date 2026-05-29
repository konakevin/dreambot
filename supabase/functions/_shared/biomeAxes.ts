/**
 * Biome Axes — per-biome variation pools for nightly scene-only renders.
 *
 * Each location is tagged with a biome (location_cards.biome). At render
 * time, the Edge Function looks up the biome's TIME/WEATHER/CAMERA/PHENOMENA
 * arrays plus its SUBJECT_RULE and BANS, and weaves them into the brief.
 *
 * One biome = one coherent atmospheric package. Same Hawaii pillars get
 * tropical-coastal axes; same Tokyo pillars get urban-modern axes.
 *
 * Phase 1: tropical_coastal is the proof-of-concept (Hawaii). Add more
 * biomes incrementally — each new biome adds an entry here + an UPDATE
 * to location_cards.biome via a migration.
 */

export interface BiomeConfig {
  /** Time-of-day options native to this biome */
  TIME: string[];
  /** Weather conditions native to this biome */
  WEATHER: string[];
  /** Camera angles (mostly shared but can be biome-specific) */
  CAMERA: string[];
  /** Atmospheric phenomena native to this biome */
  PHENOMENA: string[];
  /** What the subject of the render is — drives the brief's framing */
  SUBJECT_RULE: string;
  /** Hard content bans for this biome — appended to the brief */
  BANS: string[];
}

const SHARED_CAMERA = [
  'wide cinematic vista, vast horizon, the subject monumental',
  'cinematic aerial sweep, sweeping helicopter perspective',
  'extreme low angle looking up, towering scale, forced perspective',
  'long-lens compression flattening depth, iconic subject filling frame',
  'eye-level wide-angle, lush foreground detail leading into vast distance',
];

export const BIOME_AXES: Record<string, BiomeConfig> = {
  tropical_coastal: {
    TIME: [
      'sunrise — soft pink and orange sky, low warm side-light',
      'golden hour — warm amber rim-light, long shadows',
      'midday clear — full sun, deeply saturated colors, hard shadows',
      'blue hour — cool deep twilight tones, ambient glow',
      'storm light — dark sky with sun breaking through cloud holes',
      'tropical sunset — sky on fire with pink, magenta, and tangerine, sun touching the horizon, warm gold reflections on water',
      'late golden sunset — sun low over the ocean, sky gradient from peach to violet, palms silhouetted against fiery glow',
      'pre-dusk hour — warm amber sun catching every surface, long sculptural shadows, peach-gold sky',
    ],
    WEATHER: [
      'crystal-clear air, infinite distance visibility, sharp horizon',
      'partly cloudy with dramatic sculpted cloud formations',
      'fresh post-rain clarity, iridescent sky tones',
      'high cumulus towers against vivid blue sky, sharp distance',
      'distant storm cell + sunlit foreground, dramatic split sky',
      'wispy trade-wind clouds streaking the sky, brilliant clear air below',
      'thin light haze on the horizon only, foreground crisp and bright',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'warm golden-hour rim light catching every surface edge',
      'double rainbow arcing across the frame',
      'sun glittering on water in countless points of light',
      'wave crests catching backlight as glowing white edges',
      'palm fronds backlit, fronds becoming translucent gold',
      'sharp directional sunlight casting long crisp shadows',
      'sun reflecting off wet rock as small bright highlights',
      'mirror-still water reflecting sky in perfect detail',
      'lens flare from low sun, hexagonal highlight bokeh',
      'crisp shadow patterns from palm fronds across sand',
      'god-rays piercing through scattered cumulus clouds',
      'crepuscular rays fanning from sun through cloud breaks',
      'sea spray catching backlight as suspended glowing droplets',
      'volumetric beams cutting through tropical mist',
    ],
    SUBJECT_RULE:
      'unmistakably recognizable OUTDOOR LANDSCAPE view of the location. Iconic natural features rendered MASSIVE — towering, monumental, dominating the frame. Pure geography + atmosphere.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO INTERIORS — no rooms, no chapels, no forges, no bunkers, no architecture-as-subject',
      'NO FANTASY (no runes, spell circles, magical energy, ley lines, mystical glow)',
      'NO SCI-FI (no spaceships, neon-grid skies, holograms, multi-moons, twin-suns)',
      'NO IMPOSSIBLE PHYSICS (no floating islands, floating objects, time-suspension)',
      "NO galaxies above sunsets (stars and sunset don't co-exist)",
      'NO CONCEPTUAL/SYMBOLIC compositions (no doorways-as-portal, no windows-to-elsewhere)',
    ],
  },
  arctic_polar: {
    TIME: [
      'aurora night — sky dancing with green and violet ribbons over frozen ground',
      'midnight sun — low golden disc casting impossibly long shadows across snow',
      'polar dawn — soft pink and lavender light barely cresting the horizon',
      'blue hour over snow — deep cobalt and teal twilight, sharp star points emerging',
      'arctic noon — pale clear sun, stark blue shadows on white',
      'pre-storm light — leaden grey sky breaking with one shaft of cold gold',
      'late golden hour on ice — amber light catching every facet of frozen surfaces',
    ],
    WEATHER: [
      'crystal-clear arctic air with infinite cold visibility',
      'light snow drifting through still air, flakes catching distant light',
      'breaking storm with fresh powder and sun cutting through',
      'thin ice fog hugging frozen ground, sky perfectly clear above',
      'dramatic cloud-shelf at horizon with sun blasting beneath',
      'fresh snow with mirror-still air, pristine blue shadows',
      'wisps of frost-smoke rising from open water against still sky',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'aurora borealis ribbons rippling overhead in green and magenta',
      'sun pillar shooting straight up from the horizon at low sun',
      '22-degree halo around the sun from ice crystal optics',
      'sun dogs flanking the low sun on either side',
      'light pillars rising over distant ground from cold air ice crystals',
      'sparkling ice crystals catching low sunlight on every surface',
      'mirror reflection on still water doubling sky and mountains',
      'frost flowers on ice surface catching morning light',
      'green flash on horizon at sunset',
      'moonlight on snow casting blue luminance across the landscape',
    ],
    SUBJECT_RULE:
      'unmistakably recognizable OUTDOOR FROZEN LANDSCAPE view of the location. Iconic arctic features rendered MASSIVE — towering ice, cathedral-scale glaciers, vast snow plains, dramatic fjords, volcanic-meets-ice formations. Pure geography + arctic atmosphere.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO INTERIORS — no buildings as subject, no warming huts',
      'NO FANTASY (no runes, spell circles, magical energy, ley lines, mystical glow)',
      'NO SCI-FI (no spaceships, neon-grid skies, holograms)',
      'NO IMPOSSIBLE PHYSICS (no floating islands, floating objects)',
      'NO TROPICAL ELEMENTS (no palm trees, no warm-water beaches, no green-jungle foliage)',
      'NO CONCEPTUAL/SYMBOLIC compositions',
    ],
  },

  ancient_ruins: {
    TIME: [
      'golden hour — warm amber rim light, long shadows raking across stone',
      'dawn — soft pink and lavender first light striking the monument',
      'midday — harsh clear sun, deep dramatic shadows in the carvings',
      'blue hour — cool deep twilight, monument silhouetted against fading sky',
      'storm light — dark sky with sun bursting through cloud breaks',
      'sunset — sky on fire orange and crimson behind the ruins',
      'dust-veiled sunset — sun filtered through atmospheric desert haze',
    ],
    WEATHER: [
      'crystal-clear sharp distance, hard cut horizon',
      'dramatic cumulus clouds dwarfing the ruins',
      'thin atmospheric heat haze on the horizon, stone crisp',
      'post-rain clarity with iridescent stone surfaces',
      'distant storm cell + sun blasting on the foreground',
      'wind-blown sand drifting across the monument base',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'god-rays piercing through ruined columns or arches',
      'dust catching sunlight in a column of light',
      'stone glowing amber-gold in the rim light',
      'shadow patterns of carvings cast across stone',
      'lens flare from low sun behind the monument',
      'sparse vegetation backlit against ancient walls',
      'crepuscular rays fanning over the desert / jungle',
      'moonlight on stone with cool blue luminance',
    ],
    SUBJECT_RULE:
      'unmistakably recognizable ICONIC ANCIENT MONUMENT — the named ruin or wonder must DOMINATE the frame as the subject. Render the monument MASSIVE, monumental, awe-scaled. Pure architecture-as-subject + atmospheric drama. Ancient stone is the hero.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO TOURISTS, NO MODERN CHARACTERS',
      'NO MODERN INFRASTRUCTURE — no signs, no ropes, no platforms, no walkways, no scaffolding, no fences, no parking lots',
      'NO MODERN CLOTHING or anything anachronistic',
      'NO FANTASY (no glowing runes, magical energy, mystical glow, ley lines)',
      'NO SCI-FI (no spaceships, holograms, anachronistic technology)',
      'NO IMPOSSIBLE PHYSICS (no floating islands)',
      'NO TOURIST CLICHÉS (no map-holding visitors, no thumbs-up, no fanny packs)',
    ],
  },

  scifi_cosmic: {
    TIME: [
      'twin-sun morning over alien terrain',
      'binary-star noon with double shadows',
      'alien dusk — sky in unnatural violet and amber',
      'plasma night — air glowing faintly with charged particles',
      'orbital sunrise — terminator line crossing the planet below',
      'cosmic blue hour — galaxy core visible in deep twilight',
      'eclipse light — primary star occluded, corona blazing',
      'megacity midnight — neon out-glares any natural light',
    ],
    WEATHER: [
      'crystal-clear thin atmosphere with sharp star points',
      'electric storm with plasma arcs across the sky',
      'methane mist drifting low over alien terrain',
      'meteor shower streaking the dark sky',
      'cyber-city rain on glass towers and neon streets',
      'dust devils on red planet surface',
      'aurora flickering across alien magnetosphere',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'aurora over alien horizon in unnatural colors',
      'holographic projections suspended above the city',
      'plasma arcs crawling along structure edges',
      'bioluminescent flora glowing in alien forest',
      'gravity-warped light bending around megastructure',
      'starship reentry trail across the sky',
      'distant nebula visible in daytime sky',
      'ringed planet looming on the horizon',
      'force-field shimmer surrounding habitat',
      'wormhole or portal glowing in the distance',
    ],
    SUBJECT_RULE:
      'iconic SCI-FI scene — the named landmark or world feature must DOMINATE the frame as the subject. Sci-fi license granted: alien skies, twin moons, neon megacities, terraformed terrain, megastructures, and futuristic architecture are ALL fair game and encouraged.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO PRESENT-DAY EARTH ELEMENTS — no contemporary cars, modern street signs, current buildings',
      'NO FANTASY-MAGIC (no spell circles, mystical glow, fairies, dragons — this is sci-fi, tech and physics-bending only)',
      'NO REAL EARTH LANDMARKS — this is fictional/imagined',
      'NO TOURIST CLICHÉS',
    ],
  },

  fantasy_imagined: {
    TIME: [
      'enchanted twilight — sky shifting from rose to deep violet, first stars emerging',
      'magical dawn — golden mist rising as rose light touches the world',
      'midnight under impossible stars — bright cosmos burning above',
      'moonlit night — silver light flooding the scene, deep blue shadows',
      'golden ethereal afternoon — sun glowing gold-amber, eternal magic-hour quality',
      'arcane storm light — purple-and-gold sky with swirling magical clouds',
      'dawn of a fairy tale — sun rising behind impossibly perfect mountains',
    ],
    WEATHER: [
      'drifting flower petals filling the air',
      'magical fog rolling, glowing softly from within',
      'swirling stardust suspended in still air',
      'crystal-clear with floating motes of light',
      'gentle enchanted snow drifting in moonlight',
      'pollen catching golden light, every drift visible',
      'glowing fireflies and sprite-light suspending in the air',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'floating glowing orbs drifting through the scene',
      'magical sparkles and stardust catching every light',
      'light beams from impossible directions illuminating the scene',
      'swirling energy currents visible as glowing trails',
      'fairy lights and lanterns floating in the air',
      'moonlight on dewdrops creating tiny constellations',
      'sparking magical aura around iconic features',
      'a cascade of glowing petals falling in slow motion',
      'rainbow refractions arcing across the frame',
      'crystalline light reflecting off magical surfaces',
    ],
    SUBJECT_RULE:
      'iconic magical scene — fantasy elements ARE ALLOWED here. The location is imagined; render with magical realism, glowing details, impossible beauty. Magnificent fantasy architecture, floating elements, supernatural lighting, and dreamlike scale are all welcome and encouraged. Render the location as the legends describe it.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO modern technology (no cars, phones, electronics)',
      'NO photorealistic real-world locations (this is fantasy — keep it magical)',
      'NO sci-fi elements (no spaceships, neon-grid skies — this is fantasy not sci-fi)',
      'NO industrial or contemporary urban',
    ],
  },

  gothic_historic: {
    TIME: [
      'midnight under full moon — silver light flooding stone, deep blue-purple shadows',
      'twilight hour — sky deep indigo, gas lamps just lit, stone glowing amber',
      'fog-shrouded dawn — gray-pink mist hugging cobblestones, distant figures faint',
      'stormy late afternoon — overcast sky, low brooding clouds, intermittent rain',
      'candlelit night — interiors warm with candles, exteriors dark stone in moonlight',
      'blue hour over cathedral — sky deep cobalt twilight, stained glass glowing from within',
      'pre-storm dusk — heavy black clouds gathering, gas lamps flickering',
      'moonlit graveyard hour — silver light on weathered headstones, long inky shadows',
    ],
    WEATHER: [
      'thick rolling fog drifting through alleys, visibility limited',
      'steady cold rain glossing cobblestones, surfaces reflective and inky',
      'light snow drifting onto stone parapets, soft white blanket on dark stone',
      'stormy with distant lightning illuminating gothic spires',
      'mist hugging rooftops, distant stone fading into atmosphere',
      'clear cold night with sharp star points above stone silhouettes',
      'sleet at twilight with ice glaze on iron railings',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'fog-glow around gas lamps, soft halos in the mist',
      'moonlight glinting on wet cobblestones',
      'candlelight pouring from cathedral windows into darkness',
      'shadow play of gargoyles and ornaments cast across stone walls',
      'colored light from stained glass casting patterns onto stone floors',
      'smoke from chimneys rising into starlit sky',
      'lightning silhouetting gothic spires against storm clouds',
      'torchlight flickering in stone archways',
      'luminous mist with shafts of moonlight cutting through',
      'ravens or bats wheeling around a clocktower silhouette',
    ],
    SUBJECT_RULE:
      'unmistakably gothic atmosphere — towering stone architecture (cathedrals, manors, mausoleums, gas-lit alleys, cobblestone streets, abandoned chapels), moody atmospheric environment, dark ornate beauty, gothic ornamentation, brooding presence. The gothic setting IS the hero of the frame, rendered massive and atmospheric.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO MODERN ELEMENTS — no cars, phones, contemporary signage, modern fashion',
      'NO BRIGHT DAYLIGHT — gothic is twilight, night, or storm-light',
      'NO TROPICAL or warm-climate elements',
      'NO SCI-FI elements (no spaceships, neon, holograms)',
      'NO IMPOSSIBLE PHYSICS (no floating buildings, no fantasy-magical glow)',
      'NO CONTEMPORARY URBAN scenes (no modern skyscrapers, no neon signs)',
      'NO CHEERFUL or pastel color palettes — gothic palette is deep blues, blacks, greys, dim ambers',
    ],
  },

  desert_arid: {
    TIME: [
      'dawn over dunes — soft rose light raking long shadows across sand',
      'golden hour — warm amber side-light sculpting every ripple and ridge',
      'harsh midday — clear hard sun, bleached colors, short black shadows',
      'blue hour — cool violet twilight settling over cooling sand',
      'dramatic sunset — sky ablaze orange and crimson over the horizon',
      'cold desert night — deep indigo sky, sharp stars over silvered sand',
    ],
    WEATHER: [
      'crystal-clear shimmering air, sharp endless visibility',
      'distant dust storm rolling across the far horizon, foreground clear',
      'wind-rippled sand drifting low across the dunes',
      'rare dramatic clouds throwing shadows across the desert floor',
      'post-flash-flood clarity, air washed and luminous',
      'heat haze blurring the far horizon, foreground crisp',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'heat-mirage shimmer pooling on the far horizon',
      'wind-sculpted sand ripples catching low raking light',
      'sandfall streaming off a dune crest, backlit and glowing',
      'long sculptural shadows stretching across the dunes',
      'lens flare from a low sun over bare rock',
      'a distant dust devil spiraling against clear sky',
      'crepuscular rays fanning over the arid expanse',
      'star field wheeling over the cold night desert',
    ],
    SUBJECT_RULE:
      'vast ARID DESERT landscape view of the location. Dunes, mesas, canyons, red-rock formations or the named monument rendered MASSIVE and monumental. Pure desert geography + dry atmosphere.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO WATER, OCEAN, LUSH GREENERY or jungle foliage (this is arid)',
      'NO TROPICAL elements, NO snow, NO ice',
      'NO INTERIORS as subject',
      'NO FANTASY (no runes, mystical glow), NO SCI-FI (no spaceships, neon)',
      'NO IMPOSSIBLE PHYSICS, NO modern infrastructure or tourists',
    ],
  },

  temperate_forest: {
    TIME: [
      'dappled morning — soft light filtering through the canopy in shafts',
      'golden hour — warm amber light raking between the trunks',
      'misty dawn — cool grey-pink light through fog-wrapped trees',
      'blue hour — deep cool twilight settling beneath the canopy',
      'overcast soft light — even diffuse glow, saturated greens',
      'autumn-gold afternoon — warm light through amber and crimson leaves',
    ],
    WEATHER: [
      'morning mist drifting between the trunks',
      'light rain pattering on the canopy, leaves glistening',
      'crisp clear air with sharp depth into the trees',
      'fog rolling low through the understory',
      'post-rain stillness, everything dripping and luminous',
      'shafts of clear sun cutting through a break in the canopy',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'god-rays piercing down through the canopy in defined shafts',
      'dappled light scattering across the forest floor',
      'mist glowing where sunbeams strike it',
      'dewdrops on ferns catching tiny points of light',
      'backlit translucent leaves glowing green and gold',
      'fireflies drifting through the understory at dusk',
      'moonlight filtering through bare branches in silver shafts',
      'spider silk strung between branches catching the light',
    ],
    SUBJECT_RULE:
      'lush FOREST landscape view of the location. Towering trees, layered canopy, mossy understory and forest depth rendered immersive and grand. Pure woodland + atmosphere.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO DESERT, NO snow-takeover, NO tropical-beach',
      'NO INTERIORS as subject',
      'NO FANTASY glow (no runes, fairy-light, mystical aura)',
      'NO SCI-FI, NO IMPOSSIBLE PHYSICS',
      'NO modern infrastructure, NO hikers or campers',
    ],
  },

  alpine_mountain: {
    TIME: [
      'alpenglow dawn — peaks burning pink-orange against deep blue sky',
      'golden hour — warm light raking across ridgelines and faces',
      'harsh clear midday — sharp light, deep blue sky, crisp shadows',
      'blue hour — cool cobalt twilight over silhouetted peaks',
      'storm-break — dark sky split by a shaft of gold on a summit',
      'sunset on the summits — last warm light on the highest peaks',
    ],
    WEATHER: [
      'crystal-clear sharp air, every distant peak crisp',
      'clouds pooling and flowing through the valleys below',
      'breaking storm with cloud tearing off a summit',
      'mist filling the valley, peaks floating above',
      'lenticular clouds stacked over the highest peaks',
      'fresh-snow-dusted ridges under a clear sky',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'alpenglow setting the snow peaks aflame pink and gold',
      'god-rays spilling down into the valley',
      'cloud inversion with peaks rising above a sea of cloud',
      'sun-star bursting at the edge of a ridgeline',
      'lens flare from a low sun over a summit',
      'mist glowing gold where it catches the sun in the valley',
      'crisp blue shadow of a peak cast across snow',
      'sharp star points over the silhouetted ridgeline at night',
    ],
    SUBJECT_RULE:
      'monumental MOUNTAIN landscape view of the location. Towering peaks, dramatic ridgelines, vast valleys and glaciated faces rendered MASSIVE and awe-scaled. Pure alpine geography + atmosphere.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO TROPICAL elements, NO desert dunes',
      'NO INTERIORS as subject',
      'NO FANTASY (no runes, mystical glow), NO SCI-FI',
      'NO IMPOSSIBLE PHYSICS (no floating islands)',
      'NO modern infrastructure, NO climbers or hikers',
    ],
  },

  grassland_savanna: {
    TIME: [
      'golden dawn — warm low light across the grass, long shadows',
      'golden hour — amber light, acacias backlit against the sky',
      'harsh midday — high clear sun, bleached grass, big bright sky',
      'blue hour — cool twilight over the plains, first stars',
      'dramatic sunset — sky ablaze behind acacia silhouettes',
      'pre-storm light — dark thunderheads with sun beneath',
    ],
    WEATHER: [
      'heat-shimmer clear air over endless grass',
      'towering thunderheads building dramatically over the plains',
      'dust on the wind drifting across the savanna',
      'post-rain green flush under a washed bright sky',
      'wind rippling waves through the tall grass',
      'distant storm cell with sunlit foreground, split sky',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'acacia silhouettes stark against a fiery sky',
      'god-rays fanning through towering thunderheads',
      'dust catching gold light in a low shaft',
      'long shadows of lone trees raking across the grass',
      'lens flare from a low sun over the plains',
      'heat mirage shimmering on the far horizon',
      'sun-star low over the grassland at golden hour',
      'sweeping cloud shadows racing across the savanna',
    ],
    SUBJECT_RULE:
      'vast SAVANNA / GRASSLAND landscape view of the location. Endless rolling grass, lone acacias, big dramatic sky rendered expansive and cinematic. Pure savanna geography + atmosphere.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO safari vehicles, NO tourists, NO modern infrastructure',
      'NO INTERIORS as subject',
      'NO TROPICAL-beach, NO snow, NO dense jungle',
      'NO FANTASY, NO SCI-FI, NO IMPOSSIBLE PHYSICS',
    ],
  },

  wetland_jungle: {
    TIME: [
      'misty jungle dawn — soft light through fog and dense canopy',
      'dappled golden hour — warm light filtering through giant leaves',
      'filtered midday — green-tinted light beneath the dense canopy',
      'blue hour — deep cool twilight in the humid understory',
      'storm light — dark sky breaking with a shaft over the river',
      'sunset through the canopy — warm light igniting the upper leaves',
    ],
    WEATHER: [
      'humid mist rising off the forest floor and river',
      'monsoon rain hammering broad leaves, everything streaming',
      'steam lifting after rain, air thick and luminous',
      'river fog drifting between the trunks',
      'clear heavy humid air with dense green depth',
      'shafts of sun breaking through a gap in the dense canopy',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'god-rays piercing through the dense canopy in thick shafts',
      'mist glowing gold over the river',
      'backlit giant leaves glowing translucent green',
      'waterfall spray catching light as a glowing veil',
      'fireflies and insects drifting through the understory',
      'dewdrops beading on broad leaves catching light',
      'dappled jungle-floor light shifting across moss and root',
      'iridescent sheen on wet leaves and vines',
    ],
    SUBJECT_RULE:
      'dense TROPICAL JUNGLE / WETLAND landscape view of the location. Towering canopy, hanging vines, rivers, waterfalls and lush overgrowth rendered immersive and vast. Pure jungle geography + humid atmosphere.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO DESERT, NO snow, NO arid terrain',
      'NO INTERIORS as subject',
      'NO FANTASY glow (no runes, fairy-light), NO SCI-FI',
      'NO IMPOSSIBLE PHYSICS, NO modern infrastructure or explorers',
    ],
  },

  urban_city: {
    TIME: [
      'golden hour — warm light raking across the skyline, glass aflame',
      'blue hour — deep twilight with city lights blinking on',
      'dawn over the city — soft pink light, streets still and empty',
      'neon night — saturated artificial light over dark wet streets',
      'overcast moody — flat grey light, brooding cityscape',
      'dramatic sunset — sky burning between the towers',
    ],
    WEATHER: [
      'crystal-clear sharp air, skyline crisp to the horizon',
      'light rain glossing the streets into mirrors of light',
      'mist drifting between the towers, tops fading into haze',
      'dramatic clouds massing over the skyline',
      'post-rain neon reflections shimmering on wet asphalt',
      'clear crisp city air with long light down the avenues',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'golden-hour light blazing off glass towers',
      'city lights twinkling on across the skyline at blue hour',
      'neon reflections smearing across wet streets',
      'god-rays slicing between skyscrapers',
      'lens flare off a wall of glass',
      'sun flare blasting straight down a street canyon',
      'fog-glow halos around streetlights',
      'light trails of traffic streaking the avenues at dusk',
    ],
    SUBJECT_RULE:
      'iconic CITYSCAPE view of the location. The skyline, streets, bridges or landmark architecture rendered grand, layered and atmospheric. The built city IS the hero — urban geography + light.',
    BANS: [
      'NO PEOPLE as the subject (distant tiny scale only, if any)',
      'NO TROPICAL-jungle or wilderness takeover',
      'NO INTERIORS as subject (this is the city exterior / skyline)',
      'NO FANTASY (no runes, mystical glow), NO overt SCI-FI (no holograms, neon-grid skies) unless the location is explicitly futuristic',
      'NO IMPOSSIBLE PHYSICS (no floating buildings)',
    ],
  },

  interior_intimate: {
    TIME: [
      'warm morning light slanting in through the windows',
      'golden afternoon light pooling across the room',
      'cozy evening lamplight, warm pockets of glow',
      'candle-lit night, soft flickering warmth',
      'soft overcast daylight through the glass, gentle and even',
      'blue-hour outside with warm interior glow within',
    ],
    WEATHER: [
      'still warm interior air, calm and lived-in',
      'rain streaking the windows, cozy and dry within',
      'snow falling softly outside the window, warm inside',
      'soft daylight diffusing through curtains or glass',
      'firelit warmth filling the space',
      'dim lamplit hush, low and intimate',
    ],
    CAMERA: [
      'intimate eye-level interior, warm inviting framing',
      'cozy close perspective, shallow depth of field, soft background',
      'three-quarter interior view layering furnishings into depth',
      'low warm angle catching lamplight and surface texture',
      'window-light side angle, soft falloff into the room',
    ],
    PHENOMENA: [
      'dust motes drifting slowly through a shaft of window light',
      'warm lamplight pooling and glowing on polished surfaces',
      'steam curling up from a cup or kettle',
      'candle flames flickering, casting soft moving light',
      'light through a rain-streaked window dappling the walls',
      'firelight dancing warm across the walls and ceiling',
      'soft bokeh of string lights or fairy lights in the background',
      'reflections glowing on wood, glass, and brass surfaces',
    ],
    SUBJECT_RULE:
      'intimate INTERIOR scene — a cozy, lived-in indoor space (café, parlor, library, cabin interior, study) rendered warm, richly detailed and inviting. Furnishings, textures, and warm light fill the frame. The interior IS the subject, at human/eye-level scale — NOT an aerial vista or outdoor landscape.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO OUTDOOR LANDSCAPE as the subject (a view THROUGH a window is fine; the scene is INSIDE)',
      'NO VAST / MONUMENTAL / aerial scale (this is intimate and human-scaled)',
      'NO open sky or weather as the subject',
      'NO WILD ANIMALS or creatures indoors',
      'NO FANTASY glow, NO SCI-FI, NO IMPOSSIBLE PHYSICS',
    ],
  },

  aquatic_underwater: {
    TIME: [
      'sunlit shallows — bright caustics dancing across the seafloor',
      'deep blue midwater — cool dim light fading into the depths',
      'twilight surface glow filtering down from above',
      'bioluminescent night — darkness lit by living glow',
      'dawn light filtering down in soft shafts',
      'dappled afternoon — shifting light columns through clear water',
    ],
    WEATHER: [
      'clear blue water with sharp caustic light on every surface',
      'marine snow drifting slowly through the water column',
      'gentle current swaying kelp and sea fans',
      'sunbeams piercing the surface in defined shafts',
      'murky green depth with light fading into gloom',
      'streams of bubbles rising through shafts of light',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'caustic light patterns rippling across the seafloor and structures',
      'god-rays piercing down through the water column',
      'bioluminescent glow pulsing from coral and creatures',
      'a school of fish turning and catching the light in unison',
      'bubbles rising and catching light in glowing strings',
      'particulate suspended and glowing in shafts of light',
      'the shimmering silver surface seen from below',
      'distant jellyfish drifting, softly luminous',
    ],
    SUBJECT_RULE:
      'immersive UNDERWATER scene of the location. Submerged reef, sunken city, kelp forest or open-water vista rendered with caustic light, depth and a cool teal-cyan-blue palette. Water and marine geography is the hero.',
    BANS: [
      'NO PEOPLE, NO DIVERS, NO FIGURES',
      'NO DRY-LAND elements, NO warm-amber land palette',
      'NO open sky as subject (the scene is submerged)',
      'NO INTERIORS unless a submerged structure',
      'NO FANTASY glow unless the location is explicitly mythic, NO SCI-FI',
      'NO IMPOSSIBLE PHYSICS',
    ],
  },

  red_rock_canyon: {
    TIME: [
      'dawn — soft rose light first striking the canyon rims',
      'golden hour — warm amber light raking the stratified walls',
      'harsh midday — clear hard sun deep in the canyon, sharp shadows',
      'blue hour — cool violet twilight settling between the walls',
      'dramatic sunset — rims ablaze orange and crimson',
      'desert night — deep indigo sky, sharp stars over the canyon',
    ],
    WEATHER: [
      'crystal-clear sharp air, distant rims razor-crisp',
      'monsoon thunderhead building dramatically over the rim',
      'dust haze softening the canyon depths',
      'post-rain clarity with seasonal waterfalls streaking the walls',
      'dramatic cloud shadows sweeping across the strata',
      'clear cold night air over the silent canyon',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'god-rays piercing down into the canyon depths',
      'warm reflected light bouncing glowing between the red walls',
      'long shadows raking across the sandstone strata',
      'a single shaft of sun striking the distant canyon floor',
      'lens flare from a low sun over the rim',
      'heat shimmer rising off sun-baked rock',
      'the Milky Way arcing over the silhouetted canyon at night',
      'glowing rim-light tracing the edge of a mesa or hoodoo',
    ],
    SUBJECT_RULE:
      'monumental RED-ROCK CANYON landscape — towering stratified sandstone walls, mesas, hoodoos, natural arches and vast canyon depth rendered awe-scaled. Pure red-rock geology + light.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO ocean/sea/lush greenery (a thin river or seasonal waterfall is fine)',
      'NO snow/ice, NO tropical foliage, NO jungle',
      'NO INTERIORS as subject',
      'NO FANTASY (no runes, mystical glow), NO SCI-FI',
      'NO tourists, railings, signage or modern infrastructure',
    ],
  },

  volcanic_geothermal: {
    TIME: [
      'dawn over steaming ground — soft cold light through rising vapor',
      'golden hour raking basalt and geyser fields',
      'overcast diffuse light, even and moody over the lava',
      'blue hour with geothermal pools glowing in the twilight',
      'dramatic storm-break, a shaft of gold over the craters',
      'aurora night over the lava field, sky rippling green',
    ],
    WEATHER: [
      'low cloud and drifting geothermal steam over the terrain',
      'fine drizzle over moss-and-lava fields',
      'crystal-clear crisp sub-arctic air, sharp distance',
      'mist pooling in the valley between craters',
      'a dramatic squall sweeping across the open ground',
      'thick steam rising from vents and fissures',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'a geyser erupting in a tall backlit plume',
      'steam catching low light as glowing drifting veils',
      'god-rays shafting through rising geothermal steam',
      'mineral hot-springs glowing turquoise and ochre',
      'a rainbow forming in the mist of an erupting geyser',
      'aurora rippling over the dark lava field',
      'mirror reflections of sky in a still hot-spring pool',
      'sunlight glinting off black volcanic glass and wet basalt',
    ],
    SUBJECT_RULE:
      'dramatic VOLCANIC / GEOTHERMAL landscape — basalt columns, lava fields, erupting geysers, steaming hot springs, mossy craters and glacial-meets-volcanic terrain rendered vast and otherworldly. Pure geothermal geography + steam atmosphere.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO tropical elements, NO palm trees, NO desert dunes',
      'NO INTERIORS as subject',
      'NO FANTASY or SCI-FI — the otherworldliness is REAL geology, not magic',
      'NO dense jungle, NO modern infrastructure or tourists',
    ],
  },

  fjord_coastal: {
    TIME: [
      'misty dawn over the fjord — soft cool light on the water',
      'golden hour raking the towering cliff walls',
      'overcast diffuse light, deep and still',
      'blue hour over the mirror-still fjord',
      'dramatic storm-break, gold light tearing over the cliffs',
      'low sun catching the snow-capped peaks above the water',
    ],
    WEATHER: [
      'mist drifting between sheer cliff walls',
      'fine drizzle over the deep green water',
      'crystal-clear air with a mirror-still fjord surface',
      'low cloud clinging to the cliff tops',
      'a dramatic squall sweeping down the fjord',
      'fresh snow dusting the peaks above the water',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'mirror reflection of the cliffs doubled in the still fjord',
      'waterfalls streaming in white ribbons down sheer rock walls',
      'god-rays breaking over the cliff rim into the fjord',
      'mist glowing gold where a shaft of sun strikes it',
      'cloud inversion with peaks floating above the fjord',
      'low-sun rim-light tracing the cliff edges',
      'aurora rippling over the dark fjord at night',
    ],
    SUBJECT_RULE:
      'monumental FJORD landscape — sheer cliff walls plunging into deep still water, ribboning waterfalls, snow-capped peaks above, immense vertical scale rendered awe-inspiring. Pure fjord geography + cool atmosphere.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO tropical elements, NO palm trees, NO desert',
      'NO INTERIORS as subject',
      'NO warm-amber tropical palette — this is a cool nordic coast',
      'NO FANTASY or SCI-FI, NO urban skyline',
    ],
  },

  mediterranean_coastal: {
    TIME: [
      'dawn over the caldera — soft rose light on whitewashed walls',
      'golden hour — warm light raking white walls and blue domes',
      'bright clear midday — brilliant sun, deep blue Aegean',
      'blue hour with town lights glittering above the sea',
      'fiery Aegean sunset — sky magenta and tangerine over the water',
      'warm dusk — last gold light on the cliffside town',
    ],
    WEATHER: [
      'crystal-clear bright Aegean air, sharp endless visibility',
      'a few bright sculpted clouds drifting over the sea',
      'a light meltemi breeze rippling the deep-blue water',
      'warm haze softening the distant islands',
      'post-rain sparkling clarity, every surface luminous',
      'a calm mirror-still sea at first light',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'sun glittering on the Aegean in countless bright points',
      'warm light raking whitewashed walls and cobalt domes',
      'long shadows down the cliffside steps and alleys',
      'lens flare off the bright sea',
      'warm glow saturating the caldera at sunset',
      'reflections of white houses in a still harbor',
      'crepuscular rays fanning over the islands',
    ],
    SUBJECT_RULE:
      'iconic MEDITERRANEAN COASTAL view — whitewashed cliffside towns, blue domes, caldera cliffs, the deep-blue Aegean and sun-bleached stone rendered luminous and grand. Sun-drenched but distinctly Mediterranean, NOT tropical.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO tropical palms, NO jungle, NO turquoise-lagoon-with-palms look',
      'NO snow/ice',
      'NO INTERIORS as subject',
      'NO FANTASY or SCI-FI, NO overcast gloom, NO modern industrial',
    ],
  },

  temperate_coastal: {
    TIME: [
      'foggy dawn on the cliffs — soft cool grey-gold light',
      'golden hour raking the headlands and surf',
      'overcast diffuse light, moody and even',
      'blue hour over the Pacific, deep cool tones',
      'dramatic storm-break with sun cutting onto the water',
      'low warm sun glowing through coastal haze',
    ],
    WEATHER: [
      'marine-layer fog rolling over the sea-cliffs',
      'fine drizzle over the headlands, surfaces glistening',
      'crystal-clear crisp coastal air, sharp horizon',
      'a fog bank advancing off the cold sea',
      'dramatic surf pounding under a brooding grey sky',
      'a clearing storm with sun breaking onto the water',
    ],
    CAMERA: SHARED_CAMERA,
    PHENOMENA: [
      'fog glowing where the sun breaks through over the surf',
      'god-rays fanning over crashing waves',
      'backlit spray flung off the breaking surf',
      'long shadows across the headland at low sun',
      'lens flare low over the Pacific',
      'mist clinging and curling around the cliff faces',
      'sun-glitter scattered across the cold swell',
    ],
    SUBJECT_RULE:
      'rugged TEMPERATE COASTAL landscape — towering sea-cliffs, crashing surf, fog-wrapped headlands, arched coastal bridges and wind-bent cypress rendered dramatic and moody-bright. A cool rugged coast, distinctly NOT tropical.',
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO tropical palms, NO calm turquoise lagoon look',
      'NO desert, NO snow',
      'NO INTERIORS as subject',
      'NO FANTASY or SCI-FI, NO city skyline as subject',
    ],
  },

  zen_garden: {
    TIME: [
      'soft misty morning — gentle cool light through the maples',
      'golden afternoon — warm light slanting through maple leaves',
      'overcast diffuse light, soft and even on the moss',
      'blue hour with stone-lantern glow warming the dusk',
      'dappled midday light shifting across raked gravel',
      'quiet dusk with paper-lantern light reflecting on the pond',
    ],
    WEATHER: [
      'soft mist drifting low through the garden',
      'gentle rain beading on moss and maple leaves',
      'still clear air, the pond perfectly calm',
      'light fog hovering over the koi pond',
      'fresh post-rain stillness, everything dripping and luminous',
      'drifting maple or cherry leaves carried on a faint breeze',
    ],
    CAMERA: [
      'intimate eye-level view composing the garden into balanced depth',
      'low angle across the raked gravel toward the pond and maples',
      'three-quarter view layering bridge, lantern and pond into depth',
      'soft-focus close perspective on a corner vignette of the garden',
      "gentle elevated view framing the garden's composed geometry",
    ],
    PHENOMENA: [
      'dappled light scattering through maple leaves onto moss',
      'reflections of maples and a stone lantern in the still koi pond',
      'mist glowing softly in a shaft of morning light',
      'dewdrops on moss and stone catching tiny points of light',
      'backlit translucent maple leaves glowing red and gold',
      'a stone or paper lantern glowing warm at dusk',
      'concentric ripples spreading slowly across the pond',
    ],
    SUBJECT_RULE:
      "intimate JAPANESE GARDEN scene — manicured maples, cushioned moss, raked gravel, stone lanterns, arched bridges and koi ponds rendered serene, balanced and richly detailed at human / eye-level scale. The garden's composed tranquility is the subject — NOT a wild towering forest.",
    BANS: [
      'NO PEOPLE, NO FIGURES, NO CHARACTERS',
      'NO wild towering forest or dense jungle',
      'NO desert, NO snow-takeover',
      'NO vast / aerial / monumental scale — this is intimate and garden-scaled',
      'NO INTERIORS as the subject, NO FANTASY glow, NO modern elements',
    ],
  },
};

/**
 * Normalize a location card's tag array to a flat set of bare tag tokens.
 * The card table mixes two schemes: bare (`desert`, `interior`) and prefixed
 * (`biome:desert`, `mood:cozy`, `theme:epic`). Strip the prefix so downstream
 * biome resolution + coherence filters see one canonical vocabulary.
 */
export function normalizeTags(tags: string[] | null | undefined): Set<string> {
  const out = new Set<string>();
  for (const raw of tags ?? []) {
    if (typeof raw !== 'string') continue;
    const t = raw.includes(':') ? raw.slice(raw.indexOf(':') + 1) : raw;
    const clean = t.trim().toLowerCase();
    if (clean) out.add(clean);
  }
  return out;
}

/**
 * Resolve a coherent biome from a location card's tags. Priority order is
 * most-identity-defining first (a fantasy place is fantasy even if it's also
 * a forest; an interior café is interior even though it's also urban). This
 * is the runtime fallback when location_cards.biome is null AND the seed of
 * the backfill mapping — the backfill applies overrides for the handful of
 * locations the heuristic gets wrong (e.g. iconic monuments → ancient_ruins).
 * Returns null when nothing matches (caller logs + uses a neutral default).
 */
export function resolveBiomeFromTags(tags: string[] | null | undefined): string | null {
  const t = normalizeTags(tags);
  const has = (x: string) => t.has(x);

  if (has('space') || has('cyberpunk')) return 'scifi_cosmic';
  if (has('underwater') || has('aquatic')) return 'aquatic_underwater';
  if (has('gothic')) return 'gothic_historic';
  if (has('fantasy') || has('surreal')) return 'fantasy_imagined';
  if (has('ruins') || has('ancient')) return 'ancient_ruins';
  // Cozy/small interiors — AFTER the strong-identity biomes (a cathedral or
  // colosseum interior is caught by gothic above; an epic interior is not
  // "intimate"). Plain interior + not-epic → cozy indoor scene.
  if (has('interior') && !has('epic')) return 'interior_intimate';
  // Outdoor natural biomes. desert beats mountain (arid canyons tag both);
  // mountain beats snow (snowy ranges are alpine, not polar).
  if (has('desert')) return 'desert_arid';
  if (has('mountain')) return 'alpine_mountain';
  if (has('snow')) return 'arctic_polar';
  if (has('tropical') && (has('forest') || has('jungle'))) return 'wetland_jungle';
  if (has('jungle')) return 'wetland_jungle';
  if (has('tropical') || has('coastal')) return 'tropical_coastal';
  if (has('forest')) return 'temperate_forest';
  if (has('urban')) return 'urban_city';
  if (has('savanna') || has('grassland')) return 'grassland_savanna';
  if (has('nature')) return 'temperate_forest';
  return null;
}

/**
 * Look up the biome config. Resolution order (caller is responsible for
 * passing the location's stored biome OR a tag-resolved one):
 *   1. exact biome key match
 *   2. neutral fallback (tropical_coastal) — should be rare now that
 *      resolveBiomeFromTags() covers unmapped locations at runtime; a hit
 *      here means a genuinely untagged/unknown location worth logging.
 */
export function getBiomeConfig(biomeKey: string | null | undefined): BiomeConfig {
  if (biomeKey && BIOME_AXES[biomeKey]) return BIOME_AXES[biomeKey];
  return BIOME_AXES.tropical_coastal;
}

/**
 * The ONE biome system, base + override (the bot path-override→default pattern):
 *   resolved = isValidBiomeConfig(card.biome_config)  // per-location override
 *           ?  card.biome_config
 *           :  getBiomeConfig(card.biome)             // shared class base
 * Every location card has a `biome` CLASS (the base + the tag-filter key) and
 * almost always a per-location `biome_config` (the override). This validates an
 * override's shape before use — extra fields (e.g. WARDROBE) pass through; only
 * the required BiomeConfig axes must be present. A malformed override falls back
 * to the shared class config rather than crashing the render.
 */
export function isValidBiomeConfig(cfg: unknown): cfg is BiomeConfig {
  if (!cfg || typeof cfg !== 'object') return false;
  const c = cfg as Record<string, unknown>;
  return (
    Array.isArray(c.TIME) &&
    Array.isArray(c.WEATHER) &&
    Array.isArray(c.CAMERA) &&
    Array.isArray(c.PHENOMENA) &&
    Array.isArray(c.BANS) &&
    typeof c.SUBJECT_RULE === 'string'
  );
}

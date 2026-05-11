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
};

/** Look up the biome config, fall back to tropical_coastal if unknown. */
export function getBiomeConfig(biomeKey: string | null | undefined): BiomeConfig {
  if (biomeKey && BIOME_AXES[biomeKey]) return BIOME_AXES[biomeKey];
  return BIOME_AXES.tropical_coastal;
}

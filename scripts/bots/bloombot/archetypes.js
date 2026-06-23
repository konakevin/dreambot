/**
 * bloombot archetypes — path-bespoke archetype definitions.
 *
 * Each archetype declares which axis slots the path requires + how many
 * to pick per slot. The composer reads this and assembles a brief per
 * the corresponding archetype template in ./archetype-templates.js.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new archetype: add an entry here + the matching template
 * function in ./archetype-templates.js + reference it from one of the
 * bot's path files via { archetype: 'YOUR_NAME', pools: {...} }.
 */

module.exports = {
  BLOOMBOT_GIANT_FLOWER: {
    description:
      'PATH-BESPOKE — BloomBot jack-and-the-giant-flower path (2026-06-18, replaced flower-tunnels). A "Jack and the Beanstalk" NOD (no Jack, no human): an awe-struck UPWARD worm\'s-eye view of a SINGLE COLOSSAL flower growing impossibly tall, climbing into the open sky and dwarfing a lush normal-scale world at its base. The giant IS the flowerEngine roster HERO species at monumental scale (rotates across species + matches the rolled palette). Fixes the old directionless 360° flower-tunnel/kaleidoscope, which had no hero and color-collapsed. 3 path-bespoke pools (giant_form / base_surround / sky_ascent) + universal lighting.',
    slots: {
      universal: ['lighting'],
      bot: [],
      path: ['giant_form', 'base_surround', 'sky_ascent'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_HANGING_FLOWERS: {
    description:
      'PATH-BESPOKE — BloomBot hanging-flowers path (2026-06-22 NEW). A SCENIC WALKWAY beneath an OVERHEAD CANOPY of HANGING FLOWERS — cascading wisteria curtains, suspended flower-basket chandeliers, hanging bloom-orbs + floral pendant lanterns strung above a path that recedes into atmospheric depth, with lush "alive" flower accents lining the way. Reference: the Kevin-hearted wisteria-over-train-tracks render (a dreamy tunnel of hanging blooms overhead, flowers spilling along the path, soft misty light at the end). The walkway SETTING is the big variety axis (parks / towns / train stations + tracks / gardens / courtyards / canals / cloisters / more); the suspended hanging pieces are the signature hero. 3 path-bespoke axes (setting / hanging_pieces / walkway_accent) + 55%-gated atmospheric_phenomenon. Palette + lighting + roster via sharedDNA.',
    slots: {
      universal: [],
      bot: [],
      path: ['setting', 'hanging_pieces', 'walkway_accent'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.55 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_FLOWER_FRIENDS: {
    description:
      'PATH-BESPOKE — BloomBot flower-friends path (2026-05-19 NEW). CLOSE-UP FLOWER + PLEASANT POLLINATOR pairing renders — beautiful butterfly / bumblebee / dragonfly / ladybug / firefly / moth co-hero with a hero bloom in a soft magical close-up scene with bouquet-cluster foreground + dreamy bokeh background + optional pollen-dust / fairy-light particles. All flower colors welcome. 3 path-bespoke pools (flower_focal_cluster / hero_pollinator / magical_particles-40%-gated) + universal lighting. Inspired by 6 user-hearted IG cozy-insect-on-flower references.',
    slots: { universal: ['lighting'], bot: [], path: ['flower_focal_cluster', 'hero_pollinator'] },
    pickN: {},
    conditionalLayer: { slot: 'magical_particles', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_FLOWER_HUMMING_BIRDS: {
    description:
      'PATH-BESPOKE — BloomBot flower-humming-birds path (2026-05-19 NEW). VIBRANT enchanted-garden scenes with 2-4+ iridescent hummingbirds + 3-5+ hummingbird-attracting flowers (trumpet vine, fuchsia, salvia, hibiscus, bee balm, columbine, butterfly bush, cardinal flower, lupine, foxglove, petunia). NO soft-pastel restriction — vibrant saturated jewel-tone register. Hummingbirds rendered with iridescent jewel-tone plumage, wings in motion-blur, dynamic poses (hovering / sipping / mid-flight). 3 path-bespoke pools (flower_focal_cluster / hummingbird_cast / magical_particles-40%-gated) + universal lighting. Sister path to flower-friends.',
    slots: { universal: ['lighting'], bot: [], path: ['flower_focal_cluster', 'hummingbird_cast'] },
    pickN: {},
    conditionalLayer: { slot: 'magical_particles', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_FLOWER_FANTASY: {
    description:
      'PATH-BESPOKE — BloomBot flower-fantasy path (2026-05-19 NEW). SURREAL SCALE-INVERSION FLOWER SCENES — natural-world landscapes (forests, valleys, riverbeds, hills, mountainsides, glades) where natural elements are CONSTRUCTED FROM FLOWERS or scale is wildly inverted: giant flower-mushroom in a meadow, forest where every tree is an oversized overgrown flower, river of petals flowing through a glade, pine-trees-that-are-flowers, hillside of tulip-mountains. NO animals / NO humans / NO manmade objects — naturalistic landscape forms reimagined through flowers + unexpected scale. Surreal-magical-realism register. Inspired by Kevin-hearted bloombot post (giant pink flower-mushroom in misty meadow). 3 path-bespoke pools (scale_form / floor_carpet / atmospheric_magic-40%-gated) + universal lighting.',
    slots: { universal: ['lighting'], bot: [], path: ['scale_form', 'floor_carpet'] },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_magic', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_FLOWER_GROVE: {
    description:
      'PATH-BESPOKE — BloomBot flower-grove path (2026-05-27 NEW). The FUN / CRAZY path: Lorax-Truffula-style FLUFFY POM-POM FLOWER-TREE GROVES + house-sized oversized single blooms + wildly weird gravity-defying scenarios, ENTIRELY of flowers. Slender trunks crowned with giant round fluffy bloom-canopies, soft tufted whimsical rolling hills — flower-fantasy blown up further. FORM is Seuss-fluffy; COLOR comes from the flower-engine theme (real saturated flower colors — NO candy). NO animals / humans / manmade objects. 2 path pools (grove / ground) + whimsy conditional (70%-gated) + universal lighting.',
    slots: { universal: ['lighting'], bot: [], path: ['grove', 'ground'] },
    pickN: {},
    conditionalLayer: { slot: 'whimsy', gate: 0.9 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_TROPICAL_GROVE: {
    description:
      'PATH-BESPOKE — BloomBot tropical-grove path (2026-05-27 NEW). The Hawaiian/tropical FUN/CRAZY cousin of flower-grove: a Dr-Seuss-meets-Hawaii jungle wonderland of GIANT oversized tropical flowers (hibiscus / bird-of-paradise / heliconia / plumeria / orchid scaled enormous as flower-trees + tree-sized mega-blooms), framed by lush green monstera/palm/fern foliage, set in volcanic / jungle / lagoon / waterfall / beach paradise (NOT temperate fields). Gravity-defying Hawaiian Dr-Seuss whimsy. Uses the flower engine at biome=tropical (real tropical species + hot palettes). NO humans / animals. 4 path pools (canopy / setting / foliage / atmosphere) + whimsy conditional (85%-gated) + universal lighting.',
    slots: {
      universal: ['lighting'],
      bot: [],
      path: ['canopy', 'setting', 'foliage', 'atmosphere'],
    },
    pickN: {},
    conditionalLayer: { slot: 'whimsy', gate: 0.85 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_FLOWER_ARRANGEMENT: {
    description:
      'PATH-BESPOKE — BloomBot flower-arrangement path (2026-05-27 NEW). An ORNATE, lavishly-designed flower arrangement in a vessel (classical urn / cut-crystal vase / terracotta planter / woven basket / hand-tied bouquet) as the focal HERO, set in a LUSH flower-garden backdrop bursting with blooms everywhere — placed on a table, the ground, or nestled in the garden. Museum still-life (Dutch Golden-Age van Huysum/Bosschaert) meets high-end editorial florist couture. Can dial up the same wild "pop" as flower-grove via the whimsy layer, but channeled INTO a beautiful arrangement. FORM/STYLE from pools; COLOR + species from the flower-engine theme. NO humans / animals (vessel + garden furniture OK). 3 path pools (vessel / style / setting) + whimsy conditional (50%-gated) + universal lighting.',
    slots: { universal: ['lighting'], bot: [], path: ['vessel', 'style', 'setting'] },
    pickN: {},
    conditionalLayer: { slot: 'whimsy', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_DESERT_BLOOM: {
    description:
      'PATH-BESPOKE — BloomBot desert-bloom path (2026-05-19 NEW). SOUTHWEST DESERT LANDSCAPES juxtaposed with an EXPLOSION OF WILDFLOWERS — saguaro corridors, joshua-tree groves, agave fields, red-rock canyons, mesa silhouettes, sand dunes — paired with a vivid carpet of desert wildflowers exploding around / between / through the desert elements. Vivid saturated SOUTHWEST register (NOT soft-pastel). Inspired by Kevin-hearted bloombot post — saguaro corridor with vivid red/coral wildflower carpet. 3 path-bespoke pools (desert_anchor / bloom_explosion / atmospheric_magic-40%-gated) + universal lighting.',
    slots: { universal: ['lighting'], bot: [], path: ['desert_anchor', 'bloom_explosion'] },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_magic', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_SUNSET_FLOWERS: {
    description:
      'PATH-BESPOKE — BloomBot sunset-flowers path (2026-05-19 NEW). SUN-BACKLIT-FLOWER renders where the visible sun is the light source and foreground flowers are strongly backlit / rim-lit — petal edges blazing in warm sun-rim-light against a soft pretty golden-hour sky over a wide gorgeous landscape. Naturalistic photography register (hibiscus / cosmos / cherry-blossom / dandelion / azalea / wisteria / tulip against mountains / hills / lakes / forests / coast). 4 path-bespoke pools (hero_flower / landscape_backdrop / sunset_sky / sun_position) + universal lighting + 40%-gated atmospheric_phenomenon. Inspired by 7 user-hearted IG bloom-against-sunset renders.',
    slots: {
      universal: ['lighting'],
      bot: [],
      path: ['hero_flower', 'landscape_backdrop', 'sunset_sky', 'sun_position'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_LANDSCAPE: {
    description:
      'PATH-BESPOKE — BloomBot landscape path. NOT IN USE (2026-05-16 migration attempted + REVERTED; legacy compose.js outperforms). Archetype + template + pools preserved for reference / future re-attempt. See memory file project_bloombot_landscape_kept_legacy.md for the over-stuffed-brief diagnosis.',
    slots: {
      universal: [],
      bot: [],
      path: ['landform', 'scale_prover', 'surprise_element', 'sky'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_CLOSEUP: {
    description:
      'PATH-BESPOKE — BloomBot closeup path (2026-05-16 migration). MACRO VIEW pressing into a dense bloom wall in its NATURAL OUTDOOR ENVIRONMENT. HERO BLOOM AMONGST MANY composition mandate (heart-DNA from 2026-05-16 cf57b7eb): one specific hero species dominates the foreground at its OWN natural silhouette and scale — broad face / deep cup / pompom / hanging raceme / umbel / trumpet / spike depending on rolled species, NOT defaulting to tall spires. Supported by 2-3 species carpeting the crevices and threading the gaps. Dramatic single-source lighting hierarchy — warm hero / cool background. Material poetry at petal-scale. 8 poster-grade composition modes (low-angle / overhead-canopy / through-archway / diagonal lead-line / rim-light silhouette / shallow-depth tunnel / off-center hero / dappled light-drama) — vary across them. Anti-bouquet / anti-still-life front-loaded. 2 path-bespoke axes (bloom_wall_type / growing_context) + 60%-gated macro_phenomenon. Palette + lighting + regional flora roster via sharedDNA. 85-115 words.',
    slots: { universal: [], bot: [], path: ['bloom_wall_type', 'growing_context'] },
    pickN: {},
    conditionalLayer: { slot: 'macro_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_TROPICAL_PARADISE: {
    description:
      'PATH-BESPOKE — BloomBot tropical-paradise path (2026-05-16 migration). DENSE TROPICAL JUNGLE FLORAL SCENE. Region locked to "tropical" via BloomBot.rollSharedDNA. Wide cinematic shot showing depth + humid atmospheric perspective. MASSIVE showy tropical flowers (torch ginger / heliconia / plumeria / jade vine / cattleya orchid / bird-of-paradise) at jungle scale. Identifiably tropical vegetation scaffolding (palms / banana / banyan / philodendron / fern). 3 path-bespoke axes (tropical_setting / vegetation_anchor / surprise_creature 60%-gated). Palette + lighting + tropical roster via sharedDNA. 85-115 words.',
    slots: { universal: [], bot: [], path: ['tropical_setting', 'vegetation_anchor'] },
    pickN: {},
    conditionalLayer: { slot: 'surprise_creature', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_COZY: {
    description:
      'PATH-BESPOKE — BloomBot cozy path (2026-05-16 migration). COZY INTERIOR OVERGROWN BY FLOWERS. Warm humble domestic space — sunroom / breakfast nook / writing desk / arched window / attic dormer / stairwell landing — NEVER palace / ballroom / grand interior. The architecture is the scaffold the bloom-mass cascades through and over. HERO bloom species at the foreground focal plane + supporting cast carpeting / threading / draping the furniture. Dramatic single-source warm light through the window catches the hero blooms; supporting mass and the room beyond sit cooler. POSTCARD / MOVIE-STILL / GALLERY-PIECE framing mandate. 2 path-bespoke axes (interior_setting / furniture_anchor) + 60%-gated atmospheric_moment. Palette + lighting + roster via sharedDNA. 85-115 words.',
    slots: { universal: [], bot: [], path: ['interior_setting', 'furniture_anchor'] },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_moment', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_DREAMSCAPE: {
    description:
      'PATH-BESPOKE — BloomBot dreamscape path (2026-05-16 migration). SURREAL FLORAL DREAMSCAPE — physically impossible composition rendered with HYPERREAL/PHOTOREAL precision. Real earth-bound species (NOT alien flowers); the impossibility is in the LAYOUT (gravity-flipped / floating / mirror-world / Magritte-window / container-world / spiral-staircase / suspended-constellation). Magritte / Dali / Beksinski / Storm Thorgerson album-cover lineage. 3 path-bespoke axes (impossibility_type / world_element / atmospheric_halo 60%-gated). Palette + lighting + roster via sharedDNA.',
    slots: { universal: [], bot: [], path: ['impossibility_type', 'world_element'] },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_halo', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_GARDEN_WALK: {
    description:
      'PATH-BESPOKE — BloomBot garden-walk path (2026-05-16 migration). WALKABLE FLORAL PASSAGE inviting the viewer in. SYMMETRIC PORTRAIT composition mandate (archway centered, path leading dead-center, frame divided into foreground bloom-mass on each side + glowing depth-of-field at the path far end). 3 path-bespoke axes (archway_type / path_material / destination_glimpse) + 60%-gated atmospheric_phenomenon. Palette + lighting + roster via sharedDNA.',
    slots: {
      universal: [],
      bot: [],
      path: ['archway_type', 'path_material', 'destination_glimpse'],
    },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_CONSERVATORY: {
    description:
      'PATH-BESPOKE — BloomBot conservatory path (2026-05-16 migration). VICTORIAN GLASS-AND-IRON CONSERVATORY interior fully OVERGROWN. NON-NEGOTIABLE Victorian glass-dome + wrought-iron framework architecture. Half-architectural / half-jungle. Wide-angle interior shot with volumetric god-rays through the glass. 3 path-bespoke axes (conservatory_type / structural_anchor / atmospheric_phenomenon 60%-gated). Palette + lighting + roster via sharedDNA.',
    slots: { universal: [], bot: [], path: ['conservatory_type', 'structural_anchor'] },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_CITY_FLOWERS: {
    description:
      'PATH-BESPOKE — BloomBot city-flowers path (2026-05-16 migration). URBAN ARCHITECTURE HALF-CONSUMED BY FLOWERS. Wide street-photography composition with pedestrian-level POV + leading-lines into city depth. Architecture is the STRUCTURAL HERO; blooms are DISTRIBUTED MASS across balconies / window-boxes / iron grilles / staircases. 3 path-bespoke axes (city_setting / architectural_detail / atmospheric_phenomenon 60%-gated).',
    slots: { universal: [], bot: [], path: ['city_setting', 'architectural_detail'] },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  BLOOMBOT_RECLAIM: {
    description:
      'PATH-BESPOKE — BloomBot reclaim path (2026-05-17 migration). ABANDONED HUMAN STRUCTURES reclaimed by flowers. Awe + melancholy + triumphant-nature mood (NEVER horror). Wide cinematic composition with sun-shafts through broken architecture. Architecture is the STRUCTURAL HERO (in deep disrepair but RECOGNIZABLE); blooms are DISTRIBUTED MASS consuming every column, fallen stone, broken arch, cracked masonry. 3 path-bespoke axes (ruin_type / decay_anchor / atmospheric_phenomenon 60%-gated).',
    slots: { universal: [], bot: [], path: ['ruin_type', 'decay_anchor'] },
    pickN: {},
    conditionalLayer: { slot: 'atmospheric_phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },
};

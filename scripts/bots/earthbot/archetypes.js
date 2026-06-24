/**
 * earthbot archetypes — path-bespoke archetype definitions.
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
  EARTHBOT_EPIC_VISTA: {
    description:
      'PATH-BESPOKE — EarthBot epic-vista (2026-05-20 axis-system migration). Nat-Geo-best-of-best caliber real-Earth landscape: the SUBJECT IS THE WOW. Larger than life via geology + lighting + weather amplification, never AI-fake / sci-fi / fantasy. R2 (2026-05-20) pivoted from R1 3-tier (subject + foreground prop) to SCENE-AS-HERO — subject dominates 60-70%+ of frame, no competing foreground props. R1 lessons retained: PEAK LIGHT MOMENT + MOMENT IN MOTION template blocks, phenomenon-lighting compatibility, biome-tagged subject pool. 6 axes: 5 always-on path-bespoke (subject, lighting, atmosphere, hero_feature, sky_layer) + 1 conditional 30%-gated phenomenon. R1 foreground_anchor axis + matchTagsFromSlot composer extension preserved as infrastructure for future paths that need them. NO sci-fi, NO fantasy, NO bioluminescence, NO multi-moons, NO galaxies-above-sunset, NO humans, NO floating-islands.',
    slots: {
      universal: [],
      bot: [],
      path: ['subject', 'lighting', 'atmosphere', 'hero_feature', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_FOREST_INTERIOR: {
    description:
      'PATH-BESPOKE — EarthBot forest/jungle INTERIOR (2026-06-18). Shared by deep-forest + lush-jungle. Fixes the "everything is a wide-vista national-park postcard" drift: those two paths previously reused EARTHBOT_EPIC_VISTA (wide-angle aerial-overlook template + EPIC_VISTA wide-vista lighting/sky pools), so a forest CATHEDRAL INTERIOR rendered as a sweeping overlook. This archetype keeps EarthBot\'s guardrails (no humans, no built features, no sci-fi, true-to-life photography, moment-in-motion) but frames INSIDE the forest — looking up the trunks / into the understory / down a corridor between trees, intimate-to-mid scale, dappled canopy light + mist between trunks, NO sky-as-hero, NO distant-overlook scale-prover. Subject pool stays bespoke per path (temperate vs tropical). 4 axes: 3 always-on shared (interior lighting / interior atmosphere / understory-canopy detail) + 1 conditional 30%-gated interior phenomenon.',
    slots: {
      universal: [],
      bot: [],
      path: ['subject', 'lighting', 'atmosphere', 'understory'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_HAWAII_FLOWERS: {
    description:
      'PATH-BESPOKE — EarthBot hawaii-flowers (2026-05-21 R3 architecture). Hawaiian/tropical-paradise coast with TROPICAL FLOWERS as visible co-star. Different from EARTHBOT_EPIC_VISTA in that flowers are a SEPARATE always-on axis (HAWAII_FLOWERS_ARRANGEMENTS — 200-entry production pool reused from legacy beach/tropical_flower_arrangements). Subject pool is ground-level beach-only (no flower content). Template explicitly composes flowers as TASTEFULLY SPRINKLED through the scene (R6/R7 iterations: not foreground-wall, not invisible, distributed positions). 7 axes: 6 always-on (subject + flowers + lighting + atmosphere + hero_feature + sky_layer) + 1 conditional 30%-gated phenomenon.',
    slots: {
      universal: [],
      bot: [],
      path: ['subject', 'flowers', 'lighting', 'atmosphere', 'hero_feature', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_REEF_PARADISE: {
    description:
      'PATH-BESPOKE — EarthBot reef-paradise (2026-05-21 R2 PIVOT — name kept but content retargeted from underwater-coral to ISLAND-BAY). Kevin hearted a half-and-half waterline shot of a dramatic island bay and confirmed the coral identity was dead. New identity: PRETTY ISLAND-BAY / COASTAL VIEW with crystal-turquoise water + dramatic shoreline + sun-burst sky. Half-and-half waterline shots dominate compositional mode (~50%), with pure above-water bay views (~35%) and underwater-looking-up at shore silhouettes (~15%). NO coral cathedrals, NO fish density, NO reef-interior swim-throughs. 5 always-on path-bespoke axes (bay_setting, shoreline_drama, water_quality, sky_drama, composition) + 1 conditional 30%-gated foreground_element. Generic morphological descriptions ONLY across all pools — NO named places anywhere (LESSON 7).',
    slots: {
      universal: [],
      bot: [],
      path: ['bay_setting', 'shoreline_drama', 'water_quality', 'sky_drama', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'foreground_element', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_GEOLOGICAL_WONDER: {
    description:
      'PATH-BESPOKE — EarthBot geological-wonder (2026-05-21 axis-system migration). Earths raw geological architecture as art — covers BOTH scales: intimate cave interiors (crystal caves / amethyst geodes / lava tubes / ice caves / slot canyons) AND epic outdoor vistas (hoodoos / salt flats / basalt cliffs / sandstone waves / travertine terraces / fresh lava flows). 6 path-bespoke axes — 5 always-on (subject, lighting, atmosphere, mineral_color, focal_anchor) + 1 conditional 30%-gated phenomenon (aurora through skylight / rainbow over salt flat / snow dust on hoodoos / eruption plume backlight). All pools bespoke because EPIC_VISTA pools are outdoor-only and cannot handle cave-interior lighting/atmosphere. The subject pool is scale-tagged (intimate / epic) so the template knows which compositional register to use. NO sci-fi, NO fantasy bioluminescence beyond real species (fungi / minerals are real), NO humans, NO floating-anything.',
    slots: {
      universal: [],
      bot: [],
      path: ['subject', 'lighting', 'atmosphere', 'mineral_color', 'focal_anchor'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_SACRED_LIGHT: {
    description:
      'PATH-BESPOKE — EarthBot sacred-light (2026-05-21 axis-system migration). Transcendent natural-light moments in nature — the LIGHT itself is the hero, not the landscape. Mid/tight framing (not wide panorama like epic-vista). Dawn first-light burning a single ridge while valleys remain in cool shadow, raking shafts plural through old-growth canopy, alpenglow on a snow-capped peak, storm-break spotlight across a meadow, crepuscular rays through cypress over a misty lake, sun-halo over a winter forest. 6 path-bespoke axes — 5 always-on (subject, lighting, atmosphere, hero_feature, sky_layer) + 1 conditional 30%-gated phenomenon. Bespoke pools: subject + lighting (sacred-light register). Reused pools: atmosphere + hero_feature + sky_layer + phenomenon from EPIC_VISTA. NO sci-fi (no bioluminescent / phosphorescent / glowing-magic), NO architecture / ruins / cathedrals / chapels (transcendent natural-only — Flux pigeonholes on man-made structures), NO single beam / single shaft (Flux laser-beam trigger — use shafts plural / broad spotlight instead), NO humans, NO floating-anything.',
    slots: {
      universal: [],
      bot: [],
      path: ['subject', 'lighting', 'atmosphere', 'hero_feature', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_BEACH_NIGHT: {
    description:
      'PATH-BESPOKE — EarthBot beach-night (2026-05-21 axis-system migration). Magical tropical beach scenes at night. NATURAL light sources ONLY (moonlight, starlight, Milky Way) — NEVER tiki torches, lanterns, paper lights, lighthouse beams, bonfires (legacy had these; they trigger humans + man-made bias). NEVER bioluminescent waves (Flux sci-fi trigger). The light source is the HERO; reflective tropical water + palm silhouettes + warm tropical mood support it. 6 path-bespoke axes — 5 always-on (subject, light_source, night_sky, water_state, shoreline_element) + 1 conditional 30%-gated phenomenon (shooting star / moonbow / distant lightning over horizon / passing meteor). NO humans, NO sci-fi / fantasy, NO human-built objects, NO architecture.',
    slots: {
      universal: [],
      bot: [],
      path: ['subject', 'light_source', 'night_sky', 'water_state', 'shoreline_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_NIGHT_LANDSCAPES: {
    description:
      'PATH-BESPOKE — EarthBot night-landscapes (2026-06-24). A pretty, detailed, VISIBLE real-Earth landscape (the HERO, filling the lower ~60%) beneath a beautiful night sky (the backdrop). The land is clearly lit + detailed — NEVER a flat black silhouette (that was the old throwaway "sky sovereign, land silent" minimalism). The night sky rotates across the full variety: bright moonlight, the Milky Way spiraling, bright starry nights, shades of twilight, a-few-faint-stars, aurora over cold land. Natural light ONLY (moon / starlight / Milky Way / aurora-glow / twilight) — the light always REVEALS the landscape. Clean true-to-life nightscape astrophotography — NEVER neon / hyperreal / fantasy galaxy. 3 always-on axes (landscape, night_sky [carries the variety + lights the land], sky_air) + 1 conditional 30%-gated celestial_accent (meteor / planet / zodiacal light). NO humans, NO human-built features, NO sci-fi.',
    slots: {
      universal: [],
      bot: [],
      path: ['landscape', 'night_sky', 'sky_air'],
    },
    pickN: {},
    conditionalLayer: { slot: 'celestial_accent', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_WAVES: {
    description:
      'PATH-BESPOKE — EarthBot waves (2026-05-22 axis-system migration). MERGES legacy wave + big-wave paths. Ocean wave drama at surf-magazine caliber. FOUR framing modes driven by composition axis: (1) side-view-of-barrel Clark-Little, (2) pulled-out wide showing wave + following sets in deep ocean, (3) inside-barrel POV looking out from inside the tube, (4) panned-out with tropical-island landscape behind. 7 path-bespoke axes — 6 always-on (wave_subject, composition, coastal_context, water_color, sky_layer, light_condition) + 1 conditional 30%-gated phenomenon (rainbow / spray-prism / sun-pillar / crepuscular ray). NO surfers / humans (the wave is the subject, no one rides it), NO sci-fi / bioluminescent / fantasy tubes, NO architecture / piers / lighthouses, NO named places (no "Pipeline" / "Teahupo‘o" / "Jaws Maui" — describe morphologically), NO single-shaft / single-beam (laser trigger), NO impossible-physics flat-sand walls.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'wave_subject',
        'composition',
        'coastal_context',
        'water_color',
        'sky_layer',
        'light_condition',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_SEASONAL_SHIFT: {
    description:
      'PATH-BESPOKE — EarthBot seasonal-shift (2026-05-22 R2 — multi-axis rich rendering). Dramatic seasonal landscape scenes — autumn fire (mixed multi-color forests, NOT mono-toned), first snow (winter peaks + frozen lakes), cherry blossom storms + wildflower superblooms (spring), golden summer meadows. THE SEASON IS THE SUBJECT and multi-color richness is mandatory. 9 path-bespoke axes — 8 always-on + 1 conditional 30%-gated phenomenon. Order matters: subject rolls FIRST (sets season tag), then color_palette + depth_layers + seasonal_motion all roll with matchTagsFromSlot=subject so all season-tagged content stays coherent. Bespoke: subject + color_palette + depth_layers + seasonal_motion (all season-tagged). Reused: EPIC_VISTA lighting / atmosphere / hero_feature / sky_layer / phenomenon. NO named places, NO bioluminescent (legacy trigger), NO sci-fi / fantasy, NO architecture, NO humans.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject',
        'color_palette',
        'depth_layers',
        'seasonal_motion',
        'lighting',
        'atmosphere',
        'hero_feature',
        'sky_layer',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 7 region-bespoke EarthBot paths (2026-05-23 — coverage expansion).
  // All raw-Earth + no-civilization + earth-and-reality-coded phenomena
  // (NO aurora drift outside iceland-raw, NO bioluminescent, NO sun-dogs,
  // NO nacreous, NO fire-rainbow). Scaffolded together; built-out one at
  // a time. Activated in EARTH_PATHS per-path as pools fill.
  // ═══════════════════════════════════════════════════════════════════════

  EARTHBOT_DESERT_SOUTHWEST: {
    description:
      "PATH-BESPOKE — EarthBot desert-southwest (2026-05-23 R2). American SW + Sonoran + Mojave + Joshua tree + salt flats. Iconic raw geology AND iconic raw flora — Monument Valley sandstone towers, Antelope Canyon slot beams, Bryce hoodoos, Zion narrows, Arches, Sedona red rock, Saguaro National Park forests, Joshua Tree forests, Badwater salt flats. Warm-terracotta on cobalt. R2 adds surprise_element axis (always-on) injecting one extra scene-richening element (blooming saguaro crown, dramatic sunset banner, ocotillo in bloom, distant balanced rock, cottonwood snag silhouette, etc.) so frames don't feel sparse. NO humans, NO architecture, NO petroglyphs (cultural). Phenomena strictly real Earth (monsoon lightning, virga, dust devils, alpenglow, sun pillars, fog inversions). 8 path-bespoke axes — 7 always-on + 1 conditional 25%-gated phenomenon.",
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject',
        'foreground_anchor',
        'surprise_element',
        'light_condition',
        'atmosphere',
        'sky_layer',
        'scale_prover',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.25 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_AFRICAN_LANDSCAPE: {
    description:
      'PATH-BESPOKE — EarthBot african-landscape (2026-06-01 v2 after v1 scrap). Full breadth of African raw nature — savanna grasslands (Serengeti / Maasai Mara / Etosha / Makgadikgadi / Tarangire / Tsavo), Congo Basin rainforest (canopy from above / river floor / understory), Okavango Delta (water channels / papyrus / lily pads), Sahara dunes, Namib coastal red dunes + Deadvlei, Madagascar baobab forest + spiny forest, Cape fynbos coastal scrub, riverine wetlands (Zambezi flats / Nile flats / Lake Turkana shore), pan-African wildlife scale-provers (elephant / zebra / giraffe / lion / wildebeest / chimp / gorilla / lemur / flamingo / hippo). NO humans, NO vehicles, NO buildings, NO village huts. Phenomena strictly real Earth (dust storm, virga, distant thunderstorm, mirage shimmer, grass-burn smoke). 7 path-bespoke axes — 6 always-on + 1 conditional 25%-gated phenomenon.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject',
        'foreground_anchor',
        'light_condition',
        'atmosphere',
        'sky_layer',
        'scale_prover',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.25 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_ASIA_LANDSCAPE: {
    description:
      'PATH-BESPOKE — EarthBot asia-landscape (2026-05-23 scaffold). Pan-Asian raw nature — Japan (Mt. Fuji vistas, sakura groves, bamboo, autumn ginkgo, Hokkaido boreal), China (Huangshan granite + sea-of-clouds, Guilin / Zhangjiajie karst, Tibetan plateau), Taiwan (Taroko marble gorge), Vietnam (Halong Bay karst), Korea (Seoraksan granite, Jeju volcanic), Mongolia (Gobi dunes, Altai steppe). NO humans, NO torii, NO temples, NO villages, NO rice terraces. Phenomena strictly real Earth (sea of clouds, mist inversion, monsoon lightning, fog drift). 7 path-bespoke axes — 6 always-on + 1 conditional 25%-gated phenomenon.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject',
        'foreground_anchor',
        'light_condition',
        'atmosphere',
        'sky_layer',
        'scale_prover',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.25 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_ANDES_PATAGONIA: {
    description:
      'PATH-BESPOKE — EarthBot andes-patagonia (2026-05-23 scaffold). South American raw nature — Torres del Paine granite spires, Perito Moreno glacier face, Atacama salt + altiplano + llama silhouettes, Amazon basin canopy, Andean peaks, Cotopaxi volcano, Iguazu falls. NO humans, NO Machu Picchu ruins (cultural), NO civilization. Phenomena strictly real Earth (lenticular cloud over Patagonian peaks, alpenglow, sea of clouds, mist drift). 7 path-bespoke axes — 6 always-on + 1 conditional 25%-gated phenomenon.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject',
        'foreground_anchor',
        'light_condition',
        'atmosphere',
        'sky_layer',
        'scale_prover',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.25 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_AUSTRALIAN_OUTBACK: {
    description:
      'PATH-BESPOKE — EarthBot australian-outback (2026-05-23 scaffold). Australian raw geology — Uluru, Kata Tjuta, Bungle Bungle beehive domes, Pinnacles desert, Karijini gorge, Lake Eyre salt, MacDonnell ranges, red-dust eucalyptus woodlands. Red-iron-oxide palette distinct from American SW. NO humans, NO buildings, NO aboriginal art (cultural heritage). Phenomena strictly real Earth (dust storms, virga, lightning, stars at Uluru, fog inversions). 7 path-bespoke axes — 6 always-on + 1 conditional 25%-gated phenomenon.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject',
        'foreground_anchor',
        'light_condition',
        'atmosphere',
        'sky_layer',
        'scale_prover',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.25 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_ICELAND_RAW: {
    description:
      "PATH-BESPOKE — EarthBot iceland-raw (2026-05-23 scaffold). Iceland's unique raw geology — geothermal vents + geysers, glacier tongues (Vatnajökull, Sólheimajökull), black-sand beaches (Reynisfjara), basalt columns (Reynisdrangar, Stuðlagil), ice caves, moss-on-lava fields, waterfalls (Skógafoss, Gullfoss, Seljalandsfoss), Diamond Beach iceberg shards. NO humans, NO buildings. Phenomena strictly real Earth — aurora ALLOWED here (Iceland is one of the few paths where it's an actual real-Earth optical phenomenon) but rendered grounded-photographic, NEVER fantasy-cosmic. Fog inversions, volcanic vapor, ice-cave light shafts, snow squall. 7 path-bespoke axes — 6 always-on + 1 conditional 25%-gated phenomenon.",
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject',
        'foreground_anchor',
        'light_condition',
        'atmosphere',
        'sky_layer',
        'scale_prover',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.25 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_EUROPEAN_WILDERNESS: {
    description:
      'PATH-BESPOKE — EarthBot european-wilderness (2026-05-23 scaffold). British Isles + Alpine European + Scandinavian fjord-coast raw nature. British Isles: Scottish Highlands (Glen Coe, Quiraing, Old Man of Storr), Welsh Snowdonia, Irish Cliffs of Moher + Connemara, Lake District. Alpine: Dolomites, Matterhorn, Slovenian Julian Alps, Bavarian Alps + Königssee, Polish Tatras, French Vanoise. Scandinavian fjords + Faroe Islands (overlap-aware with existing coverage). NO humans, NO sheep-with-fence, NO villages, NO castles, NO standing stones (megalithic culture). Phenomena strictly real Earth (sea of clouds, alpenglow, mist drift, snow squall, lenticular over peaks). 7 path-bespoke axes — 6 always-on + 1 conditional 25%-gated phenomenon.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject',
        'foreground_anchor',
        'light_condition',
        'atmosphere',
        'sky_layer',
        'scale_prover',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.25 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_HIDDEN_CORNER: {
    description:
      'PATH-BESPOKE — EarthBot hidden-corner (2026-05-22). OFF-THE-BEATEN-PATH discovered nature pockets — the secret magical place you stumble into. Hidden creek bends with mossy stones, fern grottos in old-growth, forest clearings filled with wildflowers, tide pools no one visits, mossy waterfall pools, sun-shaft glades. INTIMATE mid-tight framing, NEVER wide panorama. CRITICAL — intimate ≠ minimal: every render is LUSH with packed detail and multi-tier layers. Wall-to-wall texture (moss / dew / lichen / wet stones / ferns / mushrooms / fallen petals). Multi-tier depth (foreground close-detail + midground subject + soft atmospheric background). Dappled or shaft-filtered light. Tiny scale-prover wildlife (frog / dragonfly / butterfly / single mushroom). The viewer should feel they stumbled into a secret pocket where every surface is alive with texture. 7 path-bespoke axes — 7 always-on + 1 conditional 25%-gated phenomenon. NO bioluminescent / aurora / nacreous / sun-dogs / fire-rainbow / iridescent / lava (all legacy fantasy triggers that drifted hidden-corner sci-fi). NO architecture / paths / fences. NO humans. NO wide panorama. NO sparse / empty / minimal compositions.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject',
        'foreground_anchor',
        'water_feature',
        'micro_detail',
        'scale_prover',
        'lighting',
        'atmosphere',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.25 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EARTHBOT_COZY_BEACH: {
    description:
      'PATH-BESPOKE — EarthBot cozy-beach (2026-05-22 v2 PIVOT). PIVOTED away from village/architecture identity (v1) to INTIMATE COZY BEACH MOMENTS — golden-hour atmosphere, soft palm shadows raked across warm sand, driftwood-strewn cove, scattered shells in damp sand, hammock-shaped palm-frond silhouette over sand, fallen tropical flowers on the sand, calm tide pools reflecting sunset, palm-shadowed pocket cove. ATMOSPHERE IS THE HERO. Mid-tight intimate framings, NEVER wide panorama. 6 path-bespoke axes — 5 always-on (subject_setting, foreground_element, water_state, sky_layer, light_condition) + 1 conditional 30%-gated phenomenon. NO HUMANS, NO architecture / cottages / lighthouses / villages (v1 identity is dead), NO dramatic surf / storms (cozy is gentle warm always), NO sci-fi / bioluminescent / fantasy.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject_setting',
        'foreground_element',
        'water_state',
        'sky_layer',
        'light_condition',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.3 },
    framingModes: null,
    anchorScaleRange: null,
  },
};

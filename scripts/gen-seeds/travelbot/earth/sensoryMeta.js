/**
 * Meta-prompt registry for EarthBot sensory channel pools.
 *
 * 1 context (scene) × 7 channels = 7 pools. Per design doc
 * memory/sensory_rollout/earthbot.md.
 *
 * Pure scene — NatGeo grandeur, no people, real-geography vocabulary
 * (fjord / slot-canyon / caldera / mesa / aurora / godrays / etc.).
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry — short, vivid, sensory
- ONE concrete sensory image per entry — not a mood, not a list
- Comma-separated phrases when needed; no full sentences
- NO direct color naming (lightcolor channel is the exception)
- NO duplicate verb+noun pairs across entries
- NO HUMANS — never "her", "his", "she", "he", "they", "their", "the hiker", "the climber"
- Use real-geography terms: fjord / slot canyon / caldera / mesa / butte / scree / moraine / hoodoo / tarn / cwm — not generic "mountain" / "valley"
- Aesthetic register: NatGeo grandeur / wallpaper-worthy / awe / reverence

━━━ AESTHETIC ANCHORS (use freely, mix and match) ━━━
- landforms: glacier, fjord, slot canyon, mesa, butte, hoodoo, caldera, tarn, alpine, tundra, taiga, savanna, jungle, mangrove, reef, atoll, plateau, escarpment, moraine, scree, talus, geyser, fumarole, hot spring, columnar basalt, sea-stack, sea-arch, sea-cave, dune, cathedral cave, slot, mesa, cwm, cirque
- weather: alpenglow, godrays, aurora, milky way, monsoon, blizzard, hoarfrost, rime ice, blue ice, supercell, thunderhead, virga, fog bank, sea-mist, sea-spray
- materials: granite, basalt, obsidian, rhyolite, sandstone, limestone, schist, gneiss, ice, snow, sand, lava, water, ice
- bio: lichen, moss, kelp, coral, sequoia, redwood, baobab, mangrove, bioluminescence, reindeer-moss, fireflies, jellyfish bloom`;

const scene = {
  smell: (n) => `You are writing ${n} distinct SMELL anchors for EarthBot's PURE-SCENE paths. NO HUMANS. Scents in the empty natural environment — pine forests, slot canyons, sea cliffs, volcanic vents, jungles, tundras, alpine meadows.

EXAMPLES (DO NOT REUSE):
- "sun-warmed pine and crushed needles in the high alpine"
- "sea-salt and kelp drifting up the coastal cliff"
- "petrichor rising from the slot canyon after a flash flood"
- "sulfur drifting from the volcanic vent"
- "tundra-flowers and reindeer moss in the high arctic"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LANDFORM/LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `You are writing ${n} distinct SOUND anchors for EarthBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "wind howling across the open plateau"
- "glacier groaning as it shifts a meter downhill"
- "thunderclap rolling through the slot canyon"
- "fumarole hissing in the geothermal field"
- "sea-cliff cave booming with each wave-strike"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SOURCE AND the QUALITY. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `You are writing ${n} distinct TOUCH anchors for EarthBot's PURE-SCENE paths. Texture/contact cues in the natural environment — moss on stone, frost on iron, lichen on basalt, rain on canyon walls.

EXAMPLES (DO NOT REUSE):
- "rain-mist beading on the moss-covered fjord wall"
- "lichen velvet creeping over the basalt column"
- "rain finding the cracks in the canyon stone"
- "grit and volcanic ash settling on the rim viewfinder"
- "frost climbing the iron of the trail bridge railing"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the TEXTURE/MEDIUM AND the SURFACE/LANDFORM. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `You are writing ${n} distinct TEMPERATURE anchors for EarthBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "alpine-cold leaching from the granite cliff"
- "volcanic-vent heat radiating into the dawn air"
- "tundra-frost biting the wind off the glacier"
- "Sahara-noon heat shimmering off the dune face"
- "geothermal-warmth rising from the hot-spring pool"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the THERMAL SOURCE AND the LANDFORM. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `You are writing ${n} distinct WEIGHT anchors for EarthBot's PURE-SCENE paths. Anchors implying massive geological gravity, mass, or pressure.

EXAMPLES (DO NOT REUSE):
- "kilometer-thick glacier sagging into the fjord"
- "century-old sequoia anchoring the canyon floor"
- "basalt columns leaning out over the cliff edge"
- "stone arch hanging suspended over the canyon"
- "iceberg drifting ponderous in the polar bay"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the LANDFORM/OBJECT AND the WEIGHT VERB. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for EarthBot's PURE-SCENE paths. Atmospheric particle/movement cues in the natural environment.

EXAMPLES (DO NOT REUSE):
- "mist drifting between the redwood trunks"
- "dust devils spinning across the plateau"
- "sea spray haloing the coastal arch"
- "petrichor rising from the desert floor after the rain"
- "geyser-steam billowing across the tundra"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the PARTICLE/MEDIUM AND the LANDFORM/LOCATION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for EarthBot's PURE-SCENE paths. Each entry forces Flux to render a SPECIFIC PUNCHY natural-light palette across the landscape.

Each entry must include: COLOR + DIRECTION/SOURCE (godray / shaft / rim / underlight / wash / glow / pool / flash) + IMPACT POINT in the landscape (snow peak / canyon mist / desert dune / sea cliff / glacier / caldera / fjord / aurora / cathedral cave).

EXAMPLES (DO NOT REUSE):
- "alpenglow magenta-orange flooding the snow peak"
- "godray-amber piercing the canyon mist"
- "aurora-green-and-magenta dancing across the night sky"
- "milky-way-cyan rim along the desert horizon"
- "lava-orange glow rising from the active caldera"

━━━ COLOR FAMILIES — distribute across ${n} entries ━━━
- ALPENGLOW/MAGENTA-ORANGE family (12-14): alpenglow, magenta-orange, sunset-coral
- AURORA family (10-12): aurora-green, aurora-magenta, aurora-cyan, polar-aurora
- GODRAY/AMBER family (12-14): godray-amber, sun-gold, honey-amber, sundown-amber
- LAVA/CALDERA family (8-10): lava-orange, caldera-red, magma-glow, ember-amber
- FJORD/GLACIER-BLUE family (10-12): fjord-blue, glacier-blue, ice-cyan, twilight-cobalt
- BIOLUMINESCENT-CYAN family (8-10): bioluminescent-cyan, ghost-green, phosphorescent-blue
- MILKY-WAY/STARLIGHT family (8-10): milky-way-cyan, starlight-silver, moonbeam-pearl
- BLOOD-MOON/CRIMSON family (4-6): blood-moon coppery, crimson-eclipse, oxblood-twilight
- THUNDER/STORM family (4-6): thunder-violet, lightning-white, storm-grey
- DESERT/SAHARA family (8-10): Sahara-amber, dune-gold, mesa-sienna, canyon-rust

━━━ DIRECTION SPREAD ━━━
key (10-12), rim (12-14), godray/shaft (14-16), wash (8-10), underlight (4-6), backlight (4-6), pool (4-6).

━━━ HARD RULES ━━━
- 8-16 words per entry
- COLOR + DIRECTION + IMPACT POINT (real geographic landform)
- No "and" stacking (except for color words that hyphenate naturally like "magenta-orange" or "green-and-magenta" aurora)
- Aesthetic register: NatGeo grandeur / real-geography lighting moments

━━━ DEDUP — two entries are too similar if they share ━━━
Both the COLOR FAMILY AND the DIRECTION. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { scene };

module.exports = { metaPrompts };

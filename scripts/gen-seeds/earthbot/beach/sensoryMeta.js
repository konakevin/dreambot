/**
 * BeachBot sensory meta — 1 context (scene) × 7 channels.
 * Coastal/tropical/island environments — NO HUMANS.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- NO direct color naming (lightcolor exception)
- NO duplicate verb+noun pairs
- NO HUMANS — never her/his/she/he. Use "the beach" / "the cove" / "the lagoon"
- Aesthetic register: tropical-paradise / coastal-romance / sun-warmed-sand / golden-hour-beach
- Vocabulary: lagoon, atoll, tide pool, sea cave, coral reef, palm grove, hibiscus, frangipani,
  driftwood, seashell, sea-glass, sea-spray, sea-foam, breakwater, lighthouse, coastal cliff,
  bioluminescent algae, kelp forest, sand dune, beach grass, mangrove, jetty, surf, swell`;

const scene = {
  smell: (n) => `${n} SMELL anchors for BeachBot's coastal-tropical scene. NO HUMANS.

EXAMPLES (DO NOT REUSE):
- "salt-air and sea-spray drifting up the coastal cliff"
- "coconut and frangipani perfume in the palm grove"
- "tide-pool brine and kelp at the rocky shore"
- "driftwood smoke from a beach bonfire"
- "tropical hibiscus drifting from the lagoon edge"

${SHARED_RULES}
━━━ DEDUP — share SCENT and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for BeachBot's coastal scene.

EXAMPLES (DO NOT REUSE):
- "wave thundering on the basalt sea-cliff"
- "seabirds crying over the cliff colony"
- "wind whistling through the palm fronds"
- "wave foam hissing as it retreats from the sand"
- "lighthouse foghorn carrying across the harbor"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `${n} TOUCH anchors for BeachBot's coastal scene. Sand / shell / kelp / coral textures.

EXAMPLES (DO NOT REUSE):
- "salt crusting on the lighthouse iron"
- "kelp wrapping the wreck's broken mast"
- "barnacle texture along the harbor stones"
- "sand grains sticking to the wet pebbles at low tide"
- "coral velvet softness across the reef shallows"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE and SURFACE = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for BeachBot's coastal scene.

EXAMPLES (DO NOT REUSE):
- "tropical-noon heat shimmering off the lagoon"
- "polar-cold seeping out of the iceberg"
- "morning-fog cool drifting from the bay"
- "storm-surge cold biting at the cliff base"
- "sun-warmed-sand glowing across the beach"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for BeachBot's coastal scene.

EXAMPLES (DO NOT REUSE):
- "century-old galleon settling deeper into the seabed"
- "iceberg shifting with a thunderous groan"
- "stone lighthouse anchored against the storm"
- "great driftwood log pressing the high-tide line"
- "ancient brass anchor half-buried in coral"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for BeachBot's coastal scene.

EXAMPLES (DO NOT REUSE):
- "sea-spray haloing the lighthouse on the cliff"
- "spray-mist drifting across the storm-deck"
- "phosphorescent plankton swirling in the boat's wake"
- "morning-fog rolling in across the harbor"
- "tropical-humidity hanging over the lagoon"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for BeachBot's coastal scene.

EXAMPLES (DO NOT REUSE):
- "tropical-turquoise sun-shaft through the lagoon"
- "sunset-magenta wash flooding the horizon"
- "bioluminescent-cyan waves edging the dark beach"
- "lighthouse-amber beam sweeping the storm fog"
- "moonlit-pearl rim along the calm-glass-sea"

━━━ COLOR FAMILIES ━━━
TROPICAL-TURQUOISE (12-14), SUNSET-MAGENTA-ORANGE (12-14), BIOLUMINESCENT-CYAN (8-10), LIGHTHOUSE-AMBER (8-10), MOONLIT-PEARL (8-10), GOLDEN-HOUR-AMBER (10-12), LAVENDER-TWILIGHT (6-8), POLAR-AURORA (4-6), HAWAII-ORCHID-MAGENTA (4-6), TIDE-POOL-SAPPHIRE (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), shaft (12-14), wash (10-12), rim (10-12), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (coastal environmental feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

module.exports = { metaPrompts: { scene } };

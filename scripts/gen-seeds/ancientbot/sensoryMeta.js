/**
 * AncientBot sensory meta — 1 context (scene) × 7 channels.
 * Ancient civilizations — Egypt/Greece/Rome/Maya/Inca/Aztec/Mesopotamia/India.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- NO direct color naming (lightcolor exception)
- NO duplicate verb+noun pairs
- NO HUMANS — use "the temple" / "the column" / "the relic" — never her/his/she/he
- Aesthetic register: ancient-civilization / weathered-stone / sacred / monumental
- Vocabulary: hieroglyph, sandstone, limestone, granite, basalt, obelisk, sphinx, pyramid,
  temple, ziggurat, stupa, parthenon, colosseum, hypostyle hall, sacred grove, mosaic floor,
  cuneiform tablet, papyrus scroll, bronze relief, gilt offering, frankincense, copal incense,
  jasmine, lotus, palm, olive grove, cedar of Lebanon, Nile reed`;

const scene = {
  smell: (n) => `${n} SMELL anchors for AncientBot's ancient-civilization scene. NO HUMANS. Smells in the empty ancient environment — temple incense, weathered stone, papyrus, gilded bronze.

EXAMPLES (DO NOT REUSE):
- "frankincense smoke lingering in the empty hypostyle hall"
- "centuries of papyrus and ink in the scriptorium"
- "wet limestone and lichen in the abandoned temple"
- "copal incense drifting through the Mayan pyramid chamber"
- "olive oil and cedar in the Greek marketplace"

${SHARED_RULES}
━━━ DEDUP — share SCENT and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for AncientBot's ancient-civilization scene. NO HUMANS.

EXAMPLES (DO NOT REUSE):
- "wind howling through the temple colonnade"
- "drip of water in the empty cistern below the pyramid"
- "distant temple bell chiming across the sacred grove"
- "loose mosaic-tile clinking under a settling stone"
- "raven calls echoing across the colosseum ruins"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `${n} TOUCH anchors for AncientBot's ancient-civilization scene. Texture / contact in the empty environment.

EXAMPLES (DO NOT REUSE):
- "lichen creeping over the fallen sphinx paw"
- "moss soft underfoot in the temple courtyard"
- "wax pooling in the runed depression of the standing stone"
- "frost cementing the iron gate to its hinge"
- "dust thick on the spines of the ancient ledgers"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE and SURFACE = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for AncientBot's ancient-civilization scene.

EXAMPLES (DO NOT REUSE):
- "Sahara-noon heat shimmering off the sandstone obelisk"
- "tomb-cold leaching from the basalt sarcophagus"
- "torch-warmth pulsing in the temple sanctum"
- "morning-desert chill bleeding from the pyramid stone"
- "midday-Mediterranean sun heating the marble forum"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for AncientBot's ancient-civilization scene. Massive ancient stone implying gravity.

EXAMPLES (DO NOT REUSE):
- "obelisk leaning against centuries of desert wind"
- "great oak doors slumping on rusted bronze hinges"
- "ziggurat tier sagging under the weight of millennia"
- "fallen colossus head half-buried in shifting sand"
- "stone arch hanging suspended over the temple court"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for AncientBot's ancient-civilization scene.

EXAMPLES (DO NOT REUSE):
- "incense haze drifting between the temple columns"
- "cinder-ash drifting from the ritual brazier"
- "sand-dust spiraling across the deserted forum"
- "papyrus dust lifting in the morning shaft"
- "cedar smoke curling toward the hypostyle ceiling"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for AncientBot's ancient-civilization scene.

EXAMPLES (DO NOT REUSE):
- "Friberg-amber sunset wash across the temple façade"
- "sacred-gold shaft through the hypostyle hall"
- "blood-red beam falling across the cracked altar"
- "lapis-blue moonlight pooling on the ziggurat steps"
- "torch-orange glow flickering across the temple frieze"

━━━ COLOR FAMILIES ━━━
FRIBERG-AMBER (12-14), SACRED-GOLD (10-12), TORCH-ORANGE (10-12), LAPIS-BLUE MOONLIGHT (8-10), BLOOD-RED ALTAR (6-8), TURQUOISE-NIGHT (6-8), VERDIGRIS-BRONZE-GREEN (6-8), DESERT-AMBER (10-12), TWILIGHT-INDIGO (4-6), PAPYRUS-WHITE-SUN (4-6).

━━━ DIRECTION SPREAD ━━━ shaft (14-16), key (10-12), wash (10-12), rim (8-10), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (ancient environmental feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

module.exports = { metaPrompts: { scene } };

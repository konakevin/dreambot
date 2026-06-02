/**
 * TinyBot sensory meta — 1 context (scene) × 7 channels.
 * Miniature/macro/dollhouse/terrarium/diorama universe — NO HUMANS.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- NO direct color naming (lightcolor exception)
- NO duplicate verb+noun pairs
- NO HUMANS — never her/his/she/he. Use "the diorama" / "the dollhouse" / "the terrarium"
- Aesthetic register: tilt-shift macro / miniature / dollhouse / terrarium / snowglobe / Lego-village
- Vocabulary: dollhouse, snowglobe, terrarium, miniature, macro shot, tilt-shift, paper-craft,
  felt mushroom, matchstick chimney, foam moss, fairy garden, miniature village, snow village,
  mossy log, mossy rock, dewdrop, crystal flask, sand-base, miniature bridge`;

const scene = {
  smell: (n) => `${n} SMELL anchors for TinyBot's miniature/macro scene.

EXAMPLES (DO NOT REUSE):
- "fresh-glue evaporation across the diorama foam-rocks"
- "moist terrarium soil and fern in the glass dome"
- "cinnamon-stick-dust drifting from the miniature kitchen"
- "PVA glue setting in the matchstick fence"
- "sun-warmed paper-craft cottage roof shingles"

${SHARED_RULES}
━━━ DEDUP — share SCENT and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for TinyBot's miniature scene.

EXAMPLES (DO NOT REUSE):
- "dewdrop pinging the felt mushroom cap"
- "tiny music-box winding down in the dollhouse parlor"
- "snowglobe-shake glittering across the village"
- "macro-fan whirring above the diorama"
- "felt-fabric stretching across the diorama hill"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (
    n
  ) => `${n} TOUCH anchors for TinyBot's miniature scene. Felt/foam/moss/paper-craft textures.

EXAMPLES (DO NOT REUSE):
- "felt mushroom cap soft against the diorama floor"
- "moss soft-pile creeping over the foam rock"
- "paper-craft snowdrift soft against the miniature chimney"
- "tilt-shift macro-camera nudging the dewdrop"
- "lichen-tree gripping the foam-rock outcrop"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE and SURFACE = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for TinyBot's miniature scene.

EXAMPLES (DO NOT REUSE):
- "studio-spotlight warmth radiating across the dollhouse parlor"
- "macro-shutter cool air pulled across the diorama"
- "snowglobe-cool blue-white wash on the village"
- "tilt-shift afternoon sun warming the miniature meadow"
- "warm practical-bulb amber glowing through the dollhouse window"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for TinyBot's miniature scene.

EXAMPLES (DO NOT REUSE):
- "century-heavy diorama baseplate anchoring the build"
- "miniature-bridge of matchsticks bowed under the painted figure"
- "tabletop-terrain foam-rock pressing the wooden display"
- "snowglobe-glass dome anchored on its wooden stand"
- "diorama hillside sagging under the felt-meadow weight"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for TinyBot's miniature scene.

EXAMPLES (DO NOT REUSE):
- "snowglobe glitter raining around the village"
- "spray-bottle mist haloing the miniature meadow"
- "talc-powder snowfall settling on the dollhouse roof"
- "fairy-light particles twinkling in the felt forest"
- "PVA-glue drips suspended in the diorama waterfall"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for TinyBot's miniature scene.

EXAMPLES (DO NOT REUSE):
- "tilt-shift honey-amber afternoon shaft on the diorama"
- "dollhouse-window butter-yellow glow from inside"
- "snowglobe-cool blue-white wash on the village rooftops"
- "candle-orange flicker from the matchstick chimney"
- "fairy-light cyan twinkle in the felt forest canopy"

━━━ COLOR FAMILIES ━━━
TILT-SHIFT-HONEY-AMBER (12-14), DOLLHOUSE-BUTTER-YELLOW (10-12), SNOWGLOBE-COOL-BLUE-WHITE (10-12), CANDLE-ORANGE-FLICKER (8-10), FAIRY-LIGHT-CYAN (8-10), POWDER-PINK-SUNSET (6-8), MOONLIT-PEARL (6-8), MINIATURE-CHRISTMAS-RED-GREEN (4-6), SPOTLIGHT-AMBER-FOCAL (8-10), TILT-SHIFT-EMERALD (4-6), MACRO-SOFT-AMBER (4-6), SNOWFALL-BLUE (4-6).

━━━ DIRECTION SPREAD ━━━ shaft (12-14), key (10-12), wash (10-12), rim (8-10), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (miniature feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

module.exports = { metaPrompts: { scene } };

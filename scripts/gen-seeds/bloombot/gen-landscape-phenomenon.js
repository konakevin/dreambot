#!/usr/bin/env node
/**
 * BLOOMBOT_LANDSCAPE_PHENOMENON — atmospheric / wildlife / geophysical events
 * happening across a flower-rich landscape. Sunbeams through storm-breaks,
 * dust-devil spirals, butterfly migrations, geyser columns, hail-curtains,
 * starling murmurations, distant volcanic ash-columns, etc. Cinematic,
 * scale-shifting, specific.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_landscape_phenomenon.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} PHENOMENON entries for BloomBot's landscape path — wide flower-rich landscape vistas where a dramatic atmospheric / wildlife / geophysical / luminous event is happening across the scene. Each entry is one descriptive line, 35-55 words, starting with a CAPS NAME, em-dash, then body describing WHAT the phenomenon is + WHERE in the frame + HOW it interacts with the bloom-carpet/landscape.

━━━ THE BAR ━━━
Every entry names a SPECIFIC named event that would land as a 10/10 cinematic landscape moment. Phenomenon is the hero MOMENT — a beam of light, a migrating cloud of butterflies, a hailstorm wall, a geyser column, a starling murmuration, a fire-rainbow, a fog-bow, an avalanche cloud. Specify position in frame (foreground / midground / background) + scale + how it touches the bloom-meadow / sky / landform. Cinematic register, scale-shifting, never generic.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"SUNBEAM COLUMN THROUGH STORM-BREAK — a single hard-edged shaft of direct sunlight breaking through a storm-cloud fracture onto one specific bloom-patch in midground, that patch blazing hot-amber gold"
"DUST-DEVIL SPIRAL CROSSING MEADOW — tight rotating dust-devil column dancing across the bloom-carpet from right to left in midground, spinning petals and stem-fragments into its funnel base"
"MONARCH MIGRATION WAVE — dense flickering cloud of migrating monarch butterflies streaming low across the bloom-meadow in midground, thousands of orange-black wings at every depth"
"DISTANT VOLCANIC ASH-COLUMN — background volcano in full eruption, vertical ash-column punching into the upper sky, foreground bloom-carpet bathed in warm filtered light"
"HAIL-CURTAIN WALL IN MIDGROUND — dense grey-white hail-curtain descending from a storm-cell in midground, the curtain's forward edge sharp as a blade against sunlit bloom"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 LIGHT-BEAM / GOD-RAY phenomena (storm-break sunbeam, fog-pierced shafts, single column through fracture)
- ~4 WILDLIFE-MASS phenomena (monarch migration, starling murmuration, swallow swarm, dragonfly cloud, locust column, swan formation)
- ~3 ATMOSPHERIC-DISTURBANCE (dust-devil, water-spout, tornado funnel, microburst, downdraft)
- ~3 PRECIPITATION-WALL (hail-curtain, virga sheet, sleet-front, snow-squall, rain-curtain advancing)
- ~3 GEOPHYSICAL (geyser column, fumarole steam-plume, volcanic ash-column, mudpot eruption, hot-spring vent)
- ~2 CELESTIAL (meteor streak, fireball, lunar halo, sun-pillar, sun-dog twin)
- ~2 RAINBOW / OPTICAL (full double rainbow, fire-rainbow, fog-bow, glory ring, circumzenithal arc)
- ~2 STORM-CELL (anvil thunderhead, distant lightning strike, sheet-lightning flash, supercell mesocyclone)
- ~2 WIND-VISIBLE (bloom-petal storm in cross-wind, grass-wave sweeping the meadow, ripple-front in tall stems)
- ~2 FIRE / EMBER (controlled-burn smoke-column, distant prairie fire glow, ember-drift across meadow, lightning-strike spot-fire)
- ~1 CLOUD-INVERSION (sea-of-cloud inversion below a ridge, valley fog pooling between landforms)
- ~1 AVALANCHE / ROCKFALL (snow-avalanche cloud on distant ridge, distant rockfall plume)
- ~1 AURORA / NIGHT-SKY (low-latitude aurora over the meadow, milky-way arch overhead)
- ~1 FOG / MIST (rolling fog-front advancing, mist-bank dividing meadow from forest)
- ~1 WATER (waterfall-spray rainbow, river-mist over bloom-banks, oxbow ground-fog)

━━━ BANS ━━━
- NO photographer-name drops (no Marc Adamus / no Peter Lik / etc.).
- NO bare "beautiful clouds" or "nice light" — name the SPECIFIC phenomenon + its position in the frame.
- NO sci-fi / neon / hologram / laser phenomena.
- NO bare "many flowers everywhere" — the phenomenon is the hero, the bloom-meadow is the stage.
- NO indoor scenes — this is OUTDOOR landscape only.

━━━ FORMAT ━━━
Each entry: 35-55 words. Format: "NAME CAPS — body text describing position + scale + interaction with bloom-meadow / sky".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

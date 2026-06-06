#!/usr/bin/env node
/**
 * BLOOMBOT_TROPICAL_GROVE_ATMOSPHERE — overall atmospheric / setting
 * condition for a Hawaiian Dr-Seuss giant tropical-flower wonderland.
 * Cascading waterfall, still lagoon mirror, ocean surf edge, volcanic
 * steam plumes, double rainbow arc.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_tropical_grove_atmosphere.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERE entries for BloomBot's tropical-grove path — Hawaiian Dr-Seuss giant tropical-flower wonderland. Each entry is one descriptive line, 35-55 words. NO leading CAPS NAME — flowing prose. Each names an overall atmospheric / backdrop setting condition (waterfall plunging, still lagoon, ocean surf, volcanic steam, double rainbow, fog-bank, etc.) and how the giant-bloom masses interact with it.

━━━ THE BAR ━━━
Every entry names a SPECIFIC atmospheric backdrop CONDITION + giant-bloom mass arrangement: cascading jungle waterfall + receding bloom-layers; still lagoon mirror + monumental canopy reflected; ocean surf + dense flower edges; volcanic steam plume + bloom-mass dominating frame; double rainbow arc + crisp clean-sky bloom hero. The bloom-MASS is ALWAYS the dominant compositional element (60%+ of frame), the atmosphere is the backdrop drama.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"A cascading jungle waterfall plunges down black mossy rock, throwing a crisp sunlit veil of spray across dense overflowing bloom-masses that pack the frame in receding violet and indigo layers, backdrop sky vivid and clear"
"A still lagoon mirrors a monumental canopy of abundant blooms in a glassy reflection, cool blues and purples doubling in the water, every petal crisp and clearly rendered from foreground mass to distant layered grove"
"Ocean surf rolls onto a white-sand edge, sea-spray misting crisply in bright clear air above dense bloom-masses crowding the shore, waves catching sharp light while receding layers of lush flowers fill the full frame"
"Plumes of volcanic steam vent cleanly from dark fissured lava rock while an overflowing foreground mass of blooms dominates the frame, receding bloom-layers stretching deep into the grove, sky clean and vivid above"
"A vivid double rainbow arcs across a clear tropical sky above a monumental hero bloom-form, abundant flower-masses filling sixty percent of the frame in crisp cool purples and whites, distant grove clearly rendered"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 WATERFALL (cascading jungle waterfall, multi-tiered waterfall, narrow chute waterfall, broad sheet waterfall, hidden grotto fall)
- ~5 STILL POOL / LAGOON (lagoon mirror reflection, jungle pool with reflection, mountain-fed mirror tarn, mangrove still-water)
- ~5 OCEAN / SURF EDGE (ocean surf bloom-edge, white-sand shore with blooms, lava-rock shore with bloom-cliff, palm-and-bloom shore-cluster)
- ~4 VOLCANIC (volcanic steam vents, lava-rock fissures, hot-spring vent column, fumarole haze, distant cone with bloom-slope)
- ~4 RAINBOW / OPTICAL (vivid double rainbow, single-arc rainbow, fire-rainbow, mist-bow over waterfall, sun-pillar through cloud-break)
- ~4 STORM-CLEARING (post-storm clarity with rainbow, fresh-washed cobalt sky, drifting storm-clouds with sunlight, vivid sun-after-rain glow)
- ~4 GOLDEN-HOUR (golden-hour rake across grove, warm tropical sunset, copper-hour glow, ember-light through blooms, amber wash)
- ~4 BLUE-HOUR / TWILIGHT (deep blue-hour ambient, indigo dusk, twilight cobalt with blooms glowing, post-sunset purple band)
- ~3 MOONLIGHT / NIGHT (full-moon silver wash, moonlit lagoon, jungle-bloom under bright moon, blue-moon casting silver)
- ~3 FOG / MIST (cloud-forest mist rolling, jungle-fog drifting through grove, low ground-fog under canopy, mist-veil over pool)
- ~3 RAIN / SQUALL (tropical squall sweeping through, rain-curtain advancing, sun-shower with rainbow, monsoon downburst)
- ~3 CLOUD-INVERSION (sea-of-clouds inversion below ridge, cloud-floor at canopy level, inversion-fog filling valley)
- ~3 MOUNTAIN-RIDGE BACKDROP (jagged dark-green mountain ridge backdrop, distant volcanic spire, alpine ridge above grove)
- ~3 SUNSET-COLOR (tropical sunset with apricot horizon, pink-and-violet sky band, copper-orange after-sunset, scarlet horizon)
- ~3 STORM-CELL DRAMA (towering cumulonimbus with bloom hero, distant lightning over ocean, anvil-thunderhead backdrop)
- ~3 STAR-FIELD / GALAXY (milky-way arch over grove, deep-night galaxy band, starfield with bloom-mass silhouette)
- ~3 BIRD-FLIGHT BACKDROP (parrot flock arcing over, hummingbird-swarm hovering, butterfly-cloud through grove)
- ~3 SUNBEAM / SHAFT (single sun-shaft piercing canopy onto bloom-hero, god-rays through palm-fronds, beam onto monumental flower)
- ~3 CALM CLEAR-SKY (clean cerulean sky over grove, vivid clear blue with bloom-hero, plain-blue background letting blooms speak)
- ~3 BREEZE-VISIBLE (palm-frond curve in breeze, bloom-mass swaying gently, drifting petal-flutter caught mid-air)

━━━ BANS ━━━
- NO photographer-name drops.
- NO sci-fi / no neon / no hologram.
- NO bare "tropical paradise" — name the SPECIFIC backdrop atmospheric event.
- NO leading CAPS NAME — flowing prose only.
- NO crowds / no people.

━━━ FORMAT ━━━
Each entry: 35-55 words. Flowing prose — NO leading CAPS NAME. Names atmospheric condition + how bloom-mass dominates frame + receding depth layers.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

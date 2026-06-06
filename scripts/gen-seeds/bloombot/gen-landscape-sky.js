#!/usr/bin/env node
/**
 * BLOOMBOT_LANDSCAPE_SKY — dramatic sky conditions framing a wide
 * bloom-landscape. Amber first-light rake, anvil thunderhead, double
 * rainbow clearing, high-noon cumulus castles, aurora curtain, twilight
 * Venus gradient, blood-moon ascent, sunbreak piercing.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_landscape_sky.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SKY entries for BloomBot's landscape path — dramatic sky conditions framing a wide bloom-meadow landscape. Each entry is one descriptive line, 30-55 words, starting with a CAPS NAME, em-dash, then body describing the cloud / light / color condition + how the sky paints the bloom-meadow below.

━━━ THE BAR ━━━
Every entry names a SPECIFIC sky/weather/light condition with named color, named cloud type, named time-of-day, and how it interacts with the meadow below. Anvil thunderhead. Double-rainbow clearing. Aurora curtain. Twilight Venus gradient. Blood-moon ascent. Sun-pillar at dawn. Mackerel-sky high cirrus. Each must specify the SKY first and how the meadow receives that light.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"AMBER FIRST-LIGHT RAKE — rose-gold dawn band hugging the horizon bleeds upward through amber to cool violet at zenith, single low sun-ray cutting across the bloom-meadow at a five-degree angle, long petal shadows"
"ANVIL THUNDERHEAD GOLDEN SHOULDER — colossal cumulonimbus anvil dominates the upper right, sun-lit bone-white on its leading edge, bruised violet on its shadow flank, distant rain-curtain trailing grey behind"
"DOUBLE-RAINBOW CLEARING — full primary and secondary rainbow arches spanning the entire upper frame, primary bow saturated, secondary softer and reversed, last retreating storm-cloud dark on the left"
"HIGH-NOON CUMULUS CASTLES — deep cerulean sky packed with three-dimensional sculpted cumulus towers, crisp dark undersides catching Ansel Adams hard noon light, every cloud reading fully three-dimensional"
"AURORA MAGNETIC CURTAIN — green-and-violet aurora bands ripple from horizon to zenith over a high-latitude bloom-tundra, magnetic-field striations shifting in slow waves"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~4 DAWN / FIRST-LIGHT (rose-gold dawn rake, pre-sunrise pearl-grey, alpenglow first-strike, dawn-pink horizon, indigo-to-amber gradient)
- ~4 GOLDEN-HOUR (amber sunset rake, copper hour, molten gold pour, last-light backlit clouds, gilded cumulus shoulder)
- ~3 HIGH-NOON / BLAZING (high-noon cumulus castles, blazing white zenith, hard-noon shadow stack, vertical mid-day light, brassy summer noon)
- ~3 STORM-CELL (anvil thunderhead, supercell mesocyclone, towering cumulonimbus, distant lightning curtain, sheet-lightning flash)
- ~3 RAINBOW / OPTICAL (full double rainbow, primary-bow arch, fire-rainbow, fog-bow, circumzenithal arc, sun-pillar)
- ~3 AURORA / NIGHT-SKY (aurora magnetic curtain, milky-way arch, meteor-shower streaks, Venus-and-Jupiter conjunction, blood-moon ascent)
- ~3 TWILIGHT / BLUE-HOUR (twilight Venus gradient, indigo-cobalt blue-hour, post-sunset purple band, first-stars pricking)
- ~3 CLOUD-FORM (mackerel-sky high cirrus, lenticular cloud over peak, mammatus underbelly, virga sheet, cirrostratus halo)
- ~3 SUNBREAK / SHAFT (sunbreak piercing, god-ray shafts through cloud, single column through storm, jaw-of-light through canyon)
- ~3 FOG / MIST SKY (low fog ceiling, ground-fog overlay, mist veil above meadow, fog-bank rolling, cloud-inversion below ridge)
- ~3 SUNSET COLOR (red-and-gold sunset bands, pink-and-violet alpenglow, copper-amber gradient, ember-orange band)
- ~3 STORM-CLEARING (rainbow after rain, post-storm clarity, fresh-washed cobalt, double-rainbow primary band)
- ~3 ECLIPSE / CELESTIAL EVENT (partial-eclipse crescent sun, full-eclipse corona, lunar-eclipse blood disc, transit-of-Venus dot)
- ~3 EXTREME ATMOSPHERIC (lenticular UFO clouds, asperitas wave-clouds, noctilucent ice-clouds, mother-of-pearl nacreous, fallstreak punch-hole)

━━━ BANS ━━━
- NO photographer-name drops (no Ansel Adams reference IS OK as classical register — but no contemporary photographer names).
- NO bare "beautiful sky" — name the SPECIFIC cloud / light / phenomenon.
- NO sci-fi / no neon / no hologram.
- NO bare "sunset" — specify the color band + position + horizon condition.

━━━ FORMAT ━━━
Each entry: 30-55 words. Format: "NAME CAPS — body text describing the sky/cloud/light + how it paints the bloom-meadow below".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

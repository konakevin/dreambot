#!/usr/bin/env node
/**
 * BRICKBOT_WINTER_LIGHTING — winter brick MOC lighting.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_winter_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's winter path — alpine/winter-village/arctic brick MOC photography. Each entry: ONE sentence, 25-40 words, naming source + direction + color + how it touches white-plate snow.

━━━ THE BAR ━━━
Every entry names a SPECIFIC source (warm window-glow / golden alpine-sunset / blue-hour twilight / full-moon / aurora / fireplace / candle-string / lantern / etc.) PLUS direction PLUS color PLUS effect on the white-plate snow (warm pools, trans-orange spill, cool blue shadows, etc.).

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 GOLDEN-SUNSET ALPINE: warm amber raking, peach + dark-blue
- ~5 WARM-WINDOW-GLOW: trans-orange spilling onto blue snow from cabin windows
- ~4 BLUE-HOUR TWILIGHT: cool diffuse blue, last warm light catching peak
- ~4 FULL-MOON / NIGHT: silver-blue moon overhead, deep shadows
- ~4 OVERCAST / FLAT: diffuse cool grey, no shadow, snow-storm feeling
- ~4 AURORA BOREALIS: trans-green + trans-purple sky-bands over snow
- ~3 SUNRISE / DAWN: low pink-amber light, alpenglow
- ~3 FIREPLACE / CABIN INTERIOR: trans-orange flame-glow, warm pools
- ~3 STRING-LIGHTS / FESTIVE: bulb-strings draped, multicolor glow
- ~3 CANDLE / LANTERN: warm point-light, hot pool, deep shadow beyond
- ~3 BLIZZARD WHITE-OUT: featureless white wash, no source
- ~2 ICE-CAVE TRANS-BLUE GLOW: trans-cyan refracted glow
- ~2 SNOW-FALL EVENING with street-lamp: trans-yellow halos in falling snow
- ~2 SKI-LIFT FLOOD: cool overhead flood at base-station
- ~1 ECLIPSE SHADOW
- ~1 BONFIRE WINTER-SOLSTICE GLOW
- ~1 FROZEN-LAKE-CRACKING TRANS-WHITE flash

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"Warm window-glow spilling trans-orange light out onto cool-blue white-plate snow, hot amber pools at each lit cabin window punching against the deep blue twilight"
"Golden alpine-sunset raking low from the right, warm amber gilding snow-cap tiles and chalet rooftops, long cool-blue plastic shadows stretching hard across the snowfield"
"Aurora-borealis trans-green + trans-purple plate-arc across the deep navy sky-baseplate, faint cool reflection on the white-plate snow below, ghostly polar ambient"

━━━ BANS ━━━
- NO photoreal vocab
- NO fluid-motion verbs
- NO photographer name-drops
- NO mood-only descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

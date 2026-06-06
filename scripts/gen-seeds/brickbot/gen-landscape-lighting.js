#!/usr/bin/env node
/**
 * BRICKBOT_LANDSCAPE_LIGHTING — light for epic vista brick dioramas.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_landscape_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's landscape path — epic vista brick MOC photography. Each entry: ONE sentence, 25-40 words, naming light source + direction + color quality + how it touches the brick build.

━━━ THE BAR ━━━
Every entry names a SPECIFIC source (golden-hour / blue-hour / overcast / storm-light / moonlit / aurora / sunset / sunrise / midday harsh / lightning-strike / etc.) PLUS direction PLUS color quality PLUS how it falls across the brick range. NEVER mood-only descriptors.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 GOLDEN-HOUR / SUNSET: warm amber raking, low side-light, long shadows
- ~4 BLUE-HOUR / TWILIGHT: cool dim blue, last light catching peaks
- ~4 MIDDAY HARSH: overhead bright sun, short hard shadows
- ~4 OVERCAST / FLAT: diffuse cool grey-blue, even shadowless
- ~3 STORM / DRAMATIC: god-ray sunbeam through clouds, lightning strike
- ~3 DAWN / SUNRISE: low pink-amber side-light, mist with golden touch
- ~3 MOONLIT / NIGHT: silver-blue, deep blue shadow, faint cool light
- ~3 AURORA / NORTHERN-LIGHTS: trans-green + trans-purple sky-band
- ~2 ALPENGLOW: pink-amber on snowy peaks at sunset / sunrise
- ~2 RAINBOW / RAIN-AFTER: trans-arc brick rainbow with sun-shaft
- ~2 STARLIGHT / DEEP-NIGHT: faint starfield only, ghostly mountains
- ~1 VOLCANIC GLOW: trans-orange lava-light
- ~1 BLIZZARD WHITE-OUT: featureless white-light wash
- ~1 ICE-SHELF CAUSTIC GLOW from trans-cyan glacier

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"Golden-hour amber raking from camera-left, warm light gilding peak-tile snow-caps and pine-element canopies, long cool plastic shadows stretching across the brick valley floor."
"Blue-hour twilight, cool diffuse cobalt across the entire range, the very last warm-amber rim catching the highest ridge crest, deep blue-violet shadow pooling in canyon below."
"Lightning-strike accent — a trans-yellow + trans-white bolt-element flashing from a dark-bley storm-cloud bank, momentarily lighting the dark ridge below in cold trans-light shock."

━━━ BANS ━━━
- NO photoreal landscape vocab
- NO fluid-motion verbs ("light dances")
- NO photographer name-drops
- NO mood-only ("breathtaking light")

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

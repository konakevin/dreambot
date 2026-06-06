#!/usr/bin/env node
/**
 * BRICKBOT_THEME_PARK_LIGHTING — amusement-park lighting.
 * Audit 2026-06-05: 47 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_theme_park_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's theme-park path — amusement-park / carnival / midway brick MOC photography. Each entry: ONE sentence, 25-40 words, naming source + direction + color + how it touches the brick rides.

━━━ THE BAR ━━━
Every entry names a SPECIFIC source (dusk neon-glow / full ride-blaze / golden-hour park / firework-flash / spotlight-show / midday harsh / overcast / etc.) + direction + color quality + effect on brick rides (string-lights pooling on midway, trans-element ride-outlines blazing, etc.).

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 DUSK / EVENING NEON: trans-element ride-outlines blazing as sky deepens, multicolor spill
- ~5 NIGHT / FULL-BLAZE: deep navy sky + trans-red/blue/yellow ride-lights
- ~4 GOLDEN-HOUR PARK: low warm side-light gilding canopy tops + struts
- ~4 MIDDAY HARSH: overhead bright, short hard shadows on midway
- ~3 OVERCAST / FLAT: diffuse cool grey, no strong shadows
- ~3 FIREWORK FLASH: trans-yellow + trans-red bursts overhead lighting park
- ~3 SPOTLIGHT-SHOW: rotating trans-yellow + trans-cyan beams crossing
- ~3 STRING-LIGHT BULB: warm bulb-strings draped across midway
- ~3 SUNRISE PARK-OPENING: low pink-amber light glancing through gates
- ~2 RAIN-DAY: trans-clear rain curtain, wet brick puddle reflections
- ~2 FOG / MIST CHILL: cool diffuse, park lights as halos
- ~2 LASER-SHOW: trans-green + trans-red laser-bar cutting the sky
- ~1 SNOWY-WINTER PARK: cool soft light + warm window-glow
- ~1 SOLAR-ECLIPSE shadow over park

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"Dusk neon-glow — trans-element ride-outlines blazing as the sky deepens, warm multicolor spill pooling across the brick midway, amber and pink touching the canopy peaks."
"Summer-night full ride-lights — deep navy ambient with trans-red, trans-blue, and trans-yellow ride-blazing, colored pools reflected on brick paths, minifig crowds lit from above."
"Golden-hour park — low warm side-light raking from camera-left, gilding canopy-tops and ride-struts, long soft plastic shadows stretching down the midway in amber."

━━━ BANS ━━━
- NO photoreal vocab
- NO fluid-motion verbs
- NO photographer name-drops
- NO mood-only descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
/**
 * BRICKBOT_WINTER_PHENOMENON — built winter event drama.
 * Audit 2026-06-05: 44 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_winter_phenomenon.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} WINTER-PHENOMENON entries for BrickBot's winter path — ONE big built winter event in an alpine/village/arctic brick diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC winter event (snow-flurry, aurora-arc, blizzard, avalanche, ice-storm, icicle-fall, snowman-build, sledding-race, etc.) AND shows how it's BUILT (white round-plates on rods, trans-cyan + trans-green plate-arc, cotton-elements, etc.). Reads BRICK.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 SNOW-FALL: snow-flurry, heavy snow, snow-storm, blizzard whiteout
- ~5 AURORA / LIGHT: aurora arc, northern lights, polar shimmer
- ~4 ICE EVENTS: ice-storm, icicle-fall, ice-crack on lake, frozen-waterfall
- ~4 AVALANCHE / SLIDE: avalanche down slope, snow-cornice break
- ~4 CHRISTMAS / FESTIVE: santa's sleigh-arrival, gift-toss, carolers, bell-ring, fireworks
- ~3 SLEDDING / ACTIVITY: sledding race, snowman-build, snowball-fight, ice-skating
- ~3 ANIMAL: reindeer-flight, polar-bear emergence, penguin-march, snow-fox prowl
- ~3 STORM / WEATHER: blizzard front, hail-ice fall, thundersnow
- ~3 ICE-RINK: skating-jump, hockey-shot, figure-skater spin
- ~3 ICE-CAVE / GROTTO: trans-cyan refraction, ice-stalactite cluster
- ~2 FIRE / CAMPFIRE: bonfire blaze on snow, sparking flame
- ~2 RAINBOW / OPTICAL ICE-BOW
- ~2 SOLSTICE / FIREWORKS
- ~1 SOLAR-ECLIPSE shadow
- ~1 ICE-VOLCANO eruption
- ~1 GLACIER-CALVING

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include: WHAT + HOW it's brick-built + WHERE. Touchpoints:
"SNOW-FLURRY — scattered white 1×1 round-plates threaded on thin trans-clear bar-rods at varied heights and angles across the mid-frame, plus cotton-elements massed above"
"AURORA ARC — a built sky-arc of layered trans-cyan + trans-green + trans-purple 1×2 plates curving in a broad overhead band above the snowfield, a deliberate brick polar event"
"ICICLE FALL — a row of trans-clear + trans-light-blue cone-elements hanging from the cabin eave, one mid-fall on a clear rod about to shatter, frozen built drama"

━━━ BANS ━━━
- NO photoreal vocab
- NO living-fluid verbs
- NO licensed franchise names
- NO duplicating events

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

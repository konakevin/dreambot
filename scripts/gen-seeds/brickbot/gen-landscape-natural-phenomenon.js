#!/usr/bin/env node
/**
 * BRICKBOT_LANDSCAPE_NATURAL_PHENOMENON — built environmental drama for vistas.
 * Audit 2026-06-05: 43 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_landscape_natural_phenomenon.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} NATURAL-PHENOMENON entries for BrickBot's landscape path — ONE big built environmental event in an epic vista brick diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC natural event (waterfall mist, rainbow arc, lightning strike, avalanche, sandstorm, geyser, lava-flow, glacier-calving, etc.) AND shows how it's BUILT (cotton-elements, trans-blue stacked plates, trans-yellow bolt-bars, etc.). Reads BRICK.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 WATER: waterfall-mist cloud, river-rapids spray, geyser-burst, hot-spring steam
- ~4 LIGHTNING / STORM: lightning-strike on ridge, thunderhead breaking, hail-fall
- ~4 SNOW / ICE: avalanche-down, ice-shelf calving, snow-flurry, ice-glide
- ~4 VOLCANIC: lava-flow, ash-plume, volcanic-bomb arc, fissure-vent
- ~3 RAINBOW / OPTICAL: trans-arc rainbow, halo-ring around sun, fogbow, sun-dog
- ~3 SAND / DESERT: dust-devil, sandstorm wall, tumbleweed roll
- ~3 GROUND / GEOLOGIC: earthquake-crack, rockslide, sinkhole, mudslide
- ~3 SKY-EVENT: shooting-star, meteor-streak, comet-tail, aurora arc
- ~2 WILDLIFE-EVENT: bird flock-rise, herd migration, salmon-run, butterfly migration
- ~2 ATMOSPHERIC: tornado-funnel, dust-devil, fire-tornado, cyclone-eye
- ~1 SOLAR-ECLIPSE shadow
- ~1 STAMPEDE on plains
- ~1 ICE-WAVE breaking on rocks

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include: WHAT + HOW it's brick-built + WHERE. Touchpoints:
"WATERFALL-MIST CLOUD — a billow of white 1×1 round-plates + cotton-elements built at the foot of a stepped trans-blue waterfall where it strikes the basin, a built spray-frozen halo"
"TRANS-ARC RAINBOW — a built arc of stacked trans-red + trans-orange + trans-yellow + trans-green + trans-blue + trans-purple plates curving over the valley after rain, a bright brick optical event"
"LIGHTNING-STRIKE — a jagged trans-clear + trans-blue bolt-element built striking from a dark round-plate storm-cloud down to a far ridge, a single dramatic frozen brick flash"

━━━ BANS ━━━
- NO photoreal vocab
- NO living-fluid verbs ("the waterfall crashes loudly")
- NO licensed franchise names
- NO duplicating events

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

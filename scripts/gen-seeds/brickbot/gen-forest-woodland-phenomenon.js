#!/usr/bin/env node
/**
 * BRICKBOT_FOREST_WOODLAND_PHENOMENON — built environmental drama in forest.
 * Audit 2026-06-05: 46 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_forest_woodland_phenomenon.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} WOODLAND-PHENOMENON entries for BrickBot's forest path — one big built environmental event in a forest brick diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC built environmental beat (firefly swarm, leaf-fall, mist, lightning-strike, fairy-circle glow, mushroom-cluster bloom, autumn-storm, snow-drift, fox-pounce, etc.) AND shows how it's BUILT (trans-yellow round-plates on clear rods, cotton-elements, modified plant-elements, etc.). Reads unmistakably brick.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 LIGHT-DRIVEN: sun-shaft god-rays, fairy-glow, firefly-cluster, bioluminescent mushroom ring
- ~5 WEATHER: rain-shower, mist roll-in, lightning-strike, snow-flurry, fog bank
- ~5 SEASONAL: autumn leaf-fall, blossom-petal drift, spring bud-burst, winter snow-load
- ~4 CREATURE EVENT: deer-bound across clearing, owl-hunt swoop, fox-pounce, bear-rise, wolf-howl, rabbit-flee
- ~4 FANTASY / FAE: fairy-portal opening, faerie-dance ring, wood-spirit manifest, glow-mushroom bloom
- ~3 GEOLOGIC / TREE-FALL: ancient tree-fall, root-uplift, mossy boulder collapse
- ~3 FIRE / CAMPFIRE: roaring campfire, forest-fire wall, smoke-column
- ~2 WATER: brook-cascade, waterfall mist, river-flood, beaver-dam
- ~1 RAINBOW after rain
- ~1 NORTHERN-LIGHTS over canopy
- ~1 BUTTERFLY MIGRATION across glade

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must mention WHAT + HOW it's brick-built + WHERE. Touchpoints:
"FIREFLY SWARM — dozens of trans-yellow + trans-clear 1×1 round-plates mounted on thin clear bar-rods at staggered heights across the clearing, a constellation of tiny warm point-lights weaving between trunks."
"SUSPENDED LEAF-FALL — autumn-orange + russet leaf-elements suspended on near-invisible clear rods mid-air as if mid-descent, scattered at varied heights and angles across the clearing path."
"COTTON-ELEMENT GROUND-MIST — low white cotton-batting + 1×1 white round-plate haze pooling between brick tree-trunks and over the trans-blue stream, softening village base-plates into mystery."

━━━ BANS ━━━
- NO photoreal vocab
- NO living-fluid verbs ("flows gently")
- NO licensed franchise names
- NO duplicating events

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

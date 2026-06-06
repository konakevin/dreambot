#!/usr/bin/env node
/**
 * BRICKBOT_AQUATIC_PHENOMENON — 50%-gated environmental drama for aquatic
 * dioramas. Audit 2026-06-05: 48 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_aquatic_phenomenon.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} AQUATIC PHENOMENON entries for BrickBot — ONE big built environmental event that drops into a surface or submerged brick diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body describing the built brick effect.

━━━ THE BAR ━━━
Every entry names a SPECIFIC environmental beat (rogue wave, sun-shafts, breaching whale, lightning strike, current eddy, fog roll, hurricane outer-band, breaking wave-curl, vortex, treasure-gleam, etc.) and shows how it's BUILT (trans-clear plates on clear rods, cotton-elements, layered trans-blue tiles, modified flame elements, etc.). The effect reads unmistakably BRICK — no photoreal water/foam/spray.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 LIGHT-DRIVEN: sun-shaft caustic pillars, surface-shimmer dapple, sun-ray god-rays, lightning bolt, sunrise band
- ~5 WAVE / SURF / WATER: rogue wave wall, breaking wave-curl, surf-line foam-burst, calm mirror-pool, tide pull
- ~4 WEATHER: storm-cloud bank, hurricane outer-band, rain-curtain, fog roll-in, dawn-mist
- ~4 CREATURE EVENT: whale breach, dolphin pod surf, shark feeding-frenzy, jellyfish bloom, sea-turtle hatch
- ~3 BUBBLE / FOAM: rising bubble-stream column, vent-bubble plume, surface-foam wash, dive-trail
- ~3 GEOLOGIC / VENT: hydrothermal vent plume, underwater volcano flare, geyser, lava-tube glow
- ~3 ICEBERG / FROZEN: calving glacier, drifting iceberg, pack-ice shelf, ice-flow break
- ~2 BIOLUMINESCENT EVENT: plankton bloom, jellyfish swarm, anglerfish lure, glowing reef-cluster
- ~2 TREASURE / WRECK: gold-glint shimmer through silt, treasure-spill, coral-encrusted reveal
- ~1 RAINBOW / TRANS-ARC over ocean
- ~1 WHIRLPOOL / VORTEX
- ~1 AURORA over arctic sea
- ~1 TIDAL POOL teem-burst

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include: WHAT the effect is + HOW it's brick-built + WHERE in the diorama. Touchpoints:
"RISING BUBBLE-STREAM COLUMN — a tall spine of trans-clear + white 1×1 round-plates threaded on clear bar-rods from a seafloor vent, a built shimmering pillar threading the dark-blue water."
"WHALE BREACH MID-LEAP — a brick humpback frozen mid-emergence, slope-plate body half-clear of the wave-tile sea, trans-clear spray plates cascading off the dorsal fin into the air."
"HYDROTHERMAL-VENT PLUME — a chimney of dark-grey round-bricks venting trans-cyan + trans-orange round-plate mineral-particles on clear rods, drifting upward in a built superheated column."

━━━ BANS ━━━
- NO photoreal vocab ("rippling water", "crashing wave spray")
- NO fluid-motion verbs ("flows", "cascades smoothly")
- NO living-creature behavior verbs ("hunts", "feasts hungrily")
- NO licensed franchise names
- NO mood-only language — name the brick build

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

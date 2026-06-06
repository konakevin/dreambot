#!/usr/bin/env node
/**
 * BRICKBOT_SPACE_COSMIC_PHENOMENON — built cosmic event drama.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_space_cosmic_phenomenon.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} COSMIC-PHENOMENON entries for BrickBot's space path — ONE big built cosmic event in a brick space diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC cosmic event (nebula cloud, supernova flash, black-hole pull, solar flare, comet tail, aurora, meteor shower, etc.) AND shows how it's BUILT (trans-magenta layered plates, trans-yellow round-plates, trans-black + dark-bley disc, etc.). Reads BRICK.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 NEBULAE: pillar nebula, magenta-cyan cloud, ring nebula, dust pillar
- ~4 STELLAR EVENTS: supernova flash, solar flare, stellar wind, binary-star
- ~4 BLACK-HOLES: event horizon pull, accretion ring, lens-distort
- ~4 COMET / METEOR: comet tail, meteor shower, fireball streak, asteroid pulse
- ~3 AURORA: planetary aurora, magnetic-storm light, polar shimmer
- ~3 SOLAR EVENTS: corona flare, prominence loop, solar wind streamer
- ~3 PLANETARY: ring-system Saturn-like, gas-giant storm, dust-storm Mars
- ~3 EXOPLANET: lava-world glow, ice-world reflectivity, ocean-world shimmer
- ~3 DEEP-SPACE: cosmic-microwave background hint, distant-galaxy spiral, void-darkness
- ~2 LIGHTSPEED / WARP: warp-tunnel arc, hyperspace streak, jump-flash
- ~2 PORTAL / WORMHOLE: trans-cyan disc, dimensional rift
- ~2 ASTEROID FIELD: belt cluster, asteroid collision
- ~1 DARK-MATTER cloud
- ~1 STAR-NURSERY birth
- ~1 GALACTIC-CORE supermassive

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include: WHAT + HOW it's brick-built + WHERE. Touchpoints:
"NEBULA TOWERING CLOUD — trans-magenta + trans-cyan + trans-purple layered plate-stack fills entire upper-half as deep-distance background, scattered 1×1 white round-plate stars"
"SUPERNOVA FLASH ON HORIZON — blinding-white 4×4 round-tile flash with trans-yellow + trans-orange shockwave ring expanding outward across the deep-distance background"
"BLACK HOLE EVENT-HORIZON PULL — circular trans-black + dark-bley disc at scene-center with trans-blue accretion-ring of plates wrapping outward, starfield distortion implied"

━━━ BANS ━━━
- NO photoreal vocab
- NO licensed franchise names
- NO duplicating events
- NO mood-only descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

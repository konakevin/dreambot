#!/usr/bin/env node
/**
 * BRICKBOT_LANDSCAPE_ATMOSPHERE — atmospheric depth/clarity/mist for epic
 * vista dioramas. Audit 2026-06-05: 46 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_landscape_atmosphere.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERE entries for BrickBot's landscape path — epic natural-vista brick MOC photography (mountains / glaciers / canyons / coastal cliffs / mesas). Each entry: ONE sentence, 25-40 words, naming atmosphere/clarity/depth/mist quality + how it reads in built brick form.

━━━ THE BAR ━━━
Every entry names a specific atmospheric condition (cloud-sea, valley-mist, sandstorm haze, alpine clarity, monsoon downpour, etc.) AND describes how it's BUILT (cotton-elements, white round-plates, trans-clear plates, layered slope-bricks, etc.). The vista MUST read brick — never photoreal landscape.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 CLOUD / MIST: low cloud-sea below peaks, valley-mist pooling, mountain-cap cloud, morning fog rolling, dawn-mist
- ~4 ALPINE CLARITY: crisp deep-distance, clean cold-air sky, far ridges fading lighter
- ~4 STORM / WEATHER: storm-cell forming, lightning-strike on ridge, blizzard incoming, dust-storm wall
- ~3 SANDSTORM / DESERT-HAZE: tan dust-haze obscuring far peaks, mirage shimmer
- ~3 RAINFOREST / JUNGLE: humid green haze, monsoon downpour, mist rising from canopy
- ~3 ARCTIC / POLAR: glacial-mist plumes, ice-fog, polar night clarity
- ~3 VOLCANIC: ash plume, sulfur haze, smoke column
- ~2 GOLDEN-HOUR / SUNSET HAZE: warm amber dust hanging in valley
- ~2 RAINBOW / RAIN-AFTER: trans-arc brick rainbow, post-storm clarity
- ~2 NIGHT-SKY / STAR-FIELD clarity: deep-distance dark
- ~1 SAHARA / DESERT clear-air clarity
- ~1 BAYOU / SWAMP-HAZE: low-mist over flooded plates

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"Crisp-clear deep-distance — no cloud, a clean pale-blue brick sky-baseplate, far ridges in lighter-grey slope-bricks suggesting depth, every brick edge sharp, a high cold dryness."
"Low cloud-sea below the peaks — a level mass of white 1×1 round-plates plus cotton-elements massed at mid-mountain height, summits rising above the built cloud-sea like sun-warmed islands."
"Morning valley-mist — cotton-elements plus white round-plates pooled along the valley floor between slope-brick walls, the upper ridges clear above, a still built softness."

━━━ BANS ━━━
- NO photoreal landscape vocab ("sweeping vista", "majestic")
- NO fluid-motion verbs ("flows", "drifts gently")
- NO photographer name-drops
- NO mood-only descriptors — name source + composition

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

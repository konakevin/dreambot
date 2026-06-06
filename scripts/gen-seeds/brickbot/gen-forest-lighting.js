#!/usr/bin/env node
/**
 * BRICKBOT_FOREST_LIGHTING — forest LEGO MOC lighting.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_forest_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's forest path — enchanted/woodland brick MOC dioramas. Each entry is ONE sentence, 25-40 words, naming light source / direction / color quality + how it falls across the brick.

━━━ THE BAR ━━━
Every entry names a SPECIFIC source (dappled canopy, sun-shaft god-rays, fairy-glow, firefly-cluster, campfire, lantern, moonlit, etc.) PLUS direction PLUS color quality PLUS how it touches the brick (warm pools on mossy plates, trans-glow on toadstool-caps, etc.).

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 DAPPLED / SUN-SHAFT (overhead canopy): warm gold breaking through leaf gaps, trans-clear shafts piercing down
- ~4 FAIRY-GLOW / TRANS-CYAN / TRANS-PINK enchanted ambient — bioluminescent fungus, fae-spark, glow-elements rising
- ~4 CAMPFIRE / FOREST-FIRE warmth — trans-orange flame-glow lighting a circle of minifigs, deep blue night beyond
- ~3 LANTERN / TORCH along a forest path — warm trans-amber point-light, deep green shadow elsewhere
- ~3 MOONLIT (silver-blue or full-moon) — cool silver glancing across brick canopy and clearing
- ~3 FIREFLY-CLUSTER — scattered trans-yellow point-lights threading the trunks
- ~3 OVERCAST / FOG — diffuse cool grey-green flat-light, mist between the trunks
- ~2 DAWN / SUNRISE pink-amber raking across forest-floor — early morning mist with golden side-light
- ~2 DUSK / GOLDEN-HOUR low warm sun raking through trunks, long shadows
- ~2 STORM / RAIN-CURTAIN — dark blue-green ambient, trans-clear rain-shafts
- ~1 SNOW-COVERED MOON-LIT — silver-blue on white-plate snow under bare brick branches
- ~1 BIOLUMINESCENT MUSHROOM-CIRCLE point-light — trans-cyan halo on a single clearing

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"Dappled green-gold light raking down through gaps in the brick tree-tops, casting hard-edged warm pools onto the green-plate floor with cool plastic shadow between trunks."
"Soft trans-cyan fairy-glow rising from clustered glow-elements near the hollows, under-lighting the brick toadstool caps and minifig faces in cool aquamarine, with deep green shadow beyond."
"Warm campfire trans-orange flame-glow at scene-center, lighting the gathered minifigs hot from below, the dark dark-green forest beyond falling into deep night-blue shadow."

━━━ BANS ━━━
- NO photoreal water/forest vocab
- NO fluid-motion verbs ("light dances", "flows through leaves")
- NO mood-only ("cinematic lighting") — name source + direction + color
- NO photographer name-drops

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

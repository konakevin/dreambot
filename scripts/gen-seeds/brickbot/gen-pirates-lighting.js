#!/usr/bin/env node
/**
 * BRICKBOT_PIRATES_LIGHTING — light for pirate brick MOC dioramas.
 * Audit 2026-06-05: 47 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_pirates_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's pirates path — Golden-Age pirate brick MOC photography. Each entry: ONE sentence, 25-40 words, naming light source + direction + color + how it touches the brick.

━━━ THE BAR ━━━
Every entry names a specific source (high-noon tropical / golden-hour raking / full-moon overhead / cannon-flash / lantern-glow / sunset / storm-flash / etc.) PLUS direction PLUS color quality PLUS effect on the brick (warm pools on tile-deck, hot spike on figurehead, etc.).

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 GOLDEN-HOUR / SUNSET: warm amber raking the deck, long shadows
- ~5 HIGH-NOON TROPICAL: harsh overhead sun, short hard shadows
- ~4 FULL-MOON / NIGHT-SEA: silver-blue moon overhead, deep shadows
- ~4 STORM / OVERCAST: diffuse cool grey, flat lighting, no strong shadow
- ~3 CANNON-FLASH FIRELIGHT: trans-orange flash from a firing cannon, hot pool
- ~3 LANTERN / OIL-LAMP INTERIOR: warm trans-amber lamp-glow in cabin/tavern
- ~3 LIGHTNING-FLASH: trans-yellow bolt momentarily lighting ship deck
- ~3 SUNRISE / DAWN: low pink-amber side-light, calm morning sea
- ~3 FOG / MIST: diffuse pale grey-blue, ship emerging from haze
- ~3 TREASURE-GLINT / GOLD-LIGHT: trans-yellow glint from gold-tile piles
- ~2 FIRE / BURNING-SHIP: trans-orange flame-light from raging fire
- ~2 BLUE-HOUR / TWILIGHT: cool dim sea, last sun on horizon
- ~2 STAR-FIELD / NIGHT-CLEAR: faint blue ambient, star-tile sparkles
- ~1 BIOLUMINESCENT SEA: trans-green glow in water
- ~1 SOLAR-ECLIPSE shadow

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"HARSH-NOON TROPICAL OVERHEAD — sun directly overhead, harsh-white color quality, short sharp shadows directly underfoot, zero atmospheric softening, maximum-contrast every brick face"
"GOLDEN-HOUR RAKING SIDELIGHT — late-afternoon sun low on the horizon raking horizontally from one side, warm amber color quality on lit surfaces, long deep-violet shadows stretching"
"FULL-MOON OVERHEAD COOL — directly overhead full moon, cool silver-blue color quality on all upward surfaces, deep blue-black undersides, vertical shadows compressed under the ship"

━━━ BANS ━━━
- NO photoreal vocab
- NO fluid-motion verbs
- NO photographer name-drops
- NO mood-only descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

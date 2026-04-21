#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for CuddleBot — soft particles, warm glows, and gentle atmospheric elements. Always wholesome + soft + warm. Never harsh / dark.

Each entry: 8-16 words. One specific soft atmospheric element.

━━━ CATEGORIES ━━━
- Fairy dust (drifting sparkles, glittering motes in sunbeam)
- Flower petals (drifting rose / sakura / daisy petals)
- Warm firefly glow (tiny floating lights)
- Gentle pastel steam (from tea / hot chocolate / bakery)
- Sparkle accents (twinkling stars around creature, soft light-spots)
- Dandelion fluff (drifting puffs on breeze)
- Soft snow drift (tiny flakes, backlit)
- Pollen motes (golden dust in sunbeam)
- Bubble drift (soap bubbles floating)
- Heart particles (floating tiny hearts for emotional beat)
- Music notes (drifting notes if musical scene)
- Warm lantern glow (backlit warm halo)
- Candle glow (soft warm flicker)
- Moonlight silver (gentle, never stark)
- Drifting leaves (autumn golden falling)
- Soft rainbow mist (pastel prismatic haze)
- Glittery auras (soft magical halo)
- Tiny stars (pinpoint twinkle scattered)
- Clover-fluff drift (tiny white seed puffs)
- Cotton-candy mist (fluffy pastel cloud atmosphere)
- Snowflake glitter (sparkling snow in backlight)

━━━ RULES ━━━
- Always soft / warm / wholesome
- Never harsh / dark / intense
- Adds cuteness + cozy depth

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

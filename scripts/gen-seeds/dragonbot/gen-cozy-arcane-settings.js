#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/cozy_arcane_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COZY INTIMATE FANTASY SPACE descriptions for DragonBot. These exist in the same epic high-fantasy universe as dragons and vast landscapes — but these are the WARM PRIVATE CORNERS of that world. The viewer should want to sit down and stay.

Each entry: 15-30 words. One specific cozy space.

━━━ SCALE: INTIMATE, NOT GRAND ━━━
These are NOT cathedral halls or vast libraries. These are the warm private spaces:
- A wizard's private study off the main tower — roaring hearth, deep armchair, desk covered in scrolls
- The hearthside corner of a dwarven forge-hall — stone bench with furs, ale warming by the fire
- A dragon-keeper's quarters carved into warm volcanic rock — lanterns, worn leather gear hanging
- An elven tree-house bedroom — soft light through woven walls, warm blankets, candles
- A potion-master's personal workbench — copper instruments, bubbling flasks, warm lamplight
- A ranger's mountain lookout — fur-draped chair by iron stove, snow falling past the window
- A ship captain's cabin on a magical vessel — warm wood, maps pinned to walls, lantern swaying
- A herbalist's drying room — bundles of herbs hanging from ancient beams, warm afternoon sun
- A blacksmith's private quarters above the forge — heat rising through floorboards, worn tools on walls
- A monk's meditation alcove in a mountain monastery — single candle, warm stone, silence
- A tavern's best corner booth — firelight, worn wood table, leaded glass window showing snow

━━━ WHAT MAKES THEM COZY ━━━
- WARM LIGHT: hearth-fire, candles, oil lanterns, forge-glow, afternoon sun through old glass
- INTIMATE SCALE: one room, one corner, one nook — not a vast hall
- TEXTURES: worn wood, aged leather, rough-hewn stone, tarnished metal, dripping wax, fur pelts
- WARMTH CONTRAST: cold world outside (snow, storm, night) vs warm golden interior
- Still unmistakably HIGH-FANTASY — rune-carved stone, magical artifacts, enchanted light

━━━ RULES ━━━
- No people or creatures
- No domestic clutter (no teacups, no cats, no food) — architecture and light create the warmth
- Every space must feel like it belongs in a world of dragons and epic landscapes
- Each entry unique in location type

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

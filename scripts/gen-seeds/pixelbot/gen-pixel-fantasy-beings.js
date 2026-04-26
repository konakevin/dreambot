#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_fantasy_beings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FANTASY BEING descriptions for PixelBot's pixel-fantasy path. Each entry is a generic fantasy creature or character archetype — NO named IP characters. The setting will be picked separately.

Each entry: 10-20 words. A specific fantasy being with visual detail.

━━━ CATEGORIES TO COVER ━━━
- Dragons (various sizes, elements, poses — NOT just "a dragon")
- Wizards/mages (different schools, ages, gear)
- Knights/warriors (different armor, weapons, mounts)
- Mythic creatures (phoenix, griffin, unicorn, basilisk, hydra)
- Elves/fae (forest, dark, high, wild)
- Undead (skeleton king, ghost knight, lich, wraith)
- Elementals (fire, ice, stone, storm, nature)
- Small folk (goblins, kobolds, imps, sprites)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: creature type + visual distinguisher. Two dragons with different elements = OK. Two generic fire dragons = too similar.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

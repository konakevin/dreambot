#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_female_hair.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HAIR STYLE descriptions for a female cyborg character. Each describes one specific hairstyle — color, length, texture, and any mechanical/sci-fi elements woven in.

Each entry: 8-15 words. One hair style with color + length + texture + optional sci-fi element.

━━━ CATEGORIES (spread evenly) ━━━
- Long flowing styles (waves, straight, curls — various colors)
- Short/cropped styles (bobs, pixie cuts, buzzcuts, undercuts)
- Braided/structured styles (cornrows, fishtails, crown braids, twists)
- Sci-fi enhanced (fiber-optic strands, holographic shimmer, chrome underlayer, glowing roots)
- Gravity-defying (floating weightlessly, streaming upward, plasma-infused drift)
- Natural textures (tight coils, loose curls, kinky, wavy, pin-straight)
- Unusual colors (platinum, violet, teal, copper wire, ash, silver, crimson, white)

━━━ RULES ━━━
- Feminine-coded styles — these are for a beautiful female cyborg
- Mix natural hair textures with sci-fi augmentation
- Vary color widely — not all platinum/silver
- Some purely natural, some fully sci-fi, most a blend

━━━ DEDUP ━━━
No two entries should share the same color AND same length AND same texture.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

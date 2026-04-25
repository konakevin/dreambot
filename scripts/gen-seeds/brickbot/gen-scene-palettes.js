#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/scene_palettes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE descriptions for LEGO diorama scenes. Each describes a specific combination of LEGO brick colors that set the scene's overall mood.

Each entry: 10-20 words. One specific color palette using real LEGO color names where possible.

━━━ LEGO COLORS TO USE ━━━
- Classic: red, blue, yellow, green, white, black
- Earth: tan, dark tan, dark brown, sand green, olive green
- Cool: medium blue, dark blue, sand blue, medium azure
- Warm: orange, bright light orange, dark red, coral
- Grey: light bluish gray, dark bluish gray, flat silver
- Special: transparent clear, trans-light blue, trans-neon green, trans-orange, pearl gold, chrome silver
- Dark: black, dark brown, dark red, dark green, dark purple

━━━ RULES ━━━
- Use actual LEGO color names when possible
- Describe the mood the palette creates
- Mix 3-5 colors per palette
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

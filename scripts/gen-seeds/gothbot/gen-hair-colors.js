#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/hair_colors.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} HAIR COLOR descriptions for GothBot's character paths. Each entry is a SHORT phrase (3-8 words) describing ONLY a specific hair color/tone. Shared across male AND female gothic-horror characters.

━━━ COLOR SPECTRUM (enforce even distribution across ${n}) ━━━
- JET BLACKS (3-4) — blue-black, oil-slick black, raven-black with violet sheen, true-black
- WHITES / SILVERS (3-4) — platinum-white, moonlit-silver, ash-white, pearl-white, silver-streaked
- REDS (3-4) — blood-crimson, deep auburn, copper-red, wine-dark burgundy, fire-red
- DARK BROWNS (2-3) — espresso, walnut, mahogany, deep umber
- UNNATURAL / SUPERNATURAL (3-4) — violet-streaked, frost-blue tipped, white-with-black-roots, witch-green strands
- GREYS (2-3) — storm-grey, iron-grey, silver-streaked black
- WARM TONES (2-3) — dark bronze, honey-amber, tawny-gold

━━━ RULES ━━━
- Each entry is ONLY the color — no hairstyle, no length, no texture
- Keep it evocative and gothic ("raven-black with blue sheen" not just "black")
- No two entries should describe the same color
- Mix natural and supernatural tones

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

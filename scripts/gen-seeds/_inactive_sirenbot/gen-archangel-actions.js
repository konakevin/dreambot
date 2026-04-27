#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/archangel_actions.json',
  total: 50,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ARCHANGEL ACTION descriptions for SirenBot's archangel path. A female warrior angel of light — Diablo Tyrael/Auriel energy. Wings of luminous energy tendrils (NOT feathers), ornate celestial armor, divine weapons. She is POWERFUL and BEAUTIFUL.

Each entry: 10-20 words. A specific freeze-frame action moment.

━━━ CATEGORIES TO COVER ━━━
- Descending from the heavens, light-tendril wings blazing wide, flaming sword drawn overhead
- Thrusting a spear of pure light through a demon's chest, radiance exploding outward
- Hovering above a battlefield, arms outstretched, holy light cascading down like rain on allies below
- Pulling her hood back to reveal her face, eyes blazing with divine fire
- Catching a falling mortal mid-air, one arm around them, wings flaring for balance
- Planting a divine banner into scorched earth, light erupting from the impact point
- Kneeling to touch scorched ground, holy energy spreading outward in a golden wave
- Deflecting a dark spell with her shield, runes flaring white-hot on impact
- Drawing a flaming sword from a stone altar, light climbing the blade
- Unfurling her light-tendril wings to full span on a cathedral rooftop, silhouetted against the sun

━━━ RULES ━━━
- NO sitting still, no meditating, no standing passively, no posing
- Every entry is MID-ACTION — dynamic freeze-frame
- She is a warrior first — divine combat, flight, holy power
- Mix combat actions with moments of divine grace (blessing, healing, judging)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: action verb + body position + power expression (light/weapon/flight/blessing).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

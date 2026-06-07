#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_carnival_food_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LIGHTING DIRECTIONS for YumBot carnival-food renders. Tuned for the 6 carnival sub-themes (cotton-candy / funnel-cake / caramel-apple / snow-cone / pretzel / corn-dog).

Each entry: 14-22 words. ONE specific lighting (source + quality + tint).

━━━ DISTRIBUTION ━━━

- 4 BRIGHT SUNNY MIDWAY (warm overhead sun + awning shadow)
- 4 STRING-LIGHT GLOW (warm bulb-strands overhead, festive ambient)
- 4 NEON-CARNIVAL POP (warm pink + cool blue + chartreuse neon mix)
- 4 GOLDEN-HOUR FAIRGROUND (warm sweep + ride-silhouette behind)
- 4 INTIMATE BOOTH WARM (single warm spotlight, deep festive surround)
- 5 DUSK CARNIVAL MAGIC (blue-hour sky + warm booth glow + string-lights coming alive)

━━━ EXAMPLES ━━━

"Bright warm overhead sunny midway light with subtle awning-shadow protecting subject"
"Warm string-light glow overhead with festive ambient drape and gentle bulb-bokeh"
"Warm pink and cool blue neon-carnival mix with subtle chartreuse glow on subject"
"Golden-hour fairground warm sweep with subtle silhouette of rides in background"
"Intimate warm booth spotlight with deep festive surround fading off"
"Dusk carnival magic with cool blue-hour sky and warm booth glow first lighting up"

━━━ HARD BANS ━━━

- NO photographer name-drops, camera specs, lens language
- NO color palette names
- NO time-of-day labels
- NO mood adjectives

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/twilight_village_time_of_day.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} TIME-OF-DAY descriptions for ChibiBot twilight-village — biome-fitting lighting registers. Pixar painterly storybook.

Each entry: 10-18 words. ONE specific time-of-day lighting state.

━━━ DISTRIBUTION ━━━

- 35% DEEP-VIOLET-DUSK (deep-violet-magenta dusk sky with first cottage-lanterns lit / late-blue-hour with lanterns glowing / pre-night magic-hour)
- 25% LANTERN-LIT-NIGHT (full night with every cottage and lantern glowing warm-amber / paper-lantern strands lit / festival-glow night)
- 15% MOONLIT-NIGHT (silver moonlit village with cool-blue moon-shadows and warm cottage windows / full-moon over rooftops)
- 10% MAGIC-HOUR-PINK (impossibly pink-magenta dusk with first stars / saturated dream-twilight)
- 10% FIREFLY-DUSK (warm dusk-haze with fireflies emerging / soft pink-purple sky with insect-glow)
- 5% PREDAWN-VIOLET (deep-pre-dawn violet sky with last lanterns still lit / blue-hour fading toward dawn)

━━━ HARD MANDATES ━━━

- Match the twilight-biome register
- Pixar painterly storybook

━━━ HARD BANS ━━━

- NO grim / bleak time
- NO harsh / dramatic light
- NO setting / creature / activity verbs
- NO bright noon / NO daylight scenes — always twilight or night. NO snow. NO underwater.

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

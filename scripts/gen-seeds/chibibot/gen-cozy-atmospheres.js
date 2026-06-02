#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_atmospheres.json',
  total: 60,
  batch: 20,
  metaPrompt: (
    n
  ) => `You are writing ${n} COZY ATMOSPHERIC DETAIL descriptions for ChibiBot — the haze, dust, steam, condensation, smoke, particles in the air that make a room feel TANGIBLY warm. 15-30 words each.

━━━ THE FORMULA ━━━
Each entry names a specific atmospheric phenomenon visible in the room/scene that makes warmth and time-of-day FEELABLE. These are subtle but mandatory cozy ingredients.

━━━ CATEGORIES ━━━
- Steam / vapor: steam rising from kettle / mug / bath / kitchen pot / espresso machine / hot soup / warm bread on cooling rack
- Dust motes: dust motes spiraling in shaft of golden light / floating in firelight / catching the lamp-pool
- Smoke / wisps: thin smoke from extinguished candle / curl of incense / pipe smoke (faint, never near a person) / wisp of woodsmoke
- Heat shimmer: warmth distortion above radiator / over fire / above stove / above kettle
- Condensation: window panes fogged at corners / breath-fog on cold glass / kettle's lid beaded with droplets / steamy bathroom mirror
- Atmospheric haze: warm dim haze in cabin (smoke + steam combined) / honey-tinted air / amber dusk haze
- Particles in light: tea-leaves settling in cup / flour-dust in kitchen beam / paper-dust in library beam
- Gentle motion: curtain barely shifting in draft / steam slowly curling / candle-flame flickering / slow drift of single feather

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. Specific named phenomenon (steam / dust / smoke / haze / etc.)
2. Source of the phenomenon
3. WHERE it's visible (in the lamp pool / through the window / above the kettle)
4. Subtle motion or character (slow / curling / drifting / swirling)

━━━ HARD BANS ━━━
- NO surreal: no glowing dust, no impossible particles
- NO smoke from cigarettes or near people
- NO outdoor-only weather (those go in window-views pool)

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "Steam rising in slow curls from the cast-iron kettle, catching the lamp-glow and softening the air above the stove with honey-tinted vapor"
EX-2: "Dust motes spiraling in the single shaft of golden afternoon light, drifting slow as falling snow through the warm intimate haze"
EX-3: "Window panes fogged thick at the corners with condensation, the warmth inside meeting the cold outside, a finger could draw a heart"
EX-4: "Faint curl of pale smoke from a just-extinguished beeswax candle, tracing upward through the lamp-pool of light, a single wisp"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * ChibiBot bath-time SIGNATURE — a single ~12-word atmospheric micro-detail
 * woven into the bath scene to give each render a distinct flavor.
 * Different from the legacy surprise_element / phenomenon axes — this is
 * NOT a secondary subject and NOT a magical event stacked on top; it's a
 * specific small flourish that the scene incorporates naturally.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bath_time_signature.json',
  total: 100,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SIGNATURE DETAILS for ChibiBot bath-time renders. Each entry is a single ~10-15 word atmospheric micro-detail that gives a bath scene a distinct, specific flavor.

Each entry: 10-15 words. ONE specific evocative detail that can be woven into a bath scene without competing with the bath, the creature, or the location.

━━━ FORMAT — small, specific, atmospheric ━━━

"Snow drifting past the window in soft cotton flakes, settling on the sill."
"Fireflies blinking lazily through the steam, drifting up toward the rafters."
"Petals from a nearby cherry tree drifting onto the water surface, pink and pale."
"Rainbow caustics from a soap bubble dancing across the bath rim."
"A small kettle whistling softly on a side burner, steam joining the bath steam."
"Light rain pattering against the window, droplets racing each other down the glass."
"Aurora ribbons glowing through the skylight, reflected faintly in the bath water."
"Wisteria petals tumbling slowly through the open window in soft purple drifts."
"A trail of soap bubbles drifting up toward the ceiling and out the window."
"A folded paper boat bobbing gently across the foam to the far side of the tub."

━━━ VARIETY ACROSS FLAVOR TYPES (roughly 3 entries each) ━━━

- Weather flourishes — snow / rain / mist / pollen / petals through windows
- Light + reflection — caustics / rainbows / sunbeams / aurora reflections / candlelight glints
- Tiny ambient life — fireflies / butterflies / dragonflies / a small bird perched at the window
- Bath-toy moments — paper boat / rubber duck adrift / soap bubble trails / floating wood-carved animal
- Nature creeping in — wisteria petals / ivy reaching through a crack / a stem of jasmine across the rim
- Sound made visible — steam from a side kettle / whistle of a teapot / soft chime from a wind-bell
- Cozy domestic flavor — a soft towel slipping off a stool / a candle flame guttering and steadying

━━━ THE BAR — every entry meets all 3 ━━━

- A SPECIFIC small flourish (not "magical mood" or "warm vibes")
- Picture-able as one tiny detail in the corner of the frame
- Naturally weaves into the bath scene — does not compete with the bath as hero

━━━ OUTPUT ━━━

JSON array of ${n} strings. One per line. No preamble, no numbering, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

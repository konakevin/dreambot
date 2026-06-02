#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_village_time_of_day.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} TIME-OF-DAY descriptions for ChibiBot aquatic-village — biome-fitting lighting registers. Pixar painterly storybook.

Each entry: 10-18 words. ONE specific time-of-day lighting state.

━━━ DISTRIBUTION ━━━

- 25% UNDERWATER SUN-DAPPLED (warm sun-shafts cutting through teal water above the village / dappled water-caustics on every surface / sun-pillars piercing deep blue)
- 20% BIOLUMINESCENT NIGHT (deep-violet water with bioluminescent-coral-glow / glowworm-jellyfish drift / cool turquoise village-glow)
- 15% GOLDEN-HOUR COAST (warm peach-amber sun across the tidepool/shore at golden hour / honey-gold low-angle water-light)
- 15% DUSK-COASTAL (lavender-pink-blue dusk with first coral-lanterns lit / blue-hour over the shoreline)
- 10% MIDDAY-CLEAR-WATER (bright clear noon water with maximum sun-caustic dappling / hot midday in tropical clear-water)
- 10% MOONLIT-NIGHT (moonlit surface-water with silver-shimmer / underwater moonbeams creating ethereal cool glow)
- 5% PEARLESCENT-DAWN (impossibly soft pearl-pink dawn / iridescent dawn-light through water)

━━━ HARD MANDATES ━━━

- Match the aquatic-biome register
- Pixar painterly storybook

━━━ HARD BANS ━━━

- NO grim / bleak time
- NO harsh / dramatic light
- NO setting / creature / activity verbs
- NO snow / NO desert / NO Mediterranean architecture — strictly underwater or coastal

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

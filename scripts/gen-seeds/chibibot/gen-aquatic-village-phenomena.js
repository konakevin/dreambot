#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_village_phenomena.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} ENVIRONMENTAL PHENOMENA for ChibiBot aquatic-village — atmospheric/weather/magical layers that fire on 60% of renders, adding a wow-moment.

Each entry: 12-25 words. ONE specific environmental phenomenon. Stack on base lighting.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% CAUSTICS / WATER-LIGHT (sun-caustics dancing across every surface / dappled water-light patterns / sun-pillar shafts cutting through water)
- 15% BIOLUMINESCENCE (bioluminescent coral pulsing soft glow / glowing-jellyfish drifting / glow-plankton swirl)
- 15% BUBBLE-STORM or BUBBLE-CASCADE (giant bubble-cascade from a chimney / bubble-stream tornado over the village / sparkling bubble-cloud)
- 10% FISH-MIGRATION (massive fish-school sweeping past / drifting school filling the background / luminous-fish migration)
- 10% MIST / FOG-WATER (low coastal-fog rolling in / mist-over-tidepool / sea-mist haze)
- 10% MOON-OR-SUN-SHIMMER (moon-shimmer across surface-water / sun-glints across coral / lunar-glow into the village)
- 10% MAGICAL-CURRENT (visible warm-current flowing through the village / glowing current-thread / aurora-current)
- 5% RAIN-ON-SURFACE (gentle rain dimpling the surface-water above / rain-droplets piercing into the underwater village)
- 5% RAINBOW-PRISM (refraction-rainbows from coral-crystals / prism-rainbows from bubble-bursts)

━━━ HARD MANDATES ━━━

- Always warm-cozy bias — phenomenon adds magic without making the scene grim
- Pixar painterly storybook
- Visible in the rendered image (specific, not abstract)

━━━ HARD BANS ━━━

- NO scary / threatening / apocalyptic weather
- NO setting / creature / activity language
- NO snow / NO desert / NO Mediterranean architecture — strictly underwater or coastal

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cottagecore_village_phenomena.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} ENVIRONMENTAL PHENOMENA for ChibiBot cottagecore-village — atmospheric/weather/magical layers that fire on 60% of renders, adding a wow-moment.

Each entry: 12-25 words. ONE specific environmental phenomenon. Stack on base lighting.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% WISTERIA-PETAL-DRIFT or CHERRY-BLOSSOM (wisteria-petals raining gently / cherry-blossom-petal flurry / dandelion-seed drift)
- 20% GOLDEN-LIGHT (golden-light-shafts breaking through clouds onto the village / shimmering warm-light haze)
- 15% MIST / FOG (low pearl-mist over the village at dawn / morning-fog through the wisteria / soft-English-fog)
- 10% RAINBOW (perfect rainbow arch over the cottages / sun-shower with rainbow / double-rainbow)
- 10% BUTTERFLY / BEE-SWARM (butterflies and bees darting through the air / a single butterfly-cloud)
- 10% RAIN-COZY (gentle rain on cottage-roofs with warm windows / fresh-rain just ending)
- 10% AURORA-FAIRYTALE (impossibly soft fairy-glow / will-o-wisp-cloud / faint-magical-shimmer)
- 5% SUMMER-STORM-DISTANT (distant gentle thunderhead with rainbow-arch returning)

━━━ HARD MANDATES ━━━

- Always warm-cozy bias — phenomenon adds magic without making the scene grim
- Pixar painterly storybook
- Visible in the rendered image (specific, not abstract)

━━━ HARD BANS ━━━

- NO scary / threatening / apocalyptic weather
- NO setting / creature / activity language
- NO snow / NO desert / NO underwater / NO ultra-modern architecture

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/twilight_village_phenomena.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} ENVIRONMENTAL PHENOMENA for ChibiBot twilight-village — atmospheric/weather/magical layers that fire on 60% of renders, adding a wow-moment.

Each entry: 12-25 words. ONE specific environmental phenomenon. Stack on base lighting.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% FIREFLY-SWARM (drifting firefly-trails throughout the scene / dense firefly-meadow swarm / glowing-insect-cloud)
- 20% PAPER-LANTERN-FLOAT (sky-lanterns floating up in clusters / paper-lantern-orbs ascending / festival-lantern-release)
- 15% MOONLIGHT (moonlight-shafts cutting through clouds / silver-moonbeams reflecting on water / full-moon overhead)
- 10% TWILIGHT-MIST (low pearl-mist drifting through lantern-light / dewy-mist on a moonlit meadow / soft-twilight-fog)
- 10% BIOLUMINESCENCE (bioluminescent-flowers glowing in beds / glowworm-trail-constellations / glowing-mushroom-paths)
- 10% AURORA-PURPLE (violet-magenta aurora-shimmer in the deep-violet sky / soft magical-aurora drift)
- 5% STAR-SHOWER (meteor-shower visible / shooting-stars streaking / cosmic-glitter-dust)
- 5% RAIN-LANTERN (gentle rain catching lantern-light / dew-rain glinting / glistening-wet-stone reflections)

━━━ HARD MANDATES ━━━

- Always warm-cozy bias — phenomenon adds magic without making the scene grim
- Pixar painterly storybook
- Visible in the rendered image (specific, not abstract)

━━━ HARD BANS ━━━

- NO scary / threatening / apocalyptic weather
- NO setting / creature / activity language
- NO bright noon / NO daylight scenes — always twilight or night. NO snow. NO underwater.

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_scale_decor.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DECOR ACCENT items for YumBot scale-twist renders. Each entry is ONE prop / decoration tuned to one of the 6 scale contexts (giant-real-world / microscopic / food-island / chocolate-river / underwater / food-in-space). The render's brief picks 2-4 per shot.

Each entry: 8-16 words. ONE specific decor item.

━━━ DISTRIBUTION ━━━

- 4 URBAN PROPS (tiny taxi / lamppost / hot-dog cart / pretzel-stand / city-bus stop — giant-real-world)
- 4 MICRO PROPS (sugar-grain boulder / crumb-cliff / sprinkle-shard / single-pollen-grain / drop-of-syrup)
- 4 ISLAND PROPS (frosting-palm-tree / gumdrop-shell / candy-cane-flagpole / sponge-rock / sprinkle-sandcastle)
- 4 RIVER PROPS (marshmallow-buoy / candy-cane-arch / sugar-cane-stalk / lollipop-tree / chocolate-rapids-splash)
- 4 UNDERSEA PROPS (frosting-coral / gumdrop-sea-urchin / cotton-candy-kelp / pearl-bubble / sponge-anemone)
- 5 COSMIC PROPS (comet-cookie-trail / asteroid-cookie / star-sprinkle / planet-cake-ring / spaceship-cone)

━━━ EXAMPLES ━━━

"A tiny yellow taxi parked at the curb in the giant scene"
"A boulder-sized rainbow sprinkle at micro scale"
"A frosting-palm-tree leaning over the cake-beach"
"A glossy candy-cane bridge arching over the chocolate river"
"A gumdrop sea-urchin on the frosting-coral floor"
"A small comet-cookie streaking past with a sugar-dust trail"

━━━ HARD MANDATES ━━━

- Self-contained — clean when 2-4 combined per render
- Specific item, not a category

━━━ HARD BANS ━━━

- NO color / palette / lighting language
- NO companion creatures
- NO camera / framing language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

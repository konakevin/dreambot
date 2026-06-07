#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_narrative_decor.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DECOR ACCENT items for YumBot narrative-action renders. The render's brief picks 2-4 per shot.

Each entry: 8-16 words. ONE specific decor item.

━━━ DISTRIBUTION ━━━

- 4 KITCHEN PROPS (mini rolling-pin / wooden-spoon / flour-sack / baking-tin / measuring-cup)
- 4 GARDEN PROPS (wicker harvest basket / tiny shears / garden-spade / wood-trellis / watering-can)
- 4 SHOP-WINDOW PROPS (display tier / brass-edge / chalkboard-menu / window-grille / shop-bell)
- 4 PARADE PROPS (mini drum / bunting-flag / confetti-handful / float-streamer / parade-banner)
- 4 TEA-PARTY PROPS (mini teapot / tea-cup-and-saucer / sugar-cube-bowl / lace-tablecloth / silver-spoon)
- 5 DELIVERY PROPS (paper-airplane / mini-bicycle / cobblestone-pebble / paper-package / twine-bow)

━━━ EXAMPLES ━━━

"A small wooden rolling-pin beside the dough"
"A woven wicker harvest basket with handle in the foreground"
"A mini chalkboard menu propped against the display"
"A tiny brass drum with twine wrapping"
"A small ceramic teapot with a chipped spout"
"A folded paper airplane mid-flight in the foreground"

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

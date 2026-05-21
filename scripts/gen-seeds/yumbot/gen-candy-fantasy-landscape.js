#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_landscape.json',
  total: 60,
  batch: 20,
  metaPrompt: (n) => `You are writing ${n} CANDY-FANTASY WORLD SETTINGS for YumBot — Wreck-It-Ralph Sugar Rush world. Each entry describes the OVERALL CANDY LANDSCAPE the scene is set in.

Each entry: 22-35 words. ONE specific candy-world setting.

━━━ REFERENCE — WRECK-IT-RALPH SUGAR RUSH ━━━

The world is made ENTIRELY of candy/cake/sugar. Cakes are mountains. Cookies are tracks. Lollipops are trees. Chocolate is rivers. Cotton candy is clouds. Vanellope's racing-kart kingdom. Disney-CGI lush palette — vivid pastels + saturated candy colors. Pink, teal, orange, purple, baby-blue, mint, cream.

━━━ DISTRIBUTION ━━━

- 15% DONUT-MOUNTAIN region (a vast donut-mountain rising over rolling sprinkle-hills with frosting-ridges and powdered-sugar peaks)
- 12% COOKIE RACE-TRACK valley (a winding cookie-tile race-track carved through a candy-cane forest with sugar-dust on the surface)
- 12% CANDY-CANE FOREST (a forest of giant red-and-white candy-cane trees with peppermint-stripe trunks and gumdrop undergrowth)
- 10% FONDANT-CASTLE plain (a pastel-fondant castle of cake-tiers and royal-icing turrets dominating the horizon over sugar-meadows)
- 10% MARSHMALLOW SNOWFIELD (a sweeping field of fluffy marshmallow-snow drifts with peppermint-stripe stick-flags planted)
- 10% CHOCOLATE-RIVER VALLEY (a glossy chocolate-river winding through marshmallow-banks, candy-cane bridges arching over)
- 10% LOLLIPOP GROVE (a grove of giant pastel lollipop-trees with spiral-disc tops on twisted candy-cane trunks)
- 8% GUMDROP HILLS (rolling hills of giant pastel gumdrops in pink, mint, lavender, yellow, with sprinkle-pebble paths)
- 5% SPRINKLE PLAIN (a wide-open plain carpeted in pastel rainbow sprinkles with mini-cupcake bushes scattered)
- 5% COTTON-CANDY-CLOUD FIELD (a floating-cloud-meadow of pink and blue cotton-candy clouds rising in puffy ridges with sugar-glitter air)
- 3% PANCAKE-STACK PLATEAU (a tiered stack of giant pancakes forming a layered plateau with maple-syrup-river cascading)

━━━ HARD MANDATES ━━━

- The ENTIRE landscape is made of candy/cake/sugar — NOT real terrain
- Saturated lush Disney-CGI palette (pink, teal, orange, purple, mint, cream, baby-blue, lavender, peach)
- NOT neon — lush vivid pastels + warm saturated colors
- Wreck-It-Ralph Sugar Rush register

━━━ HARD BANS ━━━

- NO real grass / real water / real mountains / real trees
- NO food creatures or characters (those come from other pools)
- NO modern objects
- NO neon-electric colors — saturated pastels only
- NO dark / scary / moody atmosphere

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

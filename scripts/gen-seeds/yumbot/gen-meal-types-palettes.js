#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_meal_types_palettes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE directions for YumBot meal-types renders. Each entry names 3-5 colors that should dominate the render — tuned to feel kawaii / cozy / inviting across breakfast / high-tea / picnic / coffee-shop / food-truck / midnight-snack settings.

Each entry: 12-20 words. ONE specific palette (3-5 named colors with relationship).

━━━ DISTRIBUTION ━━━

- 4 BREAKFAST-CODED (warm cream / butter-yellow / strawberry-pink / berry-purple / honey-amber)
- 4 HIGH-TEA-CODED (rose-pink / mint-green / soft-lavender / vanilla-cream / dusty-rose)
- 4 PICNIC-CODED (red-and-white check / grass-green / lemon-yellow / cornflower-blue / strawberry-red)
- 4 COFFEE-SHOP-CODED (warm caramel / cream / coffee-brown / blush-pink / sage-green)
- 4 FOOD-TRUCK-CODED (neon-pink / cyan / electric-mint / sunset-orange / hot-magenta)
- 5 MIDNIGHT-SNACK-CODED (deep navy / warm amber / cream / chocolate-brown / soft moonlight blue)

━━━ EXAMPLES ━━━

"Warm cream and butter-yellow base with strawberry-pink accents and a touch of honey-amber, gentle berry-purple highlights"
"Rose-pink dominant with mint-green secondary, vanilla-cream base, dusty-rose accents, soft-lavender highlights"
"Red-and-white gingham red dominant, grass-green secondary, lemon-yellow and cornflower-blue accents, strawberry-red highlights"
"Warm caramel base with cream and coffee-brown, blush-pink accent and sage-green secondary, soft and inviting"
"Neon pink and cyan dominant, electric mint accents, sunset orange glow, hot magenta highlights"
"Deep navy base with warm amber spotlight, cream and chocolate-brown secondary, soft moonlight-blue highlights"

━━━ HARD BANS ━━━

- NO single-color palettes (entries name 3-5 colors with relationships)
- NO lighting-quality language inside the palette (lighting is its own axis)
- NO scene/camera language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

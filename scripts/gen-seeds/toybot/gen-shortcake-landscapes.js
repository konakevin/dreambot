#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/shortcake_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} 1980s STRAWBERRY-SHORTCAKE-era LANDSCAPE scene descriptions for ToyBot's shortcake-scene path. Pastel dessert-fantasy miniature worlds with oversized-scale props (giant strawberries / cupcake-castles / lollipop-trees / rainbow-bridges). Warm golden-hour nostalgic catalog lighting.

Each entry: 15-25 words. ONE specific Strawberry-Shortcake-era landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure dessert-fantasy miniature landscape, NO dolls. Pastel oversized-scale candy/flower world IS the subject.
- ~70% Type B — ONE off-center 1980s soft-plastic scented-doll (3-5 inch, oversized head, rooted pastel-yarn hair, calico/gingham apron-dress, bonnet or berry-hat) in a specific body-shaping pose within a pastel dessert-fantasy playset. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling / twirling). Set dominates frame.

━━━ CONTEXT DNA ━━━
- Shortcake-era environments: berry-patch / cupcake-cottage-kitchen / rainbow-bridge / pie-baking-booth / lollipop-forest / ice-cream-parlor / flower-garden tea-party / cotton-candy carnival / cupcake-castle / sleepover-cupcake-liner-bedroom / gingerbread-cottage / pastel-meadow / cloud-carriage / candy-shop / hot-air-balloon / ice-skating-pond / tulip-field / cake-slice-bedroom / dessert-train / strawberry-patch / pastel-cloud-treehouse / candy-stripe bakery / teddy-bear-picnic / pastel-unicorn-meadow
- Doll DNA: 3-5-inch soft-plastic with oversized head, huge round eyes, tiny nose, rosy blush, thick rooted pastel-yarn hair (strawberry-blonde / raspberry-pink / blueberry-blue / lemon-yellow / mint), gingham or calico apron-dress / pinafore / pantaloons / big bonnet or berry-hat, striped tights, ankle-boots

━━━ MUST-HAVE ━━━
- Reference DOLL / figurine / soft-plastic / rooted-hair / playset-miniature LANGUAGE
- Pastel + dessert + flower + rainbow aesthetic, faded-catalog palette, oversized-scale props
- Type A = zero dolls. Type B = exactly ONE scented-doll, OFF-CENTER, body-shaping pose-first
- Aggressive dedup: max 4 per pose-family, max 2 per environment-type

━━━ BANNED ━━━
- NO centered-hero doll
- NO multi-doll entries
- NO passive verbs
- NO real brand names (Strawberry Shortcake / Rainbow Brite / Sweetie Belle) — archetype only
- NO edgy / ironic / dark / horror tone
- NO modern-doll / real-girl language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

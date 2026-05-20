#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_interior_activities.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COZY-SNUGGLE ACTIVITIES for ChibiBot cozy-interior — what a small peripheral creature is doing in the cozy tiny-scale space. NOT generic indoor activities — SNUGGLE moments. Wrapped in a blanket, curled by a fire, reading by candle-light, sipping cocoa under a quilt, sleepy in a window-seat. The cozy DNA is wrapped/curled/warm-lit/sleepy.

Each entry: 15-25 words. ACTIVE VERB-LED. Include a CONCRETE cozy-snuggle prop.

━━━ FORMAT — ACTIVE COZY-SNUGGLE VERB + WARM PROP ━━━

Examples:
✓ "Curled under a patchwork quilt in an armchair with both paws clutching a steaming mug of cocoa..."
✓ "Reading a thick storybook by candle-light, wrapped in a chunky knit blanket up to the chin..."
✓ "Mid-yawn under a fur-throw on a window-seat with a half-empty teacup beside..."
✓ "Stoking a small fire in a tiny hearth with a brass poker, sheepskin throw on the floor..."
✓ "Curled into a teacup-bed with a dewdrop-pearl pillow and an open picture-book in lap..."
✓ "Sipping cocoa from a brass thimble while wrapped in lace shawl by warm lantern-light..."
✓ "Mid-toast of marshmallows on a tiny fork over a candle-flame, knit beanie on..."
✓ "Painting at an easel under an oil-lamp with paint-smudges on cheeks, blanket draped over shoulders..."
✓ "Knitting a tiny scarf in a window-nook with brass-lamp pooling warm light, a half-full ball of yarn..."

━━━ HARD POSE-BANS ━━━

✗ "Sitting at a table" (no snuggle context)
✗ "Standing in the kitchen" (no cozy-action)
✗ "Looking at something" (passive)

━━━ COZY-DNA REQUIREMENTS ━━━

Every entry MUST include at least ONE cozy-element:
- BLANKET / QUILT / THROW / SHAWL wrapped around them
- FIRE / CANDLE / LAMP / LANTERN providing warm light directly visible
- WARM BEVERAGE (cocoa / tea / mulled cider) being held or beside them
- BOOK / STORYTIME activity

━━━ CATEGORY DISTRIBUTION ━━━

- 25% BLANKET-WRAPPED (curled under quilt with cocoa / wrapped in chunky knit blanket reading / mid-yawn under fur-throw on window-seat / huddled in patchwork shawl by fire)
- 20% READING-BY-LIGHT (reading by candle-light / mid-flip-of-page by brass-lamp / mid-write of letter by oil-lamp / mid-discovery in storybook by fairy-light)
- 15% FIRE / HEARTH (stoking a small fire / toasting marshmallows over candle / mid-stretch by woodstove / curled by hearth with closed eyes)
- 15% WARM BEVERAGE (sipping cocoa / mid-pour of tea / mid-toast with thimble cups / clutching steaming mug)
- 10% CRAFT-BY-LAMPLIGHT (knitting under brass-lamp / painting by oil-lamp / sewing by candle / mid-string-of-beads)
- 10% SLEEPY / NESTLED (curled in teacup-bed mid-yawn / nestled into pillow-pile / mid-nap on chaise lounge with blanket / sleepy half-eyed reading)
- 5% MUSIC / COZY-HOBBY (mid-wind of music-box / mid-play of tin-whistle by candle / mid-strum of tiny guitar wrapped in scarf)

━━━ HARD BANS ━━━

- NO daytime-bright activities (no kitchen-baking unless candle-lit / no easel-painting in bright daylight)
- NO setting / room language
- NO species names
- NO multi-creature scenes (SOLO resident)
- NO scary / sad

━━━ OUTPUT ━━━

JSON array of \${n} strings. Each begins with an active cozy-snuggle verb + includes blanket/fire/candle/warm-beverage element.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

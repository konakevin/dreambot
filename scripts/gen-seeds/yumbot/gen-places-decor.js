#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_places_decor.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DECOR ACCENT items for YumBot unexpected-places renders. Each entry is ONE prop / decoration / venue-coded small object. The render's brief picks 2-4 per shot.

Each entry: 8-16 words. ONE specific decor item.

━━━ DISTRIBUTION ━━━

- 4 GREENHOUSE PROPS (terracotta pot / brass plant-tag / watering can / orchid pot / fern frond)
- 4 LIBRARY PROPS (open antique book / brass-lamp / ribbon-bookmark / magnifying-glass / leather-bound spine)
- 4 TRAIN PROPS (linen-tablecloth corner / mini suitcase / brass railing / tartan-cushion / window-curtain)
- 4 CARNIVAL PROPS (striped awning corner / popcorn-bucket / mini-ticket / wooden-mallet / string-of-flag-bunting)
- 4 AQUARIUM PROPS (mini ship-in-bottle / sea-shell / aquarium-rock / coral-fragment / kelp-strand)
- 5 ROOFTOP PROPS (terracotta-herb-pot / mismatched-cafe-chair / fairy-light-strand / mini watering-can / cushion)

━━━ EXAMPLES ━━━

"A small weathered terracotta plant-pot beside the subject"
"A folded ribbon-bookmark draped over the page edge"
"A folded linen tablecloth corner with subtle stripe detail"
"A mini cardboard popcorn-bucket with red-and-white stripes"
"A small ship-in-a-bottle with delicate detail inside"
"A small terracotta herb-pot with sage growing inside"

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

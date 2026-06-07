#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_cuisine_decor.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DECOR ACCENT items for YumBot cuisine renders. Each entry is ONE prop / decoration / culturally-coded small object. The render's brief picks 2-4 per shot, so each item must be self-contained and combinable.

Each entry: 8-16 words. ONE specific decor item.

━━━ DISTRIBUTION ━━━

- 4 FRENCH PROPS (brass display rail / silver tea spoon / mini Eiffel-tower charm / sprig of lavender / linen napkin)
- 4 ITALIAN PROPS (red-checker tablecloth corner / wine-bottle cork / sprig of basil / terracotta pot / mini olive-oil bottle)
- 4 MEXICAN PROPS (papel-picado strip / mini sombrero / lime-wedge / clay-pot / chili-pepper string)
- 3 KOREAN PROPS (mini wooden chopsticks / blonde-wood serving plank / small ceramic dipping bowl / fairy-light strand)
- 3 INDIAN PROPS (brass mithai-tray / marigold petals / mini brass diya / saffron threads / silver-leaf square)
- 3 MIDDLE-EASTERN PROPS (mini brass lantern / geometric-tile coaster / pistachio sprinkle / mint sprig / tulip-glass)
- 4 GENERIC CUISINE-FRIENDLY (small saucer / linen napkin / mini fork / tiny posy / cuisine-neutral tray edge)

━━━ EXAMPLES ━━━

"A polished brass display rail along the edge of the counter"
"A red-checker tablecloth corner draped beside the subject"
"A folded papel-picado strip with cut-paper details"
"A small ceramic dipping bowl on a blonde-wood plank"
"A brass mithai-tray with scalloped rim partially visible"
"A mini brass lantern with cut-out star pattern"

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

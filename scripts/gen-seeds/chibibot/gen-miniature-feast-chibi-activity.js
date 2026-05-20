#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/miniature_feast_chibi_activity.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CHIBI-WITH-FOOD ACTIVITIES for ChibiBot miniature-feast — what an adorable chibi creature is doing WITH a kawaii smiling-face food/drink. The chibi is INTERACTING with the food.

Each entry: 12-22 words. ACTIVE VERB-LED. NO chibi species names, NO food hero description (those come from other pools). Just the activity.

━━━ EVERY ENTRY ━━━

The chibi is mid-action interacting with the food. They are adorable, expressive, sweet. Heart-eyes, blush cheeks, paws-pressed-to-cheeks, mid-bite, mid-sip, mid-amazed.

━━━ FORMAT ━━━

Examples:
✓ "Mid-sip from a giant boba straw, eyes-closed-bliss, both paws clutching the cup, blush cheeks"
✓ "Holding a slice of cake bigger than their head, heart-eyes amazed, tongue-out-eager"
✓ "Mid-pour of pastel pink milk into a cereal bowl, careful-precision face, cheek puffed in concentration"
✓ "Hugging a giant macaron to chest with both arms, blissful sleepy expression, cheek nuzzled against icing"
✓ "Mid-toast clinking thimble-cups together, blush cheeks, joyful smile, eyes-closed-laughter"
✓ "Stretching tiny paws toward the cake, wide eyes of wonder, mouth open in amazement"
✓ "Mid-scoop of rainbow ice-cream with a tiny spoon, dripping cone, focused tongue-out face"
✓ "Mid-bite of a strawberry donut, sprinkles flying, surprised wide-eyed delight"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% MID-SIP / DRINK (mid-sip from giant straw / mid-pour / mid-clink of cups / mid-spoon-into-froth)
- 20% MID-BITE / EAT (mid-bite of donut / mouth-open-eager / cheek puffed mid-chew / tongue-out-licking)
- 15% HOLDING / CARRYING (holding food bigger than head / carrying tray / clutching cup / arms full of pastries)
- 15% AMAZED / WIDE-EYED (wide-eyed amazed / mouth-open-wonder / paws-pressed-cheeks / stars-in-eyes)
- 10% NUZZLING / HUGGING (hugging the cake / nuzzling against frosting / sleepy-snuggle with mochi)
- 10% POURING / SERVING (mid-pour / mid-stir / mid-decorate / mid-sprinkle-of-toppings)
- 5% MID-SHARE (offering a bite to companion / clinking cups / passing pastry / sharing spoon)
- 5% AMAZED-FROM-AFAR (stretching paws toward food / mid-reach / peeking around food / popped up behind)

━━━ HARD BANS ━━━

- NO species names (cat / bear / fox / etc.)
- NO food specifics (those come from food_hero pool — use "food" or "cup" or "treat" generically)
- NO scary / sad / weird expressions
- NO multi-chibi descriptions (just one chibi's action — template handles group dynamic)
- NO setting / background

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering. Each begins with an active verb-led phrase.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

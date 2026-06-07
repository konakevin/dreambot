#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_meal_types_decor.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DECOR ACCENT items for YumBot meal-types renders. Each entry is ONE prop / decoration / smallish object that lives on or around the kawaii food subject — vase / mug / fork / flower / napkin / sugar bowl / pastry tongs / etc. The render's brief picks 2-4 of these per shot, so each entry must be self-contained and combinable.

Each entry: 8-16 words. ONE specific decor item.

━━━ DISTRIBUTION ━━━

- 5 SMALL VESSELS / DISHES (sugar bowl / creamer / butter dish / saucer / dessert plate)
- 4 UTENSILS / SERVING (tiny fork / serving spoon / pastry tongs / spreader knife / cake server)
- 4 LINENS / FABRICS (lace doily / linen napkin / gingham cloth / embroidered napkin / runner)
- 4 FLORALS / GREENERY (small posy / sprig of herbs / pressed flower / single rose / mini bouquet)
- 4 EDIBLE GARNISHES (berry pile / honey drizzle / powdered-sugar dust / mint sprig / sliced fruit fan)
- 4 SMALL OBJECT MISC (vintage book / spool of twine / tiny lantern / postcard / matchbox)

━━━ EXAMPLES ━━━

"A small ceramic sugar bowl with a kawaii face and lid"
"A tiny vintage silver dessert fork resting beside the plate"
"A lace doily folded under the saucer with crocheted scalloped edges"
"A small posy of pastel meadow flowers in a tiny glass bottle"
"A pile of three fresh raspberries scattered next to the subject"
"A tiny weathered vintage book closed beside the table setting"

━━━ HARD MANDATES ━━━

- Self-contained — must read clean when 2-4 are combined per render
- Specific item, not a category ("a small ceramic sugar bowl" not "small kitchenware")

━━━ HARD BANS ━━━

- NO color / palette / lighting language
- NO companion creatures (companions are their own axis)
- NO camera / framing language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

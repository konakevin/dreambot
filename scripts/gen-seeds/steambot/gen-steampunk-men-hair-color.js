#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_hair_color.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} STEAMPUNK MAN HAIR-COLOR descriptions for SteamBot's steampunk-man path. Each entry describes hair color + texture — period-accurate Victorian-industrial era. NOT modern dyed hair.

Each entry: 8-14 words. ONE hair-color description.

━━━ COLOR SPREAD (distribute across ${n}) ━━━
- Dark brown / chestnut / espresso (12-14)
- Black / blue-black / inky (8-10)
- Light brown / mid-brown (6-8)
- Auburn / chestnut-red (4-6)
- Blond / dirty-blond / sandy (6-8)
- Salt-and-pepper / iron-grey (6-8)
- Silver-white / fully grey (3-5)
- Bald / shaved (2-4)

━━━ DETAILS PER ENTRY ━━━
- Color with shade (dark mahogany brown, raven black, chestnut auburn, ash-blond, iron-grey)
- Texture (oiled / coarse / fine / wavy / straight / curly / wiry / sleek)
- Optional condition (windswept, oiled-flat, gear-grease-streaked, factory-soot-flecked, neat with pomade)

━━━ ABSOLUTELY BANNED ━━━
- NO modern dyed colors (no pink, blue, purple — period-inappropriate)
- NO modern haircare references
- NO hairstyle descriptions (separate axis)

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Dark mahogany-brown hair, slightly oiled, windswept across his temple"
- "Iron-grey at the temples, deep espresso through the rest, neatly pomaded"
- "Black hair coarse and gear-grease-streaked at the roots"
- "Sandy-blond hair sun-bleached at the tips, wavy and slightly disheveled"
- "Salt-and-pepper hair cut close, distinguished and weathered"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

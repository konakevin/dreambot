#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/warrior_hair_color.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} HAIR-COLOR entries for DragonBot's female-warrior and male-warrior paths. Each entry is a SHORT phrase (6-14 words) describing the EXACT vivid hair color AND a fantasy-light interaction — torchlight glow, firelight sheen, dragon-flame catch, moonlight shimmer.

This pool composes with separate hairstyle/skin/eyes/outfit pools. Suitable for both male and female warriors.

━━━ COLOR SPREAD (enforce diversity across ${n}) ━━━
- BLACK / RAVEN (4) — coal-black with a dragon-fire copper sheen, raven black drinking firelight to violet, blue-black with steel highlights from torchlight, deep midnight-black catching forge to warm
- BROWN / CHESTNUT (5) — chestnut-brown going copper under firelight, dark walnut with bronze highlights from torchlight, mahogany-brown with cinnamon undertones, soft mocha catching warm lantern, espresso-brown with hints of red in flame
- AUBURN / RED (5) — fiery auburn that looks lit by dragon-flame, copper-red catching firelight to molten, deep cherry-mahogany red glowing dark in lantern light, ginger-red sun-faded on top brass-gold underneath, blood-red from a battlefield dye-curse
- BLONDE / GOLD (4) — wheat-blonde sun-bleached at the tips fire-warm at the root, ash-blonde going silver in cold moonlight, dark honey-blonde with brass undertones, pale platinum-blonde glinting cool against warm torchlight
- STREAKED / DYED / UNUSUAL (5) — silver-streaked black from a near-death encounter, white-streaked from grief or magic, bone-white from a cursed engagement, dragon-fire streaked through the natural color, prematurely silver from war-stress glinting under firelight

━━━ RULES ━━━
- Each entry is a SHORT VISUAL — color + fantasy-light interaction
- Color-diverse across all 5 tiers — do NOT cluster on black or auburn
- Fantasy-flavored: torchlight / firelight / forge / dragon-flame / moonlight cues
- Suitable for both male and female warriors
- No bright modern dye-jobs (no neon pink) UNLESS justified by curse / magic
- Hair has WEIGHT and texture even in color description — sheen, glow, undertone

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

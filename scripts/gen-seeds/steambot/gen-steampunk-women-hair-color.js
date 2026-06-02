#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_hair_color.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} HAIR-COLOR entries for SteamBot's sexy-steampunk-woman path. Each entry is a SHORT phrase (6-14 words) describing the EXACT vivid hair color AND a steampunk-light interaction — gaslight glow, brass-warm sheen, forge-flame catch, oil-lamp shimmer.

This pool composes with separate hairstyle/skin/eyes/makeup/wardrobe pools.

━━━ COLOR SPREAD (enforce diversity across ${n}) ━━━
- BLACK / RAVEN (4) — coal-black with a forge-fire copper sheen, raven black drinking gaslight to violet, blue-black with steel highlights from oil-lamp, deep midnight-black catching brass to warm
- BROWN / CHESTNUT (5) — chestnut-brown going copper under firelight, dark walnut with brass highlights from gaslight, mahogany-brown with cinnamon undertones, soft mocha catching warm gaslight, espresso-brown with hints of red in candlelight
- AUBURN / RED (5) — fiery auburn that looks lit by furnace, copper-red catching brass to molten, deep cherry-mahogany red glowing dark in lantern light, ginger-red sun-faded on top brass-gold underneath, dark blood-red from a botched chemical bleach
- BLONDE (4) — wheat-blonde sun-bleached at the tips brass-warm at root, ash-blonde going silver in cold gaslight, dark honey-blonde with brass undertones, platinum-blonde glinting cool against warm gaslight
- STREAKED / DYED / UNUSUAL (5) — silver-streaked black from one too many electric shocks, brass-dyed copper bright as polished metal, soot-stained natural blonde with grime at the ends, white-streaked black from a workshop incident, oil-darkened hair that used to be lighter, prematurely silver from work-stress glinting under gaslight

━━━ RULES ━━━
- Each entry is a SHORT VISUAL — color + steampunk-light interaction
- Color-diverse across all 5 tiers — do NOT cluster on auburn or black
- Steampunk-flavored: brass / gaslight / forge / oil-lamp / soot lighting cues
- Avoid bright modern dye-jobs (no neon pink, no platinum-bleach unless context) UNLESS justified by workshop incident
- Hair has WEIGHT and texture even in color description — sheen, glow, undertone

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

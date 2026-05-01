#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_hair_color.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} HAIR-COLOR entries for StarBot's female-explorer and male-explorer paths. Each entry is a SHORT phrase (6-14 words) describing the EXACT vivid hair color AND a sci-fi-light interaction — cockpit-glow, aurora-shimmer, nebula-tinge, corridor-red.

━━━ COLOR SPREAD (enforce diversity across ${n}) ━━━
- BLACK / RAVEN (4) — coal-black catching cockpit-blue to violet, raven black drinking nebula-aurora to indigo, blue-black with steel highlights from corridor-light, deep midnight-black going warm under engine-bay-glow
- BROWN / CHESTNUT (5) — chestnut-brown going copper under aurora, dark walnut with bronze highlights from cockpit-amber, mahogany-brown with cinnamon undertones, soft mocha catching warm ship-lamp, espresso-brown with hints of red in HUD-glow
- AUBURN / RED (5) — fiery auburn that looks lit by alien-sun, copper-red catching emergency-light to molten, deep cherry-mahogany red glowing dark in cockpit-blue, ginger-red sun-faded on top brass-gold underneath, blood-red from a botched gene-mod
- BLONDE / SILVER (5) — wheat-blonde sun-bleached at the tips warm at the root, ash-blonde going silver in cold corridor-light, dark honey-blonde with brass undertones, platinum-blonde glinting cool against warm cockpit-amber, pure silver from radiation-grey
- DYED / AUGMENTED (5) — chrome-streaked black from repeated cryo-stasis, electric-blue dye holding from her last shore-leave, bone-white from a planetary-system gene-mod incident, dragon-fire-orange streaked through the natural color, gradient teal-to-violet from a body-mod salon

━━━ RULES ━━━
- Each entry is a SHORT VISUAL — color + sci-fi-light interaction
- Color-diverse across all 5 tiers
- Sci-fi-flavored: cockpit / aurora / nebula / corridor / engine-bay lighting cues
- Suitable for both male and female explorers
- One entry MUST involve gene-mod or cryo-stasis effect (signature StarBot detail)
- Hair has WEIGHT and texture even in color description — sheen, glow, undertone

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

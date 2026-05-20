#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/creature_portrait_outfits.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CUTE OUTFITS for ChibiBot creature-portrait — the cute clothing the chibi creature is wearing in a tight portrait. Pop-Mart designer-vinyl + Pixar storybook register. Charming, never gaudy.

Each entry: 10-18 words. ONE specific outfit. NO creature species names, NO pose, NO accessories (those are a separate axis), NO setting.

━━━ FORMAT — VISIBLE CUTE OUTFIT ━━━

Examples:
✓ "Chunky knit cream-sweater with pastel-pink stripes around the cuffs"
✓ "Pastel-yellow sundress with daisy-pattern hem and shoulder ties"
✓ "Tiny denim overalls with pink heart-button straps"
✓ "Floral kimono with cherry-blossom print and rose-pink obi sash"
✓ "Cozy oversized hoodie in lavender with bunny-ear hood"
✓ "Frilly pinafore dress in mint with lace trim"
✓ "Striped scarf wrapped twice and tucked into a tiny wool vest"
✓ "Pastel-blue raincoat with yellow polka-dot interior"
✓ "Quilted patchwork jacket with rainbow buttons"
✓ "Tutu skirt in cotton-candy pink layered over a white leotard"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% KNIT / SWEATER (chunky knit sweater / cable-knit cardigan / oversized hoodie / knit-vest / wool-poncho)
- 15% DRESS / SKIRT (sundress / pinafore dress / tulle dress / floral dress / overall-dress / tutu skirt)
- 10% OVERALLS / DUNGAREES (denim overalls / corduroy dungarees / patchwork overalls / striped overalls)
- 10% KIMONO / TRADITIONAL (floral kimono / pastel yukata / hanbok / mini-cheongsam / mini-saree)
- 10% RAINCOAT / OUTERWEAR (pastel raincoat / wool coat / fleece jacket / puffer-vest / patchwork coat)
- 10% PAJAMAS / COZY (footed pajamas / nightcap-and-nightgown / pastel onesie / oversized sleep-shirt)
- 5% UNIFORM / OCCUPATION (mini-chef outfit / mini-sailor uniform / mini-artist smock / mini-explorer vest)
- 5% FORMAL (mini tuxedo with bow-tie / mini ballgown / mini suit / lace doily-collar dress)
- 5% SEASONAL (mini Santa outfit / mini witch dress / mini bunny ears + apron / mini fairy gown)
- 5% APRON / SMOCK (mini chef-apron / artist-smock / gardener-apron / striped apron)
- 5% SPORTS / ACTIVITY (mini ski-suit / mini swim-trunks-and-floaty / mini soccer-jersey / mini gymnastics-leotard)

━━━ HARD MANDATES ━━━

- ALWAYS soft pastel or cozy palette
- VISIBLE outfit on the creature's body (not a single accessory)
- Pixar / Pop-Mart designer-vinyl cuteness
- Cute proportions — fits chibi creature

━━━ HARD BANS ━━━

- NO creature species names
- NO pose / activity verbs
- NO setting / background language
- NO modern brand-names
- NO scary / dark / aggressive clothing

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

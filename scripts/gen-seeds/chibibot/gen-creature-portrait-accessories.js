#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/creature_portrait_accessories.json',
  total: 150,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CUTE PORTRAIT ACCESSORIES for ChibiBot creature-portrait — a small charming accessory or prop on the chibi creature in a tight portrait. NO creature species names.

Each entry: 8-15 words. ONE specific accessory.

━━━ FORMAT — SMALL CHARMING ACCESSORY ━━━

Examples:
✓ "Knit bow tied at the neck in pastel pink"
✓ "Tiny crown of woven daisies perched on head"
✓ "Pastel scarf wrapped twice around like a chunky donut"
✓ "Tiny heart-shaped balloon clutched in paw on a string"
✓ "Embroidered collar with a tiny bell"
✓ "Mini wizard hat tipped jauntily over one ear"
✓ "Bouquet of wildflowers held to chest"
✓ "Pastel paper crown sitting askew"
✓ "Tiny pearl earring catching the light"
✓ "NONE — bare creature with no accessory"

━━━ CATEGORY DISTRIBUTION ━━━

- 15% BOW / RIBBON (pastel knit bow / sparkly ribbon bow / oversized hair-bow / chiffon bow)
- 15% FLORAL (daisy-crown / floral-crown / flower-tucked-behind-ear / wildflower-bouquet)
- 10% SCARF / NECKWEAR (knit scarf / pastel chunky-scarf / cowl-collar / lace-cravat)
- 10% HEADGEAR (mini-crown / pastel paper-crown / mini-witch-hat / mini-wizard-hat / floral-headband)
- 10% HELD-ITEM (heart-balloon / tiny-flower / mini-cupcake / mini-tea-cup / tiny-book)
- 10% JEWELRY (pearl-earring / heart-pendant / star-charm-collar / tiny-gemstone-tiara)
- 10% COLLAR / BELL (embroidered collar with bell / charm-collar / pastel-collar)
- 5% EYEWEAR (oversized round glasses / tiny monocle / heart-shaped sunglasses / star-glasses)
- 5% CAPE / CLOAK (mini superhero cape / pastel cloak / fairy-wings)
- 10% NONE (bare creature with no accessory at all — natural cuteness only)

━━━ HARD MANDATES ━━━

- Pixar/Pop-Mart designer-vinyl aesthetic
- Soft pastel colors
- Charming, never gaudy

━━━ HARD BANS ━━━

- NO creature species names
- NO setting / background
- NO modern tech
- NO weapons / aggressive props

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

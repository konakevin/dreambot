#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_terrain.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} SURFACE textures for a kawaii coquette food-party scene — what the foods sit on (tabletop / floor / cloth surface).

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY.

Each entry: 10-18 words. ONE specific surface.

DO write:
- Pink lace tablecloth with intricate floral cut-work pattern
- Pink satin tablecloth in shimmering blush with subtle sheen
- White marble countertop with delicate pink veining
- Lavender velvet runner draped across the surface
- Pink pearlescent lacquer table with mirror finish
- Pink-and-cream gingham tablecloth in soft tea-time pattern
- White lace-edged linen tablecloth with embroidered pink rosebuds
- Pink-velvet upholstered surface with tufted pearl-button accents
- Lavender silk runner with pearl-trim edging
- Pink-marble dessert-counter with subtle lavender veining
- White-and-pink tea-rose printed cotton tablecloth
- Pink-tulle layered tablecloth with cascading ruffles
- White-lace doily-covered surface in scalloped pattern
- Pink-pearl-finish polished wooden table-top
- Lavender-and-white check tablecloth in soft gingham
- Pink-satin pillow-tray surface with pearl-edge piping
- White ceramic display-tray with pink-floral hand-painted detail
- Pink-cream Regency-era marquetry table surface
- Lavender silk-brocade tablecloth with embroidered florals
- Pink-velvet cushion-tray surface with pearl-tassel corners

DO NOT write:
- Any colors outside pink / lavender / white / soft purple
- Pathway / lane RECEDING — surface only
- Foreground characters / atmosphere

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

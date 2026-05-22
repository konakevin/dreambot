#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_vessel_hero.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing \${n} KAWAII VESSEL HEROES for YumBot checkered-tabletop. Each is a kawaii-faced food/drink centerpiece sitting on the tablecloth. NO mini-friends pile (separate pool), NO tablecloth.

Each entry: 15-25 words.

━━━ REFERENCE — bex.ai ━━━

Boba-cups, hot-cocoa-mugs, teapots, sundae-glasses, parfaits — all kawaii-faced with cute smiling face on the front. Glossy pearlescent designer-vinyl finish. Stand-alone hero centerpiece.

━━━ DISTRIBUTION ━━━

- 30% BOBA / DRINK-CUP (tall kawaii boba-cup with smiling face and pastel boba-pearls visible / kawaii pastel milk-tea-cup with smiling face / kawaii iced-coffee-cup with smiling face)
- 25% HOT-DRINK-MUG (kawaii hot-cocoa-mug with smiling face and frothy cream-top / kawaii latte-mug with smiling face and steam / kawaii pumpkin-spice-mug with smiling face)
- 20% TEAPOT (kawaii pink teapot with smiling-face on the belly / kawaii teapot with hand-painted floral and smiling face / animal-shaped kawaii teapot with smiling face — pig / cat / bear-styled)
- 10% SUNDAE / ICE-CREAM-GLASS (kawaii sundae-glass with smiling face and rainbow-soft-serve / kawaii pastel-parfait with smiling face)
- 10% SHORT-DRINK / TUMBLER (kawaii smoothie-tumbler with smiling face / kawaii pastel-frappe with smiling face / kawaii milkshake-glass with smiling face)
- 5% UNUSUAL (kawaii cereal-bowl with smiling-face / kawaii pudding-cup with smiling-face / kawaii jelly-jar with smiling-face)

━━━ HARD MANDATES ━━━

- KAWAII FACE clearly on the vessel
- Glossy pearlescent Pop-Mart designer-vinyl finish
- Pastel palette

━━━ HARD BANS ━━━

- NO mini-creature pile on top (separate pool)
- NO tablecloth
- NO surrounding decor

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

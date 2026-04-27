#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_wardrobe.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE WARDROBE descriptions for GothBot's vampire-vogue-realism path. Each entry is a SHORT phrase (8-15 words) describing ONLY what's visible at her neckline/collar/throat in an extreme face close-up — we see barely a hint of clothing at the very bottom edge of a tight face portrait. Dark fantasy game-art aesthetic — think Warcraft III / Diablo / Castlevania / Bloodborne character select screen.

━━━ WARDROBE SPREAD (enforce variety across ${n}) ━━━
- HIGH COLLAR / COVERED (6-7) — high-collar black velvet with tarnished clasps, armored gorget at throat, black turtleneck pulled tight, fur-trimmed collar rising to jaw, high mandarin collar in black silk, mourning-dress collar with cameo brooch
- HOOD / COWL (4-5) — deep hood casting shadow across upper face, tattered cowl gathered at throat, heavy cloak hood pushed back from face, black veil draped from temple catching wind
- ARMOR / PLATE (4-5) — blackened plate gorget with etched runes, worn leather pauldron strap crossing throat, dark chainmail collar glinting, scarred black breastplate visible at throat
- WRAPPED / LAYERED (4-5) — dark cloth wrapping throat like bandages, stacked leather chokers and cord, high-wrapped scarf obscuring chin, layered black scarves wind-swept
- WORN / WEATHERED (3-4) — cracked leather collar with missing buckle, threadbare black wool fraying at the seam, torn velvet collar showing age

━━━ RULES ━━━
- ONLY what's visible in an extreme face close-up — hint of clothing at frame edge
- Include ONE specific texture/material detail (velvet, leather, chainmail, fur, silk, wool)
- Dark palette only — black, midnight, charcoal, obsidian, tarnished silver
- FULLY COVERED �� no exposed chest, no exposed shoulders, no bare skin below the neck, no cleavage, no low-cut anything. This is dark-fantasy armor/clothing, not fashion
- SAFETY: nothing suggestive, nothing revealing — AI safety filters are strict

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

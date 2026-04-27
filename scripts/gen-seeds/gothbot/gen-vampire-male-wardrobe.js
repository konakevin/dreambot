#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_male_wardrobe.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MALE VAMPIRE WARDROBE descriptions for GothBot's vampire-boys path. Each entry is a SHORT phrase (8-15 words) describing ONLY what's visible at his neckline/collar/throat in an extreme face close-up — we see barely a hint of clothing at the very bottom edge of a tight face portrait. Dark fantasy game-art aesthetic — think Warcraft III / Diablo / Castlevania / Bloodborne male character select screen.

━━━ WARDROBE SPREAD (enforce variety across ${n}) ━━━
- HIGH COLLAR / COAT (5-6) — high-collar black greatcoat with tarnished silver buttons, worn leather duster collar turned up, heavy wool military coat collar at jaw, dark mandarin collar in stiff black canvas
- HOOD / COWL (4-5) — deep hood casting shadow across upper face, tattered cowl wound around throat, heavy monk's hood pushed back, dark traveling cloak hood half-raised
- ARMOR / PLATE (5-6) — blackened plate gorget with battle damage at throat, dark chainmail collar over leather, scarred iron pauldron strap crossing throat, worn brigandine collar with bent rivets, chest harness with tarnished buckles
- WRAPPED / LAYERED (4-5) — dark cloth wrapping throat like field bandages, stacked leather straps and cord at neck, rough scarf knotted at throat, layered black linen wound tight
- BARE / MINIMAL (3-4) — open collar showing Adam's apple and tendons, partially unbuttoned dark shirt at throat, bare scarred collarbone at frame edge

━━━ RULES ━━━
- ONLY what's visible in an extreme face close-up — hint of clothing at frame edge
- Include ONE specific texture/material detail (leather, iron, wool, canvas, chainmail, fur)
- Dark palette only — black, midnight, charcoal, obsidian, tarnished silver, rusted iron
- MASCULINE energy — armor, military, rugged, weathered. NOT capes, NOT cravats, NOT dandy
- SAFETY: nothing suggestive — AI safety filters are strict

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

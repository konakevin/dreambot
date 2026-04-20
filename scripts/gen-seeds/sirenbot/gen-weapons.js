#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/weapons.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} enchanted WEAPON descriptions for a high-fantasy warrior. Each describes one specific weapon with ornate detail. Mix male- and female-appropriate — both use this pool.

Each entry: 10-22 words. One weapon with magical flourish.

━━━ WEAPON CATEGORIES ━━━
- Blades (longswords, rapiers, scimitars, katanas, daggers, falchions, greatswords)
- Axes (battleaxes, twin hand-axes, great-axes, throwing axes)
- Polearms (halberds, glaives, naginatas, tridents, spears)
- Hafted (warhammers, maces, morningstars, flails, mauls)
- Ranged (longbows, composite bows, crossbows, throwing stars, javelins)
- Magical focuses (staves, wands, grimoires, orbs, rune-carved focus)
- Chained (chain-whips, meteor hammers, kusarigama, linked-blades)
- Exotic (whip-swords, shard-wheels, crystal-sword, living-weapon)

━━━ ORNATE DETAIL EXPECTED PER ENTRY ━━━
- Material (obsidian, silver, meteoric iron, dragonbone, living-wood, shadowsteel)
- Magical enhancement (glowing runes, inset gems, etched script, magical aura, elemental imbuement)
- Pommel / hilt detail (jeweled, carved, wrapped, filigreed)
- Edge / head detail (serrated, rune-etched, flame-touched, frost-iced)

━━━ BANNED ━━━
- Mundane / modern weapons (no guns, no modern rifles)
- Specific race naming (other axis)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

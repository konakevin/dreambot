#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/accessories_male.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ornate ACCESSORY / ARMOR descriptions for a menacing high-fantasy MALE warrior. One piece per entry.

Each entry: 12-22 words. Fantasy masterwork detail.

━━━ CATEGORIES TO MIX ━━━
- Heavy armor pieces (plate pauldrons, gorgets, greaves, cuirasses — enchanted)
- Helms (horned helms, spiked crowns, raven-skull, dragonbone, half-masks)
- Cloaks and mantles (fur-lined, chain-draped, tattered battle-cloaks)
- Magical tattoos (runic brands, war-sigils, branded chest/arm scripts)
- Battle trophies (bone necklaces, tooth braids, skull belt-pieces, tribal tokens)
- War paint (tribal patterns, blood-and-ash, clay-and-ochre)
- Enchanted belts, sword-harnesses, pauldrons with glowing etches
- Bracers / gauntlets with inset gems or rune channels
- Beard ornaments (gold beads, bone clasps, small braid charms)
- Battle-trophy adornments (claws of slain beasts, dragon-fang pendants)

━━━ RULES ━━━
- Flashy ornate detail — this is a WARLORD, every piece is a statement
- Menacing / brutal aesthetic, not pretty
- Fantasy appropriate — no modern elements

━━━ BANNED ━━━
- "posing" / "modeling"
- Race naming (separate axis)
- Whole-outfit descriptions (one piece per entry)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

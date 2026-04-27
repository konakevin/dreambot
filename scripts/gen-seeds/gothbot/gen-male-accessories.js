#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/male_accessories.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MALE ACCESSORY / WEAPON descriptions for GothBot's male character paths. Each entry is a SHORT phrase (5-12 words) describing ONE specific weapon, piece of gear, or accessory visible on a gothic-horror man. Castlevania / Bloodborne / Devil-May-Cry / Van-Helsing aesthetic.

━━━ ACCESSORY TYPES (enforce variety across ${n}) ━━━
- BLADED WEAPONS (4-5) — silver longsword, obsidian-hilted rapier, notched greatsword with blood-groove, curved saber
- RANGED WEAPONS (3-4) — silver-blessed crossbow, ornate flintlock pistol, repeating crossbow mechanism on forearm
- HUNTER GEAR (3-4) — bandolier of silver stakes, holy-water vials on belt, silver-chain whip coiled at hip
- ARMOR FRAGMENTS (3-4) — tarnished shoulder pauldron, cracked gauntlet with glowing runes, blackened chest-plate with claw marks
- OCCULT ITEMS (3-4) — bone-staff crackling with energy, grimoire bound in dark leather, crystal focus at belt
- JEWELRY / PERSONAL (2-3) — tarnished silver chain at throat, signet ring with family crest, leather cord with vampire-tooth pendant

━━━ RULES ━━━
- ONE accessory per entry — not a full loadout
- Describe the object with specific visual detail (material, condition, one striking detail)
- Gothic dark-fantasy — worn, battle-used, ornate, dangerous
- NO modern weapons, NO guns (flintlocks OK), NO tech

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/female_warrior_accessories.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ACCESSORY entries for DragonBot's female-warrior path. Each entry is a SHORT phrase (8-16 words) describing ONE signature object she's wearing or carrying — the small detail that anchors her warrior identity.

━━━ ACCESSORY SPREAD (enforce variety across ${n}) ━━━
- WEAPONS / SIGNATURE BLADES (5-6) — twin curved daggers crossed at her back, ancestral longsword strapped at her hip, dragon-bone bow slung across her shoulder, short throwing-axe at her belt, ornate runed war-hammer one-handed at her side, cursed black-blade sheathed at her thigh
- ARMOR-SUPPLEMENTS (4-5) — pauldron carved with the family dragon-crest, gauntleted forearm with battle-rune etching, blackened-steel vambrace with old gouge-marks, gold-trimmed dragon-scale belt-buckle, fur-lined collar from a wolf she killed
- TALISMANS / RITUAL (4-5) — dragon-tooth necklace strung on leather, blood-iron rune-amulet at her throat, small bone-charm woven into her braid, family ring on a chain tucked inside her armor, soul-bonded blue crystal pendant glowing faintly
- TROPHY / WAR-MARK (4-5) — wolf-skull pauldron over one shoulder, scaled dragon-claw bracelet, enemy-clan banner-cord wrapped around her belt, severed-orc-tusk earring, warlord's signet she took from his dead hand
- TOOL / TRADE (3-4) — leather-bound war-journal at her hip, scabbard with whetstone hanging beside it, healer's herb-pouch crossbody, hawk-glove on one hand for her bonded raptor, dragon-tamer's small horn at her belt
- MOUNT / BOND (3-4) — dragon-rider's reins coiled at her hip, signal-whistle for her wyvern, leather riding-strap with dragon-scale ornaments, grappling-hook for cliff-flight

━━━ RULES ━━━
- Each entry is ONE signature object — not a pile of stuff
- Fantasy-world materials only: dragon-bone, runed steel, blood-iron, leather, fur, scaled-hide, gold-trim
- Anchors her identity — the accessory tells you WHO she is
- One entry MUST involve her dragon-bond or wyvern (signature DragonBot detail)
- No modern items
- Specific to FEMALE warriors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

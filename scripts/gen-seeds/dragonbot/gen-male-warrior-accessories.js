#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/male_warrior_accessories.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACCESSORY entries for DragonBot's male-warrior path. Each entry is a SHORT phrase (8-16 words) describing ONE signature object he's wearing or carrying — the small detail that anchors his warrior identity.

━━━ ACCESSORY SPREAD (enforce variety across ${n}) ━━━
- WEAPONS / SIGNATURE BLADES (5-6) — ancestral two-handed greatsword strapped to his back, dragon-bone war-axe at his hip, runed broadsword in a worn leather scabbard, ornate war-hammer with a dragon-claw head, cursed black-blade sheathed across his back, twin throwing-axes at his belt
- ARMOR-SUPPLEMENTS (5-6) — massive pauldron carved with his clan's dragon-crest, gauntleted forearm with battle-rune etching, blackened-steel vambrace with deep gouge-marks, fur-mantle from a wolf-bear hybrid he killed, dragon-scale gorget covering his throat, gold-trimmed dragon-scale belt-buckle
- TALISMANS / RITUAL (4-5) — dragon-tooth necklace strung on leather across his bare chest, blood-iron rune-amulet hanging at his throat, family signet-ring on a chain tucked inside his armor, soul-bonded crystal pendant glowing faintly, bone-charm woven into a single beard-braid
- TROPHY / WAR-MARK (4-5) — wolf-skull pauldron over one shoulder, scaled dragon-claw bracer, enemy-warlord's banner-cord wrapped around his pommel, severed-orc-tusk earring, dragon-fang piercing through his ear
- MOUNT / BOND (3-4) — dragon-rider's harness-straps across his chest, signal-horn for his wyvern, leather riding-cloak with dragon-scale clasp, grappling-hook for cliff-fights

━━━ RULES ━━━
- Each entry is ONE signature object — not a pile of stuff
- Fantasy-world materials only: dragon-bone, runed steel, blood-iron, leather, fur, scaled-hide, gold-trim
- Anchors his identity — the accessory tells you WHO he is
- One entry MUST involve dragon-bond or wyvern (signature DragonBot detail)
- Beard-braid bone-charm welcome — male-specific detail
- No modern items
- Specific to MALE warriors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

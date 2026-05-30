#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_weapon.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SHONEN WEAPON entries — combat-iconic anime weapons with signature visual aura.

Each entry: 12-22 words. Weapon + material detail + aura/glow + power-signature cue.

VARIETY:
- 22% KATANA/SWORD (sealed katana with crimson wraps / cursed-blade with floating rune-runes / breathing-katana mid-bloom / shikomi-zue cane-sword)
- 16% NINJA-TOOLS (chakra-bladed kunai / shuriken-fan mid-throw / wire-trap kunai / hidden-village blade)
- 14% MAGITECH GAUNTLETS (rune-engraved gauntlets / explosion-gauntlets MHA-style / chakra-channel bracers / cursed-binding manacles)
- 10% MARTIAL FIST (bandaged-fist with chi-glow / gloved knuckle with brass-spikes / weighted boxing-gauntlet / iron-claw glove)
- 10% SPEAR/STAFF (rune-staff with crystal-top / energy-spear mid-channel / bo-staff with kanji wraps / naginata blade)
- 8% BOW (energy-bow mid-draw / spirit-arrow nocked / cursed-bow with bone-tip / shinobi crossbow)
- 6% UNCONVENTIONAL (chained-scythe / clawed glove / tonfa pair / cursed-mask)
- 6% TWIN-WEAPONS (twin tanto crossed / paired chained-sickle / dual pistol-revolvers)
- 4% MECH-WEAPON (giant mecha-sword / plasma-spear / energy-cannon / mecha-axe)
- 4% NO-WEAPON-PURE-POWER (open palms with chi-aura / channeled fists with mana-glow / bound hands with seal-glow)

DO write:
- Sealed katana with crimson wraps and cursed-rune trail bleeding from blade, mid-arc with afterimage
- Energy-bow drawn taut with spirit-arrow nocked, mana-glow crackling at fingertips
- Chakra-bladed kunai mid-throw with wind-style afterimage trailing, shadow-clone wisps
- Rune-engraved gauntlets glowing with cyan circuit-lines, fingers curled mid-strike
- Bandaged fists with chi-energy corona, gold dust trailing from knuckles

DO NOT: photoreal weapon-catalog descriptions / multiple weapons per entry / non-combat tools.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

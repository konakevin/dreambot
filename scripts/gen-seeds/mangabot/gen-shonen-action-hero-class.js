#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_hero_class.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SHONEN HERO CLASS entries — combat-archetype roles in Naruto / MHA / JJK / Bleach / Demon Slayer / DragonBall / HxH tradition.

Each entry: 12-22 words. Class + combat-domain + tone + signature visual cue.

VARIETY:
- 18% NINJA/SHINOBI (chakra-channeler / hidden-village shinobi / shadow-clone master / wind-style ninja)
- 16% SWORDSMAN (samurai-style swordsman / cursed-blade wielder / breathing-technique slayer / katana-master)
- 14% QUIRK/HERO (super-power hero / quirk-user MHA-style / vigilante / pro-hero rookie)
- 12% SORCERER/JUJUTSU (cursed-technique user / shikigami-summoner / sealed-domain expander / cursed-energy fighter)
- 10% MARTIAL ARTIST (chi-fighter / kung-fu master / dragonball-style ki-fighter / boxer-fighter)
- 8% SPIRIT-WARRIOR (zanpakuto-wielder / soul-reaper / shinigami / dead-apostle slayer)
- 8% ELEMENTAL (fire-bender / lightning-channeler / ice-wielder / wind-master)
- 6% EXORCIST/PRIEST (demon-slayer / yokai-hunter exorcist / shrine-priest combat)
- 4% MECH-PILOT (gundam-style mech pilot / EVA-style berserker)
- 4% MAFIA/RIOT (yakuza-style fighter / street-brawler with chains)

DO write:
- Chakra-channeling shinobi with hidden-village forehead-protector, wind-style summoner mid-jutsu
- Cursed-blade swordsman with crimson sealed katana, demon-slayer breathing-technique register
- Quirk-user pro-hero with explosion gauntlets, MHA-style hot-headed register, costume scratched
- Cursed-energy sorcerer with bandaged hands and floating shikigami crow, JJK-style register
- Ki-fighter martial artist with weighted gi torn at sleeves, dragonball-style power-up

DO NOT: copyrighted character names (Naruto/Goku/Tanjiro/Yuji — describe the archetype) / multiple classes per entry / non-combat roles.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

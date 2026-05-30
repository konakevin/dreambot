#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_archetype.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} MAGICAL-GIRL ARCHETYPE entries — anime magical-girl identity types in the Sailor Moon / Precure / Madoka Magica / Cardcaptor Sakura tradition.

Each entry: 12-22 words. Names archetype + power-domain + tone + signature visual.

VARIETY MANDATE:
- 18% CELESTIAL/COSMIC (sailor-moon-style star-warrior / moon-witch / sun-mage / constellation-priestess / galaxy-guardian / nebula-summoner)
- 16% ELEMENTAL (fire-mage / ice-witch / wind-priestess / earth-guardian / lightning-channeler / water-naiad / leaf-druid)
- 14% SUBCULTURAL (gothic dark-magical-girl / punk-rebel-witch / pastel-fairy / mature-onee-san / yandere-magical-girl / lolita-witch)
- 12% NATURE (forest-witch / animal-companion magical-girl / flower-maiden / spring-sprite / harvest-witch / mountain-priestess)
- 10% CARD/RITUAL (cardcaptor-style card-summoner / tarot-mage / rune-witch / sigil-binder / clow-card-collector)
- 8% IDOL (idol-stage magical-girl / song-spell singer / dance-magic / micro-performer)
- 8% MAGIC-COURT (royal-magical-princess / academy-prefect-witch / magical-knight / ceremonial-mage)
- 6% MASCOT-PAIR (fairy-companion magical-girl / talking-pet partner / pixie-bonded witch)
- 4% MECHA-HYBRID (mecha-pilot-magical-girl / magitech-engineer / cyber-mage)
- 4% PRECURE / TEAM (team-color-coded warrior — pink / blue / yellow / green / red / purple precure)

DO write:
- Sailor-moon-style star warrior with crescent-moon tiara, cosmic-power domain, peak-transformation pose
- Fire-mage magical-girl with flame-wreathed staff, scarlet ribbon-cape, fierce-determined register
- Gothic dark-magical-girl with raven feathers and obsidian-tipped wand, Madoka-style melancholy
- Forest-witch with leaf-crown and sapling staff, woodland-spirit companion at shoulder
- Cardcaptor-style card-summoner with key-pendant and clow-card mid-cast pose
- Idol-stage magical-girl with mic-wand and stage-glitter, mid-song-spell

DO NOT write:
- Generic "anime girl with sword" — must have MAGICAL identity
- Multiple archetypes per entry
- Specific copyrighted character names (Sakura / Usagi / Madoka / Homura — describe the archetype)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

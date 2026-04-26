#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ISEKAI FANTASY ANIME scene descriptions for MangaBot — fantasy-world anime moments. Mushoku Tensei / Konosuba / Re:Zero / Shield Hero / Overlord / Frieren energy. Medieval-fantasy through anime lens.

Each entry: 15-25 words. One specific isekai/fantasy anime scene with character archetype + fantasy setting.

━━━ CATEGORIES ━━━
- Guild hall (adventurer board, party formation, tankards, armor racks, quest scrolls)
- Magic academy (floating books, spell practice, crystal towers, robed students)
- RPG town square (cobblestone, potion shops, blacksmith smoke, adventurers passing)
- Dragon encounter (massive dragon eye, tiny adventurer, scale of beast, fire breath)
- Dungeon descent (torch-lit corridors, treasure chest, party in formation, monster ahead)
- Forest camp (campfire, bedrolls, starry sky, party resting, swords planted in ground)
- Royal court (fantasy throne room, adventurer summoned, stained glass, royal guards)
- Market district (potion stalls, magic items, exotic creatures, bustling fantasy bazaar)
- Boss battle (massive monster arena, party coordinating, magic circles, dramatic lighting)
- Tavern rest (warm inn, bard playing, adventurers eating, fireplace, armor on chair)

━━━ RULES ━━━
- Characters by ROLE (adventurer, mage, healer, swordsman, party leader) — NEVER named characters
- Medieval-fantasy + anime aesthetic fusion
- RPG-game-world energy without being literally a game UI

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

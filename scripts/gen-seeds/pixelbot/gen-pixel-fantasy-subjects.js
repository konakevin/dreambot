#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_fantasy_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PIXEL FANTASY SUBJECT descriptions for PixelBot's pixel-fantasy path — pixel fantasy scenes. Dragons, castles, wizards, elves, rune-stones. No IP.

Each entry: 15-30 words. One specific pixel fantasy subject/scene.

━━━ CATEGORIES ━━━
- Ancient dragon coiled on mountain-peak
- Wizard-tower with spiraling stair
- Elven treehouse with vine-lanterns
- Rune-stone circle at moonlight
- Knight crossing stone-bridge
- Castle on cliff-edge with banners
- Magic-crystal cavern with glowing gems
- Forest-sprite clearing with fireflies
- Dragon-egg nest on cliff-ledge
- Wizard-tower at storm
- Runic-gate in ancient forest
- Castle-ruins overgrown with vines
- Fairy-ring with mushroom-circle
- Enchanted library with floating books
- Dragon-rider mid-flight over mountains
- Underwater mermaid palace
- Wizard's study with crystal ball
- Enchanted forest with ancient oaks
- Magical portal activating
- Crystal-sword in stone (Excalibur-style)
- Ghost-ship in fog at sea
- Fae-glen with glowing mushrooms
- Phoenix nest on volcano-peak
- Unicorn in moonlit meadow
- Centaur clan at fire-circle
- Griffin on castle-parapet
- Kitsune-spirit in bamboo grove
- Alchemist's tower interior
- Druidic stone-circle at solstice
- Necromancer's crypt entrance
- Spectral wolf in misty forest
- Hobbit-style round-door cottage
- Elven-ship at harbor-dawn
- Witch-cauldron mid-potion
- Dragon-breath lighting up cave
- Knight-in-armor at throne-room
- Orcish encampment at dusk
- Gnome-village among mushrooms
- Mountain-troll cave-entrance
- Paladin at holy shrine
- Fairy-dance in meadow moonlight
- Shapeshifter mid-transform silhouette
- Serpent-god temple jungle
- Lich's ancient tome
- Djinn emerging from lamp

━━━ RULES ━━━
- No named IP characters
- Fantasy-genre scenes/subjects
- Pixel-art render-ready

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

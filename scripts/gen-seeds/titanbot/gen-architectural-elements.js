#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/architectural_elements.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} MYTHIC ARCHITECTURAL ELEMENT descriptions for TitanBot — architecture anchored to pantheons. Marble temple, ziggurat, pagoda, stone-circle, sacred-grove, rainbow-bridge.

Each entry: 10-20 words. One specific mythic architectural element.

━━━ CATEGORIES ━━━
- Marble temple with columns (Greek Parthenon-style)
- Ziggurat (Mesopotamian stepped pyramid)
- Pagoda (Japanese multi-tiered tower)
- Stone circle (Celtic Stonehenge-style)
- Sacred grove (Druid tree-circle with altar)
- Rainbow-bridge Bifrost (Norse)
- Egyptian obelisk (tall stone with hieroglyphs)
- Hindu shikhara temple (spired with carvings)
- Aztec stepped pyramid (Templo Mayor-style)
- Buddhist stupa (dome-topped shrine)
- Mayan temple with serpent-columns
- Chinese dragon-gate (ornate entrance)
- Japanese torii gate (red pillars)
- Viking longhouse (wooden hall with dragon-prow)
- Egyptian pylon (massive gate-towers)
- Aztec tzompantli (skull-rack wall)
- Celtic broch (round stone tower)
- African terra-cotta compound (Yoruba-style)
- Polynesian marae (sacred ceremonial platform)
- Mesopotamian ziggurat (seven-tiered)
- Shinto shrine (cedar torii + haiden)
- Jain temple (intricate marble)
- Incan stone-masonry wall (fitted stones)
- Minoan palace (labyrinth Knossos)
- Greek oracle-tripod (Delphi style)
- Norse altar (runestone with carvings)
- Shinto tsubo garden (stone-and-moss)
- Chinese imperial palace (gold-roofed)
- Buddhist wooden-pagoda (Japanese Horyuji)
- Aztec quetzalcoatl-pyramid
- Celtic passage-tomb entrance
- Hindu mandapa (pillared hall)
- African baobab-altar (tree-shrine)
- Egyptian sphinx-flanked avenue
- Slavic wooden-church onion-domes
- Russian-orthodox icon-screen
- Aztec-ball-court (I-shaped stone)
- Maya-ball-court with stone-rings
- Stone-henge lintel with moonlight
- Delphi oracle-chamber with tripod
- Zen-garden stone-and-raked-gravel

━━━ RULES ━━━
- Pantheon-specific architecture
- Painterly / renderable detail
- Visual anchor for scenes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

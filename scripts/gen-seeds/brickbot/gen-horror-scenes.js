#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/horror_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO HORROR scene descriptions for BrickBot. Creepy unsettling LEGO dioramas — fun-scary, not actually scary. The plastic makes it charming.

Each entry: 15-25 words. One specific horror scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Haunted house with glowing window pieces, crooked shutters, dead tree
- Graveyard with skeleton minifigs climbing from brick graves, full moon
- Abandoned amusement park, rusted ferris wheel, fog machines
- Creepy doll collection room, painted minifig heads on shelves
- Swamp cabin with transparent green ooze, tentacles from water
- Witch's cottage in dark forest, cauldron with transparent green bubble
- Vampire castle, coffin room, bat pieces, cobweb elements
- Mad scientist lab, lightning machine, monster on table
- Zombie horde shuffling through suburban neighborhood
- Ghost ship appearing from fog bank, spectral glow pieces

━━━ RULES ━━━
- Unsettling but clearly LEGO — the plastic makes it fun, not scary
- Low angles, deep shadows, fog, single eerie light source
- Transparent green for ooze/slime, transparent pieces for ghostly glow
- Minifigs frozen mid-scream or creeping forward
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/hedge_witch_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} HEDGE WITCH ACTION descriptions for FaeBot's hedge-witch path. Each entry is what a cottage witch is DOING in her daily craft — brewing, drying, gathering, tending, mixing. Dynamic freeze-frames of practical forest magic. SOLO.

Each entry: 10-20 words. A specific cottage-craft action.

━━━ CATEGORIES TO COVER ━━━
- Stirring a bubbling cauldron with a long wooden spoon, steam rising around her face
- Hanging fresh-cut herb bundles from the rafters to dry, reaching up on her toes
- Grinding dried roots in a stone mortar, powder dusting her stained fingers
- Pouring a glowing tincture through cheesecloth into a glass bottle
- Kneeling in the garden pulling weeds from between rows of medicinal herbs
- Reading a crumbling handwritten recipe book by candlelight, finger tracing the text
- Feeding a cluster of cats on the cottage doorstep from a wooden bowl
- Harvesting mushrooms from a fallen log at the forest edge, basket over her arm
- Bottling honey from her garden hives, golden streams pouring into jars
- Testing a potion by holding a drop to the light, examining its color
- Braiding dried flowers and herbs into a wreath at her work table
- Carrying an armload of firewood through the cottage door, cats weaving around her ankles

━━━ BANNED ━━━
- Sitting / lying passively / sleeping / reading quietly
- "Posing", "modeling", looking at the camera
- Casting dramatic magic spells (this is PRACTICAL cottage magic, not battle sorcery)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + craft material (herbs/potions/garden/fire/animals).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

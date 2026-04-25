#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_lore_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DRAGON LORE scene descriptions for DragonBot. Ancient evidence of dragons — bones, murals, relics, abandoned lairs. The dragons are GONE but their presence echoes everywhere. Archaeological mystery and lost grandeur.

Each entry: 15-25 words. One specific dragon-lore discovery scene.

━━━ SCENE TYPES (mix broadly across ALL) ━━━
- Massive skeletal remains: dragon skull half-buried in desert, ribcage arching over a valley, spine forming a natural bridge
- Ancient murals: cathedral-sized wall paintings depicting dragon wars, faded but magnificent
- Abandoned hoards: vast caverns of scattered gold and gems, dust-covered, untouched for centuries
- Fossilized eggs: clutch of petrified dragon eggs in volcanic nest, crystallized shells
- Dragon temples: ruined places of worship with dragon statues, altars, offerings
- Rider outposts: crumbling aeries on impossible cliffs, rotted saddles, rusted chains
- Bone weapons: forge where dragon bones were shaped into legendary swords, abandoned mid-craft
- Scale armor: chamber of shed dragon scales, iridescent, preserved by magic
- Dragon graveyards: place where dragons went to die, thousands of skeletons, sacred silence
- Petrified dragons: entire dragon turned to stone mid-flight or mid-roar, now a landmark
- Ancient libraries: scrolls and tomes cataloging dragon species, illustrated bestiaries
- Nesting grounds: scorched cliffsides with massive talon-gouges, empty nests

━━━ RULES ━━━
- Dragons are ABSENT — only their remains, artifacts, and legacy
- Scale of absence: everything is MASSIVE, dwarfing any human figures
- Optional tiny explorer/scholar figures for scale and sense of discovery
- Mood: wonder + melancholy + reverence, not horror
- No named dragons or locations
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

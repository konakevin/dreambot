#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/settings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} high-fantasy SETTING / ENVIRONMENT descriptions for a warrior's scene. Each is a specific evocative place with distinctive visual character.

Each entry: 12-25 words. Specific, atmospheric, D&D / Game of Thrones / Magic: the Gathering concept art energy.

━━━ CATEGORIES TO MIX ━━━
- Battlefield (mid-battle smoke, post-battle carnage, staging grounds, siege walls)
- Throne rooms (dark gothic, elven palace, orcish hall, dragon's hoard, pirate captain's quarters)
- Wilderness (ancient forest, frozen tundra, scorching desert, volcanic wastes, coral reef, thunder-steppe)
- Ruins (crumbling temples, overgrown cathedrals, sunken cities, mountain tombs, fallen kingdoms)
- Magical interiors (wizard's tower, spell-forge, ritual circle, arcane library, portal chamber)
- Planar / otherworldly (shadowfell, feywild, elemental plane, astral sea, abyss)
- Civilized (bustling market street, tavern back-alley, noble ball, gladiator pit, thieves' den)
- Ceremonial (coronation hall, sacrificial altar, druidic circle, dragon's meeting)
- Wild fantasy weather (thunderstorm, blood-moon, aurora, eldritch fog, frozen blizzard)
- Dragon-adjacent (cave of a sleeping dragon, dragon's perch, lava-and-hoard chamber)

━━━ RULES ━━━
- Specific enough to paint the setting
- Fantasy-appropriate (no modern or sci-fi elements)
- Backdrop scale (NOT overpowering the character)

━━━ BANNED ━━━
- Second figures in the setting description
- Generic "a forest" or "a cave" — always specific and atmospheric
- Named real-world places

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

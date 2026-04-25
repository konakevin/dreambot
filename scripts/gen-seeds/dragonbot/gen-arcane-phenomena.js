#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/arcane_phenomena.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ARCANE PHENOMENA descriptions for DragonBot — pure magical events happening in the landscape with NO characters. The magic erupts from the land itself: ancient ley-lines, stone circles, wild magic ruptures, artifacts detonating, rune-carved monuments igniting. 15-25 words each.

━━━ WHAT THESE ARE ━━━
Pure magical phenomena — no wizards, no mages, no casters. The land IS the source:
- Ancient stone circle igniting with crackling energy, ley-lines becoming visible rivers of light
- Rune-carved monolith splitting open, releasing caged magic that transforms the surrounding terrain
- Wild magic rupture tearing through untended landscape — rivers reversing, clouds flashing with runes
- Enchanted forest canopy erupting with golden light as ancient wards activate
- Ley-line nexus detonating at the intersection of three magical rivers
- Frozen artifact thawing and releasing centuries of stored power in a single blast
- Ancient portal tearing open in mid-air, otherworldly light pouring through
- Cursed battlefield where old magic still sparks and arcs between rusted weapons
- Crystal formation deep underground resonating and amplifying, casting prismatic beams
- Volcanic vent releasing magical pressure, the lava itself glowing with runes

━━━ DEDUP: PHENOMENON TYPE ━━━
No two entries should describe the same type of magical event. Vary broadly:
- Eruptions, detonations, activations, awakenings, ruptures, convergences, resonances, ignitions, releases, surges, collapses, inversions, blooms

━━━ DEDUP: MAGIC COLOR ━━━
Vary the dominant color of the magic across entries — no more than 2 of any single color:
gold/amber, violet/purple, emerald/green, sapphire/blue, crimson/red, white/silver, teal, prismatic, obsidian-with-glow, ice-blue, poison-green, rose/pink

━━━ RULES ━━━
- NO characters — no wizards, mages, sorcerers, people of any kind
- NO locations — describe only the phenomenon itself, location comes from another pool
- The magic transforms its surroundings: rocks lift, water glows, air shimmers, ground cracks
- Each phenomenon is a CLIMAX moment — ancient, massive, awe-inducing

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

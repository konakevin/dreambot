#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/succubus_settings.json',
  total: 50,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SUCCUBUS SETTING descriptions for SirenBot's succubus path. Gothic, infernal, darkly beautiful environments where a demonic heroine would dwell or fight.

Each entry: 10-20 words. A specific gothic/infernal environment.

━━━ CATEGORIES TO COVER ━━━
- Ruined gothic cathedral with shattered stained glass, moonlight on cracked altar stone
- Obsidian throne room with ember-veined walls and floating candelabras
- Midnight cemetery with iron gates, leaning headstones, ground mist
- Volcanic glass cavern with magma rivers casting crimson light on black walls
- Crumbling castle parapet overlooking burning countryside at dusk
- Underground temple with inverted crosses and pools of dark water
- Fog-choked forest clearing with standing stones and a sacrificial altar
- Gothic library with forbidden texts, chains on shelves, guttering black candles
- Collapsed bridge over a hellfire chasm, brimstone smoke rising
- Baroque opera house in ruins, velvet curtains shredded, chandelier fallen
- Moonlit rooftop garden of thorned black roses and shattered statuary
- Iron dungeon with chains and arcane sigils glowing on the walls

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: location type + light source + atmosphere (sacred/profane/ruined/opulent).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

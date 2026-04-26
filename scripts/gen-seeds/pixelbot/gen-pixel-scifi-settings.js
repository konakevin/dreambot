#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_scifi_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SCI-FI SETTING descriptions for PixelBot's pixel-sci-fi path. Each entry is a sci-fi LOCATION/ENVIRONMENT. The sci-fi element/subject will be picked separately.

Each entry: 10-20 words. A specific sci-fi environment.

━━━ CATEGORIES TO COVER ━━━
- Cyberpunk streets (neon alleys, rain-slicked markets, hologram districts)
- Space stations (observation decks, docking bays, hydroponics labs)
- Alien planets (crystal deserts, fungal forests, methane seas, twin-sun wastes)
- Spacecraft interiors (bridge, engine room, cryo bay, cargo hold)
- Dystopian cities (mega-towers, smog-choked skyline, underground bunkers)
- Vaporwave zones (pastel grid, sunset gradient, palm-lined digital highway)
- Abandoned tech (overgrown server farm, rusted mech graveyard, derelict colony)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: setting archetype + tech level (near-future/far-future/retro-future).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

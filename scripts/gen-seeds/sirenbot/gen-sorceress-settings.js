#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/sorceress_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SORCERESS SETTING descriptions for SirenBot's sorceress path. Magical sanctums, arcane laboratories, mystical locations where raw magical energy is palpable.

Each entry: 10-20 words. A specific magical environment.

━━━ CATEGORIES TO COVER ━━━
- Tower laboratory with floating alchemical apparatus and glowing reagents
- Ancient library with books that open themselves and ink that moves
- Arcane circle chamber with glowing floor runes and hovering crystals
- Astral observatory with a transparent ceiling showing impossible star patterns
- Potion workshop with bubbling cauldrons, hanging herbs, colored smoke
- Ley line nexus where visible energy streams converge at a stone altar
- Enchanted garden where magical plants grow in impossible geometries
- Crystal sanctum inside a geode, every surface refracting prismatic light
- Storm-caller's rooftop platform during a controlled lightning ritual
- Dimensional rift chamber with tears in reality showing other worlds
- Underwater magical dome, arcane energy holding back the ocean
- Sacred grove where the veil between worlds is thin, reality shimmering

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: magic discipline + environment type (interior/exterior) + dominant element.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

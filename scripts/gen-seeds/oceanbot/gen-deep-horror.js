#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/deep_horror.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TERRIFYING DEEP SEA descriptions for OceanBot. These are DREAD and AWE — nightmare creatures at crushing depths, massive silhouettes in void-black water, alien anatomy that shouldn't exist.

Each entry: 15-25 words. One specific deep-sea horror.

━━━ CATEGORIES (mix across all) ━━━
- Anglerfish with glowing lures illuminating rows of needle teeth in pitch black
- Massive silhouettes barely visible in void-black water, scale incomprehensible
- Gulper eels with impossibly wide jaws unhinging in the darkness
- Viperfish with translucent fangs longer than their skulls
- Giant isopods crawling across the abyssal plain
- Colossal squid with rotating hooks on tentacles in deep black
- Fangtooth fish with the largest teeth-to-body ratio, nightmare proportions
- Barreleye fish with transparent dome skulls and upward-staring eyes
- Black swallower consuming prey twice its size, distended stomach visible
- Goblin shark extending its jaw forward like a spring-loaded trap
- Frilled shark emerging from depth with prehistoric rows of teeth
- Massive unknown shapes passing just beyond visibility in the abyss

━━━ RULES ━━━
- DREAD and AWE — these should unsettle and fascinate
- Emphasize darkness, crushing depth, alien anatomy, impossible scale
- Specific creatures and behaviors, not generic "scary fish"
- No repeats — every entry a unique deep-sea nightmare
- Vivid, visceral language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/royal_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ROYAL MERMAID ACTION descriptions for MermaidBot's mermaid-royal path. Each entry is what a mermaid queen or princess is DOING in her palace. Regal, powerful, commanding. Dynamic freeze-frames.

Each entry: 10-20 words. A specific regal action.

━━━ CATEGORIES TO COVER ━━━
- Descending the grand staircase with crown gleaming, trailing a luminous wake
- Examining a glowing artifact brought by deep-sea emissaries
- Commanding ocean currents with an outstretched hand, water bending to her will
- Placing a crown of living coral onto her own head before a mirror
- Sweeping through palace corridors with royal guards of armored seahorses
- Arranging treasures in the pearl vault, each piece placed with precision
- Addressing her court from the throne, trident resting across her lap
- Studying ancient scrolls of ocean magic in the royal library
- Releasing a school of messenger fish from a balcony overlooking the kingdom
- Blessing a coral garden with a touch that makes it bloom with light

━━━ BANNED ━━━
- Sitting / lying passively / watching quietly
- "Posing", "modeling"
- Second mermaid/merman figures

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + prop/object involved.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

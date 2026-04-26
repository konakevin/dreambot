#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/siren_moments.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SIREN MOMENT descriptions for MermaidBot's mermaid-siren path. Each entry is a specific seductive/dangerous moment a siren is caught in. SOLO — no second figure visible.

Each entry: 15-25 words. A specific charged moment.

━━━ CATEGORIES TO COVER ━━━
- Singing with head tilted back, voice carrying across the fog
- Dragging fingers through moonlit water, watching ripples spread
- Combing wet hair with a bone comb on a sea-slicked rock
- Emerging from a wave crest, water cascading off her shoulders
- Reclining on barnacle-covered rocks, tail curled beneath her
- Trailing a hand through phosphorescent tide, leaving glowing streaks
- Perched at the edge of a tidal pool, studying her reflection
- Arching backward over a rock, hair trailing into the surf
- Collecting shells and sailor's trinkets, examining a pocket watch
- Whispering into a conch shell, lips barely touching the rim

━━━ BANNED ━━━
- Sitting passively / lying flat / watching / meditating (dynamic freeze-frames only)
- Second figures, sailors, ships with crew
- "Posing", "modeling", "camera"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + body position.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/vampire_moments.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE MOMENT descriptions for SirenBot's vampire-queen path. Each entry is what an ancient vampire queen is DOING in her domain — going about her nocturnal existence, unaware of being observed. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific nocturnal vampire activity.

━━━ CATEGORIES TO COVER ━━━
- Descending a grand staircase, one hand trailing along the stone banister
- Turning the page of an ancient grimoire by candlelight, eyes scanning
- Pouring dark wine from a crystal decanter into a goblet
- Standing at a balcony railing, wind catching her cloak, surveying her domain
- Running her fingertips along a row of dusty portrait frames
- Extinguishing candles one by one as she moves down a corridor
- Adjusting a jeweled choker in a mirror that shows no reflection
- Opening heavy castle doors to step into the moonlit courtyard
- Ascending a spiral staircase in a tower, torchlight flickering below
- Pulling on leather gloves before leaving for the night, methodical
- Examining a faded letter by firelight, expression unreadable
- Sharpening her nails on a whetstone with casual, practiced strokes

━━━ BANNED ━━━
- Biting / feeding / blood drinking (too on-the-nose)
- Sitting / lying passively / sleeping in coffin
- "Posing", "modeling", looking at the camera
- Second figures / victims

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + prop involved.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/vampire_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE SETTING descriptions for SirenBot's vampire-queen path. Gothic architecture, aristocratic decay, nocturnal environments — castles, cathedrals, crypts, moonlit estates.

Each entry: 10-20 words. A specific gothic vampire environment.

━━━ CATEGORIES TO COVER ━━━
- Grand ballroom with dust-covered chandeliers and cracked marble floor
- Castle tower study lined with ancient books and guttering candles
- Crypt with ornate stone sarcophagi and flickering torchlight
- Gothic cathedral nave with moonlight through stained glass
- Overgrown courtyard garden at midnight, dead fountain, climbing roses
- Wine cellar with vaulted ceiling, cobwebs, and rows of dusty bottles
- Balcony overlooking a fog-shrouded valley under a blood moon
- Ruined abbey with collapsed roof, moonlight pouring through gaps
- Mirror gallery with tarnished frames and her reflection absent
- Victorian parlor with velvet furniture, fireplace, heavy drapes drawn
- Underground passage with torch sconces and carved stone walls
- Rooftop of a gothic spire overlooking a sleeping medieval city

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: room type + light source + decay level (pristine/aged/ruined).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

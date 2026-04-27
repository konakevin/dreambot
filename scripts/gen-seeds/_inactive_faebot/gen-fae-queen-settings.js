#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/fae_queen_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FAE QUEEN SETTING descriptions for FaeBot's fae-queen path. Otherworldly fairy courts, hollow hills, glamour-warped spaces — where the Sidhe hold power.

Each entry: 10-20 words. A specific fae court environment.

━━━ CATEGORIES TO COVER ━━━
- Throne room inside a hollow hill, walls of living root and crystal
- Fairy ring clearing at midnight, the grass inside greener than possible
- Great hall with pillars of twisted ancient trees, ceiling of woven branches
- Mirror pool that shows other times instead of reflections
- Crossroads where three forest paths meet under an ancient oak
- Moonlit glade where reality shimmers and the background shifts like a mirage
- Underground palace carved from crystal and living stone, lit by trapped starlight
- Bridge of woven moonbeams spanning a bottomless gorge
- Enchanted orchard where the fruit glows and time moves differently
- Ruined stone circle reclaimed by the forest, power still humming in the stones
- Lakeside pavilion of spider silk and silver, reflected perfectly in still water
- Boundary between mortal forest and fae realm, reality visibly splitting

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: location type + glamour intensity + above/underground.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

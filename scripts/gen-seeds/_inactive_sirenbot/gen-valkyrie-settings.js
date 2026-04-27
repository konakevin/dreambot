#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/valkyrie_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} VALKYRIE SETTING descriptions for SirenBot's valkyrie path. Battlefields, Nordic landscapes, divine realms, Valhalla-adjacent environments — where warrior goddesses carry out their duties.

Each entry: 10-20 words. A specific valkyrie environment.

━━━ CATEGORIES TO COVER ━━━
- Battlefield at dawn, mist rising from trampled ground, broken weapons scattered
- Mountain peak above a thunderstorm, lightning illuminating clouds below
- Great hall of Valhalla with massive wooden beams and eternal hearth-fires
- Fjord cliff edge overlooking a longship fleet on dark water
- Snow-covered Nordic forest with ancient runestones and wolf tracks
- Bifrost bridge (rainbow energy bridge) spanning an impossible void
- Armory of the gods with legendary weapons mounted on golden racks
- Funeral pyre on a cliff overlooking the sea at sunset
- Open sky mid-flight, vast cloudscape stretching to every horizon
- Ruined stone temple on a windswept hilltop, offerings left at the altar
- Northern coastline with massive waves crashing against granite cliffs
- Training grounds of divine warriors, scarred earth and weapon-scored posts

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: location type + weather + mythological vs. earthly.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/fae_queen_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FAE QUEEN ACTION descriptions for FaeBot's fae-queen path. Each entry is what the Queen of the Sidhe is DOING in her court — ruling, enchanting, manipulating reality. Regal, terrifying, ancient. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific fae royalty action.

━━━ CATEGORIES TO COVER ━━━
- Weaving glamour between her fingers, reality rippling like water around her hands
- Walking through her court as invisible musicians play, the air itself bending around her
- Examining a mortal's stolen memory in a glass sphere, turning it slowly
- Growing a crown of living thorns directly from her own scalp
- Gesturing and the forest rearranging itself — trees stepping aside to clear a path
- Tasting a single drop of morning dew from a golden thimble
- Judging a captured intruder from her throne, expression utterly unreadable
- Transforming a dead bird back to life with a whisper into its feathers
- Spinning moonlight into thread on a silver wheel
- Dissolving into mist at the edge of her domain, reforming deeper in the forest
- Placing a curse by pressing her thumb to a sleeping creature's forehead
- Watching her reflection in a pool that shows her true age — ancient, vast

━━━ BANNED ━━━
- Sitting passively / idle / sleeping
- "Posing", "modeling", looking at the camera
- Second sentient figures

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + magic type (glamour/transformation/nature-control).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

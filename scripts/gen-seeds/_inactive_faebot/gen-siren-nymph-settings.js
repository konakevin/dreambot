#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/siren_nymph_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SIREN NYMPH SETTING descriptions for FaeBot's siren-nymph path. INTIMATE, warm, enclosed spaces — a nymph's bower, her bedroom made of living forest, hot springs, moonlit pools, canopy nests. These are places where a forest creature would lure someone. Sensual atmosphere, warm lighting, private.

Each entry: 10-20 words. A specific intimate forest environment.

━━━ CATEGORIES TO COVER ━━━
- Bower woven from living willow branches, soft moss floor, filtered golden light, flower petals scattered
- Natural hot spring steaming in a forest clearing, warm mist, smooth stones, fern-draped edges
- Canopy nest of woven branches and soft moss high in an ancient tree, dappled light below
- Hollow inside a massive tree trunk, walls covered in soft bioluminescent moss, warm and enclosed
- Moonlit forest pool fed by a gentle waterfall, silver light, smooth rocks for reclining
- Bed of thick moss and wildflowers at the base of an ancient oak, sheltered by roots
- Cave behind a waterfall, warm and dry inside, light filtering through the water curtain
- Sunlit clearing with a single massive flat stone warmed by afternoon sun, surrounded by tall grass
- Hammock of woven vines strung between two trees, swaying gently, petals falling around it
- Grotto of hanging wisteria and jasmine, the scent thick in the air, soft purple light
- Forest floor carpeted in deep soft moss, shafts of warm golden light through the canopy above
- Bank of a warm stream, smooth river stones, steam rising where warm water meets cool air

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: enclosure type (bower/spring/cave/canopy/ground) + light quality (golden/silver/bioluminescent/warm).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

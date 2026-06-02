#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_landscape_setting.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} LANDSCAPE SETTING entries for a MangaBot ghibli-countryside keyframe. Each entry is the SPECIFIC RURAL-JAPAN BIOME that wraps the scene.

Each entry: 12-22 words. ONE specific rural landscape.

BIOME VARIETY (distinct landscapes — vary widely):
- Terraced rice-paddy hills (Echigo / Shikoku-style stepped emerald paddies)
- Cottage village outskirts (thatched-roof cluster nestled in green valley)
- Forest-edge meadow (where deep cedar forest meets bright wildflower field)
- Mountain foothills (rolling slopes climbing to misty peaks)
- Coastal countryside (windswept cliffs above blue sea, salt-air)
- Tea-field hillside (rows of tea-bushes climbing slope, harvesters distant)
- Bamboo-grove edge (tall green-cream culms transitioning to open field)
- Mountain pass / valley road (stone road winding through forested ravine)
- Riverbank pastoral (slow stream meandering through grass meadow)
- Wildflower meadow (knee-high wildflowers in every color across a vast field)
- Cedar-forest interior (deep dappled shade with carpet of ferns)
- Lake-edge village (small wooden houses around mountain lake)
- Cherry-blossom valley (pink-petal hillsides in full bloom)
- Wisteria-vine pergola lane (lavender-draped rural pergola path)
- Iris-pond garden (purple iris beds beside reedy pond, koi visible)
- Highland tea-house garden (mountain plateau with formal garden)
- Persimmon-orchard hillside (autumn orange-fruit trees across slope)
- Apple / pear orchard (blooming or fruit-laden orchards)
- Hay-meadow late summer (drying haystacks in golden field)

DO write (each distinct):
- Echigo-style terraced rice-paddies stepping up the hillside, water-mirror panels reflecting sky
- Cottage village outskirts with thatched-roof cluster nestled in a green valley, smoke from chimneys
- Forest-edge meadow where deep cedar forest meets a bright wildflower field, dappled boundary
- Coastal countryside with windswept cliffs above blue sea, gulls wheeling in the salt-air
- Tea-field hillside with neat rows of green tea-bushes climbing the slope, distant harvesters
- Bamboo-grove edge transitioning from tall green-cream culms to open wildflower meadow
- Cherry-blossom valley with pink-petal hillsides in full bloom, drifting blossom-rain

DO NOT write:
- Architectural anchors (separate axis)
- Specific weather / light / characters (separate axes)
- Urban / cyberpunk / industrial
- Foreign-country landscapes (Europe / America / etc. — rural JAPAN specifically)
- Dramatic apocalyptic / fantasy landscapes
- Modern infrastructure (paved roads / power lines / cars)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

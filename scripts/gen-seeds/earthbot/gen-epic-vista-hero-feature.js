#!/usr/bin/env node
/**
 * EarthBot epic-vista — HERO_FEATURE axis (the ONE scale-anchor).
 *
 * One scale-proving element per render that makes the landscape's
 * monumental scale READABLE. NO humans (bot rule). Wildlife dots,
 * natural foreground anchors, or distant geographic micro-objects.
 *
 * This axis is what separates a "pretty landscape" from a "this is
 * BIG" landscape — the lone tree dwarfed by cliff face, the eagle
 * thermal-soaring as a speck against the rock wall, the boat-dot in
 * the fjord. One scale prover per render is enough.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_hero_feature.json',
  total: 150,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} HERO FEATURE entries for EarthBot epic-vista — each entry names ONE scale-proving element that anchors the monumental scale of the landscape.

━━━ THE BAR ━━━

A great landscape photograph has ONE element that proves the bigness — a lone tree dwarfed by the cliff, an eagle thermal-soaring as a speck against the rock wall, a coin-sized boat in the deep fjord, a single weathered cairn at the ridge crest. Each entry should be that ONE element.

━━━ FORMAT (NON-NEGOTIABLE) ━━━

Each entry: 12-22 words. Describe:
- The specific element (lone tree / eagle / herd / boulder / cairn / ribbon waterfall / etc.)
- Its size IMPLICATION (ant-tiny / postage-stamp small / coin-sized / dot-tiny against vastness)
- Position cue (clinging to cliff edge / soaring against rock face / crossing the valley floor / in the deep middle distance)
- Optional natural detail (weathered / wind-bent / iron-grey / etc.)

ONE element per entry. NEVER stack multiple wildlife or features ("an eagle AND a goat AND a herd of caribou"). One scale prover only.

━━━ EXAMPLES ━━━

✓ "A single wind-bent subalpine tree clinging to a cliff edge, ant-tiny against the cathedral cliff face behind"
✓ "Two soaring bald eagles riding thermal updrafts against the cliff face, dot-tiny specks at vista scale"
✓ "A scattered herd of caribou crossing the wide valley floor, postage-stamp-sized at the panoramic vantage"
✓ "A thread-thin ribbon waterfall barely visible against a thousand-foot cliff, vertical needle of white"
✓ "A handful of mountain goats traversing a high scree slope, marker-dots-tiny against the talus"
✓ "A lone weathered cairn at the ridge crest, fist-sized at this distance, geological scale prover"
✓ "A single dramatic foreground boulder larger than a house, lichened, anchoring the depth"
✓ "A solitary V-formation of geese crossing the frame at altitude, distance pinpricks"
✓ "A single fishing boat in the deep fjord below, coin-sized at this height, proving the cliff drop"
✓ "A bend of moss-bright creek cutting through the foreground meadow, anchoring the near plane"

✗ BAD — stacks wildlife: "An eagle, a goat, and a herd of caribou all visible at once"
✗ BAD — too big: "A massive grizzly bear in the foreground" (loses the scale-prover function — bear becomes the subject)
✗ BAD — adds lighting: "A lone tree backlit by golden hour" (lighting goes in lighting axis)
✗ BAD — adds people: "A hiker silhouetted on the ridge" (NO PEOPLE — bot rule)

━━━ CATEGORY DISTRIBUTION ━━━

- ~40% Wildlife scale provers (eagle / hawk / goat / sheep / caribou / wolves / bear-far / deer / horses / geese / cormorants)
- ~30% Lone natural foreground anchors (weathered tree / driftwood / boulder / cairn / mossy stump / wildflower clump / lone juniper)
- ~20% Distant geographic micro-objects (thread-thin waterfall / coin-sized lake / pinprick mountain hut visible / boat-dot)
- ~10% Mid-frame botanical anchors (twisted ancient bristlecone pine / wind-sculpted cypress / single rhododendron in bloom)

━━━ HARD BANS ━━━

- NO HUMANS, NO HIKERS, NO CLIMBERS, NO SILHOUETTES (bot rule)
- NO stacked wildlife or features per entry
- NO sci-fi / fantasy / magical creatures
- NO bioluminescent / glowing wildlife (sci-fi drift)
- NO "Pandora"-style imagined creatures — real Earth fauna only
- Wildlife stays SMALL — never dominates the frame; this is a scale-prover axis, not a subject axis

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

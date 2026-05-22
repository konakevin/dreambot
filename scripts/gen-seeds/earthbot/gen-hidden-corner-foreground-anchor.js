#!/usr/bin/env node
/**
 * EarthBot hidden-corner — FOREGROUND ANCHOR axis.
 *
 * The close-camera detail at the bottom of the frame anchoring the
 * intimate composition. Mossy stones, fern fiddleheads, fallen log,
 * lily pads, pebble carpet, mushroom cluster.
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/hidden_corner_foreground_anchor.json';
// Append mode — scale R0 50-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} FOREGROUND ANCHOR entries for EarthBot hidden-corner. Each entry names ONE specific close-camera detail at the bottom of the frame — the eye-entry point of the intimate composition. Real Earth ONLY.

━━━ THE BAR — CLOSE-CAMERA TIGHT FG DETAIL ━━━

A specific tight foreground element at the bottom of the frame — moss-covered stones, fern fiddleheads emerging from leaf litter, lily pads at the water's edge, mushroom cluster on a log, dew-soaked pebbles, fallen rust-colored leaves on wet stone. NOT wide ground-plane — a specific tight element.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "description": "<foreground anchor element, 14-25 words>" }

Bare strings acceptable.

━━━ FG ANCHOR TYPES (vary across these) ━━━

- MOSSY STONES — emerald-moss-carpeted boulders / pebbles / cobbles at the frame's bottom edge
- FERN FIDDLEHEADS — tightly coiled emerging fronds in clusters, often with leaf-litter base
- FALLEN LEAVES — wet rust-orange / amber / crimson leaves carpeting the foreground stone
- MUSHROOM CLUSTERS — small fungi groups at the base of mossy logs / rocks
- WATER LILY PADS — floating round leaves with droplet beading at the foreground water edge
- WET STONE PATCHES — slick water-darkened stones reflecting overhead light
- DEW-SOAKED MOSS — close-camera moss carpet glistening with morning droplets
- PEBBLE CARPET — water-smoothed pebbles at a stream bank or pond edge
- LICHEN PATCHES — colorful lichen crusts (chartreuse / orange / pale-mint) on stone
- FALLEN LOG SECTION — mossy log close-camera, with growth on its surface
- TWISTED ROOT CLUSTER — exposed gnarled roots wrapped in moss, anchoring the FG
- WILDFLOWER CLUSTER — small flowering plants at the frame's bottom edge

━━━ EXAMPLES ━━━

✓ { "description": "Emerald-moss-carpeted boulders dominating the lower frame, slick water-darkened patches catching the dappled light from above" }

✓ { "description": "Cluster of fiddlehead-fern fronds tightly coiled and emerging from a thick carpet of damp leaf-litter at the close foreground" }

✓ { "description": "Rust-amber fallen maple and oak leaves carpeting wet stones at the foreground edge, water droplets beading on every leaf surface" }

✓ { "description": "Group of small chestnut-cap mushrooms clustered at the base of a mossy fallen log dominating the lower-left foreground" }

✓ { "description": "Water lily pads floating at the foreground pond edge with droplet-beaded surfaces and slender lily-stem stalks reaching down into the dark water below" }

━━━ ABSOLUTELY BANNED ━━━

- Wide panorama (this is a TIGHT close-camera FG)
- Sci-fi / fantasy / bioluminescent / aurora
- Architecture / cabin / fence / path
- Humans / footprints / clothing
- Vague language ("rich foreground") — name specific element
- Single bare item without context (always tie to setting context)
- "Fire" as a noun

━━━ OUTPUT ━━━

JSON array of ${n} entries. ONE specific FG anchor per entry. Real-Earth, close-camera, intimate scale. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

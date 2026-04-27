#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/fairy_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FAIRY ACTION descriptions for FaeBot's fairy path. Each entry is what a TINY fairy (3-6 inches tall) is DOING at miniature scale. Everything around her is enormous. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific miniature-scale fairy action.

━━━ CATEGORIES TO COVER ━━━
- Riding a bumblebee in flight, holding onto its fur with both hands
- Pushing a dewdrop off a leaf edge, watching it fall like a boulder
- Sewing a dress from a single rose petal using a thorn needle
- Sword-fighting a beetle with a thorn blade, wings flared for balance
- Carrying a single blueberry that weighs as much as she does
- Sliding down a blade of grass like a slide, sparks trailing behind
- Painting patterns on a butterfly's wing with a pollen-dipped brush
- Hammering a tiny door into a mushroom stem with an acorn-cap mallet
- Diving headfirst into a flower to gather pollen, legs kicking above
- Hanging upside down from a spider silk thread, examining a leaf
- Catching a falling raindrop in her arms, staggering under its weight
- Lighting a firefly lantern by whispering to it in her cupped hands

━━━ BANNED ━━━
- Sitting / lying passively / sleeping
- "Posing", "modeling", looking at the camera
- Normal human-scale activities

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + interaction partner (insect/plant/water/object).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

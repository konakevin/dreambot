#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_signature.json',
  total: 50,
  batch: 18,
  metaPrompt: (n) => `Write ${n} ICONIC JAPANESE-POND SIGNATURE elements for a kawaii koi-pond scene. Each entry is ONE specific pond/garden prop that anchors the aesthetic.

Each entry: 10-18 words. ONE specific element.

DO write:
- A glowing lotus-lantern floating on the pond water
- A mossy stepping-stone partly submerged at the pond's edge
- A wide floating lily-pad with a pink lotus-bloom centered on it
- A weathered stone-toro-lantern with mossy base beside the pond
- A small wooden arched bridge crossing the pond's edge
- A bamboo wind-chime hanging from a low branch
- A cluster of smooth river-rocks of varied sizes at the pond's edge
- A tiny paper-lantern strung from a low wisteria branch
- A small wooden tea-bench at the pond's edge
- A bamboo fountain water-spout dripping into the pond
- A miniature pagoda-figurine standing among the rocks
- A floating pink lotus-blossom in full bloom on the water
- A stone-bowl water-basin (tsukubai) at the pond's edge
- A bamboo-rake propped against a stone-lantern
- A wooden-tray of paper-folded-cranes floating gently on water
- A bonsai-tree in a clay pot at the pond's edge
- A small bell hanging from a stone post nearby
- A koi-feeding wooden ladle resting on a stone
- A bundle of bamboo-reeds at the pond's edge
- A small carved-stone Buddha-figurine partially mossy

DO NOT write:
- Modern objects (phones, electronics)
- Real text / kanji labels
- Foreground creatures (separate axis)
- Whole-landscape descriptions (separate axis)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

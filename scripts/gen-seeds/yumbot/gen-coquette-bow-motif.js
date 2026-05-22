#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_bow_motif.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} FEATURED BOW / RIBBON arrangement descriptions for a kawaii coquette food-party scene. Each entry is ONE specific hero bow/ribbon arrangement that anchors the coquette signature.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY.

Each entry: 12-22 words. ONE specific bow/ribbon arrangement.

DO write:
- A giant pink satin bow tied around the centerpiece cake with cascading streamers
- A cascade of pink ribbon-streamers flowing across the scene like a waterfall
- A pink-and-lavender bow-bouquet tied with pearl-ribbon
- A pink satin bow-banner strung above the scene reading "PARTY" in soft-cursive
- A cluster of three pink satin bows in cascading sizes — small, medium, large
- A pink-velvet ribbon spool unrolling across the tabletop in a curl
- A pink-pearl-tied ribbon-rosette pinned to the centerpiece
- A pink-tulle bow-pouf the size of a fist nestled beside the cake
- A pink ribbon-streamer wrapped around the entire scene like a frame
- A pink satin-bow chair-back-tie cascading down the side
- A cluster of pink mini-bows scattered like confetti across the surface
- A pink satin bow-cake-topper with pearl-bead centerpiece
- A pink-ribbon-garland strung in cheerful arcs above the scene
- A pink-tulle-rosette bow-cluster centered on a pearl-stand
- A pink-velvet ribbon-rope tied in a giant bow at one corner
- A pink-and-lavender ribbon-twist braid wrapping around the cake
- A pink-satin bow-cluster with seven bows of varied sizes piled artfully
- A pink-pearl-ribbon-rope wrapped twice and tied in a generous bow
- A cascading pink ribbon-curtain hanging behind the centerpiece
- A pink-tulle-bouquet tied with a giant satin-bow at its base

DO NOT write:
- Any colors outside pink / lavender / white / soft purple
- Modern objects
- Foods / characters (separate axis)
- Whole-scene descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
